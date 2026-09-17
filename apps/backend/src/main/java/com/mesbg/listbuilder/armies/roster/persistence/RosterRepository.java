package com.mesbg.listbuilder.armies.roster.persistence;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RosterRepository extends JpaRepository<RosterEntity, Long> {

  List<RosterEntity> findAllByUserIdOrderByUpdatedAtDesc(Long userId);

  Optional<RosterEntity> findByIdAndUserId(Long id, Long userId);

  boolean existsByGroupIdAndUserId(Long groupId, Long userId);
}
