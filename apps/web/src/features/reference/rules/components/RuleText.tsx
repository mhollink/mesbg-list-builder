import type { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface RuleTextProps {
  children: string;
}

export function RuleText({ children }: RuleTextProps) {
  const paragraphs = children
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Stack spacing={1.5}>
      {paragraphs.map((paragraph, index) => (
        <Typography
          key={index}
          component="p"
          color="textSecondary"
          sx={{ lineHeight: 1.7 }}
        >
          {renderInlineMarkup(paragraph)}
        </Typography>
      ))}
    </Stack>
  );
}

function renderInlineMarkup(text: string): ReactNode[] {
  return text
    .split(/(<b>.*?<\/b>)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("<b>") && part.endsWith("</b>")) {
        return <strong key={index}>{part.slice(3, -4)}</strong>;
      }

      return part;
    });
}
