# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-11

### ⚠ Breaking changes

- **Peer dependencies:** `react` and `react-dom` must be `^18.0.0 || ^19.0.0` (was `^16.7.0`).
  The library uses hooks and `useSyncExternalStore`.
- **Components rewritten as function components.** A `ref` on `<ForteTable>` now returns an
  imperative API instead of the class instance (see _Added_).
- **`cell` / `header` callback arguments are plain objects.**
  `cell.props.{row, record, column, rowId, rowIndex, columnIndex, isActive, activeRow, isSelected, errorText, setActive, model}`
  is kept for compatibility; other class members (`setState`, `forceUpdate`, `ref`, `state`) are gone.
- **Layout moved from `display: table` to flexbox** with CSS variables
  (`--ft-w-{i}` column width, `--ft-l-{i}` sticky offset of fixed columns).
  Custom CSS relying on table-cell display rules may need updating.
- **Rows are memoized.** A row re-renders when its record object, the `columns()` result, or a render
  callback (`cellRender`, `cellStyle`, `cellClassName`, `headRowRender`) changes, when it becomes
  active/selected, or when the record notifies it through `_subscribe`.
  Records mutated in place must get a new identity or notify the row.
- **`setActiveRow(row, rowIndex)`** receives the record instead of the row component.
- **Cell content is wrapped** in a `div.ft-cell__content` element.

### Added

- Imperative API via `ref`: `getSelectedRows`, `getSelectedColumns`, `getActiveCoords`,
  `setActiveCoords`, `setActiveNext`, `selectRange`, `clearSelection`, `scrollToCell`,
  `element`, `scrollTop`, `scrollHeight`.
- Shift+click and Shift+arrows extend the selection from its anchor (the active cell stays on the anchor).
- Click/drag over row headings selects whole records; Shift+click on a heading extends the record selection.
- Keyboard navigation: arrows, Ctrl/Cmd+arrows (jump to edge), Tab / Shift+Tab.
  Navigation is skipped while focus is inside an input, textarea, select or contenteditable.
- Live column resizing that updates only CSS variables (no body re-render while dragging).
- A drag released outside the table now ends the selection.
- Default cell content shows `row[column]` when `cellRender` is not provided.
- `className` prop on the table container; ARIA grid roles.
- Named export `ForteTable` in addition to the default export.
- Example "Data grid (1000 records)" with fixed columns, custom cell rendering and selection stats.
- Playwright end-to-end tests for selection (`npm run test:e2e`).

### Changed

- Build tooling: Webpack 5, Babel 7 with `@babel/preset-env`, webpack-dev-server 5.
- Examples use `createRoot` and function components.

### Fixed

- Keyboard navigation (`setActiveNext`, arrow keys) read undefined state and never moved the active cell.
- Header cell click no longer fires after a column resize.

### Removed

- Hard dependency on `../../forte-form/forte-store/Record`: records are duck-typed through
  `getErrors()`, `_getData()` and `_subscribe()`.
- `react` and `react-dom` from `dependencies` (now peer dependencies only).

## [1.0.4]

- Last release supporting React 16.

[2.0.0]: https://github.com/mdefaux/forte-table/releases/tag/v2.0.0
[1.0.4]: https://www.npmjs.com/package/forte-table/v/1.0.4
