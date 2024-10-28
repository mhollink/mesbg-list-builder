import Stack from "@mui/material/Stack";
import { useRosterBuildingState } from "../../../state/roster-building";
import { Tabs } from "../../../state/roster-building/builder-selection";
import { FactionType } from "../../../types/factions.ts";
import { FactionPickerDropdown } from "./FactionPickerDropdown.tsx";
import { HeroSelectionList } from "./selection-list/HeroSelectionList.tsx";
import { SiegeEquipmentSelectionList } from "./selection-list/SiegeEquipmentSelectionList.tsx";
import { WarriorSelectionList } from "./selection-list/WarriorSelectionList.tsx";

export function FactionTypeTab({
  type,
  activeTab,
}: {
  type: FactionType;
  activeTab: Tabs;
}) {
  const { heroSelection, factionSelection } = useRosterBuildingState();
  return (
    <div
      role="tabpanel"
      hidden={activeTab !== type}
      id={`simple-tabpanel-${type}`}
      aria-labelledby={`simple-tab-${type}`}
    >
      <Stack spacing={1} sx={{ mt: 1 }}>
        <FactionPickerDropdown type={type} />
        {heroSelection ? (
          <HeroSelectionList faction={factionSelection[type]} />
        ) : (
          <>
            <WarriorSelectionList />
            <SiegeEquipmentSelectionList />
          </>
        )}
      </Stack>
    </div>
  );
}
