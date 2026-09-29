<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { formatPrice } from '../utils/formatters'
import { Printer, Edit3, ArrowLeftRight, Download, Image as ImageIcon, Loader2, X } from '@lucide/vue'
import { toPng } from 'html-to-image'

const props = defineProps({
  menuData: {
    type: Object,
    required: true,
  }
})

const scrollContainer = ref(null)
const printSheetRef = ref(null)
const isGeneratingImage = ref(false)
const generatedImageUrl = ref(null)
const showImageModal = ref(false)

onMounted(() => {
  nextTick(() => {
    // 縦書きの場合、最初は右側のタイトルが見えるように右端へスクロール
    if (scrollContainer.value && props.menuData.layout === 'vertical') {
      scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth
    }
  })
})

// レイアウト切替時にスクロール位置を調整
watch(() => props.menuData.layout, (newLayout) => {
  nextTick(() => {
    if (scrollContainer.value) {
      if (newLayout === 'vertical') {
        scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth
      } else {
        scrollContainer.value.scrollLeft = 0
      }
    }
  })
})

const fontClass = computed(() => {
  switch (props.menuData.fontFamily) {
    case 'brush':
      return 'font-brush'
    case 'gothic':
      return 'font-gothic'
    case 'mincho':
    default:
      return 'font-mincho'
  }
})

const frameClasses = computed(() => {
  switch (props.menuData.frameStyle) {
    case 'traditional':
      return 'border-[3px] border-current outline outline-1 outline-current outline-offset-3'
    case 'minimal':
      return 'border-2 border-current'
    case 'none':
      return 'border-0'
    default:
      return 'border-2 border-current'
  }
})

const isLandscape = computed(() => props.menuData.paperOrientation !== 'portrait')
const isB5 = computed(() => props.menuData.paperSize === 'B5')

// 用紙サイズ（A4/B5）と向き（縦/横）に応じた画面上の用紙プロポーション
const sheetDimensionClasses = computed(() => {
  if (isLandscape.value) {
    // 横向き（横長用紙：1.414 : 1）
    return isB5.value
      ? 'min-w-[660px] max-w-[900px] w-full min-h-[460px] sm:min-h-[500px] p-5 sm:p-7'
      : 'min-w-[720px] max-w-[1040px] w-full min-h-[500px] sm:min-h-[540px] p-5 sm:p-8'
  } else {
    // 縦向き（縦長用紙：1 : 1.414、正方形にならず美しい縦長比率を保持）
    return isB5.value
      ? 'min-w-[340px] max-w-[480px] w-full min-h-[680px] sm:min-h-[720px] p-5 sm:p-7'
      : 'min-w-[340px] max-w-[550px] w-full min-h-[780px] sm:min-h-[820px] p-5 sm:p-8'
  }
})

// 縦書きコンテンツの高さ（縦長用紙のときは高さを広げる）
const verticalContentHeightClass = computed(() => {
  if (isLandscape.value) {
    return 'h-[450px] sm:h-[490px]'
  } else {
    return isB5.value ? 'h-[580px] sm:h-[620px]' : 'h-[660px] sm:h-[720px]'
  }
})

// 背景色と和紙テクスチャ模様の合成スタイル
const bgToneStyle = computed(() => {
  const color = props.menuData.bgColor || '#ffffff'
  const pattern = props.menuData.bgPattern || 'none'

  let backgroundImage = 'none'
  let backgroundSize = 'auto'

  switch (pattern) {
    case 'cloud':
      // 雲竜・和紙繊維調
      backgroundImage = 'radial-gradient(rgba(120, 100, 70, 0.16) 0.8px, transparent 0.8px), radial-gradient(rgba(140, 120, 90, 0.11) 0.6px, transparent 0.6px)'
      backgroundSize = '24px 24px, 16px 16px'
      break
    case 'washi':
      // 和紙の微細粒
      backgroundImage = 'radial-gradient(rgba(100, 90, 80, 0.13) 0.6px, transparent 0.6px)'
      backgroundSize = '18px 18px'
      break
    case 'grid':
      // 和風格子（上品な薄い格子）
      backgroundImage = 'linear-gradient(rgba(130, 110, 80, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(130, 110, 80, 0.08) 1px, transparent 1px)'
      backgroundSize = '32px 32px'
      break
    case 'none':
    default:
      backgroundImage = 'none'
      break
  }

  return {
    backgroundColor: color,
    backgroundImage,
    backgroundSize,
  }
})

