package com.mesbg.listbuilder.armies.roster.service.exception;

public class WarbandNotFoundException extends RuntimeException {

  public WarbandNotFoundException(Long warbandId) {
    super("Warband " + warbandId + " not found");
  }
}