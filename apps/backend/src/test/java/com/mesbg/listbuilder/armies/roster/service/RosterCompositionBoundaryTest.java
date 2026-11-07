package com.mesbg.listbuilder.armies.roster.service;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.ROSTER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.roster;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.unit;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.warband;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterCompositionBoundaryTest {

  @Mock private RosterAccess access;
  @Mock private RosterStatisticsCalculator statisticsCalculator;

  @Test
  void rejectsFollowerAsRosterGeneralWithoutChangingSelection() {
    var roster = roster(ROSTER_ID);
    var band = warband(roster, 40L, 0);
    var follower = unit(band, 50L, "warrior", 2, false, 0);
    when(access.requireEditable(ROSTER_ID)).thenReturn(roster);
    when(access.requireUnit(50L, ROSTER_ID)).thenReturn(follower);

    var service = new RosterCompositionService(access, statisticsCalculator);

    assertThatThrownBy(() -> service.setRosterGeneral(ROSTER_ID, 50L))
        .isInstanceOf(RosterInvariantViolationException.class);
    assertThat(roster.getGeneralUnit()).isNull();
  }
}
