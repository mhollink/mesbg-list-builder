package com.mesbg.listbuilder;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestContainersConfiguration.class)
class ListBuilderApplicationTests {

  @Test
  void contextLoads() {}
}
