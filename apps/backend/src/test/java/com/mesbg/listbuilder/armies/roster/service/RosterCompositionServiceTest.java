package com.mesbg.listbuilder.armies.roster.service;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.ROSTER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.USER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.roster;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.unit;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.user;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.warband;
import static java.util.Collections.emptySet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIterable;
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
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterUnitNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterCompositionServiceTest {

  @Mock private CurrentUserContext currentUser;
  @Mock private RosterRepository rosterRepository;
  @Mock private WarbandRepository warbandRepository;
  @Mock private RosterUnitRepository rosterUnitRepository;
  @Mock private RosterGroupRepository rosterGroupRepository;
  @Mock private RosterStatisticsCalculator calculator;

  private RosterCompositionService compositionService;

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

    compositionService = new RosterCompositionService(rosterAccess, calculator);
  }

  @Test
  void setsGeneralToOwnedUnit() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var unit = unit(warband, 50L, "hero", 1, true, 0);

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnitInRoster(50L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.of(unit));

    compositionService.setRosterGeneral(ROSTER_ID, 50L);

    assertThat(roster.getGeneralUnit()).isSameAs(unit);
  }

  @Test
  void settingUnknownUnitAsGeneralFails() {
    var roster = roster(ROSTER_ID);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    when(rosterUnitRepository.findOwnedUnitInRoster(50L, ROSTER_ID, USER_ID))
        .thenReturn(Optional.empty());

    assertThatThrownBy(() -> compositionService.setRosterGeneral(ROSTER_ID, 50L))
        .isInstanceOf(RosterUnitNotFoundException.class);
  }

  @Test
  void clearsGeneral() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var unit = unit(warband, 50L, "hero", 1, true, 0);

    roster.setGeneralUnit(unit);

    when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    compositionService.clearRosterGeneral(ROSTER_ID);

    assertThat(roster.getGeneralUnit()).isNull();
  }

  @Test
  void cannotChangeGeneralWhenLocked() {
    var roster = roster(ROSTER_ID);
    roster.setLocked(true);

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    assertThatThrownBy(() -> compositionService.setRosterGeneral(ROSTER_ID, 50L))
        .isInstanceOf(RosterLockedException.class);

    verify(rosterUnitRepository, never()).findOwnedUnitInRoster(any(), any(), any());
  }

  @Test
  void setsTheArmyOptions() {
    var roster = roster(ROSTER_ID);
    roster.setArmyOptionIds(
        new HashSet<>() {
          {
            add("option-a");
          }
        });

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    Set<String> armyOptionIds = Set.of("option-a", "option-b");
    compositionService.setArmyOptions(ROSTER_ID, armyOptionIds);

    assertThat(roster.getArmyOptionIds()).isEqualTo(armyOptionIds);
  }

  @Test
  void clearsTheArmyOptions() {
    var roster = roster(ROSTER_ID);
    roster.setArmyOptionIds(
        new HashSet<>() {
          {
            add("option-a");
          }
        });

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    compositionService.setArmyOptions(ROSTER_ID, emptySet());

    assertThatIterable(roster.getArmyOptionIds()).isEmpty();
  }

  @Test
  void cannotChangeArmyOptionsWhenLocked() {
    var roster = roster(ROSTER_ID);
    roster.setLocked(true);

    when(rosterRepository.findByIdAndUserId(roster.getId(), USER_ID))
        .thenReturn(Optional.of(roster));

    assertThatThrownBy(() -> compositionService.setArmyOptions(ROSTER_ID, Set.of("option-a")))
        .isInstanceOf(RosterLockedException.class);

    verify(rosterUnitRepository, never()).findOwnedUnitInRoster(any(), any(), any());
  }
}
