package com.mesbg.listbuilder.armies.roster.api;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterMapper;
import com.mesbg.listbuilder.armies.roster.api.mapper.RosterUnitMapper;
import com.mesbg.listbuilder.armies.roster.api.mapper.WarbandMapper;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.RosterService;
import com.mesbg.listbuilder.armies.roster.service.RosterSnapshot;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;
import com.mesbg.listbuilder.generated.model.Roster;
import com.mesbg.listbuilder.generated.model.RosterSummary;
import com.mesbg.listbuilder.generated.model.RosterUnit;
import com.mesbg.listbuilder.generated.model.Warband;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Nested;
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
    controllers = RosterController.class,
    excludeAutoConfiguration = {
      OAuth2ResourceServerAutoConfiguration.class,
      OAuth2ResourceServerWebSecurityAutoConfiguration.class
    })
@AutoConfigureMockMvc(addFilters = false)
class RosterControllerTest {

  private static final long ROSTER_ID = 42L;
  private static final long GROUP_ID = 12L;
  private static final long WARBAND_ID = 23L;
  private static final long UNIT_ID = 34L;

  private static final RosterStatistics STATISTICS = new RosterStatistics(750, 3, 32, 8, 10, 4);

  @Autowired private MockMvc mockMvc;

  @MockitoBean private RosterService rosterService;

  @MockitoBean private RosterMapper rosterMapper;

  @MockitoBean private WarbandMapper warbandMapper;

  @MockitoBean private RosterUnitMapper rosterUnitMapper;

  @Nested
  class Rosters {

    @Test
    void listsRosters() throws Exception {
      var firstEntity = rosterEntity(42L);
      var secondEntity = rosterEntity(43L);

      var firstSnapshot = new RosterSnapshot(firstEntity, STATISTICS);
      var secondSnapshot = new RosterSnapshot(secondEntity, STATISTICS);

      var firstDto = summary(42L, "Mordor");
      var secondDto = summary(43L, "Isengard");

      when(rosterService.listRosters()).thenReturn(List.of(firstSnapshot, secondSnapshot));

      when(rosterMapper.toSummary(firstEntity, STATISTICS)).thenReturn(firstDto);

      when(rosterMapper.toSummary(secondEntity, STATISTICS)).thenReturn(secondDto);

      mockMvc
          .perform(get("/api/v1/rosters"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$[0].id").value(42))
          .andExpect(jsonPath("$[0].name").value("Mordor"))
          .andExpect(jsonPath("$[1].id").value(43))
          .andExpect(jsonPath("$[1].name").value("Isengard"));
    }

    @Test
    void getsRoster() throws Exception {
      var entity = rosterEntity(ROSTER_ID);
      var snapshot = new RosterSnapshot(entity, STATISTICS);
      var dto = rosterDto(ROSTER_ID, "Mordor");

      when(rosterService.getRoster(ROSTER_ID)).thenReturn(snapshot);

      when(rosterMapper.toDto(entity, STATISTICS)).thenReturn(dto);

      mockMvc
          .perform(get("/api/v1/rosters/{rosterId}", ROSTER_ID))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.id").value(ROSTER_ID))
          .andExpect(jsonPath("$.name").value("Mordor"));

      verify(rosterService).getRoster(ROSTER_ID);
    }

    @Test
    void createsRoster() throws Exception {
      var entity = rosterEntity(ROSTER_ID);
      var snapshot = new RosterSnapshot(entity, STATISTICS);
      var dto = rosterDto(ROSTER_ID, "Mordor");

      when(rosterService.createRoster("Mordor", "mordor", 800, List.of("Tournament"), GROUP_ID))
          .thenReturn(snapshot);

      when(rosterMapper.toDto(entity, STATISTICS)).thenReturn(dto);

      mockMvc
          .perform(
              post("/api/v1/rosters")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {
                        "name": "Mordor",
                        "armyListId": "mordor",
                        "groupId": 12,
                        "pointsLimit": 800,
                        "tags": ["Tournament"]
                      }
                      """))
          .andExpect(status().isCreated())
          .andExpect(header().string("Location", "http://localhost/api/v1/rosters/42"))
          .andExpect(jsonPath("$.id").value(42))
          .andExpect(jsonPath("$.name").value("Mordor"));
    }

    @Test
    void rejectsInvalidCreateRosterRequest() throws Exception {
      mockMvc
          .perform(
              post("/api/v1/rosters")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {
                        "name": "",
                        "armyListId": "mordor",
                        "pointsLimit": 0
                      }
                      """))
          .andExpect(status().isBadRequest());
    }

    @Test
    void updatesRoster() throws Exception {
      var entity = rosterEntity(ROSTER_ID);
      var snapshot = new RosterSnapshot(entity, STATISTICS);
      var dto = summary(ROSTER_ID, "Updated roster");

      when(rosterService.updateRoster(ROSTER_ID, "Updated roster", 750, List.of("Tournament")))
          .thenReturn(snapshot);

      when(rosterMapper.toSummary(entity, STATISTICS)).thenReturn(dto);

      mockMvc
          .perform(
              patch("/api/v1/rosters/{rosterId}", ROSTER_ID)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {
                        "name": "Updated roster",
                        "pointsLimit": 750,
                        "tags": ["Tournament"]
                      }
                      """))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.id").value(ROSTER_ID))
          .andExpect(jsonPath("$.name").value("Updated roster"));
    }

    @Test
    void omittedTagsRemainNullWhenUpdatingRoster() throws Exception {
      var entity = rosterEntity(ROSTER_ID);
      var snapshot = new RosterSnapshot(entity, STATISTICS);
      var dto = summary(ROSTER_ID, "Updated");

      when(rosterService.updateRoster(ROSTER_ID, "Updated", null, null)).thenReturn(snapshot);
      when(rosterMapper.toSummary(entity, STATISTICS)).thenReturn(dto);

      mockMvc
          .perform(
              patch("/api/v1/rosters/{rosterId}", ROSTER_ID)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {
                        "name": "Updated"
                      }
                      """))
          .andExpect(status().isOk());

      verify(rosterService).updateRoster(ROSTER_ID, "Updated", null, null);
    }

