package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidWarbandPositionException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RosterWarbandsService {

  private final RosterAccess rosterAccess;
  private final WarbandRepository warbandRepository;

  @Transactional
  public WarbandEntity createWarband(Long rosterId) {
    log.debug("Creating warband rosterId={}", rosterId);

    var roster = rosterAccess.requireEditable(rosterId);

    var sortIndex = getMaxSortIndex(roster) + 1;
    var warband = new WarbandEntity(roster, sortIndex);

    roster.getWarbands().add(warband);
    roster.touch();

    var saved = warbandRepository.save(warband);

    log.debug(
        "Created warband rosterId={} warbandId={} position={}", rosterId, saved.getId(), sortIndex);

    return saved;
  }

  private static int getMaxSortIndex(RosterEntity roster) {
    return roster.getWarbands().stream().mapToInt(WarbandEntity::getSortIndex).max().orElse(-1);
  }

  @Transactional
  public void deleteWarband(Long rosterId, Long warbandId) {
    log.debug("Deleting warband rosterId={} warbandId={}", rosterId, warbandId);

    var roster = rosterAccess.requireEditable(rosterId);
    var warband = rosterAccess.requireWarband(warbandId, rosterId);

    if (roster.getGeneralUnit() != null
        && roster.getGeneralUnit().getWarband().getId().equals(warbandId)) {
      log.debug(
          "Clearing roster general because its warband is being deleted rosterId={} warbandId={}",
          rosterId,
          warbandId);
      roster.setGeneralUnit(null);
    }

    roster.getWarbands().removeIf(existing -> existing.getId().equals(warband.getId()));
    roster.touch();

    log.debug("Deleted warband rosterId={} warbandId={}", rosterId, warbandId);
  }

  @Transactional
  public WarbandEntity duplicateWarband(Long rosterId, Long warbandId) {
    log.debug("Duplicating warband rosterId={} sourceWarbandId={}", rosterId, warbandId);

    var roster = rosterAccess.requireEditable(rosterId);
    var source = rosterAccess.requireWarband(warbandId, rosterId);

    var duplicated = new WarbandEntity(roster, getMaxSortIndex(roster) + 1);

    // TODO: Remove unique models from stream.
    // TODO: Clear upgrades/options from units coming from specific leaders.
    source.getUnits().stream()
        .sorted(Comparator.comparingInt(RosterUnitEntity::getSortIndex))
        .map(unit -> duplicateUnit(duplicated, unit))
        .forEach(duplicated.getUnits()::add);

    roster.getWarbands().add(duplicated);
    roster.touch();

    var saved = warbandRepository.save(duplicated);

    log.debug(
        "Duplicated warband rosterId={} sourceWarbandId={} warbandId={} unitCount={}",
        rosterId,
        warbandId,
        saved.getId(),
        saved.getUnits().size());

    return saved;
  }

  private RosterUnitEntity duplicateUnit(WarbandEntity targetWarband, RosterUnitEntity source) {
    var duplicated =
        new RosterUnitEntity(
            targetWarband,
            source.getArmyListProfileId(),
            source.getQuantity(),
            source.isLeader(),
            source.getSortIndex());

    duplicated.getOptionIds().addAll(source.getOptionIds());

    return duplicated;
  }

  @Transactional
  public void moveWarband(Long rosterId, Long warbandId, int targetIndex) {
    log.debug(
        "Moving warband rosterId={} warbandId={} targetPosition={}",
        rosterId,
        warbandId,
        targetIndex);

    var roster = rosterAccess.requireEditable(rosterId);
    var warband = rosterAccess.requireWarband(warbandId, rosterId);

    var warbands =
        roster.getWarbands().stream()
            .sorted(Comparator.comparingInt(WarbandEntity::getSortIndex))
            .collect(Collectors.toCollection(ArrayList::new));

    if (targetIndex < 0 || targetIndex >= warbands.size()) {
      log.warn(
          "Rejected warband move outside roster rosterId={} warbandId={} targetPosition={} warbandCount={}",
          rosterId,
          warbandId,
          targetIndex,
          warbands.size());
      throw new InvalidWarbandPositionException(targetIndex);
    }

    var sourceIndex = warbands.indexOf(warband);

    warbands.remove(warband);
    warbands.add(targetIndex, warband);

    for (int index = 0; index < warbands.size(); index++) {
      warbands.get(index).setSortIndex(index);
    }

    roster.touch();

    log.debug(
        "Moved warband rosterId={} warbandId={} fromPosition={} toPosition={}",
        rosterId,
        warbandId,
        sourceIndex,
        targetIndex);
  }
}
