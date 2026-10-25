import { useState } from "react";
import { useTranslation } from "react-i18next";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import TimelapseRoundedIcon from "@mui/icons-material/TimelapseRounded";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { RoadmapProgressRing } from "./RoadmapProgressRing.tsx";
import { RoadmapReleaseMarker } from "./RoadmapReleaseMarker.tsx";
import {
  type DeliverableStatus,
  type RoadmapStage,
  roadmap,
  roadmapReleases,
} from "./roadmap.data.ts";
import {
  getFeatureProgress,
  getMilestoneProgress,
  getRoadmapProgress,
  type RoadmapProgress,
} from "./roadmap.progress.ts";
import { createRoadmapTimeline } from "./roadmap.timeline.ts";

const statusColors = {
  done: "success.main",
  inProgress: "primary.main",
  planned: "text.disabled",
} as const;

const stageColors = {
  available: "success.main",
  active: "primary.main",
  future: "textSecondary",
} as const;

function DeliverableMarker({ status }: { status: DeliverableStatus }) {
  const Icon =
    status === "done"
      ? CheckCircleRoundedIcon
      : status === "inProgress"
        ? TimelapseRoundedIcon
        : RadioButtonUncheckedRoundedIcon;
  return (
    <Icon
      fontSize="small"
      sx={{ color: statusColors[status], flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}

function CompletionRing({
  progress,
  size = 64,
}: {
  progress: RoadmapProgress;
  size?: number;
}) {
  const { t } = useTranslation("roadmap");
  return (
    <RoadmapProgressRing
      progress={progress}
      size={size}
      label={t("progressLabel", {
        completed: progress.completed,
        total: progress.total,
      })}
    />
  );
}

function StageChip({ stage }: { stage: RoadmapStage }) {
  const { t } = useTranslation("roadmap");
  return (
    <Chip
      size="small"
      variant="outlined"
      label={t(`stages.${stage}`)}
      sx={{
        color: stageColors[stage],
        borderColor: stageColors[stage],
        fontWeight: 700,
      }}
    />
  );
}

const timeline = createRoadmapTimeline(roadmap, roadmapReleases);

export function RoadmapPage() {
  const { t } = useTranslation("roadmap");
  const [expandedFeature, setExpandedFeature] = useState<string | null>(
    "building",
  );
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(
    "building.warbands",
  );
  const overall = getRoadmapProgress(roadmap);

  return (
    <Box component="main">
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <Box
            component="header"
            sx={{
              overflow: "hidden",
              position: "relative",
              p: { xs: 3, sm: 5 },
              border: 1,
              borderColor: "divider",
            }}
          >
            <Stack spacing={2} sx={{ position: "relative" }}>
              <Typography
                component="h1"
                variant="h3"
                sx={{ fontWeight: 900, letterSpacing: "-0.035em" }}
              >
                {t("hero.title")}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ maxWidth: 740, lineHeight: 1.75 }}
              >
                {t("hero.description")}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  alignItems: { sm: "center" },
                }}
              >
                <CompletionRing progress={overall} size={74} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {t("hero.summary")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t("hero.summaryDetails", {
                      completed: overall.completed,
                      total: overall.total,
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Stack
            direction="row"
            useFlexGap
            spacing={2}
            aria-label={t("legend.label")}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {(["done", "inProgress", "planned"] as const).map((status) => (
              <Stack
                direction="row"
                spacing={0.75}
                key={status}
                sx={{ alignItems: "center" }}
              >
                <DeliverableMarker status={status} />
                <Typography variant="caption" color="textSecondary">
                  {t(`statuses.${status}`)}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Box component="section" aria-label={t("timelineLabel")}>
            {timeline.map((item, index) => {
              if (item.kind === "release") {
                return (
                  <RoadmapReleaseMarker
                    key={`release-${item.release.id}`}
                    release={item.release}
                    hasNext={index < timeline.length - 1}
                  />
                );
              }

              const feature = item.feature;
              const Icon = feature.icon;
              const featureProgress = getFeatureProgress(feature);
              return (
                <Box
                  key={feature.id}
                  sx={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: { xs: 1.5, sm: 2.5 },
                  }}
                >
                  <Stack
                    sx={{
                      flexShrink: 0,
                      width: { xs: 40, sm: 56 },
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, sm: 52 },
                        height: { xs: 40, sm: 52 },
                        borderRadius: "50%",
                        border: 2,
                        borderColor: stageColors[feature.stage],
                        bgcolor: "background.paper",
                        color: stageColors[feature.stage],
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Icon aria-hidden="true" />
                    </Box>
                    {index < timeline.length - 1 && (
                      <Box
                        sx={{
                          width: 2,
                          bgcolor: "divider",
                          flexGrow: 1,
                          minHeight: 24,
                        }}
                      />
                    )}
                  </Stack>

                  <Accordion
                    disableGutters
                    expanded={expandedFeature === feature.id}
                    onChange={(_, expanded) =>
                      setExpandedFeature(expanded ? feature.id : null)
                    }
                    sx={{
                      mb: 2.5,
                      flex: 1,
                      minWidth: 0,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: "12px !important",
                      overflow: "hidden",
                      bgcolor: "background.paper",
                      boxShadow: expandedFeature === feature.id ? 2 : 0,
                      "&::before": { display: "none" },
                      "&.Mui-expanded:last-of-type": { mb: 2.5 },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreRoundedIcon />}
                      aria-controls={`roadmap-${feature.id}-content`}
                      id={`roadmap-${feature.id}-header`}
                      sx={{
                        px: { xs: 2, sm: 3 },
                        py: 1.5,
                        "& .MuiAccordionSummary-content": { my: 0 },
                        "& .MuiAccordionSummary-content.Mui-expanded": {
                          my: 0,
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={{ xs: 1.5, sm: 3 }}
                        sx={{ width: "100%", pr: 1, alignItems: "center" }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            sx={{ alignItems: "center", flexWrap: "wrap" }}
                          >
                            <Typography
                              variant="h6"
                              component="h2"
                              sx={{ fontWeight: 800 }}
                            >
                              {t(`features.${feature.id}.title`)}
                            </Typography>
                            <StageChip stage={feature.stage} />
                          </Stack>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 0.5 }}
                          >
                            {t(`features.${feature.id}.description`)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ display: "block", mt: 1 }}
                          >
                            {t("milestoneCount", {
                              count: feature.milestones.length,
                            })}
                          </Typography>
                        </Box>
                        <CompletionRing progress={featureProgress} size={64} />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails
                      id={`roadmap-${feature.id}-content`}
                      sx={{ px: { xs: 1.5, sm: 3 }, pb: 3, pt: 0 }}
                    >
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={1.5}>
                        {feature.milestones.map((milestone) => {
                          const milestoneId = `${feature.id}.${milestone.id}`;
                          const milestoneProgress =
                            getMilestoneProgress(milestone);
                          return (
                            <Accordion
                              key={milestoneId}
                              variant="outlined"
                              disableGutters
                              expanded={expandedMilestone === milestoneId}
                              onChange={(_, expanded) =>
                                setExpandedMilestone(
                                  expanded ? milestoneId : null,
                                )
                              }
                              sx={{
                                borderRadius: "10px !important",
                                overflow: "hidden",
                                boxShadow: "none",
                                "&::before": { display: "none" },
                              }}
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ExpandMoreRoundedIcon fontSize="small" />
                                }
                                aria-controls={`roadmap-${feature.id}-${milestone.id}-content`}
                                id={`roadmap-${feature.id}-${milestone.id}-header`}
                                sx={{
                                  px: { xs: 1.5, sm: 2 },
                                  py: 0.75,
                                  bgcolor: "action.hover",
                                  "& .MuiAccordionSummary-content": { my: 0 },
                                  "& .MuiAccordionSummary-content.Mui-expanded":
                                    { my: 0 },
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  sx={{
                                    width: "100%",
                                    pr: 1,
                                    alignItems: "center",
                                  }}
                                >
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                      variant="subtitle1"
                                      component="h3"
                                      sx={{
                                        fontWeight: 700,
                                      }}
                                    >
                                      {t(
                                        `features.${feature.id}.milestones.${milestone.id}.title`,
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      {t(
                                        `features.${feature.id}.milestones.${milestone.id}.description`,
                                      )}
                                    </Typography>
                                  </Box>
                                  <CompletionRing
                                    progress={milestoneProgress}
                                    size={52}
                                  />
                                </Stack>
                              </AccordionSummary>
                              <AccordionDetails
                                id={`roadmap-${feature.id}-${milestone.id}-content`}
                                sx={{ px: { xs: 2, sm: 3 }, py: 2 }}
                              >
                                <Stack
                                  component="ul"
                                  spacing={1.5}
                                  sx={{ listStyle: "none", p: 0, m: 0 }}
                                >
                                  {milestone.deliverables.map((deliverable) => (
                                    <Stack
                                      component="li"
                                      key={deliverable.id}
                                      direction="row"
                                      spacing={1.5}
                                      sx={{ alignItems: "flex-start" }}
                                    >
                                      <Box sx={{ pt: 0.25 }}>
                                        <DeliverableMarker
                                          status={deliverable.status}
                                        />
                                      </Box>
                                      <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            fontWeight:
                                              deliverable.status ===
                                              "inProgress"
                                                ? 700
                                                : 400,
                                          }}
                                        >
                                          {t(
                                            `features.${feature.id}.milestones.${milestone.id}.deliverables.${deliverable.id}`,
                                          )}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color={
                                            statusColors[deliverable.status]
                                          }
                                        >
                                          {t(`statuses.${deliverable.status}`)}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  ))}
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            })}
          </Box>
          <Typography color="textSecondary" variant="body2" sx={{ pb: 2 }}>
            {t("disclaimer")}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