    @Test
    void deletesRoster() throws Exception {
      mockMvc
          .perform(delete("/api/v1/rosters/{rosterId}", ROSTER_ID))
          .andExpect(status().isNoContent());

      verify(rosterService).deleteRoster(ROSTER_ID);
    }
  }

  @Nested
  class Metadata {

    @Test
    void favoritesRoster() throws Exception {
      var entity = rosterEntity(ROSTER_ID);
      var snapshot = new RosterSnapshot(entity, STATISTICS);
      var dto = summary(ROSTER_ID, "Mordor");
      dto.setFavorite(true);

      when(rosterService.favoriteRoster(ROSTER_ID)).thenReturn(snapshot);

      when(rosterMapper.toSummary(entity, STATISTICS)).thenReturn(dto);

      mockMvc
          .perform(put("/api/v1/rosters/{rosterId}/favorite", ROSTER_ID))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.favorite").value(true));

      verify(rosterService).favoriteRoster(ROSTER_ID);
    }

    @Test
    void unfavoritesRoster() throws Exception {
      var entity = rosterEntity(ROSTER_ID);
      var snapshot = new RosterSnapshot(entity, STATISTICS);
      var dto = summary(ROSTER_ID, "Mordor");
      dto.setFavorite(false);

      when(rosterService.unfavoriteRoster(ROSTER_ID)).thenReturn(snapshot);

      when(rosterMapper.toSummary(entity, STATISTICS)).thenReturn(dto);

      mockMvc
          .perform(delete("/api/v1/rosters/{rosterId}/favorite", ROSTER_ID))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.favorite").value(false));

      verify(rosterService).unfavoriteRoster(ROSTER_ID);
    }

