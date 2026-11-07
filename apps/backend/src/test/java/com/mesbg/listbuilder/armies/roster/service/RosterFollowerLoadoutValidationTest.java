package com.mesbg.listbuilder.armies.roster.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;

import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterFollowerLoadoutValidationTest {

  @Mock private RosterAccess access;
  @Mock private RosterUnitRepository repository;
  @Mock private FollowerLoadoutReconciler reconciler;

  private RosterUnitsService service;

  @BeforeEach
  void setUp() {
    service = new RosterUnitsService(access, repository, reconciler);
  }

  @Test
  void rejectsBlankProfileBeforeAccessingRoster() {
    assertInvalid(() -> service.replaceFollowerLoadouts(20L, 40L, " ", List.of()));
  }

  @Test
  void rejectsNullLoadoutCollectionBeforeAccessingRoster() {
    assertInvalid(() -> service.replaceFollowerLoadouts(20L, 40L, "warrior", null));
  }

  @Test
  void rejectsNullLoadoutEntryBeforeAccessingRoster() {
    assertInvalid(
        () ->
            service.replaceFollowerLoadouts(
                20L, 40L, "warrior", java.util.Collections.singletonList(null)));
  }

  @Test
  void rejectsNullOptionSetBeforeAccessingRoster() {
    assertInvalid(
        () ->
            service.replaceFollowerLoadouts(
                20L, 40L, "warrior", List.of(new RosterUnitsService.FollowerLoadout(1, null))));
  }

  @Test
  void rejectsNullOptionIdBeforeAccessingRoster() {
    var options = new HashSet<>(Arrays.asList("shield", null));
    assertInvalid(
        () ->
            service.replaceFollowerLoadouts(
                20L, 40L, "warrior", List.of(new RosterUnitsService.FollowerLoadout(1, options))));
  }

  private void assertInvalid(Runnable action) {
    assertThatThrownBy(action::run).isInstanceOf(InvalidRosterUnitException.class);
    verifyNoInteractions(access, repository, reconciler);
  }
}
