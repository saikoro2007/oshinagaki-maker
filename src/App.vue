<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import {
  INITIAL_MENU_STATE,
  MOZU_GRAND_MENU_STATE,
  MOZU_DRINK_MENU_STATE
} from './constants/presets'
import MenuEditor from './components/MenuEditor.vue'
import MenuPreview from './components/MenuPreview.vue'
import GrandMenuEditor from './components/GrandMenuEditor.vue'
import GrandMenuPreview from './components/GrandMenuPreview.vue'
import PresetModal from './components/PresetModal.vue'
import MyMenusModal from './components/MyMenusModal.vue'
import {
  Edit3,
  Eye,
  Printer,
  Sparkles,
  Share2,
  CheckCircle2,
  Layers,
  UtensilsCrossed,
  Wine,
  Bookmark
} from '@lucide/vue'

const STORAGE_KEY_DAILY = 'oshinagaki_maker_menu_data'
const STORAGE_KEY_GRAND = 'oshinagaki_maker_grand_menu_data'
const STORAGE_KEY_DRINK = 'oshinagaki_maker_drink_menu_data'
const STORAGE_KEY_ACTIVE_TYPE = 'oshinagaki_maker_active_type'

// Menu Mode: 'grand' (定番料理) | 'drink' (お飲み物) | 'daily' (本日のおすすめ)
const menuType = ref('grand')

// Tab state: 'editor' | 'preview'
const activeTab = ref('preview')
const showPresetModal = ref(false)
const showMyMenusModal = ref(false)
const showSaveToast = ref(false)

// Menu reactive data for Daily (本日のおすすめ)
const dailyMenuData = reactive(JSON.parse(JSON.stringify(INITIAL_MENU_STATE)))

// Menu reactive data for Grand Menu (定番料理メニュー)
const grandMenuData = reactive(JSON.parse(JSON.stringify(MOZU_GRAND_MENU_STATE)))

// Menu reactive data for Drink Menu (お飲み物メニュー)
const drinkMenuData = reactive(JSON.parse(JSON.stringify(MOZU_DRINK_MENU_STATE)))

// Current active menu data for modal storage
const currentActiveData = computed(() => {
  if (menuType.value === 'daily') return dailyMenuData
  if (menuType.value === 'drink') return drinkMenuData
  return grandMenuData
})

// Load from LocalStorage and URL params
onMounted(() => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const paramTab = urlParams.get('tab')
    if (paramTab === 'editor' || paramTab === 'preview') {
      activeTab.value = paramTab
    }

    const paramType = urlParams.get('type')
    if (paramType === 'daily' || paramType === 'grand' || paramType === 'drink') {
      menuType.value = paramType
    } else {
      const savedType = localStorage.getItem(STORAGE_KEY_ACTIVE_TYPE)
      if (savedType === 'daily' || savedType === 'grand' || savedType === 'drink') {
        menuType.value = savedType
      }
    }

    // 1. Daily Menu Load & Migration
    const savedDaily = localStorage.getItem(STORAGE_KEY_DAILY)
    if (savedDaily) {
      const parsedDaily = JSON.parse(savedDaily)
      if (parsedDaily.version === INITIAL_MENU_STATE.version) {
        Object.assign(dailyMenuData, parsedDaily)
      } else {
        const updatedDaily = JSON.parse(JSON.stringify(INITIAL_MENU_STATE))
        for (const k of Object.keys(dailyMenuData)) {
          delete dailyMenuData[k]
        }
        Object.assign(dailyMenuData, updatedDaily)
        localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(updatedDaily))
      }
    }

    // 2. Grand Menu Load & Migration
    const savedGrand = localStorage.getItem(STORAGE_KEY_GRAND)
    if (savedGrand) {
      const parsed = JSON.parse(savedGrand)
      if (parsed.version === MOZU_GRAND_MENU_STATE.version) {
        Object.assign(grandMenuData, parsed)
      } else {
        const keepLogo = parsed.logoImage || parsed.noticeBlock?.logoImage || ''
        const updated = JSON.parse(JSON.stringify(MOZU_GRAND_MENU_STATE))
        if (keepLogo) {
          updated.logoImage = keepLogo
          if (updated.noticeBlock) updated.noticeBlock.logoImage = keepLogo
        }
        for (const k of Object.keys(grandMenuData)) {
          delete grandMenuData[k]
        }
        Object.assign(grandMenuData, updated)
        localStorage.setItem(STORAGE_KEY_GRAND, JSON.stringify(updated))
      }
    }

    // 3. Drink Menu Load & Migration
    const savedDrink = localStorage.getItem(STORAGE_KEY_DRINK)
    if (savedDrink) {
      const parsedDrink = JSON.parse(savedDrink)
      if (parsedDrink.version === MOZU_DRINK_MENU_STATE.version) {
        Object.assign(drinkMenuData, parsedDrink)
      } else {
        const updatedDrink = JSON.parse(JSON.stringify(MOZU_DRINK_MENU_STATE))
        for (const k of Object.keys(drinkMenuData)) {
          delete drinkMenuData[k]
        }
        Object.assign(drinkMenuData, updatedDrink)
        localStorage.setItem(STORAGE_KEY_DRINK, JSON.stringify(updatedDrink))
      }
    }
  } catch (e) {
    console.error('Failed to load menu data:', e)
  }
})

