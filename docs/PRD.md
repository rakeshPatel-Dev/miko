# Miko

> **A tiny, playful bookmark companion that saves the good stuff from the internet.**

## 1. Product Overview

**Miko** is a modern Chrome bookmark extension for quickly saving, organizing, and finding useful things from the web.

Instead of competing with Chrome's built-in bookmarks through complexity, Miko focuses on:

- Extremely fast saving
- Beautiful, playful UI
- Excellent search
- Lightweight organization
- Local-first storage
- Keyboard-first interaction
- A memorable mascot-driven identity

Miko should feel like a **tiny companion living in your browser**, not an enterprise bookmark management system.

### Core product principle

> **Save now. Find later. No friction.**

The first version should work completely offline and require **no account or backend**.

---

# 2. Goals

### Primary goals

1. Save the current webpage in one interaction.
2. Make saved pages easy to find later.
3. Keep saved pages organized automatically by date — no manual filing.
4. Make the extension feel delightful and distinctive.
5. Keep the extension extremely fast.
6. Store bookmarks locally so users don't need an account.
7. Provide reliable import/export so users aren't locked into Miko.

### Secondary goals

- Keyboard-first navigation
- Duplicate detection
- Bookmark editing
- Recently saved bookmarks
- Context-menu saving
- Chrome bookmark import

---

# 3. Non-Goals for V1

Do **not** build these initially:

- User accounts
- Cloud backend
- Social bookmarking
- Sharing bookmarks
- AI recommendations
- Webpage archiving
- Screenshot storage
- Browser history replacement
- Team collaboration
- Subscription/payment system
- Mobile application

These can be considered later.

The first version should prove that Miko is useful **without a backend**.

---

# 4. Target Users

### Primary

Developers, students, designers, researchers, and internet-heavy users who constantly encounter useful websites and think:

> "I'll save this and look at it later."

Examples:

- Developer saving documentation
- Student saving research material
- Designer saving inspiration
- Developer saving GitHub repositories
- Researcher collecting articles
- User saving tools they want to try

---

# 5. Core User Experience

The main interaction should be:

```text
Find something interesting
        ↓
Save it
        ↓
Miko confirms it
        ↓
Continue browsing
        ↓
Find it later instantly
```

Saving should never require opening a complicated form.

---

# 6. Technology

## Extension framework

**WXT**

Use WXT for:

- Manifest generation
- Background service worker
- Content scripts
- Extension entrypoints
- Development workflow
- Chrome build

Target browser initially:

**Google Chrome / Chromium**

Keep architecture reasonably browser-agnostic so Firefox/Edge support can be added later.

## Frontend

- React
- TypeScript
- Tailwind CSS
- Lucide React

## Storage

Primary:

**`chrome.storage.local`**

Use a repository abstraction so storage implementation can be replaced later.

Example:

```text
BookmarkRepository
    ↓
StorageRepository
    ↓
chrome.storage.local
```

Do not scatter `chrome.storage` calls throughout React components.

## Icons

Use **Lucide React** for UI icons.

Examples:

- Search
- Plus
- Settings
- MoreHorizontal
- Trash2
- ExternalLink
- Copy
- Check
- Command
- Download
- Upload

The Miko mascot is reserved for branding and empty/success states.

Do not replace every UI icon with mascot illustrations.

---

# 7. Visual Direction

Miko should have a **playful modern SaaS aesthetic**.

Think:

**clean productivity app + cute mascot + excellent micro-interactions**

Avoid:

- Generic dashboard appearance
- Excessive gradients
- Glassmorphism everywhere
- Heavy shadows
- Overly rounded everything
- Excessive animations
- Clutter
- Huge typography
- Rainbow colors

## Color direction

Use a neutral foundation:

- Warm/off-white background
- Charcoal text
- Muted gray secondary text
- Soft borders
- Warm orange/coral Miko accent

Miko's colors should act as the brand accent rather than turning the entire interface orange.

## Typography

