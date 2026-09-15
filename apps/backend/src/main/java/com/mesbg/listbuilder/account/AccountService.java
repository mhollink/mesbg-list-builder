package com.mesbg.listbuilder.account;

import com.mesbg.listbuilder.generated.model.CurrentUser;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

  private final UserRepository userRepository;

  @Transactional
  public CurrentUser getCurrentUser() {
    log.debug("retrieving current user information");
    var jwt = currentJwt();

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

    // Keep our copy synchronized if the email changes in Keycloak.
    if (!email.equals(user.getEmail())) {
      log.debug("storing updated email in database");
      user.setEmail(email);
    }

    var response = new CurrentUser();
    response.setId(user.getId());
    response.setEmail(user.getEmail());

    return response;
  }

  private Jwt currentJwt() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
      return jwtAuthentication.getToken();
    }

    throw new IllegalStateException("Expected authenticated JWT");
  }
}
