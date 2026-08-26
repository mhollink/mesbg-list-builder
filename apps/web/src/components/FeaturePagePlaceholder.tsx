import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface FeaturePagePlaceholderProps {
  title: string;
  description?: string;
}

export const FeaturePagePlaceholder = ({
  title,
  description,
}: FeaturePagePlaceholderProps) => (
  <Box>
    <Typography variant="h4" component="h1" gutterBottom>
      {title}
    </Typography>

    {description && (
      <Typography color="textSecondary">{description}</Typography>
    )}
  </Box>
);
