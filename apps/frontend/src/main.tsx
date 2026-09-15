import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router/dom";

import { PersistGate } from "redux-persist/integration/react";

import { router } from "./app/router.tsx";
import { persistor, store } from "./app/store/store.ts";
import { LocalizationProvider } from "./i18n/LocalizationProvider.tsx";
import { AppThemeProvider } from "./theme/AppThemeProvider.tsx";
import { keycloak } from "~/features/account/auth/keycloak.ts";
import "./i18n/i18n";

async function bootstrap() {
  await keycloak.init({
    onLoad: "check-sso",
    pkceMethod: "S256",
  });

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
}

void bootstrap();
