import { useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface RuleTranslationConfirmationDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RuleTranslationConfirmationDialog({
  open,
  onCancel,
  onConfirm,
}: RuleTranslationConfirmationDialogProps) {
  const { t: tCommon } = useTranslation();
  const { t, i18n } = useTranslation("settings");

  const [confirmation, setConfirmation] = useState("");

  const confirmationPhrase = t("rulesTranslation.confirmation.phrase");

  const matchesConfirmation =
    normalizeConfirmation(confirmation, i18n.resolvedLanguage) ===
    normalizeConfirmation(confirmationPhrase, i18n.resolvedLanguage);

  const handleClose = () => {
    setConfirmation("");
    onCancel();
  };

  const handleConfirm = () => {
    if (!matchesConfirmation) {
      return;
    }

    setConfirmation("");
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("rulesTranslation.confirmation.title")}</DialogTitle>

      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          handleConfirm();
        }}
      >
        <DialogContent>
          <Stack spacing={3}>
            <DialogContentText>
              {t("rulesTranslation.confirmation.description")}
            </DialogContentText>

            <Alert severity="warning" icon={false}>
              {t("rulesTranslation.confirmation.warning")}
            </Alert>

            <Stack spacing={1}>
              <Typography variant="body2">
                {t("rulesTranslation.confirmation.instruction", {
                  phrase: confirmationPhrase,
                })}
              </Typography>

              <TextField
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                autoFocus
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>{tCommon("cancel")}</Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!matchesConfirmation}
          >
            {t("rulesTranslation.confirmation.confirm")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function normalizeConfirmation(value: string, locale?: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase(locale);
}
