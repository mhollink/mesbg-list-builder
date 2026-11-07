package com.mesbg.listbuilder.armies.roster.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.TestContainersConfiguration;
import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.account.UserEntity;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import jakarta.persistence.EntityManager;
import java.util.LinkedHashSet;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestContainersConfiguration.class)
class RosterUnitMovementPersistenceTest {

  @Autowired private EntityManager entityManager;
  @Autowired private RosterRepository rosterRepository;
  @Autowired private WarbandRepository warbandRepository;
  @Autowired private RosterUnitRepository unitRepository;
  @Autowired private RosterGroupRepository groupRepository;

  @Test
  void movingFollowerBetweenWarbandsSurvivesFlushAndReload() {
    var user = new UserEntity("move-test-subject", "move@example.test");
    entityManager.persist(user);
    var roster =
        new RosterEntity(user, "Roster", "test-army-list", 800, new LinkedHashSet<>(), null);
    entityManager.persist(roster);
    var source = new WarbandEntity(roster, 0);
    var target = new WarbandEntity(roster, 1);
    roster.getWarbands().add(source);
    roster.getWarbands().add(target);
    entityManager.persist(source);
    entityManager.persist(target);
    var follower = new RosterUnitEntity(source, "orc-warrior", 3, false, 0);
    follower.getOptionIds().add("shield");
    source.getUnits().add(follower);
    entityManager.persist(follower);

    var rosterId = roster.getId();
    var sourceId = source.getId();
    var targetId = target.getId();
    var unitId = follower.getId();
    entityManager.flush();
    entityManager.clear();

    var currentUser = Mockito.mock(CurrentUserContext.class);
    when(currentUser.getUserId()).thenReturn(user.getId());
    var access =
        new RosterAccess(
            currentUser, rosterRepository, warbandRepository, unitRepository, groupRepository);
    var service =
        new RosterUnitsService(
            access, unitRepository, new FollowerLoadoutReconciler(unitRepository));

    service.moveUnit(rosterId, sourceId, unitId, targetId, 0);
    entityManager.flush();
    entityManager.clear();

    assertThat(unitRepository.findOwnedUnit(unitId, sourceId, rosterId, user.getId())).isEmpty();
    var moved =
        unitRepository.findOwnedUnit(unitId, targetId, rosterId, user.getId()).orElseThrow();
    assertThat(moved.getWarband().getId()).isEqualTo(targetId);
    assertThat(moved.getOptionIds()).containsExactly("shield");
    assertThat(moved.getQuantity()).isEqualTo(3);
    assertThat(moved.getSortIndex()).isZero();
    assertThat(warbandRepository.findById(sourceId).orElseThrow().getUnits()).isEmpty();
    assertThat(warbandRepository.findById(targetId).orElseThrow().getUnits()).hasSize(1);
  }
}
