package com.mesbg.listbuilder.armies.roster.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import com.mesbg.listbuilder.TestContainersConfiguration;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import jakarta.persistence.EntityManager;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestContainersConfiguration.class)
class RosterRepositoryTest {

  @Autowired private RosterRepository rosterRepository;

  @Autowired private EntityManager entityManager;

  private RosterPersistenceTestFixture fixture;

  @BeforeEach
  void setUp() {
    fixture = new RosterPersistenceTestFixture(entityManager);
  }

  @Test
  void findsRosterOwnedByUser() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    var roster = fixture.roster(owner, "Mordor", null);

    fixture.flushAndClear();

    assertThat(rosterRepository.findByIdAndUserId(roster.getId(), owner.getId())).isPresent();
    assertThat(rosterRepository.findByIdAndUserId(roster.getId(), otherUser.getId())).isEmpty();
  }

  @Test
  void listsOnlyRostersOwnedByUser() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    fixture.roster(owner, "Mordor", null);
    fixture.roster(owner, "Isengard", null);
    fixture.roster(otherUser, "Rohan", null);

    fixture.flushAndClear();

    var result = rosterRepository.findAllByUserIdOrderByUpdatedAtDesc(owner.getId());

    assertThat(result)
        .extracting(RosterEntity::getName)
        .containsExactlyInAnyOrder("Mordor", "Isengard");
  }

  @Test
  void ordersRostersByUpdatedAtDescending() {
    var owner = fixture.user("owner");

    var older = fixture.roster(owner, "Older roster", null);
    var newer = fixture.roster(owner, "Newer roster", null);

    entityManager.flush();

    // Make ordering deterministic rather than depending on clock timing.
    entityManager
        .createNativeQuery(
            """
            update rosters
            set updated_at = '2026-01-01 12:00:00.000000'
            where id = :id
            """)
        .setParameter("id", older.getId())
        .executeUpdate();

    entityManager
        .createNativeQuery(
            """
            update rosters
            set updated_at = '2026-01-02 12:00:00.000000'
            where id = :id
            """)
        .setParameter("id", newer.getId())
        .executeUpdate();

    entityManager.clear();

    var result = rosterRepository.findAllByUserIdOrderByUpdatedAtDesc(owner.getId());

    assertThat(result)
        .extracting(RosterEntity::getName)
        .containsExactly("Newer roster", "Older roster");
  }

  @Test
  void detectsRosterInGroupForUser() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    var group = fixture.group(owner, "Tournament", null);

    fixture.roster(owner, "Mordor", group);

    fixture.flushAndClear();

    assertThat(rosterRepository.existsByGroupIdAndUserId(group.getId(), owner.getId())).isTrue();

    assertThat(rosterRepository.existsByGroupIdAndUserId(group.getId(), otherUser.getId()))
        .isFalse();
  }

  @Test
  void persistsRosterMetadataAndTags() {
    var owner = fixture.user("owner");

    var roster = fixture.roster(owner, "Mordor", null);
    roster.setPointsLimit(750);
    roster.getTags().addAll(Set.of("Tournament", "750pts"));

    fixture.flushAndClear();

    var persisted = rosterRepository.findById(roster.getId()).orElseThrow();

    assertThat(persisted.getName()).isEqualTo("Mordor");
    assertThat(persisted.getArmyListId()).isEqualTo("test-army-list");
    assertThat(persisted.getPointsLimit()).isEqualTo(750);
    assertThat(persisted.getTags()).containsExactlyInAnyOrder("Tournament", "750pts");
  }

  @Test
  void deletingRosterDeletesOwnedWarbandsAndUnits() {
    var owner = fixture.user("owner");

    var roster = fixture.roster(owner, "Mordor", null);
    var warband = fixture.warband(roster, 0);
    var unit = fixture.unit(warband, "witch-king", 1, true, 0, Set.of("horse"));

    fixture.flushAndClear();

    var rosterId = roster.getId();
    var warbandId = warband.getId();
    var unitId = unit.getId();

    var persistedRoster = rosterRepository.findById(rosterId).orElseThrow();

    rosterRepository.delete(persistedRoster);
    entityManager.flush();
    entityManager.clear();

    assertThat(entityManager.find(RosterEntity.class, rosterId)).isNull();

    assertThat(
            entityManager.find(
                com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity.class,
                warbandId))
        .isNull();

    assertThat(
            entityManager.find(
                com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity.class,
                unitId))
        .isNull();
  }
}
