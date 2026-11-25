import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Keyboard,
  Library,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Trash2,
  X,
} from 'lucide-react'
import { deleteBookmark, queryBookmarks, updateBookmark } from '../../src/lib/storage'
import { savePageWithToast } from '../../src/lib/save-page'
import {
  DEFAULT_TOAST_MESSAGES,
  TOAST_MESSAGE_MAX_LENGTH,
  getToastMessages,
  saveToastMessages,
  type ToastMessages,
} from '../../src/lib/settings'
import type { Bookmark } from '../../src/types/bookmark'
import mikoMascot from '../../miko.svg'
import { differenceInCalendarDays, format, isToday, isYesterday } from 'date-fns'

const DAY_LABEL = "d MMM ''yy, EEEE"
const BOOKMARK_PAGE_SIZE = 20
const FEEDBACK_ENDPOINT = import.meta.env.VITE_FEEDBACK_FORM_URL?.trim() ?? ''
const FEEDBACK_TYPES = [
  {
    value: 'feedback',
    label: 'Feedback',
    description: 'Something to improve or clarify',
  },
  {
    value: 'feature',
    label: 'Feature request',
    description: 'An idea for what Miko should do next',
  },
] as const
type FeedbackType = (typeof FEEDBACK_TYPES)[number]['value']

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
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [screen, setScreen] = useState<'links' | 'settings' | 'feedback'>('links')
  const [commands, setCommands] = useState<chrome.commands.Command[]>([])
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveFeedback, setSaveFeedback] = useState<'idle' | 'saved' | 'duplicate'>('idle')
  const [refreshKey, setRefreshKey] = useState(0)
  const [hasMoreBookmarks, setHasMoreBookmarks] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const latestQuery = useRef(query)

  useEffect(() => {
    latestQuery.current = query
    let active = true
    setLoading(true)
    setHasMoreBookmarks(false)
    setLoadingMore(false)
    const timer = window.setTimeout(() => {
      queryBookmarks(query, BOOKMARK_PAGE_SIZE)
        .then(({ bookmarks: items, total, hasMore }) => {
          if (!active) return
          setBookmarks(items)
          setBookmarkCount(total)
          setHasMoreBookmarks(hasMore)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Failed to load bookmarks:', error)
          if (!active) return
          setBookmarks([])
          setBookmarkCount(0)
          setLoading(false)
        })
    }, 120)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [query, refreshKey])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      setActiveTab(tab ?? null)
    })
  }, [])

  useEffect(() => {
    if (screen === 'settings') chrome.commands.getAll().then(setCommands)
  }, [screen])

  useEffect(() => {
    if (saveFeedback === 'idle') return
    const timer = window.setTimeout(() => setSaveFeedback('idle'), 2400)
    return () => window.clearTimeout(timer)
  }, [saveFeedback])

  const activeUrl = activeTab?.url
  const pageSavable = activeTab?.id != null && !!activeUrl && /^https?:\/\//.test(activeUrl)
  const canSave = pageSavable && !saving

  const results = bookmarks
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
    if (updated) setRefreshKey((value) => value + 1)
    setEditingId(null)
  }

  const notifyBookmarksChanged = () => {
    void chrome.runtime.sendMessage({ type: 'miko:bookmarks-changed' }).catch(() => undefined)
  }

  const loadMoreBookmarks = async () => {
    if (loadingMore || !hasMoreBookmarks) return

    const requestQuery = query
    setLoadingMore(true)
    try {
      const page = await queryBookmarks(requestQuery, BOOKMARK_PAGE_SIZE, bookmarks.length)
      if (latestQuery.current !== requestQuery) return
      setBookmarks((items) => [...items, ...page.bookmarks])
      setHasMoreBookmarks(page.hasMore)
    } catch (error) {
      console.error('Failed to load more bookmarks:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const removeBookmark = async (id: string) => {
    const removed = await deleteBookmark(id)
    if (removed) notifyBookmarksChanged()
    setRefreshKey((value) => value + 1)
    setEditingId(null)
  }

  const saveCurrentPage = async () => {
    const tab = activeTab
    if (!tab || !canSave) return

    setSaving(true)
    setSaveFeedback('idle')

    try {
      const result = await savePageWithToast(tab)
      if (!result) return

      if (result.status === 'saved') setRefreshKey((value) => value + 1)
      if (result.status === 'saved') notifyBookmarksChanged()
      setSaveFeedback(result.status)
    } catch (error) {
      console.error('Failed to save bookmark:', error)
    } finally {
      setSaving(false)
    }
  }

  const saveLabel = saving
    ? 'Saving…'
    : saveFeedback === 'saved'
      ? 'Saved to Miko'
      : saveFeedback === 'duplicate'
        ? 'Already in Miko'
        : 'Save current page'

  return (
    <main className="flex h-[540px] w-[420px] flex-col overflow-hidden bg-card text-fg">
      {screen === 'settings' ? (
        <SettingsScreen commands={commands} onBack={() => setScreen('links')} />
      ) : screen === 'feedback' ? (
        <FeedbackScreen onBack={() => setScreen('links')} />
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
              <span
                className="rounded-lg bg-accent-soft px-2.5 py-1.5 text-[11px] font-semibold text-accent-text"
                title={`${bookmarkCount} saved bookmarks`}
                aria-label={`${bookmarkCount} saved bookmarks`}
              >
                {bookmarkCount}
              </span>
              <button
                onClick={() => setScreen('feedback')}
                className="rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-fg"
                title="Send feedback or request a feature"
                aria-label="Send feedback or request a feature"
              >
                <CircleHelp size={16} />
              </button>
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
            <button
              type="button"
              onClick={saveCurrentPage}
              disabled={!canSave}
              title={pageSavable ? 'Save this page to Miko' : 'Miko cannot save this page'}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saveFeedback === 'saved' || saveFeedback === 'duplicate' ? (
                <Check size={16} />
              ) : (
                <Plus size={16} />
              )}
              {saveLabel}
            </button>
          </div>

          <div className="miko-scrollbar min-h-0 flex-1 px-3 pb-3" aria-live="polite">
            {loading ? (
              <div className="space-y-2 px-2 pt-2" aria-label="Loading saved links">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-[60px] animate-pulse rounded-xl bg-line/60" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="text-muted">
                  {bookmarkCount === 0 ? <Library size={24} /> : <Search size={24} />}
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {bookmarkCount === 0 ? 'Nothing saved yet' : 'No links found'}
                </p>
                <p className="mt-1 max-w-[250px] text-xs leading-5 text-muted">
                  {bookmarkCount === 0
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
            {!loading && hasMoreBookmarks && (
              <button
                type="button"
                onClick={loadMoreBookmarks}
                disabled={loadingMore}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2.5 text-xs font-semibold text-fg transition hover:bg-line/60 disabled:cursor-wait disabled:opacity-60"
              >
                {loadingMore ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ChevronDown size={14} />
                )}
                {loadingMore ? 'Loading more…' : 'Load more bookmarks'}
              </button>
            )}
          </div>

          <footer className="border-t border-line px-5 py-3 text-center text-[11px] text-muted">
            {bookmarkCount} {bookmarkCount === 1 ? 'saved link' : 'saved links'} · Alt + Shift + S
            to save
          </footer>
        </>
      )}
    </main>
  )
}

function FeedbackScreen({ onBack }: { onBack: () => void }) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feedback')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const clearError = () => {
    if (status === 'error') {
      setStatus('idle')
      setStatusMessage('')
    }
  }

  const showValidationError = () => {
    setStatus('error')
    setStatusMessage('Not submitted. Check the highlighted fields and try again.')
  }

  const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    if (!FEEDBACK_ENDPOINT) {
      setStatus('error')
      setStatusMessage('Not submitted. Feedback is not configured for this build.')
      return
    }

    const form = event.currentTarget
    if (!form.reportValidity()) {
      showValidationError()
      return
    }

    if (!message.trim()) {
      setStatus('error')
      setStatusMessage('Not submitted. Add a little more detail so we know what to improve.')
      return
    }

    setStatus('submitting')
    setStatusMessage('Sending your note…')

    const formData = new FormData(form)
    formData.set('type', feedbackType === 'feature' ? 'Feature request' : 'Feedback')
    formData.set('message', message.trim())
    formData.set('source', 'Miko browser extension')

    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        body: formData,
        credentials: 'omit',
      })

      if (!response.ok) throw new Error(`Basin returned ${response.status}`)

      setMessage('')
      setEmail('')
      setStatus('success')
      setStatusMessage('Thanks — your note was sent. Basin’s confirmation page is opening too.')
      void chrome.tabs
        .create({ url: response.url || FEEDBACK_ENDPOINT })
        .catch((error) => console.error('Could not open Basin confirmation page:', error))
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      setStatus('error')
      setStatusMessage('Not submitted. Check your connection and try again.')
    }
  }

  const startAnotherNote = () => {
    setStatus('idle')
    setStatusMessage('')
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-line px-5 py-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-fg"
          aria-label="Back to saved links"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <p className="text-[15px] font-bold">Help & feedback</p>
          <p className="text-[11px] text-muted">Help shape what Miko becomes</p>
        </div>
      </header>

      {status === 'success' ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="rounded-2xl bg-accent-soft p-3 text-accent-text">
            <Check size={22} />
          </div>
          <p className="mt-4 text-base font-semibold">Thanks for helping Miko grow.</p>
          <p className="mt-2 max-w-[280px] text-xs leading-5 text-muted">{statusMessage}</p>
          <button
            type="button"
            onClick={startAnotherNote}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-line/60"
          >
            Send another note
          </button>
        </div>
      ) : (
        <div className="miko-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-xl bg-accent-soft p-2.5 text-accent-text">
              <CircleHelp size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">A quick note?</p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Share feedback or tell us what you’d love to see next.
              </p>
            </div>
          </div>

          <form
            action={FEEDBACK_ENDPOINT || undefined}
            method="POST"
            encType="multipart/form-data"
            onSubmit={submitFeedback}
            onInvalid={showValidationError}
          >
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.12em] text-muted">
                I’m sharing
              </span>
              <FeedbackTypeMenu
                value={feedbackType}
                onChange={(value) => {
                  setFeedbackType(value)
                  clearError()
                }}
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.12em] text-muted">
                Your note
              </span>
              <textarea
                name="message"
                required
                rows={5}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value)
                  clearError()
                }}
                placeholder="What should we know?"
                className="w-full resize-none rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm leading-5 text-fg outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent-ring"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.12em] text-muted">
                Email <span className="font-normal normal-case tracking-normal">(optional)</span>
              </span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  clearError()
                }}
                placeholder="If you’d like a reply"
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent-ring"
              />
            </label>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60"
            >
              {status === 'submitting' ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {status === 'submitting' ? 'Sending…' : 'Send note'}
            </button>

            <p
              className={`mt-3 min-h-5 text-center text-[11px] leading-5 ${
                status === 'error'
                  ? 'text-danger'
                  : status === 'submitting'
                    ? 'text-muted'
                    : 'text-accent-text'
              }`}
              aria-live="polite"
              role="status"
            >
              {statusMessage}
            </p>
          </form>
        </div>
      )}
    </div>
  )
}

