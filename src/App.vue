<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { INITIAL_MENU_STATE } from './constants/presets'
import MenuEditor from './components/MenuEditor.vue'
import MenuPreview from './components/MenuPreview.vue'
import PresetModal from './components/PresetModal.vue'
import {
  Edit3,
  Eye,
  Printer,
  Sparkles,
  Share2,
  CheckCircle2
} from '@lucide/vue'

const STORAGE_KEY = 'oshinagaki_maker_menu_data'

// Tab state: 'editor' | 'preview'
const activeTab = ref('preview')
const showPresetModal = ref(false)
const showSaveToast = ref(false)

// Menu reactive data
const menuData = reactive(JSON.parse(JSON.stringify(INITIAL_MENU_STATE)))

// Load from LocalStorage
onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.assign(menuData, parsed)
    }
  } catch (e) {
    console.error('Failed to load menu data:', e)
  }
})

// Auto-save to LocalStorage
let toastTimer = null
watch(
  menuData,
  (newVal) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
      showSaveToast.value = true
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => {
        showSaveToast.value = false
      }, 1500)
    } catch (e) {
      console.error('Failed to save menu data:', e)
    }
  },
  { deep: true }
)

function handleAddItemFromPreset(item) {
  menuData.items.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
    name: item.name,
    price: item.price,
    note: item.note || '',
    translation: item.translation || '',
  })
}

function handleResetDefault() {
  if (confirm('メニュー内容を初期設定（おすすめ定番）に戻しますか？')) {
    Object.assign(menuData, JSON.parse(JSON.stringify(INITIAL_MENU_STATE)))
  }
}

function triggerPrint() {
  // If in editor tab, temporarily switch or print directly
  window.print()
}
</script>

<template>
  <div class="min-h-screen bg-stone-100 flex flex-col">
    <!-- Mobile Top Navigation Header (Hidden on Print) -->
    <header class="no-print sticky top-0 z-40 bg-stone-900 text-white shadow-md border-b border-stone-800">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Logo / Brand -->
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center font-bold text-white shadow-inner font-brush text-lg">
            品
          </div>
          <div>
            <h1 class="text-sm sm:text-base font-bold tracking-wider leading-none text-stone-100">
              お品書きメーカー
            </h1>
            <span class="text-[10px] text-amber-400/90 font-medium">スマホで作れる縦書き印刷メニュー</span>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-2">
          <!-- Auto-save Indicator -->
          <div
            v-if="showSaveToast"
            class="text-[11px] text-emerald-400 flex items-center gap-1 font-medium transition-all"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">保存済</span>
          </div>

          <!-- Quick Print Button -->
          <button
            @click="triggerPrint"
            type="button"
            class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">印刷 / PDF</span>
            <span class="sm:hidden">印刷</span>
          </button>
        </div>
      </div>

      <!-- Segmented Tab Controls -->
      <div class="max-w-3xl mx-auto px-4 pb-2.5 flex">
        <div class="bg-stone-800 p-1 rounded-xl w-full grid grid-cols-2 gap-1">
          <button
            type="button"
            @click="activeTab = 'editor'"
            :class="[
              'py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer',
              activeTab === 'editor'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            ]"
          >
            <Edit3 class="w-4 h-4" />
            <span>編集入力</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'preview'"
            :class="[
              'py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer',
              activeTab === 'preview'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            ]"
          >
            <Eye class="w-4 h-4" />
            <span>仕上がり確認（プレビュー）</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full mx-auto p-3 sm:p-6 transition-all" :class="activeTab === 'preview' ? 'max-w-6xl' : 'max-w-2xl'">
      <!-- Editor View -->
      <div v-show="activeTab === 'editor'" class="no-print">
        <MenuEditor
          :menu-data="menuData"
          @open-presets="showPresetModal = true"
          @reset-default="handleResetDefault"
        />
      </div>

      <!-- Preview View (Screen) -->
      <div v-show="activeTab === 'preview'" class="no-print">
        <MenuPreview :menu-data="menuData" />
      </div>

      <!-- Always in DOM for Print (@media print) -->
      <div class="hidden print:block">
        <MenuPreview :menu-data="menuData" />
      </div>
    </main>

    <!-- Preset Drawer Modal -->
    <PresetModal
      :show="showPresetModal"
      @close="showPresetModal = false"
      @add-item="handleAddItemFromPreset"
    />
  </div>
</template>
