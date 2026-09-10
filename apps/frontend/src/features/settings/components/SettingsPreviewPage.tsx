import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface SettingsPreviewPageProps {
  title: string;
  description: string;
  notes: string[];
}

export function SettingsPreviewPage({
  title,
  description,
  notes,
}: SettingsPreviewPageProps) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>

        <Typography color="textSecondary">{description}</Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Coming soon
        </Typography>

        <List dense disablePadding>
          {notes.map((note) => (
            <ListItem key={note} sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <FiberManualRecordIcon sx={{ fontSize: 6 }} />
              </ListItemIcon>

              <ListItemText primary={note} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Stack>
  );
}
