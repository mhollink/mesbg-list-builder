import { useState } from "react";
import {
  isRouteErrorResponse,
  Link,
  useLocation,
  useRouteError,
} from "react-router";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  type BrowserDiagnostics,
  collectBrowserDiagnostics,
} from "./error-diagnostics.ts";

/** Diagnostics are assembled separately so that formatting is easy to test. */
export function formatRouteError(
  error: unknown,
  pathname: string,
  version: string,
  environment: BrowserDiagnostics = collectBrowserDiagnostics(),
  buildDate?: string,
): string {
  const details = isRouteErrorResponse(error)
    ? `Route response: ${error.status} ${error.statusText}`
    : error instanceof Error
      ? (error.stack ?? `${error.name}: ${error.message}`)
      : `Thrown value: ${String(error)}`;

  return [
    `Application version: ${version}`,
    ...(buildDate ? [`Build date: ${buildDate}`] : []),
    `Route: ${pathname}`,
    `Reported at: ${environment.timestamp}`,
    `Browser: ${environment.browser}`,
    `Operating system: ${environment.operatingSystem}`,
    `Language: ${environment.language}`,
    `Viewport: ${environment.viewport}`,
    "",
    details,
  ].join("\n");
}

export function RouteErrorPage() {
  const error = useRouteError();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [environment] = useState(collectBrowserDiagnostics);

  const diagnostics = formatRouteError(
    error,
    location.pathname,
    BUILD_VERSION,
    environment,
    BUILD_DATE,
  );

  const copyDiagnostics = async () => {
    try {
      await navigator.clipboard.writeText(diagnostics);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box component="main" sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1}>
              <Box
                sx={{
                  color: "error.main",
                  p: 2,
                }}
              >
                <ReportProblemOutlinedIcon fontSize="large" />
              </Box>
              <Stack spacing={1}>
                <Typography variant="overline" color="textSecondary">
                  Unexpected error
                </Typography>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{ fontWeight: 700 }}
                >
                  We couldn't display this page
                </Typography>
                <Typography color="textSecondary">
                  The List Builder encountered an unexpected problem while
                  opening this page. You can try reloading it, or return to your
                  rosters and continue elsewhere.
                </Typography>
              </Stack>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
              <Button component={Link} to="/" variant="text">
                Go to Homepage
              </Button>
            </Stack>

            <Divider />

            <Stack>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
                Still having trouble?
              </Typography>
              <Typography color="textSecondary">
                If this problem keeps happening, you can help us investigate.
                Copy the technical details below and include them when reporting
                the issue.
              </Typography>
            </Stack>

            <Box component="details">
              <Typography
                component="summary"
                variant="body2"
                sx={{ cursor: "pointer", fontWeight: 600 }}
              >
                Technical details
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  onClick={() => void copyDiagnostics()}
                  disabled={!navigator.clipboard?.writeText}
                  variant="outlined"
                >
                  {copied ? "Copied" : "Copy technical details"}
                </Button>
                <Box
                  component="pre"
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                    fontFamily: "monospace",
                    fontSize: "0.7rem",
                    maxHeight: 420,
                    overflow: "auto",
                  }}
                >
                  {diagnostics}
                </Box>
                <Typography variant="caption" color="textSecondary">
                  These details stay in your browser until you copy and share
                  them. Review them before including them in a bug report.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
