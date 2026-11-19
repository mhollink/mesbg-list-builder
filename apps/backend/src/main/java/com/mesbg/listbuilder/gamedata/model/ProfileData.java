package com.mesbg.listbuilder.gamedata.model;

import java.util.List;
import java.util.Optional;

public record ProfileData(
    String profile,
    int points,
    ProfileStatsData stats,
    List<String> wargear,
    List<ProfileOptionData> options,
    List<String> unitTypes) {

  public ProfileData {
    wargear = wargear == null ? List.of() : List.copyOf(wargear);
    options = options == null ? List.of() : List.copyOf(options);
    unitTypes = unitTypes == null ? List.of() : List.copyOf(unitTypes);
  }

  public Optional<ProfileOptionData> findOption(String optionId) {
    return options.stream().filter(option -> option.id().equals(optionId)).findFirst();
  }

  public boolean isUnique() {
    return unitTypes != null && unitTypes.contains("unique");
  }
}
