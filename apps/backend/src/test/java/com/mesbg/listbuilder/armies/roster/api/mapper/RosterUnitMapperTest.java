package com.mesbg.listbuilder.armies.roster.api.mapper;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.roster;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.unit;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.warband;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

class RosterUnitMapperTest {

  private final RosterUnitMapper mapper = Mappers.getMapper(RosterUnitMapper.class);

  @Test
  void mapsUnitIdentityQuantityAndSelectedOptions() {
    var warband = warband(roster(20L), 40L, 0);
    var unit = unit(warband, 50L, "orc-warrior", 5, false, 2);
    unit.getOptionIds().add("shield");
    unit.getOptionIds().add("spear");

    var dto = mapper.toDto(unit);

    assertThat(dto.getId()).isEqualTo(50L);
    assertThat(dto.getArmyListProfileId()).isEqualTo("orc-warrior");
    assertThat(dto.getQuantity()).isEqualTo(5);
    assertThat(dto.getOptionIds()).containsExactlyInAnyOrder("shield", "spear");
  }
}
