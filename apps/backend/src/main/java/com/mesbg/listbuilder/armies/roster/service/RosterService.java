package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RosterService {

  private final CurrentUserContext currentUser;
  private final RosterAccess rosterAccess;
  private final RosterRepository rosterRepository;
  private final RosterStatisticsCalculator rosterStatisticsCalculator;

  @Transactional
  public List<RosterSnapshot> listRosters() {
    var userId = currentUser.getUserId();

    log.debug("Listing rosters userId={}", userId);

    var rosters =
        rosterRepository.findAllByUserIdOrderByUpdatedAtDesc(userId).stream()
            .map(this::snapshot)
            .toList();

    log.debug("Listed rosters userId={} count={}", userId, rosters.size());

    return rosters;
  }

  @Transactional
  public RosterSnapshot getRoster(Long rosterId) {
    log.debug("Loading roster rosterId={}", rosterId);

    var roster = rosterAccess.requireRoster(rosterId);

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot createRoster(
      String name, String armyListId, Integer pointsLimit, List<String> tags, Long groupId) {
    log.debug(
        "Creating roster armyListId={} pointsLimit={} groupId={} tagCount={}",
        armyListId,
        pointsLimit,
        groupId,
        tags == null ? 0 : tags.size());

    var group = groupId == null ? null : rosterAccess.requireGroup(groupId);
    var normalizeTags = normalizeTags(tags);

    var roster =
        rosterRepository.save(
            new RosterEntity(
                currentUser.getUser(), name, armyListId, pointsLimit, normalizeTags, group));

    log.info(
        "Created roster rosterId={} armyListId={} groupId={}", roster.getId(), armyListId, groupId);

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot updateRoster(
      Long rosterId,
      String name,
      Integer pointsLimit,
      List<String> tags,
      Boolean clearPointsLimit) {
    var roster = rosterAccess.requireRoster(rosterId);
    var nameChanged = name != null && !name.equals(roster.getName());
    var removeLimit = Boolean.TRUE.equals(clearPointsLimit);
    var pointsLimitChanged =
        (removeLimit && roster.getPointsLimit() != null)
            || (pointsLimit != null && !pointsLimit.equals(roster.getPointsLimit()));
    var tagsChanged = tags != null;

    log.debug(
        "Updating roster rosterId={} nameChanged={} pointsLimitChanged={} tagsChanged={}",
        rosterId,
        nameChanged,
        pointsLimitChanged,
        tagsChanged);

    if (nameChanged) roster.setName(name);

    if (pointsLimitChanged) {
      roster.setPointsLimit(removeLimit ? null : pointsLimit);
    }

    if (tagsChanged) {
      roster.setTags(normalizeTags(tags));
    }

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot favoriteRoster(long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setFavorite(true);

    log.info("Marked roster as favorite rosterId={}", rosterId);

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot unfavoriteRoster(long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setFavorite(false);

    log.info("Removed roster from favorites rosterId={}", rosterId);

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot lockRoster(long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setLocked(true);

    log.info("Locked roster rosterId={}", rosterId);

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot unlockRoster(long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setLocked(false);

    log.info("Unlocked roster rosterId={}", rosterId);

    return snapshot(roster);
  }

  @Transactional
  public void deleteRoster(Long rosterId) {
    var roster = rosterAccess.requireEditable(rosterId);

    rosterRepository.delete(roster);

    log.info("Deleted roster rosterId={}", rosterId);
  }

  @Transactional
  public void assignRosterToGroup(Long rosterId, Long groupId) {
    var roster = rosterAccess.requireRoster(rosterId);
    var group = rosterAccess.requireGroup(groupId);

    roster.setGroup(group);

    log.info("Assigned roster to group rosterId={} groupId={}", rosterId, groupId);
  }

  @Transactional
  public void removeRosterFromGroup(Long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setGroup(null);

    log.info("Removed roster from group rosterId={}", rosterId);
  }

  private RosterSnapshot snapshot(RosterEntity roster) {
    RosterStatistics statistics = rosterStatisticsCalculator.calculate(roster);
    return new RosterSnapshot(roster, statistics);
  }

  private Set<String> normalizeTags(Collection<String> tags) {
    if (tags == null) {
      return Set.of();
    }

    return tags.stream()
        .map(String::trim)
        .filter(tag -> !tag.isBlank())
        .filter(tag -> tag.length() <= 64)
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  @Transactional
  public RosterSnapshot duplicateRoster(
      Long rosterId, String name, boolean favorite, boolean locked) {

    var source = rosterAccess.requireRoster(rosterId);

    var copy = copyRoster(name, source);
    copy.setFavorite(favorite);
    copy.setLocked(locked);
    copy.getArmyOptionIds().addAll(source.getArmyOptionIds());

    var copiedUnits = new HashMap<Long, RosterUnitEntity>();

    copy.getWarbands()
        .addAll(
            source.getWarbands().stream()
                .map(warband -> copyWarband(warband, copy, copiedUnits))
                .toList());

    var saved = rosterRepository.saveAndFlush(copy);

    getGeneralUnitId(source).map(copiedUnits::get).ifPresent(saved::setGeneralUnit);

    return snapshot(saved);
  }

  private RosterEntity copyRoster(String name, RosterEntity source) {
    return new RosterEntity(
        currentUser.getUser(),
        name.trim(),
        source.getArmyListId(),
        source.getPointsLimit(),
        new LinkedHashSet<>(source.getTags()),
        source.getGroup());
  }

  private Optional<Long> getGeneralUnitId(RosterEntity source) {
    return Optional.ofNullable(source.getGeneralUnit()).map(RosterUnitEntity::getId);
  }

  private WarbandEntity copyWarband(
      WarbandEntity source, RosterEntity roster, Map<Long, RosterUnitEntity> copiedUnits) {
    var warband = new WarbandEntity(roster, source.getSortIndex());

    for (var unit : source.getUnits()) {
      var copiedUnit = copyUnit(unit, warband);
      warband.getUnits().add(copiedUnit);
      copiedUnits.put(unit.getId(), copiedUnit);
    }

    return warband;
  }

  private RosterUnitEntity copyUnit(RosterUnitEntity source, WarbandEntity warband) {
    var unit =
        new RosterUnitEntity(
            warband,
            source.getArmyListProfileId(),
            source.getQuantity(),
            source.isLeader(),
            source.getSortIndex());

    unit.getOptionIds().addAll(source.getOptionIds());

    return unit;
  }
}
