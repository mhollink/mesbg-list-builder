package com.mesbg.listbuilder.armies.roster.fixtures;

import com.mesbg.listbuilder.account.UserEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;
import java.util.LinkedHashSet;

public class RosterFixtures {
  public static final long USER_ID = 10L;
  public static final long ROSTER_ID = 20L;

  public static final RosterStatistics STATISTICS = new RosterStatistics(750, 3, 32, 8, 10, 4);

  public static UserEntity user() {
    var user = new UserEntity("keycloak-subject", "user@example.test");
    user.setId(USER_ID);

    return user;
  }

  public static RosterEntity roster(long id) {
    var roster =
        new RosterEntity(user(), "Roster", "test-army-list", 800, new LinkedHashSet<>(), null);

    roster.setId(id);

    return roster;
  }

  public static RosterGroupEntity group(long id) {
    var group = new RosterGroupEntity(user(), "Group", null);

    group.setId(id);

    return group;
  }

  public static WarbandEntity warband(RosterEntity roster, long id, int sortIndex) {

    var warband = new WarbandEntity(roster, sortIndex);

    warband.setId(id);
    roster.getWarbands().add(warband);

    return warband;
  }

  public static RosterUnitEntity unit(
      WarbandEntity warband,
      long id,
      String profileId,
      int quantity,
      boolean leader,
      int sortIndex) {

    var unit = new RosterUnitEntity(warband, profileId, quantity, leader, sortIndex);

    unit.setId(id);
    warband.getUnits().add(unit);

    return unit;
  }
}
