package com.mesbg.listbuilder.armies.roster.api;

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterGroupEntryMapper;
import com.mesbg.listbuilder.armies.roster.api.mapper.RosterGroupMapper;
import com.mesbg.listbuilder.armies.roster.service.RosterGroupService;
import com.mesbg.listbuilder.generated.api.RosterGroupsApi;
import com.mesbg.listbuilder.generated.model.CreateRosterGroupRequest;
import com.mesbg.listbuilder.generated.model.RosterGroup;
import com.mesbg.listbuilder.generated.model.UpdateRosterGroupRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
public class RosterGroupsController implements RosterGroupsApi {

  private final RosterGroupService rosterGroupService;
  private final RosterGroupMapper rosterGroupMapper;
  private final RosterGroupEntryMapper rosterGroupEntryMapper;

  @Override
  public ResponseEntity<List<RosterGroup>> listRosterGroups() {
    var groups = rosterGroupMapper.toTree(rosterGroupService.listGroups());

    return ResponseEntity.ok(groups);
  }

  @Override
  public ResponseEntity<RosterGroup> createRosterGroup(CreateRosterGroupRequest request) {
    var group = rosterGroupService.createGroup(request.getName(), request.getParentGroupId());

    var location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{groupId}")
            .buildAndExpand(group.getId())
            .toUri();

    return ResponseEntity.created(location).body(rosterGroupEntryMapper.toDto(group));
  }

  @Override
  public ResponseEntity<RosterGroup> updateRosterGroup(
      Long groupId, UpdateRosterGroupRequest request) {

    var group = rosterGroupService.renameGroup(groupId, request.getName());

    return ResponseEntity.ok(rosterGroupEntryMapper.toDto(group));
  }

  @Override
  public ResponseEntity<Void> deleteRosterGroup(Long groupId) {
    rosterGroupService.deleteGroup(groupId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> moveRosterGroup(Long groupId, Long parentGroupId) {
    rosterGroupService.moveGroup(groupId, parentGroupId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> moveRosterGroupToRoot(Long groupId) {
    rosterGroupService.moveGroupToRoot(groupId);

    return ResponseEntity.noContent().build();
  }
}
