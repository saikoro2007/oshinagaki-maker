import { ref } from 'vue'
import { toPng } from 'html-to-image'

/**
 * お品書きプレビューシートのPNG画像化・ダウンロード管理 Composable
 * @param {import('vue').Ref<HTMLElement | null>} printSheetRef
 * @param {import('vue').ComputedRef<string> | import('vue').Ref<string>} defaultFilenamePrefix
 */
export function useImageExport(printSheetRef, defaultFilenamePrefix) {
  const isGeneratingImage = ref(false)
  const generatedImageUrl = ref(null)
  const showImageModal = ref(false)

  async function saveAsImage() {
    if (!printSheetRef.value || isGeneratingImage.value) return
    isGeneratingImage.value = true
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready
      }
      await new Promise((resolve) => setTimeout(resolve, 150))
      const dataUrl = await toPng(printSheetRef.value, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      })
      generatedImageUrl.value = dataUrl
      showImageModal.value = true

      // 自動ダウンロード
      const prefix = typeof defaultFilenamePrefix === 'function'
        ? defaultFilenamePrefix()
        : defaultFilenamePrefix?.value || defaultFilenamePrefix || 'お品書き'
      const filename = `${prefix}_${new Date().toISOString().slice(0, 10)}.png`
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('画像生成に失敗しました:', error)
      alert('画像の生成中にエラーが発生しました。もう一度お試しください。')
    } finally {
      isGeneratingImage.value = false
    }
  }

  function downloadGeneratedImage() {
    if (!generatedImageUrl.value) return
    const prefix = typeof defaultFilenamePrefix === 'function'
      ? defaultFilenamePrefix()
      : defaultFilenamePrefix?.value || defaultFilenamePrefix || 'お品書き'
    const filename = `${prefix}_${new Date().toISOString().slice(0, 10)}.png`
    const link = document.createElement('a')
    link.download = filename
    link.href = generatedImageUrl.value
    link.click()
  }

  function closeImageModal() {
    showImageModal.value = false
  }

  return {
    isGeneratingImage,
    generatedImageUrl,
    showImageModal,
    saveAsImage,
    downloadGeneratedImage,
    closeImageModal,
  }
}
