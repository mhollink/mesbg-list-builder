package com.mesbg.listbuilder.config;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.json.JsonMapper;

@Component
public class JsonMapperConfig {

  @Bean
  public JsonMapper.Builder jsonMapperBuilder() {
    return JsonMapper.builder()
        .configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
  }
}
