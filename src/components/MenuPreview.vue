<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { formatPrice } from '../utils/formatters'
import { getWashiBackgroundStyle, getFontFamilyClass } from '../utils/styleHelpers'
import { useImageExport } from '../composables/useImageExport'
import ImageExportModal from './ImageExportModal.vue'
import { Printer, Edit3, ArrowLeftRight, Image as ImageIcon, Loader2, Type } from '@lucide/vue'

const props = defineProps({
  menuData: {
    type: Object,
    required: true,
  }
})

const scrollContainer = ref(null)
const printSheetRef = ref(null)
const containerWidth = ref(0)
const viewMode = ref('fit') // 'fit' (全体フィット) | '100' (実寸100%)
let resizeObserver = null

const isLandscape = computed(() => props.menuData.paperOrientation !== 'portrait')
const isB5 = computed(() => props.menuData.paperSize === 'B5')

// 用紙の基準キャンバス寸法（A4 / B5 のアスペクト比 1.414 : 1 を忠実に再現）
const baseSheetDimensions = computed(() => {
  if (isLandscape.value) {
    return isB5.value
      ? { width: 860, height: 609 } // B5横 (257mm x 182mm, 1.412:1)
      : { width: 960, height: 679 } // A4横 (297mm x 210mm, 1.414:1)
  } else {
    return isB5.value
      ? { width: 520, height: 735 } // B5縦
      : { width: 580, height: 820 } // A4縦
  }
})

// プレビュー領域の利用可能幅に応じた自動縮小スケール
const autoFitScale = computed(() => {
  if (!containerWidth.value || containerWidth.value <= 0) return 1
  const availableWidth = Math.max(240, containerWidth.value - 24)
  const targetWidth = baseSheetDimensions.value.width
  if (targetWidth <= 0) return 1
  // PC等の広大な画面でも拡大(>1)でぼやけないよう上限1.0、下限0.25
  return Math.min(1.0, Math.max(0.25, availableWidth / targetWidth))
})

// 実際に適用するスケール倍率
const appliedScale = computed(() => {
  if (viewMode.value === '100') return 1.0
  return autoFitScale.value
})

const filenamePrefix = computed(() => props.menuData.title || 'お品書き')

const {
  isGeneratingImage,
  generatedImageUrl,
  showImageModal,
  saveAsImage,
  downloadGeneratedImage,
  closeImageModal,
} = useImageExport(printSheetRef, filenamePrefix)

function updateContainerWidth() {
  if (scrollContainer.value) {
    containerWidth.value = scrollContainer.value.clientWidth
  }
}