// 用紙全体の統合スタイル（背景色・和紙模様・文字色）
const sheetStyle = computed(() => {
  return {
    ...bgToneStyle.value,
    color: props.menuData.textColor || '#1c1917',
    boxSizing: 'border-box'
  }
})

// 2. 文字サイズ・密度の動的計算（自動または手動設定）
const effectiveDensity = computed(() => {
  if (props.menuData.density && props.menuData.density !== 'auto') {
    return props.menuData.density
  }
  const count = props.menuData.items.length
  if (count <= 7) return 'spacious'
  if (count <= 11) return 'normal'
  return 'compact'
})

const itemClasses = computed(() => {
  switch (effectiveDensity.value) {
    case 'compact':
      return {
        col: 'px-1 sm:px-1.5 min-w-[24px] sm:min-w-[30px]',
        name: 'text-sm sm:text-base tracking-normal leading-snug',
        note: 'text-[9px] px-0.5 py-0.5 mt-1',
        price: 'text-xs sm:text-sm tracking-tighter',
        hRow: 'py-1 sm:py-1.5',
        hName: 'text-sm sm:text-base font-bold',
        hPrice: 'text-sm sm:text-base font-bold',
      }
    case 'normal':
      return {
        col: 'px-2 sm:px-2.5 min-w-[28px] sm:min-w-[36px]',
        name: 'text-base sm:text-lg tracking-wider leading-snug',
        note: 'text-[10px] px-0.5 py-1 mt-1.5',
        price: 'text-sm sm:text-base tracking-normal',
        hRow: 'py-2 sm:py-2.5',
        hName: 'text-base sm:text-lg font-bold',
        hPrice: 'text-base sm:text-lg font-bold',
      }
    case 'spacious':
    default:
      return {
        col: 'px-3 sm:px-4 min-w-[34px] sm:min-w-[44px]',
        name: 'text-lg sm:text-xl tracking-widest leading-tight',
        note: 'text-[11px] px-1 py-1 mt-2',
        price: 'text-base sm:text-lg tracking-wider',
        hRow: 'py-2.5 sm:py-3.5',
        hName: 'text-lg sm:text-xl font-bold',
        hPrice: 'text-lg sm:text-xl font-bold',
      }
  }
})

// 3. 品名に含まれる補足括弧（...）または (...) を小さな文字としてレンダリングするためのパーサー
function parseItemName(name) {
  if (!name) return []
  const regex = /([（\(][^）\)]+[）\)])/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(name)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: name.substring(lastIndex, match.index), isBracket: false })
    }
    parts.push({ text: match[0], isBracket: true })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < name.length) {
    parts.push({ text: name.substring(lastIndex), isBracket: false })
  }
  return parts
}

// 4. 品名の文字数と密度設定に応じた動的な文字サイズ調整（文字溢れ・価格押し出しを防止）
function getItemNameClass(name) {
  const len = name ? name.length : 0
  const density = effectiveDensity.value

  if (density === 'compact') {
    if (len <= 7) return 'text-sm sm:text-base tracking-normal leading-snug'
    if (len <= 11) return 'text-xs sm:text-sm tracking-tight leading-snug'
    return 'text-[11px] sm:text-xs tracking-tighter leading-tight'
  } else if (density === 'spacious') {
    if (len <= 6) return 'text-lg sm:text-xl tracking-widest leading-tight'
    if (len <= 10) return 'text-base sm:text-lg tracking-wider leading-snug'
    return 'text-sm sm:text-base tracking-normal leading-snug'
  } else {
    // normal
    if (len <= 6) return 'text-base sm:text-lg tracking-wider leading-snug'
    if (len <= 10) return 'text-sm sm:text-base tracking-tight leading-snug'
    return 'text-xs sm:text-sm tracking-tighter leading-snug'
  }
}

