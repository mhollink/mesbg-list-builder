import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
export function SearchEmptyState() {
  const { t } = useTranslation("search");
  return (
    <Typography color="textSecondary" sx={{ py: 4, textAlign: "center" }}>
      {t("empty")}
    </Typography>
  );
}
