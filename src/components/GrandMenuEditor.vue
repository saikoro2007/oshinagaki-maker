<template>
  <div class="space-y-5 pb-16">
    <!-- Header Card -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-1">
            グランドメニュー（定番・全品一覧）
          </span>
          <h2 class="text-base sm:text-lg font-bold text-stone-900">
            定番メニュー編集
          </h2>
        </div>

        <button
          type="button"
          @click="$emit('reset-mozu-default')"
          class="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
          title="店舗メニューの初期状態に戻す"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>初期データに戻す</span>
        </button>
      </div>

      <p class="text-xs text-stone-500 leading-relaxed">
        各カテゴリをタップして開閉し、品名や価格を編集できます。変更は自動保存されます。
      </p>
    </div>

    <!-- Category Accordions -->
    <div class="space-y-3">
      <div
        v-for="(section, sIdx) in menuData.sections"
        :key="section.id || sIdx"
        class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden transition-all"
      >
        <!-- Category Header (Click to toggle) -->
        <button
          type="button"
          @click="toggleSection(section.id)"
          class="w-full px-4 py-3.5 flex items-center justify-between bg-stone-50/70 hover:bg-stone-100/80 transition cursor-pointer text-left"
        >
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-4 bg-emerald-600 rounded-full"></span>
            <span class="font-bold text-stone-900 text-sm sm:text-base">
              {{ section.name }}
            </span>
            <span class="text-xs px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full font-medium">
              {{ section.items?.length || 0 }}品
            </span>
            <span v-if="section.subtitle" class="text-xs text-stone-500 font-normal">
              ({{ section.subtitle }})
            </span>
            <span v-if="section.uniformPrice" class="text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              各{{ section.uniformPrice }}円
            </span>
          </div>

          <component
            :is="isSectionOpen(section.id) ? ChevronUp : ChevronDown"
            class="w-4 h-4 text-stone-400"
          />
        </button>

        <!-- Category Content (Collapsible) -->
        <div v-if="isSectionOpen(section.id)" class="p-3 sm:p-4 border-t border-stone-100 space-y-3">
          
          <!-- Category Option inputs (Subtitle, Uniform price) -->
          <div class="grid grid-cols-2 gap-2 pb-2 border-b border-stone-100 text-xs">
            <div v-if="section.id === 'yakimono'">
              <label class="block text-stone-500 font-medium mb-1">注記（例: 一本 塩・タレ）</label>
              <input
                v-model="section.subtitle"
                type="text"
                class="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div v-if="section.id === 'topping'">
              <label class="block text-stone-500 font-medium mb-1">一括価格（例: 各50円）</label>
              <div class="flex items-center gap-1">
                <input
                  v-model="section.uniformPrice"
                  type="text"
                  class="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="50"
                />
                <span class="text-xs text-stone-600 shrink-0">円</span>
              </div>
            </div>
          </div>

          <!-- Items List inside Category -->
          <div class="space-y-2">
            <div
              v-for="(item, idx) in section.items"
              :key="item.id || idx"
              class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200 hover:border-amber-300 transition"
            >
              <!-- Index / Handle -->
              <span class="text-[11px] font-mono font-bold text-stone-400 w-4 text-center">
                {{ idx + 1 }}
              </span>

              <!-- Item Name Input -->
              <div class="flex-1">
                <input
                  v-model="item.name"
                  type="text"
                  placeholder="品名"
                  class="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs sm:text-sm font-bold text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <!-- Price Input (if not uniform price) -->
              <div v-if="!section.uniformPrice" class="w-20 sm:w-24 shrink-0 flex items-center gap-1">
                <input
                  v-model="item.price"
                  type="text"
                  inputmode="numeric"
                  placeholder="価格"
                  class="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-xs sm:text-sm font-mono font-bold text-right text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <span class="text-xs text-stone-500 shrink-0">円</span>
              </div>

              <!-- Actions (Reorder & Delete) -->
              <div class="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  @click="moveItem(section, idx, -1)"
                  :disabled="idx === 0"
                  class="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                  title="前へ"
                >
                  <ChevronUp class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="moveItem(section, idx, 1)"
                  :disabled="idx === section.items.length - 1"
                  class="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                  title="次へ"
                >
                  <ChevronDown class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="removeItem(section, idx)"
                  class="p-1 text-red-400 hover:text-red-600 transition"
                  title="削除"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Add Item Button -->
          <button
            type="button"
            @click="addItem(section)"
            class="w-full py-2 bg-stone-100 hover:bg-stone-200 border border-dashed border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>「{{ section.name }}」に品目を追加</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Store Rules & Notice Block Settings -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
          <span>店舗案内・営業ルール（左下枠）</span>
        </h3>
        <label class="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            v-model="menuData.noticeBlock.show"
            class="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <span>表示する</span>
        </label>
      </div>

      <div v-if="menuData.noticeBlock.show" class="space-y-2 pt-1">
        <div
          v-for="(line, lIdx) in menuData.noticeBlock.lines"
          :key="lIdx"
          class="flex items-center gap-2"
        >
          <span class="text-xs text-stone-400 font-mono w-4">{{ lIdx + 1 }}</span>
          <input
            v-model="menuData.noticeBlock.lines[lIdx]"
            type="text"
            class="flex-1 px-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Design & Paper Appearance Settings -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
      <h3 class="font-bold text-sm text-stone-900">
        デザイン・和紙設定
      </h3>

      <div class="grid grid-cols-2 gap-3 text-xs">
        <!-- Paper Color -->
        <div>
          <label class="block text-stone-500 mb-1 font-medium">背景色（和紙の色）</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              v-model="menuData.bgColor"
              class="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
            />
            <div class="flex gap-1">
              <button
                type="button"
                @click="menuData.bgColor = '#e3ebdc'"
                class="px-2 py-1 bg-[#e3ebdc] text-stone-800 border border-stone-300 rounded text-[10px] font-bold"
                title="写真の実物カラー（若草色）"
              >
                若草色
              </button>
              <button
                type="button"
                @click="menuData.bgColor = '#ffffff'"
                class="px-2 py-1 bg-white text-stone-800 border border-stone-300 rounded text-[10px]"
              >
                白
              </button>
            </div>
          </div>
        </div>

        <!-- Font Family -->
        <div>
          <label class="block text-stone-500 mb-1 font-medium">書体</label>
          <select
            v-model="menuData.fontFamily"
            class="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="brush">毛筆体（推奨・実物同様）</option>
            <option value="mincho">明朝体</option>
            <option value="gothic">ゴシック体</option>
          </select>
        </div>
      </div>

      <!-- Dot Prefix toggle -->
      <div class="pt-2 border-t border-stone-100 flex items-center justify-between">
        <span class="text-xs text-stone-700">品名の頭に中黒「・」をつける</span>
        <input
          type="checkbox"
          v-model="menuData.showDotPrefix"
          class="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw
} from '@lucide/vue'

const props = defineProps({
  menuData: {
    type: Object,
    required: true,
  }
})

defineEmits(['reset-mozu-default'])

// 最初に開いておくカテゴリ（初期値は焼き物）
const openSections = ref(['yakimono', 'ippin'])

function isSectionOpen(id) {
  return openSections.value.includes(id)
}

function toggleSection(id) {
  const index = openSections.value.indexOf(id)
  if (index >= 0) {
    openSections.value.splice(index, 1)
  } else {
    openSections.value.push(id)
  }
}

function addItem(section) {
  if (!section.items) section.items = []
  section.items.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
    name: '',
    price: '',
    note: ''
  })
}

function removeItem(section, index) {
  section.items.splice(index, 1)
}

function moveItem(section, index, direction) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= section.items.length) return
  const item = section.items.splice(index, 1)[0]
  section.items.splice(targetIndex, 0, item)
}
</script>
