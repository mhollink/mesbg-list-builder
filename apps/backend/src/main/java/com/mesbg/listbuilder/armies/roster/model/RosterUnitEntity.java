package com.mesbg.listbuilder.armies.roster.model;

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
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roster_units")
@Getter
@Setter
@NoArgsConstructor
public class RosterUnitEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "warband_id", nullable = false, updatable = false)
  private WarbandEntity warband;

  @Column(name = "profile_id", nullable = false, length = 255)
  private String profileId;

  @Column(nullable = false)
  private int quantity;

  @Column(name = "is_leader", nullable = false)
  private boolean leader;

  @Column(name = "sort_index", nullable = false)
  private int sortIndex;

  @ElementCollection(fetch = FetchType.LAZY)
  @CollectionTable(name = "roster_unit_options", joinColumns = @JoinColumn(name = "unit_id"))
  @Column(name = "option_id", nullable = false, length = 255)
  private Set<String> optionIds = new LinkedHashSet<>();

  public RosterUnitEntity(
      WarbandEntity warband,
      String profileId,
      int quantity,
      boolean leader,
      int sortIndex) {
    this.warband = warband;
    this.profileId = profileId;
    this.quantity = quantity;
    this.leader = leader;
    this.sortIndex = sortIndex;
  }
}
