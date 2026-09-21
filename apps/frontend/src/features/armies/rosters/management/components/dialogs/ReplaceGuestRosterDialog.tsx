import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface ReplaceGuestRosterDialogProps {
  open: boolean;
  existingRosterName: string;
  newRosterName: string;
  isLoading: boolean;
  onCancel: () => void;
  onOpenExisting: () => void;
  onReplace: () => void;
}

export function ReplaceGuestRosterDialog({
  open,
  existingRosterName,
  newRosterName,
  isLoading,
  onCancel,
  onOpenExisting,
  onReplace,
}: ReplaceGuestRosterDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Replace your guest roster?</DialogTitle>

      <DialogContent>
        <DialogContentText>
          You can keep one roster while using MESBG List Builder as a guest.
          Creating <strong>{newRosterName}</strong> will replace{" "}
          <strong>{existingRosterName}</strong>.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>

        <Button onClick={onOpenExisting} disabled={isLoading}>
          Open existing roster
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onReplace}
          disabled={isLoading}
        >
          Replace roster
        </Button>
      </DialogActions>
    </Dialog>
  );
}
