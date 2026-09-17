package com.mesbg.listbuilder.armies.roster.persistence.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "warbands")
@Getter
@Setter
@NoArgsConstructor
public class WarbandEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "roster_id", nullable = false, updatable = false)
  private RosterEntity roster;

  @Column(name = "sort_index", nullable = false)
  private int sortIndex;

  @OneToMany(mappedBy = "warband", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortIndex ASC, id ASC")
  private List<RosterUnitEntity> units = new ArrayList<>();

  public WarbandEntity(RosterEntity roster, int sortIndex) {
    this.roster = roster;
    this.sortIndex = sortIndex;
  }
}
