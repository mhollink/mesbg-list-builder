package com.mesbg.listbuilder.armies.roster.api.mapper;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.generated.model.RosterUnit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = RosterMapperConfig.class)
public interface RosterUnitMapper {

  @Mapping(source = "optionIds", target = "optionIds")
  RosterUnit toDto(RosterUnitEntity entity);
}
