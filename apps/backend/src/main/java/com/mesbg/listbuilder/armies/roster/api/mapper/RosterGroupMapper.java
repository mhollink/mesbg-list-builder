package com.mesbg.listbuilder.armies.roster.api.mapper;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.generated.model.RosterGroup;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RosterGroupMapper {

  private final RosterGroupEntryMapper entryMapper;

  public List<RosterGroup> toTree(List<RosterGroupEntity> entities) {
    var groups =
        entities.stream().collect(Collectors.toMap(RosterGroupEntity::getId, entryMapper::toDto));

    var roots = new ArrayList<RosterGroup>();

    for (var entity : entities) {
      var dto = groups.get(entity.getId());

      if (entity.getParentGroup() == null) {
        roots.add(dto);
      } else {
        groups.get(entity.getParentGroup().getId()).getChildren().add(dto);
      }
    }

    return roots;
  }
}
