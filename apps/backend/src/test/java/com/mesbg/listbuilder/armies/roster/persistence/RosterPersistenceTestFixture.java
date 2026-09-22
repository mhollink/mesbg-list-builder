package com.mesbg.listbuilder.armies.roster.persistence;

import com.mesbg.listbuilder.account.UserEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import jakarta.persistence.EntityManager;
import java.util.LinkedHashSet;
import java.util.Set;

final class RosterPersistenceTestFixture {

  private final EntityManager entityManager;
  private int sequence;

  RosterPersistenceTestFixture(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  UserEntity user(String name) {
    var suffix = ++sequence;

    var user =
        new UserEntity("subject-" + name + "-" + suffix, name + "-" + suffix + "@example.test");

    entityManager.persist(user);

    return user;
  }

  RosterGroupEntity group(UserEntity user, String name, RosterGroupEntity parent) {

    var group = new RosterGroupEntity(user, name, parent);

    entityManager.persist(group);

    return group;
  }

  RosterEntity roster(UserEntity user, String name, RosterGroupEntity group) {

    var roster = new RosterEntity(user, name, "test-army-list", 800, new LinkedHashSet<>(), group);

    entityManager.persist(roster);

    return roster;
  }

  WarbandEntity warband(RosterEntity roster, int sortIndex) {
    var warband = new WarbandEntity(roster, sortIndex);

    roster.getWarbands().add(warband);
    entityManager.persist(warband);

    return warband;
  }

  RosterUnitEntity unit(
      WarbandEntity warband,
      String profileId,
      int quantity,
      boolean leader,
      int sortIndex,
      Set<String> optionIds) {

    var unit = new RosterUnitEntity(warband, profileId, quantity, leader, sortIndex);

    unit.getOptionIds().addAll(optionIds);
    warband.getUnits().add(unit);

    entityManager.persist(unit);

    return unit;
  }

  void flushAndClear() {
    entityManager.flush();
    entityManager.clear();
  }
}
