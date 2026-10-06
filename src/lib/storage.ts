import type { Bookmark, BookmarkCreateInput, BookmarkUpdateInput } from '../types/bookmark'

const STORAGE_KEY = 'miko_bookmarks'

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function isValidBookmarkUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false
  try {
    const protocol = new URL(url).protocol
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  const stored = result[STORAGE_KEY] as
    | Array<Bookmark & { description?: string; tags?: string[] }>
    | undefined
  const bookmarks = (stored || []).map(
    ({ description: _description, tags: _tags, ...bookmark }) => ({
      ...bookmark,
      domain: bookmark.domain || getDomain(bookmark.url),
    }),
  )

  // Clean fields from older versions once, while preserving the bookmark data users need.
  if ((stored || []).some((bookmark) => 'description' in bookmark || 'tags' in bookmark)) {
    await chrome.storage.local.set({ [STORAGE_KEY]: bookmarks })
  }
  return bookmarks
}

async function saveBookmarks(bookmarks: Bookmark[]) {
  await chrome.storage.local.set({ [STORAGE_KEY]: bookmarks })
}

export async function addBookmark(input: BookmarkCreateInput): Promise<Bookmark> {
  if (!isValidBookmarkUrl(input.url)) throw new Error('Invalid bookmark URL')
  const bookmarks = await getAllBookmarks()
  const existing = bookmarks.find((bookmark) => bookmark.url === input.url)
  if (existing) return existing

  const now = Date.now()
  const bookmark: Bookmark = {
    id: crypto.randomUUID(),
    url: input.url,
    domain: input.domain || getDomain(input.url),
    title: input.title || input.url,
    favicon: input.favicon,
    createdAt: now,
    updatedAt: now,
  }

  bookmarks.unshift(bookmark)
  await saveBookmarks(bookmarks)
  return bookmark
}

export async function updateBookmark(input: BookmarkUpdateInput): Promise<Bookmark | null> {
  const bookmarks = await getAllBookmarks()
  const index = bookmarks.findIndex((bookmark) => bookmark.id === input.id)
  if (index === -1) return null

  bookmarks[index] = { ...bookmarks[index], ...input, updatedAt: Date.now() }
  await saveBookmarks(bookmarks)
  return bookmarks[index]
}

export async function deleteBookmark(id: string): Promise<boolean> {
  const bookmarks = await getAllBookmarks()
  const filtered = bookmarks.filter((bookmark) => bookmark.id !== id)
  if (filtered.length === bookmarks.length) return false
  await saveBookmarks(filtered)
  return true
}
