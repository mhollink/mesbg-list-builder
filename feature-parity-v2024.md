# MESBG List Builder v2024 Feature Parity Checklist

> Working checklist for rebuilding `mesbg-list-builder-v2024` in the new `mesbg-list-builder` repository.
>
> Last audited: 2026-09-11  
> v2024 baseline commit: `cfabe7a8945f7fcbef313201d82c9465360834eb`  
> Rewrite audit commit: `07fa9bf1df2007c5096b4ee2f91a3554d87d7931`

## Purpose

This document tracks **feature parity**, not implementation parity.

The rewrite does **not** need to preserve the old architecture. In particular:

- Moving the backend into the same repository is an architectural change and is not a parity gap.
- Replacing the Python data-generation scripts with TypeScript is an architectural change and is not a parity gap.
- Replacing old pages, drawers, routes, state libraries, APIs, or UI patterns with redesigned equivalents is acceptable.
- A feature counts as parity when the user can achieve the same outcome and the important MESBG behaviour is preserved.
- New functionality in the rewrite does not need to be finished before v2024 parity is reached unless an old feature depends on it.

The objective is simple:

> **Feature parity is reached when every v2024 capability in this document is either `PARITY`, `CHANGED-EQUIVALENT`, or deliberately `INTENTIONALLY REMOVED`, with no unresolved `MISSING`, `IN PROGRESS`, or `NEEDS VERIFICATION` items in the parity-required sections.**

## Source of truth

Primary sources used for this audit:

- Old repository: <https://github.com/mhollink/mesbg-list-builder-v2024>
- Old site: <https://v2024.mesbg-list-builder.com>
- Rewrite repository: <https://github.com/mhollink/mesbg-list-builder>
- v2024 route definitions, page/components, state stores, modals, drawers, data pipeline, and `CHANGELOG.json`
- Rewrite router and currently implemented feature pages

The v2024 codebase and changelog are the main source of truth for this checklist. Before declaring parity complete, do one final manual pass through the old live application for any interaction that may not be obvious from the source.

---

## Status legend

| Status | Meaning | Counts as resolved? |
| --- | --- | --- |
| `MISSING` | Exists in v2024 but has no working equivalent in the rewrite | No |
| `IN PROGRESS` | Some or most of the replacement exists but parity is incomplete | No |
| `NEEDS VERIFICATION` | It may already exist, but equivalence has not been proven | No |
| `PARITY` | Behaviour is materially equivalent to v2024 | Yes |
| `CHANGED-EQUIVALENT` | Reimplemented differently but satisfies the same user need | Yes |
| `INTENTIONALLY REMOVED` | Deliberately not carried over, with rationale documented | Yes |
| `NEW` | Rewrite-only scope. Does not block v2024 parity | Not applicable |

Checkbox convention:

- `[x]` means this item currently counts as resolved for parity.
- `[ ]` means work or verification remains.
- Keep an item in the document after completion and update its status rather than deleting it.

---

# Current high-level assessment

| Area | Initial assessment |
| --- | --- |
| Application shell and navigation | `IN PROGRESS` |
| Rosters and roster organisation | `MISSING` |
| Roster builder | `MISSING` |
| List validation and calculations | `MISSING` |
| Sharing, exports, printable output | `MISSING` |
| Profiles and rules reference | `IN PROGRESS` / `CHANGED-EQUIVALENT` |
| Collection | `MISSING` |
| Game Mode | `MISSING` |
| Match History | `MISSING` |
| Accounts and sync | `NEEDS VERIFICATION` |
| Settings and preferences | `IN PROGRESS` |
| Data pipeline and data semantics | `IN PROGRESS` / `NEEDS VERIFICATION` |
| Community and informational pages | `IN PROGRESS` |
| Cross-cutting UX and resilience | `IN PROGRESS` |
| Rewrite-only features | `NEW`, non-blocking |

---

# APP - Application shell and navigation

- [x] **APP-001 - Application shell and home route** `CHANGED-EQUIVALENT`
  - v2024 has a home page inside the main application shell.
  - The rewrite has a real `HomePage`.
  - Parity does not require reproducing the old layout.

- [ ] **APP-002 - Responsive primary navigation** `IN PROGRESS`
  - Users must be able to reach all parity-required areas on desktop and mobile.
  - Verify collapsed/mobile navigation behaviour when the parity features are added.

- [ ] **APP-003 - Roster navigation hierarchy** `MISSING`
  - v2024 exposes roster groups and optionally individual rosters from navigation.
  - Replacement may use the new information architecture, but fast access to roster groups/rosters must remain practical.

- [ ] **APP-004 - Ongoing-game indicator in roster navigation** `MISSING`
  - v2024 marks rosters that currently have a Game Mode session in progress.
  - Equivalent status visibility may live somewhere other than the sidebar.

- [ ] **APP-005 - Hide individual rosters from navigation preference** `MISSING`
  - v2024 lets users reduce navigation clutter while retaining group navigation.
  - May be intentionally removed if the new navigation makes the preference unnecessary. If so, mark `INTENTIONALLY REMOVED` and record the replacement UX.

- [ ] **APP-006 - Quick profile lookup from anywhere** `IN PROGRESS`
  - v2024 provides a Profiles drawer for quick lookup.
  - The rewrite has a full Profiles reference page.
  - Verify a sufficiently quick global lookup path exists without forcing users through multiple screens.

- [ ] **APP-007 - Quick rules, magic, and heroic-action lookup from anywhere** `IN PROGRESS`
  - v2024 provides a combined drawer for Special Rules, Magical Powers, and Heroic Actions.
  - The rewrite has the Rules reference feature.
  - Verify global access and drawer/search replacement behaviour.

- [ ] **APP-008 - Reference charts/tables access** `MISSING`
  - v2024 exposes common MESBG charts from navigation.
  - See `REF-020` through `REF-030`.

- [x] **APP-009 - Feedback / bug reporting entry point** `CHANGED-EQUIVALENT`
  - v2024 uses a mail link for bug/correction reports.
  - The rewrite has a dedicated Feedback page.
  - Verify it remains easy to report both application bugs and data/rule corrections.

- [ ] **APP-010 - FAQ and Errata external access** `NEEDS VERIFICATION`
  - v2024 includes direct access to FAQs and Errata.
  - Keep an obvious route to the official/current source.

- [x] **APP-011 - Not-found page** `CHANGED-EQUIVALENT`
  - The rewrite has a dedicated `NotFoundPage`.

- [ ] **APP-012 - Feature-specific missing-resource states** `MISSING`
  - v2024 distinguishes cases such as roster-not-found and no-game-started.
  - Deep links to a deleted/nonexistent roster, game, shared roster, or printable roster should fail gracefully.

- [ ] **APP-013 - Deep-link support** `IN PROGRESS`
  - Direct URLs to nested feature state must load correctly after refresh.
  - Includes profiles/rules, roster pages, groups, shared rosters, and game-related pages where applicable.

- [ ] **APP-014 - Browser history for transient UI state** `IN PROGRESS`
  - Back navigation should respect drawer stacks and tab changes where those states are represented in the URL/history.
  - Particularly important on mobile swipe-back.

- [ ] **APP-015 - Changelog access** `NEEDS VERIFICATION`
  - v2024 exposes changelog both as a route and from settings.
  - The rewrite already maintains `CHANGELOG.md`; verify an in-app equivalent is desired.

- [ ] **APP-016 - Version/build information in the UI** `NEEDS VERIFICATION`
  - v2024 settings show the build version and last-updated date.
  - Decide whether this remains user-facing.

---

# ROS - Rosters and roster organisation

## Roster lifecycle

- [ ] **ROS-001 - Create a roster** `MISSING`
  - User can create a roster from the Rosters area.

- [ ] **ROS-002 - Optional roster name with sensible default** `MISSING`
  - v2024 allows creation without entering a custom name.

- [ ] **ROS-003 - Select an army list during creation** `MISSING`
  - Selection must use the new army-list data model.

