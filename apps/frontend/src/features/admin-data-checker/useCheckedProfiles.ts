import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mesbg-list-builder.v2.debug-profiles-checked";

export function useCheckedProfiles() {
  const [checkedProfiles, setCheckedProfiles] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return new Set();
    }

    return new Set(JSON.parse(stored) as string[]);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedProfiles]));
  }, [checkedProfiles]);

  const isChecked = useCallback(
    (profileId: string) => checkedProfiles.has(profileId),
    [checkedProfiles],
  );

  const setChecked = useCallback((profileId: string, checked: boolean) => {
    setCheckedProfiles((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(profileId);
      } else {
        next.delete(profileId);
      }

      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setCheckedProfiles(new Set());
  }, []);

  return {
    checkedProfiles,
    isChecked,
    setChecked,
    clear,
  };
}
