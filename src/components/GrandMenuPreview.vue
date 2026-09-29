<template>
  <div class="space-y-4 print:space-y-0 print:m-0 print:p-0 print:h-full">
    <!-- Dynamic Print Page CSS for Landscape vs Portrait (印刷時の2ページ化を完全に防止) -->
    <component :is="'style'">
      @media print {
        @page {
          size: {{ menuData.paperSize === 'B5' ? '182mm 257mm' : 'A4' }} {{ isLandscape ? 'landscape' : 'portrait' }};
          margin: 4mm;
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
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
          グランドメニュー（定番）
        </span>
        <span class="text-xs text-stone-500 font-medium">
          {{ menuData.paperSize || 'A4' }} {{ isLandscape ? '横置き' : '縦置き' }} · 縦書き
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
        >
          <Loader2 v-if="isGeneratingImage" class="w-4 h-4 animate-spin text-amber-600" />
          <ImageIcon v-else class="w-4 h-4 text-stone-600" />
          <span class="hidden sm:inline">画像保存 (PNG)</span>
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
          'print-sheet shrink-0 shadow-2xl transition-all relative select-none border border-current/20 print:shadow-none print:border-none print:min-w-0 print:max-w-none print:w-full print:h-full print:min-h-0 print:p-2 overflow-hidden',
          fontClass,
          sheetDimensionClasses
        ]"
        :style="sheetStyle"
      >
        <!-- ==============================================================
             A. LANDSCAPE LAYOUT (横置き・実写真忠実2段組レイアウト)
             ============================================================== -->
        <div
          v-if="isLandscape"
          class="w-full h-full flex flex-col justify-between relative z-10 px-2.5 py-2 sm:px-4 sm:py-3 print:p-2 box-border overflow-hidden"
        >
          <!-- ------------------------------------------------------------
               上段 (Top Half): 焼き物(20品)・トッピング(3品)・サラダ(2品)・ご飯もの(6品)
               ------------------------------------------------------------ -->
          <div
            :class="[
              'vertical-rl h-[48%] flex flex-col items-stretch pb-1 overflow-visible',
              containerSpacingClass
            ]"
          >
            <div
              v-for="(section, sIdx) in topSections"
              :key="section.id || sIdx"
              :class="[
                'flex flex-col items-stretch h-full shrink-0',
                sectionSpacingClass(sIdx)
              ]"
            >
              <!-- 見出しエリア（メイン見出し列 ＋ サブ注記列：横並び＆上端揃え） -->
              <div class="flex flex-col justify-start items-start h-full shrink-0">
                <!-- メイン見出し（焼き物 等） -->
                <div class="flex flex-row justify-start items-start h-full px-0.5 shrink-0">
                  <h2
                    contenteditable="true"
                    @blur="onTextBlur(section, 'name', $event)"
                    :class="[
                      'editable-field font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 whitespace-nowrap pt-0.5',
                      categoryHeaderClass(section.name)
                    ]"
                  >
                    {{ section.name }}
                  </h2>
                </div>
                <!-- サブ注記（一本 塩・タレ 等）: 見出しのすぐ左隣に上端揃えで綺麗に配置 -->
                <div
                  v-if="section.subtitle"
                  class="flex flex-row justify-start items-start h-full px-0.5 shrink-0"
                >
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(section, 'subtitle', $event)"
                    class="editable-field text-[8.5px] sm:text-[9.5px] opacity-80 tracking-widest pt-0.5 pl-0.5 outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded whitespace-nowrap"
                  >
                    {{ section.subtitle }}
                  </span>
                </div>
              </div>

              <!-- 品目列群 -->
              <div
                v-for="(item, idx) in section.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-[1.5px] min-w-[10px] sm:min-w-[12px] shrink-0"
              >
                <!-- 品名（上端揃え、中黒付き） -->
                <div class="pt-0.5 whitespace-nowrap overflow-visible leading-none">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold leading-tight outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 block',
                      getItemNameClass(item.name)
                    ]"
                  >
                    <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70 mr-0.5">・</span>{{ item.name }}
                  </span>
                </div>

                <!-- 個別価格（一括価格がない場合のみ表示、下端ベースライン揃え、font-mono除去でフォント統一） -->
                <div v-if="!section.uniformPrice" class="self-end pb-0.5 whitespace-nowrap shrink-0 leading-none">
                  <span
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    :class="[
                      'editable-field font-bold tracking-tight outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5',
                      itemPriceClass
                    ]"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </span>
                </div>
              </div>

              <!-- 一括価格列（トッピング等の「各五〇円」：下端揃え） -->
              <div v-if="section.uniformPrice" class="flex flex-row justify-end items-end h-full px-0.5 shrink-0 pb-0.5 leading-none">
                <span
                  contenteditable="true"
                  @blur="onTextBlur(section, 'uniformPrice', $event)"
                  :class="[
                    'editable-field font-bold tracking-tight whitespace-nowrap outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5',
                    itemPriceClass
                  ]"
                >
                  各{{ formatPrice(section.uniformPrice, menuData.priceFormat, true) }}
                </span>
              </div>
            </div>

          </div>

          <!-- ------------------------------------------------------------
               下段 (Bottom Half): 一品(17品) ＋ 店舗案内・営業ルール
               ------------------------------------------------------------ -->
          <div
            :class="[
              'vertical-rl h-[48%] flex flex-col items-stretch pt-1 overflow-visible',
              containerSpacingClass
            ]"
          >
            <div
              v-for="(section, sIdx) in bottomSections"
              :key="section.id || sIdx"
              :class="[
                'flex flex-col items-stretch h-full shrink-0',
                sectionSpacingClass(sIdx)
              ]"
            >
              <!-- 見出しエリア（メイン見出し列 ＋ サブ注記列：横並び＆上端揃え） -->
              <div class="flex flex-col justify-start items-start h-full shrink-0">
                <!-- メイン見出し（一品 等） -->
                <div class="flex flex-row justify-start items-start h-full px-0.5 shrink-0">
                  <h2
                    contenteditable="true"
                    @blur="onTextBlur(section, 'name', $event)"
                    :class="[
                      'editable-field font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 whitespace-nowrap pt-0.5',
                      categoryHeaderClass(section.name)
                    ]"
                  >
                    {{ section.name }}
                  </h2>
                </div>
                <!-- サブ注記（任意）: 見出しのすぐ左隣に上端揃えで綺麗に配置 -->
                <div
                  v-if="section.subtitle"
                  class="flex flex-row justify-start items-start h-full px-0.5 shrink-0"
                >
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(section, 'subtitle', $event)"
                    class="editable-field text-[8.5px] sm:text-[9.5px] opacity-80 tracking-widest pt-0.5 pl-0.5 outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded whitespace-nowrap"
                  >
                    {{ section.subtitle }}
                  </span>
                </div>
              </div>

              <!-- 品目列群 -->
              <div
                v-for="(item, idx) in section.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-[1.5px] min-w-[10px] sm:min-w-[12px] shrink-0"
              >
                <!-- 品名 -->
                <div class="pt-0.5 whitespace-nowrap overflow-visible leading-none">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold leading-tight outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 block',
                      getItemNameClass(item.name)
                    ]"
                  >
                    <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70 mr-0.5">・</span>{{ item.name }}
                  </span>
                </div>

                <!-- 個別価格（下端揃え、font-mono除去でフォント統一） -->
                <div v-if="!section.uniformPrice" class="self-end pb-0.5 whitespace-nowrap shrink-0 leading-none">
                  <span
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    :class="[
                      'editable-field font-bold tracking-tight outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5',
                      itemPriceClass
                    ]"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </span>
                </div>
              </div>

              <!-- 一括価格列 -->
              <div v-if="section.uniformPrice" class="flex flex-row justify-end items-end h-full px-0.5 shrink-0 pb-0.5 leading-none">
                <span
                  contenteditable="true"
                  @blur="onTextBlur(section, 'uniformPrice', $event)"
                  :class="[
                    'editable-field font-bold tracking-tight whitespace-nowrap outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5',
                    itemPriceClass
                  ]"
                >
                  各{{ formatPrice(section.uniformPrice, menuData.priceFormat, true) }}
                </span>
              </div>
            </div>

            <!-- 店舗案内・営業ルール（下段中央寄り・実写真スタイル） -->
            <div
              v-if="menuData.noticeBlock && menuData.noticeBlock.show"
              :class="[
                'flex flex-col items-stretch h-full pr-1 shrink-0',
                noticeBlockSpacingClass
              ]"
            >
              <!-- 案内文（実写真・PDF同様、2行ずつゆったり縦書き配置） -->
              <div class="flex flex-col justify-center items-start h-full gap-1.5 sm:gap-2 text-[8.5px] sm:text-[9.5px] leading-relaxed opacity-90">
                <div
                  v-for="(line, lIdx) in menuData.noticeBlock.lines"
                  :key="lIdx"
                  contenteditable="true"
                  @blur="onNoticeBlur(lIdx, $event)"
                  :class="[
                    'editable-field whitespace-nowrap outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5',
                    lIdx % 2 === 1 && lIdx < menuData.noticeBlock.lines.length - 1 ? 'mb-2 sm:mb-2.5' : ''
                  ]"
                >
                  {{ line }}
                </div>
              </div>
            </div>

            <!-- 正式ロゴ画像（用紙左下・独立エリア：案内文と十分な距離を保ち常に左下に堂々と配置） -->
            <div
              v-if="currentLogoImage"
              :class="[
                'flex flex-col items-center justify-end shrink-0 pl-3 sm:pl-6 lg:pl-8 pr-1',
                menuData.logoPosition === 'top'
                  ? 'self-start pt-2'
                  : (!menuData.logoPosition || menuData.logoPosition === 'bottom' || menuData.logoPosition === 'bottom-left')
                    ? 'self-end pb-1'
                    : 'self-center'
              ]"
            >
              <img
                :src="currentLogoImage"
                alt="店舗ロゴ"
                :style="{
                  width: (menuData.logoSize || 130) + 'px',
                  height: (menuData.logoSize || 130) + 'px',
                  maxWidth: 'none'
                }"
                class="object-contain rounded-xs transition-all select-none"
              />
            </div>

          </div>

        </div>

        <!-- ==============================================================
             B. PORTRAIT LAYOUT (縦置き・汎用3段組レイアウト)
             ============================================================== -->
        <div
          v-else
          class="w-full h-full flex flex-col justify-between relative z-10 p-3 sm:p-5 print:p-2 box-border overflow-hidden"
        >
          <!-- 1段目 (上段) -->
          <div class="vertical-rl h-[32%] flex flex-col justify-start items-stretch border-b border-stone-800/20 pb-1.5 overflow-visible">
            <div
              v-for="(section, sIdx) in portraitTopSections"
              :key="section.id || sIdx"
              :class="[
                'flex flex-col items-stretch h-full shrink-0',
                sIdx === 0 ? '' : 'px-1.5 border-r border-current/20 pl-1.5'
              ]"
            >
              <div class="flex flex-row justify-start items-center h-full px-1 shrink-0 border-l border-current/25">
                <h2 class="text-sm sm:text-base font-black tracking-widest">{{ section.name }}</h2>
                <span v-if="section.subtitle" class="text-[9px] opacity-80 mt-1 whitespace-nowrap">{{ section.subtitle }}</span>
              </div>
              <div
                v-for="(item, idx) in section.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[15px] sm:min-w-[18px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold leading-tight">
                  <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70">・</span>{{ item.name }}
                </div>
                <div v-if="!section.uniformPrice" class="self-end pb-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold font-mono">
                  {{ formatPrice(item.price, menuData.priceFormat, true) }}
                </div>
              </div>
              <div v-if="section.uniformPrice" class="flex flex-row justify-end items-end h-full px-0.5 shrink-0 pb-0.5">
                <span class="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">各{{ formatPrice(section.uniformPrice, menuData.priceFormat, true) }}</span>
              </div>
            </div>
          </div>

          <!-- 2段目 (中段) -->
          <div class="vertical-rl h-[32%] flex flex-col justify-start items-stretch border-b border-stone-800/20 py-1.5 overflow-visible">
            <div
              v-for="(section, sIdx) in portraitMidSections"
              :key="section.id || sIdx"
              :class="[
                'flex flex-col items-stretch h-full shrink-0',
                sIdx === 0 ? '' : 'px-1.5 border-r border-current/20 pl-1.5'
              ]"
            >
              <div class="flex flex-row justify-start items-center h-full px-1 shrink-0 border-l border-current/25">
                <h2 class="text-sm sm:text-base font-black tracking-widest">{{ section.name }}</h2>
                <span v-if="section.subtitle" class="text-[9px] opacity-80 mt-1 whitespace-nowrap">{{ section.subtitle }}</span>
              </div>
              <div
                v-for="(item, idx) in section.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[15px] sm:min-w-[18px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold leading-tight">
                  <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70">・</span>{{ item.name }}
                </div>
                <div v-if="!section.uniformPrice" class="self-end pb-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold font-mono">
                  {{ formatPrice(item.price, menuData.priceFormat, true) }}
                </div>
              </div>
              <div v-if="section.uniformPrice" class="flex flex-row justify-end items-end h-full px-0.5 shrink-0 pb-0.5">
                <span class="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">各{{ formatPrice(section.uniformPrice, menuData.priceFormat, true) }}</span>
              </div>
            </div>
          </div>

          <!-- 3段目 (下段) ＋ ロゴ・案内 -->
          <div class="vertical-rl h-[34%] flex flex-col justify-start items-stretch pt-1.5 overflow-visible">
            <div
              v-for="(section, sIdx) in portraitBottomSections"
              :key="section.id || sIdx"
              :class="[
                'flex flex-col items-stretch h-full shrink-0',
                sIdx === 0 ? '' : 'px-1.5 border-r border-current/20 pl-1.5'
              ]"
            >
              <div class="flex flex-row justify-start items-center h-full px-1 shrink-0 border-l border-current/25">
                <h3 class="text-xs sm:text-sm font-black">{{ section.name }}</h3>
                <span v-if="section.subtitle" class="text-[8.5px] opacity-80 mt-1 whitespace-nowrap">{{ section.subtitle }}</span>
              </div>
              <div
                v-for="(item, idx) in section.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[15px] sm:min-w-[17px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold">
                  <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70">・</span>{{ item.name }}
                </div>
                <div v-if="!section.uniformPrice" class="self-end pb-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold font-mono">
                  {{ formatPrice(item.price, menuData.priceFormat, true) }}
                </div>
              </div>
              <div v-if="section.uniformPrice" class="flex flex-row justify-end items-end h-full px-0.5 shrink-0 pb-0.5">
                <span class="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">各{{ formatPrice(section.uniformPrice, menuData.priceFormat, true) }}</span>
              </div>
            </div>

            <!-- 店舗案内・ロゴ -->
            <div v-if="menuData.noticeBlock && menuData.noticeBlock.show" class="flex flex-col items-stretch h-full pl-2 pr-1 shrink-0">
              <div class="flex flex-col justify-center items-start h-full gap-1 text-[8.5px] sm:text-[9.5px] leading-relaxed opacity-85">
                <div v-for="(line, lIdx) in menuData.noticeBlock.lines" :key="lIdx" class="whitespace-nowrap">
                  {{ line }}
                </div>
              </div>
              <div v-if="currentLogoImage" class="flex items-center justify-center pl-1.5 self-center">
                <img
                  :src="currentLogoImage"
                  alt="店舗ロゴ"
                  class="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xs"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="showImageModal"
      class="no-print fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      @click.self="showImageModal = false"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-stone-200">
          <div class="flex items-center gap-2">
            <ImageIcon class="w-5 h-5 text-amber-600" />
            <h3 class="font-bold text-stone-900 text-base">生成されたグランドメニュー画像</h3>
          </div>
          <button
            @click="showImageModal = false"
            class="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-auto py-4 flex items-center justify-center bg-stone-100 rounded-xl my-3">
          <img
            :src="generatedImageUrl"
            alt="グランドメニュー画像"
            class="max-h-[60vh] max-w-full rounded shadow-md object-contain"
          />
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <button
            @click="showImageModal = false"
            class="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            閉じる
          </button>
          <button
            @click="downloadGeneratedImage"
            class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-sm font-black shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download class="w-4 h-4" />
            <span>保存する</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { formatPrice } from '../utils/formatters'
