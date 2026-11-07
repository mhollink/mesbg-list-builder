package com.mesbg.listbuilder.api.error;

import static org.assertj.core.api.Assertions.assertThat;

import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterGroupMoveException;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotEmptyException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterUnitNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.WarbandNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.ProblemDetail;

class ApiExceptionHandlerTest {

  private final ApiExceptionHandler handler = new ApiExceptionHandler();

  @Test
  void mapsMissingRosterToNotFound() {
    assertProblem(
        handler.handleRosterNotFound(new RosterNotFoundException(1L)), 404, "ROSTER_NOT_FOUND");
  }

  @Test
  void mapsMissingGroupToNotFound() {
    assertProblem(
        handler.handleRosterGroupNotFound(new RosterGroupNotFoundException(1L)),
        404,
        "ROSTER_GROUP_NOT_FOUND");
  }

  @Test
  void mapsMissingWarbandToNotFound() {
    assertProblem(
        handler.handleWarbandNotFound(new WarbandNotFoundException(1L)), 404, "WARBAND_NOT_FOUND");
  }

  @Test
  void mapsMissingUnitToNotFound() {
    assertProblem(
        handler.handleRosterUnitNotFound(new RosterUnitNotFoundException(1L)),
        404,
        "ROSTER_UNIT_NOT_FOUND");
  }

  @Test
  void mapsLockedRosterToConflict() {
    assertProblem(handler.handleRosterLocked(new RosterLockedException(1L)), 409, "ROSTER_LOCKED");
  }

  @Test
  void mapsNonemptyGroupToConflict() {
    assertProblem(
        handler.handleRosterGroupNotEmpty(new RosterGroupNotEmptyException(1L)),
        409,
        "ROSTER_GROUP_NOT_EMPTY");
  }

  @Test
  void mapsInvalidGroupMoveToConflict() {
    assertProblem(
        handler.handleInvalidRosterGroupMove(new InvalidRosterGroupMoveException("Cycle")),
        409,
        "INVALID_ROSTER_GROUP_MOVE");
  }

  @Test
  void mapsRosterInvariantViolationToConflict() {
    assertProblem(
        handler.handleRosterInvariantViolation(new RosterInvariantViolationException("Invalid")),
        409,
        "ROSTER_INVARIANT_VIOLATION");
  }

  @Test
  void mapsInvalidUnitToBadRequest() {
    assertProblem(
        handler.handleInvalidRosterUnit(new InvalidRosterUnitException("Invalid")),
        400,
        "INVALID_ROSTER_UNIT");
  }

  private void assertProblem(ProblemDetail problem, int status, String code) {
    assertThat(problem.getStatus()).isEqualTo(status);
    assertThat(problem.getProperties()).containsEntry("code", code);
    assertThat(problem.getTitle()).isNotBlank();
    assertThat(problem.getDetail()).isNotBlank();
  }
}
