/**
 * 数字を漢数字（大字/位どりなし表記または一般的な縦書き表記）に変換
 * 例: "180" -> "一八〇"
 */
export function toKanjiNumber(str) {
  if (!str) return '';
  const digits = {
    '0': '〇',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
    '7': '七',
    '8': '八',
    '9': '九',
  };
  return str.toString().replace(/[0-9]/g, (ch) => digits[ch] || ch);
}

/**
 * 価格の表示用文字列を生成
 * 横書きモードでは絶対に漢数字にせず、常にアラビア数字（180円）を適用
 */
export function formatPrice(price, format = 'number', isVertical = true) {
  if (!price && price !== 0) return '';
  const cleanPrice = price.toString().replace(/[^0-9]/g, '');
  if (!cleanPrice) return price;

  // 横書きの場合は常にアラビア数字（例: 180円）
  if (!isVertical || format === 'number') {
    return `${cleanPrice}円`;
  }

  // 縦書きかつkanji指定の場合のみ漢数字（例: 一八〇円）
  return `${toKanjiNumber(cleanPrice)}円`;
}
