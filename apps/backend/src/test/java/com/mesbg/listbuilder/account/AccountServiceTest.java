package com.mesbg.listbuilder.account;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

  @Mock private AuthenticatedUserService authenticatedUserService;

  @Test
  void returnsTheCurrentUsersIdAndEmail() {
    var user = new UserEntity("subject", "user@example.test");
    user.setId(42L);
    when(authenticatedUserService.getCurrentUser()).thenReturn(user);

    var result = new AccountService(authenticatedUserService).getCurrentUser();

    assertThat(result.getId()).isEqualTo(42L);
    assertThat(result.getEmail()).isEqualTo("user@example.test");
  }
}
