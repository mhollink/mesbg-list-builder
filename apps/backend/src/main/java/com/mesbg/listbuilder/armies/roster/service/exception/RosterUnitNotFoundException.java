package com.mesbg.listbuilder.armies.roster.service.exception;

public class RosterUnitNotFoundException extends RuntimeException {

  public RosterUnitNotFoundException(Long unitId) {
    super("Unit selection " + unitId + " not found");
  }
}
