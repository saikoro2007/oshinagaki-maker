<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200" @click.self="$emit('close')">
    <div
      class="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col border border-stone-200"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-stone-200 shrink-0">
        <div class="flex items-center gap-2">
          <Bookmark class="w-5 h-5 text-amber-600" />
          <div>
            <h3 class="font-bold text-stone-900 text-base">メニューの保存・呼出（マイメニュー）</h3>
            <p class="text-[11px] text-stone-500">作成したお品書きをスマホ・PCに保存し、いつでも切り替え・復元できます</p>
          </div>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto py-3 space-y-4 text-xs">
        
        <!-- 1. Save Current Menu Box -->
        <div class="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80 space-y-2">
          <label class="block font-bold text-amber-950 text-xs">
            現在のメニューを手元に記憶（名前をつけて保存）
          </label>
          <div class="flex gap-2">
            <input
              v-model="newSlotName"
              type="text"
              :placeholder="defaultSaveName"
              class="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-stone-900 outline-none focus:ring-2 focus:ring-amber-500"
              @keydown.enter="saveCurrentMenu"
            />
            <button
              type="button"
              @click="saveCurrentMenu"
              class="px-4 py-2 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold rounded-lg text-xs shadow-xs transition cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Save class="w-3.5 h-3.5" />
              <span>記憶する</span>
            </button>
          </div>
        </div>

        <!-- 2. Saved Slots List -->
        <div class="space-y-2">
          <div class="flex items-center justify-between px-1">
            <span class="font-bold text-stone-700">保存済みメニュー一覧 ({{ savedSlots.length }}件)</span>
            <span class="text-[10px] text-stone-400">お使いの端末（ブラウザ）に安全に保持</span>
          </div>

          <div v-if="savedSlots.length === 0" class="p-6 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50">
            <p class="text-stone-400 text-xs mb-1">まだ手元に保存されたメニューはありません</p>
            <p class="text-[11px] text-stone-400">上の入力欄から現在のメニューを記憶させておくと、後からいつでも復元できます</p>
          </div>

          <div
            v-for="(slot, idx) in savedSlots"
            :key="slot.id"
            class="p-3 bg-white hover:bg-stone-50/90 rounded-xl border border-stone-200/90 shadow-xs flex items-center justify-between gap-2.5 transition"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="slot.type === 'daily' ? 'bg-amber-100 text-amber-900' : slot.type === 'drink' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'"
                >
                  {{ slot.type === 'daily' ? 'おすすめ' : slot.type === 'drink' ? 'お飲み物' : '定番料理' }}
                </span>
                <span class="font-bold text-stone-900 text-xs truncate">
                  {{ slot.name }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-[10px] text-stone-400">
                <span>{{ formatDate(slot.updatedAt) }}</span>
                <span>·</span>
                <span>{{ slot.itemCount }}品目</span>
                <span v-if="slot.sectionCount">({{ slot.sectionCount }}カテゴリ)</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                @click="loadSlot(slot)"
                class="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                title="このメニューを画面に読み込む"
              >
                <FolderOpen class="w-3.5 h-3.5" />
                <span>開く</span>
              </button>
              <button
                type="button"
                @click="deleteSlot(idx)"
                class="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                title="削除"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Official Defaults Quick Loader -->
        <div class="pt-3 border-t border-stone-200 space-y-2">
          <label class="block font-bold text-stone-700 text-xs">
            公式プリセットから復元・初期化
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              @click="$emit('load-preset', 'grand')"
              class="p-2.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl text-left transition cursor-pointer"
            >
              <div class="font-bold text-stone-800 text-xs flex items-center gap-1.5 mb-0.5">
                <span>🍲</span>
                <span>定番料理メニュー</span>
              </div>
              <p class="text-[10px] text-stone-400">メニュー改定PDF準拠（全21品焼き物等）</p>
            </button>

            <button
              type="button"
              @click="$emit('load-preset', 'drink')"
              class="p-2.5 bg-stone-50 hover:bg-sky-50 border border-stone-200 hover:border-sky-300 rounded-xl text-left transition cursor-pointer"
            >
              <div class="font-bold text-stone-800 text-xs flex items-center gap-1.5 mb-0.5">
                <span>🍺</span>
                <span>お飲み物メニュー</span>
              </div>
              <p class="text-[10px] text-stone-400">クラシック樽生・サワー各580円等</p>
            </button>

            <button
              type="button"
              @click="$emit('load-preset', 'daily')"
              class="p-2.5 bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-xl text-left transition cursor-pointer"
            >
              <div class="font-bold text-stone-800 text-xs flex items-center gap-1.5 mb-0.5">
                <span>🏮</span>
                <span>本日のおすすめ</span>
              </div>
              <p class="text-[10px] text-stone-400">豚巻きキムチ串・サバ串等12品</p>
            </button>
          </div>
        </div>

        <!-- 4. File Backup & Restore (JSON) -->
        <div class="space-y-2 pt-2 border-t border-stone-100">
          <div class="flex items-center justify-between px-1">
            <span class="font-bold text-stone-700">ファイルバックアップ（JSON）</span>
            <span class="text-[10px] text-stone-400">機種変更や保管用</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <!-- Export JSON -->
            <button
              type="button"
              @click="exportJson"
              class="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-left flex items-center gap-2 transition cursor-pointer"
            >
              <Download class="w-4 h-4 text-stone-600 shrink-0" />
              <div>
                <div class="font-bold text-stone-800 text-xs">ファイル保存</div>
                <div class="text-[10px] text-stone-400">現在のデータを書き出し</div>
              </div>
            </button>

            <!-- Import JSON -->
            <button
              type="button"
              @click="triggerImport"
              class="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-left flex items-center gap-2 transition cursor-pointer"
            >
              <Upload class="w-4 h-4 text-stone-600 shrink-0" />
              <div>
                <div class="font-bold text-stone-800 text-xs">ファイル読込</div>
                <div class="text-[10px] text-stone-400">保存したJSONを復元</div>
              </div>
            </button>
            <input
              type="file"
              ref="jsonFileInput"
              accept=".json,application/json"
              class="hidden"
              @change="handleFileImport"
            />
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="pt-3 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
        <span class="text-[11px] text-stone-400">※ブラウザの履歴やCookie消去にご注意ください</span>
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg transition cursor-pointer"
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bookmark, Save, Trash2, FolderOpen, X, Download, Upload } from '@lucide/vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  currentMenuType: {
    type: String,
    required: true,
  },
  currentData: {
    type: Object,
    required: true,
  }
})

