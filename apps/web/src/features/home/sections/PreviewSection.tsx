import { Grid } from "@mui/material";
import { PageSection } from "../components/PageSection.tsx";
import { ProductPreview } from "../components/ProductPreview.tsx";

export function PreviewSection() {
  return (
    <PageSection
      eyebrow="Preview"
      title="Prepare, play, review"
      description="The List Builder follows the full tabletop flow: prepare your roster, use it during the battle, then review your results afterwards."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProductPreview
            title="Build"
            subtitle="Create legal lists with clear validation."
            lines={["Warbands", "Points", "Bows", "Army bonus"]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ProductPreview
            title="Play"
            subtitle="Use your roster during the battle."
            lines={[
              "Might / Will / Fate",
              "Wounds",
              "Break point",
              "Casualties",
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ProductPreview
            title="Improve"
            subtitle="Learn from previous games."
            lines={["Match history", "Scenarios", "Opponents", "Army results"]}
          />
        </Grid>
      </Grid>
    </PageSection>
  );
}
