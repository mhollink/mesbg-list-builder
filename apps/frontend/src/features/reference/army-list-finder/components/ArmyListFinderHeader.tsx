import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function ArmyListFinderHeader() {
  const { t } = useTranslation("army-list-finder");

  return (
    <Box>
      <Typography component="h1" variant="h4" gutterBottom>
        {t("title")}
      </Typography>

      <Typography
        color="textSecondary"
        sx={{
          mt: 0.5,
          maxWidth: 720,
        }}
      >
        {t("description")}
      </Typography>
    </Box>
  );
}
