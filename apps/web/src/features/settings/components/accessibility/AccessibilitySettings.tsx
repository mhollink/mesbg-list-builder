import {SettingsPreviewPage} from "../SettingsPreviewPage.tsx";

export function AccessibilitySettings() {
    return (
        <SettingsPreviewPage
            title="Accessibility"
            description="Adjust MESBG List Builder to better suit your accessibility needs and preferences."
            notes={[
                "Color vision modes",
                "High contrast options",
                "Reduced motion",
                "Text size or interface scaling",
                "Possibly increased touch target sizing",
                "Additional colour icons for status indicators",
            ]}
        />
    );
}