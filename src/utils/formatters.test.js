import test from 'node:test'
import assert from 'node:assert/strict'
import { toKanjiNumber, formatPrice } from './formatters.js'
import { getWashiBackgroundStyle, getFontFamilyClass } from './styleHelpers.js'

test('toKanjiNumber: 数字を漢数字に正しく変換すること', () => {
  assert.equal(toKanjiNumber('180'), '一八〇')
  assert.equal(toKanjiNumber('1280'), '一二八〇')
  assert.equal(toKanjiNumber('0'), '〇')
  assert.equal(toKanjiNumber(''), '')
  assert.equal(toKanjiNumber(null), '')
})

test('formatPrice: 漢数字・算用数字フォーマットを正しく生成すること', () => {
  assert.equal(formatPrice('500', 'kanji'), '五〇〇円')
  assert.equal(formatPrice('500', 'number'), '500円')
  assert.equal(formatPrice('500円', 'kanji'), '五〇〇円')
  assert.equal(formatPrice('', 'kanji'), '')
  assert.equal(formatPrice(0, 'kanji'), '〇円')
})

test('getWashiBackgroundStyle: 指定したパターンに応じたスタイルを返すこと', () => {
  const noneStyle = getWashiBackgroundStyle('#ffffff', 'none')
  assert.equal(noneStyle.backgroundColor, '#ffffff')
  assert.equal(noneStyle.backgroundImage, 'none')

  const washiStyle = getWashiBackgroundStyle('#dde6d5', 'washi')
  assert.equal(washiStyle.backgroundColor, '#dde6d5')
  assert.match(washiStyle.backgroundImage, /radial-gradient/)
})

test('getFontFamilyClass: フォントファミリークラス名を正しく判定すること', () => {
  assert.equal(getFontFamilyClass('brush'), 'font-brush')
  assert.equal(getFontFamilyClass('gothic'), 'font-gothic')
  assert.equal(getFontFamilyClass('mincho'), 'font-mincho')
  assert.equal(getFontFamilyClass('unknown'), 'font-mincho')
})
