package com.mesbg.listbuilder.api.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

  private static final SecureRandom RANDOM = new SecureRandom();
  private static final Base64.Encoder REQUEST_ID_ENCODER = Base64.getUrlEncoder().withoutPadding();

  static final String REQUEST_ID_HEADER = "X-Request-Id";
  static final String REQUEST_ID_MDC_KEY = "requestId";

  private static final Pattern SAFE_REQUEST_ID = Pattern.compile("[A-Za-z0-9._-]{1,16}");

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    var requestId = resolveRequestId(request);
    var startedAt = System.nanoTime();

    MDC.put(REQUEST_ID_MDC_KEY, requestId);
    response.setHeader(REQUEST_ID_HEADER, requestId);

    try {
      filterChain.doFilter(request, response);
      logCompletedRequest(request, response, elapsedMillis(startedAt));
    } catch (IOException | ServletException | RuntimeException exception) {
      log.error(
          "HTTP request failed method={} path={} durationMs={}",
          request.getMethod(),
          request.getRequestURI(),
          elapsedMillis(startedAt),
          exception);
      throw exception;
    } finally {
      MDC.remove(REQUEST_ID_MDC_KEY);
    }
  }

  private String resolveRequestId(HttpServletRequest request) {
    var requestId = request.getHeader(REQUEST_ID_HEADER);

    if (requestId != null && SAFE_REQUEST_ID.matcher(requestId).matches()) {
      return requestId;
    }

    return generateRequestId();
  }

  private String generateRequestId() {
    var bytes = new byte[10];
    RANDOM.nextBytes(bytes);
    return REQUEST_ID_ENCODER.encodeToString(bytes);
  }

  private void logCompletedRequest(
      HttpServletRequest request, HttpServletResponse response, long durationMillis) {
    var status = response.getStatus();

    if (status >= 500) {
      log.error(
          "HTTP request completed method={} path={} status={} durationMs={}",
          request.getMethod(),
          request.getRequestURI(),
          status,
          durationMillis);
    } else if (status >= 400) {
      log.warn(
          "HTTP request completed method={} path={} status={} durationMs={}",
          request.getMethod(),
          request.getRequestURI(),
          status,
          durationMillis);
    } else {
      log.debug(
          "HTTP request completed method={} path={} status={} durationMs={}",
          request.getMethod(),
          request.getRequestURI(),
          status,
          durationMillis);
    }
  }

  private long elapsedMillis(long startedAt) {
    return (System.nanoTime() - startedAt) / 1_000_000;
  }
}
