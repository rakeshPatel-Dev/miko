import type { Bookmark } from '../types/bookmark'

export function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean)
}

export function matchesQuery(bookmark: Bookmark, tokens: string[]): boolean {
  if (tokens.length === 0) return true
  const haystack = [bookmark.title, bookmark.url].join('\n').toLowerCase()
  return tokens.every((token) => haystack.includes(token))
}

export function filterBookmarks(bookmarks: Bookmark[], query: string): Bookmark[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return bookmarks
  return bookmarks.filter((b) => matchesQuery(b, tokens))
}
