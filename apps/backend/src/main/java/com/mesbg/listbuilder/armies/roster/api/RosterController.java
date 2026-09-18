package com.mesbg.listbuilder.armies.roster.api;

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterMapper;
import com.mesbg.listbuilder.armies.roster.api.mapper.RosterUnitMapper;
import com.mesbg.listbuilder.armies.roster.api.mapper.WarbandMapper;
import com.mesbg.listbuilder.armies.roster.service.RosterService;
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
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
public class RosterController implements RostersApi {

  private final RosterService rosterService;
  private final RosterMapper rosterMapper;
  private final WarbandMapper warbandMapper;
  private final RosterUnitMapper rosterUnitMapper;

  @Override
  public ResponseEntity<List<RosterSummary>> listRosters() {
    var rosters =
        rosterService.listRosters().stream()
            .map(snapshot -> rosterMapper.toSummary(snapshot.roster(), snapshot.statistics()))
            .toList();

    return ResponseEntity.ok(rosters);
  }

  @Override
  public ResponseEntity<Roster> getRoster(Long rosterId) {
    var snapshot = rosterService.getRoster(rosterId);

    return ResponseEntity.ok(rosterMapper.toDto(snapshot.roster(), snapshot.statistics()));
  }

  @Override
  public ResponseEntity<Roster> createRoster(CreateRosterRequest request) {
    var snapshot =
        rosterService.createRoster(
            request.getName(),
            request.getArmyListId(),
            request.getPointsLimit(),
            request.getTags(),
            request.getGroupId());

    var location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{rosterId}")
            .buildAndExpand(snapshot.roster().getId())
            .toUri();

    return ResponseEntity.created(location)
        .body(rosterMapper.toDto(snapshot.roster(), snapshot.statistics()));
  }

  @Override
  public ResponseEntity<RosterSummary> updateRoster(Long rosterId, UpdateRosterRequest request) {
    var snapshot =
        rosterService.updateRoster(
            rosterId, request.getName(), request.getPointsLimit(), request.getTags());

    return ResponseEntity.ok(rosterMapper.toSummary(snapshot.roster(), snapshot.statistics()));
  }

  @Override
  public ResponseEntity<Void> deleteRoster(Long rosterId) {
    rosterService.deleteRoster(rosterId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> assignRosterToGroup(Long rosterId, Long groupId) {

    rosterService.assignRosterToGroup(rosterId, groupId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> removeRosterFromGroup(Long rosterId) {

    rosterService.removeRosterFromGroup(rosterId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> setRosterGeneral(Long rosterId, Long unitId) {

    rosterService.setRosterGeneral(rosterId, unitId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> clearRosterGeneral(Long rosterId) {

    rosterService.clearRosterGeneral(rosterId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Warband> createWarband(Long rosterId, CreateWarbandRequest request) {

    var leader = request.getLeader();

    var warband =
        rosterService.createWarband(
            rosterId, leader.getProfileId(), Set.copyOf(leader.getOptionIds()));

    return ResponseEntity.status(201).body(warbandMapper.toDto(warband));
  }

  @Override
  public ResponseEntity<Void> deleteWarband(Long rosterId, Long warbandId) {

    rosterService.deleteWarband(rosterId, warbandId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<RosterUnit> replaceWarbandLeader(
      Long rosterId, Long warbandId, LeaderInput request) {

    var leader =
        rosterService.replaceWarbandLeader(
            rosterId, warbandId, request.getProfileId(), Set.copyOf(request.getOptionIds()));

    return ResponseEntity.ok(rosterUnitMapper.toDto(leader));
  }

  @Override
  public ResponseEntity<RosterUnit> createWarbandFollower(
      Long rosterId, Long warbandId, CreateFollowerRequest request) {

    var follower =
        rosterService.addFollower(
            rosterId,
            warbandId,
            request.getProfileId(),
            request.getQuantity(),
            Set.copyOf(request.getOptionIds()));

    return ResponseEntity.status(201).body(rosterUnitMapper.toDto(follower));
  }

  @Override
  public ResponseEntity<RosterUnit> updateWarbandUnit(
      Long rosterId, Long warbandId, Long unitId, UpdateRosterUnitRequest request) {

    var unit =
        rosterService.updateUnit(
            rosterId, warbandId, unitId, request.getQuantity(), request.getOptionIds());

    return ResponseEntity.ok(rosterUnitMapper.toDto(unit));
  }

  @Override
  public ResponseEntity<Void> deleteWarbandUnit(Long rosterId, Long warbandId, Long unitId) {

    rosterService.deleteUnit(rosterId, warbandId, unitId);

    return ResponseEntity.noContent().build();
  }

  private Set<String> toSet(List<String> values) {
    return values == null ? null : Set.copyOf(values);
  }
}
