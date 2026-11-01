import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  Keyboard,
  Library,
  Pencil,
  Search,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import { deleteBookmark, getAllBookmarks, updateBookmark } from '../../src/lib/storage'
import { filterBookmarks } from '../../src/lib/search'
import type { Bookmark } from '../../src/types/bookmark'
import mikoMascot from '../../miko.svg'
import { differenceInCalendarDays, format, isToday, isYesterday } from 'date-fns'

const DAY_LABEL = "d MMM ''yy, EEEE"

type BookmarkDay = {
  key: string
  label: string
  date: Date
  items: Bookmark[]
}

type BookmarkSection = {
  title: 'Today' | 'Yesterday' | 'This week' | 'Earlier'
  days: BookmarkDay[]
}

function groupByDate(bookmarks: Bookmark[]) {
  const days = new Map<string, BookmarkDay>()

  for (const bookmark of bookmarks) {
    const date = new Date(bookmark.createdAt)
    const key = format(date, 'yyyy-MM-dd')

    if (!days.has(key)) {
      days.set(key, { key, label: format(date, DAY_LABEL), date, items: [] })
    }

    days.get(key)!.items.push(bookmark)
  }

  const sortedDays = [...days.values()].sort((a, b) => b.date.getTime() - a.date.getTime())
  const sections: BookmarkSection[] = [
    { title: 'Today', days: [] },
    { title: 'Yesterday', days: [] },
    { title: 'This week', days: [] },
    { title: 'Earlier', days: [] },
  ]
  const now = new Date()

  for (const day of sortedDays) {
    if (isToday(day.date)) sections[0].days.push(day)
    else if (isYesterday(day.date)) sections[1].days.push(day)
    else if (differenceInCalendarDays(now, day.date) < 7) sections[2].days.push(day)
    else sections[3].days.push(day)
  }

  return sections.filter((section) => section.days.length > 0)
}

