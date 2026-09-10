import { SettingsPreviewPage } from "../SettingsPreviewPage.tsx";

export function DataAndSyncSettings() {
  return (
    <SettingsPreviewPage
      title="Data & Sync"
      description="Manage how your data is stored, synchronized and transferred between devices."
      notes={[
        "Cloud synchronization",
        "Last synchronization status",
        "Automatic versus manual sync",
        "Export all user data",
        "Import previously exported data",
        "Clear locally stored data",
        "Offline behaviour",
      ]}
    />
  );
}