// Auto-save
let toastTimer = null
function triggerSaveToast() {
  showSaveToast.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showSaveToast.value = false
  }, 1500)
}

watch(menuType, (newType) => {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TYPE, newType)
  } catch (e) {
    console.error(e)
  }
})

watch(
  dailyMenuData,
  (newVal) => {
    try {
      localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(newVal))
      triggerSaveToast()
    } catch (e) {
      console.error(e)
    }
  },
  { deep: true }
)

watch(
  grandMenuData,
  (newVal) => {
    try {
      localStorage.setItem(STORAGE_KEY_GRAND, JSON.stringify(newVal))
      triggerSaveToast()
    } catch (e) {
      console.error(e)
    }
  },
  { deep: true }
)

watch(
  drinkMenuData,
  (newVal) => {
    try {
      localStorage.setItem(STORAGE_KEY_DRINK, JSON.stringify(newVal))
      triggerSaveToast()
    } catch (e) {
      console.error(e)
    }
  },
  { deep: true }
)

function handleAddItemFromPreset(item) {
  dailyMenuData.items.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
    name: item.name,
    price: item.price,
    note: item.note || '',
    translation: item.translation || '',
  })
}

function handleResetDefaultDaily() {
  if (confirm('本日のおすすめを初期設定に戻しますか？')) {
    for (const k of Object.keys(dailyMenuData)) delete dailyMenuData[k]
    Object.assign(dailyMenuData, JSON.parse(JSON.stringify(INITIAL_MENU_STATE)))
  }
}

function handleResetDefaultGrand() {
  if (confirm('グランドメニューを初期設定（やきとりもず定番料理データ）に戻しますか？')) {
    for (const k of Object.keys(grandMenuData)) delete grandMenuData[k]
    Object.assign(grandMenuData, JSON.parse(JSON.stringify(MOZU_GRAND_MENU_STATE)))
  }
}

function handleResetDefaultDrink() {
  if (confirm('ドリンクメニューを初期設定（やきとりもず公式お飲み物データ）に戻しますか？')) {
    for (const k of Object.keys(drinkMenuData)) delete drinkMenuData[k]
    Object.assign(drinkMenuData, JSON.parse(JSON.stringify(MOZU_DRINK_MENU_STATE)))
  }
}

// マイメニュー（手元スロット）からの読み込み
function handleLoadSlot(slot) {
  if (slot.type === 'daily') {
    menuType.value = 'daily'
    for (const k of Object.keys(dailyMenuData)) delete dailyMenuData[k]
    Object.assign(dailyMenuData, slot.data)
  } else if (slot.type === 'drink') {
    menuType.value = 'drink'
    for (const k of Object.keys(drinkMenuData)) delete drinkMenuData[k]
    Object.assign(drinkMenuData, slot.data)
  } else {
    menuType.value = 'grand'
    for (const k of Object.keys(grandMenuData)) delete grandMenuData[k]
    Object.assign(grandMenuData, slot.data)
  }
}

// 公式プリセットの復元
function handleLoadPreset(type) {
  if (type === 'daily') {
    menuType.value = 'daily'
    for (const k of Object.keys(dailyMenuData)) delete dailyMenuData[k]
    Object.assign(dailyMenuData, JSON.parse(JSON.stringify(INITIAL_MENU_STATE)))
  } else if (type === 'drink') {
    menuType.value = 'drink'
    for (const k of Object.keys(drinkMenuData)) delete drinkMenuData[k]
    Object.assign(drinkMenuData, JSON.parse(JSON.stringify(MOZU_DRINK_MENU_STATE)))
  } else {
    menuType.value = 'grand'
    for (const k of Object.keys(grandMenuData)) delete grandMenuData[k]
    Object.assign(grandMenuData, JSON.parse(JSON.stringify(MOZU_GRAND_MENU_STATE)))
  }
  showMyMenusModal.value = false
}

