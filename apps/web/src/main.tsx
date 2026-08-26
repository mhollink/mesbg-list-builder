import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./app/router";
import { AppThemeProvider } from "./theme/AppThemeProvider.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store.ts";
import "./i18n/i18n";
import { LocalizationProvider } from "./i18n/LocalizationProvider.tsx";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found!");
}

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LocalizationProvider>
          <AppThemeProvider>
            <RouterProvider router={router} />
          </AppThemeProvider>
        </LocalizationProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
