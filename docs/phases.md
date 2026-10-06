# Miko Implementation Phases

> Implementation plan for building Miko: A tiny, playful bookmark companion Chrome extension.

## Phase 0: Foundation & Setup

**Goal:** Set up project structure, tooling, and development environment.

### Tasks

- [ ] Initialize project with Vite/React/TypeScript for Chrome extension (Manifest V3)
- [ ] Set up manifest.json with required permissions (storage, activeTab, contextMenus)
- [ ] Configure build tooling (Vite + @crxjs/vite-plugin or equivalent)
- [ ] Set up linting, formatting, and TypeScript config
- [ ] Create basic project directory structure
- [ ] Set up hot-reload for extension development

### Deliverables

- Working dev build that loads as unpacked extension in Chrome
- Project scaffold with src/, public/, dist/ structure
- TypeScript, ESLint, Prettier configured

### Estimated Time: 1-2 days

---

## Phase 1: Core Data Model & Storage

**Goal:** Implement local-first storage layer with bookmark data model.

### Tasks

- [ ] Define bookmark data model (id, url, title, description, favicon, tags, createdAt, updatedAt)
- [ ] Implement Chrome Storage API wrapper (local storage)
- [ ] Add duplicate detection (by URL)
- [ ] Implement CRUD operations for bookmarks
- [ ] Add import/export utilities (JSON format)
- [ ] Write unit tests for storage layer

### Deliverables

- TypeScript interfaces/types for bookmarks
- Storage service with full CRUD API
- Duplicate detection logic
- JSON import/export functions

### Estimated Time: 1-2 days

---

## Phase 2: Quick Save Functionality

**Goal:** Enable saving the current page with minimal friction.

### Tasks

- [ ] Create popup UI for quick save (shows current page info)
- [ ] Auto-populate title, URL, favicon from active tab
- [ ] Add optional description/tags input
- [ ] Implement save action (with duplicate handling)
- [ ] Add keyboard shortcuts (Ctrl+Shift+M / Cmd+Shift+M)
- [ ] Add context menu "Save to Miko"
- [ ] Provide visual feedback on successful save

### Deliverables

- Popup component (React) with save form
- Background/service worker for keyboard shortcuts & context menu
- Auto-fill from active tab
- Success/error states

### Estimated Time: 2-3 days

---

## Phase 3: Dashboard & Bookmarks List

**Goal:** Build the main view to browse and find saved bookmarks.

### Tasks

- [ ] Create dashboard view (separate from popup)
- [ ] Display bookmarks in clean, card-based layout
- [ ] Group bookmarks by date (Today, Yesterday, Last 7 days, Earlier)
- [ ] Show favicon, title, URL, saved date
- [ ] Add click to open bookmark
- [ ] Implement sorting (by date created - newest first)
- [ ] Make layout responsive and accessible

### Deliverables

- Dashboard page (options/chrome-extension page)
- Bookmark list component with date grouping
- Empty state when no bookmarks

### Estimated Time: 2-3 days

---

## Phase 4: Search

**Goal:** Make finding bookmarks fast and effortless.

### Tasks

- [ ] Add search input to dashboard
- [ ] Implement fuzzy/full-text search across title, URL, description, tags
- [ ] Add real-time search (as user types)
- [ ] Highlight search matches
- [ ] Add keyboard navigation for search results (↑/↓/Enter)
- [ ] Show "no results" state
- [ ] Optimize search for large lists (virtualization if needed)

### Deliverables

- Search component with instant filtering
- Search algorithm (simple includes + maybe fuzzy matching)
- Keyboard accessible search

### Estimated Time: 1-2 days

---

## Phase 5: Bookmark Management

**Goal:** Allow editing, deleting, and organizing bookmarks.

### Tasks

- [ ] Add edit functionality (title, description, tags)
- [ ] Add delete functionality (with confirmation)
- [ ] Add duplicate detection on manual add/edit
- [ ] Display and manage tags
- [ ] Add "copy URL" action
- [ ] Add "recently saved" view/filter
- [ ] Bulk actions (optional for V1, maybe skip)

