package com.mesbg.listbuilder.armies.roster.api;

import com.mesbg.listbuilder.generated.api.RostersApi;
import com.mesbg.listbuilder.generated.model.CreateFollowerRequest;
import com.mesbg.listbuilder.generated.model.CreateRosterRequest;
import com.mesbg.listbuilder.generated.model.CreateWarbandRequest;
import com.mesbg.listbuilder.generated.model.LeaderInput;
import com.mesbg.listbuilder.generated.model.Roster;
import com.mesbg.listbuilder.generated.model.RosterSummary;
import com.mesbg.listbuilder.generated.model.RosterUnit;
import com.mesbg.listbuilder.generated.model.UpdateRosterRequest;
import com.mesbg.listbuilder.generated.model.UpdateRosterUnitRequest;
import com.mesbg.listbuilder.generated.model.Warband;
import java.util.List;
import org.springframework.http.ResponseEntity;

public class RosterController implements RostersApi {
  @Override
  public ResponseEntity<Void> assignRosterToGroup(Long rosterId, Long groupId) {
    return null;
  }

  @Override
  public ResponseEntity<Void> clearRosterGeneral(Long rosterId) {
    return null;
  }

  @Override
  public ResponseEntity<Roster> createRoster(CreateRosterRequest createRosterRequest) {
    return null;
  }

  @Override
  public ResponseEntity<Warband> createWarband(
      Long rosterId, CreateWarbandRequest createWarbandRequest) {
    return null;
  }

  @Override
  public ResponseEntity<RosterUnit> createWarbandFollower(
      Long rosterId, Long warbandId, CreateFollowerRequest createFollowerRequest) {
    return null;
  }

  @Override
  public ResponseEntity<Void> deleteRoster(Long rosterId) {
    return null;
  }

  @Override
  public ResponseEntity<Void> deleteWarband(Long rosterId, Long warbandId) {
    return null;
  }

  @Override
  public ResponseEntity<Void> deleteWarbandUnit(Long rosterId, Long warbandId, Long unitId) {
    return null;
  }

  @Override
  public ResponseEntity<Roster> getRoster(Long rosterId) {
    return null;
  }

  @Override
  public ResponseEntity<List<RosterSummary>> listRosters() {
    return null;
  }

  @Override
  public ResponseEntity<Void> removeRosterFromGroup(Long rosterId) {
    return null;
  }

  @Override
  public ResponseEntity<RosterUnit> replaceWarbandLeader(
      Long rosterId, Long warbandId, LeaderInput leaderInput) {
    return null;
  }

  @Override
  public ResponseEntity<Void> setRosterGeneral(Long rosterId, Long unitId) {
    return null;
  }

  @Override
  public ResponseEntity<RosterSummary> updateRoster(
      Long rosterId, UpdateRosterRequest updateRosterRequest) {
    return null;
  }

  @Override
  public ResponseEntity<RosterUnit> updateWarbandUnit(
      Long rosterId, Long warbandId, Long unitId, UpdateRosterUnitRequest updateRosterUnitRequest) {
    return null;
  }
}