import { Printer, Image as ImageIcon, Loader2, Download, X, ArrowLeftRight, Edit3 } from '@lucide/vue'
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

const isLandscape = computed(() => props.menuData.paperOrientation !== 'portrait')
const isB5 = computed(() => props.menuData.paperSize === 'B5')

// アップロードされた正式ロゴ画像（未設定時は空）
const currentLogoImage = computed(() => {
  return props.menuData.logoImage || props.menuData.noticeBlock?.logoImage || ''
})

// 配置間隔スタイル（自動均等整列 vs 手動間隔）
const containerSpacingClass = computed(() => {
  const spacing = props.menuData.sectionSpacing || 'auto'
  switch (spacing) {
    case 'spacious':
      return 'justify-start gap-3 sm:gap-4.5 lg:gap-5.5'
    case 'compact':
      return 'justify-start gap-1 sm:gap-2 lg:gap-2.5'
    case 'normal':
      return 'justify-start gap-2.5 sm:gap-3.5 lg:gap-4.5'
    case 'auto':
    default:
      // 用紙幅全体に自動均等配置（焼き物・トッピング・サラダ・ご飯ものが均等に配置される）
      return 'justify-between'
  }
})

// セクションごとの間隔クラス（手動時も特定のカテゴリ間だけ狭くなるバグを根絶）
function sectionSpacingClass(sIdx) {
  const spacing = props.menuData.sectionSpacing || 'auto'
  if (spacing === 'auto') {
    return 'px-0.5'
  }
  return ''
}

