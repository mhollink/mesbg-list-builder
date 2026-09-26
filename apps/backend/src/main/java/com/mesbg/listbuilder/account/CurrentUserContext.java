package com.mesbg.listbuilder.account;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@RequiredArgsConstructor
public class CurrentUserContext {

  private final AuthenticatedUserService authenticatedUserService;
  private UserEntity user;

  public UserEntity getUser() {
    if (user == null) {
      user = authenticatedUserService.getCurrentUser();
    }

    return user;
  }

  public Long getUserId() {
    return getUser().getId();
  }
}