- [ ] **ROS-004 - Search army lists by army-list name** `MISSING`
  - Creation flow must remain usable with a large number of lists.

- [ ] **ROS-005 - Search army lists by hero name** `MISSING`
  - v2024 allows searching for a hero and choosing an army list that contains that hero.

- [ ] **ROS-006 - Auto-add searched hero when creating from hero search** `MISSING`
  - If the user creates a roster through a hero search result, that hero is added to the created roster.

- [ ] **ROS-007 - Create unrestricted custom Good roster** `MISSING`
  - v2024 supports custom Good rosters outside normal army-list restrictions.

- [ ] **ROS-008 - Create unrestricted custom Evil roster** `MISSING`
  - v2024 supports custom Evil rosters outside normal army-list restrictions.

- [ ] **ROS-009 - Open and edit an existing roster** `MISSING`

- [ ] **ROS-010 - Rename roster** `MISSING`

- [ ] **ROS-011 - Edit roster metadata** `MISSING`
  - Includes at least name, army-list-related metadata, tags, point limit, and other retained roster configuration.

- [ ] **ROS-012 - Change army list while editing roster** `MISSING`
  - v2024 permits this but clears the existing roster because selections may no longer be valid.
  - Replacement must make this destructive consequence explicit.

- [ ] **ROS-013 - Delete roster with confirmation** `MISSING`

- [ ] **ROS-014 - Bulk-delete rosters** `MISSING`

- [ ] **ROS-015 - Duplicate roster** `MISSING`
  - Duplicate must receive independent IDs and remain independently editable and synchronisable.

- [ ] **ROS-016 - Import roster** `MISSING`
  - See also the backwards-compatibility requirements under `OUT` and `DATA`.

- [ ] **ROS-017 - Export roster from the roster list or editor** `MISSING`
  - Detailed export behaviour is tracked under `OUT`.

## Finding and sorting rosters

- [ ] **ROS-018 - Basic roster text search** `MISSING`
  - Search at least name and army list.

- [ ] **ROS-019 - Advanced roster query syntax or equivalent filtering** `MISSING`
  - v2024 supports expressions over fields such as type, army, name, points, units, bows, throwing weapons, Might, Will, Fate, and tags.
  - The exact query language does not need to survive if the redesigned filters provide equivalent power.

- [ ] **ROS-020 - Roster tags** `MISSING`
  - Tags can be stored and used to find lists.

- [ ] **ROS-021 - Sort rosters by name** `MISSING`

- [ ] **ROS-022 - Sort rosters by army list** `MISSING`

- [ ] **ROS-023 - Sort rosters by points** `MISSING`

- [ ] **ROS-024 - Sort rosters by unit count** `MISSING`

- [ ] **ROS-025 - Filter/sort with roster groups present** `MISSING`
  - Grouped rosters must not disappear or become impossible to find when sorting/filtering.

## Roster groups

- [ ] **ROS-026 - Create an empty roster group** `MISSING`

- [ ] **ROS-027 - Name roster groups** `MISSING`

- [ ] **ROS-028 - Allow groups with duplicate display names** `MISSING`
  - Internal identity must not depend on display-name uniqueness.

- [ ] **ROS-029 - Select an icon for a roster group** `MISSING`

- [ ] **ROS-030 - Rename/update roster group** `MISSING`

- [ ] **ROS-031 - Move roster into a group** `MISSING`

- [ ] **ROS-032 - Move roster out of a group** `MISSING`

- [ ] **ROS-033 - Create nested groups** `MISSING`
  - v2024 supports parent-child group relationships.

- [ ] **ROS-034 - Move groups between nesting levels** `MISSING`

- [ ] **ROS-035 - Group breadcrumbs** `MISSING`
  - Users can understand and navigate the current nested group location.

- [ ] **ROS-036 - Disband group while preserving rosters** `MISSING`
  - **Acceptance:** removing the group leaves contained rosters intact and ungrouped/reparented appropriately.

- [ ] **ROS-037 - Delete group together with contained rosters** `MISSING`
  - **Acceptance:** this remains semantically distinct from disbanding and requires an appropriately strong confirmation.

- [ ] **ROS-038 - Drag and drop roster grouping** `MISSING`
  - Exact interaction may change, but quick reorganisation must remain available.

- [ ] **ROS-039 - Drag and drop nested group organisation** `MISSING`

- [ ] **ROS-040 - Lock roster-page drag and drop** `MISSING`
  - v2024 supports disabling drag/drop to avoid accidental changes, especially on touch devices.

- [ ] **ROS-041 - Persist roster-page drag/drop lock** `MISSING`

- [ ] **ROS-042 - Import roster into the currently opened group** `MISSING`
  - v2024 preserves the user's current group context when importing.

## Roster-card actions

- [ ] **ROS-043 - Open roster builder from roster card** `MISSING`

- [ ] **ROS-044 - Start Game Mode from roster card/menu** `MISSING`

- [ ] **ROS-045 - Open roster summary from roster card/menu** `MISSING`

- [ ] **ROS-046 - Expose ongoing-game state on roster card/navigation** `MISSING`

- [ ] **ROS-047 - Empty-state creation/import guidance** `MISSING`

---

# BLD - Roster builder

## Warband lifecycle

- [ ] **BLD-001 - Display roster as ordered warbands** `MISSING`

- [ ] **BLD-002 - Add a new warband** `MISSING`
  - New warband creation should immediately lead into leader selection.

- [ ] **BLD-003 - Number warbands sequentially** `MISSING`

- [ ] **BLD-004 - Renumber warbands after deletion/reordering** `MISSING`

- [ ] **BLD-005 - Delete a warband** `MISSING`

- [ ] **BLD-006 - Reset/empty a compulsory-general warband instead of illegally deleting it** `MISSING`

- [ ] **BLD-007 - Duplicate a warband** `MISSING`
  - Unique models must not be duplicated illegally.

- [ ] **BLD-008 - Reorder whole warbands** `MISSING`

- [ ] **BLD-009 - Collapse/expand individual warband** `MISSING`

- [ ] **BLD-010 - Collapse/expand all warbands** `MISSING`

- [ ] **BLD-011 - Preserve usable mutation controls on compact/mobile layouts** `MISSING`
  - v2024 has a preference to keep mutation buttons visible when collapsed.
  - The redesigned UI may solve this without a preference.

## Leader and follower selection

- [ ] **BLD-012 - Select/change warband leader** `MISSING`

- [ ] **BLD-013 - Restrict available leaders to the selected army list** `MISSING`

- [ ] **BLD-014 - Select/change follower units** `MISSING`

- [ ] **BLD-015 - Restrict follower choices per leader** `MISSING`
  - Must be driven by army-list/profile-specific warband rules, not only generic heroic tier.

- [ ] **BLD-016 - Add empty follower slot and immediately open selection** `MISSING`

- [ ] **BLD-017 - Remove follower unit** `MISSING`

- [ ] **BLD-018 - Duplicate follower unit** `MISSING`

- [ ] **BLD-019 - Increment/decrement unit quantity where valid** `MISSING`

- [ ] **BLD-020 - Support multiple instances of eligible non-unique heroes as followers** `MISSING`

- [ ] **BLD-021 - Reorder models inside a warband** `MISSING`

- [ ] **BLD-022 - Move models between warbands** `MISSING`
  - Revalidate the destination warband and recalculate all totals.

- [ ] **BLD-023 - Invalid-follower visual state after leader changes** `MISSING`
  - v2024 shows clearly when changing a leader makes existing followers invalid.

- [ ] **BLD-024 - Lock/disable builder drag and drop** `MISSING`
  - Important for touch/mobile navigation.

## Warband capacity

- [ ] **BLD-025 - Heroic-tier warband capacity** `MISSING`

- [ ] **BLD-026 - Army/profile-specific warband-size overrides** `MISSING`

- [ ] **BLD-027 - Show current/max follower count** `MISSING`

- [ ] **BLD-028 - Highlight over-capacity warbands** `MISSING`

