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
  return (
    <SpeedDial
      ariaLabel="Roster actions"
      icon={<SpeedDialIcon openIcon={<AddIcon />} />}
      sx={{
        position: "fixed",
        right: 24,
        bottom: 24,
      }}
    >
      <SpeedDialAction
        icon={<FormatListBulletedIcon />}
        title="Create roster"
        onClick={onCreateRoster}
      />

      <SpeedDialAction
        icon={<CreateNewFolderIcon />}
        title="Create group"
        onClick={onCreateGroup}
      />
    </SpeedDial>
  );
}
