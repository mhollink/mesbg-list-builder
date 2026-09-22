package com.mesbg.listbuilder.armies.roster.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import com.mesbg.listbuilder.TestContainersConfiguration;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestContainersConfiguration.class)
class WarbandRepositoryTest {

  @Autowired private WarbandRepository repository;

  @Autowired private EntityManager entityManager;

  private RosterPersistenceTestFixture fixture;

  @BeforeEach
  void setUp() {
    fixture = new RosterPersistenceTestFixture(entityManager);
  }

  @Test
  void findsWarbandWhenOwnershipChainMatches() {
    var owner = fixture.user("owner");
    var roster = fixture.roster(owner, "Mordor", null);
    var warband = fixture.warband(roster, 0);

    fixture.flushAndClear();

    assertThat(repository.findOwnedWarband(warband.getId(), roster.getId(), owner.getId()))
        .isPresent();
  }

  @Test
  void doesNotFindWarbandForDifferentRoster() {
    var owner = fixture.user("owner");

    var roster = fixture.roster(owner, "Mordor", null);
    var otherRoster = fixture.roster(owner, "Isengard", null);

    var warband = fixture.warband(roster, 0);

    fixture.flushAndClear();

    assertThat(repository.findOwnedWarband(warband.getId(), otherRoster.getId(), owner.getId()))
        .isEmpty();
  }

  @Test
  void doesNotFindWarbandForDifferentUser() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    var roster = fixture.roster(owner, "Mordor", null);
    var warband = fixture.warband(roster, 0);

    fixture.flushAndClear();

    assertThat(repository.findOwnedWarband(warband.getId(), roster.getId(), otherUser.getId()))
        .isEmpty();
  }
}
