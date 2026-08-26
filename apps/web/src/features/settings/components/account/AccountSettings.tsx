import { SettingsPreviewPage } from "../SettingsPreviewPage.tsx";

export function AccountSettings() {
  return (
    <SettingsPreviewPage
      title="Account"
      description="Manage your account, profile and authentication settings."
      notes={[
        "Display name / profile information",
        "Connected authentication providers",
        "Change password where applicable",
        "Account status",
        "Delete account",
        "Possibly Patreon connections later",
      ]}
    />
  );
}