// 店舗案内ブロックの間隔
const noticeBlockSpacingClass = computed(() => {
  const spacing = props.menuData.sectionSpacing || 'auto'
  if (spacing === 'auto') {
    return 'pl-2 sm:pl-3'
  } else if (spacing === 'compact') {
    return 'pl-3 sm:pl-5'
  } else {
    return 'pl-4 sm:pl-7 lg:pl-9'
  }
})

// 見出しの文字サイズ
function categoryHeaderClass(name) {
  const isMajor = name === '焼き物' || name === 'ご飯もの' || name === '一品'
  const size = props.menuData.itemFontSize || 'normal'
  if (size === 'large') {
    return isMajor ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg lg:text-xl'
  } else if (size === 'small') {
    return isMajor ? 'text-sm sm:text-base lg:text-lg' : 'text-xs sm:text-sm lg:text-base'
  } else {
    return isMajor ? 'text-base sm:text-lg lg:text-xl' : 'text-sm sm:text-base lg:text-lg'
  }
}

// 価格文字サイズ
const itemPriceClass = computed(() => {
  const size = props.menuData.itemFontSize || 'normal'
  if (size === 'small') {
    return 'text-[8.5px] sm:text-[9.5px]'
  } else if (size === 'large') {
    return 'text-[10.5px] sm:text-[11.5px]'
  } else {
    return 'text-[9.5px] sm:text-[10.5px]'
  }
})

