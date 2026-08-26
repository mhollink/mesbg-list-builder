import {SettingsPreviewPage} from "../SettingsPreviewPage.tsx";

export function PrivacySettings() {
    return (
        <SettingsPreviewPage
            title="Privacy"
            description="Control what information MESBG List Builder stores and what you choose to share with others."
            notes={[
                "Player discoverability",
                "Location sharing for Find a Game",
                "Location precision, for example city rather than exact position",
                "Analytics preferences",
                "Link to privacy policy",
            ]}
        />
    );
}