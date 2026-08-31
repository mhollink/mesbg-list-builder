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
                  component={block.listType}
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
      type: "heading";
      content: string;
    }
  | {
      type: "list";
      listType: "ul" | "ol";
      items: string[];
    };

function parseBlocks(text: string): RuleTextBlock[] {
  const normalized = text.replace(/\r\n/g, "\n");

  return normalized
    .split(/(<(?:ul|ol)>.*?<\/(?:ul|ol)>|<h3>.*?<\/h3>)/gs)
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap<RuleTextBlock>((block) => {
      const listMatch = block.match(/^<(ul|ol)>(.*?)<\/\1>$/s);

      if (listMatch) {
        const [, listType, content] = listMatch;

        return {
          type: "list",
          listType: listType as "ul" | "ol",
          items: [...content.matchAll(/<li>(.*?)<\/li>/gs)]
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
  const result: ReactNode[] = [];
  const regex = /<(b|u|rule)(?: id="([^"]+)")?>(.*?)<\/\1>/gs;

  let lastIndex = 0;

  while (true) {
    const match = regex.exec(text);

    if (match === null) {
      break;
    }

    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    const [fullMatch, tag, id, content] = match;
    const key = `${match.index}-${fullMatch.length}`;

    switch (tag) {
      case "b":
        result.push(
          <Keyword key={key}>
            {renderInlineMarkup(content, onRuleClick)}
          </Keyword>,
        );
        break;

      case "u":
        result.push(
          <ErrataText key={key}>
            {renderInlineMarkup(content, onRuleClick)}
          </ErrataText>,
        );
        break;

      case "rule":
        result.push(
          <ReferencedRuleLink key={key} onClick={() => id && onRuleClick?.(id)}>
            {renderInlineMarkup(content, onRuleClick)}
          </ReferencedRuleLink>,
        );
        break;
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}
