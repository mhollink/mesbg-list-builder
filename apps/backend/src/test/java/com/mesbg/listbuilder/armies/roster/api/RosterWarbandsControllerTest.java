package com.mesbg.listbuilder.armies.roster.api;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mesbg.listbuilder.armies.roster.api.mapper.WarbandMapper;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.RosterWarbandsService;
import com.mesbg.listbuilder.generated.model.Warband;
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
    controllers = RosterWarbandsController.class,
    excludeAutoConfiguration = {
      OAuth2ResourceServerAutoConfiguration.class,
      OAuth2ResourceServerWebSecurityAutoConfiguration.class
    })
@AutoConfigureMockMvc(addFilters = false)
class RosterWarbandsControllerTest {

  private static final long ROSTER_ID = 42L;
  private static final long WARBAND_ID = 23L;

  @Autowired private MockMvc mockMvc;

  @MockitoBean private RosterWarbandsService rosterWarbandsService;
  @MockitoBean private WarbandMapper warbandMapper;

  @Test
  void createsEmptyWarband() throws Exception {
    var entity = new WarbandEntity();
    var dto = warbandDto(WARBAND_ID);

    when(rosterWarbandsService.createWarband(ROSTER_ID)).thenReturn(entity);
    when(warbandMapper.toDto(entity)).thenReturn(dto);

    mockMvc
        .perform(post("/api/v1/rosters/{rosterId}/warbands", ROSTER_ID))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(WARBAND_ID));

    verify(rosterWarbandsService).createWarband(ROSTER_ID);
  }

  @Test
  void duplicatesWarband() throws Exception {
    var entity = new WarbandEntity();
    var dto = warbandDto(WARBAND_ID);

    when(rosterWarbandsService.duplicateWarband(ROSTER_ID, WARBAND_ID)).thenReturn(entity);
    when(warbandMapper.toDto(entity)).thenReturn(dto);

    mockMvc
        .perform(
            post(
                "/api/v1/rosters/{rosterId}/warbands/{warbandId}/duplicate", ROSTER_ID, WARBAND_ID))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(WARBAND_ID));

    verify(rosterWarbandsService).duplicateWarband(ROSTER_ID, WARBAND_ID);
  }

  @Test
  void movesWarband() throws Exception {
    mockMvc
        .perform(
            patch("/api/v1/rosters/{rosterId}/warbands/{warbandId}", ROSTER_ID, WARBAND_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "position": 1
                    }
                    """))
        .andExpect(status().isNoContent());

    verify(rosterWarbandsService).moveWarband(ROSTER_ID, WARBAND_ID, 1);
  }

  @Test
  void deletesWarband() throws Exception {
    mockMvc
        .perform(delete("/api/v1/rosters/{rosterId}/warbands/{warbandId}", ROSTER_ID, WARBAND_ID))
        .andExpect(status().isNoContent());

    verify(rosterWarbandsService).deleteWarband(ROSTER_ID, WARBAND_ID);
  }

  private Warband warbandDto(long id) {
    var warband = new Warband();
    warband.setId(id);
    return warband;
  }
}