onMounted(() => {
  updateContainerWidth()
  if (typeof ResizeObserver !== 'undefined' && scrollContainer.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          containerWidth.value = entry.contentRect.width
        }
      }
    })
    resizeObserver.observe(scrollContainer.value)
  }

  nextTick(() => {
    // 縦書きで等倍表示の場合、最初は右側のタイトルが見えるように右端へスクロール
    if (scrollContainer.value && props.menuData.layout === 'vertical' && viewMode.value === '100') {
      scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth
    }
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

// レイアウト切替時にスクロール位置を調整
watch(() => props.menuData.layout, (newLayout) => {
  nextTick(() => {
    if (scrollContainer.value && viewMode.value === '100') {
      if (newLayout === 'vertical') {
        scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth
      } else {
        scrollContainer.value.scrollLeft = 0
      }
    }
  })
})

const fontClass = computed(() => getFontFamilyClass(props.menuData.fontFamily))

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

const sheetStyle = computed(() => {
  return {
    ...getWashiBackgroundStyle(props.menuData.bgColor || '#ffffff', props.menuData.bgPattern || 'none'),
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
  if (count <= 8) return 'spacious'
  if (count <= 13) return 'normal'
  return 'compact'
})

// 文字サイズスケール倍率（75%〜160%、デフォルト 100%）
const fontScaleRatio = computed(() => {
  const scale = Number(props.menuData.fontScale) || 100
  return scale / 100
})

function adjustFontScale(delta) {
  const current = Number(props.menuData.fontScale) || 100
  const next = Math.min(160, Math.max(75, current + delta))
  props.menuData.fontScale = next
}

const itemClasses = computed(() => {
  switch (effectiveDensity.value) {
    case 'compact':
      return {
        col: 'py-1 sm:py-2 px-0 min-w-[28px] sm:min-w-[34px]',
        name: 'tracking-normal leading-snug',
        note: 'text-[10px] px-0.5 py-0.5 mt-1',
        price: 'tracking-tight',
        hRow: 'py-1.5 sm:py-2',
        hName: 'text-base sm:text-lg font-bold',
        hPrice: 'text-base sm:text-lg font-bold',
      }
    case 'normal':
      return {
        col: 'py-2 sm:py-3 px-0 min-w-[32px] sm:min-w-[42px]',
        name: 'tracking-wider leading-snug',
        note: 'text-[11px] px-0.5 py-1 mt-1.5',
        price: 'tracking-normal',
        hRow: 'py-2 sm:py-3',
        hName: 'text-lg sm:text-xl font-bold',
        hPrice: 'text-lg sm:text-xl font-bold',
      }
    case 'spacious':
    default:
      return {
        col: 'py-3 sm:py-4 px-0 min-w-[38px] sm:min-w-[48px]',
        name: 'tracking-widest leading-tight',
        note: 'text-[12px] px-1 py-1 mt-2',
        price: 'tracking-wider',
        hRow: 'py-2.5 sm:py-3.5',
        hName: 'text-xl sm:text-2xl font-bold',
        hPrice: 'text-xl sm:text-2xl font-bold',
      }
  }
})

// フッター注記テキストの文字サイズクラス
const footerNoteSizeClass = computed(() => {
  switch (props.menuData.footerNoteSize) {
    case 'small':
      return 'text-[9px]'
    case 'large':
      return 'text-[12px]'
    case 'xlarge':
      return 'text-[14px]'
    case 'normal':
    default:
      return 'text-[10.5px]'
  }
})

const hFooterNoteSizeClass = computed(() => {
  switch (props.menuData.footerNoteSize) {
    case 'small':
      return 'text-[10px]'
    case 'large':
      return 'text-sm'
    case 'xlarge':
      return 'text-base'
    case 'normal':
    default:
      return 'text-xs'
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

// 4. 品名の文字数とスケールに応じた動的な文字サイズスタイル（文字溢れ・価格衝突を確実に防止）
function getItemNameStyle(name) {
  const len = name ? name.length : 0
  const ratio = fontScaleRatio.value
  const density = effectiveDensity.value

  // ベースフォントサイズ（rem）
  let baseRem = 1.28
  if (density === 'compact') {
    baseRem = 1.12
  } else if (density === 'spacious') {
    baseRem = 1.45
  }

  // 文字数に応じた減衰率（10文字以上の長い品名でも価格と絶対に重ならないように）
  let lenFactor = 1.0
  if (len > 13) {
    lenFactor = 0.60
  } else if (len > 8) {
    lenFactor = 0.72
  } else if (len > 6) {
    lenFactor = 0.84
  } else if (len <= 4) {
    lenFactor = 1.05
  }

  const finalRem = (baseRem * ratio * lenFactor).toFixed(3)

  // 縦書き時の文字送り（letter-spacing）
  let tracking = '0.08em'
  if (len <= 4) {
    tracking = '0.18em'
  } else if (len <= 6) {
    tracking = '0.12em'
  } else if (len > 8) {
    tracking = '0.02em'
  }

  return {
    fontSize: `calc(${finalRem}rem * var(--print-scale, 1))`,
    letterSpacing: tracking,
    lineHeight: 1.2,
  }
}

// 価格のフォントスタイル
const priceStyle = computed(() => {
  const ratio = fontScaleRatio.value
  const density = effectiveDensity.value
  let baseRem = 1.1
  if (density === 'compact') baseRem = 1.0
  else if (density === 'spacious') baseRem = 1.22

  const finalRem = (baseRem * ratio).toFixed(3)
  return {
    fontSize: `calc(${finalRem}rem * var(--print-scale, 1))`,
    letterSpacing: '0.06em',
  }
})

// タイトル（表頭）のフォントスタイル
const titleStyle = computed(() => {
  const ratio = fontScaleRatio.value
  const titleRatio = 1 + (ratio - 1) * 0.55
  const baseRem = 2.4
  return {
    fontSize: `calc(${(baseRem * titleRatio).toFixed(3)}rem * var(--print-scale, 1))`,
    letterSpacing: '0.22em',
  }
})

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
        .preview-scroll {
          display: block !important;
          overflow: visible !important;
          padding: 0 !important;
          margin: 0 !important;
          height: 100% !important;
        }
        .print-sheet-scaler {
          width: 100% !important;
          height: 100% !important;
          transform: none !important;
          display: block !important;
        }
        .print-sheet {
          position: static !important;
          transform: none !important;
          width: 100% !important;
          height: 100% !important;
          min-width: 0 !important;
          max-width: none !important;
          box-shadow: none !important;
          border: none !important;
          overflow: hidden !important;
          --print-scale: 1.15;
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
      <div class="flex items-center gap-2 flex-wrap">
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

      <!-- Action Buttons & Quick Controls -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- View Mode: Auto-fit vs 100% Original Size -->
        <div class="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs select-none">
          <button
            type="button"
            @click="viewMode = 'fit'"
            :class="[
              'px-2 py-1 rounded-lg font-bold transition cursor-pointer text-xs',
              viewMode === 'fit'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            ]"
            title="用紙全体が枠内に収まるよう自動縮小表示"
          >
            全体表示 ({{ Math.round(autoFitScale * 100) }}%)
          </button>
          <button
            type="button"
            @click="viewMode = '100'"
            :class="[
              'px-2 py-1 rounded-lg font-bold transition cursor-pointer text-xs',
              viewMode === '100'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            ]"
            title="等倍(100%)で表示して横スクロールで確認・編集"
          >
            実寸 (100%)
          </button>
        </div>

        <!-- Font Scale Quick Controls -->
        <div class="flex items-center gap-1 bg-stone-100 hover:bg-stone-200/60 p-1 rounded-xl border border-stone-200 text-xs">
          <span class="font-bold text-stone-700 pl-1.5 flex items-center gap-1 select-none">
            <Type class="w-3.5 h-3.5 text-stone-500" />
            <span class="hidden sm:inline">文字</span>
          </span>
          <button
            type="button"
            @click="adjustFontScale(-5)"
            :disabled="(menuData.fontScale || 100) <= 75"
            class="w-6 h-6 rounded-md bg-white hover:bg-stone-50 active:scale-95 text-stone-800 font-black flex items-center justify-center text-xs shadow-xs border border-stone-200 cursor-pointer disabled:opacity-40"
            title="文字サイズを小さく (-5%)"
          >
            －
          </button>
          <span class="font-black text-stone-900 min-w-[38px] text-center select-none text-[11px]">
            {{ menuData.fontScale || 100 }}%
          </span>
          <button
            type="button"
            @click="adjustFontScale(5)"
            :disabled="(menuData.fontScale || 100) >= 160"
            class="w-6 h-6 rounded-md bg-white hover:bg-stone-50 active:scale-95 text-stone-800 font-black flex items-center justify-center text-xs shadow-xs border border-stone-200 cursor-pointer disabled:opacity-40"
            title="文字サイズを大きく (+5%)"
          >
            ＋
          </button>
          <button
            v-if="(menuData.fontScale || 100) !== 100"
            type="button"
            @click="menuData.fontScale = 100"
            class="text-[10px] text-stone-500 hover:text-amber-800 hover:underline px-1 cursor-pointer"
            title="標準(100%)に戻す"
          >
            標準
          </button>
        </div>
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

    <!-- Mobile swipe hint (only when 100% original size) -->
    <div
      v-if="viewMode === '100'"
      class="no-print lg:hidden text-center text-xs text-stone-500 flex items-center justify-center gap-1.5 py-1"
    >
      <ArrowLeftRight class="w-3.5 h-3.5 text-amber-600 animate-pulse" />
      <span>左右にスクロールして全体を確認・文字編集できます</span>
    </div>

    <!-- Paper Scroll Container -->
    <div
      ref="scrollContainer"
      class="preview-scroll w-full overflow-x-auto pb-8 flex justify-center items-start px-1 sm:px-2 print:p-0 print:overflow-visible print:block print:h-full"
    >
      <!-- Scaled Box Wrapper: takes exact layout space of the scaled sheet on screen -->
      <div
        class="print-sheet-scaler relative shrink-0 transition-[width,height] duration-150 print:w-full print:h-full print:static"
        :style="{
          width: `${Math.round(baseSheetDimensions.width * appliedScale)}px`,
          height: `${Math.round(baseSheetDimensions.height * appliedScale)}px`,
        }"
      >
        <div
          ref="printSheetRef"
          :class="[
            'print-sheet shadow-2xl relative select-none border border-current/20 overflow-hidden print:shadow-none print:border-none print:w-full print:h-full print:p-3 sm:print:p-4',
            fontClass
          ]"
          :style="{
            ...sheetStyle,
            width: `${baseSheetDimensions.width}px`,
            height: `${baseSheetDimensions.height}px`,
            transform: `scale(${appliedScale})`,
            transformOrigin: 'top left',
            boxSizing: 'border-box'
          }"
        >
          <!-- Outer Frame -->
          <div
            :class="[
              'w-full h-full p-6 sm:p-7 flex flex-col justify-between relative z-10 print:p-3.5 print:h-full box-border',
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
              class="vertical-rl w-full h-full print:h-full flex flex-col justify-between overflow-hidden py-1 box-border"
            >
            <!-- 1. Right Header Section (Title & Subtitle ONLY) -->
            <div
              :class="[
                'pl-6 sm:pl-8 shrink-0 h-full flex flex-col justify-start py-1',
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
                class="editable-field font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text"
                :style="titleStyle"
                title="タップして編集"
              >
                {{ menuData.title }}
              </h1>
            </div>

            <!-- 2. Middle Items Section (Flows from Right to Left, Side-by-Side!) -->
            <div class="flex-1 flex flex-col justify-around items-start py-3 sm:py-5 px-0 h-full min-w-0 overflow-visible">
              <div
                v-for="(item, idx) in menuData.items"
                :key="item.id || idx"
                :class="[
                  'flex flex-row justify-between items-center h-full relative group transition-all',
                  itemClasses.col,
                  menuData.showDividers ? 'border-l border-current/20' : ''
                ]"
              >
                <!-- Item Name & Tag (Top of vertical column - 上端固定・中黒水平揃え) -->
                <div class="flex-1 min-h-0 overflow-visible">
                  <!-- Main Item Name (Editable) -->
                  <div
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text whitespace-nowrap',
                      itemClasses.name
                    ]"
                    :style="getItemNameStyle(item.name)"
                    title="タップして品名を編集"
                  >
                    <span v-if="menuData.showDotPrefix && !item.name.startsWith('・')" class="text-[0.75em] opacity-80 select-none">・</span>
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
                      'editable-field tracking-tighter opacity-85 bg-current/10 border border-current/25 rounded-xs outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text mt-1',
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

                <!-- Price at the bottom of the column (Editable) - 下端固定＆左右中央芯合わせ＆安全マージン -->
                <div class="shrink-0 pb-1.5 pt-2">
                  <div
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    :class="[
                      'editable-field font-bold whitespace-nowrap outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text',
                      itemClasses.price
                    ]"
                    :style="priceStyle"
                    title="タップして価格を編集"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Left Footer Section (Clean footer with optional store signature & tax note) -->
            <div
              :class="[
                'flex flex-row pr-2 sm:pr-4 shrink-0 h-full py-1',
                menuData.storeName
                  ? 'justify-between'
                  : (menuData.footerNoteAlign === 'top'
                      ? 'justify-start'
                      : menuData.footerNoteAlign === 'center'
                        ? 'justify-center'
                        : 'justify-end')
              ]"
            >
              <div
                v-if="menuData.storeName"
                contenteditable="true"
                @blur="onTextBlur(menuData, 'storeName', $event)"
                class="editable-field text-xs font-bold opacity-90 tracking-wider outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text"
                title="タップして店名を編集"
              >
                {{ menuData.storeName }}
              </div>

              <div
                v-if="menuData.footerNote"
                contenteditable="true"
                @blur="onTextBlur(menuData, 'footerNote', $event)"
                :class="[
                  'editable-field leading-relaxed opacity-65 tracking-wider outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text pb-1 whitespace-pre-line',
                  footerNoteSizeClass,
                  menuData.storeName
                    ? (menuData.footerNoteAlign === 'top'
                        ? 'mt-4 mb-auto'
                        : menuData.footerNoteAlign === 'center'
                          ? 'my-auto'
                          : 'mt-auto mb-0')
                    : ''
                ]"
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
                  class="editable-field font-black tracking-widest outline-none hover:bg-amber-100/60 cursor-text"
                  :style="{ fontSize: `${(1.85 * fontScaleRatio).toFixed(2)}rem` }"
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
                    :style="{ fontSize: `${(1.15 * fontScaleRatio).toFixed(2)}rem` }"
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
                  :style="{ fontSize: `${(1.15 * fontScaleRatio).toFixed(2)}rem` }"
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
                :class="[
                  'editable-field outline-none hover:bg-amber-100/60 cursor-text whitespace-pre-line leading-relaxed',
                  hFooterNoteSizeClass
                ]"
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
  </div>

    <!-- Image Export Modal (SNS / Instagram用) -->
    <ImageExportModal
      :show="showImageModal"
      :image-url="generatedImageUrl || ''"
      :title="`${menuData.title || 'お品書き'}画像の書き出し完了`"
      @close="closeImageModal"
      @download="downloadGeneratedImage"
    />
  </div>
</template>
