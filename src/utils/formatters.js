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
 * formatがkanjiの場合は漢数字、numberの場合は算用数字（柔軟なカスタムに対応）
 */
export function formatPrice(price, format = 'number', isVertical = true) {
  if (!price && price !== 0) return '';
  const cleanPrice = price.toString().replace(/[^0-9]/g, '');
  if (!cleanPrice) return price;

  if (format === 'kanji') {
    return `${toKanjiNumber(cleanPrice)}円`;
  }

  return `${cleanPrice}円`;
}
