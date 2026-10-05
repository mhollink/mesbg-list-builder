import Drawer from "@mui/material/Drawer";

import {
  RosterInfoContent,
  type RosterInfoContentProps,
} from "~/features/armies/rosters/builder/components/layout/info-panel/RosterInfoContent.tsx";

export const ROSTER_INFO_PANEL_WIDTH = 460;

interface RosterInfoPanelProps extends RosterInfoContentProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function RosterInfoPanel({
  mobileOpen,
  onMobileClose,
  ...contentProps
}: RosterInfoPanelProps) {
  return (
    <>
      <Drawer
        anchor="right"
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            lg: "block",
          },

          width: ROSTER_INFO_PANEL_WIDTH,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: ROSTER_INFO_PANEL_WIDTH,
            boxSizing: "border-box",
            top: 64,
            height: "calc(100vh - 64px)",
          },
        }}
      >
        <RosterInfoContent {...contentProps} />
      </Drawer>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{
          display: {
            xs: "block",
            lg: "none",
          },
        }}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "100%",
                sm: 420,
              },
              maxWidth: "100%",
            },
          },
        }}
      >
        <RosterInfoContent {...contentProps} onClose={onMobileClose} />
      </Drawer>
    </>
  );
}
