package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.account.AuthenticatedUserService;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import java.util.List;

import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterGroupMoveException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotEmptyException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RosterGroupService {

  private final AuthenticatedUserService authenticatedUserService;
  private final RosterGroupRepository rosterGroupRepository;
  private final RosterRepository rosterRepository;

  @Transactional
  public List<RosterGroupEntity> listGroups() {
    var user = authenticatedUserService.getCurrentUser();
    return rosterGroupRepository.findAllByUserIdOrderByNameAsc(user.getId());
  }

  @Transactional
  public RosterGroupEntity createGroup(String name, Long parentGroupId) {
    var user = authenticatedUserService.getCurrentUser();
    var parent = parentGroupId == null ? null : requireGroup(parentGroupId, user.getId());

    return rosterGroupRepository.save(new RosterGroupEntity(user, name, parent));
  }

  @Transactional
  public RosterGroupEntity renameGroup(Long groupId, String name) {
    var user = authenticatedUserService.getCurrentUser();
    var group = requireGroup(groupId, user.getId());

    group.setName(name);
    return group;
  }

  @Transactional
  public void deleteGroup(Long groupId) {
    var user = authenticatedUserService.getCurrentUser();
    var group = requireGroup(groupId, user.getId());

    if (rosterGroupRepository.existsByParentGroupIdAndUserId(groupId, user.getId())
        || rosterRepository.existsByGroupIdAndUserId(groupId, user.getId())) {
      throw new RosterGroupNotEmptyException(groupId);
    }

    rosterGroupRepository.delete(group);
  }

  @Transactional
  public void moveGroup(Long groupId, Long parentGroupId) {
    var user = authenticatedUserService.getCurrentUser();
    var group = requireGroup(groupId, user.getId());
    var parent = requireGroup(parentGroupId, user.getId());

    validateMove(group, parent);
    group.setParentGroup(parent);
  }

  @Transactional
  public void moveGroupToRoot(Long groupId) {
    var user = authenticatedUserService.getCurrentUser();
    requireGroup(groupId, user.getId()).setParentGroup(null);
  }

  private void validateMove(RosterGroupEntity group, RosterGroupEntity newParent) {
    if (group.getId().equals(newParent.getId())) {
      throw new InvalidRosterGroupMoveException(
          "A roster group cannot be its own parent");
    }

    var ancestor = newParent;
    while (ancestor != null) {
      if (group.getId().equals(ancestor.getId())) {
        throw new InvalidRosterGroupMoveException(
            "Moving the roster group would create a cycle");
      }
      ancestor = ancestor.getParentGroup();
    }
  }

  private RosterGroupEntity requireGroup(Long groupId, Long userId) {
    return rosterGroupRepository
        .findByIdAndUserId(groupId, userId)
        .orElseThrow(() -> new RosterGroupNotFoundException(groupId));
  }
  private ResponseStatusException conflict(String message) {
    return new ResponseStatusException(HttpStatus.CONFLICT, message);
  }
}
