import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

export const LinkStrip = () => {
  const { t } = useTranslation("home", { keyPrefix: "links" });
  return (
    <Box
      sx={{
        py: 3,
        textAlign: "center",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link component={RouterLink} to="/policies#privacy">
          {t("privacy")}
        </Link>

        <Link component={RouterLink} to="/policies#fair-use">
          {t("fair-use")}{" "}
        </Link>

        <Link component={RouterLink} to="/support">
          {t("support")}
        </Link>
      </Stack>
    </Box>
  );
};
