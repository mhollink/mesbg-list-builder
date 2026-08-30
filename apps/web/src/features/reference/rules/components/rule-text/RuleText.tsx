import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ErrataText } from "~/features/reference/rules/components/rule-text/ErrataText.tsx";
import { Keyword } from "~/features/reference/rules/components/rule-text/Keyword.tsx";
import { ReferencedRuleLink } from "~/features/reference/rules/components/rule-text/ReferencedRuleLink.tsx";

interface RuleTextProps {
  children: string;
  onRuleClick?: (ruleId: string) => void;
}

export function RuleText({ children, onRuleClick }: RuleTextProps) {
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
                  {renderInlineMarkup(block.content, onRuleClick)}
                </Typography>
              );

            case "heading":
              return (
                <Typography
                  key={block.content}
                  component="h3"
                  variant="h6"
                  sx={{
                    mt: 4,
                    fontWeight: 700,
                  }}
                >
                  {renderInlineMarkup(block.content, onRuleClick)}
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
                      {renderInlineMarkup(item, onRuleClick)}
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
    }
  | {
      type: "heading";
      content: string;
    };

function parseBlocks(text: string): RuleTextBlock[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/(<ul>.*?<\/ul>|<h3>.*?<\/h3>)/gs)
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

      if (block.startsWith("<h3>") && block.endsWith("</h3>")) {
        return {
          type: "heading",
          content: block.slice(4, -5).trim(),
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

function renderInlineMarkup(
  text: string,
  onRuleClick?: (ruleId: string) => void,
): ReactNode[] {
  return text
    .split(/(<b>.*?<\/b>|<u>.*?<\/u>|<rule id="[^"]+">.*?<\/rule>)/g)
    .filter(Boolean)
    .map((part, index) => {
      const key = `${part}-${index}`;
      if (part.startsWith("<b>") && part.endsWith("</b>")) {
        return <Keyword key={key}>{part.slice(3, -4)}</Keyword>;
      }

      if (part.startsWith("<u>") && part.endsWith("</u>")) {
        return <ErrataText key={key}>{part.slice(3, -4)}</ErrataText>;
      }

      const ruleMatch = part.match(/^<rule id="([^"]+)">(.*?)<\/rule>$/);
      if (ruleMatch) {
        const [, ruleId, label] = ruleMatch;
        return (
          <ReferencedRuleLink key={key} onClick={() => onRuleClick?.(ruleId)}>
            {label}
          </ReferencedRuleLink>
        );
      }

      return part;
    });
}
