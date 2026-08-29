import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function RulesHeader() {
  const { t } = useTranslation("rules");
  return (
    <Box>
      <Typography component="h1" variant="h4" gutterBottom>
        {t("title")}
      </Typography>

      <Typography
        color="textSecondary"
        sx={{
          mt: 0.5,
        }}
      >
        {t("description")}
      </Typography>
    </Box>
  );
}
