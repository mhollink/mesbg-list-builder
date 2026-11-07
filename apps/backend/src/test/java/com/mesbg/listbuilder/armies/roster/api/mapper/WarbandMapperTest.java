package com.mesbg.listbuilder.armies.roster.api.mapper;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.roster;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.unit;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.warband;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.generated.model.RosterUnit;
import com.mesbg.listbuilder.generated.model.Warband;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class WarbandMapperTest {

  @Test
  void mapsLeaderSeparatelyFromFollowers() {
    var band = warband(roster(20L), 40L, 0);
    var leader = unit(band, 50L, "hero", 1, true, -1);
    var follower = unit(band, 51L, "warrior", 3, false, 0);
    var leaderDto = new RosterUnit();
    var followerDto = new RosterUnit();
    var unitMapper = Mockito.mock(RosterUnitMapper.class);
    when(unitMapper.toDto(leader)).thenReturn(leaderDto);
    when(unitMapper.toDto(follower)).thenReturn(followerDto);

    var mapper = mapper();
    mapper.rosterUnitMapper = unitMapper;
    var dto = new Warband();
    mapper.mapUnits(band, dto);

    assertThat(dto.getLeader()).isSameAs(leaderDto);
    assertThat(dto.getFollowers()).containsExactly(followerDto);
  }

  @Test
  void mapsWarbandWithoutLeaderToEmptyFollowers() {
    var band = warband(roster(20L), 40L, 0);
    var mapper = mapper();
    mapper.rosterUnitMapper = Mockito.mock(RosterUnitMapper.class);
    var dto = new Warband();

    mapper.mapUnits(band, dto);

    assertThat(dto.getLeader()).isNull();
    assertThat(dto.getFollowers()).isEmpty();
  }

  private WarbandMapper mapper() {
    return new WarbandMapper() {
      @Override
      public Warband toDto(WarbandEntity entity) {
        throw new UnsupportedOperationException("The generated map method is not under test");
      }
    };
  }
}