const emit = defineEmits(['close', 'load-slot', 'load-preset'])

const STORAGE_KEY_SLOTS = 'oshinagaki_maker_saved_slots'
const savedSlots = ref([])
const newSlotName = ref('')

const defaultSaveName = computed(() => {
  const dateStr = new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
  if (props.currentMenuType === 'daily') {
    return `本日のおすすめ (${dateStr})`
  } else if (props.currentMenuType === 'drink') {
    return `お飲み物メニュー (${dateStr})`
  }
  return `定番料理メニュー (${dateStr})`
})

onMounted(() => {
  loadSlotsFromStorage()
})

function loadSlotsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SLOTS)
    if (raw) {
      savedSlots.value = JSON.parse(raw)
    }
  } catch (e) {
    console.error(e)
  }
}

function persistSlots() {
  try {
    localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(savedSlots.value))
  } catch (e) {
    console.error(e)
  }
}

function saveCurrentMenu() {
  const name = newSlotName.value.trim() || defaultSaveName.value
  
  // 計算用
  let itemCount = 0
  let sectionCount = 0
  if (props.currentData.items) {
    itemCount = props.currentData.items.length
  } else if (props.currentData.sections) {
    sectionCount = props.currentData.sections.length
    itemCount = props.currentData.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0)
  }

  const newSlot = {
    id: Date.now().toString(),
    type: props.currentMenuType,
    name,
    updatedAt: new Date().toISOString(),
    itemCount,
    sectionCount,
    data: JSON.parse(JSON.stringify(props.currentData))
  }

  savedSlots.value.unshift(newSlot)
  persistSlots()
  newSlotName.value = ''
  alert(`「${name}」を手元に記憶（保存）しました！`)
}

function loadSlot(slot) {
  if (confirm(`「${slot.name}」を画面に読み込みますか？\n（現在の未保存の編集内容は上書きされます）`)) {
    emit('load-slot', slot)
    emit('close')
  }
}

function deleteSlot(idx) {
  const slot = savedSlots.value[idx]
  if (confirm(`「${slot.name}」を削除してもよろしいですか？`)) {
    savedSlots.value.splice(idx, 1)
    persistSlots()
  }
}

function formatDate(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const jsonFileInput = ref(null)

function exportJson() {
  const exportPayload = {
    version: 'oshinagaki_backup_v1',
    exportedAt: new Date().toISOString(),
    type: props.currentMenuType,
    menuData: props.currentData,
    savedSlots: savedSlots.value
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `oshinagaki-${props.currentMenuType}-${new Date().toISOString().slice(0, 10)}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

function triggerImport() {
  if (jsonFileInput.value) {
    jsonFileInput.value.click()
  }
}

function handleFileImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result)
      // バックアップファイルか単体メニューJSONかを判定
      if (parsed.version === 'oshinagaki_backup_v1') {
        if (parsed.savedSlots && Array.isArray(parsed.savedSlots)) {
          // 保存スロットもマージ
          const merged = [...parsed.savedSlots, ...savedSlots.value]
          // 重複ID除外
          const unique = merged.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
          savedSlots.value = unique
          persistSlots()
        }
        if (parsed.type && parsed.menuData) {
          emit('load-slot', { type: parsed.type, data: parsed.menuData, name: 'ファイル復元' })
        }
      } else {
        // 単一メニューJSON
        emit('load-slot', { type: props.currentMenuType, data: parsed, name: 'ファイル復元' })
      }
      alert('メニューファイルを正常に読み込みました！')
      emit('close')
    } catch (err) {
      console.error(err)
      alert('ファイルの読み込みに失敗しました。正しいJSONファイルを選択してください。')
    } finally {
      event.target.value = ''
    }
  }
  reader.readAsText(file)
}
</script>
