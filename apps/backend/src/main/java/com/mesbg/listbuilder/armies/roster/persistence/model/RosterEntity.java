package com.mesbg.listbuilder.armies.roster.persistence.model;

import com.mesbg.listbuilder.account.UserEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "rosters")
@Getter
@Setter
@NoArgsConstructor
public class RosterEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false, updatable = false)
  private UserEntity user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "group_id")
  private RosterGroupEntity group;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "general_unit_id")
  private RosterUnitEntity generalUnit;

  @Column(nullable = false, length = 255)
  private String name;

  @Column(name = "army_list_id", nullable = false, length = 255, updatable = false)
  private String armyListId;

  @Column(name = "points_limit")
  private Integer pointsLimit;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "roster_tags", joinColumns = @JoinColumn(name = "roster_id"))
  @Column(name = "tag", nullable = false)
  private Set<String> tags = new LinkedHashSet<>();

  @OneToMany(mappedBy = "roster", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortIndex ASC, id ASC")
  private List<WarbandEntity> warbands = new ArrayList<>();

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public RosterEntity(
      UserEntity user,
      String name,
      String armyListId,
      Integer pointsLimit,
      Set<String> tags,
      RosterGroupEntity group) {
    this.user = user;
    this.name = name;
    this.armyListId = armyListId;
    this.pointsLimit = pointsLimit;
    this.tags = tags;
    this.group = group;
  }

  /**
   * Marks the roster itself dirty after changing owned child data.
   *
   * <p>Hibernate only updates {@code updatedAt} when this entity is updated. Services mutating
   * warbands, units or options should call this method so the roster summary reflects the latest
   * edit.
   */
  public void touch() {
    this.updatedAt = Instant.now();
  }
}