### Deliverables

- Edit modal/form
- Delete with confirmation
- Tag display and editing
- Copy URL to clipboard

### Estimated Time: 1-2 days

---

## Phase 6: Polish & UX

**Goal:** Make Miko feel delightful, playful, and fast.

### Tasks

- [ ] Design and implement Miko mascot/branding
- [ ] Add animations/transitions (subtle, playful)
- [ ] Implement keyboard-first navigation globally
- [ ] Add loading/skeleton states
- [ ] Improve empty states with playful copy
- [ ] Add dark/light mode support (respect system preference)
- [ ] Add tooltips for actions
- [ ] Optimize for speed (lazy load, minimal bundle)

### Deliverables

- Polished UI with Miko identity
- Smooth, playful micro-interactions
- Full keyboard navigation support
- Theme support

### Estimated Time: 2-3 days

---

## Phase 7: Import/Export & Data Portability

**Goal:** Ensure users aren't locked into Miko (PRD requirement).

### Tasks

- [ ] Add export to JSON (with all bookmark data)
- [ ] Add import from JSON (validate format, handle duplicates)
- [ ] Add Chrome bookmarks import (read Chrome's bookmark tree)
- [ ] Show import progress/results
- [ ] Add data validation on import
- [ ] Add clear all data option (with strong confirmation)

### Deliverables

- Export functionality
- JSON import with validation & duplicate handling
- Chrome bookmarks importer
- Import/export UI in dashboard

### Estimated Time: 1-2 days

---

## Phase 8: Testing, QA & Release Prep

**Goal:** Ensure quality and prepare for Chrome Web Store submission.

### Tasks

- [ ] Write unit tests for core logic (storage, search, duplicate detection)
- [ ] Write integration tests for key flows
- [ ] Manual QA across Chrome versions
- [ ] Test edge cases (special chars in URLs, very long titles, etc.)
- [ ] Performance testing (large bookmark sets)
- [ ] Accessibility audit (keyboard nav, ARIA)
- [ ] Create icons and promotional images (for store)
- [ ] Write README with install/usage instructions
- [ ] Prepare Chrome Web Store listing (description, screenshots)
- [ ] Test as unpacked extension thoroughly

### Deliverables

- Test suite with good coverage
- QA checklist completed
- Icons (16, 32, 48, 128px)
- README.md
- Store-ready assets
- Final build

### Estimated Time: 2-3 days

---

## Implementation Order & Dependencies

```text
Phase 0 (Setup)
    ↓
Phase 1 (Storage) - foundational
    ↓
Phase 2 (Quick Save) - core UX
    ↓
Phase 3 (Dashboard) - browsing
    ↓
Phase 4 (Search) - discovery
    ↓
Phase 5 (Management) - editing/deleting
    ↓
Phase 6 (Polish) - delight
    ↓
Phase 7 (Import/Export) - portability
    ↓
Phase 8 (Testing/Release) - quality
```

## Tech Stack Recommendation

Based on PRD requirements (fast, lightweight, local-first):

- **Framework:** React + TypeScript
- **Build:** Vite + @crxjs/vite-plugin
- **Styling:** Tailwind CSS (for fast, consistent UI)
- **Storage:** Chrome Storage API (local)
- **Icons:** Lucide React
- **State:** React hooks (no heavy state lib needed for V1)
- **Utils:** date-fns for date grouping

## Success Criteria

- [ ] Save bookmark in < 1 second
- [ ] Search returns results instantly
- [ ] Works completely offline
- [ ] No backend dependency
- [ ] Keyboard-navigable
- [ ] Import/export works reliably
- [ ] Duplicate detection works
- [ ] Under 500KB bundle size (target)

## Notes

- Keep it simple. Avoid over-engineering.
- Prioritize speed and frictionless UX over features.
- Follow Chrome Extension Manifest V3 best practices.
- Ensure all data stays local. No external requests.
- Focus on the core principle: "Save now. Find later. No friction."
