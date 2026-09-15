package com.mesbg.listbuilder.account;

import com.mesbg.listbuilder.generated.api.AccountApi;
import com.mesbg.listbuilder.generated.model.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AccountController implements AccountApi {

  private final AccountService accountService;

  @Override
  public ResponseEntity<CurrentUser> getCurrentUser() {
    return ResponseEntity.ok(accountService.getCurrentUser());
  }
}
