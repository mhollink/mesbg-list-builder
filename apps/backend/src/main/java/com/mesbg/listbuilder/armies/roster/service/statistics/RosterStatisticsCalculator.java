package com.mesbg.listbuilder.armies.roster.service.statistics;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.gamedata.GameDataCatalog;
import com.mesbg.listbuilder.gamedata.model.ProfileData;
import com.mesbg.listbuilder.gamedata.model.ProfileOptionData;
import java.util.HashSet;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RosterStatisticsCalculator {

  private final GameDataCatalog gameDataCatalog;

  public RosterStatistics calculate(RosterEntity roster) {
    var unitStatistics =
        roster.getWarbands().stream()
            .flatMap(warband -> warband.getUnits().stream())
            .map(this::calculateUnit)
            .toList();

    return new RosterStatistics(
        unitStatistics.stream().mapToInt(UnitStatistics::points).sum(),
        roster.getWarbands().size(),
        unitStatistics.stream().mapToInt(UnitStatistics::models).sum(),
        unitStatistics.stream().mapToInt(UnitStatistics::might).sum(),
        unitStatistics.stream().mapToInt(UnitStatistics::bows).sum(),
        unitStatistics.stream().mapToInt(UnitStatistics::throwingWeapons).sum());
  }

  private UnitStatistics calculateUnit(RosterUnitEntity unit) {
    var profile = gameDataCatalog.getProfile(unit.getProfileId());

    var optionPoints =
        unit.getOptionIds().stream()
            .map(profile::findOption)
            .mapToInt(option -> option.map(ProfileOptionData::points).orElse(0))
            .sum();

    var quantity = unit.getQuantity();

    var equipment = new HashSet<>(profile.wargear());
    equipment.addAll(unit.getOptionIds());

    var hasBow = equipment.stream().anyMatch(this::isBow);
    var hasThrowingWeapon = equipment.stream().anyMatch(this::isThrowingWeapon);

    var might = getMight(profile) * quantity;

    return new UnitStatistics(
        (profile.points() + optionPoints) * quantity,
        quantity,
        might,
        hasBow ? quantity : 0,
        hasThrowingWeapon ? quantity : 0);
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
