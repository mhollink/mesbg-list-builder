package com.mesbg.listbuilder.armies.roster.service.exception;

public class RosterGroupNotEmptyException extends RuntimeException {

  public RosterGroupNotEmptyException(Long groupId) {
    super("Roster group " + groupId + " must be empty before it can be deleted");
  }
}