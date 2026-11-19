import type { Bookmark } from '../types/bookmark'
import { addBookmark, findBookmarkByUrl } from './storage'
import { showPageToast } from './page-toast'

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

  const existing = await findBookmarkByUrl(url)
  const bookmark =
    existing ??
    (await addBookmark({
      url,
      title: tab.title || url,
      favicon: tab.favIconUrl,
    }))

  await showPageToast(tab.id, {
    title: existing ? 'Already in Miko' : 'Miko tucked it away ✨',
    kind: existing ? 'info' : 'success',
    duration: existing ? 2000 : 2400,
  })

  return { status: existing ? 'duplicate' : 'saved', bookmark }
}
