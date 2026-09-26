package com.mesbg.listbuilder.armies.roster.service;

import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.*;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.ROSTER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.STATISTICS;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.USER_ID;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.roster;
import static com.mesbg.listbuilder.armies.roster.fixtures.RosterFixtures.user;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mesbg.listbuilder.account.CurrentUserContext;
import com.mesbg.listbuilder.account.UserEntity;
import com.mesbg.listbuilder.armies.roster.persistence.RosterGroupRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterRepository;
import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.WarbandRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterGroupNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterLockedException;
import com.mesbg.listbuilder.armies.roster.service.exception.RosterNotFoundException;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatisticsCalculator;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RosterServiceTest {

  @Mock private CurrentUserContext currentUser;
  @Mock private RosterRepository rosterRepository;
  @Mock private RosterGroupRepository rosterGroupRepository;
  @Mock private WarbandRepository warbandRepository;
  @Mock private RosterUnitRepository rosterUnitRepository;
  @Mock private RosterStatisticsCalculator calculator;

  private RosterService service;

  @BeforeEach
  void setUp() {
    UserEntity user = user();
    lenient().when(currentUser.getUser()).thenReturn(user);
    lenient().when(currentUser.getUserId()).thenReturn(user.getId());

    RosterAccess rosterAccess =
        new RosterAccess(
            currentUser,
            rosterRepository,
            warbandRepository,
            rosterUnitRepository,
            rosterGroupRepository);

    service = new RosterService(currentUser, rosterAccess, rosterRepository, calculator);
  }

  @Nested
  class Reading {

    @Test
    void listsRostersWithCalculatedStatistics() {
      var first = roster(20L);
      var second = roster(21L);

      when(rosterRepository.findAllByUserIdOrderByUpdatedAtDesc(USER_ID))
          .thenReturn(List.of(first, second));

      when(calculator.calculate(first)).thenReturn(STATISTICS);
      when(calculator.calculate(second)).thenReturn(STATISTICS);

      var result = service.listRosters();

      assertThat(result).extracting(RosterSnapshot::roster).containsExactly(first, second);

      assertThat(result)
          .extracting(RosterSnapshot::statistics)
          .containsExactly(STATISTICS, STATISTICS);
    }

    @Test
    void getsOwnedRosterWithStatistics() {
      var roster = roster(ROSTER_ID);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));
      when(calculator.calculate(roster)).thenReturn(STATISTICS);

      var result = service.getRoster(ROSTER_ID);

      assertThat(result.roster()).isSameAs(roster);
      assertThat(result.statistics()).isSameAs(STATISTICS);
    }

    @Test
    void throwsWhenRosterDoesNotExist() {
      when(rosterRepository.findByIdAndUserId(ROSTER_ID, USER_ID)).thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.getRoster(ROSTER_ID))
          .isInstanceOf(RosterNotFoundException.class);
    }
  }

  @Nested
  class CreatingAndUpdating {

    @Test
    void createsRootRosterAndNormalizesTags() {
      when(rosterRepository.save(any(RosterEntity.class)))
          .thenAnswer(invocation -> invocation.getArgument(0));

      when(calculator.calculate(any(RosterEntity.class))).thenReturn(STATISTICS);

      var result =
          service.createRoster(
              "Mordor",
              "mordor",
              800,
              List.of(" Tournament ", "", "Tournament", "Friendly", "x".repeat(65)),
              null);

      var roster = result.roster();

      assertThat(roster.getUser().getId()).isEqualTo(USER_ID);
      assertThat(roster.getName()).isEqualTo("Mordor");
      assertThat(roster.getArmyListId()).isEqualTo("mordor");
      assertThat(roster.getPointsLimit()).isEqualTo(800);
      assertThat(roster.getGroup()).isNull();

      assertThat(roster.getTags()).containsExactly("Tournament", "Friendly");

      assertThat(result.statistics()).isSameAs(STATISTICS);
    }

    @Test
    void createsRosterInsideOwnedGroup() {
      var group = group(30L);

      when(rosterGroupRepository.findByIdAndUserId(30L, USER_ID)).thenReturn(Optional.of(group));

      when(rosterRepository.save(any(RosterEntity.class)))
          .thenAnswer(invocation -> invocation.getArgument(0));

      when(calculator.calculate(any(RosterEntity.class))).thenReturn(STATISTICS);

      var result = service.createRoster("Mordor", "mordor", 800, List.of(), 30L);

      assertThat(result.roster().getGroup()).isSameAs(group);
    }

    @Test
    void creatingRosterFailsWhenGroupDoesNotExist() {
      when(rosterGroupRepository.findByIdAndUserId(30L, USER_ID)).thenReturn(Optional.empty());

      assertThatThrownBy(() -> service.createRoster("Mordor", "mordor", 800, List.of(), 30L))
          .isInstanceOf(RosterGroupNotFoundException.class);

      verify(rosterRepository, never()).save(any());
    }

    @Test
    void updatesMutableRosterMetadata() {
      var roster = roster(ROSTER_ID);
      roster.getTags().add("Old");

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));
      when(calculator.calculate(roster)).thenReturn(STATISTICS);

      var result =
          service.updateRoster(
              ROSTER_ID, "Updated roster", 750, List.of(" Tournament ", "Tournament", "Friendly"));

      assertThat(roster.getName()).isEqualTo("Updated roster");
      assertThat(roster.getPointsLimit()).isEqualTo(750);

      assertThat(roster.getTags()).containsExactly("Tournament", "Friendly");

      assertThat(result.roster()).isSameAs(roster);
    }

    @Test
    void leavesOmittedMetadataUnchanged() {
      var roster = roster(ROSTER_ID);
      roster.setPointsLimit(800);
      roster.getTags().add("Existing");

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));
      when(calculator.calculate(roster)).thenReturn(STATISTICS);

      service.updateRoster(ROSTER_ID, null, null, null);

      assertThat(roster.getName()).isEqualTo("Roster");
      assertThat(roster.getPointsLimit()).isEqualTo(800);
      assertThat(roster.getTags()).containsExactly("Existing");
    }
  }

  @Nested
  class FavoriteAndLock {

    @Test
    void favoritesRoster() {
      var roster = roster(ROSTER_ID);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));
      when(calculator.calculate(roster)).thenReturn(STATISTICS);

      var result = service.favoriteRoster(ROSTER_ID);

      assertThat(roster.isFavorite()).isTrue();
      assertThat(result.roster()).isSameAs(roster);
    }

    @Test
    void unfavoritesRoster() {
      var roster = roster(ROSTER_ID);
      roster.setFavorite(true);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));
      when(calculator.calculate(roster)).thenReturn(STATISTICS);

      service.unfavoriteRoster(ROSTER_ID);

      assertThat(roster.isFavorite()).isFalse();
    }

    @Test
    void locksRoster() {
      var roster = roster(ROSTER_ID);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));
      when(calculator.calculate(roster)).thenReturn(STATISTICS);

      service.lockRoster(ROSTER_ID);

      assertThat(roster.isLocked()).isTrue();
    }

    @Test
    void unlocksRoster() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));
      when(calculator.calculate(roster)).thenReturn(STATISTICS);

      service.unlockRoster(ROSTER_ID);

      assertThat(roster.isLocked()).isFalse();
    }

    @Test
    void favoriteCanBeChangedWhileRosterIsLocked() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));
      when(calculator.calculate(roster)).thenReturn(STATISTICS);

      service.favoriteRoster(ROSTER_ID);

      assertThat(roster.isFavorite()).isTrue();
      assertThat(roster.isLocked()).isTrue();
    }
  }

  @Nested
  class DeletingAndMoving {

    @Test
    void deletesUnlockedRoster() {
      var roster = roster(ROSTER_ID);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));

      service.deleteRoster(ROSTER_ID);

      verify(rosterRepository).delete(roster);
    }

    @Test
    void refusesToDeleteLockedRoster() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));

      assertThatThrownBy(() -> service.deleteRoster(ROSTER_ID))
          .isInstanceOf(RosterLockedException.class);

      verify(rosterRepository, never()).delete(any());
    }

    @Test
    void assignsRosterToGroup() {
      var roster = roster(ROSTER_ID);
      var group = group(30L);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));

      when(rosterGroupRepository.findByIdAndUserId(30L, USER_ID)).thenReturn(Optional.of(group));

      service.assignRosterToGroup(ROSTER_ID, 30L);

      assertThat(roster.getGroup()).isSameAs(group);
    }

    @Test
    void removesRosterFromGroup() {
      var roster = roster(ROSTER_ID);
      roster.setGroup(group(30L));

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));

      service.removeRosterFromGroup(ROSTER_ID);

      assertThat(roster.getGroup()).isNull();
    }

    @Test
    void lockedRosterCanStillBeMoved() {
      var roster = roster(ROSTER_ID);
      roster.setLocked(true);

      var group = group(30L);

      when(rosterRepository.findByIdAndUserId(((RosterEntity) roster).getId(), USER_ID))
          .thenReturn(Optional.of(roster));

      when(rosterGroupRepository.findByIdAndUserId(30L, USER_ID)).thenReturn(Optional.of(group));

      service.assignRosterToGroup(ROSTER_ID, 30L);

      assertThat(roster.getGroup()).isSameAs(group);
    }
  }
}