Use a modern, highly readable sans-serif.

Hierarchy should be:

```text
Page title
Section title
Bookmark title
Metadata
Secondary information
```

Keep the UI compact because extension popups have limited space.

---

# 8. Main Extension Popup

The popup is the primary experience.

Suggested dimensions:

```text
Width: approximately 380-420px
Height: approximately 550-650px
```

Do not attempt to reproduce a full website inside the popup.

## Header

```text
[Miko mascot] Miko                    [Settings]
```

Below it:

```text
Search your bookmarks...
```

Search should be immediately accessible.

Keyboard shortcut:

```text
Cmd/Ctrl + K
```

focuses the search input.

---

# 9. Popup Home

When no search is active:

```text
┌─────────────────────────────┐
│ Miko                    ⚙   │
│                             │
│ 🔍 Search bookmarks...      │
│                             │
│ + Save current page         │
│                             │
│ Today                       │
│                             │
│ ◉ React Documentation       │
│   react.dev                 │
│                             │
│ Yesterday                   │
│                             │
│ ◉ GitHub                    │
│   github.com                │
│                             │
│ This week                   │
│                             │
│ ◉ MDN Web Docs              │
│   developer.mozilla.org     │
└─────────────────────────────┘
```

The actual UI should use Lucide icons rather than emoji.

---

# 10. Save Current Page

The most important action.

User clicks:

**Save current page**

Miko automatically captures:

- URL
- Page title
- Favicon if available
- Timestamp
- Domain

Example:

```ts
type Bookmark = {
  id: string
  url: string
  title: string
  domain: string
  favicon?: string
  createdAt: number
  updatedAt: number
}
```

## Saving behavior

If the URL does not exist:

```text
Save bookmark
      ↓
Success
      ↓
"Miko tucked it away ✨"
```

Show a subtle success animation.

If the URL already exists:

```text
Already saved
```

Offer:

- Open bookmark
- Edit bookmark
- Close

Do not create duplicates by default.

---

# 11. Quick Save Shortcut

Provide a configurable keyboard shortcut.

Default:

```text
Ctrl + Shift + S
```

On macOS:

```text
Command + Shift + S
```

The shortcut should save the current active tab.

If the page is already saved, show a small notification rather than creating a duplicate.

---

# 12. Right-Click Context Menu

Add:

```text
Save to Miko
```

When right-clicking a page.

Also support:

```text
Save link to Miko
```

when right-clicking a link.

For V1, context-menu saving should save the URL and basic metadata.

---

# 13. Bookmark Card

Each bookmark should display:

```text
[Favicon]  React Documentation
           react.dev
           2 hours ago
```

Actions:

- Open
- Edit
- Delete
- More

Avoid displaying too much metadata.

The bookmark title is the primary information.

---

# 14. Bookmark Editing

Users can edit:

### Title

Example:

```text
React Hooks Documentation
```

The title is the only editable field in V1.

Users can also open and delete bookmarks from the card.

---

# 15. Search

Search is one of Miko's most important features.

Search across:

- Title
- URL
- Domain

Example:

```text
react auth
```

should find:

```text
React Authentication Guide
NextAuth Documentation
React OAuth Tutorial
```

Search should feel instant.

For V1, implement client-side search.

For small datasets, straightforward filtering is sufficient.

Do not introduce an unnecessarily complex search engine.

---

# 16. Filters

Provide lightweight filters:

```text
All
Recent
```

Optional sorting:

```text
Recently saved
Alphabetical
```

Keep filtering simple.

---

# 17. Date-Based Organization

Bookmarks are stored and displayed on a date basis.

The saved date (`createdAt`) is the primary sort and grouping key.

Group headers:

```text
Today
Yesterday
This week
Earlier
```

Within each group, newest first.

This keeps the list scannable without folders, tags, or nested structures. Saving is the only organization step the user ever takes.

---

# 18. Recently Saved

Show the most recently saved bookmarks.

Default:

