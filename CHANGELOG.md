# Changelog

All notable changes to MESBG List Builder are documented in this file.

The format is based on Keep a Changelog and releases follow Semantic Versioning.

## \[2.0.0-alpha.21\] - 2026-10-21

### Added

- Add `ScrollRestoration` to `AppLayout` for automatic scroll to top
- Add scroll restoration to rule and profile drawers
- Add "About" page with project details, team info, and supporter wall
- Add navigation links towards new About page

### Fixed

- Prevent scroll reset when opening or closing drawers
- Normalize profile letters to handle accented characters

### Changed

- Cast raw supporter data to Supporter type
