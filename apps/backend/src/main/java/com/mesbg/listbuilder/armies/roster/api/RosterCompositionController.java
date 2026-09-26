package com.mesbg.listbuilder.armies.roster.api;

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterMapper;
import com.mesbg.listbuilder.armies.roster.service.RosterCompositionService;
import com.mesbg.listbuilder.generated.api.RosterCompositionApi;
import com.mesbg.listbuilder.generated.model.RosterSummary;
import com.mesbg.listbuilder.generated.model.UpdateRosterArmyOptionsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RosterCompositionController implements RosterCompositionApi {

  private final RosterCompositionService rosterService;
  private final RosterMapper rosterMapper;

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
  public ResponseEntity<RosterSummary> setRosterArmyOptions(
      Long rosterId, UpdateRosterArmyOptionsRequest request) {
    var snapshot = rosterService.setArmyOptions(rosterId, request.getOptionIds());
    return ResponseEntity.ok(rosterMapper.toSummary(snapshot.roster(), snapshot.statistics()));
  }
}
