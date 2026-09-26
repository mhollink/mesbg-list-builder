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
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidWarbandPositionException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.WarbandNotFoundException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterWarbandsServiceTest {

  @Mock private CurrentUserContext currentUser;
  @Mock private RosterRepository rosterRepository;
  @Mock private WarbandRepository warbandRepository;
  @Mock private RosterUnitRepository rosterUnitRepository;
  @Mock private RosterGroupRepository rosterGroupRepository;

  private RosterWarbandsService warbandsService;

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

    warbandsService = new RosterWarbandsService(rosterAccess, warbandRepository);
  }

  @Test
  void createsEmptyWarbandWithNextSortIndex() {
    var roster = roster(ROSTER_ID);

    warband(roster, 40L, 2);
    warband(roster, 41L, 5);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.save(any(WarbandEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    var result = warbandsService.createWarband(ROSTER_ID);

    assertThat(result.getSortIndex()).isEqualTo(6);
    assertThat(result.getUnits()).isEmpty();
    assertThat(roster.getWarbands()).contains(result);
    assertThat(roster.getUpdatedAt()).isNotNull();
  }

  @Test
  void cannotCreateWarbandWhenLocked() {
    var roster = roster(ROSTER_ID);
    roster.setLocked(true);

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    assertThatThrownBy(() -> warbandsService.createWarband(ROSTER_ID))
        .isInstanceOf(RosterLockedException.class);

    verify(warbandRepository, never()).save(any());
  }

  @Test
  void deletesWarband() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));

    warbandsService.deleteWarband(ROSTER_ID, 40L);

    assertThat(roster.getWarbands()).doesNotContain(warband);
    assertThat(roster.getUpdatedAt()).isNotNull();
  }

  @Test
  void deletingWarbandClearsGeneralWhenGeneralBelongsToIt() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var leader = unit(warband, 50L, "hero", 1, true, 0);

    roster.setGeneralUnit(leader);

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));

    warbandsService.deleteWarband(ROSTER_ID, 40L);

    assertThat(roster.getGeneralUnit()).isNull();
  }

  @Test
  void deletingUnknownWarbandFails() {
    var roster = roster(ROSTER_ID);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> warbandsService.deleteWarband(ROSTER_ID, 40L))
        .isInstanceOf(WarbandNotFoundException.class);
  }

  @Test
  void cannotDeleteWarbandWhenLocked() {
    var roster = roster(ROSTER_ID);
    roster.setLocked(true);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    assertThatThrownBy(() -> warbandsService.deleteWarband(ROSTER_ID, 40L))
        .isInstanceOf(RosterLockedException.class);

    verify(warbandRepository, never()).findOwnedWarband(any(), any(), any());
  }

  @Test
  void duplicatesWarbandAtEndOfRoster() {
    var roster = roster(ROSTER_ID);
    var source = warband(roster, 40L, 1);
    warband(roster, 41L, 4);

    var leader = unit(source, 50L, "hero", 1, true, -1);
    leader.getOptionIds().add("horse");

    var follower = unit(source, 51L, "warrior", 5, false, 0);
    follower.getOptionIds().add("shield");

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(source));
    when(warbandRepository.save(any(WarbandEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    var result = warbandsService.duplicateWarband(ROSTER_ID, 40L);

    assertThat(result).isNotSameAs(source);
    assertThat(result.getSortIndex()).isEqualTo(5);
    assertThat(roster.getWarbands()).contains(result);
    assertThat(result.getUnits()).hasSize(2);

    var duplicatedLeader = result.getUnits().get(0);
    var duplicatedFollower = result.getUnits().get(1);

    assertThat(duplicatedLeader).isNotSameAs(leader);
    assertThat(duplicatedLeader.getProfileId()).isEqualTo("hero");
    assertThat(duplicatedLeader.getOptionIds()).containsExactly("horse");

    assertThat(duplicatedFollower).isNotSameAs(follower);
    assertThat(duplicatedFollower.getProfileId()).isEqualTo("warrior");
    assertThat(duplicatedFollower.getQuantity()).isEqualTo(5);
    assertThat(duplicatedFollower.getOptionIds()).containsExactly("shield");
  }

  @Test
  void movesWarbandAndReindexesRoster() {
    var roster = roster(ROSTER_ID);
    var first = warband(roster, 40L, 0);
    var second = warband(roster, 41L, 1);
    var third = warband(roster, 42L, 2);
    var fourth = warband(roster, 43L, 3);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(43L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(fourth));

    warbandsService.moveWarband(ROSTER_ID, 43L, 1);

    assertThat(first.getSortIndex()).isZero();
    assertThat(fourth.getSortIndex()).isEqualTo(1);
    assertThat(second.getSortIndex()).isEqualTo(2);
    assertThat(third.getSortIndex()).isEqualTo(3);

    assertThat(
            roster.getWarbands().stream()
                .sorted(java.util.Comparator.comparingInt(WarbandEntity::getSortIndex))
                .toList())
        .containsExactly(first, fourth, second, third);
  }

  @Test
  void rejectsWarbandPositionOutsideRoster() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(warband));

    assertThatThrownBy(() -> warbandsService.moveWarband(ROSTER_ID, 40L, 1))
        .isInstanceOf(InvalidWarbandPositionException.class);
  }
}
