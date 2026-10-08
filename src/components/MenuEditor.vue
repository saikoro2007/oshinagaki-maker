<script setup>
import { ref } from 'vue'
import PaperFormatSection from './PaperFormatSection.vue'
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings2,
  RotateCcw,
  Sparkles,
  Type,
  Layout,
  Coins,
  Download,
  Upload,
  Sliders,
  Palette,
  FileText,
  ChevronDown,
  ChevronUp
} from '@lucide/vue'

const props = defineProps({
  menuData: {
    type: Object,
    required: true,
  }
})

const emit = defineEmits([
  'update:menuData',
  'open-presets',
  'reset-default'
])

const showDesignSettings = ref(false)
const fileInput = ref(null)

function addNewItem() {
  const newItem = {
    id: Date.now().toString(),
    name: '',
    price: '',
    note: '',
    translation: '',
  }
  props.menuData.items.push(newItem)
}

function removeItem(index) {
  props.menuData.items.splice(index, 1)
}

function moveItem(index, direction) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= props.menuData.items.length) return
  const item = props.menuData.items.splice(index, 1)[0]
  props.menuData.items.splice(targetIndex, 0, item)
}

function exportJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.menuData, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `oshinagaki-${props.menuData.title || 'menu'}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

function triggerImport() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result)
      Object.assign(props.menuData, parsed)
      alert('メニューデータを読み込みました！')
    } catch (err) {
      alert('ファイルの読み込みに失敗しました。正しいJSONファイルを選択してください。')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function selectLayout(mode) {
  props.menuData.layout = mode
  if (mode === 'vertical') {
    props.menuData.priceFormat = 'kanji'
  } else {
    props.menuData.priceFormat = 'number'
  }
}

function adjustFontScale(delta) {
  const current = Number(props.menuData.fontScale) || 100
  const next = Math.min(160, Math.max(75, current + delta))
  props.menuData.fontScale = next
}

function autoOptimizeFontAndLayout() {
  const count = props.menuData.items.length
  if (count <= 7) {
    props.menuData.density = 'spacious'
    props.menuData.fontScale = 125
  } else if (count <= 11) {
    props.menuData.density = 'normal'
    props.menuData.fontScale = 110
  } else {
    props.menuData.density = 'normal'
    props.menuData.fontScale = 105
  }
}
</script>


<template>
  <div class="space-y-5 pb-24">
    <!-- Header Card -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200">
      <div class="flex items-start sm:items-center justify-between gap-2 mb-2">
        <div class="min-w-0 flex-1">
          <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 mb-1">
            本日のおすすめ（日替わり・限定品）
          </span>
          <h2 class="text-base sm:text-lg font-bold text-stone-900">
            本日のおすすめ編集
          </h2>
        </div>

        <button
          type="button"
          @click="$emit('reset-default')"
          class="shrink-0 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
          title="本日のおすすめを初期状態に戻す"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">初期データに戻す</span>
          <span class="sm:hidden">初期化</span>
        </button>
      </div>

      <p class="text-xs text-stone-500 leading-relaxed">
        本日のおすすめ品目や価格、レイアウト・デザインを編集できます。変更は自動保存されます。
      </p>
    </div>

    <!-- Paper Format & Orientation Settings -->
    <PaperFormatSection :menu-data="menuData" />

    <!-- Layout & Spacing Settings (文字サイズ・密度、区切り線、価格表記、文字方向) -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h3 class="font-bold text-sm text-stone-900 flex items-center gap-1.5">
          <Type class="w-4 h-4 text-amber-600" />
          <span>文字サイズ・配置バランス</span>
        </h3>
        <button
          type="button"
          @click="autoOptimizeFontAndLayout"
          class="text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 active:scale-95 px-2.5 py-1 rounded-lg font-bold border border-amber-200 flex items-center gap-1 transition cursor-pointer"
          title="現在の品数に合わせて最適な文字サイズと間隔を自動設定"
        >
          <Sparkles class="w-3.5 h-3.5 text-amber-600" />
          <span>品数に合わせて自動最適化</span>
        </button>
      </div>

      <div class="space-y-3.5 text-xs">
        <!-- Font Size Scale Slider & Quick Buttons -->
        <div class="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 space-y-2.5">
          <div class="flex items-center justify-between gap-1 flex-wrap">
            <label class="font-bold text-stone-800 flex items-center gap-1">
              <span>全体の文字サイズ</span>
              <span class="text-[10px] text-stone-500 font-normal">（拡大率）</span>
            </label>
            <div class="flex items-center gap-1">
              <button
                type="button"
                @click="adjustFontScale(-5)"
                :disabled="(menuData.fontScale || 100) <= 75"
                class="w-6 h-6 rounded bg-white hover:bg-stone-100 active:scale-95 text-stone-700 font-bold border border-stone-300 flex items-center justify-center cursor-pointer disabled:opacity-40"
                title="文字サイズを小さく (-5%)"
              >
                －
              </button>
              <span class="font-black text-amber-950 text-xs min-w-[42px] text-center">
                {{ menuData.fontScale || 100 }}%
              </span>
              <button
                type="button"
                @click="adjustFontScale(5)"
                :disabled="(menuData.fontScale || 100) >= 160"
                class="w-6 h-6 rounded bg-white hover:bg-stone-100 active:scale-95 text-stone-700 font-bold border border-stone-300 flex items-center justify-center cursor-pointer disabled:opacity-40"
                title="文字サイズを大きく (+5%)"
              >
                ＋
              </button>
            </div>
          </div>

          <!-- Slider -->
          <div class="flex items-center gap-3">
            <span class="text-[10px] text-stone-400">75%</span>
            <input
              type="range"
              min="75"
              max="160"
              step="5"
              :value="menuData.fontScale || 100"
              @input="menuData.fontScale = Number($event.target.value)"
              class="w-full accent-amber-600 cursor-pointer"
            />
            <span class="text-[10px] text-stone-400">160%</span>
          </div>

          <!-- Quick Preset Buttons -->
          <div class="grid grid-cols-5 gap-1 pt-0.5">
            <button
              type="button"
              @click="menuData.fontScale = 140"
              :class="[
                'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                menuData.fontScale === 140 ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              ]"
            >
              極大 (140%)
            </button>
            <button
              type="button"
              @click="menuData.fontScale = 125"
              :class="[
                'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                menuData.fontScale === 125 ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              ]"
            >
              特大 (125%)
            </button>
            <button
              type="button"
              @click="menuData.fontScale = 110"
              :class="[
                'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                menuData.fontScale === 110 ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              ]"
            >
              大 (110%)
            </button>
            <button
              type="button"
              @click="menuData.fontScale = 100"
              :class="[
                'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                (!menuData.fontScale || menuData.fontScale === 100) ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              ]"
            >
              標準 (100%)
            </button>
            <button
              type="button"
              @click="menuData.fontScale = 85"
              :class="[
                'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                menuData.fontScale === 85 ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              ]"
            >
              小 (85%)
            </button>
          </div>
        </div>

        <!-- Density / Item Spacing -->
        <div>
          <label class="block text-stone-600 mb-1.5 font-medium">品目間隔（余白密度）</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              @click="menuData.density = 'auto'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                (!menuData.density || menuData.density === 'auto')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              自動調整
            </button>
            <button
              type="button"
              @click="menuData.density = 'spacious'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                menuData.density === 'spacious'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              ゆったり広め
            </button>
            <button
              type="button"
              @click="menuData.density = 'normal'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                menuData.density === 'normal'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              標準
            </button>
            <button
              type="button"
              @click="menuData.density = 'compact'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                menuData.density === 'compact'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              すっきり詰める
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Writing Orientation -->
          <div>
            <label class="block text-stone-600 mb-1.5 font-medium">文字方向</label>
            <div class="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                @click="selectLayout('vertical')"
                :class="[
                  'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                  menuData.layout !== 'horizontal'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                ]"
              >
                縦書き
              </button>
              <button
                type="button"
                @click="selectLayout('horizontal')"
                :class="[
                  'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                  menuData.layout === 'horizontal'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                ]"
              >
                横書き
              </button>
            </div>
          </div>

          <!-- Price Format -->
          <div>
            <label class="block text-stone-600 mb-1.5 font-medium">価格の表記</label>
            <div class="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                @click="menuData.priceFormat = 'kanji'"
                :class="[
                  'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                  (!menuData.priceFormat || menuData.priceFormat === 'kanji')
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                ]"
              >
                漢数字
              </button>
              <button
                type="button"
                @click="menuData.priceFormat = 'number'"
                :class="[
                  'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                  menuData.priceFormat === 'number'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                ]"
              >
                数字表記
              </button>
            </div>
          </div>

          <!-- Item Dividers -->
          <div>
            <label class="block text-stone-600 mb-1.5 font-medium">品目間の区切り線</label>
            <div class="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                @click="menuData.showDividers = false"
                :class="[
                  'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                  !menuData.showDividers
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                ]"
              >
                なし
              </button>
              <button
                type="button"
                @click="menuData.showDividers = true"
                :class="[
                  'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                  menuData.showDividers
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                ]"
              >
                線あり
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Design, Font & Paper Texture Settings -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
      <div class="flex items-center justify-between pb-1 border-b border-stone-100">
        <h3 class="font-bold text-sm text-stone-900">
          デザイン・和紙設定
        </h3>
        <button
          type="button"
          @click="showDesignSettings = !showDesignSettings"
          class="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium transition cursor-pointer"
        >
          <span>{{ showDesignSettings ? '詳細設定を閉じる' : '詳細設定を開く' }}</span>
          <component :is="showDesignSettings ? ChevronUp : ChevronDown" class="w-4 h-4" />
        </button>
      </div>

      <!-- Quick font & frame settings -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <!-- Font Family -->
        <div>
          <label class="block text-stone-600 mb-1.5 font-medium">書体（フォント）</label>
          <div class="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              @click="menuData.fontFamily = 'brush'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center font-brush transition cursor-pointer text-xs',
                (!menuData.fontFamily || menuData.fontFamily === 'brush')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              毛筆風
            </button>
            <button
              type="button"
              @click="menuData.fontFamily = 'mincho'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center font-mincho transition cursor-pointer text-xs',
                menuData.fontFamily === 'mincho'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              伝統明朝
            </button>
            <button
              type="button"
              @click="menuData.fontFamily = 'gothic'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center font-gothic transition cursor-pointer text-xs',
                menuData.fontFamily === 'gothic'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              ゴシック
            </button>
          </div>
        </div>

        <!-- Frame Style -->
        <div>
          <label class="block text-stone-600 mb-1.5 font-medium">外枠デザイン</label>
          <div class="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              @click="menuData.frameStyle = 'traditional'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                (!menuData.frameStyle || menuData.frameStyle === 'traditional')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              二重和枠
            </button>
            <button
              type="button"
              @click="menuData.frameStyle = 'minimal'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                menuData.frameStyle === 'minimal'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              実線枠
            </button>
            <button
              type="button"
              @click="menuData.frameStyle = 'none'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                menuData.frameStyle === 'none'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              枠なし
            </button>
          </div>
        </div>
      </div>

      <!-- Collapsible Detailed Settings -->
      <div v-if="showDesignSettings" class="space-y-4 pt-3 border-t border-stone-100 animate-in fade-in duration-150 text-xs">
        <!-- 1. Background Color -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="font-medium text-stone-600 flex items-center gap-1">
              <Palette class="w-3.5 h-3.5 text-stone-500" /> 用紙の背景色
            </label>
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] text-stone-400">自由選択:</span>
              <input
                type="color"
                v-model="menuData.bgColor"
                class="w-6 h-6 rounded border border-stone-300 cursor-pointer p-0 bg-transparent"
                title="好きな色を選ぶ"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            <button
              type="button"
              @click="menuData.bgColor = '#ffffff'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                (!menuData.bgColor || menuData.bgColor.toLowerCase() === '#ffffff')
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-white border border-stone-400 shrink-0"></span>
              <span>純白</span>
            </button>
            <button
              type="button"
              @click="menuData.bgColor = '#faf7f0'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.bgColor?.toLowerCase() === '#faf7f0'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-[#faf7f0] text-stone-700 border-stone-300 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#faf7f0] border border-stone-400 shrink-0"></span>
              <span>生成り</span>
            </button>
            <button
              type="button"
              @click="menuData.bgColor = '#fdf6f6'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.bgColor?.toLowerCase() === '#fdf6f6'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-[#fdf6f6] text-stone-700 border-stone-300 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#fdf6f6] border border-rose-300 shrink-0"></span>
              <span>桜色</span>
            </button>
            <button
              type="button"
              @click="menuData.bgColor = '#f5f7f2'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.bgColor?.toLowerCase() === '#f5f7f2'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-[#f5f7f2] text-stone-700 border-stone-300 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#f5f7f2] border border-emerald-300 shrink-0"></span>
              <span>うぐいす</span>
            </button>
            <button
              type="button"
              @click="menuData.bgColor = '#f4eee2'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.bgColor?.toLowerCase() === '#f4eee2'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-[#f4eee2] text-stone-700 border-stone-300 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#f4eee2] border border-amber-300 shrink-0"></span>
              <span>麦色</span>
            </button>
            <button
              type="button"
              @click="menuData.bgColor = '#f3f6f9'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.bgColor?.toLowerCase() === '#f3f6f9'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-[#f3f6f9] text-stone-700 border-stone-300 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#f3f6f9] border border-sky-300 shrink-0"></span>
              <span>藍白</span>
            </button>
          </div>
        </div>

        <!-- 2. Washi Pattern -->
        <div>
          <label class="block text-stone-600 mb-1.5 font-medium">和紙の模様（テクスチャ）</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              @click="menuData.bgPattern = 'none'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                (!menuData.bgPattern || menuData.bgPattern === 'none')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              無地
            </button>
            <button
              type="button"
              @click="menuData.bgPattern = 'cloud'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                menuData.bgPattern === 'cloud'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              雲竜
            </button>
            <button
              type="button"
              @click="menuData.bgPattern = 'washi'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                menuData.bgPattern === 'washi'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              和紙
            </button>
            <button
              type="button"
              @click="menuData.bgPattern = 'grid'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
                menuData.bgPattern === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              和風格子
            </button>
          </div>
        </div>

        <!-- 3. Text Color -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="font-medium text-stone-600 flex items-center gap-1">
              <Type class="w-3.5 h-3.5 text-stone-500" /> 文字・フォント色
            </label>
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] text-stone-400">自由選択:</span>
              <input
                type="color"
                v-model="menuData.textColor"
                class="w-6 h-6 rounded border border-stone-300 cursor-pointer p-0 bg-transparent"
                title="好きな文字色を選ぶ"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            <button
              type="button"
              @click="menuData.textColor = '#1c1917'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                (!menuData.textColor || menuData.textColor.toLowerCase() === '#1c1917')
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#1c1917] border border-stone-400 shrink-0"></span>
              <span>墨色 (黒)</span>
            </button>
            <button
              type="button"
              @click="menuData.textColor = '#451a03'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.textColor?.toLowerCase() === '#451a03'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#451a03] border border-amber-900 shrink-0"></span>
              <span>濃茶</span>
            </button>
            <button
              type="button"
              @click="menuData.textColor = '#0f172a'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.textColor?.toLowerCase() === '#0f172a'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#0f172a] border border-slate-700 shrink-0"></span>
              <span>濃紺</span>
            </button>
            <button
              type="button"
              @click="menuData.textColor = '#064e3b'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.textColor?.toLowerCase() === '#064e3b'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#064e3b] border border-emerald-800 shrink-0"></span>
              <span>深緑</span>
            </button>
            <button
              type="button"
              @click="menuData.textColor = '#7f1d1d'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.textColor?.toLowerCase() === '#7f1d1d'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-[#7f1d1d] border border-rose-800 shrink-0"></span>
              <span>赤褐色</span>
            </button>
            <button
              type="button"
              @click="menuData.textColor = '#ffffff'"
              :class="[
                'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 cursor-pointer',
                menuData.textColor?.toLowerCase() === '#ffffff'
                  ? 'border-amber-600 bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              ]"
            >
              <span class="w-3 h-3 rounded-full bg-white border border-stone-400 shrink-0"></span>
              <span>白文字</span>
            </button>
          </div>
        </div>

        <!-- 4. Toggles -->
        <div class="flex flex-wrap items-center gap-4 pt-2 border-t border-stone-100">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="menuData.showDotPrefix"
              class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span class="text-stone-700 font-medium">品名の頭に中黒「・」をつける</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="menuData.showEnglish"
              class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span class="text-stone-700 font-medium">英語（多言語）入力欄を表示</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="menuData.showNotes"
              class="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span class="text-stone-700 font-medium">補足説明を表示</span>
          </label>
        </div>

        <!-- 5. Backup / Restore -->
        <div class="flex items-center justify-between pt-2 border-t border-stone-100">
          <span class="text-stone-500 font-medium">データバックアップ:</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="exportJson"
              class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 flex items-center gap-1 transition cursor-pointer text-xs font-medium"
            >
              <Download class="w-3.5 h-3.5 text-stone-500" />
              <span>保存 (JSON)</span>
            </button>
            <button
              type="button"
              @click="triggerImport"
              class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 flex items-center gap-1 transition cursor-pointer text-xs font-medium"
            >
              <Upload class="w-3.5 h-3.5 text-stone-500" />
              <span>読込</span>
            </button>
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              class="hidden"
              @change="handleFileChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Basic Info Card (Title, Subtitle, Store Name) -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-3">
      <h3 class="font-bold text-sm text-stone-900">
        表題・店名情報
      </h3>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-stone-600 mb-1 font-medium">メニュー表題（メインタイトル）</label>
          <input
            v-model="menuData.title"
            type="text"
            placeholder="本日のおすすめ / お品書き など"
            class="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-stone-600 mb-1 font-medium">肩書き / サブタイトル</label>
            <input
              v-model="menuData.subtitle"
              type="text"
              placeholder="炭火焼き・季節の一品"
              class="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none transition"
            />
          </div>
          <div>
            <label class="block text-stone-600 mb-1 font-medium">店名 / 日付等</label>
            <input
              v-model="menuData.storeName"
              type="text"
              placeholder="店名（例: やきとりもず）"
              class="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 outline-none transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="flex items-center gap-2.5">
      <button
        type="button"
        @click="addNewItem"
        class="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition active:scale-[0.98] cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>1行追加</span>
      </button>

      <button
        type="button"
        @click="emit('open-presets')"
        class="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl border border-amber-200 shadow-xs flex items-center justify-center gap-1.5 text-sm transition active:scale-[0.98] cursor-pointer"
      >
        <span>🏮</span>
        <span>定番から選ぶ</span>
      </button>
    </div>

    <!-- Items List -->
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
          <span>品目一覧</span>
          <span class="text-xs text-stone-500 font-normal">({{ menuData.items?.length || 0 }}品)</span>
        </h3>
        <button
          v-if="menuData.items?.length > 0"
          type="button"
          @click="emit('reset-default')"
          class="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 transition cursor-pointer"
        >
          <RotateCcw class="w-3 h-3" />
          <span>初期化</span>
        </button>
      </div>

      <div
        v-if="!menuData.items || menuData.items.length === 0"
        class="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-stone-200"
      >
        <p class="text-stone-400 text-sm mb-3">メニュー品目がまだありません</p>
        <div class="flex justify-center gap-2">
          <button
            type="button"
            @click="addNewItem"
            class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            手動で追加
          </button>
          <button
            type="button"
            @click="emit('open-presets')"
            class="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold cursor-pointer"
          >
            定番から選ぶ
          </button>
        </div>
      </div>

      <div
        v-for="(item, index) in menuData.items"
        :key="item.id || index"
        class="bg-white rounded-2xl p-3.5 shadow-sm border border-stone-200 hover:border-stone-300 transition"
      >
        <div class="flex items-start gap-2.5">
          <!-- Reorder buttons -->
          <div class="flex flex-col gap-0.5 pt-0.5 text-stone-400 shrink-0">
            <button
              type="button"
              :disabled="index === 0"
              @click="moveItem(index, -1)"
              class="p-1 hover:text-stone-800 disabled:opacity-20 disabled:hover:text-stone-400 hover:bg-stone-100 rounded transition cursor-pointer"
              title="上へ"
            >
              <ArrowUp class="w-4 h-4" />
            </button>
            <button
              type="button"
              :disabled="index === menuData.items.length - 1"
              @click="moveItem(index, 1)"
              class="p-1 hover:text-stone-800 disabled:opacity-20 disabled:hover:text-stone-400 hover:bg-stone-100 rounded transition cursor-pointer"
              title="下へ"
            >
              <ArrowDown class="w-4 h-4" />
            </button>
          </div>

          <!-- Main Input Fields -->
          <div class="flex-1 space-y-2 min-w-0">
            <div class="flex gap-2">
              <input
                v-model="item.name"
                type="text"
                placeholder="品名（例: 本日のお刺身三種盛り）"
                class="flex-1 min-w-0 px-3 py-2 text-stone-900 font-bold text-sm bg-white rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none transition"
              />
              <div class="w-24 shrink-0 relative">
                <input
                  v-model="item.price"
                  type="text"
                  placeholder="価格"
                  class="w-full pl-3 pr-6 py-2 text-stone-900 font-bold text-sm bg-white rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-right transition"
                />
                <span class="absolute right-2 top-2 text-stone-400 text-xs pointer-events-none">円</span>
              </div>
            </div>

            <div class="flex gap-2">
              <input
                v-model="item.note"
                type="text"
                placeholder="補足（例: 数量限定 / 旬の味覚）"
                class="flex-1 min-w-0 px-2.5 py-1.5 text-stone-600 text-xs bg-white rounded-lg border border-stone-200 focus:ring-1 focus:ring-amber-500 outline-none"
              />
              <input
                v-if="menuData.showEnglish"
                v-model="item.translation"
                type="text"
                placeholder="English / Translation"
                class="flex-1 min-w-0 px-2.5 py-1.5 text-stone-500 text-xs bg-white rounded-lg border border-stone-200 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <!-- Delete button -->
          <button
            type="button"
            @click="removeItem(index)"
            class="p-2 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer shrink-0"
            title="削除"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Note (注記・お知らせ) -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-200">
      <label class="block text-xs font-medium text-stone-500 mb-1.5">注記テキスト</label>
      <input
        v-model="menuData.footerNote"
        type="text"
        placeholder="※価格はすべて税込表示となっております。仕入れ状況により売り切れの際はご容赦ください。"
        class="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none transition"
      />
    </div>
  </div>
</template>
