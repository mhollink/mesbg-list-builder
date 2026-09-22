package com.mesbg.listbuilder.armies.roster.service.statistics;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.gamedata.GameDataCatalog;
import com.mesbg.listbuilder.gamedata.model.ProfileData;
import com.mesbg.listbuilder.gamedata.model.ProfileOptionData;
import com.mesbg.listbuilder.gamedata.model.ProfileStatsData;
import java.util.List;
import java.util.Set;
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

  @Mock private GameDataCatalog gameDataCatalog;

  @InjectMocks private RosterStatisticsCalculator calculator;

  @Test
  void calculatesEmptyRoster() {
    var roster = new RosterEntity();

    var result = calculator.calculate(roster);

    assertThat(result).isEqualTo(new RosterStatistics(0, 0, 0, 0, 0, 0));
  }

  @Test
  void countsEmptyWarbands() {
    var roster = new RosterEntity();

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
      var profile = profile("orc-warrior", 6, null, List.of(), List.of());
      when(gameDataCatalog.getProfile("orc-warrior")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "orc-warrior", 5, Set.of());

      var result = calculator.calculate(roster);

      assertThat(result.points()).isEqualTo(30);
      assertThat(result.modelCount()).isEqualTo(5);
    }

    @Test
    void includesSelectedOptionPointsForEveryModel() {
      var profile =
          profile(
              "orc-warrior",
              6,
              null,
              List.of(),
              List.of(new ProfileOptionData("shield", 1), new ProfileOptionData("spear", 1)));
      when(gameDataCatalog.getProfile("orc-warrior")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "orc-warrior", 5, Set.of("shield", "spear"));

      var result = calculator.calculate(roster);

      // (6 + 1 + 1) * 5
      assertThat(result.points()).isEqualTo(40);
    }

    @Test
    void ignoresPointsForUnknownOption() {
      var profile = profile("orc-warrior", 6, null, List.of(), List.of());
      when(gameDataCatalog.getProfile("orc-warrior")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "orc-warrior", 2, Set.of("unknown-option"));

      var result = calculator.calculate(roster);

      assertThat(result.points()).isEqualTo(12);
    }
  }

  @Nested
  class Might {

    @Test
    void calculatesMightForModels() {
      var profile = profile("hero", 100, "3", List.of(), List.of());
      when(gameDataCatalog.getProfile("hero")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "hero", 1, Set.of());

      var result = calculator.calculate(roster);

      assertThat(result.might()).isEqualTo(3);
    }

    @Test
    void multipliesMightByQuantity() {
      var profile = profile("might-model", 20, "1", List.of(), List.of());
      when(gameDataCatalog.getProfile("might-model")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "might-model", 3, Set.of());

      var result = calculator.calculate(roster);

      assertThat(result.might()).isEqualTo(3);
    }

    @Test
    void profileWithoutStatsHasNoMight() {
      when(gameDataCatalog.getProfile("warrior"))
          .thenReturn(profile("warrior", 10, null, List.of(), List.of()));

      var roster = new RosterEntity();
      addUnit(roster, "warrior", 4, Set.of());

      assertThat(calculator.calculate(roster).might()).isZero();
    }

    @Test
    void profileWithNullMightHasNoMight() {
      var profile =
          new ProfileData("warrior", 10, new ProfileStatsData(null), List.of(), List.of());
      when(gameDataCatalog.getProfile("warrior")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "warrior", 4, Set.of());

      assertThat(calculator.calculate(roster).might()).isZero();
    }
  }

  @Nested
  class Bows {

    @ParameterizedTest
    @ValueSource(strings = {"bow", "elf-bow", "orc-bow", "crossbow"})
    void recognizesBowFromBaseWargear(String equipment) {
      when(gameDataCatalog.getProfile("archer"))
          .thenReturn(profile("archer", 8, null, List.of(equipment), List.of()));

      var roster = new RosterEntity();
      addUnit(roster, "archer", 4, Set.of());

      assertThat(calculator.calculate(roster).bowCount()).isEqualTo(4);
    }

    @Test
    void recognizesBowFromSelectedOption() {
      when(gameDataCatalog.getProfile("warrior"))
          .thenReturn(
              profile(
                  "warrior", 7, null, List.of("sword"), List.of(new ProfileOptionData("bow", 1))));

      var roster = new RosterEntity();
      addUnit(roster, "warrior", 6, Set.of("bow"));

      assertThat(calculator.calculate(roster).bowCount()).isEqualTo(6);
    }

    @Test
    void modelWithoutBowDoesNotCountTowardsBowLimit() {
      var profile = profile("warrior", 7, null, List.of("sword", "shield"), List.of());
      when(gameDataCatalog.getProfile("warrior")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "warrior", 6, Set.of());

      assertThat(calculator.calculate(roster).bowCount()).isZero();
    }

    @Test
    void multipleBowItemsStillCountModelOnlyOnce() {
      var profile =
          profile("archer", 10, null, List.of("bow"), List.of(new ProfileOptionData("elf-bow", 2)));
      when(gameDataCatalog.getProfile("archer")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "archer", 3, Set.of("elf-bow"));

      assertThat(calculator.calculate(roster).bowCount()).isEqualTo(3);
    }
  }

  @Nested
  class ThrowingWeapons {

    @ParameterizedTest
    @ValueSource(strings = {"throwing-spears", "throwing-daggers", "sword-and-throwing-spears"})
    void recognizesThrowingWeaponFromBaseWargear(String equipment) {
      var profile = profile("warrior", 8, null, List.of(equipment), List.of());
      when(gameDataCatalog.getProfile("warrior")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "warrior", 5, Set.of());

      assertThat(calculator.calculate(roster).throwingWeaponCount()).isEqualTo(5);
    }

    @Test
    void recognizesThrowingWeaponFromSelectedOption() {
      var profile =
          profile(
              "warrior", 7, null, List.of(), List.of(new ProfileOptionData("throwing-spears", 2)));
      when(gameDataCatalog.getProfile("warrior")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "warrior", 4, Set.of("throwing-spears"));

      assertThat(calculator.calculate(roster).throwingWeaponCount()).isEqualTo(4);
    }

    @Test
    void multipleThrowingWeaponsStillCountModelOnlyOnce() {
      var profile =
          profile(
              "warrior",
              8,
              null,
              List.of("throwing-spears"),
              List.of(new ProfileOptionData("sword-and-throwing-daggers", 1)));
      when(gameDataCatalog.getProfile("warrior")).thenReturn(profile);

      var roster = new RosterEntity();
      addUnit(roster, "warrior", 3, Set.of("sword-and-throwing-daggers"));

      assertThat(calculator.calculate(roster).throwingWeaponCount()).isEqualTo(3);
    }
  }

  @Test
  void aggregatesCompleteRoster() {
    var roster = new RosterEntity();

    var hero =
        profile("hero", 50, "3", List.of("sword"), List.of(new ProfileOptionData("horse", 10)));
    when(gameDataCatalog.getProfile("hero")).thenReturn(hero);

    var archer = profile("archer", 8, null, List.of("bow"), List.of());
    when(gameDataCatalog.getProfile("archer")).thenReturn(archer);

    var thrower = profile("thrower", 9, null, List.of("throwing-spears"), List.of());
    when(gameDataCatalog.getProfile("thrower")).thenReturn(thrower);

    var firstWarband = addWarband(roster);
    addUnit(firstWarband, "hero", 1, Set.of("horse"));
    addUnit(firstWarband, "archer", 4, Set.of());

    var secondWarband = addWarband(roster);
    addUnit(secondWarband, "hero", 1, Set.of("horse"));
    addUnit(secondWarband, "thrower", 3, Set.of());

    var result = calculator.calculate(roster);
    assertThat(result).isEqualTo(new RosterStatistics(179, 2, 9, 6, 4, 3));
  }

  private ProfileData profile(
      String id, int points, String might, List<String> wargear, List<ProfileOptionData> options) {

    return new ProfileData(
        id, points, might == null ? null : new ProfileStatsData(might), wargear, options);
  }

  private RosterUnitEntity addUnit(
      RosterEntity roster, String profileId, int quantity, Set<String> optionIds) {

    var warband = addWarband(roster);

    return addUnit(warband, profileId, quantity, optionIds);
  }

  private WarbandEntity addWarband(RosterEntity roster) {
    var warband = new WarbandEntity(roster, roster.getWarbands().size());

    roster.getWarbands().add(warband);

    return warband;
  }

  private RosterUnitEntity addUnit(
      WarbandEntity warband, String profileId, int quantity, Set<String> optionIds) {

    var unit = new RosterUnitEntity(warband, profileId, quantity, false, warband.getUnits().size());

    unit.getOptionIds().addAll(optionIds);
    warband.getUnits().add(unit);

    return unit;
  }
}
