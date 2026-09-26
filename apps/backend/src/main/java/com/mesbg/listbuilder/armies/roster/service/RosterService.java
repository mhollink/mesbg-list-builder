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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RosterService {

  private final CurrentUserContext currentUser;
  private final RosterAccess rosterAccess;
  private final RosterRepository rosterRepository;
  private final RosterStatisticsCalculator rosterStatisticsCalculator;

  @Transactional
  public List<RosterSnapshot> listRosters() {
    return rosterRepository.findAllByUserIdOrderByUpdatedAtDesc(currentUser.getUserId()).stream()
        .map(this::snapshot)
        .toList();
  }

  @Transactional
  public RosterSnapshot getRoster(Long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);
    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot createRoster(
      String name, String armyListId, Integer pointsLimit, List<String> tags, Long groupId) {
    var group = groupId == null ? null : rosterAccess.requireGroup(groupId);
    var normalizeTags = normalizeTags(tags);

    var roster =
        rosterRepository.save(
            new RosterEntity(
                currentUser.getUser(), name, armyListId, pointsLimit, normalizeTags, group));

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot updateRoster(
      Long rosterId, String name, Integer pointsLimit, List<String> tags) {
    var roster = rosterAccess.requireRoster(rosterId);

    if (name != null && !name.equals(roster.getName())) roster.setName(name);

    if (pointsLimit != null && !pointsLimit.equals(roster.getPointsLimit())) {
      roster.setPointsLimit(pointsLimit);
    }

    if (tags != null) {
      roster.setTags(normalizeTags(tags));
    }

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot favoriteRoster(long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setFavorite(true);

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot unfavoriteRoster(long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setFavorite(false);

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot lockRoster(long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setLocked(true);

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot unlockRoster(long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setLocked(false);

    return snapshot(roster);
  }

  @Transactional
  public void deleteRoster(Long rosterId) {
    var roster = rosterAccess.requireEditable(rosterId);

    rosterRepository.delete(roster);
  }

  @Transactional
  public void assignRosterToGroup(Long rosterId, Long groupId) {
    var roster = rosterAccess.requireRoster(rosterId);
    var group = rosterAccess.requireGroup(groupId);

    roster.setGroup(group);
  }

  @Transactional
  public void removeRosterFromGroup(Long rosterId) {
    var roster = rosterAccess.requireRoster(rosterId);

    roster.setGroup(null);
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