**10 items**

Provide:

```text
View all
```

This is especially useful because many users save things with the intention of returning to them soon.

---

# 19. Empty States

Empty states should be playful and use Miko.

### No bookmarks

```text
[Miko illustration]

Nothing tucked away yet.

Found something useful?
Miko can keep it safe.

[Save current page]
```

### No search results

```text
[Miko looking confused]

Miko couldn't find that.

Try a different word.
```

Keep copy short and playful.

---

# 20. Mascot System

Miko should become part of the product identity.

Use Miko in:

- Empty states
- Save confirmation
- First-run experience
- Import success
- Error states
- About page

Do not put Miko everywhere.

The mascot should feel special.

Possible microcopy:

```text
"Tucked away!"

"Already in the stash."

"Miko found it."

"Nothing here yet."

"Oops, Miko couldn't save that."

"Your stash is getting cozy."
```

Keep the tone playful but not annoying.

---

# 21. First-Run Experience

On first installation:

```text
[Miko]

Hey, I'm Miko.

I keep the good stuff you find
on the internet.

Save a page now and I'll
remember it for you.

[Let's go]
```

Then explain:

```text
Ctrl + Shift + S
```

for quick saving.

Keep onboarding under 2-3 screens.

No account creation.

---

# 22. Import

Support importing existing bookmarks.

V1:

**Import Chrome bookmarks HTML**

Allow users to select an exported bookmarks HTML file.

Parse:

- URL
- Title

Show:

```text
Imported 248 bookmarks.

Miko has a lot to remember now. 🐿️
```

Handle duplicate URLs intelligently.

Imported bookmarks keep their original saved date where available, so they land in the correct date group.

---

# 23. Export

Provide:

**Export bookmarks**

Export all Miko data as JSON.

Example:

```json
{
  "version": 1,
  "exportedAt": 1790000000000,
  "bookmarks": []
}
```

This is mandatory for V1.

Users should always be able to take their data out.

---

# 24. Settings

Settings should include:

### Appearance

- Light
- Dark
- System

### Behavior

- Save duplicate behavior
- Open bookmark in new tab
- Show save confirmation

### Data

- Import bookmarks
- Export bookmarks
- Clear all data

### Keyboard shortcuts

Provide instructions for configuring Chrome extension shortcuts.

---

# 25. Data Model

## Bookmark

```ts
type Bookmark = {
  id: string
  url: string
  title: string
  domain: string
  favicon?: string

  createdAt: number
  updatedAt: number
}
```

## Settings

```ts
type Settings = {
  theme: 'light' | 'dark' | 'system'
  duplicateBehavior: 'notify' | 'open-existing'
  showSaveConfirmation: boolean
}
```

---

# 26. Storage Architecture

Create a storage layer.

Example:

```text
src/
├── lib/
│   └── storage/
│       ├── bookmark-repository.ts
│       └── settings-repository.ts
```

React components should never directly manipulate `chrome.storage.local`.

Use repository methods such as:

```ts
getBookmarks()
getBookmark(id)
createBookmark()
updateBookmark()
deleteBookmark()
findByUrl()
searchBookmarks()
```

This keeps the application maintainable and makes future migration easier.

---

# 27. WXT Architecture

Suggested structure:

```text
src/
├── entrypoints/
│   ├── popup/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── background.ts
│   └── options/
│
├── components/
│   ├── bookmarks/
│   ├── search/
│   ├── layout/
│   └── ui/
│
├── lib/
│   ├── storage/
│   ├── bookmarks/
│   ├── search/
│   └── utils/
│
├── hooks/
│
├── types/
│
└── assets/
    └── miko/
```

Use WXT's conventions rather than fighting the framework.

---

# 28. Tailwind Rules

Tailwind should provide the majority of styling.

Do not create a giant custom design system for V1.

Establish a small set of semantic design tokens for:

- Background
- Foreground
- Muted text
- Border
- Accent
- Destructive
- Card

