import { useState } from "react";
import { Link } from "react-router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useDraggable, useDroppable } from "@dnd-kit/react";
import type { RosterGroup } from "@mlb/api-client";

interface RosterGroupCardProps {
  group: RosterGroup;
  rosterCount: number;
  onRename: (group: RosterGroup) => void;
  onDelete: (group: RosterGroup) => void;
}

export function RosterGroupCard({
  group,
  rosterCount,
  onRename,
  onDelete,
}: RosterGroupCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { ref: droppableRef, isDropTarget } = useDroppable({
    id: `group:${group.id}`,
    accept: ["roster", "group"],
    data: {
      type: "group",
      groupId: group.id,
    },
  });
  const {
    ref: draggableRef,
    handleRef,
    isDragging,
  } = useDraggable({
    id: `group:${group.id}`,
    type: "group",
    data: {
      type: "group",
      groupId: group.id,
    },
  });

  const setRefs = (element: HTMLElement | null) => {
    draggableRef(element);
    droppableRef(element);
  };

  const childGroupCount = group.children?.length ?? 0;
  const deleteBlockedReason =
    rosterCount > 0 && childGroupCount > 0
      ? "Move or delete the rosters and nested groups first."
      : rosterCount > 0
        ? "Move or delete the rosters in this group first."
        : childGroupCount > 0
          ? "Move or delete the nested groups first."
          : undefined;
  const canDelete = deleteBlockedReason === undefined;

  return (
    <Card
      ref={setRefs}
      elevation={isDropTarget ? 8 : 2}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 300,
        minHeight: 180,
        outline: "2px solid",
        outlineColor: isDropTarget ? "primary.main" : "transparent",
        transition: (theme) =>
          theme.transitions.create(["outline-color", "box-shadow"]),
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Tooltip title="Drag group">
        <IconButton
          ref={handleRef}
          aria-label={`Drag ${group.name}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          sx={{
            position: "absolute",
            left: 4,
            top: 4,
            zIndex: 2,
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <DragIndicatorIcon />
        </IconButton>
      </Tooltip>

      <IconButton
        aria-label={`Actions for ${group.name}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        }}
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          zIndex: 2,
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <CardActionArea
        component={Link}
        to={`/armies/rosters/groups/${group.id}`}
        sx={{
          height: "100%",
          minHeight: 180,
          p: 3,
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <FolderRoundedIcon
            sx={{
              fontSize: 56,
              color: isDropTarget ? "primary.main" : "text.secondary",
            }}
          />

          <Typography variant="h6" sx={{ textAlign: "center" }}>
            {group.name}
          </Typography>

          <Typography variant="body2" color="textSecondary">
            {rosterCount} roster
            {rosterCount === 1 ? "" : "s"}
            {childGroupCount > 0 &&
              ` · ${childGroupCount} group${childGroupCount === 1 ? "" : "s"}`}
          </Typography>
        </Box>
      </CardActionArea>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onRename(group);
          }}
        >
          <DriveFileRenameOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Rename
        </MenuItem>

        <Tooltip
          title={deleteBlockedReason ?? ""}
          disableHoverListener={canDelete}
          placement="right"
        >
          <span>
            <MenuItem
              disabled={!canDelete}
              onClick={() => {
                setAnchorEl(null);
                onDelete(group);
              }}
            >
              <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />

              <ListItemText primary="Delete" secondary={deleteBlockedReason} />
            </MenuItem>
          </span>
        </Tooltip>
      </Menu>
    </Card>
  );
}
