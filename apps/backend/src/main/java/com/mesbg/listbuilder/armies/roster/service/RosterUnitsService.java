package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RosterUnitsService {

  private final RosterAccess rosterAccess;
  private final RosterUnitRepository rosterUnitRepository;

  public record FollowerLoadout(int quantity, Set<String> optionIds) {}

  /**
   * Replaces the configurations for one profile in a warband within one transaction. Existing
   * matching configurations keep their IDs and ordering. Other profiles and the leader are not
   * modified. Any error rolls back the whole batch.
   */
  @Transactional
  public List<RosterUnitEntity> replaceFollowerLoadouts(
      Long rosterId, Long warbandId, String armyListProfileId, List<FollowerLoadout> loadouts) {
    if (armyListProfileId == null || armyListProfileId.isBlank() || loadouts == null) {
      throw new InvalidRosterUnitException("A profile and loadouts are required");
    }

    Map<Set<String>, Integer> desired = new LinkedHashMap<>();
    for (var loadout : loadouts) {
      if (loadout == null
          || loadout.quantity() < 1
          || loadout.optionIds() == null
          || loadout.optionIds().stream().anyMatch(Objects::isNull)) {
        throw new InvalidRosterUnitException("Every loadout needs a positive quantity and options");
      }
      Set<String> optionIds = Set.copyOf(loadout.optionIds());
      if (desired.putIfAbsent(optionIds, loadout.quantity()) != null) {
        throw new InvalidRosterUnitException("Duplicate equipment configurations are not allowed");
      }
    }

    var roster = rosterAccess.requireEditable(rosterId);
    var warband = rosterAccess.requireWarband(warbandId, rosterId);
    var existing =
        warband.getUnits().stream()
            .filter(
                unit -> !unit.isLeader() && armyListProfileId.equals(unit.getArmyListProfileId()))
            .sorted(Comparator.comparingInt(RosterUnitEntity::getSortIndex))
            .toList();

    // Reserve exact matches before reusing an entry for a changed configuration.
    Map<Set<String>, RosterUnitEntity> matches = new LinkedHashMap<>();
    var spare = new ArrayList<RosterUnitEntity>();
    for (var unit : existing) {
      Set<String> options = Set.copyOf(unit.getOptionIds());
      if (desired.containsKey(options) && !matches.containsKey(options)) {
        matches.put(options, unit);
      } else {
        spare.add(unit);
      }
    }

    var result = new ArrayList<RosterUnitEntity>();
    int nextIndex =
        warband.getUnits().stream().mapToInt(RosterUnitEntity::getSortIndex).max().orElse(-1) + 1;
    for (var entry : desired.entrySet()) {
      var unit = matches.get(entry.getKey());
      if (unit == null && !spare.isEmpty()) {
        unit = spare.remove(0);
        unit.getOptionIds().clear();
        unit.getOptionIds().addAll(entry.getKey());
      }
      if (unit == null) {
        unit =
            new RosterUnitEntity(warband, armyListProfileId, entry.getValue(), false, nextIndex++);
        unit.getOptionIds().addAll(entry.getKey());
        warband.getUnits().add(unit);
        unit = rosterUnitRepository.save(unit);
      } else {
        unit.setQuantity(entry.getValue());
      }
      result.add(unit);
    }

    for (var removed : spare) {
      if (roster.getGeneralUnit() != null
          && Objects.equals(roster.getGeneralUnit().getId(), removed.getId())) {
        roster.setGeneralUnit(null);
      }
      warband.getUnits().remove(removed);
    }
    roster.touch();
    return result;
  }

  @Transactional
  public RosterUnitEntity addFollower(
      Long rosterId,
      Long warbandId,
      String armyListProfileId,
      int quantity,
      Set<String> optionIds) {
    log.debug(
        "Adding follower rosterId={} warbandId={} profileId={} quantity={} optionCount={}",
        rosterId,
        warbandId,
        armyListProfileId,
        quantity,
        optionIds.size());

    var roster = rosterAccess.requireEditable(rosterId);
    var warband = rosterAccess.requireWarband(warbandId, rosterId);

    var sortIndex =
        warband.getUnits().stream().mapToInt(RosterUnitEntity::getSortIndex).max().orElse(-1) + 1;

    var unit = new RosterUnitEntity(warband, armyListProfileId, quantity, false, sortIndex);
    unit.getOptionIds().addAll(optionIds);

    warband.getUnits().add(unit);
    roster.touch();

    var saved = rosterUnitRepository.save(unit);

    log.debug(
        "Added follower rosterId={} warbandId={} unitId={} profileId={} position={}",
        rosterId,
        warbandId,
        saved.getId(),
        armyListProfileId,
        sortIndex);

    return saved;
  }

  @Transactional
  public RosterUnitEntity updateUnit(
      Long rosterId, Long warbandId, Long unitId, Integer quantity, Set<String> optionIds) {
    log.debug(
        "Updating roster unit rosterId={} warbandId={} unitId={} quantitySupplied={} optionsSupplied={}",
        rosterId,
        warbandId,
        unitId,
        quantity != null,
        optionIds != null);

    var roster = rosterAccess.requireEditable(rosterId);
    var unit = rosterAccess.requireUnit(unitId, warbandId, rosterId);

    if (quantity != null) {
      if (unit.isLeader() && quantity != 1) {
        log.warn(
            "Rejected leader quantity change rosterId={} warbandId={} unitId={} quantity={}",
            rosterId,
            warbandId,
            unitId,
            quantity);
        throw new RosterInvariantViolationException("A warband leader must have quantity 1");
      }
      if (quantity < 1) {
        log.warn(
            "Rejected invalid unit quantity rosterId={} warbandId={} unitId={} quantity={}",
            rosterId,
            warbandId,
            unitId,
            quantity);
        throw new InvalidRosterUnitException("Unit quantity must be at least 1");
      }
      unit.setQuantity(quantity);
    }

    if (optionIds != null) {
      unit.getOptionIds().clear();
      unit.getOptionIds().addAll(optionIds);
    }

    roster.touch();

    log.debug(
        "Updated roster unit rosterId={} warbandId={} unitId={}", rosterId, warbandId, unitId);

    return unit;
  }

  @Transactional
  public void deleteUnit(Long rosterId, Long warbandId, Long unitId) {
    log.debug(
        "Deleting roster unit rosterId={} warbandId={} unitId={}", rosterId, warbandId, unitId);

    var roster = rosterAccess.requireEditable(rosterId);
    var unit = rosterAccess.requireUnit(unitId, warbandId, rosterId);

    if (unit.isLeader()) {
      log.warn(
          "Rejected independent leader deletion rosterId={} warbandId={} unitId={}",
          rosterId,
          warbandId,
          unitId);
      throw new RosterInvariantViolationException(
          "The warband leader cannot be deleted independently");
    }

    if (roster.getGeneralUnit() != null && roster.getGeneralUnit().getId().equals(unitId)) {
      roster.setGeneralUnit(null);
    }

    unit.getWarband().getUnits().removeIf(existing -> existing.getId().equals(unitId));
    roster.touch();

    log.debug(
        "Deleted roster unit rosterId={} warbandId={} unitId={}", rosterId, warbandId, unitId);
  }

  @Transactional
  public void moveUnit(
      Long rosterId, Long sourceWarbandId, Long unitId, Long targetWarbandId, int targetPosition) {

    log.debug(
        "Moving roster unit rosterId={} sourceWarbandId={} targetWarbandId={} unitId={} targetPosition={}",
        rosterId,
        sourceWarbandId,
        targetWarbandId,
        unitId,
        targetPosition);

    var roster = rosterAccess.requireEditable(rosterId);
    var sourceWarband = rosterAccess.requireWarband(sourceWarbandId, rosterId);
    var targetWarband =
        sourceWarbandId.equals(targetWarbandId)
            ? sourceWarband
            : rosterAccess.requireWarband(targetWarbandId, rosterId);

    var unit = rosterAccess.requireUnit(unitId, sourceWarbandId, rosterId);
    if (unit.isLeader()) {
      log.warn(
          "Rejected independent leader move rosterId={} warbandId={} unitId={}",
          rosterId,
          sourceWarbandId,
          unitId);
      throw new RosterInvariantViolationException("A warband leader cannot be moved independently");
    }

    if (sourceWarband == targetWarband) {
      moveWithinWarband(sourceWarband, unit, targetPosition);
    } else {
      moveBetweenWarbands(sourceWarband, targetWarband, unit, targetPosition);
    }

    roster.touch();

    log.debug(
        "Moved roster unit rosterId={} sourceWarbandId={} targetWarbandId={} unitId={} targetPosition={}",
        rosterId,
        sourceWarbandId,
        targetWarbandId,
        unitId,
        targetPosition);
  }

  private void moveWithinWarband(WarbandEntity warband, RosterUnitEntity unit, int targetPosition) {
    var followers = orderedFollowers(warband);
    followers.remove(unit);
    validatePosition(targetPosition, followers.size());
    followers.add(targetPosition, unit);
    reindex(followers);
  }

  private void moveBetweenWarbands(
      WarbandEntity source, WarbandEntity target, RosterUnitEntity unit, int targetPosition) {

    var sourceFollowers = orderedFollowers(source);
    var targetFollowers = orderedFollowers(target);

    sourceFollowers.remove(unit);

    validatePosition(targetPosition, targetFollowers.size());

    unit.setWarband(target);
    targetFollowers.add(targetPosition, unit);

    reindex(sourceFollowers);
    reindex(targetFollowers);
  }

  private List<RosterUnitEntity> orderedFollowers(WarbandEntity warband) {
    return warband.getUnits().stream()
        .filter(unit -> !unit.isLeader())
        .sorted(Comparator.comparingInt(RosterUnitEntity::getSortIndex))
        .collect(Collectors.toCollection(ArrayList::new));
  }

  private void reindex(List<RosterUnitEntity> units) {
    for (int i = 0; i < units.size(); i++) {
      units.get(i).setSortIndex(i);
    }
  }

  private void validatePosition(int position, int sizeAfterRemoval) {
    if (position < 0 || position > sizeAfterRemoval) {
      log.warn(
          "Rejected unit move outside warband targetPosition={} followerCountAfterRemoval={}",
          position,
          sizeAfterRemoval);
      throw new InvalidRosterUnitException("Target position is outside the warband");
    }
  }
}