export default function Popup() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [screen, setScreen] = useState<'links' | 'settings'>('links')
  const [commands, setCommands] = useState<chrome.commands.Command[]>([])

  useEffect(() => {
    getAllBookmarks().then((items) => {
      setBookmarks(items.sort((a, b) => b.createdAt - a.createdAt))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (screen === 'settings') chrome.commands.getAll().then(setCommands)
  }, [screen])

  const results = useMemo(() => filterBookmarks(bookmarks, query).slice(0, 20), [bookmarks, query])
  const groups = useMemo(() => groupByDate(results), [results])

  const openBookmark = (bookmark: Bookmark) => {
    chrome.tabs.create({ url: bookmark.url })
    window.close()
  }

  const startEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id)
    setEditTitle(bookmark.title)
  }

  const saveEdit = async (bookmark: Bookmark) => {
    const title = editTitle.trim()
    if (!title) return
    const updated = await updateBookmark({ id: bookmark.id, title })
    if (updated)
      setBookmarks((items) => items.map((item) => (item.id === updated.id ? updated : item)))
    setEditingId(null)
  }

  const removeBookmark = async (id: string) => {
    await deleteBookmark(id)
    setBookmarks((items) => items.filter((item) => item.id !== id))
    setEditingId(null)
  }

  return (
    <main className="flex h-[540px] w-[420px] flex-col overflow-hidden bg-card text-fg">
      {screen === 'settings' ? (
        <SettingsScreen commands={commands} onBack={() => setScreen('links')} />
      ) : (
        <>
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2.5">
              <img
                src={mikoMascot}
                alt=""
                className="h-8 w-8 rounded-[10px] object-cover shadow-sm"
              />
              <div>
                <p className="text-[15px] font-bold tracking-[-0.02em]">Miko</p>
                <p className="text-[11px] text-muted">Your saved links</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-lg bg-accent-soft px-2.5 py-1.5 text-[11px] font-semibold text-accent-text">
                {bookmarks.length}
              </span>
              <button
                onClick={() => setScreen('settings')}
                className="rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-fg"
                title="Open settings"
                aria-label="Open settings"
              >
                <Settings size={16} />
              </button>
            </div>
          </header>

          <div className="px-5 pb-3 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your links"
                aria-label="Search your saved links"
                className="w-full rounded-xl border border-line bg-canvas py-2.5 pl-9 pr-3 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent-ring"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3" aria-live="polite">
            {loading ? (
              <div className="space-y-2 px-2 pt-2" aria-label="Loading saved links">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-[60px] animate-pulse rounded-xl bg-line/60" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="text-muted">
                  {bookmarks.length === 0 ? <Library size={24} /> : <Search size={24} />}
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {bookmarks.length === 0 ? 'Nothing saved yet' : 'No links found'}
                </p>
                <p className="mt-1 max-w-[250px] text-xs leading-5 text-muted">
                  {bookmarks.length === 0
                    ? 'Press Alt + Shift + S on any page to save it instantly.'
                    : 'Try a different search term.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group) => {
                  const showRowDate = group.title === 'Today' || group.title === 'Yesterday'
                  return (
                    <section key={group.title} aria-label={group.title}>
                      <h2 className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-muted">
                        {group.title}
                      </h2>
                      <div className="space-y-3">
                        {group.days.map((day) => (
                          <div key={day.key}>
                            {!showRowDate && (
                              <h3 className="px-3 pb-1 text-[11px] font-medium text-muted">
                                {day.label}
                              </h3>
                            )}
                            <div className="space-y-1">
                              {day.items.map((bookmark) => (
                                <div
                                  key={bookmark.id}
                                  className="group flex w-full items-start gap-2 rounded-xl px-3 py-3 text-left transition hover:bg-canvas"
                                >
                                  {bookmark.favicon ? (
                                    <img
                                      src={bookmark.favicon}
                                      alt=""
                                      className="mt-0.5 h-5 w-5 shrink-0 rounded object-contain"
                                      onError={(event) => {
                                        event.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded bg-accent-soft" />
                                  )}
                                  {editingId === bookmark.id ? (
                                    <div className="min-w-0 flex-1">
                                      <input
                                        autoFocus
                                        value={editTitle}
                                        onChange={(event) => setEditTitle(event.target.value)}
                                        onKeyDown={(event) => {
                                          if (event.key === 'Enter') saveEdit(bookmark)
                                          if (event.key === 'Escape') setEditingId(null)
                                        }}
                                        className="w-full rounded-lg border border-accent bg-canvas px-2 py-1 text-sm text-fg outline-none focus:ring-2 focus:ring-accent-ring"
                                      />
                                      <span className="mt-1 block truncate text-xs text-muted">
                                        {bookmark.domain}
                                        {showRowDate ? ` · ${day.label}` : ''}
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => openBookmark(bookmark)}
                                      className="min-w-0 flex-1 text-left focus:outline-none"
                                    >
                                      <span className="block truncate text-sm font-semibold text-fg">
                                        {bookmark.title}
                                      </span>
                                      <span className="mt-1 block truncate text-xs text-muted">
                                        {bookmark.domain}
                                        {showRowDate ? ` · ${day.label}` : ''}
                                      </span>
                                    </button>
                                  )}
                                  <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                                    {editingId === bookmark.id ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => saveEdit(bookmark)}
                                          className="rounded-lg p-1.5 text-accent-text hover:bg-accent-soft"
                                          title="Save title"
                                          aria-label="Save title"
                                        >
                                          <Check size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditingId(null)}
                                          className="rounded-lg p-1.5 text-muted hover:bg-line"
                                          title="Cancel edit"
                                          aria-label="Cancel edit"
                                        >
                                          <X size={14} />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => startEditing(bookmark)}
                                        className="rounded-lg p-1.5 text-muted hover:bg-line hover:text-fg"
                                        title="Edit title"
                                        aria-label={`Edit ${bookmark.title}`}
                                      >
                                        <Pencil size={14} />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => removeBookmark(bookmark.id)}
                                      className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-danger"
                                      title="Delete bookmark"
                                      aria-label={`Delete ${bookmark.title}`}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </div>

          <footer className="border-t border-line px-5 py-3 text-center text-[11px] text-muted">
            {bookmarks.length} {bookmarks.length === 1 ? 'saved link' : 'saved links'} · Alt + Shift
            + S to save
          </footer>
        </>
      )}
    </main>
  )
}

function SettingsScreen({
  commands,
  onBack,
}: {
  commands: chrome.commands.Command[]
  onBack: () => void
}) {
  const saveCommand = commands.find((command) => command.name === 'quick-save')
  const openCommand = commands.find((command) => command.name === 'open-popup')

  const openChromeShortcuts = () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-line px-5 py-4">
        <button
          onClick={onBack}
          className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-fg"
          aria-label="Back to saved links"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <p className="text-[15px] font-bold">Settings</p>
          <p className="text-[11px] text-muted">Keyboard shortcuts</p>
        </div>
      </header>
      <div className="flex-1 px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-accent-soft p-2.5 text-accent-text">
            <Keyboard size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Shortcuts</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Chrome owns extension keybinds. Change them in Chrome’s shortcut manager.
            </p>
          </div>
        </div>
        <div className="mt-5 divide-y divide-line rounded-xl border border-line">
          <ShortcutRow label="Quick save" value={saveCommand?.shortcut} />
          <ShortcutRow label="Open Miko" value={openCommand?.shortcut} />
        </div>
        <button
          type="button"
          onClick={openChromeShortcuts}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-fg hover:bg-accent-hover"
        >
          <Keyboard size={16} /> Change shortcuts in Chrome
        </button>
        <p className="mt-3 text-center text-[11px] leading-5 text-muted">
          Allowed examples: Alt + Shift + letter or Ctrl + Shift + letter. Ctrl + Alt is not
          supported by Chrome extension commands.
        </p>
      </div>
    </div>
  )
}

function ShortcutRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-4">
      <span className="text-sm font-medium">{label}</span>
      <kbd className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs font-semibold text-muted">
        {value || 'Not set'}
      </kbd>
    </div>
  )
}
