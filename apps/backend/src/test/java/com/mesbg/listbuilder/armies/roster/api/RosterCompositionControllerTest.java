package com.mesbg.listbuilder.armies.roster.api;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterMapper;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.service.RosterCompositionService;
import com.mesbg.listbuilder.armies.roster.service.RosterSnapshot;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;
import com.mesbg.listbuilder.generated.model.RosterSummary;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.oauth2.server.resource.autoconfigure.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.security.oauth2.server.resource.autoconfigure.web.OAuth2ResourceServerWebSecurityAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
    controllers = RosterCompositionController.class,
    excludeAutoConfiguration = {
      OAuth2ResourceServerAutoConfiguration.class,
      OAuth2ResourceServerWebSecurityAutoConfiguration.class
    })
@AutoConfigureMockMvc(addFilters = false)
class RosterCompositionControllerTest {

  private static final long ROSTER_ID = 42L;
  private static final long UNIT_ID = 34L;

  @Autowired private MockMvc mockMvc;

  @MockitoBean private RosterMapper rosterMapper;
  @MockitoBean private RosterCompositionService rosterCompositionService;

  @Test
  void setsRosterGeneral() throws Exception {
    mockMvc
        .perform(put("/api/v1/rosters/{rosterId}/general/{unitId}", ROSTER_ID, UNIT_ID))
        .andExpect(status().isNoContent());

    verify(rosterCompositionService).setRosterGeneral(ROSTER_ID, UNIT_ID);
  }

  @Test
  void clearsRosterGeneral() throws Exception {
    mockMvc
        .perform(delete("/api/v1/rosters/{rosterId}/general", ROSTER_ID))
        .andExpect(status().isNoContent());

    verify(rosterCompositionService).clearRosterGeneral(ROSTER_ID);
  }

  @Test
  void setsRosterArmyOptions() throws Exception {
    var roster = new RosterEntity();
    var statistics = new RosterStatistics(0, 0, 0, 0, 0, 0);
    var snapshot = new RosterSnapshot(roster, statistics);
    when(rosterCompositionService.setArmyOptions(ROSTER_ID, Set.of("banner", "horses")))
        .thenReturn(snapshot);
    when(rosterMapper.toSummary(roster, statistics)).thenReturn(new RosterSummary());

    mockMvc
        .perform(
            put("/api/v1/rosters/{rosterId}/army-options", ROSTER_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"optionIds": ["banner", "horses"]}
                    """))
        .andExpect(status().isOk());

    verify(rosterCompositionService).setArmyOptions(ROSTER_ID, Set.of("banner", "horses"));
    verify(rosterMapper).toSummary(roster, statistics);
  }
}
