import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface LoadoutQuantityControlsProps {
  quantity: number;
  minQuantity?: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
}

export function UnitLoadoutQuantityControls({
  quantity,
  minQuantity = 1,
  disabled = false,
  onChange,
}: LoadoutQuantityControlsProps) {
  return (
    <Stack direction="row" spacing={0} sx={{ alignItems: "center" }}>
      <IconButton
        size="small"
        disabled={disabled || quantity <= minQuantity}
        onClick={() => onChange(Math.max(minQuantity, quantity - 1))}
        aria-label="Decrease quantity"
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <Typography
        sx={{
          minWidth: 24,
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {quantity}
      </Typography>

      <IconButton
        size="small"
        disabled={disabled}
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
