import { useCallback, useEffect, useRef, useState } from "react";

import type { BuilderUnit, BuilderWarbandId } from "../domain/roster.types.ts";
import type {
  RosterPersistence,
  UpdateBuilderUnit,
} from "../persistence/roster-persistence.types.ts";

interface UseDebouncedUnitUpdateOptions {
  unit: BuilderUnit;
  warbandId: BuilderWarbandId;
  updateUnit: RosterPersistence["updateUnit"];
  delay?: number;
}

export function useDebouncedUnitUpdate({
  unit,
  warbandId,
  updateUnit,
  delay = 750,
}: UseDebouncedUnitUpdateOptions) {
  const [draftUnit, setDraftUnit] = useState<BuilderUnit>(unit);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pendingRef = useRef<UpdateBuilderUnit | null>(null);

  const updateUnitRef = useRef(updateUnit);

  useEffect(() => {
    updateUnitRef.current = updateUnit;
  }, [updateUnit]);

  useEffect(() => {
    if (!pendingRef.current) {
      setDraftUnit(unit);
    }
  }, [unit]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const flush = useCallback(async () => {
    clearTimer();

    const changes = pendingRef.current;

    if (!changes) {
      return;
    }

    pendingRef.current = null;

    await updateUnitRef.current(warbandId, unit.id, changes);
  }, [clearTimer, unit.id, warbandId]);

  const schedule = useCallback(() => {
    clearTimer();

    timerRef.current = setTimeout(() => {
      void flush();
    }, delay);
  }, [clearTimer, delay, flush]);

  const update = useCallback(
    (changes: UpdateBuilderUnit) => {
      pendingRef.current = {
        ...pendingRef.current,
        ...changes,
      };

      setDraftUnit((current) => ({
        ...current,
        ...changes,

        optionIds:
          changes.optionIds !== undefined
            ? [...changes.optionIds]
            : current.optionIds,
      }));

      schedule();
    },
    [schedule],
  );

  const cancel = useCallback(() => {
    clearTimer();
    pendingRef.current = null;
  }, [clearTimer]);

  useEffect(() => cancel, [cancel]);

  return {
    unit: draftUnit,
    update,
    flush,
    cancel,
  };
}
