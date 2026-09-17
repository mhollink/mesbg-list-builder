package com.mesbg.listbuilder.armies.roster.api.mapper;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.generated.model.Warband;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(config = RosterMapperConfig.class, uses = RosterUnitMapper.class)
public abstract class WarbandMapper {

  @Autowired protected RosterUnitMapper rosterUnitMapper;

  @Mapping(target = "leader", ignore = true)
  @Mapping(target = "followers", ignore = true)
  public abstract Warband toDto(WarbandEntity entity);

  @AfterMapping
  protected void mapUnits(WarbandEntity entity, @MappingTarget Warband dto) {
    var leader =
        entity.getUnits().stream()
            .filter(RosterUnitEntity::isLeader)
            .findFirst()
            .orElseThrow(
                () ->
                    new IllegalStateException(
                        "Warband %s has no leader".formatted(entity.getId())));

    dto.setLeader(rosterUnitMapper.toDto(leader));

    dto.setFollowers(
        entity.getUnits().stream()
            .filter(unit -> !unit.isLeader())
            .map(rosterUnitMapper::toDto)
            .toList());
  }
}
