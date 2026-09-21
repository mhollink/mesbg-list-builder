package com.mesbg.listbuilder.api.error;

import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterGroupMoveException;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotEmptyException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterUnitNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.WarbandNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(RosterNotFoundException.class)
  ProblemDetail handleRosterNotFound(RosterNotFoundException exception) {
    return problem(
        HttpStatus.NOT_FOUND,
        "ROSTER_NOT_FOUND",
        "Roster not found",
        exception.getMessage());
  }

  @ExceptionHandler(RosterGroupNotFoundException.class)
  ProblemDetail handleRosterGroupNotFound(RosterGroupNotFoundException exception) {
    return problem(
        HttpStatus.NOT_FOUND,
        "ROSTER_GROUP_NOT_FOUND",
        "Roster group not found",
        exception.getMessage());
  }

  @ExceptionHandler(WarbandNotFoundException.class)
  ProblemDetail handleWarbandNotFound(WarbandNotFoundException exception) {
    return problem(
        HttpStatus.NOT_FOUND,
        "WARBAND_NOT_FOUND",
        "Warband not found",
        exception.getMessage());
  }

  @ExceptionHandler(RosterUnitNotFoundException.class)
  ProblemDetail handleRosterUnitNotFound(RosterUnitNotFoundException exception) {
    return problem(
        HttpStatus.NOT_FOUND,
        "ROSTER_UNIT_NOT_FOUND",
        "Roster unit not found",
        exception.getMessage());
  }

  @ExceptionHandler(RosterLockedException.class)
  ProblemDetail handleRosterLocked(RosterLockedException exception) {
    return problem(
        HttpStatus.CONFLICT,
        "ROSTER_LOCKED",
        "Roster locked",
        exception.getMessage());
  }

  @ExceptionHandler(RosterGroupNotEmptyException.class)
  ProblemDetail handleRosterGroupNotEmpty(RosterGroupNotEmptyException exception) {
    return problem(
        HttpStatus.CONFLICT,
        "ROSTER_GROUP_NOT_EMPTY",
        "Roster group is not empty",
        exception.getMessage());
  }

  @ExceptionHandler(InvalidRosterGroupMoveException.class)
  ProblemDetail handleInvalidRosterGroupMove(
      InvalidRosterGroupMoveException exception) {
    return problem(
        HttpStatus.CONFLICT,
        "INVALID_ROSTER_GROUP_MOVE",
        "Invalid roster group move",
        exception.getMessage());
  }

  @ExceptionHandler(RosterInvariantViolationException.class)
  ProblemDetail handleRosterInvariantViolation(
      RosterInvariantViolationException exception) {
    return problem(
        HttpStatus.CONFLICT,
        "ROSTER_INVARIANT_VIOLATION",
        "Roster constraint violated",
        exception.getMessage());
  }

  @ExceptionHandler(InvalidRosterUnitException.class)
  ProblemDetail handleInvalidRosterUnit(InvalidRosterUnitException exception) {
    return problem(
        HttpStatus.BAD_REQUEST,
        "INVALID_ROSTER_UNIT",
        "Invalid roster unit",
        exception.getMessage());
  }

  private ProblemDetail problem(
      HttpStatus status,
      String code,
      String title,
      String detail) {

    var problem = ProblemDetail.forStatusAndDetail(status, detail);

    problem.setTitle(title);
    problem.setProperty("code", code);

    return problem;
  }
}