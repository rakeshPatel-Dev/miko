import type { Bookmark } from '../types/bookmark'
import { addBookmark, findBookmarkByUrl } from './storage'
import { showPageToast } from './page-toast'
import { getToastMessages } from './settings'

export type SavePageStatus = 'saved' | 'duplicate'

export interface SavePageResult {
  status: SavePageStatus
  bookmark: Bookmark
}

/**
 * Saves the given tab (if needed) and shows the result toast on that page.
 * Returns null for pages Miko cannot save.
 */
export async function savePageWithToast(tab: chrome.tabs.Tab): Promise<SavePageResult | null> {
  const url = tab.url
  if (tab.id == null || !url || !/^https?:\/\//.test(url)) return null

  const [existing, toastMessages] = await Promise.all([findBookmarkByUrl(url), getToastMessages()])
  const bookmark =
    existing ??
    (await addBookmark({
      url,
      title: tab.title || url,
      favicon: tab.favIconUrl,
    }))

  await showPageToast(tab.id, {
    title: existing ? toastMessages.duplicate : toastMessages.saved,
    kind: existing ? 'info' : 'success',
    duration: existing ? 2000 : 2400,
  })

  return { status: existing ? 'duplicate' : 'saved', bookmark }
}
