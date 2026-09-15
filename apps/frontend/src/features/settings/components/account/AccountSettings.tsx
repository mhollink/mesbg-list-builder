import { useTranslation } from "react-i18next";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { keycloak } from "~/features/account/auth/keycloak.ts";

export function AccountSettings() {
  const { t } = useTranslation("settings");

  const email =
    typeof keycloak.tokenParsed?.email === "string"
      ? keycloak.tokenParsed.email
      : undefined;

  const handleLogin = () => {
    void keycloak.login({
      redirectUri: window.location.href,
    });
  };

  const handleManageAccount = () => {
    window.location.assign(
      keycloak.createAccountUrl({
        redirectUri: window.location.href,
      }),
    );
  };

  const handleLogout = () => {
    void keycloak.logout({
      redirectUri: window.location.href,
    });
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          {t("account.title")}
        </Typography>

        <Typography color="textSecondary">
          {t("account.description")}
        </Typography>
      </Box>

      {keycloak.authenticated ? (
        <>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {t("account.details.title")}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  {t("account.details.description")}
                </Typography>
              </Box>

              {email && (
                <Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    component="div"
                  >
                    {t("account.details.email")}
                  </Typography>

                  <Typography>{email}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {t("account.security.title")}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                {t("account.security.description")}
              </Typography>
            </Box>

            <Box>
              <Button
                variant="outlined"
                startIcon={<ManageAccountsOutlinedIcon />}
                onClick={handleManageAccount}
              >
                {t("account.security.manage")}
              </Button>
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {t("account.session.title")}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                {t("account.session.description")}
              </Typography>
            </Box>

            <Box>
              <Button
                variant="outlined"
                startIcon={<LogoutOutlinedIcon />}
                onClick={handleLogout}
              >
                {t("account.session.logout")}
              </Button>
            </Box>
          </Stack>
        </>
      ) : (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ maxWidth: 560 }}>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {t("account.signedOut.title")}
              </Typography>

              <Typography variant="body2" color="textSecondary">
                {t("account.signedOut.description")}
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                startIcon={<LoginOutlinedIcon />}
                onClick={handleLogin}
              >
                {t("account.signedOut.signIn")}
              </Button>

              <Button variant="outlined" onClick={handleLogin}>
                {t("account.signedOut.createAccount")}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
