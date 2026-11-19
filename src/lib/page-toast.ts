export type PageToastKind = 'success' | 'info' | 'warning' | 'error'

export interface PageToastMessage {
  type: 'miko:page-toast'
  title: string
  kind?: PageToastKind
  duration?: number
}

export interface PageToastOptions {
  title: string
  kind?: PageToastKind
  duration?: number
}

const TOAST_SCRIPT_FILE = 'toast.js'

export function isPageToastMessage(value: unknown): value is PageToastMessage {
  if (!value || typeof value !== 'object') return false
  const message = value as Partial<PageToastMessage>
  return (
    message.type === 'miko:page-toast' &&
    typeof message.title === 'string' &&
    message.title.trim().length > 0
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
