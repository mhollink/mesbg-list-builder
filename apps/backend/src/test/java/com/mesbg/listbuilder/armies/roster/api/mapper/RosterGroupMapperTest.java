package com.mesbg.listbuilder.armies.roster.api.mapper;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.group;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.generated.model.RosterGroup;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterGroupMapperTest {

  @Mock private RosterGroupEntryMapper entryMapper;

  @Test
  void buildsNestedTreeEvenWhenChildrenAppearBeforeParents() {
    var parent = group(10L);
    var child = group(11L);
    child.setParentGroup(parent);
    var grandchild = group(12L);
    grandchild.setParentGroup(child);

    var parentDto = dto();
    var childDto = dto();
    var grandchildDto = dto();
    when(entryMapper.toDto(parent)).thenReturn(parentDto);
    when(entryMapper.toDto(child)).thenReturn(childDto);
    when(entryMapper.toDto(grandchild)).thenReturn(grandchildDto);

    var tree = new RosterGroupMapper(entryMapper).toTree(List.of(grandchild, child, parent));

    assertThat(tree).containsExactly(parentDto);
    assertThat(parentDto.getChildren()).containsExactly(childDto);
    assertThat(childDto.getChildren()).containsExactly(grandchildDto);
  }

  @Test
  void keepsSeparateRootGroupsAtTopLevel() {
    var first = group(10L);
    var second = group(11L);
    var firstDto = dto();
    var secondDto = dto();
    when(entryMapper.toDto(first)).thenReturn(firstDto);
    when(entryMapper.toDto(second)).thenReturn(secondDto);

    assertThat(new RosterGroupMapper(entryMapper).toTree(List.of(first, second)))
        .containsExactly(firstDto, secondDto);
  }

  @Test
  void mapsEmptyGroupListToEmptyTree() {
    assertThat(new RosterGroupMapper(entryMapper).toTree(List.of())).isEmpty();
  }

  private RosterGroup dto() {
    var group = new RosterGroup();
    group.setChildren(new ArrayList<>());
    return group;
  }
}
