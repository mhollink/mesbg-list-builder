package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RosterCompositionService {

  private final RosterAccess rosterAccess;
  private final RosterStatisticsCalculator statisticsCalculator;

  @Transactional
  public void setRosterGeneral(Long rosterId, Long unitId) {
    log.debug("Setting roster general rosterId={} unitId={}", rosterId, unitId);

    var roster = rosterAccess.requireEditable(rosterId);
    var unit = rosterAccess.requireUnit(unitId, rosterId);

    if (!unit.isLeader()) {
      log.warn("Rejected non-leader as roster general rosterId={} unitId={}", rosterId, unitId);
      throw new RosterInvariantViolationException(
          "Cannot mark regular warband units as roster general");
    }

    roster.setGeneralUnit(unit);

    log.debug("Set roster general rosterId={} unitId={}", rosterId, unitId);
  }

  @Transactional
  public void clearRosterGeneral(Long rosterId) {
    log.debug("Clearing roster general rosterId={}", rosterId);

    var roster = rosterAccess.requireEditable(rosterId);
    roster.setGeneralUnit(null);
  }

  @Transactional
  public RosterSnapshot setArmyOptions(Long rosterId, Set<String> armyOptionIds) {
    log.debug(
        "Updating roster army options rosterId={} optionCount={}", rosterId, armyOptionIds.size());

    var roster = rosterAccess.requireEditable(rosterId);

    roster.getArmyOptionIds().clear();
    roster.getArmyOptionIds().addAll(armyOptionIds);
    roster.touch();

    return new RosterSnapshot(roster, statisticsCalculator.calculate(roster));
  }
}
