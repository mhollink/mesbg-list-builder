package com.mesbg.listbuilder.gamedata;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.mesbg.listbuilder.config.JsonMapperConfig;
import com.mesbg.listbuilder.gamedata.model.ArmyListData;
import com.mesbg.listbuilder.gamedata.model.ProfileData;
import java.io.IOException;
import java.util.Arrays;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import tools.jackson.databind.json.JsonMapper;

class GameDataCatalogTest {

  private static final JsonMapper MAPPER = new JsonMapperConfig().jsonMapperBuilder().build();
  private static GameDataCatalog catalog;
  private static ProfileData sampleProfile;
  private static ArmyListData sampleArmyList;

  @BeforeAll
  static void loadCatalog() throws IOException {
    catalog = new GameDataCatalog(MAPPER);

    try (var profiles = new ClassPathResource("game-data/profiles.json").getInputStream();
        var armyLists = new ClassPathResource("game-data/army-lists.json").getInputStream()) {
      sampleProfile = MAPPER.readValue(profiles, ProfileData[].class)[0];
      sampleArmyList =
          Arrays.stream(MAPPER.readValue(armyLists, ArmyListData[].class))
              .filter(list -> !list.profiles().isEmpty())
              .findFirst()
              .orElseThrow();
    }
  }

  @Test
  void retrievesExistingProfileAndArmyList() {
    assertThat(catalog.getProfile(sampleProfile.profile())).isEqualTo(sampleProfile);
    assertThat(catalog.getArmyList(sampleArmyList.id())).isEqualTo(sampleArmyList);
  }

  @Test
  void resolvesArmyListSpecificProfileAndItsCanonicalProfile() {
    var variant = sampleArmyList.profiles().getFirst();

    assertThat(catalog.getArmyListProfile(sampleArmyList.id(), variant.id())).isEqualTo(variant);
    assertThat(catalog.getProfileForArmyListProfile(sampleArmyList.id(), variant.id()))
        .isEqualTo(catalog.getProfile(variant.profileId()));
  }

  @Test
  @Disabled("There are no army list options programmed yet.")
  void retrievesArmyOptionFromCorrectArmyList() {
    var option = sampleArmyList.options().getFirst();

    assertThat(catalog.getArmyListOption(sampleArmyList.id(), option.id())).isEqualTo(option);
  }

  @Test
  void rejectsUnknownProfile() {
    assertThatThrownBy(() -> catalog.getProfile("nonexistent-profile-for-test"))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Unknown profile");
  }

  @Test
  void rejectsUnknownArmyList() {
    assertThatThrownBy(() -> catalog.getArmyList("nonexistent-army-list-for-test"))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Unknown army list");
  }

  @Test
  void rejectsUnknownProfileAndOptionWithinExistingArmyList() {
    assertThatThrownBy(
            () -> catalog.getArmyListProfile(sampleArmyList.id(), "nonexistent-variant-for-test"))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Unknown army list profile");

    assertThatThrownBy(
            () -> catalog.getArmyListOption(sampleArmyList.id(), "nonexistent-option-for-test"))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Unknown army option");
  }
}
