package com.mesbg.listbuilder.armies.roster.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.account.AuthenticatedUserService;
import com.mesbg.listbuilder.account.UserEntity;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.InvalidRosterGroupMoveException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotEmptyException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotFoundException;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterGroupServiceTest {

  private static final long USER_ID = 10L;

  @Mock private AuthenticatedUserService authenticatedUserService;

  @Mock private RosterGroupRepository rosterGroupRepository;

  @Mock private RosterRepository rosterRepository;

  @InjectMocks private RosterGroupService service;

  private UserEntity user;

  @BeforeEach
  void setUp() {
    user = new UserEntity("keycloak-subject", "user@example.test");
    user.setId(USER_ID);

    when(authenticatedUserService.getCurrentUser()).thenReturn(user);
  }

  @Nested
  class ReadingAndCreating {

    @Test
    void listsGroupsForCurrentUser() {
      var first = group(20L, "Alpha", null);
      var second = group(21L, "Beta", null);

      when(rosterGroupRepository.findAllByUserIdOrderByNameAsc(USER_ID))
          .thenReturn(List.of(first, second));

      var result = service.listGroups();

      assertThat(result).containsExactly(first, second);
    }

    @Test
    void createsRootGroup() {
      when(rosterGroupRepository.save(any(RosterGroupEntity.class)))
          .thenAnswer(invocation -> invocation.getArgument(0));

      var result = service.createGroup("Events", null);

      assertThat(result.getUser()).isSameAs(user);
      assertThat(result.getName()).isEqualTo("Events");
      assertThat(result.getParentGroup()).isNull();
    }

    @Test
    void createsChildGroup() {
      var parent = group(20L, "Events", null);

      when(rosterGroupRepository.findByIdAndUserId(20L, USER_ID)).thenReturn(Optional.of(parent));

      when(rosterGroupRepository.save(any(RosterGroupEntity.class)))
          .thenAnswer(invocation -> invocation.getArgument(0));

      var result = service.createGroup("2026", 20L);

      assertThat(result.getParentGroup()).isSameAs(parent);
    }

    @Test
    void creatingChildFailsWhenParentDoesNotExist() {
      when(rosterGroupRepository.findByIdAndUserId(20L, USER_ID)).thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.createGroup("2026", 20L))
          .isInstanceOf(RosterGroupNotFoundException.class);

      verify(rosterGroupRepository, never()).save(any());
    }
  }

  @Nested
  class Renaming {

    @Test
    void renamesGroup() {
      var group = group(20L, "Old name", null);

      findGroup(group);

      var result = service.renameGroup(20L, "New name");

      assertThat(result).isSameAs(group);
      assertThat(group.getName()).isEqualTo("New name");
    }

    @Test
    void renamingUnknownGroupFails() {
      when(rosterGroupRepository.findByIdAndUserId(20L, USER_ID)).thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.renameGroup(20L, "New name"))
          .isInstanceOf(RosterGroupNotFoundException.class);
    }
  }

  @Nested
  class Deleting {

    @Test
    void deletesEmptyGroup() {
      var group = group(20L, "Events", null);

      findGroup(group);

      when(rosterGroupRepository.existsByParentGroupIdAndUserId(20L, USER_ID)).thenReturn(false);

      when(rosterRepository.existsByGroupIdAndUserId(20L, USER_ID)).thenReturn(false);

      service.deleteGroup(20L);

      verify(rosterGroupRepository).delete(group);
    }

    @Test
    void cannotDeleteGroupContainingChildGroups() {
      var group = group(20L, "Events", null);

      findGroup(group);

      when(rosterGroupRepository.existsByParentGroupIdAndUserId(20L, USER_ID)).thenReturn(true);

      assertThatThrownBy(() -> service.deleteGroup(20L))
          .isInstanceOf(RosterGroupNotEmptyException.class);

      verify(rosterGroupRepository, never()).delete(any());
    }

    @Test
    void cannotDeleteGroupContainingRosters() {
      var group = group(20L, "Events", null);

      findGroup(group);

      when(rosterGroupRepository.existsByParentGroupIdAndUserId(20L, USER_ID)).thenReturn(false);

      when(rosterRepository.existsByGroupIdAndUserId(20L, USER_ID)).thenReturn(true);

      assertThatThrownBy(() -> service.deleteGroup(20L))
          .isInstanceOf(RosterGroupNotEmptyException.class);

      verify(rosterGroupRepository, never()).delete(any());
    }
  }

  @Nested
  class Moving {

    @Test
    void movesGroupUnderNewParent() {
      var group = group(20L, "2026", null);
      var parent = group(21L, "Events", null);

      findGroup(group);
      findGroup(parent);

      service.moveGroup(20L, 21L);

      assertThat(group.getParentGroup()).isSameAs(parent);
    }

    @Test
    void cannotMoveGroupUnderItself() {
      var group = group(20L, "Events", null);

      findGroup(group);

      assertThatThrownBy(() -> service.moveGroup(20L, 20L))
          .isInstanceOf(InvalidRosterGroupMoveException.class)
          .hasMessage("A roster group cannot be its own parent");
    }

    @Test
    void cannotMoveGroupUnderDescendant() {
      var root = group(20L, "Root", null);
      var child = group(21L, "Child", root);
      var grandchild = group(22L, "Grandchild", child);

      findGroup(root);
      findGroup(grandchild);

      assertThatThrownBy(() -> service.moveGroup(20L, 22L))
          .isInstanceOf(InvalidRosterGroupMoveException.class)
          .hasMessage("Moving the roster group would create a cycle");
    }

    @Test
    void movingToUnknownParentFails() {
      var group = group(20L, "Group", null);

      findGroup(group);

      when(rosterGroupRepository.findByIdAndUserId(21L, USER_ID)).thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.moveGroup(20L, 21L))
          .isInstanceOf(RosterGroupNotFoundException.class);
    }

    @Test
    void movesGroupToRoot() {
      var parent = group(20L, "Parent", null);
      var child = group(21L, "Child", parent);

      findGroup(child);

      service.moveGroupToRoot(21L);

      assertThat(child.getParentGroup()).isNull();
    }
  }

  private RosterGroupEntity group(long id, String name, RosterGroupEntity parent) {

    var group = new RosterGroupEntity(user, name, parent);

    group.setId(id);

    return group;
  }

  private void findGroup(RosterGroupEntity group) {
    when(rosterGroupRepository.findByIdAndUserId(group.getId(), USER_ID))
        .thenReturn(Optional.of(group));
  }
}
