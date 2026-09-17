package com.mesbg.listbuilder.gamedata;

import com.mesbg.listbuilder.gamedata.model.ProfileData;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

@Component
public class GameDataCatalog {

  private final Map<String, ProfileData> profiles;

  public GameDataCatalog(JsonMapper jsonMapper) {
    this.profiles = loadProfiles(jsonMapper);
  }

  public ProfileData getProfile(String profileId) {
    var profile = profiles.get(profileId);

    if (profile == null) {
      throw new IllegalArgumentException("Unknown profile: " + profileId);
    }

    return profile;
  }

  private Map<String, ProfileData> loadProfiles(JsonMapper jsonMapper) {
    var resource = new ClassPathResource("game-data/profiles.json");

    try (var inputStream = resource.getInputStream()) {
      var profiles = jsonMapper.readValue(inputStream, ProfileData[].class);

      return Arrays.stream(profiles)
          .collect(Collectors.toUnmodifiableMap(ProfileData::profile, Function.identity()));
    } catch (IOException exception) {
      throw new IllegalStateException("Could not load profile game data", exception);
    }
  }
}
