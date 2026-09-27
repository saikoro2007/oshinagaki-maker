<script setup>
import { ref, computed } from 'vue'
import { formatPrice } from '../utils/formatters'
import { Printer, Maximize2, Sparkles, Edit3 } from '@lucide/vue'

const props = defineProps({
  menuData: {
    type: Object,
    required: true,
  }
})

const isFitToScreen = ref(false)

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
      return 'border-[3px] border-stone-900 outline outline-1 outline-stone-900 outline-offset-3'
    case 'minimal':
      return 'border-2 border-stone-800'
    case 'none':
      return 'border-0'
    default:
      return 'border-2 border-stone-900'
  }
})

const isLandscape = computed(() => props.menuData.paperOrientation !== 'portrait')

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
      }
    case 'normal':
      return {
        col: 'px-2 sm:px-2.5 min-w-[28px] sm:min-w-[36px]',
        name: 'text-base sm:text-lg tracking-wider leading-snug',
        note: 'text-[10px] px-0.5 py-1 mt-1.5',
        price: 'text-sm sm:text-base tracking-normal',
      }
    case 'spacious':
    default:
      return {
        col: 'px-3 sm:px-4 min-w-[34px] sm:min-w-[44px]',
        name: 'text-lg sm:text-xl tracking-widest leading-tight',
        note: 'text-[11px] px-1 py-1 mt-2',
        price: 'text-base sm:text-lg tracking-wider',
      }
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
  <div class="space-y-4">
    <!-- Dynamic Print Page CSS for Landscape vs Portrait -->
    <component :is="'style'">
      @media print {
        @page {
          size: {{ menuData.paperSize || 'A4' }} {{ isLandscape ? 'landscape' : 'portrait' }};
          margin: 8mm;
        }
        .editable-field {
          outline: none !important;
          background: transparent !important;
        }
      }
    </component>

    <!-- Screen-only Control Bar -->
    <div class="no-print bg-stone-900 text-white rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 max-w-5xl mx-auto">
      <div>
        <div class="font-bold text-sm sm:text-base flex items-center gap-1.5">
          <span>🖨️</span>
          <span>お品書きプレビュー</span>
          <span class="text-xs font-normal text-amber-300 ml-2 bg-amber-950/80 border border-amber-700/60 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Edit3 class="w-3 h-3" />
            <span>文字を直接タップして編集可能</span>
          </span>
        </div>
        <p class="text-xs text-stone-300 mt-1">
          {{ menuData.paperSize || 'A4' }}・{{ isLandscape ? '横向き (横長)' : '縦向き (縦長)' }} / {{ menuData.layout === 'vertical' ? '縦書き' : '横書き' }} / {{ menuData.items.length }}品目 ({{ effectiveDensity === 'compact' ? 'すっきり小' : effectiveDensity === 'normal' ? '標準中' : 'ゆったり大' }})
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Fit / Scroll Toggle for Mobile -->
        <button
          type="button"
          @click="isFitToScreen = !isFitToScreen"
          class="sm:hidden px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-stone-700 transition"
        >
          <Maximize2 class="w-3.5 h-3.5" />
          <span>{{ isFitToScreen ? '拡大表示' : '全体に縮小' }}</span>
        </button>

        <button
          @click="triggerPrint"
          type="button"
          class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black rounded-xl text-sm shadow-md flex items-center gap-2 transition cursor-pointer"
        >
          <Printer class="w-4 h-4" />
          <span>印刷する (PDF保存)</span>
        </button>
      </div>
    </div>

    <!-- Paper Scroll Container -->
    <div
      class="preview-scroll w-full overflow-x-auto pb-8 flex justify-center px-1 sm:px-4"
    >
      <div
        :class="[
          'print-sheet bg-[#fffdfa] text-stone-950 shadow-2xl transition-all relative select-none border border-stone-300/60',
          fontClass,
          isLandscape
            ? 'min-w-[820px] max-w-[1080px] w-full min-h-[500px] sm:min-h-[560px] p-6 sm:p-10'
            : 'min-w-[340px] max-w-[750px] w-full min-h-[640px] p-6 sm:p-8',
          isFitToScreen ? 'scale-[0.42] sm:scale-100 origin-top' : ''
        ]"
        style="box-sizing: border-box;"
      >
        <!-- Outer Frame -->
        <div
          :class="[
            'w-full h-full p-5 sm:p-8 flex flex-col justify-between relative',
            frameClasses
          ]"
        >
          <!-- Corner Accents (if traditional frame) -->
          <template v-if="menuData.frameStyle === 'traditional'">
            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-stone-900"></div>
            <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-stone-900"></div>
            <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-stone-900"></div>
            <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-stone-900"></div>
          </template>

          <!-- VERTICAL WRITING LAYOUT (縦書き・メニューが横に流れる) -->
          <div
            v-if="menuData.layout === 'vertical'"
            class="vertical-rl w-full h-[450px] sm:h-[490px] flex flex-col justify-between overflow-x-visible py-1"
          >
            <!-- 1. Right Header Section (Title & Subtitle & Stamp ONLY - No clunky store name next to title) -->
            <div class="flex flex-row justify-between pl-6 sm:pl-8 border-l-2 border-stone-800 shrink-0 h-full">
              <div>
                <!-- Subtitle (Editable) -->
                <div
                  contenteditable="true"
                  @blur="onTextBlur(menuData, 'subtitle', $event)"
                  class="editable-field text-xs sm:text-sm text-stone-600 font-bold tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text"
                  title="タップして編集"
                >
                  {{ menuData.subtitle }}
                </div>

                <!-- Main Title (Editable) -->
                <h1
                  contenteditable="true"
                  @blur="onTextBlur(menuData, 'title', $event)"
                  class="editable-field text-3xl sm:text-4xl font-black tracking-widest text-stone-950 mt-2 outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text"
                  title="タップして編集"
                >
                  {{ menuData.title }}
                </h1>
              </div>

              <!-- Traditional Red Stamp Seal (Editable - can display store name or stamp text) -->
              <div
                contenteditable="true"
                @blur="onTextBlur(menuData, 'stampText', $event)"
                class="editable-field border-2 border-red-700 text-red-700 font-bold text-xs p-1.5 rounded-xs tracking-tighter self-end select-none outline-none hover:bg-red-50 focus:ring-1 focus:ring-red-600 cursor-text"
                title="タップして印鑑文字を変更"
              >
                {{ menuData.stampText || (menuData.storeName ? menuData.storeName.slice(0, 4) : '名物') }}
              </div>
            </div>

            <!-- 2. Middle Items Section (Flows from Right to Left, Side-by-Side!) -->
            <div class="flex-1 flex flex-col justify-around px-4 sm:px-6 h-full overflow-x-visible">
              <div
                v-for="(item, idx) in menuData.items"
                :key="item.id || idx"
                :class="[
                  'flex flex-row justify-between h-full py-1 relative group transition-all',
                  itemClasses.col,
                  menuData.showDividers ? 'border-l border-stone-200' : ''
                ]"
              >
                <!-- Item Name & Tag (Top of vertical column) -->
                <div>
                  <!-- Main Item Name (Editable) -->
                  <div
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold text-stone-900 outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text',
                      itemClasses.name
                    ]"
                    title="タップして品名を編集"
                  >
                    {{ item.name }}
                  </div>

                  <!-- Note Badge (e.g. 塩・タレ) (Editable) -->
                  <div
                    v-if="menuData.showNotes && item.note"
                    contenteditable="true"
                    @blur="onTextBlur(item, 'note', $event)"
                    :class="[
                      'editable-field text-stone-600 tracking-tighter bg-stone-100 border border-stone-300 rounded-xs outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text',
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
                    class="editable-field text-[9px] text-stone-500 font-sans tracking-tight opacity-80 mt-1 outline-none hover:bg-amber-100/60 cursor-text"
                    title="タップして翻訳を編集"
                  >
                    {{ item.translation }}
                  </div>
                </div>

                <!-- Price at the bottom of the column (Editable) -->
                <div class="self-end pb-1">
                  <div
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    :class="[
                      'editable-field font-bold text-stone-900 whitespace-nowrap outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 focus:ring-1 focus:ring-amber-700 rounded px-0.5 cursor-text',
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
            <div class="flex flex-row justify-between pr-2 sm:pr-4 shrink-0 h-full text-stone-700">
              <div
                v-if="menuData.storeName"
                contenteditable="true"
                @blur="onTextBlur(menuData, 'storeName', $event)"
                class="editable-field text-xs font-bold text-stone-600 tracking-wider outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text self-start pt-1"
                title="タップして店名を編集"
              >
                {{ menuData.storeName }}
              </div>
              <div v-else></div>

              <div
                contenteditable="true"
                @blur="onTextBlur(menuData, 'footerNote', $event)"
                class="editable-field text-[10px] text-stone-400 tracking-wider outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 cursor-text self-end pb-1"
                title="タップして注記を編集"
              >
                {{ menuData.footerNote }}
              </div>
            </div>
          </div>

          <!-- HORIZONTAL WRITING LAYOUT (横書き) -->
          <div
            v-else
            class="w-full flex-1 flex flex-col justify-between"
          >
            <!-- Header -->
            <div class="text-center pb-5 border-b-2 border-stone-800">
              <div
                contenteditable="true"
                @blur="onTextBlur(menuData, 'subtitle', $event)"
                class="editable-field text-xs text-stone-600 font-bold tracking-widest mb-1 outline-none hover:bg-amber-100/60 cursor-text"
              >
                {{ menuData.subtitle }}
              </div>
              <div class="flex items-center justify-center gap-3">
                <h1
                  contenteditable="true"
                  @blur="onTextBlur(menuData, 'title', $event)"
                  class="editable-field text-2xl sm:text-3xl font-black tracking-widest text-stone-950 outline-none hover:bg-amber-100/60 cursor-text"
                >
                  {{ menuData.title }}
                </h1>
                <div
                  contenteditable="true"
                  @blur="onTextBlur(menuData, 'stampText', $event)"
                  class="editable-field border-2 border-red-700 text-red-700 font-bold text-[10px] px-1 py-0.5 rounded-xs outline-none hover:bg-red-50 cursor-text"
                >
                  {{ menuData.stampText || (menuData.storeName ? menuData.storeName.slice(0, 4) : '名物') }}
                </div>
              </div>
              <div
                v-if="menuData.storeName"
                contenteditable="true"
                @blur="onTextBlur(menuData, 'storeName', $event)"
                class="editable-field text-xs text-stone-700 font-bold tracking-wider mt-1 outline-none hover:bg-amber-100/60 cursor-text"
              >
                {{ menuData.storeName }}
              </div>
            </div>

            <!-- Horizontal Items Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3.5 py-6">
              <div
                v-for="(item, idx) in menuData.items"
                :key="item.id || idx"
                class="flex items-baseline justify-between border-b border-stone-200 pb-1.5"
              >
                <div class="flex items-center gap-2">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    class="editable-field text-base font-bold text-stone-900 outline-none hover:bg-amber-100/60 cursor-text"
                  >
                    {{ item.name }}
                  </span>
                  <span
                    v-if="menuData.showNotes && item.note"
                    contenteditable="true"
                    @blur="onTextBlur(item, 'note', $event)"
                    class="editable-field text-[11px] text-stone-600 bg-stone-100 border border-stone-300 px-1 rounded-xs outline-none hover:bg-amber-100/60 cursor-text"
                  >
                    {{ item.note }}
                  </span>
                  <span
                    v-if="menuData.showEnglish && item.translation"
                    contenteditable="true"
                    @blur="onTextBlur(item, 'translation', $event)"
                    class="editable-field text-xs text-stone-400 font-sans outline-none hover:bg-amber-100/60 cursor-text"
                  >
                    ({{ item.translation }})
                  </span>
                </div>
                <!-- Price in Horizontal mode -->
                <div
                  contenteditable="true"
                  @blur="onPriceBlur(item, $event)"
                  class="editable-field font-bold text-sm sm:text-base text-stone-900 whitespace-nowrap pl-2 outline-none hover:bg-amber-100/60 cursor-text"
                >
                  {{ formatPrice(item.price, menuData.priceFormat, false) }}
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-1">
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
                class="editable-field font-bold text-stone-700 tracking-wider outline-none hover:bg-amber-100/60 cursor-text"
              >
                {{ menuData.storeName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
