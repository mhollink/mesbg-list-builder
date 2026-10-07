package com.mesbg.listbuilder.gamedata.model;

public record ArmyListProfileOptionData(
    String id, String optionId, String state, Integer pointsOverride, String upgradeFrom) {

  public boolean isPreselected() {
    return "preselected".equals(state);
  }
}
