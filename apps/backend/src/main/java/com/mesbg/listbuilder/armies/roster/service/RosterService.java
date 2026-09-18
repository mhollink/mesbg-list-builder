package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.account.AuthenticatedUserService;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RosterService {

  private final AuthenticatedUserService authenticatedUserService;
  private final RosterRepository rosterRepository;
  private final RosterGroupRepository rosterGroupRepository;
  private final WarbandRepository warbandRepository;
  private final RosterUnitRepository rosterUnitRepository;
  private final RosterStatisticsCalculator rosterStatisticsCalculator;

  @Transactional
  public List<RosterSnapshot> listRosters() {
    var user = authenticatedUserService.getCurrentUser();
    return rosterRepository.findAllByUserIdOrderByUpdatedAtDesc(user.getId()).stream()
        .map(this::snapshot)
        .toList();
  }

  @Transactional
  public RosterSnapshot getRoster(Long rosterId) {
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot createRoster(
      String name, String armyListId, Integer pointsLimit, List<String> tags, Long groupId) {
    var user = authenticatedUserService.getCurrentUser();
    var group = groupId == null ? null : requireGroup(groupId, user.getId());
    var normalizeTags = normalizeTags(tags);

    var roster =
        rosterRepository.save(
            new RosterEntity(user, name, armyListId, pointsLimit, normalizeTags, group));

    return snapshot(roster);
  }

  @Transactional
  public RosterSnapshot updateRoster(
      Long rosterId, String name, Integer pointsLimit, List<String> tags) {
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());
    var normalizeTags = normalizeTags(tags);

    if (name != null && !name.equals(roster.getName())) roster.setName(name);

    if (pointsLimit != null && !pointsLimit.equals(roster.getPointsLimit()))
      roster.setPointsLimit(pointsLimit);

    return snapshot(roster);
  }

  @Transactional
  public void deleteRoster(Long rosterId) {
    var user = authenticatedUserService.getCurrentUser();
    rosterRepository.delete(requireRoster(rosterId, user.getId()));
  }

  @Transactional
  public void assignRosterToGroup(Long rosterId, Long groupId) {
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());
    var group = requireGroup(groupId, user.getId());

    roster.setGroup(group);
  }

  @Transactional
  public void removeRosterFromGroup(Long rosterId) {
    var user = authenticatedUserService.getCurrentUser();
    requireRoster(rosterId, user.getId()).setGroup(null);
  }

  @Transactional
  public void setRosterGeneral(Long rosterId, Long unitId) {
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());
    var unit =
        rosterUnitRepository
            .findOwnedUnitInRoster(unitId, rosterId, user.getId())
            .orElseThrow(() -> notFound("Unit selection", unitId));

    roster.setGeneralUnit(unit);
  }

  @Transactional
  public void clearRosterGeneral(Long rosterId) {
    var user = authenticatedUserService.getCurrentUser();
    requireRoster(rosterId, user.getId()).setGeneralUnit(null);
  }

  @Transactional
  public WarbandEntity createWarband(
      Long rosterId, String leaderProfileId, Set<String> leaderOptionIds) {
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());

    var sortIndex =
        roster.getWarbands().stream().mapToInt(WarbandEntity::getSortIndex).max().orElse(-1) + 1;

    var warband = new WarbandEntity(roster, sortIndex);
    var leader = new RosterUnitEntity(warband, leaderProfileId, 1, true, 0);
    leader.getOptionIds().addAll(leaderOptionIds);

    warband.getUnits().add(leader);
    roster.getWarbands().add(warband);
    roster.touch();

    return warbandRepository.save(warband);
  }

  @Transactional
  public void deleteWarband(Long rosterId, Long warbandId) {
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());
    var warband = requireWarband(warbandId, rosterId, user.getId());

    if (roster.getGeneralUnit() != null
        && roster.getGeneralUnit().getWarband().getId().equals(warbandId)) {
      roster.setGeneralUnit(null);
    }

    roster.getWarbands().removeIf(existing -> existing.getId().equals(warbandId));
    roster.touch();
  }

  @Transactional
  public RosterUnitEntity replaceWarbandLeader(
      Long rosterId, Long warbandId, String profileId, Set<String> optionIds) {
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());
    var warband = requireWarband(warbandId, rosterId, user.getId());

    var leader =
        warband.getUnits().stream()
            .filter(RosterUnitEntity::isLeader)
            .findFirst()
            .orElseThrow(
                () ->
                    new IllegalStateException(
                        "Warband " + warbandId + " does not contain a leader"));

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
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());
    var warband = requireWarband(warbandId, rosterId, user.getId());

    var sortIndex =
        warband.getUnits().stream().mapToInt(RosterUnitEntity::getSortIndex).max().orElse(0) + 1;

    var unit = new RosterUnitEntity(warband, profileId, quantity, false, sortIndex);
    unit.getOptionIds().addAll(optionIds);

    warband.getUnits().add(unit);
    roster.touch();

    return rosterUnitRepository.save(unit);
  }

  @Transactional
  public RosterUnitEntity updateUnit(
      Long rosterId, Long warbandId, Long unitId, Integer quantity, Set<String> optionIds) {
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());
    var unit =
        rosterUnitRepository
            .findOwnedUnit(unitId, warbandId, rosterId, user.getId())
            .orElseThrow(() -> notFound("Unit selection", unitId));

    if (quantity != null) {
      if (unit.isLeader() && quantity != 1) {
        throw conflict("A warband leader must have quantity 1");
      }
      if (quantity < 1) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Unit quantity must be at least 1");
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
    var user = authenticatedUserService.getCurrentUser();
    var roster = requireRoster(rosterId, user.getId());
    var unit =
        rosterUnitRepository
            .findOwnedUnit(unitId, warbandId, rosterId, user.getId())
            .orElseThrow(() -> notFound("Unit selection", unitId));

    if (unit.isLeader()) {
      throw conflict("The warband leader cannot be deleted independently");
    }

    if (roster.getGeneralUnit() != null && roster.getGeneralUnit().getId().equals(unitId)) {
      roster.setGeneralUnit(null);
    }

    unit.getWarband().getUnits().removeIf(existing -> existing.getId().equals(unitId));
    roster.touch();
  }

  private RosterEntity requireRoster(Long rosterId, Long userId) {
    return rosterRepository
        .findByIdAndUserId(rosterId, userId)
        .orElseThrow(() -> notFound("Roster", rosterId));
  }

  private RosterGroupEntity requireGroup(Long groupId, Long userId) {
    return rosterGroupRepository
        .findByIdAndUserId(groupId, userId)
        .orElseThrow(() -> notFound("Roster group", groupId));
  }

  private WarbandEntity requireWarband(Long warbandId, Long rosterId, Long userId) {
    return warbandRepository
        .findOwnedWarband(warbandId, rosterId, userId)
        .orElseThrow(() -> notFound("Warband", warbandId));
  }

  private ResponseStatusException notFound(String resource, Long id) {
    return new ResponseStatusException(HttpStatus.NOT_FOUND, resource + " " + id + " not found");
  }

  private ResponseStatusException conflict(String message) {
    return new ResponseStatusException(HttpStatus.CONFLICT, message);
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
}
