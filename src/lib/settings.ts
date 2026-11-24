const SETTINGS_KEY = 'miko_settings'

export const TOAST_MESSAGE_MAX_LENGTH = 80

export interface ToastMessages {
  saved: string
  duplicate: string
  removed: string
  notFound: string
}

export const DEFAULT_TOAST_MESSAGES: ToastMessages = {
  saved: 'Miko tucked it away ✨',
  duplicate: 'Already in Miko',
  removed: 'Removed from Miko',
  notFound: 'Not saved in Miko',
}

interface MikoSettings {
  toastMessages?: Partial<ToastMessages>
}

function normalizeMessage(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback

  const text = value.replace(/\s+/g, ' ').trim()
  if (!text) return fallback

  // Count by code point so long emoji sequences are never cut in half.
  return [...text].slice(0, TOAST_MESSAGE_MAX_LENGTH).join('')
}

export function normalizeToastMessages(messages?: Partial<ToastMessages>): ToastMessages {
  return {
    saved: normalizeMessage(messages?.saved, DEFAULT_TOAST_MESSAGES.saved),
    duplicate: normalizeMessage(messages?.duplicate, DEFAULT_TOAST_MESSAGES.duplicate),
    removed: normalizeMessage(messages?.removed, DEFAULT_TOAST_MESSAGES.removed),
    notFound: normalizeMessage(messages?.notFound, DEFAULT_TOAST_MESSAGES.notFound),
  }
}

export async function getToastMessages(): Promise<ToastMessages> {
  try {
    const result = await chrome.storage.local.get(SETTINGS_KEY)
    const settings = result[SETTINGS_KEY] as MikoSettings | undefined
    return normalizeToastMessages(settings?.toastMessages)
  } catch {
    return { ...DEFAULT_TOAST_MESSAGES }
  }
}

export async function saveToastMessages(messages: Partial<ToastMessages>): Promise<ToastMessages> {
  const normalized = normalizeToastMessages(messages)
  const result = await chrome.storage.local.get(SETTINGS_KEY)
  const settings = (result[SETTINGS_KEY] as MikoSettings | undefined) ?? {}

  await chrome.storage.local.set({
    [SETTINGS_KEY]: { ...settings, toastMessages: normalized },
  })

  return normalized
}
