import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { RuleText } from "./RuleText.tsx";

vi.mock('@mui/material/Typography', () => ({
  default: ({ component: Component, children, sx, ...props }: any) => {
    const mockTheme = {
      appColors: { highlight: 'mocked-highlight-color' },
    };
    console.log(sx);
    const resolvedSx = typeof sx === 'function' ? sx(mockTheme) : sx;
    return (
        <Component data-sx={JSON.stringify(resolvedSx)} {...props}>
          {children}
        </Component>
    );
  },
}));

describe("RuleText", () => {
  test("renders separate paragraphs from newline-separated text", () => {
    const { container } = render(
      <RuleText>
        {"First paragraph.\nSecond paragraph."}
      </RuleText>,
    );

    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  test("renders headings and unordered and ordered lists", () => {
    const { container } = render(
      <RuleText>
        {
          "<h3>Special cases</h3><ul><li>First item</li><li>Second item</li></ul><ol><li>Third item</li><li>Fourth item</li></ol>"
        }
      </RuleText>,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Special cases" }),
    ).toBeInTheDocument();

    const unorderedList = container.querySelector("ul");
    const orderedList = container.querySelector("ol");

    expect(unorderedList).not.toBeNull();
    expect(orderedList).not.toBeNull();

    expect(within(unorderedList!).getAllByRole("listitem")).toHaveLength(2);
    expect(within(orderedList!).getAllByRole("listitem")).toHaveLength(2);
  });

  test("renders keyword and errata inline markup", () => {
    render(
      <RuleText>
        {"A <b>Hero</b> gains <u>this updated wording</u>."}
      </RuleText>,
    );

    expect(screen.getByText("Hero").tagName).toBe("STRONG");
    expect(screen.getByText("this updated wording")).toBeInTheDocument();
  });

  test("opens referenced rules", async () => {
    const user = userEvent.setup();
    const onRuleClick = vi.fn();

    render(
      <RuleText onRuleClick={onRuleClick}>
        {'Models with a <rule id="spear">Spear</rule> may use this rule.'}
      </RuleText>,
    );

    await user.click(screen.getByRole("button", { name: "Spear" }));

    expect(onRuleClick).toHaveBeenCalledOnce();
    expect(onRuleClick).toHaveBeenCalledWith("spear");
  });

  test("supports nested inline markup", async () => {
    const user = userEvent.setup();
    const onRuleClick = vi.fn();

    render(
      <RuleText onRuleClick={onRuleClick}>
        {'See <rule id="terror"><b>Terror</b></rule> for details.'}
      </RuleText>,
    );

    const link = screen.getByRole("button", { name: "Terror" });

    expect(within(link).getByText("Terror").tagName).toBe("STRONG");

    await user.click(link);

    expect(onRuleClick).toHaveBeenCalledWith("terror");
  });
});
