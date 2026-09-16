package com.mesbg.listbuilder.account;

import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticatedUserService {

  private final UserRepository userRepository;

  @Transactional
  public UserEntity getCurrentUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();

    if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
      throw new IllegalStateException("Expected authenticated JWT");
    }

    var jwt = jwtAuthentication.getToken();
    var subject = jwt.getSubject();
    var email =
        Objects.requireNonNull(
            jwt.getClaimAsString("email"), "Authenticated user does not have an email claim");

    var user =
        userRepository
            .findByKeycloakSubject(subject)
            .orElseGet(
                () -> {
                  log.info("storing new user information in the database");
                  return userRepository.save(new UserEntity(subject, email));
                });

    if (!email.equals(user.getEmail())) {
      log.debug("storing updated email in database");
      user.setEmail(email);
    }

    return user;
  }
}
