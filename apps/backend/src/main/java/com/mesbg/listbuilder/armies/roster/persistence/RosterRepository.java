package com.mesbg.listbuilder.armies.roster.persistence;

import java.util.List;
import java.util.Optional;

import com.mesbg.listbuilder.armies.roster.model.RosterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RosterRepository extends JpaRepository<RosterEntity, Long> {

  List<RosterEntity> findAllByUserIdOrderByUpdatedAtDesc(Long userId);

  Optional<RosterEntity> findByIdAndUserId(Long id, Long userId);

  boolean existsByGroupIdAndUserId(Long groupId, Long userId);
}
