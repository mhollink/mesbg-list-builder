import { MemoryRouter, useLocation, useNavigate } from "react-router";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useBuilderPickerHistory } from "./useBuilderPickerHistory.ts";

function HistoryHarness() {
  const history = useBuilderPickerHistory();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <output data-testid="location">
        {location.pathname + location.search}
      </output>
      <output data-testid="depth">{history.depth}</output>
      <button
        type="button"
        onClick={() =>
          history.openPicker({ type: "follower-add", warbandId: "17" })
        }
      >
        Open selection
      </button>
      <button
        type="button"
        onClick={() =>
          history.openPicker({ type: "leader-edit", warbandId: "17" })
        }
      >
        Edit leader
      </button>
      <button
        type="button"
        onClick={() =>
          history.openPicker({ type: "warband-create", mode: "continuous" })
        }
      >
        Create multiple warbands
      </button>
      <button type="button" onClick={() => history.configure("gandalf")}>
        Configure
      </button>
      <button type="button" onClick={history.back}>
        Picker back
      </button>
      <button type="button" onClick={history.close}>
        Picker close
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        Browser back
      </button>
      <button type="button" onClick={() => navigate(1)}>
        Browser forward
      </button>
    </>
  );
}

function mount(initialUrl = "/rosters/guest?sort=name") {
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <HistoryHarness />
    </MemoryRouter>,
  );
}

function expectUrl(value: string) {
  return waitFor(() =>
    expect(screen.getByTestId("location")).toHaveTextContent(value),
  );
}

describe("useBuilderPickerHistory", () => {
  it("navigates back through configuration, selection and roster", async () => {
    mount();
    fireEvent.click(screen.getByText("Open selection"));
    await expectUrl("builderPicker=follower-add");
    fireEvent.click(screen.getByText("Configure"));
    await expectUrl("builderProfileId=gandalf");
    expect(screen.getByTestId("depth")).toHaveTextContent("2");

    fireEvent.click(screen.getByText("Browser back"));
    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).not.toContain(
        "builderProfileId",
      ),
    );
    expect(screen.getByTestId("location")).toHaveTextContent(
      "builderPicker=follower-add",
    );
    fireEvent.click(screen.getByText("Browser back"));
    await expectUrl("/rosters/guest?sort=name");
  });

  it("returns to continuous warband selection after a configured leader", async () => {
    mount();
    fireEvent.click(screen.getByText("Create multiple warbands"));
    await expectUrl("builderMode=continuous");
    fireEvent.click(screen.getByText("Configure"));
    await expectUrl("builderProfileId=gandalf");
    fireEvent.click(screen.getByText("Picker back"));
    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).not.toContain(
        "builderProfileId",
      ),
    );
    expect(screen.getByTestId("location")).toHaveTextContent(
      "builderMode=continuous",
    );
  });

  it("opens existing-unit editors directly in configuration", async () => {
    mount();
    fireEvent.click(screen.getByText("Edit leader"));
    await expectUrl("builderPicker=leader-edit");
    expect(screen.getByTestId("depth")).toHaveTextContent("1");
    fireEvent.click(screen.getByText("Browser back"));
    await expectUrl("/rosters/guest?sort=name");
  });

  it("closes the entire flow from a nested configuration", async () => {
    mount();
    fireEvent.click(screen.getByText("Open selection"));
    fireEvent.click(screen.getByText("Configure"));
    fireEvent.click(screen.getByText("Picker close"));
    await expectUrl("/rosters/guest?sort=name");
    fireEvent.click(screen.getByText("Browser back"));
    await expectUrl("/rosters/guest?sort=name");
  });

  it("keeps selection open after returning from a configured unit", async () => {
    mount();
    fireEvent.click(screen.getByText("Open selection"));
    fireEvent.click(screen.getByText("Configure"));
    fireEvent.click(screen.getByText("Picker back"));
    await waitFor(() =>
      expect(screen.getByTestId("location").textContent).not.toContain(
        "builderProfileId",
      ),
    );
    expect(screen.getByTestId("location")).toHaveTextContent(
      "builderPicker=follower-add",
    );
  });

  it("can close a direct URL without assuming an earlier history entry", async () => {
    mount(
      "/rosters/guest?sort=name&builderPicker=follower-add&builderWarbandId=17&builderProfileId=gandalf",
    );
    fireEvent.click(screen.getByText("Picker close"));
    await expectUrl("/rosters/guest?sort=name");
  });

  it("navigates to selection when backing out of a direct configuration URL", async () => {
    mount(
      "/rosters/guest?builderPicker=follower-add&builderWarbandId=17&builderProfileId=gandalf",
    );
    fireEvent.click(screen.getByText("Picker back"));
    await expectUrl(
      "/rosters/guest?builderPicker=follower-add&builderWarbandId=17",
    );
  });
});
