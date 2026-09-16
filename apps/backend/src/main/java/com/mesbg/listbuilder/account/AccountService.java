package com.mesbg.listbuilder.account;

import com.mesbg.listbuilder.generated.model.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

  private final AuthenticatedUserService authenticatedUserService;

  public CurrentUser getCurrentUser() {
    log.debug("retrieving current user information");

    var user = authenticatedUserService.getCurrentUser();

    var response = new CurrentUser();
    response.setId(user.getId());
    response.setEmail(user.getEmail());

    return response;
  }
}
