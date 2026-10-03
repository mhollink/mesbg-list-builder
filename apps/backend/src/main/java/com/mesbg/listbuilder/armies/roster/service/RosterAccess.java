package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterUnitNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.WarbandNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RosterAccess {

  private final CurrentUserContext currentUser;
  private final RosterRepository rosterRepository;
  private final WarbandRepository warbandRepository;
  private final RosterUnitRepository rosterUnitRepository;
  private final RosterGroupRepository rosterGroupRepository;

  public RosterEntity requireRoster(Long rosterId) {
    return rosterRepository
        .findByIdAndUserId(rosterId, currentUser.getUserId())
        .orElseThrow(() -> new RosterNotFoundException(rosterId));
  }

  public RosterGroupEntity requireGroup(Long groupId) {
    return rosterGroupRepository
        .findByIdAndUserId(groupId, currentUser.getUserId())
        .orElseThrow(() -> new RosterGroupNotFoundException(groupId));
  }

  public RosterEntity requireEditable(Long rosterId) {
    var roster = requireRoster(rosterId);
    if (roster.isLocked()) {
      log.warn("Rejected modification of locked roster rosterId={}", roster.getId());
      throw new RosterLockedException(roster.getId());
    }
    return roster;
  }

  public WarbandEntity requireWarband(Long warbandId, Long rosterId) {
    return warbandRepository
        .findOwnedWarband(warbandId, rosterId, currentUser.getUserId())
        .orElseThrow(() -> new WarbandNotFoundException(warbandId));
  }

  public RosterUnitEntity requireUnit(Long unitId, Long warbandId, Long rosterId) {
    return rosterUnitRepository
        .findOwnedUnit(unitId, warbandId, rosterId, currentUser.getUserId())
        .orElseThrow(() -> new RosterUnitNotFoundException(unitId));
  }

  public RosterUnitEntity requireUnit(Long unitId, Long rosterId) {
    return rosterUnitRepository
        .findOwnedUnitInRoster(unitId, rosterId, currentUser.getUserId())
        .orElseThrow(() -> new RosterUnitNotFoundException(unitId));
  }
}
