package com.mesbg.listbuilder.gamedata.model;

import java.util.List;

public record ArmyListProfileOverridesData(List<String> removeWargear) {

  public ArmyListProfileOverridesData {
    removeWargear = removeWargear == null ? List.of() : List.copyOf(removeWargear);
  }
}
