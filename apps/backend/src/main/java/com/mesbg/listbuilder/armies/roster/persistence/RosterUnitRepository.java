package com.mesbg.listbuilder.armies.roster.persistence;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RosterUnitRepository extends JpaRepository<RosterUnitEntity, Long> {

  @Query(
      """
      select unit
      from RosterUnitEntity unit
      where unit.id = :unitId
        and unit.warband.id = :warbandId
        and unit.warband.roster.id = :rosterId
        and unit.warband.roster.user.id = :userId
      """)
  Optional<RosterUnitEntity> findOwnedUnit(
      @Param("unitId") Long unitId,
      @Param("warbandId") Long warbandId,
      @Param("rosterId") Long rosterId,
      @Param("userId") Long userId);

  @Query(
      """
      select unit
      from RosterUnitEntity unit
      where unit.id = :unitId
        and unit.warband.roster.id = :rosterId
        and unit.warband.roster.user.id = :userId
      """)
  Optional<RosterUnitEntity> findOwnedUnitInRoster(
      @Param("unitId") Long unitId, @Param("rosterId") Long rosterId, @Param("userId") Long userId);
}
