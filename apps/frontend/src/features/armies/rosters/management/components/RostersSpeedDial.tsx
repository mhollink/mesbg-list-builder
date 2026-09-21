import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";

interface RostersSpeedDialProps {
  onCreateRoster: () => void;
  onCreateGroup: () => void;
}

export function RostersSpeedDial({
  onCreateRoster,
  onCreateGroup,
}: RostersSpeedDialProps) {
  const [open, setOpen] = useState(false);

  return (
    <SpeedDial
      ariaLabel="Roster actions"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={(_event, reason) => {
        // Clicking the main FAB while already open should not close it.
        if (reason === "toggle") {
          return;
        }

        setOpen(false);
      }}
      icon={<SpeedDialIcon openIcon={<AddIcon />} />}
      sx={{
        position: "fixed",
        right: 24,
        bottom: 24,
      }}
    >
      <SpeedDialAction
        icon={<FormatListBulletedIcon />}
        onClick={() => {
          setOpen(false);
          onCreateRoster();
        }}
        sx={{
          ".MuiSpeedDialAction-staticTooltipLabel": {
            whiteSpace: "nowrap",
            minWidth: "max-content",
          },
        }}
        slotProps={{
          tooltip: {
            title: "Create roster",
            open: true,
            placement: "left",
          },
        }}
      />

      <SpeedDialAction
        icon={<CreateNewFolderIcon />}
        onClick={() => {
          setOpen(false);
          onCreateGroup();
        }}
        sx={{
          ".MuiSpeedDialAction-staticTooltipLabel": {
            whiteSpace: "nowrap",
            minWidth: "max-content",
          },
        }}
        slotProps={{
          tooltip: {
            title: "Create group",
            open: true,
            placement: "left",
          },
        }}
      />
    </SpeedDial>
  );
}
