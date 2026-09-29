package com.mesbg.listbuilder.gamedata.model;

import java.util.List;

public record ArmyListData(
    String id, List<ArmyListProfileData> profiles, List<ArmyListOptionData> options) {

  public ArmyListData {
    profiles = profiles == null ? List.of() : List.copyOf(profiles);
    options = options == null ? List.of() : List.copyOf(options);
  }
}
