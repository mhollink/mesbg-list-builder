package com.mesbg.listbuilder.gamedata.model;

import java.util.List;

public record ArmyListProfileData(
    String id,
    String profileId,
    String tier,
    List<ArmyListProfileOptionData> options,
    ArmyListProfileOverridesData overrides) {

  public ArmyListProfileData {
    options = options == null ? List.of() : List.copyOf(options);
  }

  public ArmyListProfileOptionData getOption(String optionId) {
    return options.stream()
        .filter(option -> option.id().equals(optionId))
        .findFirst()
        .orElseThrow(
            () ->
                new IllegalArgumentException(
                    "Unknown option '%s' for army list profile '%s'".formatted(optionId, id)));
  }

  public boolean isWarrior() {
    return "warrior".equals(tier);
  }

  public List<String> removedWargear() {
    return overrides == null ? List.of() : overrides.removeWargear();
  }
}
