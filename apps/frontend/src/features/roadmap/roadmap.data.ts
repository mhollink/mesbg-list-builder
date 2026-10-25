import type { SvgIconComponent } from "@mui/icons-material";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export type DeliverableStatus = "done" | "inProgress" | "planned";
export type RoadmapStage = "available" | "active" | "future";

export interface RoadmapDeliverable {
  id: string;
  status: DeliverableStatus;
}

export interface RoadmapMilestone {
  id: string;
  deliverables: readonly RoadmapDeliverable[];
}

export interface RoadmapFeature {
  id: string;
  stage: RoadmapStage;
  icon: SvgIconComponent;
  milestones: readonly RoadmapMilestone[];
}

// Public commitments live here, separately from translated descriptions.
// A deliverable is only "done" once available to users, not when work starts.
// Feature order describes the product journey, not promised release dates.
export const roadmap: readonly RoadmapFeature[] = [
  {
    id: "reference",
    stage: "available",
    icon: AutoStoriesOutlinedIcon,
    milestones: [
      {
        id: "rules",
        deliverables: [
          { id: "browse", status: "done" },
          { id: "search", status: "done" },
          { id: "details", status: "done" },
          { id: "navigate", status: "done" },
        ],
      },
      {
        id: "profiles",
        deliverables: [
          { id: "browse", status: "done" },
          { id: "details", status: "done" },
          { id: "navigate", status: "done" },
          { id: "source", status: "done" },
          { id: "cards", status: "planned" },
        ],
      },
      {
        id: "armies",
        deliverables: [
          { id: "browse", status: "done" },
          { id: "details", status: "done" },
          { id: "finder", status: "done" },
          { id: "create", status: "done" },
          { id: "special", status: "planned" },
        ],
      },
      {
        id: "lookup",
        deliverables: [
          { id: "search", status: "planned" },
          { id: "details", status: "planned" },
        ],
      },
    ],
  },
  {
    id: "building",
    stage: "active",
    icon: ShieldOutlinedIcon,
    milestones: [
      {
        id: "rosters",
        deliverables: [
          { id: "manage", status: "inProgress" },
          { id: "organize", status: "done" },
          { id: "move", status: "done" },
          { id: "favorite", status: "done" },
          { id: "summarize", status: "done" },
          { id: "icons", status: "planned" },
          { id: "search", status: "planned" },
          { id: "sort", status: "planned" },
          { id: "duplicate", status: "planned" },
        ],
      },
      {
        id: "warbands",
        deliverables: [
          { id: "create", status: "done" },
          { id: "units", status: "inProgress" },
          { id: "reorder", status: "done" },
          { id: "duplicate", status: "inProgress" },
          { id: "edge-cases", status: "planned" },
        ],
      },
      {
        id: "options",
        deliverables: [
          { id: "equipment", status: "done" },
          { id: "preselected", status: "done" },
          { id: "restrictions", status: "inProgress" },
          { id: "upgrades", status: "planned" },
          { id: "army", status: "planned" },
          { id: "combinations", status: "planned" },
        ],
      },
      {
        id: "rules",
        deliverables: [
          { id: "general", status: "done" },
          { id: "leaders", status: "done" },
          { id: "fixed-general", status: "planned" },
          { id: "tier-general", status: "planned" },
        ],
      },
      {
        id: "validation",
        deliverables: [
          { id: "capacity", status: "done" },
          { id: "requirements", status: "inProgress" },
          { id: "limits", status: "planned" },
          { id: "unique", status: "inProgress" },
          { id: "min-max", status: "planned" },
          { id: "required", status: "planned" },
          { id: "special", status: "planned" },
          { id: "explanations", status: "planned" },
          { id: "review", status: "planned" },
        ],
      },
      {
        id: "share",
        deliverables: [
          { id: "image", status: "planned" },
          { id: "pdf", status: "planned" },
          { id: "cards", status: "planned" },
          { id: "link", status: "planned" },
          { id: "tts", status: "planned" },
          { id: "text", status: "planned" },
        ],
      },
    ],
  },
  {
    id: "collection",
    stage: "future",
    icon: Inventory2OutlinedIcon,
    milestones: [
      {
        id: "inventory",
        deliverables: [
          { id: "models", status: "planned" },
          { id: "equipment", status: "planned" },
          { id: "wishlist", status: "planned" },
        ],
      },
      {
        id: "coverage",
        deliverables: [
          { id: "plan", status: "planned" },
          { id: "compare", status: "planned" },
          { id: "missing", status: "planned" },
        ],
      },
    ],
  },
  {
    id: "games",
    stage: "future",
    icon: CasinoOutlinedIcon,
    milestones: [
      {
        id: "sessions",
        deliverables: [
          { id: "start", status: "planned" },
          { id: "resume", status: "planned" },
          { id: "scenarios", status: "planned" },
          { id: "finish", status: "planned" },
        ],
      },
      {
        id: "tracking",
        deliverables: [
          { id: "casualties", status: "planned" },
          { id: "breakpoints", status: "planned" },
          { id: "expendables", status: "planned" },
          { id: "references", status: "planned" },
        ],
      },
      {
        id: "scenarios",
        deliverables: [
          { id: "phases", status: "planned" },
          { id: "objectives", status: "planned" },
          { id: "scoring", status: "planned" },
        ],
      },
      {
        id: "connected",
        deliverables: [
          { id: "invites", status: "planned" },
          { id: "synchronize", status: "planned" },
          { id: "reconnect", status: "planned" },
          { id: "resolve", status: "planned" },
        ],
      },
      {
        id: "results",
        deliverables: [
          { id: "outcomes", status: "planned" },
          { id: "inspect", status: "planned" },
          { id: "notes", status: "planned" },
        ],
      },
      {
        id: "statistics",
        deliverables: [
          { id: "trends", status: "planned" },
          { id: "army-performance", status: "planned" },
          { id: "opponents", status: "planned" },
          { id: "scenarios", status: "planned" },
        ],
      },
      {
        id: "discovery",
        deliverables: [
          { id: "nearby-players", status: "planned" },
          { id: "local-groups", status: "planned" },
          { id: "looking-for-game", status: "planned" },
        ],
      },
    ],
  },
  {
    id: "companies",
    stage: "future",
    icon: Diversity3OutlinedIcon,
    milestones: [
      {
        id: "roster",
        deliverables: [
          { id: "create", status: "planned" },
          { id: "members", status: "planned" },
        ],
      },
      {
        id: "progression",
        deliverables: [
          { id: "experience", status: "planned" },
          { id: "aftermath", status: "planned" },
        ],
      },
      {
        id: "campaign",
        deliverables: [
          { id: "history", status: "planned" },
          { id: "rewards", status: "planned" },
        ],
      },
    ],
  },
];
