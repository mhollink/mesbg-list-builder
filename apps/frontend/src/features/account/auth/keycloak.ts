import Keycloak from "keycloak-js";

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;

if (
  !keycloakUrl ||
  (!keycloakUrl.startsWith("http://") && !keycloakUrl.startsWith("https://"))
) {
  throw new Error(
    `VITE_KEYCLOAK_URL must be an absolute URL, received: ${keycloakUrl}`,
  );
}

export const keycloak = new Keycloak({
  url: keycloakUrl,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});
