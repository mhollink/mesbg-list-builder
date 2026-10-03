package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterGroupMoveException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotEmptyException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RosterGroupService {

  private final CurrentUserContext currentUser;
  private final RosterAccess rosterAccess;
  private final RosterGroupRepository rosterGroupRepository;
  private final RosterRepository rosterRepository;

  @Transactional
  public List<RosterGroupEntity> listGroups() {
    var userId = currentUser.getUserId();

    log.debug("Listing roster groups userId={}", userId);

    var groups = rosterGroupRepository.findAllByUserIdOrderByNameAsc(userId);

    log.debug("Listed roster groups userId={} count={}", userId, groups.size());

    return groups;
  }

  @Transactional
  public RosterGroupEntity createGroup(String name, Long parentGroupId) {
    var parent = parentGroupId == null ? null : rosterAccess.requireGroup(parentGroupId);

    var group =
        rosterGroupRepository.save(new RosterGroupEntity(currentUser.getUser(), name, parent));

    log.info("Created roster group groupId={} parentGroupId={}", group.getId(), parentGroupId);

    return group;
  }

  @Transactional
  public RosterGroupEntity renameGroup(Long groupId, String name) {
    var group = rosterAccess.requireGroup(groupId);

    group.setName(name);

    log.info("Renamed roster group groupId={}", groupId);

    return group;
  }

  @Transactional
  public void deleteGroup(Long groupId) {
    var group = rosterAccess.requireGroup(groupId);

    if (rosterGroupRepository.existsByParentGroupIdAndUserId(groupId, currentUser.getUserId())
        || rosterRepository.existsByGroupIdAndUserId(groupId, currentUser.getUserId())) {
      log.warn("Rejected deletion of non-empty roster group groupId={}", groupId);
      throw new RosterGroupNotEmptyException(groupId);
    }

    rosterGroupRepository.delete(group);

    log.info("Deleted roster group groupId={}", groupId);
  }

  @Transactional
  public void moveGroup(Long groupId, Long parentGroupId) {
    var group = rosterAccess.requireGroup(groupId);
    var parent = rosterAccess.requireGroup(parentGroupId);

    validateMove(group, parent);
    group.setParentGroup(parent);

    log.info("Moved roster group groupId={} parentGroupId={}", groupId, parentGroupId);
  }

  @Transactional
  public void moveGroupToRoot(Long groupId) {
    rosterAccess.requireGroup(groupId).setParentGroup(null);

    log.info("Moved roster group to root groupId={}", groupId);
  }

  private void validateMove(RosterGroupEntity group, RosterGroupEntity newParent) {
    if (group.getId().equals(newParent.getId())) {
      log.warn("Rejected roster group move groupId={} reason=self-parent", group.getId());
      throw new InvalidRosterGroupMoveException("A roster group cannot be its own parent");
    }

    var ancestor = newParent;
    while (ancestor != null) {
      if (group.getId().equals(ancestor.getId())) {
        log.warn(
            "Rejected roster group move groupId={} parentGroupId={} reason=cycle",
            group.getId(),
            newParent.getId());
        throw new InvalidRosterGroupMoveException("Moving the roster group would create a cycle");
      }
      ancestor = ancestor.getParentGroup();
    }
  }
}
