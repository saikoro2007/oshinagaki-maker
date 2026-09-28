/**
 * 画像ファイルをリサイズ・圧縮して、LocalStorageに安全に保存できるBase64文字列に変換する
 * @param {File} file ユーザーが選択した画像ファイル
 * @param {number} maxDimension 最大幅・高さ（デフォルト: 400px）
 * @param {number} quality JPEG品質（0.0 - 1.0）
 * @returns {Promise<string>} Base64 Data URL
 */
export function compressImageFile(file, maxDimension = 400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('有効な画像ファイルを選択してください。'))
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました。'))
    reader.onload = (event) => {
      const img = new Image()
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました。'))
      img.onload = () => {
        let width = img.width
        let height = img.height

        // アスペクト比を維持して最大サイズに縮小
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // 透過PNGの場合はPNG形式、それ以外はJPEG/PNGを判定
        const isPng = file.type === 'image/png'
        const outputFormat = isPng ? 'image/png' : 'image/jpeg'
        const dataUrl = canvas.toDataURL(outputFormat, quality)

        resolve(dataUrl)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  })
}
