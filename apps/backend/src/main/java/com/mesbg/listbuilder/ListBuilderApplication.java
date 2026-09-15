package com.mesbg.listbuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ListBuilderApplication {

  static void main(String[] args) {
    SpringApplication.run(ListBuilderApplication.class, args);
  }
}
