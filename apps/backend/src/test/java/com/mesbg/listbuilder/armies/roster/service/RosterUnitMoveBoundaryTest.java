package com.mesbg.listbuilder.armies.roster.service;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.ROSTER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.USER_ID;
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
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterUnitMoveBoundaryTest {

  @Mock private CurrentUserContext currentUser;
  @Mock private RosterRepository rosterRepository;
  @Mock private WarbandRepository warbandRepository;
  @Mock private RosterUnitRepository unitRepository;
  @Mock private RosterGroupRepository groupRepository;
  @Mock private FollowerLoadoutReconciler reconciler;

  private RosterUnitsService service;

  @BeforeEach
  void setUp() {
    lenient().when(currentUser.getUserId()).thenReturn(USER_ID);
    var access =
        new RosterAccess(
            currentUser, rosterRepository, warbandRepository, unitRepository, groupRepository);
    service = new RosterUnitsService(access, unitRepository, reconciler);
  }

  @Test
  void rejectsNegativePositionWithinWarbandWithoutReordering() {
    var roster = roster(ROSTER_ID);
    var band = warband(roster, 40L, 0);
    var first = unit(band, 50L, "warrior", 1, false, 0);
    var second = unit(band, 51L, "warrior", 1, false, 1);
    when(rosterRepository.findByIdAndUserId(ROSTER_ID, USER_ID)).thenReturn(Optional.of(roster));
    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID)).thenReturn(Optional.of(band));
    when(unitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID)).thenReturn(Optional.of(first));

    assertThatThrownBy(() -> service.moveUnit(ROSTER_ID, 40L, 50L, 40L, -1))
        .isInstanceOf(InvalidRosterUnitException.class);
    assertThat(first.getSortIndex()).isZero();
    assertThat(second.getSortIndex()).isEqualTo(1);
  }

  @Test
  void rejectsPositionPastEndOfTargetWarbandWithoutMutatingUnit() {
    var roster = roster(ROSTER_ID);
    var source = warband(roster, 40L, 0);
    var target = warband(roster, 41L, 1);
    var follower = unit(source, 50L, "warrior", 1, false, 0);
    when(rosterRepository.findByIdAndUserId(ROSTER_ID, USER_ID)).thenReturn(Optional.of(roster));
    when(warbandRepository.findOwnedWarband(40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(source));
    when(warbandRepository.findOwnedWarband(41L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(target));
    when(unitRepository.findOwnedUnit(50L, 40L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(follower));

    assertThatThrownBy(() -> service.moveUnit(ROSTER_ID, 40L, 50L, 41L, 1))
        .isInstanceOf(InvalidRosterUnitException.class);
    assertThat(follower.getWarband()).isSameAs(source);
    assertThat(follower.getSortIndex()).isZero();
    assertThat(target.getUnits()).isEmpty();
  }
}
