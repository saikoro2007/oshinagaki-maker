/**
 * 和紙テクスチャや用紙スタイルの共通ヘルパー関数
 */

export function getWashiBackgroundStyle(bgColor = '#ffffff', bgPattern = 'none') {
  let backgroundImage = 'none'
  let backgroundSize = 'auto'

  switch (bgPattern) {
    case 'cloud':
      backgroundImage = 'radial-gradient(rgba(120, 100, 70, 0.16) 0.8px, transparent 0.8px), radial-gradient(rgba(140, 120, 90, 0.11) 0.6px, transparent 0.6px)'
      backgroundSize = '24px 24px, 16px 16px'
      break
    case 'washi':
      backgroundImage = 'radial-gradient(rgba(80, 100, 70, 0.14) 0.6px, transparent 0.6px)'
      backgroundSize = '16px 16px'
      break
    case 'grid':
      backgroundImage = 'linear-gradient(rgba(100, 120, 90, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 120, 90, 0.08) 1px, transparent 1px)'
      backgroundSize = '32px 32px'
      break
    case 'none':
    default:
      backgroundImage = 'none'
      break
  }

  return {
    backgroundColor: bgColor,
    backgroundImage,
    backgroundSize,
  }
}

export function getFontFamilyClass(fontFamily) {
  switch (fontFamily) {
    case 'brush':
      return 'font-brush'
    case 'gothic':
      return 'font-gothic'
    case 'mincho':
    default:
      return 'font-mincho'
  }
}
