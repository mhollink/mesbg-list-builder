package com.mesbg.listbuilder.armies.roster.service.statistics;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.gamedata.GameDataCatalog;
import com.mesbg.listbuilder.gamedata.model.ArmyListOptionData;
import com.mesbg.listbuilder.gamedata.model.ArmyListProfileData;
import com.mesbg.listbuilder.gamedata.model.ArmyListProfileOptionData;
import com.mesbg.listbuilder.gamedata.model.ProfileData;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RosterStatisticsCalculator {

  private final GameDataCatalog gameDataCatalog;

  public RosterStatistics calculate(RosterEntity roster) {
    var armyListId = roster.getArmyListId();

    var unitStatistics =
        roster.getWarbands().stream()
            .flatMap(warband -> warband.getUnits().stream())
            .map(unit -> calculateUnit(armyListId, unit))
            .toList();

    var unitPoints = unitStatistics.stream().mapToInt(UnitStatistics::points).sum();

    var armyOptionPoints = calculateArmyOptionPoints(roster);

    var statistics =
        new RosterStatistics(
            unitPoints + armyOptionPoints,
            roster.getWarbands().size(),
            unitStatistics.stream().mapToInt(UnitStatistics::models).sum(),
            unitStatistics.stream().mapToInt(UnitStatistics::might).sum(),
            unitStatistics.stream().mapToInt(UnitStatistics::bows).sum(),
            unitStatistics.stream().mapToInt(UnitStatistics::throwingWeapons).sum());

    log.trace(
        "Calculated roster statistics rosterId={} points={} models={} warbands={} might={} bows={} throwingWeapons={}",
        roster.getId(),
        statistics.points(),
        statistics.modelCount(),
        statistics.warbandCount(),
        statistics.might(),
        statistics.bowCount(),
        statistics.throwingWeaponCount());

    return statistics;
  }

  private UnitStatistics calculateUnit(String armyListId, RosterUnitEntity unit) {

    var armyListProfile =
        gameDataCatalog.getArmyListProfile(armyListId, unit.getArmyListProfileId());

    var profile = gameDataCatalog.getProfile(armyListProfile.profileId());

    var options = getEffectiveOptions(armyListProfile, unit);

    var quantity = unit.getQuantity();

    var points = (profile.points() + calculateOptionPoints(profile, options)) * quantity;

    var might = getMight(profile) * quantity;

    var equipment = getEffectiveEquipment(profile, armyListProfile, options);

    var countsTowardsWeaponLimits = armyListProfile.isWarrior();

    var bows = countsTowardsWeaponLimits && equipment.stream().anyMatch(this::isBow) ? quantity : 0;

    var throwingWeapons =
        countsTowardsWeaponLimits && equipment.stream().anyMatch(this::isThrowingWeapon)
            ? quantity
            : 0;

    return new UnitStatistics(points, quantity, might, bows, throwingWeapons);
  }

  private int calculateArmyOptionPoints(RosterEntity roster) {
    var armyList = gameDataCatalog.getArmyList(roster.getArmyListId());

    var selectedOptionIds = new LinkedHashSet<>(roster.getArmyOptionIds());

    armyList.options().stream()
        .filter(ArmyListOptionData::preselected)
        .map(ArmyListOptionData::id)
        .forEach(selectedOptionIds::add);

    return selectedOptionIds.stream()
        .mapToInt(
            optionId ->
                gameDataCatalog.getArmyListOption(roster.getArmyListId(), optionId).points())
        .sum();
  }

  private Set<ArmyListProfileOptionData> getEffectiveOptions(
      ArmyListProfileData armyListProfile, RosterUnitEntity unit) {

    var optionIds = new LinkedHashSet<String>();

    armyListProfile.options().stream()
        .filter(ArmyListProfileOptionData::isPreselected)
        .map(ArmyListProfileOptionData::id)
        .forEach(optionIds::add);

    optionIds.addAll(unit.getOptionIds());

    var options = new LinkedHashSet<ArmyListProfileOptionData>();

    for (var optionId : optionIds) {
      options.add(armyListProfile.getOption(optionId));
    }

    return Set.copyOf(options);
  }

  private int calculateOptionPoints(ProfileData profile, Set<ArmyListProfileOptionData> options) {

    return options.stream().mapToInt(option -> getOptionPoints(profile, option)).sum();
  }

  private int getOptionPoints(ProfileData profile, ArmyListProfileOptionData option) {

    if (option.pointsOverride() != null) {
      return option.pointsOverride();
    }

    return profile
        .findOption(option.optionId())
        .orElseThrow(
            () ->
                new IllegalArgumentException(
                    "Unknown canonical option '%s' for profile '%s'"
                        .formatted(option.optionId(), profile.profile())))
        .points();
  }

  private Set<String> getEffectiveEquipment(
      ProfileData profile,
      ArmyListProfileData armyListProfile,
      Set<ArmyListProfileOptionData> options) {

    var equipment = new HashSet<>(profile.wargear());

    armyListProfile.removedWargear().forEach(equipment::remove);

    options.stream().map(ArmyListProfileOptionData::optionId).forEach(equipment::add);

    return equipment;
  }

  private int getMight(ProfileData profile) {
    if (profile.stats() == null || profile.stats().might() == null) {
      return 0;
    }

    return Integer.parseInt(profile.stats().might());
  }

  private boolean isBow(String equipmentId) {
    return equipmentId.equals("bow")
        || equipmentId.endsWith("-bow")
        || equipmentId.equals("crossbow");
  }

  private boolean isThrowingWeapon(String equipmentId) {
    return equipmentId.startsWith("throwing-") || equipmentId.contains("-and-throwing-");
  }

  private record UnitStatistics(int points, int models, int might, int bows, int throwingWeapons) {}
}
