import { configureStore, type Middleware } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  type PersistConfig,
  PURGE,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { rootReducer } from "./rootReducer.ts";
import { storage } from "./storage.ts";
import { serverApi } from "~/api/server-api.ts";

type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "mesbg-list-builder",
  storage,
  whitelist: ["guestRoster", "theme", "settings"],
} satisfies PersistConfig<RootReducerState>;

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(serverApi.middleware as Middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
