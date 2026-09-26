package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterInvariantViolationException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RosterUnitsService {

  private final RosterAccess rosterAccess;
  private final RosterUnitRepository rosterUnitRepository;

  @Transactional
  public RosterUnitEntity setWarbandLeader(
      Long rosterId, Long warbandId, String profileId, Set<String> optionIds) {

    var roster = rosterAccess.requireEditable(rosterId);
    var warband = rosterAccess.requireWarband(warbandId, rosterId);

    var leader =
        warband.getUnits().stream().filter(RosterUnitEntity::isLeader).findFirst().orElse(null);

    if (leader == null) {
      leader = new RosterUnitEntity(warband, profileId, 1, true, -1);
      warband.getUnits().add(leader);
    } else if (roster.getGeneralUnit() != null
        && roster.getGeneralUnit().getId().equals(leader.getId())) {
      roster.setGeneralUnit(null);
    }

    leader.setProfileId(profileId);
    leader.setQuantity(1);
    leader.getOptionIds().clear();
    leader.getOptionIds().addAll(optionIds);

    roster.touch();

    return leader;
  }

  @Transactional
  public RosterUnitEntity addFollower(
      Long rosterId, Long warbandId, String profileId, int quantity, Set<String> optionIds) {
    var roster = rosterAccess.requireEditable(rosterId);
    var warband = rosterAccess.requireWarband(warbandId, rosterId);

    var sortIndex =
        warband.getUnits().stream().mapToInt(RosterUnitEntity::getSortIndex).max().orElse(-1) + 1;

    var unit = new RosterUnitEntity(warband, profileId, quantity, false, sortIndex);
    unit.getOptionIds().addAll(optionIds);

    warband.getUnits().add(unit);
    roster.touch();

    return rosterUnitRepository.save(unit);
  }

  @Transactional
  public RosterUnitEntity updateUnit(
      Long rosterId, Long warbandId, Long unitId, Integer quantity, Set<String> optionIds) {
    var roster = rosterAccess.requireEditable(rosterId);
    var unit = rosterAccess.requireUnit(unitId, warbandId, rosterId);

    if (quantity != null) {
      if (unit.isLeader() && quantity != 1) {
        throw new RosterInvariantViolationException("A warband leader must have quantity 1");
      }
      if (quantity < 1) {
        throw new InvalidRosterUnitException("Unit quantity must be at least 1");
      }
      unit.setQuantity(quantity);
    }

    if (optionIds != null) {
      unit.getOptionIds().clear();
      unit.getOptionIds().addAll(optionIds);
    }

    roster.touch();
    return unit;
  }

  @Transactional
  public void deleteUnit(Long rosterId, Long warbandId, Long unitId) {
    var roster = rosterAccess.requireEditable(rosterId);
    var unit = rosterAccess.requireUnit(unitId, warbandId, rosterId);

    if (unit.isLeader()) {
      throw new RosterInvariantViolationException(
          "The warband leader cannot be deleted independently");
    }

    if (roster.getGeneralUnit() != null && roster.getGeneralUnit().getId().equals(unitId)) {
      roster.setGeneralUnit(null);
    }

    unit.getWarband().getUnits().removeIf(existing -> existing.getId().equals(unitId));
    roster.touch();
  }

  @Transactional
  public void moveUnit(
      Long rosterId, Long sourceWarbandId, Long unitId, Long targetWarbandId, int targetPosition) {

    var roster = rosterAccess.requireEditable(rosterId);
    var sourceWarband = rosterAccess.requireWarband(sourceWarbandId, rosterId);
    var targetWarband =
        sourceWarbandId.equals(targetWarbandId)
            ? sourceWarband
            : rosterAccess.requireWarband(targetWarbandId, rosterId);

    var unit = rosterAccess.requireUnit(unitId, sourceWarbandId, rosterId);
    if (unit.isLeader()) {
      throw new RosterInvariantViolationException("A warband leader cannot be moved independently");
    }

    if (sourceWarband == targetWarband) {
      moveWithinWarband(sourceWarband, unit, targetPosition);
    } else {
      moveBetweenWarbands(sourceWarband, targetWarband, unit, targetPosition);
    }

    roster.touch();
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
      throw new InvalidRosterUnitException("Target position is outside the warband");
    }
  }
}