onMounted(() => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth
    }
  })
})

// 品名の文字数および一括フォントサイズ設定に応じたクラス判定
function getItemNameClass(name) {
  const len = name ? name.length : 0
  const size = props.menuData.itemFontSize || 'normal'

  if (size === 'small') {
    if (len <= 6) return 'text-[10px] sm:text-[11.5px] tracking-normal'
    if (len <= 8) return 'text-[9px] sm:text-[10px] tracking-tight'
    return 'text-[8px] sm:text-[9px] tracking-tighter'
  } else if (size === 'large') {
    if (len <= 6) return 'text-[13px] sm:text-[14.5px] tracking-normal'
    if (len <= 8) return 'text-[11.5px] sm:text-[13px] tracking-tight'
    return 'text-[10px] sm:text-[11.5px] tracking-tighter'
  } else {
    // normal
    if (len <= 6) return 'text-[11.5px] sm:text-[13px] tracking-normal'
    if (len <= 8) return 'text-[10px] sm:text-[11.5px] tracking-tight'
    return 'text-[9px] sm:text-[10px] tracking-tighter'
  }
}

// ==============================================================
// 汎用動的セクション振り分けエンジン（表示ONのカテゴリのみ対象）
// ==============================================================

// 「メニューに表示する」がON（visible !== false）のカテゴリのみを抽出
const activeSections = computed(() => {
  return (props.menuData.sections || []).filter(s => s.visible !== false)
})

