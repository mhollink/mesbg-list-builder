import Stack from "@mui/material/Stack";

import { ArmyListComposition } from "./components/army-list-page/ArmyListComposition.tsx";
import { ArmyListPageHeader } from "./components/army-list-page/ArmyListPageHeader.tsx";
import { ArmyListRules } from "./components/army-list-page/ArmyListRules.tsx";
import { ArmyListSectionDivider } from "./components/army-list-page/ArmyListSectionDivider.tsx";
import { useArmyListPage } from "./hooks/useArmyListPage.ts";
import { useDrawerStack } from "~/features/drawer-stack/hooks/useDrawerStack.ts";

export function ArmyListPage() {
  const { armyList } = useArmyListPage();
  const { openProfileDrawer, openRuleDrawer } = useDrawerStack();

  if (!armyList) {
    return null;
  }

  return (
    <Stack>
      <ArmyListPageHeader armyList={armyList} />

      <ArmyListSectionDivider>Army composition</ArmyListSectionDivider>

      <ArmyListComposition
        profiles={armyList.profiles}
        onOpenProfile={openProfileDrawer}
      />

      {armyList.additionalRules.length > 0 && (
        <>
          <ArmyListSectionDivider>Additional rules</ArmyListSectionDivider>

          <ArmyListRules
            rules={armyList.additionalRules}
            onOpenRule={openRuleDrawer}
          />
        </>
      )}

      {armyList.specialRules.length > 0 && (
        <>
          <ArmyListSectionDivider>Special rules</ArmyListSectionDivider>

          <ArmyListRules
            rules={armyList.specialRules}
            onOpenRule={openRuleDrawer}
          />
        </>
      )}
    </Stack>
  );
}
