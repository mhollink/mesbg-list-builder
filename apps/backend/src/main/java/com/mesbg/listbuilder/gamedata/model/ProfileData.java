package com.mesbg.listbuilder.gamedata.model;

import java.util.List;
import java.util.Optional;

public record ProfileData(
    String profile, int points, List<String> wargear, List<ProfileOptionData> options) {

  public ProfileData {
    wargear = wargear == null ? List.of() : List.copyOf(wargear);
    options = options == null ? List.of() : List.copyOf(options);
  }

  public Optional<ProfileOptionData> findOption(String optionId) {
    return options.stream().filter(option -> option.id().equals(optionId)).findFirst();
  }
}
