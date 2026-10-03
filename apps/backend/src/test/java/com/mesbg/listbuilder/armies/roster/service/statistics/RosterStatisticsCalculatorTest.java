package com.mesbg.listbuilder.armies.roster.service.statistics;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.gamedata.GameDataCatalog;
import com.mesbg.listbuilder.gamedata.model.ArmyListData;
import com.mesbg.listbuilder.gamedata.model.ArmyListOptionData;
import com.mesbg.listbuilder.gamedata.model.ArmyListProfileData;
import com.mesbg.listbuilder.gamedata.model.ArmyListProfileOptionData;
import com.mesbg.listbuilder.gamedata.model.ArmyListProfileOverridesData;
import com.mesbg.listbuilder.gamedata.model.ProfileData;
import com.mesbg.listbuilder.gamedata.model.ProfileOptionData;
import com.mesbg.listbuilder.gamedata.model.ProfileStatsData;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterStatisticsCalculatorTest {

  private static final String ARMY_LIST_ID = "test-army-list";

  @Mock private GameDataCatalog gameDataCatalog;

  @InjectMocks private RosterStatisticsCalculator calculator;

  @BeforeEach
  void setUp() {
    lenient().when(gameDataCatalog.getArmyList(ARMY_LIST_ID)).thenReturn(armyList(List.of()));
  }

  @Test
  void calculatesEmptyRoster() {
    var result = calculator.calculate(roster());

    assertThat(result).isEqualTo(new RosterStatistics(0, 0, 0, 0, 0, 0));
  }

  @Test
  void countsEmptyWarbands() {
    var roster = roster();

    addWarband(roster);
    addWarband(roster);

    var result = calculator.calculate(roster);

    assertThat(result.warbandCount()).isEqualTo(2);
    assertThat(result.modelCount()).isZero();
  }

  @Nested
  class Points {

    @Test
    void calculatesProfilePointsForQuantity() {
      stubArmyListProfile("orc-warrior", "orc-warrior", "warrior", List.of());

      when(gameDataCatalog.getProfile("orc-warrior"))
          .thenReturn(profile("orc-warrior", 6, null, List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "orc-warrior", 5, Set.of());

      var result = calculator.calculate(roster);

      assertThat(result.points()).isEqualTo(30);
      assertThat(result.modelCount()).isEqualTo(5);
    }

    @Test
    void usesCanonicalOptionPointsWhenThereIsNoOverride() {
      var shield = armyListProfileOption("shield", "shield", "available", null);

      stubArmyListProfile("orc-warrior", "orc-warrior", "warrior", List.of(shield));

      when(gameDataCatalog.getProfile("orc-warrior"))
          .thenReturn(
              profile(
                  "orc-warrior", 6, null, List.of(), List.of(new ProfileOptionData("shield", 1))));

      var roster = roster();

      addUnit(roster, "orc-warrior", 5, Set.of("shield"));

      assertThat(calculator.calculate(roster).points()).isEqualTo(35);
    }

    @Test
    void usesPointsOverrideInsteadOfCanonicalOptionPoints() {
      var shield = armyListProfileOption("shield", "shield", "available", 2);

      stubArmyListProfile("orc-warrior", "orc-warrior", "warrior", List.of(shield));

      when(gameDataCatalog.getProfile("orc-warrior"))
          .thenReturn(
              profile(
                  "orc-warrior", 6, null, List.of(), List.of(new ProfileOptionData("shield", 1))));

      var roster = roster();

      addUnit(roster, "orc-warrior", 5, Set.of("shield"));

      // (6 base + 2 overridden shield) * 5
      assertThat(calculator.calculate(roster).points()).isEqualTo(40);
    }

    @Test
    void respectsExplicitZeroPointsOverride() {
      var orcrist = armyListProfileOption("orcrist", "orcrist", "available", 0);

      stubArmyListProfile("legolas", "legolas", "hero-of-valour", List.of(orcrist));

      when(gameDataCatalog.getProfile("legolas"))
          .thenReturn(
              profile(
                  "legolas", 100, "3", List.of(), List.of(new ProfileOptionData("orcrist", 10))));

      var roster = roster();

      addUnit(roster, "legolas", 1, Set.of("orcrist"));

      assertThat(calculator.calculate(roster).points()).isEqualTo(100);
    }

    @Test
    void supportsArmyListOnlyOptionWithPointsOverride() {
      var upgrade =
          armyListProfileOption(
              "upgrade-to-guardians-of-the-king",
              "upgrade-to-guardians-of-the-king",
              "available",
              1);

      stubArmyListProfile(
          "grim-hammer-warrior", "grim-hammer-warrior", "warrior", List.of(upgrade));

      when(gameDataCatalog.getProfile("grim-hammer-warrior"))
          .thenReturn(profile("grim-hammer-warrior", 11, null, List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "grim-hammer-warrior", 4, Set.of("upgrade-to-guardians-of-the-king"));

      assertThat(calculator.calculate(roster).points()).isEqualTo(48);
    }

    @Test
    void includesPreselectedProfileOptions() {
      var armour = armyListProfileOption("armour", "armour", "preselected", 5);

      stubArmyListProfile("captain", "captain", "hero-of-fortitude", List.of(armour));

      when(gameDataCatalog.getProfile("captain"))
          .thenReturn(profile("captain", 50, "2", List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "captain", 1, Set.of());

      assertThat(calculator.calculate(roster).points()).isEqualTo(55);
    }

    @Test
    void doesNotDoubleCountPersistedPreselectedProfileOption() {
      var armour = armyListProfileOption("armour", "armour", "preselected", 5);

      stubArmyListProfile("captain", "captain", "hero-of-fortitude", List.of(armour));

      when(gameDataCatalog.getProfile("captain"))
          .thenReturn(profile("captain", 50, "2", List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "captain", 1, Set.of("armour"));

      assertThat(calculator.calculate(roster).points()).isEqualTo(55);
    }

    @Test
    void failsForOptionWithoutOverrideOrCanonicalDefinition() {
      var unknown = armyListProfileOption("unknown", "unknown", "available", null);

      stubArmyListProfile("warrior", "warrior", "warrior", List.of(unknown));

      when(gameDataCatalog.getProfile("warrior"))
          .thenReturn(profile("warrior", 10, null, List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "warrior", 1, Set.of("unknown"));

      assertThatThrownBy(() -> calculator.calculate(roster))
          .isInstanceOf(IllegalArgumentException.class)
          .hasMessage("Unknown canonical option 'unknown' for profile 'warrior'");
    }
  }

  @Nested
  class ArmyOptions {

    @Test
    void includesActualArmyOptionPoints() {
      var campfire = new ArmyListOptionData("campfire", 50, false);

      var cheapOption = new ArmyListOptionData("cheap-option", 10, false);

      when(gameDataCatalog.getArmyList(ARMY_LIST_ID))
          .thenReturn(armyList(List.of(campfire, cheapOption)));

      when(gameDataCatalog.getArmyListOption(ARMY_LIST_ID, "campfire")).thenReturn(campfire);

      when(gameDataCatalog.getArmyListOption(ARMY_LIST_ID, "cheap-option")).thenReturn(cheapOption);

      var roster = roster();

      roster.getArmyOptionIds().addAll(Set.of("campfire", "cheap-option"));

      assertThat(calculator.calculate(roster).points()).isEqualTo(60);
    }

    @Test
    void includesPreselectedArmyOptions() {
      var mandatory = new ArmyListOptionData("mandatory", 25, true);

      when(gameDataCatalog.getArmyList(ARMY_LIST_ID)).thenReturn(armyList(List.of(mandatory)));

      when(gameDataCatalog.getArmyListOption(ARMY_LIST_ID, "mandatory")).thenReturn(mandatory);

      var roster = roster();

      assertThat(calculator.calculate(roster).points()).isEqualTo(25);
    }

    @Test
    void doesNotDoubleCountPersistedPreselectedArmyOption() {
      var mandatory = new ArmyListOptionData("mandatory", 25, true);

      when(gameDataCatalog.getArmyList(ARMY_LIST_ID)).thenReturn(armyList(List.of(mandatory)));

      when(gameDataCatalog.getArmyListOption(ARMY_LIST_ID, "mandatory")).thenReturn(mandatory);

      var roster = roster();

      roster.getArmyOptionIds().add("mandatory");

      assertThat(calculator.calculate(roster).points()).isEqualTo(25);
    }
  }

  @Nested
  class Might {

    @Test
    void calculatesMight() {
      stubArmyListProfile("hero", "hero", "hero-of-fortitude", List.of());

      when(gameDataCatalog.getProfile("hero"))
          .thenReturn(profile("hero", 100, "3", List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "hero", 1, Set.of());

      assertThat(calculator.calculate(roster).might()).isEqualTo(3);
    }

    @Test
    void multipliesMightByQuantity() {
      stubArmyListProfile("might-model", "might-model", "warrior", List.of());

      when(gameDataCatalog.getProfile("might-model"))
          .thenReturn(profile("might-model", 20, "1", List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "might-model", 3, Set.of());

      assertThat(calculator.calculate(roster).might()).isEqualTo(3);
    }

    @Test
    void profileWithoutStatsHasNoMight() {
      stubArmyListProfile("warrior", "warrior", "warrior", List.of());

      when(gameDataCatalog.getProfile("warrior"))
          .thenReturn(profile("warrior", 10, null, List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "warrior", 4, Set.of());

      assertThat(calculator.calculate(roster).might()).isZero();
    }

    @Test
    void profileWithNullMightHasNoMight() {
      stubArmyListProfile("warrior", "warrior", "warrior", List.of());

      when(gameDataCatalog.getProfile("warrior"))
          .thenReturn(
              new ProfileData("warrior", 10, new ProfileStatsData(null), List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "warrior", 4, Set.of());

      assertThat(calculator.calculate(roster).might()).isZero();
    }
  }

  @Nested
  class Bows {

    @ParameterizedTest
    @ValueSource(strings = {"bow", "elf-bow", "orc-bow", "crossbow"})
    void recognizesBowFromBaseWargear(String equipment) {
      stubArmyListProfile("archer", "archer", "warrior", List.of());

      when(gameDataCatalog.getProfile("archer"))
          .thenReturn(profile("archer", 8, null, List.of(equipment), List.of()));

      var roster = roster();

      addUnit(roster, "archer", 4, Set.of());

      assertThat(calculator.calculate(roster).bowCount()).isEqualTo(4);
    }

    @Test
    void recognizesBowFromSelectedArmyListOption() {
      var bow = armyListProfileOption("bow", "bow", "available", 1);

      stubArmyListProfile("warrior", "warrior", "warrior", List.of(bow));

      when(gameDataCatalog.getProfile("warrior"))
          .thenReturn(profile("warrior", 7, null, List.of("sword"), List.of()));

      var roster = roster();

      addUnit(roster, "warrior", 6, Set.of("bow"));

      assertThat(calculator.calculate(roster).bowCount()).isEqualTo(6);
    }

    @Test
    void doesNotCountHeroBowsTowardsLimit() {
      stubArmyListProfile("ranger-hero", "ranger", "minor-hero", List.of());

      when(gameDataCatalog.getProfile("ranger"))
          .thenReturn(profile("ranger", 30, "1", List.of("bow"), List.of()));

      var roster = roster();

      addUnit(roster, "ranger-hero", 1, Set.of());

      assertThat(calculator.calculate(roster).bowCount()).isZero();
    }

    @Test
    void respectsRemovedWargear() {
      stubArmyListProfile(
          "archer-without-bow",
          "archer",
          "warrior",
          List.of(),
          new ArmyListProfileOverridesData(List.of("bow")));

      when(gameDataCatalog.getProfile("archer"))
          .thenReturn(profile("archer", 8, null, List.of("bow"), List.of()));

      var roster = roster();

      addUnit(roster, "archer-without-bow", 4, Set.of());

      assertThat(calculator.calculate(roster).bowCount()).isZero();
    }

    @Test
    void distinguishesArmyListVariantsOfSameCanonicalProfile() {
      stubArmyListProfile("ranger-hero", "ranger", "minor-hero", List.of());

      stubArmyListProfile("ranger-warrior", "ranger", "warrior", List.of());

      when(gameDataCatalog.getProfile("ranger"))
          .thenReturn(profile("ranger", 25, "1", List.of("bow"), List.of()));

      var roster = roster();
      var warband = addWarband(roster);

      addUnit(warband, "ranger-hero", 1, Set.of());

      addUnit(warband, "ranger-warrior", 3, Set.of());

      var result = calculator.calculate(roster);

      assertThat(result.modelCount()).isEqualTo(4);
      assertThat(result.bowCount()).isEqualTo(3);
    }
  }

  @Nested
  class ThrowingWeapons {

    @ParameterizedTest
    @ValueSource(strings = {"throwing-spears", "throwing-daggers", "sword-and-throwing-spears"})
    void recognizesThrowingWeaponFromBaseWargear(String equipment) {

      stubArmyListProfile("warrior", "warrior", "warrior", List.of());

      when(gameDataCatalog.getProfile("warrior"))
          .thenReturn(profile("warrior", 8, null, List.of(equipment), List.of()));

      var roster = roster();

      addUnit(roster, "warrior", 5, Set.of());

      assertThat(calculator.calculate(roster).throwingWeaponCount()).isEqualTo(5);
    }

    @Test
    void recognizesThrowingWeaponFromSelectedOption() {
      var throwingSpears =
          armyListProfileOption("throwing-spears", "throwing-spears", "available", 2);

      stubArmyListProfile("warrior", "warrior", "warrior", List.of(throwingSpears));

      when(gameDataCatalog.getProfile("warrior"))
          .thenReturn(profile("warrior", 7, null, List.of(), List.of()));

      var roster = roster();

      addUnit(roster, "warrior", 4, Set.of("throwing-spears"));

      assertThat(calculator.calculate(roster).throwingWeaponCount()).isEqualTo(4);
    }

    @Test
    void doesNotCountHeroThrowingWeaponsTowardsLimit() {
      stubArmyListProfile("hero", "hero", "hero-of-fortitude", List.of());

      when(gameDataCatalog.getProfile("hero"))
          .thenReturn(profile("hero", 50, "2", List.of("throwing-spears"), List.of()));

      var roster = roster();

      addUnit(roster, "hero", 1, Set.of());

      assertThat(calculator.calculate(roster).throwingWeaponCount()).isZero();
    }
  }

  @Test
  void aggregatesCompleteRoster() {
    var horse = armyListProfileOption("horse", "horse", "available", null);

    stubArmyListProfile("hero", "hero", "hero-of-fortitude", List.of(horse));

    stubArmyListProfile("archer", "archer", "warrior", List.of());

    stubArmyListProfile("thrower", "thrower", "warrior", List.of());

    when(gameDataCatalog.getProfile("hero"))
        .thenReturn(
            profile(
                "hero", 50, "3", List.of("sword"), List.of(new ProfileOptionData("horse", 10))));

    when(gameDataCatalog.getProfile("archer"))
        .thenReturn(profile("archer", 8, null, List.of("bow"), List.of()));

    when(gameDataCatalog.getProfile("thrower"))
        .thenReturn(profile("thrower", 9, null, List.of("throwing-spears"), List.of()));

    var roster = roster();

    var firstWarband = addWarband(roster);

    addUnit(firstWarband, "hero", 1, Set.of("horse"));

    addUnit(firstWarband, "archer", 4, Set.of());

    var secondWarband = addWarband(roster);

    addUnit(secondWarband, "hero", 1, Set.of("horse"));

    addUnit(secondWarband, "thrower", 3, Set.of());

    var result = calculator.calculate(roster);

    assertThat(result).isEqualTo(new RosterStatistics(179, 2, 9, 6, 4, 3));
  }

  private RosterEntity roster() {
    var roster = new RosterEntity();

    roster.setArmyListId(ARMY_LIST_ID);

    return roster;
  }

  private void stubArmyListProfile(
      String armyListProfileId,
      String profileId,
      String tier,
      List<ArmyListProfileOptionData> options) {

    stubArmyListProfile(armyListProfileId, profileId, tier, options, null);
  }

  private void stubArmyListProfile(
      String armyListProfileId,
      String profileId,
      String tier,
      List<ArmyListProfileOptionData> options,
      ArmyListProfileOverridesData overrides) {

    when(gameDataCatalog.getArmyListProfile(ARMY_LIST_ID, armyListProfileId))
        .thenReturn(
            new ArmyListProfileData(armyListProfileId, profileId, tier, options, overrides));
  }

  private ArmyListProfileOptionData armyListProfileOption(
      String id, String optionId, String state, Integer pointsOverride) {

    return new ArmyListProfileOptionData(id, optionId, state, pointsOverride, null);
  }

  private ArmyListData armyList(List<ArmyListOptionData> options) {

    return new ArmyListData(ARMY_LIST_ID, List.of(), options);
  }

  private ProfileData profile(
      String id, int points, String might, List<String> wargear, List<ProfileOptionData> options) {

    return new ProfileData(
        id, points, might == null ? null : new ProfileStatsData(might), wargear, options);
  }

  private RosterUnitEntity addUnit(
      RosterEntity roster, String armyListProfileId, int quantity, Set<String> optionIds) {

    var warband = addWarband(roster);

    return addUnit(warband, armyListProfileId, quantity, optionIds);
  }

  private WarbandEntity addWarband(RosterEntity roster) {

    var warband = new WarbandEntity(roster, roster.getWarbands().size());

    roster.getWarbands().add(warband);

    return warband;
  }

  private RosterUnitEntity addUnit(
      WarbandEntity warband, String armyListProfileId, int quantity, Set<String> optionIds) {

    var unit =
        new RosterUnitEntity(
            warband, armyListProfileId, quantity, false, warband.getUnits().size());

    unit.getOptionIds().addAll(optionIds);
    warband.getUnits().add(unit);

    return unit;
  }
}
