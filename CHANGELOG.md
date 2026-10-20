# Changelog

All notable changes to MESBG List Builder are documented in this file.

The format is based on Keep a Changelog and releases follow Semantic Versioning.

## \[2.0.0-alpha.20\] - 2026-10-20

### Added

- Group unit profiles by tier in `UnitSelectionView`
- Add "Quick Add" button to `PickerRow` for fast unit selection without extra options
- Simplify unit option rendering with `getEffectiveUnitOptions`

### Fixed

- Keep unit selector drawers mounted to enable the slide animations
- Pass promise return to onQuickAdd
- Ensure `onQuickAdd` is checked before rendering button in `PickerRow`
