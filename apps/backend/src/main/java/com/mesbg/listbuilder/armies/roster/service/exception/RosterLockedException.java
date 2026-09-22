package com.mesbg.listbuilder.armies.roster.service.exception;

public class RosterLockedException extends RuntimeException {

  public RosterLockedException(Long rosterId) {
    super("Roster " + rosterId + " is locked and cannot be modified");
  }
}
