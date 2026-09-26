<script setup>
import { computed } from 'vue'
import { formatPrice } from '../utils/formatters'
import { Printer, Sparkles } from '@lucide/vue'

const props = defineProps({
  menuData: {
    type: Object,
    required: true,
  }
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
      return 'border-[3px] border-stone-900 outline outline-1 outline-stone-900 outline-offset-3'
    case 'minimal':
      return 'border-2 border-stone-800'
    case 'none':
      return 'border-0'
    default:
      return 'border-2 border-stone-900'
  }
})

function triggerPrint() {
  window.print()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Screen-only Print Bar -->
    <div class="no-print bg-stone-900 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 max-w-2xl mx-auto">
      <div>
        <div class="font-bold text-sm sm:text-base flex items-center gap-1.5">
          <span>🖨️</span> 印刷準備完了
        </div>
        <p class="text-xs text-stone-300 mt-0.5">
          {{ menuData.paperSize }}サイズ / {{ menuData.layout === 'vertical' ? '縦書き' : '横書き' }} / {{ menuData.items.length }}品目
        </p>
      </div>

      <button
        @click="triggerPrint"
        type="button"
        class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black rounded-xl text-sm shadow-md flex items-center gap-2 transition cursor-pointer"
      >
        <Printer class="w-4 h-4" />
        <span>印刷する</span>
      </button>
    </div>

    <!-- Paper Container with Japanese Washi Appearance -->
    <div class="overflow-x-auto pb-8 preview-scroll flex justify-center">
      <div
        :class="[
          'print-sheet bg-[#fffdfa] text-stone-950 p-6 sm:p-10 shadow-xl transition-all relative select-none',
          'min-w-[340px] max-w-[800px] w-full',
          fontClass,
        ]"
        style="box-sizing: border-box;"
      >
        <!-- Border Frame Outer -->
        <div
          :class="[
            'w-full h-full p-6 sm:p-8 flex flex-col justify-between relative',
            frameClasses
          ]"
        >
          <!-- Corner Traditional Accents (if traditional frame) -->
          <template v-if="menuData.frameStyle === 'traditional'">
            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-stone-900"></div>
            <div class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-stone-900"></div>
            <div class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-stone-900"></div>
            <div class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-stone-900"></div>
          </template>

          <!-- VERTICAL WRITING LAYOUT (縦書き) -->
          <div
            v-if="menuData.layout === 'vertical'"
            class="vertical-rl w-full h-[620px] sm:h-[680px] flex flex-col justify-between overflow-x-auto py-2"
          >
            <!-- Right Header Section (Title & Subtitle) -->
            <div class="flex items-center gap-4 pl-6 border-l-2 border-stone-800 shrink-0">
              <!-- Subtitle -->
              <div class="text-xs sm:text-sm text-stone-600 font-bold tracking-widest">
                {{ menuData.subtitle }}
              </div>

              <!-- Main Title -->
              <h1 class="text-3xl sm:text-4xl font-black tracking-widest text-stone-950 py-1">
                {{ menuData.title }}
              </h1>

              <!-- Red Stamp Seal -->
              <div class="border-2 border-red-700 text-red-700 font-bold text-xs p-1 rounded-xs tracking-tighter self-end select-none">
                {{ menuData.stampText || (menuData.storeName ? menuData.storeName.slice(0, 2) : '名物') }}
              </div>
            </div>

            <!-- Middle Items Section (Flows from Right to Left) -->
            <div class="flex-1 flex flex-row-reverse items-stretch justify-around px-4 gap-3 sm:gap-4 overflow-x-visible">
              <div
                v-for="(item, idx) in menuData.items"
                :key="item.id || idx"
                class="flex flex-col justify-between py-1 relative group min-w-[28px] sm:min-w-[34px]"
              >
                <!-- Item Name & Note (Top of vertical column) -->
                <div class="flex items-start gap-1">
                  <!-- Main Item Name -->
                  <span class="text-lg sm:text-xl font-bold tracking-wider leading-tight text-stone-900">
                    {{ item.name }}
                  </span>

                  <!-- Note badge (e.g. 塩・タレ) -->
                  <span
                    v-if="menuData.showNotes && item.note"
                    class="text-[10px] text-stone-600 tracking-tighter bg-stone-100 border border-stone-300 px-0.5 py-1 rounded-xs"
                  >
                    {{ item.note }}
                  </span>
                </div>

                <!-- English translation if enabled -->
                <div
                  v-if="menuData.showEnglish && item.translation"
                  class="text-[9px] text-stone-500 font-sans tracking-tight opacity-80 pt-1"
                >
                  {{ item.translation }}
                </div>

                <!-- Price at the bottom of the column -->
                <div class="mt-auto pt-4 flex flex-col items-center">
                  <div class="w-px h-6 bg-stone-300 mb-2"></div>
                  <span
                    class="text-sm sm:text-base font-bold text-stone-900 tracking-widest whitespace-nowrap"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Left Footer Section (Store Name, Notice) -->
            <div class="flex items-end justify-between pr-4 border-r border-stone-200 shrink-0 text-stone-700">
              <div class="text-sm font-bold tracking-widest">
                {{ menuData.storeName }}
              </div>
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
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 py-6">
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
              <div class="font-bold text-stone-800 tracking-wider">{{ menuData.storeName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