- [ ] **BLD-029 - Show max-unit indicator on add-unit control** `MISSING`

## Options and upgrades

- [ ] **BLD-030 - Render profile options with point costs** `MISSING`

- [ ] **BLD-031 - Included/preselected options** `MISSING`
  - Included options cannot be removed when the source rules make them compulsory.

- [ ] **BLD-032 - Mandatory option selection** `MISSING`

- [ ] **BLD-033 - Option dependencies** `MISSING`
  - Availability can depend on another selected/included option.

- [ ] **BLD-034 - Mutually exclusive options** `MISSING`

- [ ] **BLD-035 - Combined options where army/list context permits them** `MISSING`
  - Required for custom-list kitbash cases such as combined equipment.

- [ ] **BLD-036 - Exchange options** `MISSING`
  - Example class: exchange armour for heavy armour, staff for mount, etc.

- [ ] **BLD-037 - Mount options** `MISSING`

- [ ] **BLD-038 - Armoured/named mount variants** `MISSING`

- [ ] **BLD-039 - Profile-specific unit upgrades** `MISSING`
  - Example class: Helmingas/Hearthguard style upgrades.

- [ ] **BLD-040 - Special warband upgrades alongside normal equipment** `MISSING`

- [ ] **BLD-041 - Ringwraith-style variable A/M/W/F options** `MISSING`

- [ ] **BLD-042 - Options may alter stats dynamically** `MISSING`
  - Fight, Shoot, Strength, Defence, Attacks, Wounds, Courage, Intelligence and heroic resources must reflect applicable option effects.

- [ ] **BLD-043 - Options may alter point cost dynamically** `MISSING`

- [ ] **BLD-044 - Options may alter model count dynamically** `MISSING`
  - Needed for composed models/passengers/war beasts and similar profiles.

- [ ] **BLD-045 - Options may add/remove rules dynamically** `MISSING`

- [ ] **BLD-046 - List-specific option overrides** `MISSING`
  - Same base profile may expose different option availability, defaults, names, or costs in different army lists.

- [ ] **BLD-047 - Preselected option upgrade path** `MISSING`
  - Support cases where an army list preselects a base option and exposes only an incremental upgrade variant.

## Army general and special roster configuration

- [ ] **BLD-048 - Select army general** `MISSING`

- [ ] **BLD-049 - Mandatory army general rules** `MISSING`

- [ ] **BLD-050 - Preference to allow removal/replacement of compulsory general** `MISSING`
  - Used for tournament formats that relax normal list-building requirements.

- [ ] **BLD-051 - Points limit per roster** `MISSING`

- [ ] **BLD-052 - Warn when point limit is exceeded** `MISSING`

- [ ] **BLD-053 - Add extra points for breakpoint/summary calculations** `MISSING`
  - Tournament helper for free/bonus models or points.

- [ ] **BLD-054 - Add extra units for breakpoint/summary calculations** `MISSING`

- [ ] **BLD-055 - Siege roster mode** `MISSING`

- [ ] **BLD-056 - Add siege equipment in siege mode** `MISSING`

- [ ] **BLD-057 - Siege equipment selection restrictions and points** `MISSING`

## Automatic list construction helpers

- [ ] **BLD-058 - Automatically add mandatory units/warbands** `MISSING`

- [ ] **BLD-059 - Automatically construct paired-hero warbands where required** `MISSING`
  - v2024 explicitly handles paired profiles such as Elladan/Elrohir and Murin/Drar.

- [ ] **BLD-060 - Army-specific automatic warband helpers** `MISSING`
  - Keep the capability for lists whose rules require specific automatically-created compositions.

- [ ] **BLD-061 - Custom Good/Evil lists bypass normal army-list restrictions** `MISSING`

## Builder supporting UI

- [ ] **BLD-062 - Roster information panel/drawer** `MISSING`

- [ ] **BLD-063 - Mobile roster information toolbar** `MISSING`
  - Equivalent persistent visibility of points, size, and limit information is acceptable.

- [ ] **BLD-064 - Sticky roster-warning toolbar on small screens** `MISSING`

- [ ] **BLD-065 - Breadcrumbs back to roster group/list** `MISSING`

- [ ] **BLD-066 - Start Game Mode from builder** `MISSING`

- [ ] **BLD-067 - Undo builder mutation** `MISSING`
  - v2024 keeps up to 20 temporal roster states.

- [ ] **BLD-068 - Redo builder mutation** `MISSING`

- [ ] **BLD-069 - Keyboard undo/redo** `MISSING`
  - v2024 supports Ctrl+Z, Ctrl+Y and Ctrl+Shift+Z.

- [ ] **BLD-070 - Clear/reset undo history when switching roster** `MISSING`

---

# VAL - Validation, legality, and derived calculations

These are behavioural parity requirements. They are more important than copying the old implementation.

- [ ] **VAL-001 - Recalculate total points after every relevant change** `MISSING`

- [ ] **VAL-002 - Recalculate total model/unit count** `MISSING`

- [ ] **VAL-003 - Recalculate total Might** `MISSING`

- [ ] **VAL-004 - Recalculate total Will** `MISSING`

- [ ] **VAL-005 - Recalculate total Fate** `MISSING`

- [ ] **VAL-006 - Recalculate bow count and bow-limit denominator** `MISSING`

- [ ] **VAL-007 - Apply army-specific bow-limit percentage/rules** `MISSING`

- [ ] **VAL-008 - Recalculate throwing-weapon count and limit** `MISSING`

- [ ] **VAL-009 - Apply army-specific throwing-weapon rules** `MISSING`

- [ ] **VAL-010 - Correct breakpoint semantics** `MISSING`
  - Preserve MESBG "more than 50%" semantics and army-list-specific breakpoint overrides.

- [ ] **VAL-011 - Correct quartered/25-percent calculation** `MISSING`

- [ ] **VAL-012 - Apply extra-units adjustment to breakpoint/quartered calculations** `MISSING`

- [ ] **VAL-013 - Apply extra-points adjustment where displayed/calculated** `MISSING`

- [ ] **VAL-014 - Validate warband size** `MISSING`

- [ ] **VAL-015 - Validate leader/follower compatibility** `MISSING`

- [ ] **VAL-016 - Validate unique-model limits** `MISSING`

- [ ] **VAL-017 - Validate profile/list-specific maximum counts** `MISSING`

- [ ] **VAL-018 - Validate mandatory units** `MISSING`

- [ ] **VAL-019 - Validate compulsory general** `MISSING`

- [ ] **VAL-020 - Validate general heroic-tier restrictions** `MISSING`

- [ ] **VAL-021 - Validate mandatory/preselected options** `MISSING`

- [ ] **VAL-022 - Validate option dependencies and exclusions** `MISSING`

- [ ] **VAL-023 - Validate army-specific warnings** `MISSING`
  - Warning system must remain data-driven enough to support one-off army-list constraints.

- [ ] **VAL-024 - Validate siege-engine/equipment restrictions** `MISSING`

- [ ] **VAL-025 - Validate roster point limit** `MISSING`

- [ ] **VAL-026 - Collection-based availability warnings** `MISSING`

- [ ] **VAL-027 - Warnings remain visible while scrolling long rosters** `MISSING`

- [ ] **VAL-028 - Army-list additional/special rules contribute to roster behaviour** `MISSING`

- [ ] **VAL-029 - Selected options contribute the correct special rules** `MISSING`

- [ ] **VAL-030 - Selected options affect PDF/Game Mode stats identically to builder stats** `MISSING`

- [ ] **VAL-031 - Composed models/passengers/war beasts count correctly** `MISSING`
  - Unit totals, bows, throwing weapons, trackers, collection use, and breakpoint calculations must agree.

- [ ] **VAL-032 - Legacy content is distinguishable where relevant** `MISSING`

- [ ] **VAL-033 - Representative regression test matrix for army-specific exceptions** `MISSING`
  - Do not port historical bugs one by one.
  - Instead create fixtures for representative complex lists and rules so the new model proves it can express the same classes of restriction.

