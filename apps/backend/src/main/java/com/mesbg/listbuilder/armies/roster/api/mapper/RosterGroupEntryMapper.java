package com.mesbg.listbuilder.armies.roster.api.mapper;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.generated.model.RosterGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = RosterMapperConfig.class)
public interface RosterGroupEntryMapper {

  @Mapping(target = "children", expression = "java(new java.util.ArrayList<>())")
  RosterGroup toDto(RosterGroupEntity entity);
}