function FeedbackTypeMenu({
  value,
  onChange,
}: {
  value: FeedbackType
  onChange: (value: FeedbackType) => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const selected = FEEDBACK_TYPES.find((option) => option.value === value) ?? FEEDBACK_TYPES[0]

  useEffect(() => {
    if (!open) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const chooseOption = (nextValue: FeedbackType) => {
    onChange(nextValue)
    setOpen(false)
  }

  return (
    <div ref={menuRef} className="relative">
      <input type="hidden" name="type" value={selected.label} />
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-canvas px-3 py-2.5 text-left text-sm text-fg outline-none transition focus:ring-2 focus:ring-accent-ring ${
          open ? 'border-accent ring-2 ring-accent-ring' : 'border-line hover:border-accent/60'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="feedback-type-options"
      >
        <span>
          <span className="block font-semibold">{selected.label}</span>
          <span className="mt-0.5 block text-xs text-muted">{selected.description}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          id="feedback-type-options"
          role="listbox"
          aria-label="Feedback type"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-line bg-card p-1.5 shadow-lg"
        >
          {FEEDBACK_TYPES.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => chooseOption(option.value)}
                className={`flex w-full items-start justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition ${
                  isSelected ? 'bg-accent-soft' : 'hover:bg-canvas'
                }`}
              >
                <span>
                  <span className="block text-sm font-semibold text-fg">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{option.description}</span>
                </span>
                {isSelected && <Check size={15} className="mt-0.5 shrink-0 text-accent-text" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
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
  const removeCommand = commands.find((command) => command.name === 'quick-remove')
  const openCommand = commands.find((command) => command.name === 'open-popup')
  const [toastMessages, setToastMessages] = useState<ToastMessages>(() => ({
    ...DEFAULT_TOAST_MESSAGES,
  }))
  const [toastStatus, setToastStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  useEffect(() => {
    let active = true
    getToastMessages().then((messages) => {
      if (active) setToastMessages(messages)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (toastStatus === 'idle') return
    const timer = window.setTimeout(() => setToastStatus('idle'), 2200)
    return () => window.clearTimeout(timer)
  }, [toastStatus])

  const openChromeShortcuts = () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }

  const updateToastMessage = (key: keyof ToastMessages, value: string) => {
    setToastMessages((current) => ({ ...current, [key]: value }))
    setToastStatus('idle')
  }

  const commitToastMessages = async (messages: ToastMessages) => {
    try {
      const saved = await saveToastMessages(messages)
      setToastMessages(saved)
      setToastStatus('saved')
    } catch (error) {
      console.error('Failed to save toast messages:', error)
      setToastStatus('error')
    }
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
          <p className="text-[11px] text-muted">Shortcuts & messages</p>
        </div>
      </header>
      <div className="miko-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5">
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
          <ShortcutRow label="Quick remove" value={removeCommand?.shortcut} />
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

        <div className="mt-7 flex items-start gap-3">
          <div className="rounded-xl bg-accent-soft p-2.5 text-accent-text">
            <Bell size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Toast messages</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              The text shown on the page after Miko saves or removes a link.
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <ToastMessageField
            label="New bookmark"
            value={toastMessages.saved}
            onChange={(value) => updateToastMessage('saved', value)}
            onCommit={() => commitToastMessages(toastMessages)}
          />
          <ToastMessageField
            label="Already saved"
            value={toastMessages.duplicate}
            onChange={(value) => updateToastMessage('duplicate', value)}
            onCommit={() => commitToastMessages(toastMessages)}
          />
          <ToastMessageField
            label="Removed bookmark"
            value={toastMessages.removed}
            onChange={(value) => updateToastMessage('removed', value)}
            onCommit={() => commitToastMessages(toastMessages)}
          />
          <ToastMessageField
            label="Not saved"
            value={toastMessages.notFound}
            onChange={(value) => updateToastMessage('notFound', value)}
            onCommit={() => commitToastMessages(toastMessages)}
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => commitToastMessages(toastMessages)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
          >
            <Check size={15} /> Save messages
          </button>
          <button
            type="button"
            onClick={() => commitToastMessages(DEFAULT_TOAST_MESSAGES)}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm font-semibold text-fg transition hover:bg-line/60"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
        <p
          className={`mt-2 min-h-4 text-[11px] ${
            toastStatus === 'error' ? 'text-danger' : 'text-accent-text'
          }`}
          aria-live="polite"
        >
          {toastStatus === 'saved'
            ? 'Toast messages saved.'
            : toastStatus === 'error'
              ? 'Could not save. Try again.'
              : ''}
        </p>
      </div>
    </div>
  )
}

function ToastMessageField({
  label,
  value,
  onChange,
  onCommit,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onCommit: () => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.12em] text-muted">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onCommit()
        }}
        maxLength={TOAST_MESSAGE_MAX_LENGTH}
        spellCheck={false}
        className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent-ring"
      />
    </label>
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