// 横置き（2段組）: placement指定（'top' | 'bottom'）を優先し、未指定時は均等自動分割
// ※新規追加されたカテゴリは常に一番最後（下段の末尾）に配置される
const topSections = computed(() => {
  const secs = activeSections.value
  if (secs.length <= 1) return secs

  // 明示的な placement 指定があるか判定
  const hasExplicit = secs.some(s => s.placement === 'top' || s.placement === 'bottom')
  if (hasExplicit) {
    // 上段指定（'top'）のカテゴリのみを上段に配置
    return secs.filter(s => s.placement === 'top')
  }

  // 自動均等分割
  const totalItems = secs.reduce((acc, s) => acc + (s.items?.length || 0), 0)
  const half = totalItems / 2
  let current = 0
  const top = []
  for (let i = 0; i < secs.length; i++) {
    const s = secs[i]
    top.push(s)
    current += (s.items?.length || 0)
    if (current >= half && i < secs.length - 1) {
      break
    }
  }
  return top
})

const bottomSections = computed(() => {
  const secs = activeSections.value
  const hasExplicit = secs.some(s => s.placement === 'top' || s.placement === 'bottom')
  if (hasExplicit) {
    // 上段指定以外（'bottom' や未指定で追加されたカテゴリ）はすべて下段へ
    const topIds = new Set(topSections.value.map(s => s.id))
    return secs.filter(s => !topIds.has(s.id))
  }
  const topIds = new Set(topSections.value.map(s => s.id))
  return secs.filter(s => !topIds.has(s.id))
})

