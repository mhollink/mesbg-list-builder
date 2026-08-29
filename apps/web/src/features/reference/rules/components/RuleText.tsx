import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface RuleTextProps {
  children: string;
}

export function RuleText({ children }: RuleTextProps) {
  const blocks = parseBlocks(children);

  return (
    <Stack spacing={1.5}>
      {blocks
        .map((block) => {
          switch (block.type) {
            case "paragraph":
              return (
                <Typography
                  key={block.content}
                  component="p"
                  color="textSecondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {renderInlineMarkup(block.content)}
                </Typography>
              );

            case "list":
              return (
                <Box
                  key={block.items.toString()}
                  component="ul"
                  sx={{
                    my: 0,
                    pl: 3,
                    color: "text.secondary",
                  }}
                >
                  {block.items.map((item) => (
                    <Typography
                      key={item}
                      component="li"
                      sx={{
                        lineHeight: 1.7,
                        mb: 0.75,
                        "&:last-child": {
                          mb: 0,
                        },
                      }}
                    >
                      {renderInlineMarkup(item)}
                    </Typography>
                  ))}
                </Box>
              );

            default:
              return null;
          }
        })
        .filter((element) => !!element)}
    </Stack>
  );
}

type RuleTextBlock =
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "list";
      items: string[];
    };

function parseBlocks(text: string): RuleTextBlock[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/(<ul>.*?<\/ul>)/gs)
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap<RuleTextBlock>((block) => {
      if (block.startsWith("<ul>") && block.endsWith("</ul>")) {
        return {
          type: "list",
          items: [...block.matchAll(/<li>(.*?)<\/li>/gs)]
            .map((match) => match[1].trim())
            .filter(Boolean),
        };
      }

      return block
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((content) => ({
          type: "paragraph" as const,
          content,
        }));
    });
}

function renderInlineMarkup(text: string): ReactNode[] {
  return text
    .split(/(<b>.*?<\/b>)/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("<b>") && part.endsWith("</b>")) {
        return <strong key={part}>{part.slice(3, -4)}</strong>;
      }

      return part;
    });
}
