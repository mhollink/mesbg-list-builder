package com.mesbg.listbuilder.account;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByKeycloakSubject(String keycloakSubject);
}
