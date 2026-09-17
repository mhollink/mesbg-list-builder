package com.mesbg.listbuilder.armies.roster.api.mapper;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;
import com.mesbg.listbuilder.generated.model.Roster;
import com.mesbg.listbuilder.generated.model.RosterSummary;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = RosterMapperConfig.class, uses = WarbandMapper.class)
public interface RosterMapper {

  @Mapping(source = "entity.group.id", target = "groupId")
  @Mapping(source = "entity.generalUnit.id", target = "generalUnitId")
  @Mapping(source = "statistics.points", target = "points")
  @Mapping(source = "statistics.warbandCount", target = "warbandCount")
  @Mapping(source = "statistics.modelCount", target = "modelCount")
  @Mapping(source = "statistics.might", target = "might")
  @Mapping(source = "statistics.bowCount", target = "bowCount")
  @Mapping(source = "statistics.throwingWeaponCount", target = "throwingWeaponCount")
  Roster toDto(RosterEntity entity, RosterStatistics statistics);

  @Mapping(source = "roster.group.id", target = "groupId")
  @Mapping(source = "statistics.points", target = "points")
  @Mapping(source = "statistics.warbandCount", target = "warbandCount")
  @Mapping(source = "statistics.modelCount", target = "modelCount")
  @Mapping(source = "statistics.might", target = "might")
  @Mapping(source = "statistics.bowCount", target = "bowCount")
  @Mapping(source = "statistics.throwingWeaponCount", target = "throwingWeaponCount")
  RosterSummary toSummary(RosterEntity roster, RosterStatistics statistics);

  default OffsetDateTime map(Instant value) {
    return value == null ? null : value.atOffset(ZoneOffset.UTC);
  }
}
