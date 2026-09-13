import { useMemo } from "react";
import { useParams } from "react-router";

import { useGameArmyLists } from "~/features/reference/army-lists/hooks/useGameArmyLists.ts";

export function useArmyListPage() {
  const { armyListId } = useParams();
  const { armyLists } = useGameArmyLists();

  const armyList = useMemo(
    () => armyLists.find((armyList) => armyList.id === armyListId),
    [armyLists, armyListId],
  );

  return {
    armyList,
  };
}
