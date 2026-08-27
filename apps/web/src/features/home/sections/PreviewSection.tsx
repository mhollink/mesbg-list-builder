import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";

import { PageSection } from "../components/PageSection.tsx";
import { ProductPreview } from "../components/ProductPreview.tsx";

const cards = ["build", "play", "improve"];

export function PreviewSection() {
  const { t } = useTranslation("home", { keyPrefix: "preview" });
  const items = (key: string) =>
    t(key, {
      returnObjects: true,
    }) as string[];

  return (
    <PageSection
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card} size={{ xs: 12, md: 4 }}>
            <ProductPreview
              title={t(`cards.${card}.title`)}
              subtitle={t(`cards.${card}.subtitle`)}
              lines={items(`cards.${card}.lines`)}
            />
          </Grid>
        ))}
      </Grid>
    </PageSection>
  );
}
