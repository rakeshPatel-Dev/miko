import type { Bookmark } from '../types/bookmark'

export type PageToastKind = 'success' | 'info' | 'warning' | 'error'

export interface UndoRemoveToastAction {
  type: 'undo-remove'
  label: string
  bookmark: Bookmark
}

export interface PageToastMessage {
  type: 'miko:page-toast'
  title: string
  kind?: PageToastKind
  duration?: number
  action?: UndoRemoveToastAction
}

export interface UndoRemoveRequest {
  type: 'miko:undo-remove'
  bookmark: Bookmark
}

export interface PageToastOptions {
  title: string
  kind?: PageToastKind
  duration?: number
  action?: UndoRemoveToastAction
}

const TOAST_SCRIPT_FILE = 'toast.js'

export function isPageToastMessage(value: unknown): value is PageToastMessage {
  if (!value || typeof value !== 'object') return false
  const message = value as Partial<PageToastMessage>
  return (
    message.type === 'miko:page-toast' &&
    typeof message.title === 'string' &&
    message.title.trim().length > 0 &&
    (message.action === undefined || isUndoRemoveToastAction(message.action))
  )
}

export function isUndoRemoveRequest(value: unknown): value is UndoRemoveRequest {
  if (!value || typeof value !== 'object') return false
  const request = value as Partial<UndoRemoveRequest>
  return request.type === 'miko:undo-remove' && isBookmark(request.bookmark)
}

function isUndoRemoveToastAction(value: unknown): value is UndoRemoveToastAction {
  if (!value || typeof value !== 'object') return false
  const action = value as Partial<UndoRemoveToastAction>
  return (
    action.type === 'undo-remove' &&
    typeof action.label === 'string' &&
    action.label.trim().length > 0 &&
    isBookmark(action.bookmark)
  )
}

function isBookmark(value: unknown): value is Bookmark {
  if (!value || typeof value !== 'object') return false
  const bookmark = value as Partial<Bookmark>
  return (
    typeof bookmark.id === 'string' &&
    typeof bookmark.url === 'string' &&
    /^https?:\/\//.test(bookmark.url) &&
    typeof bookmark.domain === 'string' &&
    typeof bookmark.title === 'string' &&
    typeof bookmark.createdAt === 'number' &&
    Number.isFinite(bookmark.createdAt) &&
    typeof bookmark.updatedAt === 'number' &&
    Number.isFinite(bookmark.updatedAt) &&
    (bookmark.favicon === undefined || typeof bookmark.favicon === 'string')
  )
}

async function isToastReady(tabId: number): Promise<boolean> {
  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => Boolean((window as unknown as { __mikoToastReady?: boolean }).__mikoToastReady),
    })
    return injection?.result === true
  } catch (error) {
    console.warn('[Miko] Could not check page toast state:', error)
    return false
  }
}

async function ensureToastUi(tabId: number): Promise<boolean> {
  if (await isToastReady(tabId)) return true

  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: [TOAST_SCRIPT_FILE] })
    return true
  } catch (error) {
    // Restricted pages (chrome://, Web Store, PDF viewer) reject injection.
    console.warn('[Miko] Could not inject page toast:', error)
    return false
  }
}

export async function showPageToast(
  tabId: number | undefined,
  options: PageToastOptions,
): Promise<boolean> {
  if (tabId == null) return false
  if (!(await ensureToastUi(tabId))) return false

  try {
    await chrome.tabs.sendMessage(tabId, {
      type: 'miko:page-toast',
      ...options,
    } satisfies PageToastMessage)
    return true
  } catch {
    return false
  }
}
