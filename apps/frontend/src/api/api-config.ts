import { Configuration } from "@mlb/api-client";

import { keycloak } from "~/features/account/auth/keycloak.ts";

export const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_URL,

  accessToken: async () => {
    await keycloak.updateToken(30);

    if (!keycloak.token) {
      throw new Error("No Keycloak access token available");
    }

    return keycloak.token;
  },
});
