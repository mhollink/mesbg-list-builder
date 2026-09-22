package com.mesbg.listbuilder.armies.roster.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import com.mesbg.listbuilder.TestContainersConfiguration;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import jakarta.persistence.EntityManager;
import java.util.Optional;
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
class RosterUnitRepositoryTest {

  @Autowired private RosterUnitRepository repository;

  @Autowired private EntityManager entityManager;

  private RosterPersistenceTestFixture fixture;

  @BeforeEach
  void setUp() {
    fixture = new RosterPersistenceTestFixture(entityManager);
  }

  @Test
  void findsOwnedUnitWhenFullOwnershipChainMatches() {
    var owner = fixture.user("owner");
    var roster = fixture.roster(owner, "Mordor", null);
    var warband = fixture.warband(roster, 0);

    var unit = fixture.unit(warband, "witch-king", 1, true, 0, Set.of());

    fixture.flushAndClear();

    Optional<RosterUnitEntity> ownedUnit =
        repository.findOwnedUnit(unit.getId(), warband.getId(), roster.getId(), owner.getId());
    assertThat(ownedUnit).isPresent();
  }

  @Test
  void doesNotFindUnitForDifferentWarband() {
    var owner = fixture.user("owner");
    var roster = fixture.roster(owner, "Mordor", null);

    var warband = fixture.warband(roster, 0);
    var otherWarband = fixture.warband(roster, 1);

    var unit = fixture.unit(warband, "witch-king", 1, true, 0, Set.of());

    fixture.flushAndClear();

    Optional<RosterUnitEntity> ownedUnit =
        repository.findOwnedUnit(unit.getId(), otherWarband.getId(), roster.getId(), owner.getId());
    assertThat(ownedUnit).isEmpty();
  }

  @Test
  void doesNotFindUnitForDifferentRoster() {
    var owner = fixture.user("owner");

    var roster = fixture.roster(owner, "Mordor", null);
    var otherRoster = fixture.roster(owner, "Isengard", null);

    var warband = fixture.warband(roster, 0);

    var unit = fixture.unit(warband, "witch-king", 1, true, 0, Set.of());

    fixture.flushAndClear();

    Optional<RosterUnitEntity> ownedUnit =
        repository.findOwnedUnit(unit.getId(), warband.getId(), otherRoster.getId(), owner.getId());
    assertThat(ownedUnit).isEmpty();
  }

  @Test
  void doesNotFindUnitForDifferentUser() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    var roster = fixture.roster(owner, "Mordor", null);
    var warband = fixture.warband(roster, 0);

    var unit = fixture.unit(warband, "witch-king", 1, true, 0, Set.of());

    fixture.flushAndClear();

    Optional<RosterUnitEntity> ownedUnit =
        repository.findOwnedUnit(unit.getId(), warband.getId(), roster.getId(), otherUser.getId());
    assertThat(ownedUnit).isEmpty();
  }

  @Test
  void findsOwnedUnitAnywhereWithinRoster() {
    var owner = fixture.user("owner");
    var roster = fixture.roster(owner, "Mordor", null);

    fixture.warband(roster, 0);
    var secondWarband = fixture.warband(roster, 1);

    var unit = fixture.unit(secondWarband, "orc-warrior", 5, false, 0, Set.of());

    fixture.flushAndClear();

    Optional<RosterUnitEntity> ownedUnitInRoster =
        repository.findOwnedUnitInRoster(unit.getId(), roster.getId(), owner.getId());
    assertThat(ownedUnitInRoster).isPresent();
  }

  @Test
  void findOwnedUnitInRosterRejectsDifferentRosterOrUser() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    var roster = fixture.roster(owner, "Mordor", null);
    var otherRoster = fixture.roster(owner, "Isengard", null);

    var warband = fixture.warband(roster, 0);

    var unit = fixture.unit(warband, "witch-king", 1, true, 0, Set.of());

    fixture.flushAndClear();

    Optional<RosterUnitEntity> otherRosterUnit =
        repository.findOwnedUnitInRoster(unit.getId(), otherRoster.getId(), owner.getId());
    assertThat(otherRosterUnit).isEmpty();

    Optional<RosterUnitEntity> otherUserUnit =
        repository.findOwnedUnitInRoster(unit.getId(), roster.getId(), otherUser.getId());
    assertThat(otherUserUnit).isEmpty();
  }

  @Test
  void persistsUnitOptions() {
    var owner = fixture.user("owner");
    var roster = fixture.roster(owner, "Mordor", null);
    var warband = fixture.warband(roster, 0);

    var unit = fixture.unit(warband, "witch-king", 1, true, 0, Set.of("horse", "crown"));

    fixture.flushAndClear();

    var persisted = repository.findById(unit.getId()).orElseThrow();

    Set<String> persistedOptions = persisted.getOptionIds();
    assertThat(persistedOptions).containsExactlyInAnyOrder("horse", "crown");
  }

  @Test
  void removingUnitFromWarbandDeletesUnitAndOptions() {
    var owner = fixture.user("owner");
    var roster = fixture.roster(owner, "Mordor", null);
    var warband = fixture.warband(roster, 0);

    var unit = fixture.unit(warband, "orc-warrior", 4, false, 0, Set.of("shield"));

    fixture.flushAndClear();

    var unitId = unit.getId();

    var managedUnit = repository.findById(unitId).orElseThrow();
    var managedWarband = managedUnit.getWarband();

    managedWarband.getUnits().removeIf(existing -> existing.getId().equals(unitId));

    entityManager.flush();
    entityManager.clear();

    assertThat(repository.findById(unitId)).isEmpty();

    var options =
        ((Number)
                entityManager
                    .createNativeQuery(
                        """
                        select count(*)
                        from roster_unit_options
                        where unit_id = :unitId
                        """)
                    .setParameter("unitId", unitId)
                    .getSingleResult())
            .longValue();

    assertThat(options).isZero();
  }
}