// 5. プレビュー上からの直接編集（インプレース編集）ハンドラー
function onTextBlur(targetObj, key, event) {
  const text = event.target.innerText.trim()
  targetObj[key] = text
}

function onPriceBlur(item, event) {
  const rawText = event.target.innerText.trim()
  const cleaned = rawText.replace(/円/g, '').trim()
  if (cleaned) {
    item.price = cleaned
  }
}

function triggerPrint() {
  window.print()
}

// SNS・Instagram用 PNG画像書き出し
async function saveAsImage() {
  if (!printSheetRef.value || isGeneratingImage.value) return
  isGeneratingImage.value = true
  try {
    // Webフォント読み込み完了を待機
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    }

    // レンダリング安定のための微小待機
    await new Promise((resolve) => setTimeout(resolve, 150))

    // 高精細（pixelRatio: 2）で美しいPNG画像を生成
    const dataUrl = await toPng(printSheetRef.value, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
    })

    generatedImageUrl.value = dataUrl
    showImageModal.value = true

    // PC向けに自動ダウンロードも実行
    const filename = `${props.menuData.title || 'お品書き'}_${new Date().toISOString().slice(0, 10)}.png`
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
  const filename = `${props.menuData.title || 'お品書き'}_${new Date().toISOString().slice(0, 10)}.png`
  const link = document.createElement('a')
  link.download = filename
  link.href = generatedImageUrl.value
  link.click()
}

function closeImageModal() {
  showImageModal.value = false
}
</script>

