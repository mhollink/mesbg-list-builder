import {SettingsPreviewPage} from "../SettingsPreviewPage.tsx";

export function GeneralSettings() {
    return (
        <SettingsPreviewPage
            title="General"
            description="Configure the default behaviour of MESBG List Builder."
            notes={[
                "Default landing page",
                "Default army and roster preferences",
                "Language and regional preferences",
                "Other application-wide behaviour",
            ]}
        />
    );
}