// 縦置き（3段組）: 3分割自動振り分け
const portraitTopSections = computed(() => {
  const secs = activeSections.value
  if (secs.length <= 2) return secs.slice(0, 1)
  const totalItems = secs.reduce((acc, s) => acc + (s.items?.length || 0), 0)
  const target = totalItems / 3
  let current = 0
  const top = []
  for (let i = 0; i < secs.length; i++) {
    const s = secs[i]
    top.push(s)
    current += (s.items?.length || 0)
    if (current >= target && i < secs.length - 2) break
  }
  return top
})

const portraitMidSections = computed(() => {
  const secs = activeSections.value
  const topIds = new Set(portraitTopSections.value.map(s => s.id))
  const remaining = secs.filter(s => !topIds.has(s.id))
  if (remaining.length <= 1) return remaining
  const totalItems = remaining.reduce((acc, s) => acc + (s.items?.length || 0), 0)
  const target = totalItems / 2
  let current = 0
  const mid = []
  for (let i = 0; i < remaining.length; i++) {
    const s = remaining[i]
    mid.push(s)
    current += (s.items?.length || 0)
    if (current >= target && i < remaining.length - 1) break
  }
  return mid
})

const portraitBottomSections = computed(() => {
  const secs = activeSections.value
  const topIds = new Set(portraitTopSections.value.map(s => s.id))
  const midIds = new Set(portraitMidSections.value.map(s => s.id))
  return secs.filter(s => !topIds.has(s.id) && !midIds.has(s.id))
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

// 用紙の正確な比率（1.414 : 1 または 1 : 1.414）
const sheetDimensionClasses = computed(() => {
  if (isLandscape.value) {
    return isB5.value
      ? 'w-full max-w-[820px] aspect-[1.414/1] min-w-[560px] lg:min-w-0' // B5横 (257x182比率)
      : 'w-full max-w-[940px] aspect-[1.414/1] min-w-[600px] lg:min-w-0' // A4横 (297x210比率 1.414:1)
  } else {
    return isB5.value
      ? 'w-full max-w-[480px] aspect-[1/1.414] min-w-[340px] lg:min-w-0' // B5縦
      : 'w-full max-w-[540px] aspect-[1/1.414] min-w-[360px] lg:min-w-0' // A4縦 (1:1.414比率)
  }
})

const bgToneStyle = computed(() => {
  const color = props.menuData.bgColor || '#e3ebdc'
  const pattern = props.menuData.bgPattern || 'washi'

  let backgroundImage = 'none'
  let backgroundSize = 'auto'

  switch (pattern) {
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
    backgroundColor: color,
    backgroundImage,
    backgroundSize,
  }
})

const sheetStyle = computed(() => {
  return {
    ...bgToneStyle.value,
    color: props.menuData.textColor || '#1a1f1b',
    boxSizing: 'border-box'
  }
})

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

function onNoticeBlur(index, event) {
  const text = event.target.innerText.trim()
  if (props.menuData.noticeBlock?.lines) {
    props.menuData.noticeBlock.lines[index] = text
  }
}

function triggerPrint() {
  window.print()
}

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
  } catch (error) {
    console.error('画像生成に失敗しました:', error)
    alert('画像の生成中にエラーが発生しました。もう一度お試しください。')
  } finally {
    isGeneratingImage.value = false
  }
}

function downloadGeneratedImage() {
  if (!generatedImageUrl.value) return
  const filename = `グランドメニュー_${new Date().toISOString().slice(0, 10)}.png`
  const link = document.createElement('a')
  link.download = filename
  link.href = generatedImageUrl.value
  link.click()
}
</script>

<style scoped>
.editable-field:focus {
  outline: 2px solid #d97706;
  outline-offset: 1px;
}

@media print {
  .print-sheet {
    box-shadow: none !important;
    border: none !important;
    width: 100% !important;
    height: 100% !important;
    max-height: calc(100vh - 8mm) !important;
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
    break-inside: avoid !important;
    break-after: avoid !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }
}
</style>
