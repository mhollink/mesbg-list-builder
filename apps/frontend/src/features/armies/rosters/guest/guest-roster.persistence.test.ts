import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { beforeEach, describe, expect, it } from "vitest";

import guestRosterReducer, {
  replaceGuestRoster,
} from "./guest-roster.slice.ts";
import type { GuestRoster } from "./guest-roster.types.ts";
import { storage } from "~/app/store/storage.ts";

const guestRoster: GuestRoster = {
  id: "guest",
  name: "Persistent roster",
  armyListId: "mordor",
  tags: [],
  warbands: [],
  createdAt: "",
  updatedAt: "",
};

describe("guest roster persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("rehydrates the guest roster from localStorage", async () => {
    const first = createPersistedStore();

    await waitUntilBootstrapped(first.persistor);

    first.store.dispatch(replaceGuestRoster(guestRoster));
    await first.persistor.flush();
    first.persistor.pause();

    const second = createPersistedStore();

    await waitUntilBootstrapped(second.persistor);

    expect(second.store.getState().roster).toEqual(guestRoster);

    second.persistor.pause();
  });
});

function createPersistedStore() {
  const persistedReducer = persistReducer(
    {
      key: "guest-roster-test",
      storage,
    },
    guestRosterReducer,
  );

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  return {
    store,
    persistor: persistStore(store),
  };
}

async function waitUntilBootstrapped(
  persistor: ReturnType<typeof persistStore>,
) {
  if (persistor.getState().bootstrapped) {
    return;
  }

  await new Promise<void>((resolve) => {
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
  });
}
