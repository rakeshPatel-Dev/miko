import { defineBackground } from 'wxt/utils/define-background'
import { findBookmarkByUrl, restoreBookmark } from '../src/lib/storage'
import { isUndoRemoveRequest } from '../src/lib/page-toast'
import { removePageWithToast, savePageWithToast } from '../src/lib/save-page'

const SAVE_PAGE_MENU_ID = 'save-page-to-miko'
const SAVE_PAGE_MENU_TITLE = 'Save page to Miko'
const REMOVE_PAGE_MENU_TITLE = 'Remove from Miko'

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'miko:bookmarks-changed') {
      void updateActiveTabContextMenu().catch((error) => {
        console.error('[Miko] Could not update context menu:', error)
      })
      return
    }

    if (!isUndoRemoveRequest(message)) return

    void restoreBookmark(message.bookmark)
      .then(() => {
        void updateActiveTabContextMenu().catch((error) => {
          console.error('[Miko] Could not update context menu:', error)
        })
        sendResponse({ ok: true })
      })
      .catch((error) => {
        console.error('[Miko] Could not undo removal:', error)
        sendResponse({ ok: false })
      })

    return true
  })

  async function getTargetTab(tabFromCommand?: chrome.tabs.Tab) {
    return tabFromCommand?.id != null
      ? tabFromCommand
      : (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]
  }

  async function saveCurrentPage(tabFromCommand?: chrome.tabs.Tab) {
    const tab = await getTargetTab(tabFromCommand)

    if (!tab) {
      console.warn('[Miko] Quick save: no active tab found')
      return
    }

    try {
      const result = await savePageWithToast(tab)
      if (!result) {
        console.warn('[Miko] Quick save: this page cannot be saved', tab.url)
        return
      }

      chrome.action.setBadgeText({ text: '✓' })
      chrome.action.setBadgeBackgroundColor({ color: '#22c55e' })
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' })
      }, 1500)
      await updateContextMenu(tab)
    } catch (error) {
      console.error('[Miko] Quick save failed:', error)
    }
  }

  async function removeCurrentPage(tabFromCommand?: chrome.tabs.Tab) {
    const tab = await getTargetTab(tabFromCommand)

    if (!tab) {
      console.warn('[Miko] Quick remove: no active tab found')
      return
    }

    try {
      const result = await removePageWithToast(tab)
      if (!result) {
        console.warn('[Miko] Quick remove: this page cannot be removed', tab.url)
        return
      }

      if (result.status === 'removed') chrome.action.setBadgeText({ text: '' })
      await updateContextMenu(tab)
    } catch (error) {
      console.error('[Miko] Quick remove failed:', error)
    }
  }

  async function toggleContextMenuPage(tab?: chrome.tabs.Tab) {
    const targetTab = await getTargetTab(tab)
    if (!targetTab) {
      console.warn('[Miko] Context menu: no active tab found')
      return
    }

    const url = targetTab.url
    const existing = url && /^https?:\/\//.test(url) ? await findBookmarkByUrl(url) : undefined
    if (existing) {
      await removeCurrentPage(targetTab)
      return
    }

    await saveCurrentPage(targetTab)
  }

  async function updateContextMenu(tab?: chrome.tabs.Tab) {
    const url = tab?.url
    const isSaved = !!url && /^https?:\/\//.test(url) && !!(await findBookmarkByUrl(url))

    await chrome.contextMenus.update(SAVE_PAGE_MENU_ID, {
      title: isSaved ? REMOVE_PAGE_MENU_TITLE : SAVE_PAGE_MENU_TITLE,
    })
  }

  async function updateActiveTabContextMenu() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    await updateContextMenu(tab)
  }

  async function registerContextMenu() {
    await chrome.contextMenus.removeAll()
    await chrome.contextMenus.create({
      id: SAVE_PAGE_MENU_ID,
      title: SAVE_PAGE_MENU_TITLE,
      contexts: ['page'],
    })
  }

  chrome.runtime.onInstalled.addListener(() => {
    void registerContextMenu()
      .then(updateActiveTabContextMenu)
      .catch((error) => {
        console.error('[Miko] Could not register context menu:', error)
      })
  })

  chrome.tabs.onActivated.addListener(() => {
    void updateActiveTabContextMenu().catch((error) => {
      console.error('[Miko] Could not update context menu:', error)
    })
  })

  chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
    if (!tab.active || (changeInfo.status !== 'complete' && !changeInfo.url)) return
    void updateContextMenu(tab).catch((error) => {
      console.error('[Miko] Could not update context menu:', error)
    })
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== SAVE_PAGE_MENU_ID) return
    void toggleContextMenuPage(tab).catch((error) => {
      console.error('[Miko] Context menu action failed:', error)
    })
  })

  chrome.commands.onCommand.addListener((command, tab) => {
    if (command === 'open-popup') {
      chrome.action.openPopup().catch((error) => console.error('Could not open Miko:', error))
      return
    }
    if (command === 'quick-save') {
      void saveCurrentPage(tab)
      return
    }
    if (command === 'quick-remove') {
      void removeCurrentPage(tab)
    }
  })
})