<template>
  <div class="space-y-4 print:space-y-0 print:m-0 print:p-0 print:h-full">
    <!-- Dynamic Print Page CSS for Landscape vs Portrait -->
    <component :is="'style'">
      @media print {
        @page {
          size: {{ menuData.paperSize === 'B5' ? '182mm 257mm' : 'A4' }} {{ isLandscape ? 'landscape' : 'portrait' }};
          margin: 6mm;
        }
        .editable-field {
          outline: none !important;
          background: transparent !important;
        }
      }
    </component>

    <!-- Top Action Toolbar (Hidden on Print) -->
    <div
      class="no-print bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
          本日のおすすめ
        </span>
        <span class="text-xs text-stone-500 font-medium">
          {{ menuData.paperSize || 'A4' }} {{ isLandscape ? '横置き' : '縦置き' }} · {{ menuData.layout === 'vertical' ? '縦書き' : '横書き' }} · {{ menuData.items.length }}品目
        </span>
        <span class="text-[11px] text-stone-500 bg-stone-100 border border-stone-200/80 px-2 py-0.5 rounded-full hidden md:inline-flex items-center gap-1">
          <Edit3 class="w-3 h-3 text-stone-400" />
          <span>文字タップで直接編集可能</span>
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Save as PNG button -->
        <button
          @click="saveAsImage"
          type="button"
          :disabled="isGeneratingImage"
          class="px-3 py-2 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 font-bold rounded-xl text-xs sm:text-sm border border-stone-300 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          title="SNS・Instagram投稿用の高解像度PNG画像を保存"
        >
          <Loader2 v-if="isGeneratingImage" class="w-4 h-4 animate-spin text-amber-600" />
          <ImageIcon v-else class="w-4 h-4 text-stone-600" />
          <span class="hidden sm:inline">{{ isGeneratingImage ? '生成中...' : '画像保存 (PNG)' }}</span>
          <span class="sm:hidden">画像</span>
        </button>

        <!-- Print PDF Button -->
        <button
          @click="triggerPrint"
          type="button"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition cursor-pointer"
        >
          <Printer class="w-4 h-4" />
          <span>印刷する (PDF)</span>
        </button>
      </div>
    </div>

    <!-- Mobile swipe hint -->
    <div
      class="no-print lg:hidden text-center text-xs text-stone-500 flex items-center justify-center gap-1.5 py-1"
    >
      <ArrowLeftRight class="w-3.5 h-3.5 text-amber-600 animate-pulse" />
      <span>左右にスクロールして全体を確認・文字編集できます</span>
    </div>

    <!-- Paper Scroll Container -->
    <div
      ref="scrollContainer"
      class="preview-scroll w-full overflow-x-auto pb-8 flex justify-start lg:justify-center px-1 sm:px-2 print:p-0 print:overflow-visible print:block print:h-full"
    >
      <div
        ref="printSheetRef"
        :class="[
          'print-sheet shrink-0 shadow-2xl transition-all relative select-none border border-current/20 print:shadow-none print:border-none print:min-w-0 print:max-w-none print:w-full print:h-full print:min-h-0 print:p-3 sm:print:p-4 overflow-hidden',
          fontClass,
          sheetDimensionClasses
        ]"
        :style="sheetStyle"
      >
        <!-- Outer Frame -->
        <div
          :class="[
            'w-full h-full p-5 sm:p-8 flex flex-col justify-between relative z-10 print:p-3.5 print:h-full',
            frameClasses
          ]"
        >
          <!-- Corner Accents (if traditional frame) -->
          <template v-if="menuData.frameStyle === 'traditional'">
            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-current"></div>
            <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-current"></div>
            <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-current"></div>
            <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-current"></div>
          </template>

          <!-- VERTICAL WRITING LAYOUT (縦書き・メニューが横に流れる) -->
          <div
            v-if="menuData.layout === 'vertical'"
            :class="[
              'vertical-rl w-full print:h-full flex flex-col justify-between overflow-x-visible py-1',
              verticalContentHeightClass
            ]"
          >
            <!-- 1. Right Header Section (Title & Subtitle ONLY) -->
            <div
              :class="[
                'pl-6 sm:pl-8 shrink-0 h-full flex flex-col justify-start',
                (menuData.showDividers || menuData.subtitle) ? 'border-l border-current/30' : ''
              ]"
            >
              <!-- Subtitle (Editable) -->
              <div
                v-if="menuData.subtitle"
                contenteditable="true"
                @blur="onTextBlur(menuData, 'subtitle', $event)"
                class="editable-field text-xs sm:text-sm opacity-75 font-bold tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text mb-1"
                title="タップして編集"
              >
                {{ menuData.subtitle }}
              </div>

              <!-- Main Title (Editable) -->
              <h1
                contenteditable="true"
                @blur="onTextBlur(menuData, 'title', $event)"
                class="editable-field text-3xl sm:text-4xl font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text"
                title="タップして編集"
              >
                {{ menuData.title }}
              </h1>
            </div>

            <!-- 2. Middle Items Section (Flows from Right to Left, Side-by-Side!) -->
            <div class="flex-1 flex flex-col justify-around px-4 sm:px-6 h-full overflow-x-visible">
              <div
                v-for="(item, idx) in menuData.items"
                :key="item.id || idx"
                :class="[
                  'flex flex-row justify-between h-full py-1 relative group transition-all',
                  itemClasses.col,
                  menuData.showDividers ? 'border-l border-current/20' : ''
                ]"
              >
                <!-- Item Name & Tag (Top of vertical column) -->
                <div class="flex-1 min-h-0 overflow-visible">
                  <!-- Main Item Name (Editable) -->
                  <div
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text whitespace-nowrap',
                      getItemNameClass(item.name)
                    ]"
                    title="タップして品名を編集"
                  >
                    <span v-if="menuData.showDotPrefix && !item.name.startsWith('・')" class="text-[0.75em] opacity-80 mr-0.5">・</span>
                    <template v-for="(part, pIdx) in parseItemName(item.name)" :key="pIdx">
                      <span v-if="part.isBracket" class="text-[0.72em] font-normal opacity-80 tracking-tight">
                        {{ part.text }}
                      </span>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </div>

                  <!-- Note Badge (e.g. 塩・タレ) (Editable) -->
                  <div
                    v-if="menuData.showNotes && item.note"
                    contenteditable="true"
                    @blur="onTextBlur(item, 'note', $event)"
                    :class="[
                      'editable-field tracking-tighter opacity-85 bg-current/10 border border-current/25 rounded-xs outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text',
                      itemClasses.note
                    ]"
                    title="タップして補足を編集"
                  >
                    {{ item.note }}
                  </div>

                  <!-- English translation if enabled -->
                  <div
                    v-if="menuData.showEnglish && item.translation"
                    contenteditable="true"
                    @blur="onTextBlur(item, 'translation', $event)"
                    class="editable-field text-[9px] font-sans tracking-tight opacity-70 mt-1 outline-none hover:bg-amber-100/60 cursor-text"
                    title="タップして翻訳を編集"
                  >
                    {{ item.translation }}
                  </div>
                </div>

                <!-- Price at the bottom of the column (Editable) - 下端固定 -->
                <div class="shrink-0 self-end pb-1 pt-1">
                  <div
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    :class="[
                      'editable-field font-bold whitespace-nowrap outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text',
                      itemClasses.price
                    ]"
                    title="タップして価格を編集"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Left Footer Section (Clean footer with optional store signature & tax note) -->
            <div class="flex flex-row justify-between pr-2 sm:pr-4 shrink-0 h-full">
              <div
                v-if="menuData.storeName"
                contenteditable="true"
                @blur="onTextBlur(menuData, 'storeName', $event)"
                class="editable-field text-xs font-bold opacity-90 tracking-wider outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text self-start pt-1"
                title="タップして店名を編集"
              >
                {{ menuData.storeName }}
              </div>
              <div v-else></div>

              <div
                contenteditable="true"
                @blur="onTextBlur(menuData, 'footerNote', $event)"
                class="editable-field text-[10px] opacity-65 tracking-wider outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text self-end pb-1"
                title="タップして注記を編集"
              >
                {{ menuData.footerNote }}
              </div>
            </div>
          </div>

          <!-- HORIZONTAL WRITING LAYOUT (横書き) -->
          <div
            v-else
            class="w-full flex-1 flex flex-col justify-between print:h-full"
          >
            <!-- Header -->
            <div class="text-center pb-5 border-b border-current/30">
              <div
                contenteditable="true"
                @blur="onTextBlur(menuData, 'subtitle', $event)"
                class="editable-field text-xs opacity-75 font-bold tracking-widest mb-1 outline-none hover:bg-amber-100/60 cursor-text"
              >
                {{ menuData.subtitle }}
              </div>
              <div class="flex items-center justify-center">
                <h1
                  contenteditable="true"
                  @blur="onTextBlur(menuData, 'title', $event)"
                  class="editable-field text-2xl sm:text-3xl font-black tracking-widest outline-none hover:bg-amber-100/60 cursor-text"
                >
                  {{ menuData.title }}
                </h1>
              </div>
              <div
                v-if="menuData.storeName"
                contenteditable="true"
                @blur="onTextBlur(menuData, 'storeName', $event)"
                class="editable-field text-xs opacity-90 font-bold tracking-wider mt-1 outline-none hover:bg-amber-100/60 cursor-text"
              >
                {{ menuData.storeName }}
              </div>
            </div>

            <!-- Horizontal Items List (1 item per row, full width) -->
            <div class="flex-1 flex flex-col justify-around py-4 sm:py-6 px-2 sm:px-6 divide-y divide-current/15">
              <div
                v-for="(item, idx) in menuData.items"
                :key="item.id || idx"
                :class="[
                  'flex items-baseline justify-between transition-all',
                  itemClasses.hRow
                ]"
              >
                <div class="flex items-baseline gap-2.5 flex-wrap">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field tracking-wide outline-none hover:bg-amber-100/60 cursor-text',
                      itemClasses.hName
                    ]"
                  >
                    <span v-if="menuData.showDotPrefix && !item.name.startsWith('・')" class="opacity-70 mr-1">・</span>
                    <template v-for="(part, pIdx) in parseItemName(item.name)" :key="pIdx">
                      <span v-if="part.isBracket" class="text-[0.8em] font-normal opacity-75">
                        {{ part.text }}
                      </span>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </span>
                  <span
                    v-if="menuData.showNotes && item.note"
                    contenteditable="true"
                    @blur="onTextBlur(item, 'note', $event)"
                    class="editable-field text-xs opacity-85 bg-current/10 border border-current/25 px-1.5 py-0.5 rounded-xs outline-none hover:bg-amber-100/60 cursor-text"
                  >
                    {{ item.note }}
                  </span>
                  <span
                    v-if="menuData.showEnglish && item.translation"
                    contenteditable="true"
                    @blur="onTextBlur(item, 'translation', $event)"
                    class="editable-field text-xs opacity-70 font-sans outline-none hover:bg-amber-100/60 cursor-text"
                  >
                    ({{ item.translation }})
                  </span>
                </div>
                <!-- Price in Horizontal mode -->
                <div
                  contenteditable="true"
                  @blur="onPriceBlur(item, $event)"
                  :class="[
                    'editable-field whitespace-nowrap pl-4 outline-none hover:bg-amber-100/60 cursor-text',
                    itemClasses.hPrice
                  ]"
                >
                  {{ formatPrice(item.price, menuData.priceFormat, false) }}
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="pt-4 border-t border-current/20 flex flex-col sm:flex-row items-center justify-between text-xs opacity-75 gap-1">
              <div
                contenteditable="true"
                @blur="onTextBlur(menuData, 'footerNote', $event)"
                class="editable-field outline-none hover:bg-amber-100/60 cursor-text"
              >
                {{ menuData.footerNote }}
              </div>
              <div
                v-if="menuData.storeName"
                contenteditable="true"
                @blur="onTextBlur(menuData, 'storeName', $event)"
                class="editable-field font-bold opacity-90 tracking-wider outline-none hover:bg-amber-100/60 cursor-text"
              >
                {{ menuData.storeName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Export Modal (SNS / Instagram用) -->
    <Teleport to="body">
      <div
        v-if="showImageModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
        @click.self="closeImageModal"
      >
        <div
          class="bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        >
          <!-- Modal Header -->
          <div class="px-4 py-3 border-b border-stone-800 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-emerald-400 font-bold flex items-center gap-1.5 text-sm sm:text-base">
                <ImageIcon class="w-4 h-4" /> お品書き画像の書き出し完了
              </span>
            </div>
            <button
              @click="closeImageModal"
              type="button"
              class="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title="閉じる"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-4 overflow-y-auto space-y-3 flex-1 flex flex-col items-center">
            <!-- Mobile Guidance Banner -->
            <div class="w-full bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-3 text-xs sm:text-sm text-emerald-200 flex items-start gap-2.5">
              <span class="text-base shrink-0">📱</span>
              <div>
                <p class="font-bold text-white mb-0.5">スマートフォンでご利用の場合</p>
                <p class="leading-relaxed opacity-90 text-[11px] sm:text-xs">
                  下の画像を<strong class="text-emerald-300">「長押し」</strong>して<strong class="text-white">「写真に追加」</strong>または<strong class="text-white">「画像を保存」</strong>を選ぶとカメラロールに保存されます。Instagramの投稿やストーリー、LINE配信にそのままお使いいただけます。
                </p>
              </div>
            </div>

            <!-- Image Container -->
            <div class="w-full flex justify-center bg-stone-950 p-2 sm:p-3 rounded-xl border border-stone-800 overflow-hidden">
              <img
                :src="generatedImageUrl"
                alt="生成されたお品書き画像"
                class="max-h-[50vh] sm:max-h-[55vh] w-auto max-w-full object-contain rounded shadow-lg border border-stone-800/80 select-auto"
              />
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-4 py-3 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between gap-2 shrink-0">
            <span class="text-xs text-stone-400 hidden sm:inline">高解像度 PNG形式</span>
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                @click="downloadGeneratedImage"
                type="button"
                class="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download class="w-4 h-4" />
                <span>PNG画像を再ダウンロード</span>
              </button>
              <button
                @click="closeImageModal"
                type="button"
                class="px-4 py-2 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 hover:text-white rounded-xl text-xs sm:text-sm transition cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
