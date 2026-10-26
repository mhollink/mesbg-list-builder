# Changelog

All notable changes to MESBG List Builder are documented in this file.

The format is based on Keep a Changelog and releases follow Semantic Versioning.

## \[2.0.0-alpha.25\] - 2026-10-26

### Added

- Add an initial draft of a roadmap
- Add roadmap entries for the integrations feature
- Introduce release milestones to roadmap timeline
- Enhance roadmap with new milestones and "scope pending" messaging
- Added a global search implementation

### Fixed

- Remove unit upgrades from armylist options
- Update release script to maintain full changelog

## \[2.0.0-alpha.24\] - 2026-10-24

### Added

- Introduce community theme builder with live preview and export options
- Add `category` field to army-list-profile-options
- Add `category` field to ArmyListProfileOption definition
- Add warband capacity tracking and slot validation in unit configuration

### Changed

- Update themes in preperation for more use of colors
- Improve component styles with consistent accent borders and updated colors
- Replace multi-loadout logic with single unit configuration

## \[2.0.0-alpha.23\] - 2026-10-23

### Fixed

- Upload new dataset

## \[2.0.0-alpha.22\] - 2026-10-22

### Added

- Add Josh as team member on the about page
- Add leader to create warband requests
- Added a shared history-based state system to unit picker drawers

### Fixed

- Update commit parser groups in cliff.toml for improved changelog organization
- Remove autofocus from unit picker search field

### Changed

- Remove leader replacement endpoint in favor of instant leader creation
- Update the roster persistence interface with the new api
- Enforce non-null leader in warbands and update related logic
- Add quantity-only mode for unit loadout selection and default those to 1

### Reverted

- Remove leader replacement endpoint from api-spec
- Remove unused RosterSaveErrors component and hook

## \[2.0.0-alpha.21\] - 2026-10-21

### Added

- Add `ScrollRestoration` to `AppLayout` for automatic scroll to top
- Add scroll restoration to rule and profile drawers
- Add "About" page with project details, team info, and supporter wall
- Add navigation links towards new About page

### Fixed

- Prevent scroll reset when opening or closing drawers
- Normalize profile letters to handle accented characters

## \[2.0.0-alpha.20\] - 2026-10-20

### Added

- Group unit profiles by tier in `UnitSelectionView`
- Add "Quick Add" button to `PickerRow` for fast unit selection without extra options
- Simplify unit option rendering with `getEffectiveUnitOptions`

### Fixed

- Keep unit selector drawers mounted to enable the slide animations
- Pass promise return to onQuickAdd
- Ensure `onQuickAdd` is checked before rendering button in `PickerRow`

## \[2.0.0-alpha.18\] - 2026-10-19

### Fixed

- Enable follower editing with `setFollowerEditor`

## \[2.0.0-alpha.17\] - 2026-10-19

### Added

- Improve roster creation UX and default name handling
- Add features overview page
- Add raw avatar images for all profiles
- Add ProfileAvatar component and integrate with ProfileListRow
- Integrate ProfileAvatar into DebugProfile
- Add Docker setup to quick-start scripts
- Update the api to support most roster building operations
- Implement roster builder ui
- Map guest rosters to shared builder model with tests
- Introduce army list and profile data models with calculation logic updates
- Add comprehensive logging across roster service layers
- Enhance request logging and session management
- Expand roster management and implement authenticated and guest persistence APIs
- Implement profile selection and warband rules
- Implement Info Panel with responsive layout and validation logic
- Add UnitCard, UnitHeroicStats, and UnitOptions components with updated point calculation logic
- Add max size and tier-based logic to army list warbands and improve UI for warband management
- Add option limits support and update schemas and profiles accordingly
- Add UnitActions component and enhance unit and warband interactions
- Integrate debounced unit updates
- Add leader and follower pickers with integrated unit selection
- Auto-open leader picker for newly created warbands
- Implement drag-and-drop functionality for followers with DnD Kit
- Enhance drag-and-drop functionality with sortable warbands and improved follower handling
- Add manual warband reordering and improve drag-and-drop functionality
- Enhance roster sorting with improved drag-and-drop and error handling
- Introduce unit editing, general toggling, and UI refinements
- Refactor and extend unit configuration
- Integrate unit loadout configuration for leaders and followers

### Fixed

- Correct typos, add profiles, and adjust values for clarity and accuracy
- Remove duplicated "firefoot" profile
- Add missing `key` prop in CreateRosterDialog list items
- Improve null safety and error handling in roster builder and unit components

## \[2.0.0-alpha.16\] - 2026-09-22

### Added

- Add api specifications for the rosters and roster-groups
- Implement data & service layers
- Add full api support for create, update and deleting rosters
- Add "might" field to roster statistics and API schema
- Add UI components for creating, viewing, and managing rosters
- Add heraldry spritesheet generation and integration
- Add support for tags and points limit in rosters
- Expand `armyListIcons` mapping with comprehensive entries
- Enhance Army List selection with sorting, grouping, and heraldry icons
- Introduce group management with drag-and-drop and breadcrumbs navigation
- Enhance drag-and-drop and breadcrumbs navigation for groups
- Introduce guest roster support
- Add confirmation dialog for replacing guest roster
- Add favorite and locked state support
- Implement centralized API exception handling and validation

### Fixed

- Conditionally render heraldry icon in `RosterCard`

## \[2.0.0-alpha.15\] - 2026-09-15

### Added

- Add authenticated API foundation

## \[2.0.0-alpha.14\] - 2026-09-15

### Added

- Integrate Keycloak auth
- Implement login and logout buttons

## \[2.0.0-alpha.13\] - 2026-09-14

### Added

- Normalize search queries for easier lookups

### Fixed

- Upload new translations and profile data

## \[2.0.0-alpha.12\] - 2026-09-13

### Added

- Add army finder based on profile selection

## \[2.0.0-alpha.11\] - 2026-09-13

### Added

- Add an army list reference page

## \[2.0.0-alpha.9\] - 2026-09-10

### Added

- Add landing and support pages
- Add support for custom themes
- Allow theme switching via the appearance settings
- Add support for translating the app to other languages
- Implement a rules reference page
- Implement profile page
- Close drawers using native back functionality
- Add army lists datafile + types
