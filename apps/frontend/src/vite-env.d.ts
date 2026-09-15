/// <reference types="vite/client" />
declare const BUILD_VERSION: string;
declare const BUILD_DATE: string;
declare const RESOURCES_URL: string;
declare const API_URL: string;

interface ImportMetaEnv {
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;

  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
