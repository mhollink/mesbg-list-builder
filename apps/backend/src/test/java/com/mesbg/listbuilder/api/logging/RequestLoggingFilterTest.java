package com.mesbg.listbuilder.api.logging;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class RequestLoggingFilterTest {

  private final RequestLoggingFilter filter = new RequestLoggingFilter();

  @Test
  void reusesSafeRequestIdAndClearsMdcAfterRequest() throws Exception {
    var request = new MockHttpServletRequest("GET", "/api/v1/rosters");
    request.addHeader(RequestLoggingFilter.REQUEST_ID_HEADER, "request-123");
    var response = new MockHttpServletResponse();

    FilterChain chain =
        (servletRequest, servletResponse) ->
            assertThat(MDC.get(RequestLoggingFilter.REQUEST_ID_MDC_KEY)).isEqualTo("request-123");

    filter.doFilter(request, response, chain);

    assertThat(response.getHeader(RequestLoggingFilter.REQUEST_ID_HEADER)).isEqualTo("request-123");
    assertThat(MDC.get(RequestLoggingFilter.REQUEST_ID_MDC_KEY)).isNull();
  }

  @Test
  void replacesUnsafeRequestId() throws Exception {
    var request = new MockHttpServletRequest("GET", "/api/v1/rosters");
    request.addHeader(RequestLoggingFilter.REQUEST_ID_HEADER, "invalid request id");
    var response = new MockHttpServletResponse();

    filter.doFilter(request, response, (servletRequest, servletResponse) -> {});

    assertThat(response.getHeader(RequestLoggingFilter.REQUEST_ID_HEADER))
        .isNotBlank()
        .isNotEqualTo("invalid request id");
    assertThat(MDC.get(RequestLoggingFilter.REQUEST_ID_MDC_KEY)).isNull();
  }

  @Test
  void clearsMdcWhenRequestFails() {
    var request = new MockHttpServletRequest("GET", "/api/v1/rosters");
    var response = new MockHttpServletResponse();
    FilterChain chain =
        (servletRequest, servletResponse) -> {
          throw new IllegalStateException("boom");
        };

    assertThatThrownBy(() -> filter.doFilter(request, response, chain))
        .isInstanceOf(IllegalStateException.class)
        .hasMessage("boom");

    assertThat(response.getHeader(RequestLoggingFilter.REQUEST_ID_HEADER)).isNotBlank();
    assertThat(MDC.get(RequestLoggingFilter.REQUEST_ID_MDC_KEY)).isNull();
  }
}
