package com.mesbg.listbuilder.gamedata;

import com.mesbg.listbuilder.gamedata.model.ArmyListData;
import com.mesbg.listbuilder.gamedata.model.ArmyListOptionData;
import com.mesbg.listbuilder.gamedata.model.ArmyListProfileData;
import com.mesbg.listbuilder.gamedata.model.ProfileData;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

@Component
@Slf4j
public class GameDataCatalog {

  private static final String PROFILES_RESOURCE = "game-data/profiles.json";
  private static final String ARMY_LISTS_RESOURCE = "game-data/army-lists.json";

  private final Map<String, ProfileData> profiles;
  private final Map<String, ArmyListData> armyLists;
  private final Map<String, Map<String, ArmyListProfileData>> armyListProfiles;
  private final Map<String, Map<String, ArmyListOptionData>> armyListOptions;

  public GameDataCatalog(JsonMapper jsonMapper) {
    log.debug(
        "Loading game data profilesResource={} armyListsResource={}",
        PROFILES_RESOURCE,
        ARMY_LISTS_RESOURCE);

    var loadedProfiles = load(jsonMapper, PROFILES_RESOURCE, ProfileData[].class);
    var loadedArmyLists = load(jsonMapper, ARMY_LISTS_RESOURCE, ArmyListData[].class);

    this.profiles = indexBy(loadedProfiles, ProfileData::profile);
    this.armyLists = indexBy(loadedArmyLists, ArmyListData::id);

    this.armyListProfiles =
        loadedArmyLists.stream()
            .collect(
                Collectors.toUnmodifiableMap(
                    ArmyListData::id,
                    armyList -> indexBy(armyList.profiles(), ArmyListProfileData::id)));

    this.armyListOptions =
        loadedArmyLists.stream()
            .collect(
                Collectors.toUnmodifiableMap(
                    ArmyListData::id,
                    armyList -> indexBy(armyList.options(), ArmyListOptionData::id)));

    var armyListProfileCount = this.armyListProfiles.values().stream().mapToInt(Map::size).sum();
    var armyListOptionCount = this.armyListOptions.values().stream().mapToInt(Map::size).sum();

    log.info(
        "Loaded game data profiles={} armyLists={} armyListProfiles={} armyListOptions={}",
        this.profiles.size(),
        this.armyLists.size(),
        armyListProfileCount,
        armyListOptionCount);
  }

  public ProfileData getProfile(String profileId) {
    var profile = profiles.get(profileId);

    if (profile == null) {
      throw new IllegalArgumentException("Unknown profile: " + profileId);
    }

    return profile;
  }

  public ArmyListData getArmyList(String armyListId) {
    var armyList = armyLists.get(armyListId);

    if (armyList == null) {
      throw new IllegalArgumentException("Unknown army list: " + armyListId);
    }

    return armyList;
  }

  public ArmyListProfileData getArmyListProfile(String armyListId, String armyListProfileId) {

    getArmyList(armyListId);

    var profile = armyListProfiles.get(armyListId).get(armyListProfileId);

    if (profile == null) {
      throw new IllegalArgumentException(
          "Unknown army list profile '%s' for army list '%s'"
              .formatted(armyListProfileId, armyListId));
    }

    return profile;
  }

  public ProfileData getProfileForArmyListProfile(String armyListId, String armyListProfileId) {

    var armyListProfile = getArmyListProfile(armyListId, armyListProfileId);

    return getProfile(armyListProfile.profileId());
  }

  public ArmyListOptionData getArmyListOption(String armyListId, String armyListOptionId) {

    getArmyList(armyListId);

    var option = armyListOptions.get(armyListId).get(armyListOptionId);

    if (option == null) {
      throw new IllegalArgumentException(
          "Unknown army option '%s' for army list '%s'".formatted(armyListOptionId, armyListId));
    }

    return option;
  }

  private <T> List<T> load(JsonMapper jsonMapper, String resourcePath, Class<T[]> type) {

    var resource = new ClassPathResource(resourcePath);

    try (var inputStream = resource.getInputStream()) {
      return List.of(jsonMapper.readValue(inputStream, type));
    } catch (IOException exception) {
      log.error("Failed to load game data resource={}", resourcePath, exception);
      throw new IllegalStateException("Could not load game data from " + resourcePath, exception);
    }
  }

  private <T> Map<String, T> indexBy(List<T> values, Function<T, String> idExtractor) {

    return values.stream().collect(Collectors.toUnmodifiableMap(idExtractor, Function.identity()));
  }
}
