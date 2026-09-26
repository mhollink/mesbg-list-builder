package com.mesbg.listbuilder.armies.roster.service.exception;

public class InvalidWarbandPositionException extends RuntimeException {
  public InvalidWarbandPositionException(int position) {
    super("Position " + position + " is out of range.");
  }
}
