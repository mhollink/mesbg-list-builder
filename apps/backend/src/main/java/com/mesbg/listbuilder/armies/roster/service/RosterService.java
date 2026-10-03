package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
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
      Long rosterId, String name, Integer pointsLimit, List<String> tags) {
    var roster = rosterAccess.requireRoster(rosterId);
    var nameChanged = name != null && !name.equals(roster.getName());
    var pointsLimitChanged = pointsLimit != null && !pointsLimit.equals(roster.getPointsLimit());
    var tagsChanged = tags != null;

    log.debug(
        "Updating roster rosterId={} nameChanged={} pointsLimitChanged={} tagsChanged={}",
        rosterId,
        nameChanged,
        pointsLimitChanged,
        tagsChanged);

    if (nameChanged) roster.setName(name);

    if (pointsLimitChanged) {
      roster.setPointsLimit(pointsLimit);
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

  public static Set<String> normalizeTags(Collection<String> tags) {
    if (tags == null) {
      return Set.of();
    }

    return tags.stream()
        .map(String::trim)
        .filter(tag -> !tag.isBlank())
        .filter(tag -> tag.length() <= 64)
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }
}
