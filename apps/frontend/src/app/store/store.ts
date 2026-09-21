import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { rootReducer } from "./rootReducer.ts";
import { storage } from "./storage.ts";
import { serverApi } from "~/api/server-api.ts";

const persistedReducer = persistReducer(
  {
    key: "mesbg-list-builder",
    storage,

    whitelist: ["guestRoster", "theme", "settings"],
  },
  rootReducer,
) as typeof rootReducer;

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(serverApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
