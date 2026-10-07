package com.mesbg.listbuilder.armies.roster.service;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.ROSTER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.USER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.roster;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.unit;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.user;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.warband;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.account.UserEntity;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterUnitNotFoundException;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterUnitsServiceTest {

  @Mock private CurrentUserContext currentUser;
  @Mock private RosterRepository rosterRepository;
  @Mock private WarbandRepository warbandRepository;
  @Mock private RosterUnitRepository rosterUnitRepository;
  @Mock private RosterGroupRepository rosterGroupRepository;

  private RosterUnitsService unitsService;

  @BeforeEach
  void setUp() {
    UserEntity user = user();
    lenient().when(currentUser.getUser()).thenReturn(user);
    lenient().when(currentUser.getUserId()).thenReturn(user.getId());

    RosterAccess rosterAccess =
        new RosterAccess(
            currentUser,
            rosterRepository,
            warbandRepository,
            rosterUnitRepository,
            rosterGroupRepository);

    unitsService = new RosterUnitsService(rosterAccess, rosterUnitRepository);
  }

  @Test
  void addsFollowerUsingNextSortIndex() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);

    unit(warband, 50L, "leader", 1, true, 0);
    unit(warband, 51L, "existing-follower", 3, false, 4);

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));

    when(rosterUnitRepository.save(any(RosterUnitEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    var result = unitsService.addFollower(ROSTER_ID, 40L, "orc-warrior", 6, Set.of("shield"));

    assertThat(result.getSortIndex()).isEqualTo(5);
    assertThat(result.getArmyListProfileId()).isEqualTo("orc-warrior");
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

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(unit));

    var result = unitsService.updateUnit(ROSTER_ID, 40L, 50L, 8, Set.of("spear"));

    assertThat(result).isSameAs(unit);
    assertThat(unit.getQuantity()).isEqualTo(8);
    assertThat(unit.getOptionIds()).containsExactly("spear");
    assertThat(roster.getUpdatedAt()).isNotNull();
  }

  @Test
  void updatingUnknownUnitFails() {
    var roster = roster(ROSTER_ID);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.empty());

    assertThatThrownBy(() -> unitsService.updateUnit(ROSTER_ID, 40L, 50L, 2, null))
        .isInstanceOf(RosterUnitNotFoundException.class);
  }

  @Test
  void leaderQuantityMustRemainOne() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var leader = unit(warband, 50L, "hero", 1, true, 0);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(leader));

    assertThatThrownBy(() -> unitsService.updateUnit(ROSTER_ID, 40L, 50L, 2, null))
        .isInstanceOf(RosterInvariantViolationException.class)
        .hasMessage("A warband leader must have quantity 1");
  }

  @Test
  void quantityMustBePositive() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var follower = unit(warband, 50L, "warrior", 2, false, 1);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(follower));

    assertThatThrownBy(() -> unitsService.updateUnit(ROSTER_ID, 40L, 50L, 0, null))
        .isInstanceOf(InvalidRosterUnitException.class)
        .hasMessage("Unit quantity must be at least 1");
  }

  @Test
  void deletesFollower() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var follower = unit(warband, 50L, "warrior", 3, false, 1);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(follower));

    unitsService.deleteUnit(ROSTER_ID, 40L, 50L);

    assertThat(warband.getUnits()).doesNotContain(follower);
    assertThat(roster.getUpdatedAt()).isNotNull();
  }

  @Test
  void deletingGeneralUnitClearsGeneral() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var follower = unit(warband, 50L, "warrior", 3, false, 1);

    roster.setGeneralUnit(follower);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(follower));

    unitsService.deleteUnit(ROSTER_ID, 40L, 50L);

    assertThat(roster.getGeneralUnit()).isNull();
  }

  @Test
  void cannotDeleteLeaderDirectly() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var leader = unit(warband, 50L, "hero", 1, true, 0);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(leader));

    assertThatThrownBy(() -> unitsService.deleteUnit(ROSTER_ID, 40L, 50L))
        .isInstanceOf(RosterInvariantViolationException.class);
  }

  @Test
  void unitCompositionCannotBeChangedWhenLocked() {
    var roster = roster(ROSTER_ID);
    roster.setLocked(true);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    assertThatThrownBy(() -> unitsService.updateUnit(ROSTER_ID, 40L, 50L, 2, null))
        .isInstanceOf(RosterLockedException.class);

    verify(rosterUnitRepository, never()).findOwnedUnit(any(), any(), any(), any());
  }

  @Test
  void movesFollowerWithinWarband() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);

    unit(warband, 49L, "hero", 1, true, -1);
    var first = unit(warband, 50L, "first", 1, false, 0);
    var second = unit(warband, 51L, "second", 1, false, 1);
    var third = unit(warband, 52L, "third", 1, false, 2);
    var fourth = unit(warband, 53L, "fourth", 1, false, 3);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));
    when(rosterUnitRepository.findOwnedUnit(53L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(fourth));

    unitsService.moveUnit(ROSTER_ID, 40L, 53L, 40L, 1);

    assertThat(first.getSortIndex()).isZero();
    assertThat(fourth.getSortIndex()).isEqualTo(1);
    assertThat(second.getSortIndex()).isEqualTo(2);
    assertThat(third.getSortIndex()).isEqualTo(3);
  }

  @Test
  void movesFollowerToAnotherWarband() {
    var roster = roster(ROSTER_ID);
    var source = warband(roster, 40L, 0);
    var target = warband(roster, 41L, 1);

    unit(source, 49L, "source-hero", 1, true, -1);
    var first = unit(source, 50L, "first", 1, false, 0);
    var moved = unit(source, 51L, "moved", 3, false, 1);
    var third = unit(source, 52L, "third", 1, false, 2);

    unit(target, 59L, "target-hero", 1, true, -1);
    var targetFirst = unit(target, 60L, "target-first", 1, false, 0);
    var targetSecond = unit(target, 61L, "target-second", 1, false, 1);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(source));
    when(warbandRepository.findOwnedWarband(41L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(target));
    when(rosterUnitRepository.findOwnedUnit(51L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(moved));

    unitsService.moveUnit(ROSTER_ID, 40L, 51L, 41L, 1);

    assertThat(moved.getWarband()).isSameAs(target);
    assertThat(first.getSortIndex()).isZero();
    assertThat(third.getSortIndex()).isEqualTo(1);
    assertThat(targetFirst.getSortIndex()).isZero();
    assertThat(moved.getSortIndex()).isEqualTo(1);
    assertThat(targetSecond.getSortIndex()).isEqualTo(2);
  }

  @Test
  void cannotMoveLeaderIndependently() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var leader = unit(warband, 50L, "hero", 1, true, -1);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));
    when(rosterUnitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(leader));

    assertThatThrownBy(() -> unitsService.moveUnit(ROSTER_ID, 40L, 50L, 40L, 0))
        .isInstanceOf(RosterInvariantViolationException.class)
        .hasMessage("A warband leader cannot be moved independently");
  }

  @Test
  void replacesWarbandLeader() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);

    var leader = unit(warband, 50L, "old-profile", 1, true, 0);

    leader.getOptionIds().add("old-option");

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));

    var result =
        unitsService.setWarbandLeader(ROSTER_ID, 40L, "new-profile", Set.of("horse", "shield"));

    assertThat(result).isSameAs(leader);
    assertThat(leader.getArmyListProfileId()).isEqualTo("new-profile");
    assertThat(leader.getQuantity()).isEqualTo(1);

    assertThat(leader.getOptionIds()).containsExactlyInAnyOrder("horse", "shield");

    assertThat(roster.getUpdatedAt()).isNotNull();
  }

  @Test
  void setsLeaderOnEmptyWarband() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);

    unit(warband, 50L, "warrior", 4, false, 0);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));

    var result = unitsService.setWarbandLeader(ROSTER_ID, 40L, "new-profile", Set.of("horse"));

    assertThat(result.isLeader()).isTrue();
    assertThat(result.getArmyListProfileId()).isEqualTo("new-profile");
    assertThat(result.getQuantity()).isEqualTo(1);
    assertThat(result.getSortIndex()).isEqualTo(-1);
    assertThat(result.getOptionIds()).containsExactly("horse");
    assertThat(warband.getUnits()).contains(result);
  }

  @Test
  void replacingGeneralLeaderClearsGeneralSelection() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var leader = unit(warband, 50L, "old-profile", 1, true, -1);

    roster.setGeneralUnit(leader);
    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));

    unitsService.setWarbandLeader(ROSTER_ID, 40L, "new-profile", Set.of());

    assertThat(roster.getGeneralUnit()).isNull();
  }
}