---

# OUT - Sharing, exports, printable output, and interoperability

## Roster import/export

- [ ] **OUT-001 - Machine-readable roster export** `MISSING`

- [ ] **OUT-002 - Export includes enough metadata for correct re-import** `MISSING`
  - Version, army/list identity, options, quantities, group metadata where appropriate, and derived configuration must round-trip safely.

- [ ] **OUT-003 - Import exported roster on same device** `MISSING`

- [ ] **OUT-004 - Import exported roster on another device** `MISSING`

- [ ] **OUT-005 - Old v2024 export migration/import strategy** `MISSING`
  - Prefer directly importing a representative set of v2024 exports.
  - If direct compatibility is intentionally dropped, provide and document a migration path before calling parity complete.

- [ ] **OUT-006 - Invalid/unsupported import gives actionable error** `MISSING`

## Roster summary and sharing

- [ ] **OUT-007 - Human-readable roster summary** `MISSING`

- [ ] **OUT-008 - Modern visual roster summary** `MISSING`

- [ ] **OUT-009 - Plain-text roster summary** `MISSING`
  - Must paste cleanly into text-centric destinations such as Reddit/forums/chat.

- [ ] **OUT-010 - Save roster summary as image/screenshot** `MISSING`

- [ ] **OUT-011 - Legacy/simple black-and-white summary mode or explicit replacement decision** `MISSING`
  - v2024 retains the old v2018 table as a preference.
  - Can be `INTENTIONALLY REMOVED` if the new summary fully replaces the need.

- [ ] **OUT-012 - Public/shared roster URL** `MISSING`
  - v2024 supports `/shared/roster/:sid`.
  - Shared view must not expose private account data.

- [ ] **OUT-013 - Shared roster works without owning/editing the roster** `MISSING`

- [ ] **OUT-014 - Legacy-model indicator in summary** `MISSING`

## Tabletop Simulator

- [ ] **OUT-015 - Tabletop Simulator text export** `MISSING`

- [ ] **OUT-016 - TTS option-name mappings** `MISSING`

- [ ] **OUT-017 - Stable, deterministic TTS option ordering** `MISSING`

- [ ] **OUT-018 - Copy TTS export text to clipboard** `MISSING`

## Profile-card downloads

- [ ] **OUT-019 - Download profile cards used by roster** `MISSING`

- [ ] **OUT-020 - Include additional/alternate profile cards when required** `MISSING`

- [ ] **OUT-021 - Exclude non-profile entries such as siege equipment where appropriate** `MISSING`

## Printable roster / PDF via browser print

- [ ] **OUT-022 - Dedicated printable roster view** `MISSING`

- [ ] **OUT-023 - Print output remains black-on-white regardless of application theme** `MISSING`

- [ ] **OUT-024 - Quick reference section** `MISSING`

- [ ] **OUT-025 - Army composition section** `MISSING`

- [ ] **OUT-026 - Army composition includes points values** `MISSING`

- [ ] **OUT-027 - Profiles section** `MISSING`

- [ ] **OUT-028 - Selected options reflected in printable profile stats** `MISSING`

- [ ] **OUT-029 - Special Rules section** `MISSING`

- [ ] **OUT-030 - Army special/additional rules section** `MISSING`

- [ ] **OUT-031 - Heroic Actions section** `MISSING`

- [ ] **OUT-032 - Magical Powers section** `MISSING`

- [ ] **OUT-033 - Magical Powers identify their caster(s)** `MISSING`

- [ ] **OUT-034 - Might/Will/Fate trackers** `MISSING`

- [ ] **OUT-035 - Multi-wound trackers** `MISSING`

- [ ] **OUT-036 - Conditional rules/options only appear when applicable** `MISSING`

- [ ] **OUT-037 - Sensible print page breaks** `MISSING`

- [ ] **OUT-038 - Preference to remove/disable page breaks** `MISSING`

- [ ] **OUT-039 - Ability to hide selected PDF sections** `MISSING`

- [ ] **OUT-040 - Include full Special Rule descriptions per profile when requested** `MISSING`

- [ ] **OUT-041 - Include full Heroic Action descriptions per profile when requested** `MISSING`

- [ ] **OUT-042 - Printable route handles missing roster gracefully** `MISSING`

---

# REF - Profiles, rules, and reference material

## Profiles

- [x] **REF-001 - Browse profiles** `CHANGED-EQUIVALENT`
  - Rewrite has a dedicated Profiles page.

- [x] **REF-002 - Search profiles** `CHANGED-EQUIVALENT`

- [x] **REF-003 - Filter profiles by Good/Evil alignment** `CHANGED-EQUIVALENT`

- [x] **REF-004 - Alphabetic profile navigation** `CHANGED-EQUIVALENT`

- [x] **REF-005 - Profile result count** `CHANGED-EQUIVALENT`

- [ ] **REF-006 - Search across profile name, origin, and relevant keywords** `IN PROGRESS`
  - Verify final searchable fields match the redesigned data model.

- [ ] **REF-007 - Profile detail view/drawer** `IN PROGRESS`
  - Must expose all data needed during list building and play.

- [ ] **REF-008 - Profile stats including heroic resources** `IN PROGRESS`

- [ ] **REF-009 - Siege/object profile stats** `IN PROGRESS`

- [ ] **REF-010 - Wargear display** `IN PROGRESS`

- [ ] **REF-011 - Options display** `IN PROGRESS`

- [ ] **REF-012 - Special/profile rules display** `IN PROGRESS`

- [ ] **REF-013 - Heroic Actions display** `IN PROGRESS`

- [ ] **REF-014 - Magical Powers display** `IN PROGRESS`

- [ ] **REF-015 - Additional/alternate profile data** `IN PROGRESS`

- [ ] **REF-016 - Source/book/page display** `IN PROGRESS`

- [ ] **REF-017 - Add profile/model to Collection from reference UI** `MISSING`

- [ ] **REF-018 - Deep link to a specific profile** `IN PROGRESS`

- [ ] **REF-019 - Browser-back works through opened profile drawers/details** `IN PROGRESS`

## Rules

- [x] **REF-020 - Browse reference rules** `CHANGED-EQUIVALENT`
  - Rewrite has a dedicated Rules page.

- [x] **REF-021 - Search rules** `CHANGED-EQUIVALENT`

- [x] **REF-022 - Rule-type tabs/categories** `CHANGED-EQUIVALENT`
  - Covers Special Rules, Magical Powers, and Heroic Actions.

- [x] **REF-023 - Alphabetic rule navigation** `CHANGED-EQUIVALENT`

- [x] **REF-024 - Rule result count** `CHANGED-EQUIVALENT`

- [ ] **REF-025 - Rule detail view/drawer** `IN PROGRESS`

- [ ] **REF-026 - Full rule wording with rich text** `IN PROGRESS`
  - Preserve paragraphs, bold text, lists, headings, underlines/errata marking, and cross-rule links supported by the new renderer.

- [ ] **REF-027 - Rule variants with parameter/suffix presentation** `IN PROGRESS`
  - Example class: `Hatred (Rohan)`, `Dominant (2)`, distance-valued variants.

- [ ] **REF-028 - Cross-rule navigation from rule text** `IN PROGRESS`

- [ ] **REF-029 - Browser-back works through rule drawer stack** `IN PROGRESS`

- [ ] **REF-030 - Quick/global access to rules during roster building and play** `IN PROGRESS`

- [ ] **REF-031 - Highlight rules used by current roster or equivalent contextual reference** `MISSING`
  - v2024 can colour-code active rules.

- [ ] **REF-032 - Move/split active roster rules to top or equivalent contextual filter** `MISSING`

## Reference charts and tables

