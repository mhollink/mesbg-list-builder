package com.mesbg.listbuilder.armies.roster.service.exception;

public class RosterNotFoundException extends RuntimeException {

  public RosterNotFoundException(Long rosterId) {
    super("Roster " + rosterId + " not found");
  }
}