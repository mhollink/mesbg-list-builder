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

import com.mesbg.listbuilder.armies.roster.api.mapper.RosterGroupEntryMapper;
import com.mesbg.listbuilder.armies.roster.api.mapper.RosterGroupMapper;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.armies.roster.service.RosterGroupService;
import com.mesbg.listbuilder.generated.model.RosterGroup;
import java.util.List;
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
    value = RosterGroupsController.class,
    excludeAutoConfiguration = {
      OAuth2ResourceServerAutoConfiguration.class,
      OAuth2ResourceServerWebSecurityAutoConfiguration.class
    })
@AutoConfigureMockMvc(addFilters = false)
class RosterGroupsControllerTest {

  private static final long GROUP_ID = 42L;
  private static final long PARENT_GROUP_ID = 12L;

  @Autowired private MockMvc mockMvc;

  @MockitoBean private RosterGroupService rosterGroupService;

  @MockitoBean private RosterGroupMapper rosterGroupMapper;

  @MockitoBean private RosterGroupEntryMapper rosterGroupEntryMapper;

  @Nested
  class ReadingAndCreating {

    @Test
    void listsRosterGroups() throws Exception {
      var entity = groupEntity(GROUP_ID, "Events");
      var dto = groupDto(GROUP_ID, "Events");

      when(rosterGroupService.listGroups()).thenReturn(List.of(entity));

      when(rosterGroupMapper.toTree(List.of(entity))).thenReturn(List.of(dto));

      mockMvc
          .perform(get("/api/v1/roster-groups"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$[0].id").value(GROUP_ID))
          .andExpect(jsonPath("$[0].name").value("Events"));
    }

    @Test
    void createsRootGroup() throws Exception {
      var entity = groupEntity(GROUP_ID, "Events");
      var dto = groupDto(GROUP_ID, "Events");

      when(rosterGroupService.createGroup("Events", null)).thenReturn(entity);

      when(rosterGroupEntryMapper.toDto(entity)).thenReturn(dto);

      mockMvc
          .perform(
              post("/api/v1/roster-groups")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                          {
                            "name": "Events"
                          }
                          """))
          .andExpect(status().isCreated())
          .andExpect(header().string("Location", "http://localhost/api/v1/roster-groups/42"))
          .andExpect(jsonPath("$.id").value(GROUP_ID))
          .andExpect(jsonPath("$.name").value("Events"));

      verify(rosterGroupService).createGroup("Events", null);
    }

    @Test
    void createsNestedGroup() throws Exception {
      var entity = groupEntity(GROUP_ID, "2026");
      var dto = groupDto(GROUP_ID, "2026");

      when(rosterGroupService.createGroup("2026", PARENT_GROUP_ID)).thenReturn(entity);

      when(rosterGroupEntryMapper.toDto(entity)).thenReturn(dto);

      mockMvc
          .perform(
              post("/api/v1/roster-groups")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                          {
                            "name": "2026",
                            "parentGroupId": 12
                          }
                          """))
          .andExpect(status().isCreated());

      verify(rosterGroupService).createGroup("2026", PARENT_GROUP_ID);
    }

    @Test
    void rejectsGroupWithoutName() throws Exception {
      mockMvc
          .perform(
              post("/api/v1/roster-groups").contentType(MediaType.APPLICATION_JSON).content("{}"))
          .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsBlankGroupName() throws Exception {
      mockMvc
          .perform(
              post("/api/v1/roster-groups")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                          {
                            "name": ""
                          }
                          """))
          .andExpect(status().isBadRequest());
    }
  }

  @Nested
  class Updating {

    @Test
    void renamesGroup() throws Exception {
      var entity = groupEntity(GROUP_ID, "New name");
      var dto = groupDto(GROUP_ID, "New name");

      when(rosterGroupService.renameGroup(GROUP_ID, "New name")).thenReturn(entity);

      when(rosterGroupEntryMapper.toDto(entity)).thenReturn(dto);

      mockMvc
          .perform(
              patch("/api/v1/roster-groups/{groupId}", GROUP_ID)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                          {
                            "name": "New name"
                          }
                          """))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.name").value("New name"));

      verify(rosterGroupService).renameGroup(GROUP_ID, "New name");
    }

    @Test
    void deletesGroup() throws Exception {
      mockMvc
          .perform(delete("/api/v1/roster-groups/{groupId}", GROUP_ID))
          .andExpect(status().isNoContent());

      verify(rosterGroupService).deleteGroup(GROUP_ID);
    }
  }

  @Nested
  class Moving {

    @Test
    void movesGroupUnderParent() throws Exception {
      mockMvc
          .perform(
              put(
                  "/api/v1/roster-groups/{groupId}/parent/{parentGroupId}",
                  GROUP_ID,
                  PARENT_GROUP_ID))
          .andExpect(status().isNoContent());

      verify(rosterGroupService).moveGroup(GROUP_ID, PARENT_GROUP_ID);
    }

    @Test
    void movesGroupToRoot() throws Exception {
      mockMvc
          .perform(delete("/api/v1/roster-groups/{groupId}/parent", GROUP_ID))
          .andExpect(status().isNoContent());

      verify(rosterGroupService).moveGroupToRoot(GROUP_ID);
    }
  }

  private RosterGroupEntity groupEntity(long id, String name) {

    var group = new RosterGroupEntity();

    group.setId(id);
    group.setName(name);

    return group;
  }

  private RosterGroup groupDto(long id, String name) {

    var group = new RosterGroup();

    group.setId(id);
    group.setName(name);
    group.setChildren(List.of());

    return group;
  }
}
