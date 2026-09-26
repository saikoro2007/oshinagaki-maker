<script setup>
import { ref, computed } from 'vue'
import { formatPrice } from '../utils/formatters'
import { Printer, ZoomIn, ZoomOut, Maximize2 } from '@lucide/vue'

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
      }
    </component>

    <!-- Screen-only Control Bar -->
    <div class="no-print bg-stone-900 text-white rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto">
      <div>
        <div class="font-bold text-sm sm:text-base flex items-center gap-1.5">
          <span>🖨️</span>
          <span>お品書きプレビュー</span>
        </div>
        <p class="text-xs text-stone-300 mt-0.5">
          用紙: {{ menuData.paperSize || 'A4' }}・{{ isLandscape ? '横向き (横長)' : '縦向き (縦長)' }} / {{ menuData.layout === 'vertical' ? '縦書き' : '横書き' }} / {{ menuData.items.length }}品
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
            ? 'min-w-[820px] max-w-[1080px] w-full min-h-[520px] sm:min-h-[580px] p-6 sm:p-10'
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
            class="vertical-rl w-full h-[460px] sm:h-[500px] flex flex-col justify-between overflow-x-visible py-1"
          >
            <!-- 1. Right Header Section (Title & Subtitle & Stamp) -->
            <div class="flex flex-row justify-between pl-6 sm:pl-8 border-l-2 border-stone-800 shrink-0 h-full">
              <div>
                <div class="text-xs sm:text-sm text-stone-600 font-bold tracking-widest">
                  {{ menuData.subtitle }}
                </div>
                <h1 class="text-3xl sm:text-4xl font-black tracking-widest text-stone-950 mt-2">
                  {{ menuData.title }}
                </h1>
              </div>

              <!-- Traditional Red Stamp Seal -->
              <div class="border-2 border-red-700 text-red-700 font-bold text-xs p-1.5 rounded-xs tracking-tighter self-end select-none">
                {{ menuData.stampText || (menuData.storeName ? menuData.storeName.slice(0, 2) : '名物') }}
              </div>
            </div>

            <!-- 2. Middle Items Section (Flows from Right to Left, Side-by-Side!) -->
            <div class="flex-1 flex flex-col justify-around px-4 sm:px-6 h-full overflow-x-visible">
              <div
                v-for="(item, idx) in menuData.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full py-1 px-2 border-l border-dotted border-stone-300 relative group min-w-[28px] sm:min-w-[36px]"
              >
                <!-- Item Name & Tag (Top of vertical column) -->
                <div>
                  <!-- Main Item Name -->
                  <div class="text-lg sm:text-xl font-bold tracking-wider leading-tight text-stone-900">
                    {{ item.name }}
                  </div>

                  <!-- Note Badge (e.g. 塩・タレ) -->
                  <div
                    v-if="menuData.showNotes && item.note"
                    class="text-[10px] text-stone-600 tracking-tighter bg-stone-100 border border-stone-300 px-0.5 py-1 rounded-xs mt-2"
                  >
                    {{ item.note }}
                  </div>

                  <!-- English translation if enabled -->
                  <div
                    v-if="menuData.showEnglish && item.translation"
                    class="text-[9px] text-stone-500 font-sans tracking-tight opacity-80 mt-1"
                  >
                    {{ item.translation }}
                  </div>
                </div>

                <!-- Price at the bottom of the column -->
                <div class="self-end pb-1">
                  <div class="text-sm sm:text-base font-bold text-stone-900 tracking-widest whitespace-nowrap">
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Left Footer Section (Store Name, Notice) -->
            <div class="flex flex-row justify-between pr-4 sm:pr-6 border-r border-stone-300 shrink-0 h-full text-stone-700">
              <div v-if="menuData.storeName" class="text-base font-bold tracking-widest">
                {{ menuData.storeName }}
              </div>
              <div v-else></div>

              <div class="text-[10px] text-stone-500 tracking-wider">
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
              <div class="text-xs text-stone-600 font-bold tracking-widest mb-1">
                {{ menuData.subtitle }}
              </div>
              <div class="flex items-center justify-center gap-3">
                <h1 class="text-2xl sm:text-3xl font-black tracking-widest text-stone-950">
                  {{ menuData.title }}
                </h1>
                <div class="border-2 border-red-700 text-red-700 font-bold text-[10px] px-1 py-0.5 rounded-xs">
                  {{ menuData.stampText || (menuData.storeName ? menuData.storeName.slice(0, 2) : '名物') }}
                </div>
              </div>
            </div>

            <!-- Horizontal Items Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3.5 py-6">
              <div
                v-for="(item, idx) in menuData.items"
                :key="item.id || idx"
                class="flex items-baseline justify-between border-b border-dotted border-stone-300 pb-1.5"
              >
                <div class="flex items-center gap-2">
                  <span class="text-base font-bold text-stone-900">{{ item.name }}</span>
                  <span
                    v-if="menuData.showNotes && item.note"
                    class="text-[11px] text-stone-600 bg-stone-100 border border-stone-300 px-1 rounded-xs"
                  >
                    {{ item.note }}
                  </span>
                  <span
                    v-if="menuData.showEnglish && item.translation"
                    class="text-xs text-stone-400 font-sans"
                  >
                    ({{ item.translation }})
                  </span>
                </div>
                <div class="font-bold text-sm sm:text-base text-stone-900 whitespace-nowrap pl-2">
                  {{ formatPrice(item.price, menuData.priceFormat, false) }}
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-1">
              <div>{{ menuData.footerNote }}</div>
              <div v-if="menuData.storeName" class="font-bold text-stone-800 tracking-wider">{{ menuData.storeName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
