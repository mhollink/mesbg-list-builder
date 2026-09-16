package com.mesbg.listbuilder.armies.roster;

import java.util.List;

import com.mesbg.listbuilder.generated.api.RosterGroupsApi;
import com.mesbg.listbuilder.generated.model.CreateRosterGroupRequest;
import com.mesbg.listbuilder.generated.model.RosterGroup;
import com.mesbg.listbuilder.generated.model.UpdateRosterGroupRequest;
import org.springframework.http.ResponseEntity;

public class RosterGroupsController implements RosterGroupsApi  {
  @Override
  public ResponseEntity<RosterGroup> createRosterGroup(CreateRosterGroupRequest createRosterGroupRequest) {
    return null;
  }

  @Override
  public ResponseEntity<Void> deleteRosterGroup(Long groupId) {
    return null;
  }

  @Override
  public ResponseEntity<List<RosterGroup>> listRosterGroups() {
    return null;
  }

  @Override
  public ResponseEntity<Void> moveRosterGroup(Long groupId, Long parentGroupId) {
    return null;
  }

  @Override
  public ResponseEntity<Void> moveRosterGroupToRoot(Long groupId) {
    return null;
  }

  @Override
  public ResponseEntity<RosterGroup> updateRosterGroup(Long groupId, UpdateRosterGroupRequest updateRosterGroupRequest) {
    return null;
  }
}
