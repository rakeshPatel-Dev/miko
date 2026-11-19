import { defineBackground } from 'wxt/utils/define-background'
import { savePageWithToast } from '../src/lib/save-page'

export default defineBackground(() => {
  async function saveCurrentPage(tabFromCommand?: chrome.tabs.Tab) {
    const tab =
      tabFromCommand?.id != null
        ? tabFromCommand
        : (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]

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
    } catch (error) {
      console.error('[Miko] Quick save failed:', error)
    }
  }

  chrome.commands.onCommand.addListener((command, tab) => {
    if (command === 'open-popup') {
      chrome.action.openPopup().catch((error) => console.error('Could not open Miko:', error))
      return
    }
    if (command === 'quick-save') {
      saveCurrentPage(tab)
    }
  })
})