    @Test
    void locksRoster() throws Exception {
      var entity = rosterEntity(ROSTER_ID);
      var snapshot = new RosterSnapshot(entity, STATISTICS);
      var dto = summary(ROSTER_ID, "Mordor");
      dto.setLocked(true);

      when(rosterService.lockRoster(ROSTER_ID)).thenReturn(snapshot);

      when(rosterMapper.toSummary(entity, STATISTICS)).thenReturn(dto);

      mockMvc
          .perform(put("/api/v1/rosters/{rosterId}/lock", ROSTER_ID))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.locked").value(true));

      verify(rosterService).lockRoster(ROSTER_ID);
    }

    @Test
    void unlocksRoster() throws Exception {
      var entity = rosterEntity(ROSTER_ID);
      var snapshot = new RosterSnapshot(entity, STATISTICS);
      var dto = summary(ROSTER_ID, "Mordor");
      dto.setLocked(false);

      when(rosterService.unlockRoster(ROSTER_ID)).thenReturn(snapshot);

      when(rosterMapper.toSummary(entity, STATISTICS)).thenReturn(dto);

      mockMvc
          .perform(delete("/api/v1/rosters/{rosterId}/lock", ROSTER_ID))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.locked").value(false));

      verify(rosterService).unlockRoster(ROSTER_ID);
    }
  }

  @Nested
  class GroupAssignment {

    @Test
    void assignsRosterToGroup() throws Exception {
      mockMvc
          .perform(put("/api/v1/rosters/{rosterId}/group/{groupId}", ROSTER_ID, GROUP_ID))
          .andExpect(status().isNoContent());

      verify(rosterService).assignRosterToGroup(ROSTER_ID, GROUP_ID);
    }

    @Test
    void removesRosterFromGroup() throws Exception {
      mockMvc
          .perform(delete("/api/v1/rosters/{rosterId}/group", ROSTER_ID))
          .andExpect(status().isNoContent());

      verify(rosterService).removeRosterFromGroup(ROSTER_ID);
    }
  }

  @Nested
  class General {

    @Test
    void setsRosterGeneral() throws Exception {
      mockMvc
          .perform(put("/api/v1/rosters/{rosterId}/general/{unitId}", ROSTER_ID, UNIT_ID))
          .andExpect(status().isNoContent());

      verify(rosterService).setRosterGeneral(ROSTER_ID, UNIT_ID);
    }

    @Test
    void clearsRosterGeneral() throws Exception {
      mockMvc
          .perform(delete("/api/v1/rosters/{rosterId}/general", ROSTER_ID))
          .andExpect(status().isNoContent());

      verify(rosterService).clearRosterGeneral(ROSTER_ID);
    }
  }

  @Nested
  class Warbands {

    @Test
    void createsWarband() throws Exception {
      var entity = new WarbandEntity();
      var dto = warbandDto(WARBAND_ID);

      when(rosterService.createWarband(ROSTER_ID, "witch-king", Set.of("horse")))
          .thenReturn(entity);

      when(warbandMapper.toDto(entity)).thenReturn(dto);

      mockMvc
          .perform(
              post("/api/v1/rosters/{rosterId}/warbands", ROSTER_ID)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {
                        "leader": {
                          "profileId": "witch-king",
                          "optionIds": ["horse"]
                        }
                      }
                      """))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("$.id").value(WARBAND_ID));
    }

    @Test
    void rejectsWarbandWithoutLeader() throws Exception {
      mockMvc
          .perform(
              post("/api/v1/rosters/{rosterId}/warbands", ROSTER_ID)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{}"))
          .andExpect(status().isBadRequest());
    }

    @Test
    void deletesWarband() throws Exception {
      mockMvc
          .perform(delete("/api/v1/rosters/{rosterId}/warbands/{warbandId}", ROSTER_ID, WARBAND_ID))
          .andExpect(status().isNoContent());

      verify(rosterService).deleteWarband(ROSTER_ID, WARBAND_ID);
    }

    @Test
    void replacesWarbandLeader() throws Exception {
      var entity = new RosterUnitEntity();
      var dto = unitDto(UNIT_ID, "witch-king");

      when(rosterService.replaceWarbandLeader(ROSTER_ID, WARBAND_ID, "witch-king", Set.of("horse")))
          .thenReturn(entity);

      when(rosterUnitMapper.toDto(entity)).thenReturn(dto);

      mockMvc
          .perform(
              put("/api/v1/rosters/{rosterId}/warbands/{warbandId}/leader", ROSTER_ID, WARBAND_ID)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {
                        "profileId": "witch-king",
                        "optionIds": ["horse"]
                      }
                      """))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.id").value(UNIT_ID))
          .andExpect(jsonPath("$.profileId").value("witch-king"));
    }

