<script setup>
import { ref, onMounted } from 'vue'
import MenuEditor from './components/MenuEditor.vue'
import MenuPreview from './components/MenuPreview.vue'
import GrandMenuEditor from './components/GrandMenuEditor.vue'
import GrandMenuPreview from './components/GrandMenuPreview.vue'
import PresetModal from './components/PresetModal.vue'
import MyMenusModal from './components/MyMenusModal.vue'
import ShareModal from './components/ShareModal.vue'
import { useMenuStorage } from './composables/useMenuStorage'
import { useShareSync } from './composables/useShareSync'
import {
  Edit3,
  Eye,
  Printer,
  Share2,
  CheckCircle2,
  Layers,
  UtensilsCrossed,
  Wine,
  Bookmark
} from '@lucide/vue'

// 1. Menu Data Management & Persistence
const {
  menuType,
  showSaveToast,
  dailyMenuData,
  grandMenuData,
  drinkMenuData,
  currentActiveData,
  resetDefaultDaily,
  resetDefaultGrand,
  resetDefaultDrink,
  loadSlot,
  loadPreset,
  addItemFromPreset,
  applySharedData,
} = useMenuStorage()

// 2. Share Hash & Synchronization
const {
  showIncomingSharePrompt,
  incomingShareData,
  acceptSharedMenu,
  dismissSharedMenu,
} = useShareSync(applySharedData)

// 3. UI State (Tabs & Modals)
const activeTab = ref('preview')
const showPresetModal = ref(false)
const showMyMenusModal = ref(false)
const showShareModal = ref(false)

onMounted(() => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const paramTab = urlParams.get('tab')
    if (paramTab === 'editor' || paramTab === 'preview') {
      activeTab.value = paramTab
    }
    const paramModal = urlParams.get('modal')
    if (paramModal === 'mymenu') {
      showMyMenusModal.value = true
    } else if (paramModal === 'share') {
      showShareModal.value = true
    }
  } catch (e) {
    console.error('Failed to parse URL query params:', e)
  }
})

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
            title="作成したメニューをスマホに保存・いつでも呼び出せます"
          >
            <Bookmark class="w-3.5 h-3.5 text-amber-400" />
            <span class="hidden sm:inline">メニュー保存・呼出</span>
            <span class="sm:hidden">保存・呼出</span>
          </button>

          <!-- Share Button (URL共有・LINEで送る) -->
          <button
            type="button"
            @click="showShareModal = true"
            class="px-2.5 sm:px-3 py-1.5 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 hover:text-white font-bold text-xs rounded-lg border border-stone-700 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            title="メニューの共有URLリンクを発行・LINEで送信"
          >
            <Share2 class="w-3.5 h-3.5 text-sky-400" />
            <span class="hidden sm:inline">共有</span>
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
      
      <!-- 1. GRAND MENU MODE (定番料理メニュー) -->
      <template v-if="menuType === 'grand'">
        <div class="no-print lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 items-start">
          <div
            :class="[
              'lg:col-span-5 xl:col-span-5',
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            ]"
          >
            <GrandMenuEditor
              :menu-data="grandMenuData"
              @reset-mozu-default="resetDefaultGrand"
            />
          </div>

          <div
            :class="[
              'lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20',
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            ]"
          >
            <GrandMenuPreview :menu-data="grandMenuData" />
          </div>
        </div>

        <div class="hidden print:block print:w-full print:h-full">
          <GrandMenuPreview :menu-data="grandMenuData" />
        </div>
      </template>

      <!-- 2. DRINK MENU MODE (お飲み物メニュー) -->
      <template v-else-if="menuType === 'drink'">
        <div class="no-print lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 items-start">
          <div
            :class="[
              'lg:col-span-5 xl:col-span-5',
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            ]"
          >
            <GrandMenuEditor
              :menu-data="drinkMenuData"
              @reset-mozu-default="resetDefaultDrink"
            />
          </div>

          <div
            :class="[
              'lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20',
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            ]"
          >
            <GrandMenuPreview :menu-data="drinkMenuData" />
          </div>
        </div>

        <div class="hidden print:block print:w-full print:h-full">
          <GrandMenuPreview :menu-data="drinkMenuData" />
        </div>
      </template>

      <!-- 3. DAILY MENU MODE (本日のおすすめ) -->
      <template v-else>
        <div class="no-print lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8 items-start">
          <div
            :class="[
              'lg:col-span-5 xl:col-span-5',
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            ]"
          >
            <MenuEditor
              :menu-data="dailyMenuData"
              @open-presets="showPresetModal = true"
              @reset-default="resetDefaultDaily"
            />
          </div>

          <div
            :class="[
              'lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20',
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            ]"
          >
            <MenuPreview :menu-data="dailyMenuData" />
          </div>
        </div>

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
      @add-item="addItemFromPreset"
    />

    <!-- My Menus (手元に記憶) Modal -->
    <MyMenusModal
      v-if="showMyMenusModal"
      :show="showMyMenusModal"
      :current-menu-type="menuType"
      :current-data="currentActiveData"
      @close="showMyMenusModal = false"
      @load-slot="loadSlot"
      @load-preset="loadPreset"
    />

    <!-- Share Modal (URL共有・LINEで送る) -->
    <ShareModal
      v-if="showShareModal"
      :show="showShareModal"
      :menu-type="menuType"
      :current-data="currentActiveData"
      @close="showShareModal = false"
    />

    <!-- Incoming Shared Menu Prompt Modal (共有メニュー受信ダイアログ) -->
    <div
      v-if="showIncomingSharePrompt && incomingShareData"
      class="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      @click.self="dismissSharedMenu"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-4 animate-in zoom-in-95">
        <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <Share2 class="w-6 h-6" />
        </div>
        <div>
          <span
            class="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold mb-1.5"
            :class="incomingShareData.type === 'daily' ? 'bg-amber-100 text-amber-900' : incomingShareData.type === 'drink' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'"
          >
            {{ incomingShareData.type === 'daily' ? '本日のおすすめ' : incomingShareData.type === 'drink' ? 'お飲み物メニュー' : '定番料理メニュー' }}
          </span>
          <h3 class="font-bold text-stone-900 text-base">共有メニューが届きました！</h3>
          <p class="text-xs text-stone-600 mt-1 leading-relaxed">
            届いたお品書きデータを画面に読み込みますか？<br />
            <span class="text-[11px] text-stone-400">（現在の未保存の編集内容は上書きされます）</span>
          </p>
        </div>
        <div class="flex gap-2 pt-1">
          <button
            type="button"
            @click="dismissSharedMenu"
            class="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            @click="acceptSharedMenu"
            class="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            読み込む
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