- [ ] **REF-033 - Climb Table** `MISSING`
- [ ] **REF-034 - Detonation Table** `MISSING`
- [ ] **REF-035 - Jump Table** `MISSING`
- [ ] **REF-036 - Leap Table** `MISSING`
- [ ] **REF-037 - Missile Weapon Chart** `MISSING`
- [ ] **REF-038 - Scatter Table** `MISSING`
- [ ] **REF-039 - Sentry Chart** `MISSING`
- [ ] **REF-040 - Siege Gates and Doors table** `MISSING`
- [ ] **REF-041 - Swim Table** `MISSING`
- [ ] **REF-042 - Thrown Rider Table** `MISSING`
- [ ] **REF-043 - To Wound Chart** `MISSING`

The exact UI can change. A single searchable Reference area is acceptable if it retains fast access.

---

# COL - Miniature collection

- [ ] **COL-001 - View personal miniature collection** `MISSING`

- [ ] **COL-002 - Add a model/profile to collection** `MISSING`

- [ ] **COL-003 - Store quantity** `MISSING`

- [ ] **COL-004 - Store equipment/option variants** `MISSING`

- [ ] **COL-005 - Store mount variants** `MISSING`

- [ ] **COL-006 - Correctly represent named mounts** `MISSING`

- [ ] **COL-007 - Correctly represent models with multiple mount/options combinations** `MISSING`

- [ ] **COL-008 - Support composed-model mappings where the collection concept differs from profile rows** `MISSING`

- [ ] **COL-009 - Edit collection entry** `MISSING`

- [ ] **COL-010 - Delete collection entry** `MISSING`

- [ ] **COL-011 - Sort collection predictably by origin/model or redesigned equivalent** `MISSING`

- [ ] **COL-012 - Filter collection** `MISSING`
  - v2024 supports semicolon-separated AND terms.

- [ ] **COL-013 - Clear collection filter** `MISSING`

- [ ] **COL-014 - Useful empty state** `MISSING`

- [ ] **COL-015 - Warn when collection-based builder warnings are disabled** `MISSING`

- [ ] **COL-016 - Enable collection warnings directly from Collection UI** `MISSING`

- [ ] **COL-017 - Builder warns when roster exceeds owned quantity** `MISSING`

- [ ] **COL-018 - Collection warning calculation respects selected options and mounts** `MISSING`

- [ ] **COL-019 - Export collection** `MISSING`

- [ ] **COL-020 - Import collection** `MISSING`

- [ ] **COL-021 - Collection import/export round-trip** `MISSING`

- [ ] **COL-022 - Account sync for collection data** `MISSING`

---

# PLY - Game Mode

## Game session lifecycle

- [ ] **PLY-001 - Start Game Mode from a roster** `MISSING`

- [ ] **PLY-002 - Persist ongoing game state per roster** `MISSING`

- [ ] **PLY-003 - Support multiple simultaneous ongoing games** `MISSING`

- [ ] **PLY-004 - Quick switch between ongoing games** `MISSING`

- [ ] **PLY-005 - Sort/show game switcher by recent activity or equivalent** `MISSING`

- [ ] **PLY-006 - Ongoing-game navigation indicator** `MISSING`

- [ ] **PLY-007 - Graceful no-game-started state** `MISSING`

- [ ] **PLY-008 - Graceful roster-not-found state** `MISSING`

- [ ] **PLY-009 - Sync ongoing game state to account** `MISSING`

- [ ] **PLY-010 - Detect roster changes after game start** `MISSING`

- [ ] **PLY-011 - Offer reset/reload Game Mode from current roster after roster changes** `MISSING`

## Core in-game tracking

- [ ] **PLY-012 - Casualty counter** `MISSING`

- [ ] **PLY-013 - Hero/multi-wound casualties contribute correctly** `MISSING`

- [ ] **PLY-014 - Show casualties against total model count** `MISSING`

- [ ] **PLY-015 - Show models remaining until Broken** `MISSING`

- [ ] **PLY-016 - Show Broken state clearly** `MISSING`

- [ ] **PLY-017 - Show models remaining until Quartered** `MISSING`

- [ ] **PLY-018 - Show Quartered state clearly** `MISSING`

- [ ] **PLY-019 - Show total Might remaining** `MISSING`

## Stat trackers

- [ ] **PLY-020 - Hero Might tracker** `MISSING`

- [ ] **PLY-021 - Hero Will tracker** `MISSING`

- [ ] **PLY-022 - Hero Fate tracker** `MISSING`

- [ ] **PLY-023 - Wounds/multi-wound trackers** `MISSING`

- [ ] **PLY-024 - Track eligible heroic mounts/resources** `MISSING`

- [ ] **PLY-025 - Create trackers for repeated trackable models** `MISSING`

- [ ] **PLY-026 - Rename hero/multi-wound tracker labels** `MISSING`

- [ ] **PLY-027 - Add custom trackers** `MISSING`

- [ ] **PLY-028 - Edit custom trackers** `MISSING`

- [ ] **PLY-029 - Remove custom trackers** `MISSING`

## In-game reference tabs

- [ ] **PLY-030 - Trackers view/tab** `MISSING`

- [ ] **PLY-031 - Army overview / deployment helper** `MISSING`

- [ ] **PLY-032 - Profile cards/profiles for roster** `MISSING`

- [ ] **PLY-033 - Stats table for roster** `MISSING`

- [ ] **PLY-034 - Stats table reflects selected option stat changes** `MISSING`

- [ ] **PLY-035 - Roster information accessible during Game Mode** `MISSING`

- [ ] **PLY-036 - Responsive Game Mode layout** `MISSING`

## Ending a game

- [ ] **PLY-037 - End-game action** `MISSING`

- [ ] **PLY-038 - Guided/stepper game-result flow** `MISSING`

- [ ] **PLY-039 - Prepopulate game date from session** `MISSING`

- [ ] **PLY-040 - Prepopulate game duration from session** `MISSING`

- [ ] **PLY-041 - Prepopulate roster army and approximate points** `MISSING`

- [ ] **PLY-042 - Prepopulate bows/throwing weapons where recorded** `MISSING`

- [ ] **PLY-043 - Select scenario and evaluate its victory-condition inputs** `MISSING`

- [ ] **PLY-044 - Save completed game to Match History** `MISSING`

- [ ] **PLY-045 - End/remove ongoing game state after completion as appropriate** `MISSING`

---

# HIS - Match History and analytics

## Game records

- [ ] **HIS-001 - Match History page** `MISSING`

- [ ] **HIS-002 - Record a game manually** `MISSING`

- [ ] **HIS-003 - Record a completed Game Mode session** `MISSING`

- [ ] **HIS-004 - Edit existing game** `MISSING`

- [ ] **HIS-005 - Delete existing game** `MISSING`

- [ ] **HIS-006 - Store game date** `MISSING`

- [ ] **HIS-007 - Store duration** `MISSING`

- [ ] **HIS-008 - Store points level** `MISSING`

- [ ] **HIS-009 - Store own army/list** `MISSING`

- [ ] **HIS-010 - Store result: Won/Draw/Lost** `MISSING`

- [ ] **HIS-011 - Store own Victory Points** `MISSING`

- [ ] **HIS-012 - Store opponent Victory Points** `MISSING`

- [ ] **HIS-013 - Store opponent name** `MISSING`

- [ ] **HIS-014 - Store opponent army/list** `MISSING`

- [ ] **HIS-015 - Store scenario** `MISSING`

- [ ] **HIS-016 - Store tags** `MISSING`

- [ ] **HIS-017 - Store bow count** `MISSING`

- [ ] **HIS-018 - Store throwing-weapon count** `MISSING`

- [ ] **HIS-019 - Validate game-result form** `MISSING`

- [ ] **HIS-020 - Expandable/detail view for secondary game information** `MISSING`

- [ ] **HIS-021 - Pagination or equally usable handling of long histories** `MISSING`

## Filtering

- [ ] **HIS-022 - Filter by own army** `MISSING`

- [ ] **HIS-023 - Filter by scenario** `MISSING`

- [ ] **HIS-024 - Filter by opponent name** `MISSING`

- [ ] **HIS-025 - Filter by opponent army** `MISSING`