    @Test
    void createsFollower() throws Exception {
      var entity = new RosterUnitEntity();
      var dto = unitDto(UNIT_ID, "orc-warrior");

      when(rosterService.addFollower(ROSTER_ID, WARBAND_ID, "orc-warrior", 5, Set.of("shield")))
          .thenReturn(entity);

      when(rosterUnitMapper.toDto(entity)).thenReturn(dto);

      mockMvc
          .perform(
              post(
                      "/api/v1/rosters/{rosterId}/warbands/{warbandId}/followers",
                      ROSTER_ID,
                      WARBAND_ID)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {
                        "profileId": "orc-warrior",
                        "quantity": 5,
                        "optionIds": ["shield"]
                      }
                      """))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("$.id").value(UNIT_ID));

      verify(rosterService).addFollower(ROSTER_ID, WARBAND_ID, "orc-warrior", 5, Set.of("shield"));
    }

    @Test
    void rejectsFollowerWithInvalidQuantity() throws Exception {
      mockMvc
          .perform(
              post(
                      "/api/v1/rosters/{rosterId}/warbands/{warbandId}/followers",
                      ROSTER_ID,
                      WARBAND_ID)
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

      when(rosterService.updateUnit(ROSTER_ID, WARBAND_ID, UNIT_ID, 6, Set.of("shield")))
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

      verify(rosterService).deleteUnit(ROSTER_ID, WARBAND_ID, UNIT_ID);
    }
  }

  private RosterEntity rosterEntity(long id) {
    var roster = new RosterEntity();
    roster.setId(id);
    return roster;
  }

  private RosterSummary summary(long id, String name) {
    var roster = new RosterSummary();

    roster.setId(id);
    roster.setName(name);
    roster.setArmyListId("test-army-list");
    roster.setFavorite(false);
    roster.setLocked(false);
    roster.setTags(List.of());
    roster.setPoints(750);
    roster.setWarbandCount(3);
    roster.setModelCount(32);
    roster.setMight(8);
    roster.setBowCount(10);
    roster.setThrowingWeaponCount(4);

    return roster;
  }

  private Roster rosterDto(long id, String name) {
    var roster = new Roster();

    roster.setId(id);
    roster.setName(name);
    roster.setArmyListId("test-army-list");
    roster.setFavorite(false);
    roster.setLocked(false);
    roster.setTags(List.of());
    roster.setPoints(750);
    roster.setWarbandCount(3);
    roster.setModelCount(32);
    roster.setMight(8);
    roster.setBowCount(10);
    roster.setThrowingWeaponCount(4);
    roster.setWarbands(List.of());

    return roster;
  }

  private Warband warbandDto(long id) {
    var warband = new Warband();
    warband.setId(id);
    return warband;
  }

  private RosterUnit unitDto(long id, String profileId) {
    var unit = new RosterUnit();

    unit.setId(id);
    unit.setProfileId(profileId);
    unit.setQuantity(1);
    unit.setOptionIds(Set.of());

    return unit;
  }
}
