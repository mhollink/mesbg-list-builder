package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RosterCompositionService {

  private final RosterAccess rosterAccess;
  private final RosterStatisticsCalculator statisticsCalculator;

  @Transactional
  public void setRosterGeneral(Long rosterId, Long unitId) {
    var roster = rosterAccess.requireEditable(rosterId);
    var unit = rosterAccess.requireUnit(unitId, rosterId);

    if (!unit.isLeader()) {
      throw new RosterInvariantViolationException(
          "Cannot mark regular warband units as roster general");
    }

    roster.setGeneralUnit(unit);
  }

  @Transactional
  public void clearRosterGeneral(Long rosterId) {
    var roster = rosterAccess.requireEditable(rosterId);
    roster.setGeneralUnit(null);
  }

  @Transactional
  public RosterSnapshot setArmyOptions(Long rosterId, Set<String> armyOptionIds) {
    var roster = rosterAccess.requireEditable(rosterId);

    roster.getArmyOptionIds().clear();
    roster.getArmyOptionIds().addAll(armyOptionIds);
    roster.touch();

    return new RosterSnapshot(roster, statisticsCalculator.calculate(roster));
  }
}
