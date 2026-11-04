package com.mesbg.listbuilder.armies.roster.service;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.ROSTER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.roster;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.unit;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.warband;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterFollowerBatchServiceTest {

  @Mock private RosterAccess access;
  @Mock private RosterUnitRepository repository;

  private FollowerLoadoutReconciler reconciler;
  private RosterUnitsService service;

  @BeforeEach
  void setUp() {
    reconciler = new FollowerLoadoutReconciler(repository);
    service = new RosterUnitsService(access, repository, reconciler);
  }

  private RosterUnitsService.FollowerLoadout loadout(int quantity, String... options) {
    return new RosterUnitsService.FollowerLoadout(quantity, Set.of(options));
  }

  @Test
  void createsTwoConfigurationsWithoutTouchingAnotherProfile() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var other = unit(warband, 50L, "another-profile", 4, false, 1);
    when(access.requireEditable(ROSTER_ID)).thenReturn(roster);
    when(access.requireWarband(40L, ROSTER_ID)).thenReturn(warband);
    when(repository.save(any(RosterUnitEntity.class))).thenAnswer(inv -> inv.getArgument(0));

    var saved =
        service.replaceFollowerLoadouts(
            ROSTER_ID, 40L, "warrior", List.of(loadout(2, "shield"), loadout(3, "bow", "upgrade")));

    assertThat(saved).hasSize(2);
    assertThat(saved.get(0).getOptionIds()).containsExactly("shield");
    assertThat(saved.get(1).getQuantity()).isEqualTo(3);
    assertThat(warband.getUnits()).contains(other).containsAll(saved);
    assertThat(roster.getUpdatedAt()).isNotNull();
  }

  @Test
  void preservesMatchingIdsAndReusesOtherIdsForChangedEquipment() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var regular = unit(warband, 50L, "warrior", 2, false, 1);
    regular.getOptionIds().add("shield");
    var upgraded = unit(warband, 51L, "warrior", 3, false, 2);
    upgraded.getOptionIds().add("bow");
    when(access.requireEditable(ROSTER_ID)).thenReturn(roster);
    when(access.requireWarband(40L, ROSTER_ID)).thenReturn(warband);

    var saved =
        service.replaceFollowerLoadouts(
            ROSTER_ID, 40L, "warrior", List.of(loadout(5, "shield"), loadout(1, "bow", "upgrade")));

    assertThat(saved).containsExactly(regular, upgraded);
    assertThat(regular.getQuantity()).isEqualTo(5);
    assertThat(upgraded.getOptionIds()).containsExactlyInAnyOrder("bow", "upgrade");
    assertThat(upgraded.getQuantity()).isEqualTo(1);
  }

  @Test
  void deletingAllVariantsDoesNotRemoveOtherProfilesOrTheLeader() {
    var roster = roster(ROSTER_ID);
    var warband = warband(roster, 40L, 0);
    var leader = unit(warband, 48L, "hero", 1, true, 0);
    var regular = unit(warband, 50L, "warrior", 2, false, 1);
    var another = unit(warband, 51L, "another", 3, false, 2);
    when(access.requireEditable(ROSTER_ID)).thenReturn(roster);
    when(access.requireWarband(40L, ROSTER_ID)).thenReturn(warband);

    var saved = service.replaceFollowerLoadouts(ROSTER_ID, 40L, "warrior", List.of());

    assertThat(saved).isEmpty();
    assertThat(warband.getUnits()).containsExactly(leader, another);
    assertThat(warband.getUnits()).doesNotContain(regular);
  }

  @Test
  void rejectsDuplicateLoadoutsBeforeModifyingData() {
    assertThatThrownBy(
            () ->
                service.replaceFollowerLoadouts(
                    ROSTER_ID, 40L, "warrior", List.of(loadout(2, "shield"), loadout(1, "shield"))))
        .isInstanceOf(InvalidRosterUnitException.class);
    verifyNoInteractions(access, repository);
  }

  @Test
  void rejectsInvalidQuantityBeforeModifyingData() {
    assertThatThrownBy(
            () ->
                service.replaceFollowerLoadouts(
                    ROSTER_ID, 40L, "warrior", List.of(loadout(0, "shield"))))
        .isInstanceOf(InvalidRosterUnitException.class);
    verifyNoInteractions(access, repository);
  }
}