- [ ] **HIS-026 - Filter by result** `MISSING`

- [ ] **HIS-027 - Filter by tag** `MISSING`

- [ ] **HIS-028 - Filter by date range** `MISSING`

- [ ] **HIS-029 - Filter controls only offer sensible remaining choices or equivalent** `MISSING`

## Import/export

- [ ] **HIS-030 - Export match history** `MISSING`

- [ ] **HIS-031 - Import match history** `MISSING`

- [ ] **HIS-032 - Match-history import validation** `MISSING`

- [ ] **HIS-033 - v2024 history migration/import strategy** `MISSING`

## Analytics

- [ ] **HIS-034 - Results distribution chart** `MISSING`

- [ ] **HIS-035 - Matches over time chart** `MISSING`

- [ ] **HIS-036 - Armies played chart** `MISSING`

- [ ] **HIS-037 - Armies played against chart** `MISSING`

- [ ] **HIS-038 - Opponents played chart** `MISSING`

- [ ] **HIS-039 - Opponent Victory Points chart** `MISSING`

- [ ] **HIS-040 - Scenarios played chart** `MISSING`

- [ ] **HIS-041 - Victory Point spread chart** `MISSING`

- [ ] **HIS-042 - Analytics respond to active history filters** `MISSING`

## Scenario data

- [ ] **HIS-043 - Matched Play scenario list** `MISSING`

- [ ] **HIS-044 - Matched Play Guide scenarios** `MISSING`

- [ ] **HIS-045 - Doubles scenarios used by supported game-result flows** `MISSING`

- [ ] **HIS-046 - Legacy-list compatibility where history records use legacy armies** `MISSING`

---

# ACC - Accounts, persistence, and sync

Implementation can change completely. This section tracks user-visible guarantees.

## Guest/local usage

- [ ] **ACC-001 - Core application remains usable without an account** `NEEDS VERIFICATION`

- [ ] **ACC-002 - Guest rosters persist across reloads** `MISSING`

- [ ] **ACC-003 - Guest roster groups persist across reloads** `MISSING`

- [ ] **ACC-004 - Guest collection persists across reloads** `MISSING`

- [ ] **ACC-005 - Guest Match History persists across reloads** `MISSING`

- [ ] **ACC-006 - Guest Game Mode sessions persist across reloads** `MISSING`

- [ ] **ACC-007 - User preferences persist across reloads** `IN PROGRESS`

## Authentication

- [ ] **ACC-008 - Create account using email/password or explicit replacement** `NEEDS VERIFICATION`

- [ ] **ACC-009 - Sign in using email/password or explicit replacement** `NEEDS VERIFICATION`

- [ ] **ACC-010 - Sign in with Google or explicit replacement** `NEEDS VERIFICATION`

- [ ] **ACC-011 - Reset forgotten password** `NEEDS VERIFICATION`

- [ ] **ACC-012 - Authentication persists across browser reloads** `NEEDS VERIFICATION`

- [ ] **ACC-013 - Sign out** `NEEDS VERIFICATION`

- [ ] **ACC-014 - Sign-out flow warns about unsynchronised/local data where necessary** `NEEDS VERIFICATION`

## Cloud/account sync

- [ ] **ACC-015 - Sync rosters across devices** `MISSING`

- [ ] **ACC-016 - Sync roster groups across devices** `MISSING`

- [ ] **ACC-017 - Sync collection across devices** `MISSING`

- [ ] **ACC-018 - Sync Match History across devices** `MISSING`

- [ ] **ACC-019 - Sync ongoing Game Mode state across devices where supported** `MISSING`

- [ ] **ACC-020 - Resolve/reconcile local data when signing into an account** `MISSING`

- [ ] **ACC-021 - Pending sync indicator** `MISSING`

- [ ] **ACC-022 - Explicit force/flush sync action** `MISSING`

- [ ] **ACC-023 - Mutations eventually reach backend without requiring manual page refresh** `MISSING`

- [ ] **ACC-024 - Duplicate/import mutations are synchronised correctly** `MISSING`

- [ ] **ACC-025 - Updating a roster preserves its group association** `MISSING`

- [ ] **ACC-026 - Sync failures surface actionable error/retry state** `MISSING`

- [ ] **ACC-027 - Local schema/data migrations do not destroy stored user data** `MISSING`

## Architectural replacement

- [x] **ACC-028 - Backend lives in the rewrite monorepo** `CHANGED-EQUIVALENT`
  - This is an implementation difference, not a feature parity requirement.

---

# SET - Settings and user preferences

The rewrite already has a redesigned Settings area. Each old preference below still needs either a mapped replacement or a deliberate removal decision.

## General

- [ ] **SET-001 - Light/dark appearance selection** `IN PROGRESS`

- [ ] **SET-002 - Default appearance can follow system setting** `NEEDS VERIFICATION`

- [ ] **SET-003 - Mobile roster overview toolbar preference or equivalent always-visible summary** `MISSING`

- [ ] **SET-004 - Hide individual rosters from navigation** `MISSING`

- [ ] **SET-005 - Show mutation buttons while collapsed on compact layout or equivalent UX** `MISSING`

- [ ] **SET-006 - Legacy/simple roster summary preference or explicit removal decision** `MISSING`

- [ ] **SET-007 - Automatically update existing roster units when data files change** `MISSING`

## Rule/reference context

- [ ] **SET-008 - Highlight rules/powers used by selected roster** `MISSING`

- [ ] **SET-009 - Split/move active rules to top** `MISSING`

## Printable output

- [ ] **SET-010 - Include Special Rule descriptions per profile** `MISSING`

- [ ] **SET-011 - Include Heroic Action descriptions per profile** `MISSING`

- [ ] **SET-012 - Disable PDF page breaks** `MISSING`

- [ ] **SET-013 - Enable per-section PDF visibility controls** `MISSING`

- [ ] **SET-014 - Hide PDF quick-reference section** `MISSING`

- [ ] **SET-015 - Hide PDF army-composition section** `MISSING`

- [ ] **SET-016 - Hide PDF profiles section** `MISSING`

- [ ] **SET-017 - Hide PDF Special Rules section** `MISSING`

- [ ] **SET-018 - Hide PDF Army Rules section** `MISSING`

- [ ] **SET-019 - Hide PDF Heroic Actions section** `MISSING`

- [ ] **SET-020 - Hide PDF Magical Powers section** `MISSING`

- [ ] **SET-021 - Hide PDF M/W/F trackers section** `MISSING`

## Collection and builder restrictions

- [ ] **SET-022 - Enable/disable Collection warnings** `MISSING`

- [ ] **SET-023 - Allow removal of compulsory army general** `MISSING`

## Rewrite additions that do not need old equivalents

- [x] **SET-024 - Application language setting** `NEW`
- [x] **SET-025 - Unofficial rule-translation setting/warning flow** `NEW`
- [x] **SET-026 - Dedicated accessibility settings area** `NEW`
- [x] **SET-027 - Dedicated privacy settings area** `NEW`

---

# DATA - Game data and generation pipeline

## Principle

The old Python implementation does not need to be reproduced. The TypeScript pipeline reaches parity when it can represent and generate all required game semantics reliably.

- [x] **DATA-001 - Replace Python data scripts with TypeScript** `CHANGED-EQUIVALENT`
  - Implementation-language change is already intentional.

- [ ] **DATA-002 - Deterministic/reproducible data generation** `NEEDS VERIFICATION`

- [ ] **DATA-003 - Schema validation for generated data** `IN PROGRESS`

- [ ] **DATA-004 - Stable identifiers for profiles, rules, options, and army-list references** `IN PROGRESS`

## Profiles

- [ ] **DATA-005 - Profile identity/name/origin/source** `IN PROGRESS`

- [ ] **DATA-006 - Warrior/hero stats** `IN PROGRESS`

- [ ] **DATA-007 - Heroic Might/Will/Fate** `IN PROGRESS`

