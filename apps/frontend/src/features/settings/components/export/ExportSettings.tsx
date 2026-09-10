import { SettingsPreviewPage } from "../SettingsPreviewPage.tsx";

export function ExportSettings() {
  return (
    <SettingsPreviewPage
      title="Export"
      description="Choose how rosters and other content are presented when exported or printed."
      notes={[
        "PDF paper size",
        "Portrait / landscape orientation",
        "Include or exclude profiles",
        "Include army bonuses and special rules",
        "Compact versus detailed layouts",
        "Print-friendly styling",
        "Image export preferences",
      ]}
    />
  );
}