function triggerPrint() {
  window.print()
}
</script>

<template>
  <div class="min-h-screen bg-stone-100 flex flex-col print:min-h-0 print:h-full print:bg-white print:block">
    <!-- Top Navigation Header (Hidden on Print) -->
    <header class="no-print sticky top-0 z-40 bg-stone-900 text-white shadow-md border-b border-stone-800">
      <div class="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <!-- Logo / Brand -->
        <div class="flex items-center gap-2.5">
          <div class="relative shrink-0 flex items-center justify-center">
            <svg class="w-7 h-7 drop-shadow-sm select-none" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#dc2626" />
                  <stop offset="100%" stop-color="#991b1b" />
                </linearGradient>
              </defs>
              <rect x="3" y="3" width="58" height="58" rx="10" fill="url(#sealGrad)" stroke="#7f1d1d" stroke-width="2"/>
              <rect x="6.5" y="6.5" width="51" height="51" rx="8" fill="none" stroke="#fca5a5" stroke-width="1.2" stroke-dasharray="3 2" stroke-opacity="0.6"/>
              <rect x="23" y="14" width="18" height="13" rx="2.5" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linejoin="round"/>
              <rect x="13" y="34" width="17" height="13" rx="2.5" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linejoin="round"/>
              <rect x="34" y="34" width="17" height="13" rx="2.5" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 class="font-mincho font-bold text-base sm:text-lg tracking-wider text-stone-100 leading-none">
              おしながきメーカー
            </h1>
            <span class="text-[10px] text-stone-400 tracking-wider block mt-0.5">スマホで作る縦書き印刷メニュー</span>
          </div>
        </div>

        <!-- Center Menu Type Switcher (Desktop) -->
        <div class="hidden md:flex bg-stone-800 p-1 rounded-xl border border-stone-700">
          <button
            type="button"
            @click="menuType = 'grand'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer',
              menuType === 'grand'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            ]"
          >
            <Layers class="w-3.5 h-3.5" />
            <span>定番料理</span>
          </button>
          <button
            type="button"
            @click="menuType = 'drink'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer',
              menuType === 'drink'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            ]"
          >
            <Wine class="w-3.5 h-3.5" />
            <span>お飲み物</span>
          </button>
          <button
            type="button"
            @click="menuType = 'daily'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer',
              menuType === 'daily'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            ]"
          >
            <UtensilsCrossed class="w-3.5 h-3.5" />
            <span>本日のおすすめ</span>
          </button>
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

          <!-- My Menus (手元に記憶・保存スロット管理) -->
          <button
            type="button"
            @click="showMyMenusModal = true"
            class="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 hover:text-white font-bold text-xs rounded-lg border border-stone-700 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            title="作成したお品書きを手元に記憶・読み込み"
          >
            <Bookmark class="w-3.5 h-3.5 text-amber-400" />
            <span class="hidden sm:inline">マイメニュー</span>
            <span class="sm:hidden">手元保存</span>
          </button>

          <!-- Quick Print Button -->
          <button
            @click="triggerPrint"
            type="button"
            class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>印刷 / PDF</span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Type Switcher (3-tabs) -->
      <div class="max-w-5xl mx-auto px-4 pb-2 md:hidden">
        <div class="bg-stone-800 p-1 rounded-xl w-full grid grid-cols-3 gap-1 border border-stone-700/80">
          <button
            type="button"
            @click="menuType = 'grand'"
            :class="[
              'py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer',
              menuType === 'grand'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            ]"
          >
            <Layers class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">定番料理</span>
          </button>
          <button
            type="button"
            @click="menuType = 'drink'"
            :class="[
              'py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer',
              menuType === 'drink'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            ]"
          >
            <Wine class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">お飲み物</span>
          </button>
          <button
            type="button"
            @click="menuType = 'daily'"
            :class="[
              'py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer',
              menuType === 'daily'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            ]"
          >
            <UtensilsCrossed class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">おすすめ</span>
          </button>
        </div>
      </div>

      <!-- Segmented Tab Controls (Mobile only: Editor vs Preview) -->
      <div class="max-w-5xl mx-auto px-4 pb-2.5 flex lg:hidden">
        <div class="bg-stone-800/80 p-1 rounded-xl w-full grid grid-cols-2 gap-1">
          <button
            type="button"
            @click="activeTab = 'editor'"
            :class="[
              'py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer',
              activeTab === 'editor'
                ? 'bg-stone-700 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            ]"
          >
            <Edit3 class="w-3.5 h-3.5" />
            <span>編集入力</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'preview'"
            :class="[
              'py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer',
              activeTab === 'preview'
                ? 'bg-stone-700 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            ]"
          >
            <Eye class="w-3.5 h-3.5" />
            <span>プレビュー確認</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full mx-auto p-3 sm:p-6 transition-all print:p-0 print:m-0 print:w-full print:max-w-none print:h-full max-w-[1680px]">
      
      <!-- ==========================================
           1. GRAND MENU MODE (定番料理メニュー)
           ========================================== -->
      <template v-if="menuType === 'grand'">
        <!-- Screen Layout: Split view on lg+, tab view on mobile -->
        <div class="no-print lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 items-start">
          <!-- Left: Grand Menu Editor -->
          <div
            :class="[
              'lg:col-span-5 xl:col-span-5',
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            ]"
          >
            <GrandMenuEditor
              :menu-data="grandMenuData"
              @reset-mozu-default="handleResetDefaultGrand"
            />
          </div>

          <!-- Right: Grand Menu Preview (Sticky on PC) -->
          <div
            :class="[
              'lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20',
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            ]"
          >
            <GrandMenuPreview :menu-data="grandMenuData" />
          </div>
        </div>

        <!-- Print View for Grand Menu -->
        <div class="hidden print:block print:w-full print:h-full">
          <GrandMenuPreview :menu-data="grandMenuData" />
        </div>
      </template>

      <!-- ==========================================
           2. DRINK MENU MODE (お飲み物メニュー)
           ========================================== -->
      <template v-else-if="menuType === 'drink'">
        <!-- Screen Layout: Split view on lg+, tab view on mobile -->
        <div class="no-print lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 items-start">
          <!-- Left: Drink Menu Editor -->
          <div
            :class="[
              'lg:col-span-5 xl:col-span-5',
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            ]"
          >
            <GrandMenuEditor
              :menu-data="drinkMenuData"
              @reset-mozu-default="handleResetDefaultDrink"
            />
          </div>

          <!-- Right: Drink Menu Preview (Sticky on PC) -->
          <div
            :class="[
              'lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20',
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            ]"
          >
            <GrandMenuPreview :menu-data="drinkMenuData" />
          </div>
        </div>

        <!-- Print View for Drink Menu -->
        <div class="hidden print:block print:w-full print:h-full">
          <GrandMenuPreview :menu-data="drinkMenuData" />
        </div>
      </template>

      <!-- ==========================================
           3. DAILY MENU MODE (本日のおすすめ)
           ========================================== -->
      <template v-else>
        <!-- Screen Layout: Split view on lg+, tab view on mobile -->
        <div class="no-print lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 items-start">
          <!-- Left: Daily Menu Editor -->
          <div
            :class="[
              'lg:col-span-5 xl:col-span-5',
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            ]"
          >
            <MenuEditor
              :menu-data="dailyMenuData"
              @open-presets="showPresetModal = true"
              @reset-default="handleResetDefaultDaily"
            />
          </div>

          <!-- Right: Daily Menu Preview -->
          <div
            :class="[
              'lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20',
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            ]"
          >
            <MenuPreview :menu-data="dailyMenuData" />
          </div>
        </div>

        <!-- Print View for Daily Menu -->
        <div class="hidden print:block print:w-full print:h-full">
          <MenuPreview :menu-data="dailyMenuData" />
        </div>
      </template>

    </main>

    <!-- Common Screen Footer (Hidden on Print) -->
    <footer class="no-print mt-auto py-5 border-t border-stone-200 bg-stone-100 text-stone-400 text-xs">
      <div class="max-w-4xl mx-auto px-4 flex items-center justify-center gap-3 text-center">
        <span>© 2026 <a href="https://github.com/saikoro2007" target="_blank" rel="noopener noreferrer" class="hover:text-stone-700 font-medium transition">saikoro2007</a></span>
        <span>·</span>
        <a
          href="https://github.com/saikoro2007/oshinagaki-maker"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-stone-700 transition underline underline-offset-2"
        >
          GitHub
        </a>
      </div>
    </footer>

    <!-- Preset Drawer Modal for Daily Menu -->
    <PresetModal
      :show="showPresetModal"
      @close="showPresetModal = false"
      @add-item="handleAddItemFromPreset"
    />

    <!-- My Menus (手元に記憶) Modal -->
    <MyMenusModal
      v-if="showMyMenusModal"
      :show="showMyMenusModal"
      :current-menu-type="menuType"
      :current-data="currentActiveData"
      @close="showMyMenusModal = false"
      @load-slot="handleLoadSlot"
      @load-preset="handleLoadPreset"
    />
  </div>
</template>
