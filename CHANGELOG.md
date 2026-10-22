# Changelog

All notable changes to MESBG List Builder are documented in this file.

The format is based on Keep a Changelog and releases follow Semantic Versioning.

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
