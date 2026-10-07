package com.mesbg.listbuilder.armies.roster.api;

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterMapper;
import com.mesbg.listbuilder.armies.roster.service.RosterService;
import com.mesbg.listbuilder.generated.api.RostersApi;
import com.mesbg.listbuilder.generated.model.CreateRosterRequest;
import com.mesbg.listbuilder.generated.model.Roster;
import com.mesbg.listbuilder.generated.model.RosterSummary;
import com.mesbg.listbuilder.generated.model.UpdateRosterRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
public class RostersController implements RostersApi {

  private final RosterService rosterService;
  private final RosterMapper rosterMapper;

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
  public ResponseEntity<RosterSummary> favoriteRoster(Long rosterId) {
    var snapshot = rosterService.favoriteRoster(rosterId);

    return ResponseEntity.ok(rosterMapper.toSummary(snapshot.roster(), snapshot.statistics()));
  }

  @Override
  public ResponseEntity<RosterSummary> unfavoriteRoster(Long rosterId) {
    var snapshot = rosterService.unfavoriteRoster(rosterId);

    return ResponseEntity.ok(rosterMapper.toSummary(snapshot.roster(), snapshot.statistics()));
  }

  @Override
  public ResponseEntity<RosterSummary> lockRoster(Long rosterId) {
    var snapshot = rosterService.lockRoster(rosterId);

    return ResponseEntity.ok(rosterMapper.toSummary(snapshot.roster(), snapshot.statistics()));
  }

  @Override
  public ResponseEntity<RosterSummary> unlockRoster(Long rosterId) {
    var snapshot = rosterService.unlockRoster(rosterId);

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
}
