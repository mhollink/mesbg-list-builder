import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { CreateRosterDialog } from "~/features/armies/rosters/management/components/dialogs/CreateRosterDialog.tsx";

interface OpenCreateRosterOptions {
  armyListId?: string;
  groupId?: number;
  tagSuggestions?: string[];
}

interface RosterCreationContextValue {
  openCreateRoster: (options?: OpenCreateRosterOptions) => void;
}

const RosterCreationContext = createContext<RosterCreationContextValue | null>(
  null,
);

export function RosterCreationProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<OpenCreateRosterOptions | null>(null);

  const openCreateRoster = useCallback(
    (nextOptions: OpenCreateRosterOptions = {}) => setOptions(nextOptions),
    [],
  );

  const value = useMemo(() => ({ openCreateRoster }), [openCreateRoster]);

  return (
    <RosterCreationContext.Provider value={value}>
      {children}

      {options && (
        <CreateRosterDialog
          open
          onClose={() => setOptions(null)}
          tagSuggestions={options.tagSuggestions ?? []}
          groupId={options.groupId}
          initialArmyListId={options.armyListId}
        />
      )}
    </RosterCreationContext.Provider>
  );
}

export function useRosterCreation() {
  const context = useContext(RosterCreationContext);

  if (!context) {
    throw new Error(
      "useRosterCreation must be used within a RosterCreationProvider",
    );
  }

  return context;
}
