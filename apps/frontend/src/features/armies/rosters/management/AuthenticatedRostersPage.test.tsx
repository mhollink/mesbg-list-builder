import type { ReactNode } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthenticatedRostersPage } from "./AuthenticatedRostersPage.tsx";

const mocks = vi.hoisted(() => ({
  useData: vi.fn(),
  useNavigation: vi.fn(),
  useDialogs: vi.fn(),
  useDnd: vi.fn(),
  showCreateRoster: vi.fn(),
  showCreateGroup: vi.fn(),
  handleDragEnd: vi.fn(),
}));

vi.mock("@dnd-kit/react", () => ({
  DragDropProvider: ({
    children,
    onDragEnd,
  }: {
    children: ReactNode;
    onDragEnd?: (event: unknown) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onDragEnd?.({})}>
        finish drag
      </button>
      {children}
    </div>
  ),
}));

vi.mock("./hooks/useRosterManagementData", () => ({
  useRosterManagementData: mocks.useData,
}));

vi.mock("./hooks/useRosterGroupNavigation", () => ({
  useRosterGroupNavigation: mocks.useNavigation,
}));

vi.mock("./hooks/useRosterDialogs", () => ({
  useRosterDialogs: mocks.useDialogs,
}));

vi.mock("./hooks/useRosterDragAndDrop", () => ({
  useRosterDragAndDrop: mocks.useDnd,
}));

vi.mock("./components/breadcrumbs/RosterBreadcrumbs.tsx", () => ({
  RosterBreadcrumbs: ({ path }: { path: Array<{ name: string }> }) => (
    <div>breadcrumbs:{path.map((group) => group.name).join("/")}</div>
  ),
}));

vi.mock(
  "~/features/armies/rosters/management/components/RosterGrid.tsx",
  () => ({
    RosterGrid: ({
      groups,
      rosters,
    }: {
      groups: Array<{ name: string }>;
      rosters: Array<{ name: string }>;
    }) => (
      <div>
        grid:{groups.map((group) => group.name).join(",")}|
        {rosters.map((roster) => roster.name).join(",")}
      </div>
    ),
  }),
);

vi.mock("./components/RostersSpeedDial", () => ({
  RostersSpeedDial: ({
    onCreateRoster,
    onCreateGroup,
  }: {
    onCreateRoster: () => void;
    onCreateGroup: () => void;
  }) => (
    <div>
      <button type="button" onClick={onCreateRoster}>
        page create roster
      </button>
      <button type="button" onClick={onCreateGroup}>
        page create group
      </button>
    </div>
  ),
}));

vi.mock("./components/dialogs/CreateRosterDialog", () => ({
  CreateRosterDialog: ({
    open,
    groupId,
    tagSuggestions,
  }: {
    open: boolean;
    groupId: number | null;
    tagSuggestions: string[];
  }) => (
    <div>
      create-roster-dialog:{String(open)}:{String(groupId)}:
      {tagSuggestions.join(",")}
    </div>
  ),
}));

vi.mock("./components/dialogs/CreateRosterGroupDialog", () => ({
  CreateRosterGroupDialog: ({
    open,
    parentGroupId,
  }: {
    open: boolean;
    parentGroupId: number | null;
  }) => (
    <div>
      create-group-dialog:{String(open)}:{String(parentGroupId)}
    </div>
  ),
}));

vi.mock("./components/dialogs/DeleteRosterDialog", () => ({
  DeleteRosterDialog: () => <div>delete-roster-dialog</div>,
}));

vi.mock("./components/dialogs/MoveRosterDialog", () => ({
  MoveRosterDialog: () => <div>move-roster-dialog</div>,
}));

vi.mock("./components/dialogs/RenameRosterGroupDialog", () => ({
  RenameRosterGroupDialog: () => <div>rename-group-dialog</div>,
}));

