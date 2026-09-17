package com.mesbg.listbuilder.armies.roster.persistence;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterGroupEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RosterGroupRepository extends JpaRepository<RosterGroupEntity, Long> {

  List<RosterGroupEntity> findAllByUserIdOrderByNameAsc(Long userId);

  Optional<RosterGroupEntity> findByIdAndUserId(Long id, Long userId);

  boolean existsByParentGroupIdAndUserId(Long parentGroupId, Long userId);
}