- [ ] **DATA-008 - Siege/object stat shapes** `IN PROGRESS`

- [ ] **DATA-009 - Base sizes including non-circular values** `IN PROGRESS`

- [ ] **DATA-010 - Wargear** `IN PROGRESS`

- [ ] **DATA-011 - Keywords: race/faction/unit type and other searchable metadata** `IN PROGRESS`

- [ ] **DATA-012 - Heroic Actions** `IN PROGRESS`

- [ ] **DATA-013 - Special/profile rules** `IN PROGRESS`

- [ ] **DATA-014 - Magical Powers and casting values** `IN PROGRESS`

- [ ] **DATA-015 - Additional/alternate profiles** `IN PROGRESS`

- [ ] **DATA-016 - Additional profile text** `IN PROGRESS`

## Options

- [ ] **DATA-017 - Option identity/name/cost** `IN PROGRESS`

- [ ] **DATA-018 - Included/preselected options** `IN PROGRESS`

- [ ] **DATA-019 - Mandatory options** `IN PROGRESS`

- [ ] **DATA-020 - Option requirements/dependencies** `IN PROGRESS`

- [ ] **DATA-021 - Option exclusions/alternative choices** `IN PROGRESS`

- [ ] **DATA-022 - Option effects on stats** `IN PROGRESS`

- [ ] **DATA-023 - Option effects on rules/keywords/profile form** `IN PROGRESS`

- [ ] **DATA-024 - List-specific option availability** `IN PROGRESS`

- [ ] **DATA-025 - List-specific option name/cost overrides** `IN PROGRESS`

- [ ] **DATA-026 - Preselected-option incremental upgrades** `IN PROGRESS`

- [ ] **DATA-027 - TTS export-name mapping** `MISSING`

## Army lists and constraints

- [ ] **DATA-028 - Army-list identity/name/alignment/source** `MISSING`

- [ ] **DATA-029 - Legacy marker** `MISSING`

- [ ] **DATA-030 - Army special/additional rules** `MISSING`

- [ ] **DATA-031 - Breakpoint configuration/overrides** `MISSING`

- [ ] **DATA-032 - Bow-limit configuration/overrides** `MISSING`

- [ ] **DATA-033 - Throwing-weapon-limit configuration/overrides** `MISSING`

- [ ] **DATA-034 - Which profiles can lead warbands** `MISSING`

- [ ] **DATA-035 - Valid followers per leader/list** `MISSING`

- [ ] **DATA-036 - Extra profiles available only in specific list contexts** `MISSING`

- [ ] **DATA-037 - Mandatory/preselected units and army-general constraints** `MISSING`

- [ ] **DATA-038 - Data-driven warning/validation rules** `MISSING`

- [ ] **DATA-039 - Auto-construction metadata/helpers for mandatory compositions** `MISSING`

## Rules and translations

- [x] **DATA-040 - Rule data model** `IN PROGRESS`

- [x] **DATA-041 - Translation-key based profile/rule text** `NEW`

- [ ] **DATA-042 - English wording remains authoritative** `IN PROGRESS`

- [ ] **DATA-043 - Unofficial translation fallback behaviour** `IN PROGRESS`

- [ ] **DATA-044 - Rule rich-text semantics survive generation** `IN PROGRESS`

- [ ] **DATA-045 - FAQ/Errata wording can be represented without corrupting original structure** `IN PROGRESS`

## Other content

- [ ] **DATA-046 - Scenario data used by game-result flow** `MISSING`

- [ ] **DATA-047 - Reference chart/table data** `MISSING`

- [ ] **DATA-048 - Profile-card/image mapping where still used** `NEEDS VERIFICATION`

## Migration and regression safety

- [ ] **DATA-049 - Golden-fixture comparison against representative v2024 data** `MISSING`
  - Compare semantic output, not JSON shape.

- [ ] **DATA-050 - Representative old roster fixtures migrate successfully** `MISSING`

- [ ] **DATA-051 - Representative old collection fixtures migrate successfully** `MISSING`

- [ ] **DATA-052 - Representative old Match History fixtures migrate successfully** `MISSING`

- [ ] **DATA-053 - Complex-list regression fixtures cover option/constraint edge cases** `MISSING`

- [x] **DATA-054 - Admin/debug profile data-checking page** `NEW`
  - Useful rewrite-only quality tooling. Does not block v2024 parity.

---

# COM - Home, help, community, changelog, and public information

- [x] **COM-001 - Home page** `CHANGED-EQUIVALENT`

- [ ] **COM-002 - Home page explains major application capabilities** `NEEDS VERIFICATION`
  - v2024 explicitly presents an overview of features.

- [ ] **COM-003 - Community/Discord link if still desired** `NEEDS VERIFICATION`

- [x] **COM-004 - Feedback/help surface** `CHANGED-EQUIVALENT`

- [x] **COM-005 - Support page** `NEW`

- [x] **COM-006 - Policies page** `NEW`

- [ ] **COM-007 - About/project information** `IN PROGRESS`
  - Determine whether new Support/Policies/Home fully replace the old About page.

- [ ] **COM-008 - In-app changelog/release notes** `NEEDS VERIFICATION`

- [ ] **COM-009 - Community Stats page** `NEEDS VERIFICATION`
  - v2024 exposes:
    - new users in last 7 days
    - active users in last 7 days
    - total users
    - active games in last 7 days
    - games in last 7 days
    - total games
    - rosters created in last 7 days
    - total rosters
  - If this is not wanted in the rewrite, mark it `INTENTIONALLY REMOVED` rather than silently dropping it.

- [ ] **COM-010 - Community stats caching/update behaviour if retained** `NEEDS VERIFICATION`
  - v2024 describes the figures as updating hourly.

---

# UX - Cross-cutting UX, resilience, and compatibility

- [ ] **UX-001 - Mobile roster builder remains fully operable** `MISSING`

- [ ] **UX-002 - Long warbands can horizontally scroll where needed without hiding controls** `MISSING`

- [ ] **UX-003 - Drag/drop interactions have a touch-friendly alternative or lock** `MISSING`

- [ ] **UX-004 - Drawers fit narrow screens** `IN PROGRESS`

- [ ] **UX-005 - Roster information remains accessible when permanent desktop drawer becomes temporary on small screens** `MISSING`

- [ ] **UX-006 - Long profile/rule content remains readable on small screens** `IN PROGRESS`

- [ ] **UX-007 - Error boundary / fatal-error fallback** `NEEDS VERIFICATION`

- [ ] **UX-008 - Error fallback gives useful recovery information** `NEEDS VERIFICATION`

- [ ] **UX-009 - Stored-data corruption/version mismatch fails safely** `MISSING`

- [ ] **UX-010 - Deep-linked deleted resources fail safely** `IN PROGRESS`

- [ ] **UX-011 - User-changing destructive actions require appropriate confirmation** `MISSING`
  - Examples: deleting roster/group, bulk deletion, switching army list and clearing roster.

- [ ] **UX-012 - Empty states explain the next useful action** `IN PROGRESS`

- [ ] **UX-013 - Loading/sync states do not silently lose user mutations** `MISSING`

- [ ] **UX-014 - Core flows are keyboard accessible** `IN PROGRESS`

- [ ] **UX-015 - Core flows meet the rewrite's accessibility target** `IN PROGRESS`

- [ ] **UX-016 - Print-specific layout remains usable across major browsers** `MISSING`

- [ ] **UX-017 - Browser refresh works on nested routes in production hosting** `NEEDS VERIFICATION`

---

# NEW - Rewrite-only scope, not required for v2024 parity

These items should not delay a parity milestone unless you explicitly choose to make them dependencies of old features.

