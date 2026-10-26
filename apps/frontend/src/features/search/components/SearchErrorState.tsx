import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
export function SearchErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation("search");
  return (
    <Alert
      severity="warning"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          {t("retry")}
        </Button>
      }
    >
      {t("error")}
    </Alert>
  );
}
