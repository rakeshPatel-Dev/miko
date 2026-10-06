import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: 'Miko',
    description: 'A tiny, playful bookmark companion that saves the good stuff from the internet.',
    version: '0.1.0',
    permissions: ['storage', 'activeTab'],
    action: {
      default_popup: 'popup.html',
      default_icon: {
        16: 'icons/icon16.png',
        32: 'icons/icon32.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png',
      },
    },
    background: {
      service_worker: 'background.js',
      type: 'module',
    },
    icons: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
    commands: {
      'quick-save': {
        suggested_key: {
          default: 'Alt+Shift+S',
          mac: 'Command+Shift+S',
        },
        description: 'Quick save current page',
      },
    },
  },
})
