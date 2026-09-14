import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type ReferencePageHeaderProps = { title: string; description: string };

export function ReferencePageHeader({
  title,
  description,
}: ReferencePageHeaderProps) {
  return (
    <Box>
      <Typography component="h1" variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography color="textSecondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  );
}
