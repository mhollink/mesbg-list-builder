package com.mesbg.listbuilder.armies.roster.persistence;

import java.util.List;
import java.util.Optional;

import com.mesbg.listbuilder.armies.roster.model.RosterGroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RosterGroupRepository extends JpaRepository<RosterGroupEntity, Long> {

  List<RosterGroupEntity> findAllByUserIdOrderByNameAsc(Long userId);

  Optional<RosterGroupEntity> findByIdAndUserId(Long id, Long userId);

  boolean existsByParentGroupIdAndUserId(Long parentGroupId, Long userId);
}
