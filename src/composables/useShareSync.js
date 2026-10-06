import { ref, onMounted, onUnmounted } from 'vue'
import { decompressMenuData } from '../utils/shareEncoder'

/**
 * 共有URLハッシュ (#share=...) の検知とデータデコードを管理するComposable
 * @param {Function} onAccept - ユーザーが共有データ受取を確定した際のコールバック
 */
export function useShareSync(onAccept) {
  const showIncomingSharePrompt = ref(false)
  const incomingShareData = ref(null)

  async function checkShareHash() {
    const hash = window.location.hash
    if (hash && hash.startsWith('#share=')) {
      const encoded = hash.replace('#share=', '')
      try {
        const decompressed = await decompressMenuData(encoded)
        if (decompressed && decompressed.data) {
          incomingShareData.value = decompressed
          showIncomingSharePrompt.value = true
        }
      } catch (e) {
        console.error('Failed to parse shared menu hash:', e)
        alert('共有リンクのデータ読み込みに失敗しました。正しいURLかご確認ください。')
      } finally {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
  }

  function acceptSharedMenu() {
    if (!incomingShareData.value) return
    const { type, data } = incomingShareData.value
    if (onAccept) {
      onAccept(type, data)
    }
    showIncomingSharePrompt.value = false
    alert('共有メニューを正常に画面に読み込みました！')
  }

  function dismissSharedMenu() {
    showIncomingSharePrompt.value = false
    incomingShareData.value = null
  }

  onMounted(() => {
    checkShareHash()
    window.addEventListener('hashchange', checkShareHash)
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', checkShareHash)
  })

  return {
    showIncomingSharePrompt,
    incomingShareData,
    acceptSharedMenu,
    dismissSharedMenu,
    checkShareHash,
  }
}
