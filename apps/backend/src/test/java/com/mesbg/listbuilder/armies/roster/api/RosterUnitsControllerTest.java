package com.mesbg.listbuilder.armies.roster.api;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterUnitMapper;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.service.RosterUnitsService;
import com.mesbg.listbuilder.generated.model.RosterUnit;
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
    controllers = RosterUnitsController.class,
    excludeAutoConfiguration = {
      OAuth2ResourceServerAutoConfiguration.class,
      OAuth2ResourceServerWebSecurityAutoConfiguration.class
    })
@AutoConfigureMockMvc(addFilters = false)
class RosterUnitsControllerTest {

  private static final long ROSTER_ID = 42L;
  private static final long WARBAND_ID = 23L;
  private static final long UNIT_ID = 34L;

  @Autowired private MockMvc mockMvc;

  @MockitoBean private RosterUnitsService rosterUnitsService;
  @MockitoBean private RosterUnitMapper rosterUnitMapper;

  @Test
  void setsWarbandLeader() throws Exception {
    var entity = new RosterUnitEntity();
    var dto = unitDto(UNIT_ID, "witch-king");

    when(rosterUnitsService.setWarbandLeader(ROSTER_ID, WARBAND_ID, "witch-king", Set.of("horse")))
        .thenReturn(entity);
    when(rosterUnitMapper.toDto(entity)).thenReturn(dto);

    mockMvc
        .perform(
            put("/api/v1/rosters/{rosterId}/warbands/{warbandId}/leader", ROSTER_ID, WARBAND_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "armyListProfileId": "witch-king",
                      "optionIds": ["horse"]
                    }
                    """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(UNIT_ID))
        .andExpect(jsonPath("$.armyListProfileId").value("witch-king"));
  }

  @Test
  void createsFollower() throws Exception {
    var entity = new RosterUnitEntity();
    var dto = unitDto(UNIT_ID, "orc-warrior");

    when(rosterUnitsService.addFollower(ROSTER_ID, WARBAND_ID, "orc-warrior", 5, Set.of("shield")))
        .thenReturn(entity);
    when(rosterUnitMapper.toDto(entity)).thenReturn(dto);

    mockMvc
        .perform(
            post("/api/v1/rosters/{rosterId}/warbands/{warbandId}/followers", ROSTER_ID, WARBAND_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "armyListProfileId": "orc-warrior",
                      "quantity": 5,
                      "optionIds": ["shield"]
                    }
                    """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(UNIT_ID));

    verify(rosterUnitsService)
        .addFollower(ROSTER_ID, WARBAND_ID, "orc-warrior", 5, Set.of("shield"));
  }

  @Test
  void rejectsFollowerWithInvalidQuantity() throws Exception {
    mockMvc
        .perform(
            post("/api/v1/rosters/{rosterId}/warbands/{warbandId}/followers", ROSTER_ID, WARBAND_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "profileId": "orc-warrior",
                      "quantity": 0,
                      "optionIds": []
                    }
                    """))
        .andExpect(status().isBadRequest());
  }

  @Test
  void updatesUnit() throws Exception {
    var entity = new RosterUnitEntity();
    var dto = unitDto(UNIT_ID, "orc-warrior");

    when(rosterUnitsService.updateUnit(ROSTER_ID, WARBAND_ID, UNIT_ID, 6, Set.of("shield")))
        .thenReturn(entity);
    when(rosterUnitMapper.toDto(entity)).thenReturn(dto);

    mockMvc
        .perform(
            patch(
                    "/api/v1/rosters/{rosterId}/warbands/{warbandId}/units/{unitId}",
                    ROSTER_ID,
                    WARBAND_ID,
                    UNIT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "quantity": 6,
                      "optionIds": ["shield"]
                    }
                    """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(UNIT_ID));
  }

  @Test
  void deletesUnit() throws Exception {
    mockMvc
        .perform(
            delete(
                "/api/v1/rosters/{rosterId}/warbands/{warbandId}/units/{unitId}",
                ROSTER_ID,
                WARBAND_ID,
                UNIT_ID))
        .andExpect(status().isNoContent());

    verify(rosterUnitsService).deleteUnit(ROSTER_ID, WARBAND_ID, UNIT_ID);
  }

  @Test
  void movesUnitToAnotherWarband() throws Exception {
    mockMvc
        .perform(
            patch(
                    "/api/v1/rosters/{rosterId}/warbands/{warbandId}/units/{unitId}/position",
                    ROSTER_ID,
                    WARBAND_ID,
                    UNIT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "targetWarbandId": 24,
                      "position": 1
                    }
                    """))
        .andExpect(status().isNoContent());

    verify(rosterUnitsService).moveUnit(ROSTER_ID, WARBAND_ID, UNIT_ID, 24L, 1);
  }

  private RosterUnit unitDto(long id, String profileId) {
    var unit = new RosterUnit();

    unit.setId(id);
    unit.setArmyListProfileId(profileId);
    unit.setQuantity(1);
    unit.setOptionIds(Set.of());

    return unit;
  }
}
