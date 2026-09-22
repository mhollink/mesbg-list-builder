package com.mesbg.listbuilder.armies.roster.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.account.AuthenticatedUserService;
import com.mesbg.listbuilder.account.UserEntity;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterUnitNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.WarbandNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterServiceTest {

  private static final long USER_ID = 10L;
  private static final long ROSTER_ID = 20L;

  private static final RosterStatistics STATISTICS = new RosterStatistics(750, 3, 32, 8, 10, 4);

  @Mock private AuthenticatedUserService authenticatedUserService;

  @Mock private RosterRepository rosterRepository;

  @Mock private RosterGroupRepository rosterGroupRepository;

  @Mock private WarbandRepository warbandRepository;

  @Mock private RosterUnitRepository rosterUnitRepository;

  @Mock private RosterStatisticsCalculator rosterStatisticsCalculator;

  @InjectMocks private RosterService service;

  private UserEntity user;

  @BeforeEach
  void setUp() {
    user = new UserEntity("keycloak-subject", "user@example.test");
    user.setId(USER_ID);

    when(authenticatedUserService.getCurrentUser()).thenReturn(user);
  }

  @Nested
  class Reading {

    @Test
    void listsRostersWithCalculatedStatistics() {
      var first = roster(20L);
      var second = roster(21L);

      when(rosterRepository.findAllByUserIdOrderByUpdatedAtDesc(USER_ID))
          .thenReturn(List.of(first, second));

      when(rosterStatisticsCalculator.calculate(first)).thenReturn(STATISTICS);
      when(rosterStatisticsCalculator.calculate(second)).thenReturn(STATISTICS);

      var result = service.listRosters();

      assertThat(result).extracting(RosterSnapshot::roster).containsExactly(first, second);

      assertThat(result)
          .extracting(RosterSnapshot::statistics)
          .containsExactly(STATISTICS, STATISTICS);
    }

    @Test
    void getsOwnedRosterWithStatistics() {
      var roster = roster(ROSTER_ID);

      findRoster(roster);
      calculateStatistics(roster);

      var result = service.getRoster(ROSTER_ID);

      assertThat(result.roster()).isSameAs(roster);
      assertThat(result.statistics()).isSameAs(STATISTICS);
    }

    @Test
    void throwsWhenRosterDoesNotExist() {
      when(rosterRepository.findByIdAndUserId(ROSTER_ID, USER_ID)).thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.getRoster(ROSTER_ID))
          .isInstanceOf(RosterNotFoundException.class);
    }
  }

  @Nested
  class CreatingAndUpdating {

    @Test
    void createsRootRosterAndNormalizesTags() {
      when(rosterRepository.save(any(RosterEntity.class)))
          .thenAnswer(invocation -> invocation.getArgument(0));

      when(rosterStatisticsCalculator.calculate(any(RosterEntity.class))).thenReturn(STATISTICS);

      var result =
          service.createRoster(
              "Mordor",
              "mordor",
              800,
              List.of(" Tournament ", "", "Tournament", "Friendly", "x".repeat(65)),
              null);

      var roster = result.roster();

      assertThat(roster.getUser()).isSameAs(user);
      assertThat(roster.getName()).isEqualTo("Mordor");
      assertThat(roster.getArmyListId()).isEqualTo("mordor");
      assertThat(roster.getPointsLimit()).isEqualTo(800);
      assertThat(roster.getGroup()).isNull();

      assertThat(roster.getTags()).containsExactly("Tournament", "Friendly");

      assertThat(result.statistics()).isSameAs(STATISTICS);
    }

    @Test
    void createsRosterInsideOwnedGroup() {
      var group = group(30L);

      when(rosterGroupRepository.findByIdAndUserId(30L, USER_ID)).thenReturn(Optional.of(group));

      when(rosterRepository.save(any(RosterEntity.class)))
          .thenAnswer(invocation -> invocation.getArgument(0));

      when(rosterStatisticsCalculator.calculate(any(RosterEntity.class))).thenReturn(STATISTICS);

      var result = service.createRoster("Mordor", "mordor", 800, List.of(), 30L);

      assertThat(result.roster().getGroup()).isSameAs(group);
    }

    @Test
    void creatingRosterFailsWhenGroupDoesNotExist() {
      when(rosterGroupRepository.findByIdAndUserId(30L, USER_ID)).thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.createRoster("Mordor", "mordor", 800, List.of(), 30L))
          .isInstanceOf(RosterGroupNotFoundException.class);

      verify(rosterRepository, never()).save(any());
    }

    @Test
    void updatesMutableRosterMetadata() {
      var roster = roster(ROSTER_ID);
      roster.getTags().add("Old");

      findRoster(roster);
      calculateStatistics(roster);

      var result =
          service.updateRoster(
              ROSTER_ID, "Updated roster", 750, List.of(" Tournament ", "Tournament", "Friendly"));

      assertThat(roster.getName()).isEqualTo("Updated roster");
      assertThat(roster.getPointsLimit()).isEqualTo(750);

      assertThat(roster.getTags()).containsExactly("Tournament", "Friendly");

      assertThat(result.roster()).isSameAs(roster);
    }

    @Test
    void leavesOmittedMetadataUnchanged() {
      var roster = roster(ROSTER_ID);
      roster.setPointsLimit(800);
      roster.getTags().add("Existing");

      findRoster(roster);
      calculateStatistics(roster);

      service.updateRoster(ROSTER_ID, null, null, null);

      assertThat(roster.getName()).isEqualTo("Roster");
      assertThat(roster.getPointsLimit()).isEqualTo(800);
      assertThat(roster.getTags()).containsExactly("Existing");
    }

    @Test
    void cannotChangePointsLimitWhenLocked() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      findRoster(roster);

      assertThatThrownBy(() -> service.updateRoster(ROSTER_ID, null, 750, null))
          .isInstanceOf(RosterLockedException.class);
    }
  }

  @Nested
  class FavoriteAndLock {

    @Test
    void favoritesRoster() {
      var roster = roster(ROSTER_ID);

      findRoster(roster);
      calculateStatistics(roster);

      var result = service.favoriteRoster(ROSTER_ID);

      assertThat(roster.isFavorite()).isTrue();
      assertThat(result.roster()).isSameAs(roster);
    }

    @Test
    void unfavoritesRoster() {
      var roster = roster(ROSTER_ID);
      roster.setFavorite(true);

      findRoster(roster);
      calculateStatistics(roster);

      service.unfavoriteRoster(ROSTER_ID);

      assertThat(roster.isFavorite()).isFalse();
    }

    @Test
    void locksRoster() {
      var roster = roster(ROSTER_ID);

      findRoster(roster);
      calculateStatistics(roster);

      service.lockRoster(ROSTER_ID);

      assertThat(roster.isLocked()).isTrue();
    }

    @Test
    void unlocksRoster() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      findRoster(roster);
      calculateStatistics(roster);

      service.unlockRoster(ROSTER_ID);

      assertThat(roster.isLocked()).isFalse();
    }

    @Test
    void favoriteCanBeChangedWhileRosterIsLocked() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      findRoster(roster);
      calculateStatistics(roster);

      service.favoriteRoster(ROSTER_ID);

      assertThat(roster.isFavorite()).isTrue();
      assertThat(roster.isLocked()).isTrue();
    }
  }

  @Nested
  class DeletingAndMoving {

    @Test
    void deletesUnlockedRoster() {
      var roster = roster(ROSTER_ID);

      findRoster(roster);

      service.deleteRoster(ROSTER_ID);

      verify(rosterRepository).delete(roster);
    }

    @Test
    void refusesToDeleteLockedRoster() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      findRoster(roster);

      assertThatThrownBy(() -> service.deleteRoster(ROSTER_ID))
          .isInstanceOf(RosterLockedException.class);

      verify(rosterRepository, never()).delete(any());
    }

    @Test
    void assignsRosterToGroup() {
      var roster = roster(ROSTER_ID);
      var group = group(30L);

      findRoster(roster);

      when(rosterGroupRepository.findByIdAndUserId(30L, USER_ID)).thenReturn(Optional.of(group));

      service.assignRosterToGroup(ROSTER_ID, 30L);

      assertThat(roster.getGroup()).isSameAs(group);
    }

    @Test
    void removesRosterFromGroup() {
      var roster = roster(ROSTER_ID);
      roster.setGroup(group(30L));

      findRoster(roster);

      service.removeRosterFromGroup(ROSTER_ID);

      assertThat(roster.getGroup()).isNull();
    }

    @Test
    void lockedRosterCanStillBeMoved() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      var group = group(30L);

      findRoster(roster);

      when(rosterGroupRepository.findByIdAndUserId(30L, USER_ID)).thenReturn(Optional.of(group));

      service.assignRosterToGroup(ROSTER_ID, 30L);

      assertThat(roster.getGroup()).isSameAs(group);
    }
  }

  @Nested
  class General {

    @Test
    void setsGeneralToOwnedUnit() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);
      var unit = unit(warband, 50L, "hero", 1, true, 0);

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnitInRoster(50L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(unit));

      service.setRosterGeneral(ROSTER_ID, 50L);

      assertThat(roster.getGeneralUnit()).isSameAs(unit);
    }

    @Test
    void settingUnknownUnitAsGeneralFails() {
      var roster = roster(ROSTER_ID);

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnitInRoster(50L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.setRosterGeneral(ROSTER_ID, 50L))
          .isInstanceOf(RosterUnitNotFoundException.class);
    }

    @Test
    void clearsGeneral() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);
      var unit = unit(warband, 50L, "hero", 1, true, 0);

      roster.setGeneralUnit(unit);

      findRoster(roster);

      service.clearRosterGeneral(ROSTER_ID);

      assertThat(roster.getGeneralUnit()).isNull();
    }

    @Test
    void cannotChangeGeneralWhenLocked() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      findRoster(roster);

      assertThatThrownBy(() -> service.setRosterGeneral(ROSTER_ID, 50L))
          .isInstanceOf(RosterLockedException.class);

      verify(rosterUnitRepository, never()).findOwnedUnitInRoster(any(), any(), any());
    }
  }

  @Nested
  class Warbands {

    @Test
    void createsWarbandWithLeaderAndNextSortIndex() {
      var roster = roster(ROSTER_ID);

      warband(roster, 40L, 2);
      warband(roster, 41L, 5);

      findRoster(roster);

      when(warbandRepository.save(any(WarbandEntity.class)))
          .thenAnswer(invocation -> invocation.getArgument(0));

      var result = service.createWarband(ROSTER_ID, "witch-king", Set.of("horse", "crown"));

      assertThat(result.getSortIndex()).isEqualTo(6);
      assertThat(roster.getWarbands()).contains(result);
      assertThat(result.getUnits()).hasSize(1);

      var leader = result.getUnits().getFirst();

      assertThat(leader.isLeader()).isTrue();
      assertThat(leader.getQuantity()).isEqualTo(1);
      assertThat(leader.getProfileId()).isEqualTo("witch-king");
      assertThat(leader.getOptionIds()).containsExactlyInAnyOrder("horse", "crown");

      assertThat(roster.getUpdatedAt()).isNotNull();
    }

    @Test
    void cannotCreateWarbandWhenLocked() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      findRoster(roster);

      assertThatThrownBy(() -> service.createWarband(ROSTER_ID, "witch-king", Set.of()))
          .isInstanceOf(RosterLockedException.class);

      verify(warbandRepository, never()).save(any());
    }

    @Test
    void deletesWarband() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);

      findRoster(roster);

      when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(warband));

      service.deleteWarband(ROSTER_ID, 40L);

      assertThat(roster.getWarbands()).doesNotContain(warband);
      assertThat(roster.getUpdatedAt()).isNotNull();
    }

    @Test
    void deletingWarbandClearsGeneralWhenGeneralBelongsToIt() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);
      var leader = unit(warband, 50L, "hero", 1, true, 0);

      roster.setGeneralUnit(leader);

      findRoster(roster);

      when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(warband));

      service.deleteWarband(ROSTER_ID, 40L);

      assertThat(roster.getGeneralUnit()).isNull();
    }

    @Test
    void deletingUnknownWarbandFails() {
      var roster = roster(ROSTER_ID);

      findRoster(roster);

      when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.deleteWarband(ROSTER_ID, 40L))
          .isInstanceOf(WarbandNotFoundException.class);
    }

    @Test
    void cannotDeleteWarbandWhenLocked() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      findRoster(roster);

      assertThatThrownBy(() -> service.deleteWarband(ROSTER_ID, 40L))
          .isInstanceOf(RosterLockedException.class);

      verify(warbandRepository, never()).findOwnedWarband(any(), any(), any());
    }

    @Test
    void replacesWarbandLeader() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);

      var leader = unit(warband, 50L, "old-profile", 1, true, 0);

      leader.getOptionIds().add("old-option");

      findRoster(roster);

      when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(warband));

      var result =
          service.replaceWarbandLeader(ROSTER_ID, 40L, "new-profile", Set.of("horse", "shield"));

      assertThat(result).isSameAs(leader);
      assertThat(leader.getProfileId()).isEqualTo("new-profile");
      assertThat(leader.getQuantity()).isEqualTo(1);

      assertThat(leader.getOptionIds()).containsExactlyInAnyOrder("horse", "shield");

      assertThat(roster.getUpdatedAt()).isNotNull();
    }

    @Test
    void replacingLeaderFailsWhenWarbandHasNoLeader() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);

      unit(warband, 50L, "warrior", 4, false, 0);

      findRoster(roster);

      when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(warband));

      assertThatThrownBy(
              () -> service.replaceWarbandLeader(ROSTER_ID, 40L, "new-profile", Set.of()))
          .isInstanceOf(IllegalStateException.class)
          .hasMessageContaining("does not contain a leader");
    }
  }

  @Nested
  class FollowersAndUnits {

    @Test
    void addsFollowerUsingNextSortIndex() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);

      unit(warband, 50L, "leader", 1, true, 0);
      unit(warband, 51L, "existing-follower", 3, false, 4);

      findRoster(roster);

      when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(warband));

      when(rosterUnitRepository.save(any(RosterUnitEntity.class)))
          .thenAnswer(invocation -> invocation.getArgument(0));

      var result = service.addFollower(ROSTER_ID, 40L, "orc-warrior", 6, Set.of("shield"));

      assertThat(result.getSortIndex()).isEqualTo(5);
      assertThat(result.getProfileId()).isEqualTo("orc-warrior");
      assertThat(result.getQuantity()).isEqualTo(6);
      assertThat(result.isLeader()).isFalse();
      assertThat(result.getOptionIds()).containsExactly("shield");

      assertThat(warband.getUnits()).contains(result);
      assertThat(roster.getUpdatedAt()).isNotNull();
    }

    @Test
    void updatesUnitQuantityAndOptions() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);

      var unit = unit(warband, 50L, "orc-warrior", 4, false, 1);

      unit.getOptionIds().add("shield");

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(unit));

      var result = service.updateUnit(ROSTER_ID, 40L, 50L, 8, Set.of("spear"));

      assertThat(result).isSameAs(unit);
      assertThat(unit.getQuantity()).isEqualTo(8);
      assertThat(unit.getOptionIds()).containsExactly("spear");
      assertThat(roster.getUpdatedAt()).isNotNull();
    }

    @Test
    void updatingUnknownUnitFails() {
      var roster = roster(ROSTER_ID);

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.updateUnit(ROSTER_ID, 40L, 50L, 2, null))
          .isInstanceOf(RosterUnitNotFoundException.class);
    }

    @Test
    void leaderQuantityMustRemainOne() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);
      var leader = unit(warband, 50L, "hero", 1, true, 0);

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(leader));

      assertThatThrownBy(() -> service.updateUnit(ROSTER_ID, 40L, 50L, 2, null))
          .isInstanceOf(RosterInvariantViolationException.class)
          .hasMessage("A warband leader must have quantity 1");
    }

    @Test
    void quantityMustBePositive() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);
      var follower = unit(warband, 50L, "warrior", 2, false, 1);

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(follower));

      assertThatThrownBy(() -> service.updateUnit(ROSTER_ID, 40L, 50L, 0, null))
          .isInstanceOf(InvalidRosterUnitException.class)
          .hasMessage("Unit quantity must be at least 1");
    }

    @Test
    void deletesFollower() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);
      var follower = unit(warband, 50L, "warrior", 3, false, 1);

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(follower));

      service.deleteUnit(ROSTER_ID, 40L, 50L);

      assertThat(warband.getUnits()).doesNotContain(follower);
      assertThat(roster.getUpdatedAt()).isNotNull();
    }

    @Test
    void deletingGeneralUnitClearsGeneral() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);
      var follower = unit(warband, 50L, "warrior", 3, false, 1);

      roster.setGeneralUnit(follower);

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(follower));

      service.deleteUnit(ROSTER_ID, 40L, 50L);

      assertThat(roster.getGeneralUnit()).isNull();
    }

    @Test
    void cannotDeleteLeaderDirectly() {
      var roster = roster(ROSTER_ID);
      var warband = warband(roster, 40L, 0);
      var leader = unit(warband, 50L, "hero", 1, true, 0);

      findRoster(roster);

      when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
          .thenReturn(Optional.of(leader));

      assertThatThrownBy(() -> service.deleteUnit(ROSTER_ID, 40L, 50L))
          .isInstanceOf(RosterInvariantViolationException.class);
    }

    @Test
    void unitCompositionCannotBeChangedWhenLocked() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      findRoster(roster);

      assertThatThrownBy(() -> service.updateUnit(ROSTER_ID, 40L, 50L, 2, null))
          .isInstanceOf(RosterLockedException.class);

      verify(rosterUnitRepository, never()).findOwnedUnit(any(), any(), any(), any());
    }
  }

  private RosterEntity roster(long id) {
    var roster =
        new RosterEntity(user, "Roster", "test-army-list", 800, new LinkedHashSet<>(), null);

    roster.setId(id);

    return roster;
  }

  private RosterGroupEntity group(long id) {
    var group = new RosterGroupEntity(user, "Group", null);

    group.setId(id);

    return group;
  }

  private WarbandEntity warband(RosterEntity roster, long id, int sortIndex) {

    var warband = new WarbandEntity(roster, sortIndex);

    warband.setId(id);
    roster.getWarbands().add(warband);

    return warband;
  }

  private RosterUnitEntity unit(
      WarbandEntity warband,
      long id,
      String profileId,
      int quantity,
      boolean leader,
      int sortIndex) {

    var unit = new RosterUnitEntity(warband, profileId, quantity, leader, sortIndex);

    unit.setId(id);
    warband.getUnits().add(unit);

    return unit;
  }

  private void findRoster(RosterEntity roster) {
    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));
  }

  private void calculateStatistics(RosterEntity roster) {
    when(rosterStatisticsCalculator.calculate(roster)).thenReturn(STATISTICS);
  }
}
