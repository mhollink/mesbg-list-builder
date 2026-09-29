package com.mesbg.listbuilder.armies.roster.api;

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterUnitMapper;
import com.mesbg.listbuilder.armies.roster.service.RosterUnitsService;
import com.mesbg.listbuilder.generated.api.RosterUnitsApi;
import com.mesbg.listbuilder.generated.model.CreateFollowerRequest;
import com.mesbg.listbuilder.generated.model.LeaderInput;
import com.mesbg.listbuilder.generated.model.MoveRosterUnitRequest;
import com.mesbg.listbuilder.generated.model.RosterUnit;
import com.mesbg.listbuilder.generated.model.UpdateRosterUnitRequest;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RosterUnitsController implements RosterUnitsApi {

  private final RosterUnitsService rosterUnitsService;
  private final RosterUnitMapper rosterUnitMapper;

  @Override
  public ResponseEntity<RosterUnit> setWarbandLeader(
      Long rosterId, Long warbandId, LeaderInput request) {

    var leader =
        rosterUnitsService.setWarbandLeader(
            rosterId,
            warbandId,
            request.getArmyListProfileId(),
            Set.copyOf(request.getOptionIds()));

    return ResponseEntity.ok(rosterUnitMapper.toDto(leader));
  }

  @Override
  public ResponseEntity<RosterUnit> createWarbandFollower(
      Long rosterId, Long warbandId, CreateFollowerRequest request) {

    var follower =
        rosterUnitsService.addFollower(
            rosterId,
            warbandId,
            request.getArmyListProfileId(),
            request.getQuantity(),
            Set.copyOf(request.getOptionIds()));

    return ResponseEntity.status(201).body(rosterUnitMapper.toDto(follower));
  }

  @Override
  public ResponseEntity<RosterUnit> updateWarbandUnit(
      Long rosterId, Long warbandId, Long unitId, UpdateRosterUnitRequest request) {

    var unit =
        rosterUnitsService.updateUnit(
            rosterId, warbandId, unitId, request.getQuantity(), request.getOptionIds());

    return ResponseEntity.ok(rosterUnitMapper.toDto(unit));
  }

  @Override
  public ResponseEntity<Void> deleteWarbandUnit(Long rosterId, Long warbandId, Long unitId) {
    rosterUnitsService.deleteUnit(rosterId, warbandId, unitId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> moveRosterUnit(
      Long rosterId, Long warbandId, Long unitId, MoveRosterUnitRequest request) {
    rosterUnitsService.moveUnit(
        rosterId, warbandId, unitId, request.getTargetWarbandId(), request.getPosition());

    return ResponseEntity.noContent().build();
  }
}
