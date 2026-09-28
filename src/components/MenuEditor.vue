<script setup>
import { ref } from 'vue'
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings2,
  BookOpen,
  RotateCcw,
  Sparkles,
  Type,
  Layout,
  Globe,
  Coins,
  Download,
  Upload,
  Stamp,
  Sliders,
  AlignRight,
  Palette
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

const showSettings = ref(typeof window !== 'undefined' && window.innerWidth >= 1024)
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


</script>

<template>
  <div class="space-y-4 max-w-2xl mx-auto pb-24">
    <!-- Header Title & Basic Info Card -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200">
      <div class="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
        <h2 class="font-bold text-stone-800 text-base flex items-center gap-2">
          <span>📋</span> 基本設定
        </h2>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="showSettings = !showSettings"
            :class="[
              'text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition font-medium',
              showSettings
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            ]"
          >
            <Settings2 class="w-3.5 h-3.5" />
            <span>{{ showSettings ? '設定を閉じる' : '書体・レイアウト設定' }}</span>
          </button>
        </div>
      </div>

      <!-- Advanced Style Settings Drawer -->
      <div v-if="showSettings" class="p-3.5 mb-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-3 animate-in fade-in duration-150">
        <!-- Writing Orientation -->
        <div>
          <label class="font-semibold text-stone-700 block mb-1.5 flex items-center gap-1">
            <Layout class="w-3.5 h-3.5 text-stone-500" /> 文字方向
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="selectLayout('vertical')"
              :class="[
                'py-2 px-3 rounded-lg border text-center font-bold transition',
                menuData.layout === 'vertical'
                  ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200'
              ]"
            >
              縦書き（和風短冊・おすすめ）
            </button>
            <button
              type="button"
              @click="selectLayout('horizontal')"
              :class="[
                'py-2 px-3 rounded-lg border text-center font-bold transition',
                menuData.layout === 'horizontal'
                  ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200'
              ]"
            >
              横書き
            </button>
          </div>
        </div>

        <!-- Font Choice -->
        <div>
          <label class="font-semibold text-stone-700 block mb-1.5 flex items-center gap-1">
            <Type class="w-3.5 h-3.5 text-stone-500" /> 書体（フォント）
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="menuData.fontFamily = 'brush'"
              :class="[
                'py-2 px-2 rounded-lg border text-center font-brush transition',
                menuData.fontFamily === 'brush'
                  ? 'bg-amber-900 text-white border-amber-900 font-bold'
                  : 'bg-white text-stone-700 border-stone-200'
              ]"
            >
              毛筆風（筆文字）
            </button>
            <button
              type="button"
              @click="menuData.fontFamily = 'mincho'"
              :class="[
                'py-2 px-2 rounded-lg border text-center font-mincho transition',
                menuData.fontFamily === 'mincho'
                  ? 'bg-amber-900 text-white border-amber-900 font-bold'
                  : 'bg-white text-stone-700 border-stone-200'
              ]"
            >
              伝統明朝
            </button>
            <button
              type="button"
              @click="menuData.fontFamily = 'gothic'"
              :class="[
                'py-2 px-2 rounded-lg border text-center font-gothic transition',
                menuData.fontFamily === 'gothic'
                  ? 'bg-amber-900 text-white border-amber-900 font-bold'
                  : 'bg-white text-stone-700 border-stone-200'
              ]"
            >
              モダンゴシック
            </button>
          </div>
        </div>

        <!-- Density & Size Options (Requirement 2) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label class="font-semibold text-stone-700 block mb-1 flex items-center gap-1">
              <Sliders class="w-3.5 h-3.5 text-stone-500" /> 文字サイズ・品目密度
            </label>
            <select
              v-model="menuData.density"
              class="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 text-stone-800"
            >
              <option value="auto">自動調整（品数に合わせて最適化）</option>
              <option value="spacious">ゆったり大文字（少品目向け）</option>
              <option value="normal">標準（中文字）</option>
              <option value="compact">すっきり小文字（多品目収容）</option>
            </select>
          </div>

          <div>
            <label class="font-semibold text-stone-700 block mb-1">品目間の区切り線</label>
            <select
              v-model="menuData.showDividers"
              class="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 text-stone-800"
            >
              <option :value="false">線なし（すっきり和風・推奨）</option>
              <option :value="true">細い区切り線あり</option>
            </select>
          </div>
        </div>

        <!-- Price Display format -->
        <div>
          <label class="font-semibold text-stone-700 block mb-1.5 flex items-center gap-1">
            <Coins class="w-3.5 h-3.5 text-stone-500" /> 価格の表記
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="menuData.priceFormat = 'kanji'"
              :class="[
                'py-1.5 px-3 rounded-lg border text-center transition font-medium',
                menuData.priceFormat === 'kanji'
                  ? 'bg-amber-900 text-white border-amber-900'
                  : 'bg-white text-stone-700 border-stone-200'
              ]"
            >
              漢数字（例: 一八〇円・和風推奨）
            </button>
            <button
              type="button"
              @click="menuData.priceFormat = 'number'"
              :class="[
                'py-1.5 px-3 rounded-lg border text-center transition font-medium',
                menuData.priceFormat === 'number'
                  ? 'bg-amber-900 text-white border-amber-900'
                  : 'bg-white text-stone-700 border-stone-200'
              ]"
            >
              数字表記（例: 180円）
            </button>
          </div>
        </div>

        <!-- Paper orientation & size & border options -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div>
            <label class="font-semibold text-stone-700 block mb-1">用紙の向き</label>
            <select
              v-model="menuData.paperOrientation"
              class="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 text-stone-800 font-bold"
            >
              <option value="landscape">横向き（推奨・定番）</option>
              <option value="portrait">縦向き</option>
            </select>
          </div>
          <div>
            <label class="font-semibold text-stone-700 block mb-1">用紙サイズ</label>
            <select
              v-model="menuData.paperSize"
              class="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 text-stone-800"
            >
              <option value="A4">A4 用紙</option>
              <option value="B5">B5 用紙</option>
            </select>
          </div>
          <div>
            <label class="font-semibold text-stone-700 block mb-1">外枠デザイン</label>
            <select
              v-model="menuData.frameStyle"
              class="w-full bg-white border border-stone-300 rounded-lg py-1.5 px-2 text-stone-800"
            >
              <option value="traditional">二重和枠（おすすめ）</option>
              <option value="minimal">シンプル実線</option>
              <option value="none">外枠なし</option>
            </select>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="font-semibold text-stone-700 text-xs sm:text-sm">落款印（赤スタンプ）</label>
              <button
                v-if="menuData.stampText"
                type="button"
                @click="menuData.stampText = ''"
                class="text-[11px] text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                枠ごと消去
              </button>
            </div>
            <input
              v-model="menuData.stampText"
              type="text"
              placeholder="空欄で非表示（例: 名物）"
              maxlength="4"
              class="w-full bg-white border border-stone-300 rounded-lg py-1 px-2 text-stone-800 text-center text-sm"
            />
            <div class="flex items-center justify-between mt-1 text-[11px]">
              <span class="text-stone-400 text-[10px]">※空欄で枠ごと非表示</span>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="menuData.stampText = '名物'"
                  class="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] cursor-pointer"
                >名物</button>
                <button
                  type="button"
                  @click="menuData.stampText = '厳選'"
                  class="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] cursor-pointer"
                >厳選</button>
                <button
                  type="button"
                  @click="menuData.stampText = '本日'"
                  class="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] cursor-pointer"
                >本日</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Toggles: Multi-language & notes -->
        <div class="flex items-center gap-4 pt-2 border-t border-stone-200">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="menuData.showEnglish"
              class="rounded border-stone-300 text-amber-900 focus:ring-amber-900 w-4 h-4"
            />
            <span class="text-stone-700 font-medium">英語（多言語）入力欄を表示</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="menuData.showNotes"
              class="rounded border-stone-300 text-amber-900 focus:ring-amber-900 w-4 h-4"
            />
            <span class="text-stone-700 font-medium">補足説明を表示</span>
          </label>
        </div>

        <!-- Background Color & Paper Texture Options -->
        <div class="pt-2 border-t border-stone-200 space-y-3">
          <!-- 1. Background Color -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="font-semibold text-stone-700 flex items-center gap-1 text-xs">
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

            <!-- Quick Color Palette -->
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              <button
                type="button"
                @click="menuData.bgColor = '#ffffff'"
                :class="[
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  (!menuData.bgColor || menuData.bgColor.toLowerCase() === '#ffffff')
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.bgColor?.toLowerCase() === '#faf7f0'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.bgColor?.toLowerCase() === '#fdf6f6'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.bgColor?.toLowerCase() === '#f5f7f2'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.bgColor?.toLowerCase() === '#f4eee2'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.bgColor?.toLowerCase() === '#f3f6f9'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
                    : 'bg-[#f3f6f9] text-stone-700 border-stone-300 hover:border-stone-400'
                ]"
              >
                <span class="w-3 h-3 rounded-full bg-[#f3f6f9] border border-sky-300 shrink-0"></span>
                <span>藍白</span>
              </button>
            </div>
          </div>

          <!-- 2. Paper Pattern / Texture -->
          <div>
            <label class="font-semibold text-stone-700 block mb-1.5 text-xs">
              和紙の模様（テクスチャ）
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                @click="menuData.bgPattern = 'none'"
                :class="[
                  'py-1.5 px-2 rounded-lg border text-center transition text-xs font-medium',
                  (!menuData.bgPattern || menuData.bgPattern === 'none')
                    ? 'bg-amber-900 text-white border-amber-900 font-bold shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                ]"
              >
                無地（模様なし）
              </button>

              <button
                type="button"
                @click="menuData.bgPattern = 'cloud'"
                :class="[
                  'py-1.5 px-2 rounded-lg border text-center transition text-xs font-medium',
                  menuData.bgPattern === 'cloud'
                    ? 'bg-amber-900 text-white border-amber-900 font-bold shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                ]"
              >
                雲竜（繊維調）
              </button>

              <button
                type="button"
                @click="menuData.bgPattern = 'washi'"
                :class="[
                  'py-1.5 px-2 rounded-lg border text-center transition text-xs font-medium',
                  menuData.bgPattern === 'washi'
                    ? 'bg-amber-900 text-white border-amber-900 font-bold shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                ]"
              >
                和紙（微細粒）
              </button>

              <button
                type="button"
                @click="menuData.bgPattern = 'grid'"
                :class="[
                  'py-1.5 px-2 rounded-lg border text-center transition text-xs font-medium',
                  menuData.bgPattern === 'grid'
                    ? 'bg-amber-900 text-white border-amber-900 font-bold shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                ]"
              >
                和風格子（薄枠）
              </button>
            </div>
          </div>

          <!-- 3. Text Color -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="font-semibold text-stone-700 flex items-center gap-1 text-xs">
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

            <!-- Quick Text Color Palette -->
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              <button
                type="button"
                @click="menuData.textColor = '#1c1917'"
                :class="[
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  (!menuData.textColor || menuData.textColor.toLowerCase() === '#1c1917')
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.textColor?.toLowerCase() === '#451a03'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.textColor?.toLowerCase() === '#0f172a'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.textColor?.toLowerCase() === '#064e3b'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.textColor?.toLowerCase() === '#7f1d1d'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
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
                  'py-1.5 px-2 rounded-lg border text-center transition flex items-center justify-center gap-1 text-xs',
                  menuData.textColor?.toLowerCase() === '#ffffff'
                    ? 'border-amber-800 bg-amber-50 font-bold text-amber-950 ring-1 ring-amber-800'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                ]"
              >
                <span class="w-3 h-3 rounded-full bg-white border border-stone-400 shrink-0"></span>
                <span>白文字</span>
              </button>
            </div>
          </div>
        </div>

        <!-- JSON Backup / Restore -->
        <div class="pt-2 border-t border-stone-200 flex items-center justify-between">
          <span class="text-stone-500 font-medium">データバックアップ:</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="exportJson"
              class="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 flex items-center gap-1 transition"
            >
              <Download class="w-3.5 h-3.5 text-stone-500" />
              <span>保存 (JSON)</span>
            </button>
            <button
              type="button"
              @click="triggerImport"
              class="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 flex items-center gap-1 transition"
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

      <!-- Main Title Input -->
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-stone-600 mb-1">メニュー表題（メインタイトル）</label>
          <input
            v-model="menuData.title"
            type="text"
            placeholder="本日のおすすめ / お品書き など"
            class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-base font-bold focus:ring-2 focus:ring-amber-800 focus:border-amber-800 transition"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-stone-500 mb-1">肩書き / サブタイトル</label>
            <input
              v-model="menuData.subtitle"
              type="text"
              placeholder="炭火焼き・季節の一品"
              class="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 text-sm focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-stone-500 mb-1">店名 / 日付等</label>
            <input
              v-model="menuData.storeName"
              type="text"
              placeholder="店名（例: 御食事処 〇〇）"
              class="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 text-sm focus:ring-2 focus:ring-amber-800 transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="addNewItem"
        class="flex-1 py-3 px-4 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition active:scale-[0.98]"
      >
        <Plus class="w-4 h-4" />
        <span>1行追加</span>
      </button>

      <button
        type="button"
        @click="emit('open-presets')"
        class="py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-xl border border-amber-300 shadow-xs flex items-center justify-center gap-1.5 text-sm transition active:scale-[0.98]"
      >
        <span>🏮</span>
        <span>定番から追加</span>
      </button>
    </div>

    <!-- Items List -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between px-1">
        <span class="text-xs font-bold text-stone-500">品目一覧（現在 {{ menuData.items.length }} 品）</span>
        <button
          v-if="menuData.items.length > 0"
          type="button"
          @click="emit('reset-default')"
          class="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 transition"
        >
          <RotateCcw class="w-3 h-3" />
          <span>初期化</span>
        </button>
      </div>

      <div
        v-if="menuData.items.length === 0"
        class="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-stone-200"
      >
        <p class="text-stone-400 text-sm mb-3">メニュー品目がまだありません</p>
        <div class="flex justify-center gap-2">
          <button
            type="button"
            @click="addNewItem"
            class="px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-bold"
          >
            手動で追加
          </button>
          <button
            type="button"
            @click="emit('open-presets')"
            class="px-4 py-2 bg-amber-800 text-white rounded-lg text-xs font-bold"
          >
            定番から選ぶ
          </button>
        </div>
      </div>

      <div
        v-for="(item, index) in menuData.items"
        :key="item.id || index"
        class="bg-white rounded-xl p-3 shadow-xs border border-stone-200 hover:border-stone-300 transition"
      >
        <div class="flex items-start gap-2">
          <!-- Reorder buttons -->
          <div class="flex flex-col gap-0.5 pt-1 text-stone-400">
            <button
              type="button"
              :disabled="index === 0"
              @click="moveItem(index, -1)"
              class="p-1 hover:text-stone-800 disabled:opacity-20 disabled:hover:text-stone-400 transition"
              title="上へ"
            >
              <ChevronUp class="w-4 h-4" />
            </button>
            <button
              type="button"
              :disabled="index === menuData.items.length - 1"
              @click="moveItem(index, 1)"
              class="p-1 hover:text-stone-800 disabled:opacity-20 disabled:hover:text-stone-400 transition"
              title="下へ"
            >
              <ChevronDown class="w-4 h-4" />
            </button>
          </div>

          <!-- Main Input Fields -->
          <div class="flex-1 space-y-2">
            <div class="flex gap-2">
              <input
                v-model="item.name"
                type="text"
                placeholder="品名（例: とり精肉）"
                class="flex-1 px-3 py-2 text-stone-900 font-bold text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-800 focus:border-amber-800"
              />
              <div class="w-24 shrink-0 relative">
                <input
                  v-model="item.price"
                  type="text"
                  placeholder="価格"
                  class="w-full pl-3 pr-6 py-2 text-stone-900 font-bold text-sm rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-800 focus:border-amber-800 text-right"
                />
                <span class="absolute right-2 top-2 text-stone-400 text-xs pointer-events-none">円</span>
              </div>
            </div>

            <div class="flex gap-2">
              <input
                v-model="item.note"
                type="text"
                placeholder="補足（例: 塩・タレ / 数量限定）"
                class="flex-1 px-2.5 py-1.5 text-stone-600 text-xs rounded-lg border border-stone-200 focus:ring-1 focus:ring-amber-800"
              />
              <input
                v-if="menuData.showEnglish"
                v-model="item.translation"
                type="text"
                placeholder="English / Translation"
                class="flex-1 px-2.5 py-1.5 text-stone-500 text-xs rounded-lg border border-stone-200 focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          <!-- Delete button -->
          <button
            type="button"
            @click="removeItem(index)"
            class="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="削除"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Footer Note -->
    <div class="bg-white rounded-2xl p-4 shadow-xs border border-stone-200">
      <label class="block text-xs font-medium text-stone-500 mb-1">用紙下部・注記テキスト</label>
      <input
        v-model="menuData.footerNote"
        type="text"
        placeholder="※価格はすべて税込表示となっております。"
        class="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs focus:ring-2 focus:ring-amber-800"
      />
    </div>
  </div>
</template>
