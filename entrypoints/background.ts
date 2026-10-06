import { defineBackground } from 'wxt/utils/define-background'
import { addBookmark } from '../src/lib/storage'

export default defineBackground(() => {
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    return tab
  }

  async function saveCurrentPage() {
    const tab = await getActiveTab()
    if (!tab?.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return
    }

    try {
      await addBookmark({
        url: tab.url,
        title: tab.title || tab.url,
        favicon: tab.favIconUrl,
      })

      chrome.action.setBadgeText({ text: '✓' })
      chrome.action.setBadgeBackgroundColor({ color: '#22c55e' })
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' })
      }, 1500)
    } catch (error) {
      console.error('Failed to save bookmark:', error)
    }
  }

  chrome.commands.onCommand.addListener((command) => {
    if (command === 'open-popup') {
      chrome.action.openPopup().catch((error) => console.error('Could not open Miko:', error))
      return
    }
    if (command === 'quick-save') {
      saveCurrentPage()
    }
  })
})
