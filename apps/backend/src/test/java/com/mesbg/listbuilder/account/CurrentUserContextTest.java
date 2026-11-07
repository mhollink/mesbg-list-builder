package com.mesbg.listbuilder.account;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.MDC;

@ExtendWith(MockitoExtension.class)
class CurrentUserContextTest {

  @Mock private AuthenticatedUserService authenticatedUserService;

  @AfterEach
  void clearMdc() {
    MDC.clear();
  }

  @Test
  void resolvesUserOnceAndCachesItForTheRequest() {
    var user = new UserEntity("subject", "user@example.test");
    user.setId(42L);
    when(authenticatedUserService.getCurrentUser()).thenReturn(user);

    var context = new CurrentUserContext(authenticatedUserService);

    assertThat(context.getUser()).isSameAs(user);
    assertThat(context.getUser()).isSameAs(user);
    assertThat(context.getUserId()).isEqualTo(42L);
    assertThat(MDC.get("uid")).isEqualTo("42");
    verify(authenticatedUserService, times(1)).getCurrentUser();
  }
}
