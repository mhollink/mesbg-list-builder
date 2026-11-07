package com.mesbg.listbuilder.armies.roster.service;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.group;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.roster;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.unit;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.warband;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterUnitNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.WarbandNotFoundException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterAccessTest {

  private static final long USER_ID = 10L;
  private static final long ROSTER_ID = 20L;
  private static final long GROUP_ID = 30L;
  private static final long WARBAND_ID = 40L;
  private static final long UNIT_ID = 50L;

  @Mock private CurrentUserContext currentUser;
  @Mock private RosterRepository rosterRepository;
  @Mock private RosterGroupRepository rosterGroupRepository;
  @Mock private WarbandRepository warbandRepository;
  @Mock private RosterUnitRepository rosterUnitRepository;

  private RosterAccess access;

  @BeforeEach
  void setUp() {
    lenient().when(currentUser.getUserId()).thenReturn(USER_ID);
    access =
        new RosterAccess(
            currentUser,
            rosterRepository,
            warbandRepository,
            rosterUnitRepository,
            rosterGroupRepository);
  }

  @Test
  void returnsRosterOwnedByCurrentUser() {
    var owned = roster(ROSTER_ID);
    when(rosterRepository.findByIdAndUserId(ROSTER_ID, USER_ID)).thenReturn(Optional.of(owned));

    assertThat(access.requireRoster(ROSTER_ID)).isSameAs(owned);
  }

  @Test
  void hidesMissingOrOtherUsersRoster() {
    when(rosterRepository.findByIdAndUserId(ROSTER_ID, USER_ID)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> access.requireRoster(ROSTER_ID))
        .isInstanceOf(RosterNotFoundException.class);
  }

  @Test
  void returnsGroupOwnedByCurrentUser() {
    var owned = group(GROUP_ID);
    when(rosterGroupRepository.findByIdAndUserId(GROUP_ID, USER_ID)).thenReturn(Optional.of(owned));

    assertThat(access.requireGroup(GROUP_ID)).isSameAs(owned);
  }

  @Test
  void hidesMissingOrOtherUsersGroup() {
    when(rosterGroupRepository.findByIdAndUserId(GROUP_ID, USER_ID)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> access.requireGroup(GROUP_ID))
        .isInstanceOf(RosterGroupNotFoundException.class);
  }

  @Test
  void returnsEditableRosterWhenUnlocked() {
    var owned = roster(ROSTER_ID);
    when(rosterRepository.findByIdAndUserId(ROSTER_ID, USER_ID)).thenReturn(Optional.of(owned));

    assertThat(access.requireEditable(ROSTER_ID)).isSameAs(owned);
  }

  @Test
  void rejectsEditsToLockedRosterButStillAllowsReadingIt() {
    var owned = roster(ROSTER_ID);
    owned.setLocked(true);
    when(rosterRepository.findByIdAndUserId(ROSTER_ID, USER_ID)).thenReturn(Optional.of(owned));

    assertThat(access.requireRoster(ROSTER_ID)).isSameAs(owned);
    assertThatThrownBy(() -> access.requireEditable(ROSTER_ID))
        .isInstanceOf(RosterLockedException.class);
  }

  @Test
  void returnsWarbandOnlyWithinOwnedRoster() {
    var ownedWarband = warband(roster(ROSTER_ID), WARBAND_ID, 0);
    when(warbandRepository.findOwnedWarband(WARBAND_ID, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(ownedWarband));

    assertThat(access.requireWarband(WARBAND_ID, ROSTER_ID)).isSameAs(ownedWarband);
  }

  @Test
  void hidesWarbandOutsideOwnedRoster() {
    when(warbandRepository.findOwnedWarband(WARBAND_ID, ROSTER_ID, USER_ID))
        .thenReturn(Optional.empty());

    assertThatThrownBy(() -> access.requireWarband(WARBAND_ID, ROSTER_ID))
        .isInstanceOf(WarbandNotFoundException.class);
  }

  @Test
  void returnsUnitOnlyWithinOwnedWarbandAndRoster() {
    var band = warband(roster(ROSTER_ID), WARBAND_ID, 0);
    var ownedUnit = unit(band, UNIT_ID, "warrior", 1, false, 0);
    when(rosterUnitRepository.findOwnedUnit(UNIT_ID, WARBAND_ID, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(ownedUnit));

    assertThat(access.requireUnit(UNIT_ID, WARBAND_ID, ROSTER_ID)).isSameAs(ownedUnit);
  }

  @Test
  void hidesUnitOutsideOwnedWarbandAndRoster() {
    when(rosterUnitRepository.findOwnedUnit(UNIT_ID, WARBAND_ID, ROSTER_ID, USER_ID))
        .thenReturn(Optional.empty());

    assertThatThrownBy(() -> access.requireUnit(UNIT_ID, WARBAND_ID, ROSTER_ID))
        .isInstanceOf(RosterUnitNotFoundException.class);
  }

  @Test
  void returnsUnitAnywhereInOwnedRoster() {
    var band = warband(roster(ROSTER_ID), WARBAND_ID, 0);
    var ownedUnit = unit(band, UNIT_ID, "warrior", 1, false, 0);
    when(rosterUnitRepository.findOwnedUnitInRoster(UNIT_ID, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(ownedUnit));

    assertThat(access.requireUnit(UNIT_ID, ROSTER_ID)).isSameAs(ownedUnit);
  }

  @Test
  void hidesUnitOutsideOwnedRoster() {
    when(rosterUnitRepository.findOwnedUnitInRoster(UNIT_ID, ROSTER_ID, USER_ID))
        .thenReturn(Optional.empty());

    assertThatThrownBy(() -> access.requireUnit(UNIT_ID, ROSTER_ID))
        .isInstanceOf(RosterUnitNotFoundException.class);
  }
}