- [ ] **NEW-001 - Global Search page** `NEW`
- [ ] **NEW-002 - Find a Game** `NEW`
- [ ] **NEW-003 - Battle Companies** `NEW`
- [ ] **NEW-004 - Tournaments** `NEW`
- [ ] **NEW-005 - Expanded Games area beyond v2024 Game Mode/History** `NEW`
- [x] **NEW-006 - Dedicated Rules reference page** `NEW`
- [x] **NEW-007 - Dedicated Profiles reference page** `NEW`
- [x] **NEW-008 - Multi-language UI/data architecture** `NEW`
- [x] **NEW-009 - Unofficial rule-translation safety warning** `NEW`
- [x] **NEW-010 - Dedicated accessibility settings** `NEW`
- [x] **NEW-011 - Dedicated privacy settings** `NEW`
- [x] **NEW-012 - Data/debug profile checker** `NEW`
- [x] **NEW-013 - Backend in the same monorepo** `NEW`
- [x] **NEW-014 - TypeScript data generation pipeline** `NEW`

---

# Verification plan

Do not mark the project feature-complete based only on page presence. Use the following final gates.

## 1. Route and surface audit

- [ ] Every v2024 route has either a replacement route/surface or an `INTENTIONALLY REMOVED` decision.
- [ ] Every v2024 modal has a replacement interaction or an `INTENTIONALLY REMOVED` decision.
- [ ] Every v2024 drawer has a replacement interaction or an `INTENTIONALLY REMOVED` decision.
- [ ] Every v2024 navigation action has a replacement path where the underlying capability remains relevant.

## 2. Persistence and migration audit

- [ ] Create representative v2024 roster-export fixtures.
- [ ] Create representative v2024 collection-export fixtures.
- [ ] Create representative v2024 Match History export fixtures.
- [ ] Verify new imports preserve meaningful data.
- [ ] Verify reload persistence for guest/local users.
- [ ] Verify sign-in reconciliation does not overwrite newer local data unexpectedly.
- [ ] Verify pending writes survive common navigation/reload scenarios or explicitly block unsafe actions.

## 3. Roster builder behaviour matrix

At minimum, add automated fixture/tests covering:

- [ ] Standard hero + warrior warband.
- [ ] Hero with compulsory/included mount or wargear.
- [ ] Preselected option with incremental upgrade.
- [ ] Mutually exclusive options.
- [ ] Option dependency.
- [ ] Option that changes Defence or another profile stat.
- [ ] Option that changes model count.
- [ ] Unique-model restriction.
- [ ] Paired heroes.
- [ ] Mandatory army general.
- [ ] Optional override allowing compulsory general removal.
- [ ] Army-specific warband follower restriction.
- [ ] Army-specific bow-limit rule.
- [ ] Army-specific throwing-weapon rule.
- [ ] Army-specific breakpoint rule.
- [ ] Siege equipment roster.
- [ ] War beast/composed profile.
- [ ] Named/armoured mount.
- [ ] Variable Ringwraith-style resource upgrade.
- [ ] Custom Good/Evil roster.
- [ ] Collection warning with option/mount variants.

## 4. Output consistency

For the same roster, verify the following all agree on points, units, options, modified stats, and applicable rules:

- [ ] Builder roster overview.
- [ ] Roster summary.
- [ ] Plain-text share output.
- [ ] Printable/PDF output.
- [ ] Game Mode stats.
- [ ] TTS export where applicable.

## 5. Responsive smoke test

Run at least one full create-build-play-record flow at:

- [ ] Small phone width.
- [ ] Large phone/small tablet width.
- [ ] Desktop width.

Verify especially:

- [ ] Navigation.
- [ ] Roster group management.
- [ ] Unit selection.
- [ ] Option selection.
- [ ] Long warbands.
- [ ] Warning visibility.
- [ ] Roster info.
- [ ] Game Mode.
- [ ] Drawers/profile/rule reference.
- [ ] Printable output.

## 6. Final live v2024 manual comparison

Before removing the `feature-parity` milestone/label:

- [ ] Open every top-level v2024 area once.
- [ ] Open every roster/card overflow action once.
- [ ] Open every builder floating action once.
- [ ] Open every settings section once.
- [ ] Start and end a Game Mode session.
- [ ] Create, edit, and delete a Match History entry.
- [ ] Add/edit/delete/import/export a Collection entry.
- [ ] Export/import/share/print one complex roster.
- [ ] Compare reference lookups and common charts.
- [ ] Record any newly discovered behaviour in this file before declaring parity.

---

# Suggested implementation order

This is not a required sequence, but it minimises rework because later features depend on earlier domain behaviour.

1. **Army-list data model and constraints**
   - `DATA-028` through `DATA-039`
   - option semantics `DATA-017` through `DATA-027`

2. **Roster domain model and calculations**
   - `VAL-*`
   - persistence interfaces from `ACC-*`

3. **Roster management**
   - `ROS-*`

4. **Roster builder**
   - `BLD-*`

5. **Import/export and migration**
   - `OUT-001` through `OUT-006`
   - `DATA-049` through `DATA-053`

6. **Roster summaries and printable output**
   - remainder of `OUT-*`

7. **Collection**
   - `COL-*`

8. **Game Mode**
   - `PLY-*`

9. **Match History**
   - `HIS-*`

10. **Account/cloud synchronisation**
    - finish `ACC-*` around the same domain APIs instead of creating a second client-only model

11. **Old preference mapping and cleanup**
    - `SET-*`

12. **Final parity verification**
    - `UX-*`
    - Verification Plan above
    - final live v2024 walkthrough

---

# Evidence map

This section is intentionally concise. It makes it easier to find the old implementation when working on a checklist item.

| Area | Useful v2024 source paths |
| --- | --- |
| Routes | `src/routing/routes.tsx` |
| Roster state | `src/state/roster-building/` |
| Roster groups | `src/state/roster-building/groups/index.ts` |
| Undo/redo | `src/state/roster-building/index.ts` |
| Rosters page | `src/pages/rosters/` |
| Advanced roster search | `src/pages/rosters/components/useRosterSearch.ts` |
| Roster builder page | `src/pages/roster/` |
| Warbands | `src/components/common/warbands/` |
| Warband mutations | `src/hooks/mutations/useWarbandMutations.ts` |
| Roster calculations/warnings | `src/hooks/calculations-and-displays/` |
| Roster information | `src/components/common/roster-info/` |
| Export/share actions | `src/pages/roster/RosterFloatingButton.tsx` |
| Export logic | `src/hooks/export/` |
| Modals | `src/components/modal/modals.tsx` |
| Drawers | `src/components/drawer/drawers.tsx` |
| Collection | `src/pages/Collection.tsx`, `src/state/collection/` |
| Profile Database | `src/pages/database/` |
| Game Mode | `src/pages/gamemode/`, `src/state/gamemode/` |
| Match History | `src/pages/match-history/`, `src/state/recent-games/` |
| Settings | `src/pages/Settings.tsx`, `src/state/preference/` |
| Navigation | `src/layout/navigation/menu/` |
| Charts | `src/constants/charts.ts`, `src/components/modal/modals/ChartsModal.tsx` |
| Account/auth | `src/pages/account/`, `src/firebase/` |
| Cloud sync | `src/hooks/cloud-sync/` |
| Shared roster | `src/pages/shared/` |
| Printable roster | `src/components/common/roster-pdf/` |
| Community stats | `src/pages/site-stats/` |
| Old data pipeline | `data/scripts/`, especially `data/scripts/mappers/` |
| Historical feature record | `CHANGELOG.json` |

---

# Parity completion declaration

Only check this section once the work above is complete.

- [ ] No parity-required item remains `MISSING`.
- [ ] No parity-required item remains `IN PROGRESS`.
- [ ] No parity-required item remains `NEEDS VERIFICATION`.
- [ ] Every `INTENTIONALLY REMOVED` item includes a short rationale and, where relevant, its replacement UX.
- [ ] Old export/data migration has either been implemented or explicitly ruled out with a documented migration plan.
- [ ] Representative list-building regression fixtures pass.
- [ ] Desktop and mobile end-to-end smoke flows pass.
- [ ] Final live-v2024 manual comparison found no undocumented user-facing capability.

**When every item above is checked, the rewrite can reasonably be considered feature-parity complete with v2024.**
