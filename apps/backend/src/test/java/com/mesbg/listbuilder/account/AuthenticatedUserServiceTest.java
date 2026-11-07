package com.mesbg.listbuilder.account;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@ExtendWith(MockitoExtension.class)
class AuthenticatedUserServiceTest {

  @Mock private UserRepository repository;

  @AfterEach
  void clearSecurityContext() {
    SecurityContextHolder.clearContext();
  }

  private void authenticate(String email) {
    var builder = Jwt.withTokenValue("token").header("alg", "none").subject("subject-1");
    if (email != null) {
      builder.claim("email", email);
    }
    SecurityContextHolder.getContext()
        .setAuthentication(new JwtAuthenticationToken(builder.build()));
  }

  @Test
  void registersUserOnFirstAuthenticatedRequest() {
    authenticate("new@example.test");
    when(repository.findByKeycloakSubject("subject-1")).thenReturn(Optional.empty());
    when(repository.save(any(UserEntity.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    var user = new AuthenticatedUserService(repository).getCurrentUser();

    assertThat(user.getKeycloakSubject()).isEqualTo("subject-1");
    assertThat(user.getEmail()).isEqualTo("new@example.test");
    verify(repository).save(user);
  }

  @Test
  void reusesExistingUserWithoutWritingWhenEmailIsUnchanged() {
    authenticate("existing@example.test");
    var existing = new UserEntity("subject-1", "existing@example.test");
    when(repository.findByKeycloakSubject("subject-1")).thenReturn(Optional.of(existing));

    assertThat(new AuthenticatedUserService(repository).getCurrentUser()).isSameAs(existing);
    verify(repository, never()).save(any());
  }

  @Test
  void updatesEmailOfExistingUserWithoutCreatingDuplicate() {
    authenticate("updated@example.test");
    var existing = new UserEntity("subject-1", "previous@example.test");
    when(repository.findByKeycloakSubject("subject-1")).thenReturn(Optional.of(existing));

    assertThat(new AuthenticatedUserService(repository).getCurrentUser()).isSameAs(existing);
    assertThat(existing.getEmail()).isEqualTo("updated@example.test");
    verify(repository, never()).save(any());
  }

  @Test
  void rejectsMissingJwtAuthentication() {
    assertThatThrownBy(() -> new AuthenticatedUserService(repository).getCurrentUser())
        .isInstanceOf(IllegalStateException.class)
        .hasMessage("Expected authenticated JWT");
    verifyNoInteractions(repository);
  }

  @Test
  void rejectsTokenWithoutEmailClaim() {
    authenticate(null);

    assertThatThrownBy(() -> new AuthenticatedUserService(repository).getCurrentUser())
        .isInstanceOf(NullPointerException.class)
        .hasMessage("Authenticated user does not have an email claim");
    verifyNoInteractions(repository);
  }
}
