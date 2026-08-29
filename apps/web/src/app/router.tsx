import { createBrowserRouter, Navigate } from "react-router";

import { FeaturePagePlaceholder } from "../components/FeaturePagePlaceholder.tsx";
import { NotFoundPage } from "../components/NotFoundPage.tsx";
import { FeedbackPage } from "../features/about-help/FeedbackPage.tsx";
import { PoliciesPage } from "../features/about-help/PoliciesPage.tsx";
import { SupportPage } from "../features/about-help/SupportPage.tsx";
import { HomePage } from "../features/home/HomePage.tsx";
import { AccessibilitySettings } from "../features/settings/components/accessibility/AccessibilitySettings.tsx";
import { AccountSettings } from "../features/settings/components/account/AccountSettings.tsx";
import { AppearanceSettings } from "../features/settings/components/appearance/AppearanceSettings.tsx";
import { DataAndSyncSettings } from "../features/settings/components/data-sync/DataAndSyncSettings.tsx";
import { ExportSettings } from "../features/settings/components/export/ExportSettings.tsx";
import { GeneralSettings } from "../features/settings/components/general/GeneralSettings.tsx";
import { PrivacySettings } from "../features/settings/components/privacy/PrivacySettings.tsx";
import { SettingsPage } from "../features/settings/SettingsPage.tsx";
import { AppLayout } from "./AppLayout.tsx";
import { RulesPage } from "~/features/reference/rules/RulesPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "search",
        element: (
          <FeaturePagePlaceholder
            title="Search"
            description="Search through MESBG content."
          />
        ),
      },

      {
        path: "armies",
        children: [
          {
            index: true,
            element: <Navigate to="rosters" replace />,
          },
          {
            path: "rosters",
            element: (
              <FeaturePagePlaceholder
                title="Rosters"
                description="Create and manage army lists."
              />
            ),
          },
          {
            path: "rosters/new",
            element: (
              <FeaturePagePlaceholder
                title="New roster"
                description="Create a new army list"
              />
            ),
          },
          {
            path: "rosters/:rosterId",
            element: (
              <FeaturePagePlaceholder
                title="Roster"
                description="See and update a roster"
              />
            ),
          },
          {
            path: "collection",
            element: (
              <FeaturePagePlaceholder
                title="Collection"
                description="Manage your miniature collection."
              />
            ),
          },
        ],
      },

      {
        path: "play",
        children: [
          {
            index: true,
            element: <Navigate to="games" replace />,
          },
          {
            path: "find-game",
            element: (
              <FeaturePagePlaceholder
                title="Find a game"
                description="Find players and games near you."
              />
            ),
          },
          {
            path: "battle-companies",
            element: <FeaturePagePlaceholder title="Battle Companies" />,
          },
          {
            path: "games",
            element: (
              <FeaturePagePlaceholder
                title="Games"
                description="View and manage your games."
              />
            ),
          },
          {
            path: "tournaments",
            element: <FeaturePagePlaceholder title="Tournaments" />,
          },
        ],
      },

      {
        path: "reference",
        children: [
          {
            index: true,
            element: <Navigate to="rules" replace />,
          },
          {
            path: "rules",
            element: <RulesPage />,
          },
          {
            path: "profiles",
            element: (
              <FeaturePagePlaceholder
                title="Profiles"
                description="Browse model profiles."
              />
            ),
          },
        ],
      },

      {
        path: "settings",
        element: <SettingsPage />,
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />,
          },
          {
            path: "general",
            element: <GeneralSettings />,
          },
          {
            path: "appearance",
            element: <AppearanceSettings />,
          },
          {
            path: "accessibility",
            element: <AccessibilitySettings />,
          },
          {
            path: "export",
            element: <ExportSettings />,
          },
          {
            path: "account",
            element: <AccountSettings />,
          },
          {
            path: "data",
            element: <DataAndSyncSettings />,
          },
          {
            path: "privacy",
            element: <PrivacySettings />,
          },
        ],
      },

      {
        path: "feedback",
        element: <FeedbackPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
      {
        path: "policies",
        element: <PoliciesPage />,
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
