# Changelog

All notable changes to MESBG List Builder are documented in this file.

The format is based on Keep a Changelog and releases follow Semantic Versioning.

## \[2.0.0-alpha.17\] - 2026-10-19

### Added

- Add landing and support pages
- Add support for custom themes
- Allow theme switching via the appearance settings
- Add support for translating the app to other languages
- Implement a rules reference page
- Implement profile page
- Close drawers using native back functionality
- Add army lists datafile + types
- Add an army list reference page
- Add army finder based on profile selection
- Normalize search queries for easier lookups
- Integrate Keycloak auth
- Implement login and logout buttons
- Add authenticated API foundation
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

- Upload new translations and profile data
- Conditionally render heraldry icon in `RosterCard`
- Correct typos, add profiles, and adjust values for clarity and accuracy
- Remove duplicated "firefoot" profile
- Add missing `key` prop in CreateRosterDialog list items
- Improve null safety and error handling in roster builder and unit components

### Changed

- Extract legacy army lists from v2024
- Convert legacy json to xlsx
- Remove legacy json
- Fix incorrect file contents
- Remove unused columns from the excel
- Implement army-list datafile generation pipeline
- Alter the data pipeline to parse entire file rather than rows
- Remove optional fields from armylist data
- Display army list rules more dense
- Make sure only one alignment can be seleted in the find an army
- Fix chip alignment
- Set correct infra folder in workflow
- Fix import/export dir name for keycloak
- Remove name field from register form
- Ensure keycloak url is an absolute url
- Make CORS url configurable
- Rename `name` to `iconName` and streamline heraldry icon resolution
- Improve optional prop handling and null safety checks
- Improve type safety, formatting, and update tests
- Enhance URL validation and mock error handling
- Reformat Keycloak validation and mock code for consistency
- Centralize roster creation logic with `RosterCreationProvider` and fix broken links/buttons
- Consolidate sprite sheet generation into reusable script
- Fix build error in ProfileAvatar type
- Replace Typography with RuleText in ProfileValueList
- Improve mapping logic and logging in roster services
- Clean up imports and improve code formatting in roster components
- Reorganize imports, improve formatting, and add collapse functionality to WarbandCard components
- Extract WarbandHeader and WarbandActions components for improved modularity and reusability
- Replace `Set` with array in unit and army option handling tests
- Unify leader and follower editing with new `Editor` state

### maintance

- Add github issue templates

### maintenance

- Enhance security policy with vulnerability reporting details
- Renormalize line endings and reformat code.

### reactor

- Add missing army list profile cost

### refeactor

- Create a small shared module in the reference feature
