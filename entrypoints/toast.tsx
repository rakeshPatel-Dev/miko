import ReactDOM from 'react-dom/client'
import { CloudletProvider, Toaster, createCloudlet } from '@cloudlet/toast'
import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script'
import cloudletStyles from '@cloudlet/toast/styles.css?inline'
import toastStyles from '../src/styles/toast.css?inline'
import { isPageToastMessage } from '../src/lib/page-toast'

declare global {
  interface Window {
    __mikoToastReady?: boolean
  }
}

function injectStyles(cssText: string) {
  if (typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype) {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(cssText)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
    return
  }

  const style = document.createElement('style')
  style.textContent = cssText
  ;(document.head ?? document.documentElement).append(style)
}

export default defineUnlistedScript(() => {
  if (window.__mikoToastReady) return
  if (!document.documentElement) return

  const host = document.createElement('miko-toast')
  host.style.position = 'fixed'
  host.style.inset = '0'
  host.style.zIndex = '2147483647'
  host.style.display = 'block'
  host.style.pointerEvents = 'none'

  // Cloudlet needs its container in the page's light DOM, outside any shadow root.
  const rootNode = document.createElement('div')
  const toastNode = document.createElement('div')
  toastNode.id = 'miko-toast-container'

  host.append(rootNode, toastNode)
  document.documentElement.append(host)

  injectStyles(`${cloudletStyles}\n${toastStyles}`)

  const controller = createCloudlet({
    autoDismiss: true,
    onDiagnostic: (diagnostic) => console.warn('[Miko toast]', diagnostic),
  })

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!isPageToastMessage(message)) return

    const action = message.action

    controller.show({
      title: message.title,
      kind: message.kind ?? 'success',
      duration: message.duration ?? 2400,
      attention: action ? 'open' : 'stack',
      ...(action
        ? {
            action: {
              kind: 'command' as const,
              label: action.label,
              run: async () => {
                const response = await chrome.runtime.sendMessage({
                  type: 'miko:undo-remove',
                  bookmark: action.bookmark,
                })
                if (!response?.ok) throw new Error('Could not restore bookmark')
              },
              errorMessage: () => 'Could not restore bookmark',
            },
          }
        : {}),
    })
    sendResponse({ ok: true })
  })

  ReactDOM.createRoot(rootNode).render(
    <CloudletProvider controller={controller}>
      <Toaster
        container={toastNode}
        position="top-center"
        theme="system"
        offsets={{ gutter: { top: 20 } }}
      />
    </CloudletProvider>,
  )

  window.__mikoToastReady = true
})