vi.mock("./components/dialogs/DeleteRosterGroupDialog", () => ({
  DeleteRosterGroupDialog: () => <div>delete-group-dialog</div>,
}));

describe("AuthenticatedRostersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useData.mockReturnValue({
      rosters: [{ id: 42, name: "Roster" }],
      groups: [{ id: 12, name: "Root group", children: [] }],
      tagSuggestions: ["Event"],
      isLoading: false,
      isError: false,
    });

    mocks.useNavigation.mockReturnValue({
      currentGroupId: 12,
      currentGroup: { id: 12, name: "Current group" },
      currentGroups: [{ id: 13, name: "Child group" }],
      currentPath: [{ id: 12, name: "Current group" }],
      invalidGroupId: false,
      groupNotFound: false,
      currentRosters: [{ id: 42, name: "Roster" }],
      getDirectRosterCount: vi.fn(),
    });

    mocks.useDialogs.mockReturnValue({
      createRoster: {
        open: false,
        show: mocks.showCreateRoster,
        close: vi.fn(),
      },
      createGroup: {
        open: false,
        show: mocks.showCreateGroup,
        close: vi.fn(),
      },
      deleteRoster: { roster: null, open: vi.fn(), close: vi.fn() },
      moveRoster: { roster: null, open: vi.fn(), close: vi.fn() },
      renameGroup: { group: null, open: vi.fn(), close: vi.fn() },
      deleteGroup: { group: null, open: vi.fn(), close: vi.fn() },
    });

    mocks.useDnd.mockReturnValue({
      handleDragEnd: mocks.handleDragEnd,
      isError: false,
      clearError: vi.fn(),
    });
  });

  it("shows a loading indicator while roster data is loading", () => {
    mocks.useData.mockReturnValue({
      rosters: [],
      groups: [],
      tagSuggestions: [],
      isLoading: true,
      isError: false,
    });

    render(<AuthenticatedRostersPage />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it.each([
    ["invalid group id", { invalidGroupId: true, groupNotFound: false }],
    ["missing group", { invalidGroupId: false, groupNotFound: true }],
  ])("shows an error for %s", (_label, state) => {
    mocks.useNavigation.mockReturnValue({
      ...mocks.useNavigation(),
      ...state,
    });

    render(<AuthenticatedRostersPage />);

    expect(
      screen.getByText("This roster group does not exist."),
    ).toBeInTheDocument();
  });

  it("renders the current group, data and child controls", () => {
    render(<AuthenticatedRostersPage />);

    expect(
      screen.getByRole("heading", { name: "Current group" }),
    ).toBeInTheDocument();
    expect(screen.getByText("breadcrumbs:Current group")).toBeInTheDocument();
    expect(screen.getByText("grid:Child group|Roster")).toBeInTheDocument();
    expect(
      screen.getByText("create-roster-dialog:false:12:Event"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("create-group-dialog:false:12"),
    ).toBeInTheDocument();
  });

  it("shows query and drag-and-drop errors", () => {
    mocks.useData.mockReturnValue({
      ...mocks.useData(),
      isError: true,
    });
    mocks.useDnd.mockReturnValue({
      ...mocks.useDnd(),
      isError: true,
    });

    render(<AuthenticatedRostersPage />);

    expect(
      screen.getByText("Could not load your rosters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The roster or group could not be moved."),
    ).toBeInTheDocument();
  });

  it("wires page actions into the dialog and drag hooks", () => {
    render(<AuthenticatedRostersPage />);

    fireEvent.click(screen.getByRole("button", { name: "page create roster" }));
    fireEvent.click(screen.getByRole("button", { name: "page create group" }));
    fireEvent.click(screen.getByRole("button", { name: "finish drag" }));

    expect(mocks.showCreateRoster).toHaveBeenCalledOnce();
    expect(mocks.showCreateGroup).toHaveBeenCalledOnce();
    expect(mocks.handleDragEnd).toHaveBeenCalledOnce();
  });
});
