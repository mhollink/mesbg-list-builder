package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterUnitException;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidWarbandPositionException;
import com.mesbg.listbuilder.gamedata.GameDataCatalog;
import com.mesbg.listbuilder.generated.model.LeaderInput;
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
  private final GameDataCatalog gameDataCatalog;

  @Transactional
  public WarbandEntity createWarband(Long rosterId, LeaderInput leaderInput) {
    log.debug("Creating warband rosterId={}", rosterId);

    var roster = rosterAccess.requireEditable(rosterId);

    var sortIndex = getMaxSortIndex(roster) + 1;
    var warband = new WarbandEntity(roster, sortIndex);

    var leader = new RosterUnitEntity(warband, leaderInput.getArmyListProfileId(), 1, true, -1);
    leader.getOptionIds().addAll(leaderInput.getOptionIds());
    warband.getUnits().add(leader);

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
  public WarbandEntity duplicateWarband(Long rosterId, Long warbandId, LeaderInput leaderInput) {
    log.debug("Duplicating warband rosterId={} sourceWarbandId={}", rosterId, warbandId);

    var roster = rosterAccess.requireEditable(rosterId);
    var source = rosterAccess.requireWarband(warbandId, rosterId);

    validateDuplicateLeader(roster, leaderInput);

    int position = source.getSortIndex() + 1;
    makeRoomForWarband(roster, position);

    var duplicate = new WarbandEntity(roster, position);

    var leader = new RosterUnitEntity(duplicate, leaderInput.getArmyListProfileId(), 1, true, -1);

    leader.getOptionIds().addAll(leaderInput.getOptionIds());
    duplicate.getUnits().add(leader);

    // TODO: Clear upgrades/options from units coming from specific leaders.
    source.getUnits().stream()
        .filter(unit -> !unit.isLeader())
        .filter(unit -> !isUnique(roster, unit))
        .sorted(Comparator.comparingInt(RosterUnitEntity::getSortIndex))
        .map(unit -> duplicateUnit(duplicate, unit))
        .forEach(duplicate.getUnits()::add);

    roster.getWarbands().add(duplicate);
    roster.touch();

    var saved = warbandRepository.save(duplicate);

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

  private void makeRoomForWarband(RosterEntity roster, int position) {
    roster.getWarbands().stream()
        .filter(warband -> warband.getSortIndex() >= position)
        .forEach(warband -> warband.setSortIndex(warband.getSortIndex() + 1));
  }

  private boolean isUnique(RosterEntity roster, RosterUnitEntity unit) {
    return gameDataCatalog
        .getProfileForArmyListProfile(roster.getArmyListId(), unit.getArmyListProfileId())
        .isUnique();
  }

  private void validateDuplicateLeader(RosterEntity roster, LeaderInput input) {
    if (input == null
        || input.getArmyListProfileId() == null
        || input.getArmyListProfileId().isBlank()
        || input.getOptionIds() == null) {
      throw new InvalidRosterUnitException("A leader profile and options are required");
    }

    var armyListId = roster.getArmyListId();

    var selectedProfile =
        gameDataCatalog.getArmyListProfile(armyListId, input.getArmyListProfileId());

    var profile = gameDataCatalog.getProfile(selectedProfile.profileId());

    if (!profile.isUnique()) {
      return;
    }

    var alreadyPresent =
        roster.getWarbands().stream()
            .flatMap(warband -> warband.getUnits().stream())
            .map(
                unit -> gameDataCatalog.getArmyListProfile(armyListId, unit.getArmyListProfileId()))
            .anyMatch(existing -> existing.profileId().equals(selectedProfile.profileId()));

    if (alreadyPresent) {
      throw new InvalidRosterUnitException(
          "The selected Unique leader already exists in this roster");
    }
  }
}