Use consistent spacing and radius.

Avoid arbitrary one-off values throughout components.

---

# 29. Animation

Animations should make Miko feel alive without slowing the interface.

Use subtle transitions for:

- Bookmark saved
- Opening/closing panels
- Search results
- Hover states
- Empty-state mascot
- Date group reveal

Good animation:

```text
100–250ms
```

Avoid:

- Constant bouncing
- Excessive spring animations
- Long page transitions
- Animations that delay interaction

The UI should feel **fast first, playful second**.

---

# 30. Performance Requirements

Miko should feel almost instantaneous.

Targets:

- Popup opens quickly
- Search responds immediately
- Saving takes one interaction
- No unnecessary network requests
- No backend required
- No large dependencies without justification
- Lazy-load non-critical UI where appropriate

Do not fetch webpage content just to make the application look sophisticated.

---

# 31. Privacy

Miko should have a strong privacy story.

V1:

**No backend.**

All bookmark data remains locally stored in the extension.

Do not:

- Track browsing history
- Send URLs to a server
- Collect analytics by default
- Inject unnecessary scripts into webpages

Request the minimum Chrome permissions required.

Explain permissions clearly.

---

# 32. Error Handling

Errors should be understandable.

Examples:

### Save failed

```text
Miko couldn't save this page.

Try again.
```

### Invalid import

```text
That file doesn't look like a bookmark export.

Try exporting your bookmarks as HTML.
```

### Storage failure

```text
Miko couldn't access its storage.

Please try again.
```

Avoid exposing raw browser errors to users.

Log useful technical information during development.

---

# 33. Accessibility

The extension must support:

- Keyboard navigation
- Visible focus states
- Semantic buttons
- Accessible labels
- Sufficient color contrast
- Reduced-motion preference

Every icon-only button must have an accessible label.

Do not rely solely on color to communicate state.

---

# 34. Security

- Sanitize imported bookmark data.
- Treat bookmark titles as untrusted content.
- Never use unsafe HTML rendering for bookmark metadata.
- Validate URLs before storing them.
- Avoid unnecessary permissions.
- Never execute saved page content.

---

# 35. V1 Feature Priority

## P0 - Must have

- Save current page
- Popup
- Bookmark list grouped by date
- Search
- Open bookmark
- Delete bookmark
- Edit bookmark title
- `chrome.storage.local`
- Duplicate detection
- Import
- Export
- Dark/light/system theme
- Keyboard shortcut
- Context menu
- Miko branding

## P1 - Should have

- Recently saved
- Sorting
- Better search
- Chrome bookmark import
- Playful save animations
- First-run onboarding

## P2 - Later

- Cloud sync
- Accounts
- Cross-device synchronization
- AI categorization
- Smart summaries
- Automatic dead-link detection
- Shared bookmark pages
- Firefox support
- Edge support

---

# 36. V1 Definition of Done

Miko V1 is complete when a user can:

1. Install the extension.
2. Open Miko.
3. Save the current webpage.
4. See the saved bookmark immediately under the correct date group.
5. Close Chrome.
6. Reopen Chrome.
7. Find the bookmark again.
8. Search for it.
9. Edit its title.
10. Delete it.
11. Import existing bookmarks.
12. Export Miko bookmarks.
13. Use Miko without creating an account.
14. Use the extension without an internet connection after installation.

---

# 37. Product Personality

Miko should have a consistent voice.

### Good

> "Tucked away!"

> "Miko found it."

> "Your stash is getting cozy."

> "Nothing here yet."

> "Already saved. Miko remembered."

### Bad

> "Bookmark successfully created."

> "Operation completed."

> "Resource successfully persisted."

The product can be playful without becoming childish.

---

# 38. Design Principle

The most important rule:

> **Miko should feel like a tiny, exceptionally good tool, not a tiny website stuffed inside Chrome.**

Every feature should answer one question:

**Does this make saving or finding something easier?**

If not, it probably doesn't belong in V1.
