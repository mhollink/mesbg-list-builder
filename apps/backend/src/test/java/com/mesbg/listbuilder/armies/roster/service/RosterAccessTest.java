package com.mesbg.listbuilder.armies.roster.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.lenient;

import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.account.UserEntity;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;

class RosterAccessTest {

  private static final long USER_ID = 10L;
  private static final long ROSTER_ID = 20L;

  @Mock private CurrentUserContext currentUser;
  @Mock private RosterRepository rosterRepository;
  @Mock private RosterGroupRepository rosterGroupRepository;
  @Mock private WarbandRepository warbandRepository;
  @Mock private RosterUnitRepository rosterUnitRepository;

  private RosterUnitsService unitsService;

  private UserEntity user;

  @BeforeEach
  void setUp() {
    user = new UserEntity("keycloak-subject", "user@example.test");
    user.setId(USER_ID);

    lenient().when(currentUser.getUser()).thenReturn(user);
    lenient().when(currentUser.getUserId()).thenReturn(USER_ID);

    RosterAccess rosterAccess =
        new RosterAccess(
            currentUser,
            rosterRepository,
            warbandRepository,
            rosterUnitRepository,
            rosterGroupRepository);

    unitsService = new RosterUnitsService(rosterAccess, rosterUnitRepository);
  }
}
