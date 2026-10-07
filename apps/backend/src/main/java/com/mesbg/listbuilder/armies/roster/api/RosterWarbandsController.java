package com.mesbg.listbuilder.armies.roster.api;

import com.mesbg.listbuilder.armies.roster.api.mapper.WarbandMapper;
import com.mesbg.listbuilder.armies.roster.service.RosterWarbandsService;
import com.mesbg.listbuilder.generated.api.RosterWarbandsApi;
import com.mesbg.listbuilder.generated.model.MoveWarbandRequest;
import com.mesbg.listbuilder.generated.model.Warband;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RosterWarbandsController implements RosterWarbandsApi {

  private final RosterWarbandsService rosterWarbandService;
  private final WarbandMapper warbandMapper;

  @Override
  public ResponseEntity<Warband> createWarband(Long rosterId) {
    var warband = rosterWarbandService.createWarband(rosterId);

    return ResponseEntity.status(201).body(warbandMapper.toDto(warband));
  }

  @Override
  public ResponseEntity<Void> deleteWarband(Long rosterId, Long warbandId) {
    rosterWarbandService.deleteWarband(rosterId, warbandId);

    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Warband> duplicateWarband(Long rosterId, Long warbandId) {
    var warband = rosterWarbandService.duplicateWarband(rosterId, warbandId);

    return ResponseEntity.status(201).body(warbandMapper.toDto(warband));
  }

  @Override
  public ResponseEntity<Void> moveWarband(
      Long rosterId, Long warbandId, MoveWarbandRequest request) {

    rosterWarbandService.moveWarband(rosterId, warbandId, request.getPosition());

    return ResponseEntity.noContent().build();
  }
}
