package com.mesbg.listbuilder.armies.roster.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import com.mesbg.listbuilder.TestContainersConfiguration;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestContainersConfiguration.class)
class RosterGroupRepositoryTest {

  @Autowired private RosterGroupRepository repository;

  @Autowired private EntityManager entityManager;

  private RosterPersistenceTestFixture fixture;

  @BeforeEach
  void setUp() {
    fixture = new RosterPersistenceTestFixture(entityManager);
  }

  @Test
  void findsGroupOwnedByUser() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    var group = fixture.group(owner, "Events", null);

    fixture.flushAndClear();

    assertThat(repository.findByIdAndUserId(group.getId(), owner.getId())).isPresent();

    assertThat(repository.findByIdAndUserId(group.getId(), otherUser.getId())).isEmpty();
  }

  @Test
  void listsOnlyUsersGroupsOrderedByName() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    fixture.group(owner, "Zulu", null);
    fixture.group(owner, "Alpha", null);
    fixture.group(owner, "Middle", null);

    fixture.group(otherUser, "AAA other user", null);

    fixture.flushAndClear();

    var result = repository.findAllByUserIdOrderByNameAsc(owner.getId());

    assertThat(result)
        .extracting(RosterGroupEntity::getName)
        .containsExactly("Alpha", "Middle", "Zulu");
  }

  @Test
  void detectsChildGroupsForUser() {
    var owner = fixture.user("owner");
    var otherUser = fixture.user("other");

    var parent = fixture.group(owner, "Parent", null);
    fixture.group(owner, "Child", parent);

    fixture.flushAndClear();

    assertThat(repository.existsByParentGroupIdAndUserId(parent.getId(), owner.getId())).isTrue();

    assertThat(repository.existsByParentGroupIdAndUserId(parent.getId(), otherUser.getId()))
        .isFalse();
  }

  @Test
  void persistsNestedGroupRelationship() {
    var owner = fixture.user("owner");

    var parent = fixture.group(owner, "Events", null);
    var child = fixture.group(owner, "2026", parent);

    fixture.flushAndClear();

    var persisted = repository.findById(child.getId()).orElseThrow();

    assertThat(persisted.getParentGroup()).isNotNull();
    assertThat(persisted.getParentGroup().getId()).isEqualTo(parent.getId());
  }
}
