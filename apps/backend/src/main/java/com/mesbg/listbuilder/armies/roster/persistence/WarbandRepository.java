package com.mesbg.listbuilder.armies.roster.persistence;

import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WarbandRepository extends JpaRepository<WarbandEntity, Long> {

  @Query(
      """
      select warband
      from WarbandEntity warband
      where warband.id = :warbandId
        and warband.roster.id = :rosterId
        and warband.roster.user.id = :userId
      """)
  Optional<WarbandEntity> findOwnedWarband(
      @Param("warbandId") Long warbandId,
      @Param("rosterId") Long rosterId,
      @Param("userId") Long userId);
}
