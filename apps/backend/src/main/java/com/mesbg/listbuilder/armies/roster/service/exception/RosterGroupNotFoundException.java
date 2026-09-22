package com.mesbg.listbuilder.armies.roster.service.exception;

public class RosterGroupNotFoundException extends RuntimeException {

  public RosterGroupNotFoundException(Long groupId) {
    super("Roster group " + groupId + " not found");
  }
}
