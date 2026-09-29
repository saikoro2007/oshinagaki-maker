<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col border border-stone-200"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-stone-200 shrink-0">
        <div class="flex items-center gap-2">
          <Share2 class="w-5 h-5 text-amber-600" />
          <div>
            <h3 class="font-bold text-stone-900 text-base">メニューを共有する</h3>
            <p class="text-[11px] text-stone-500">URLリンクで誰とでも同じメニューを共有・同期できます</p>
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
      <div class="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
        
        <!-- Target Menu Card -->
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <span
              class="inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1"
              :class="menuType === 'daily' ? 'bg-amber-100 text-amber-900' : menuType === 'drink' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'"
            >
              {{ menuTypeName }}
            </span>
            <div class="font-bold text-stone-900 text-xs truncate">
              {{ currentData.title || menuTypeName }}
            </div>
          </div>
          <div class="text-right text-[11px] text-stone-500 shrink-0">
            <span class="font-bold font-mono text-stone-800">{{ itemCount }}</span> 品目
            <span v-if="sectionCount">({{ sectionCount }}カテゴリ)</span>
          </div>
        </div>

        <!-- Generating status -->
        <div v-if="isGenerating" class="py-6 text-center text-stone-500 flex flex-col items-center gap-2">
          <Loader2 class="w-6 h-6 animate-spin text-amber-600" />
          <span>共有リンクを生成中...</span>
        </div>

        <template v-else>
          <!-- Share Action Buttons -->
          <div class="space-y-2">
            <!-- Native Share Button (Mobile support: AirDrop / LINE / Messages) -->
            <button
              v-if="canNativeShare"
              type="button"
              @click="handleNativeShare"
              class="w-full py-3 bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Share2 class="w-4 h-4 text-amber-400" />
              <span>スマホで送る (AirDrop / LINE / メール)</span>
            </button>

            <div class="grid grid-cols-2 gap-2">
              <!-- LINE Share Button -->
              <a
                :href="lineShareUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="py-2.5 bg-[#06C755] hover:bg-[#05b34c] active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition text-center"
              >
                <!-- LINE Icon SVG -->
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.499.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .626.285.626.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                <span>LINEで送る</span>
              </a>

              <!-- Copy Link Button -->
              <button
                type="button"
                @click="copyShareUrl"
                class="py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Check v-if="copied" class="w-4 h-4 text-emerald-800" />
                <Copy v-else class="w-4 h-4" />
                <span>{{ copied ? 'コピー完了！' : 'URLをコピー' }}</span>
              </button>
            </div>
          </div>

          <!-- URL Preview Box -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-stone-500">
              <span class="font-medium">共有URLリンク</span>
              <span class="text-[10px] text-stone-400">ワンタップで相手の端末に復元</span>
            </div>
            <div class="relative">
              <textarea
                readonly
                :value="shareUrl"
                @click="$event.target.select()"
                rows="3"
                class="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[11px] font-mono text-stone-600 outline-none select-all break-all"
              ></textarea>
            </div>
          </div>

          <!-- Explanation Notes -->
          <div class="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1 text-stone-600">
            <div class="font-bold text-amber-950 flex items-center gap-1">
              <Sparkles class="w-3.5 h-3.5 text-amber-600" />
              <span>受け取り側の動作</span>
            </div>
            <p class="text-[11px] leading-relaxed">
              相手（弟様やスタッフ）が届いたURLをタップするだけで、<strong>同じメニューがそのまま画面に復元</strong>されます。アプリのインストールやアカウント登録は不要です。
            </p>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="pt-3 border-t border-stone-200 flex justify-end shrink-0">
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
import { ref, computed, onMounted, watch } from 'vue'
import { Share2, X, Copy, Check, Sparkles, Loader2 } from '@lucide/vue'
import { compressMenuData } from '../utils/shareEncoder'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  menuType: {
    type: String,
    required: true
  },
  currentData: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const shareUrl = ref('')
const isGenerating = ref(false)
const copied = ref(false)
let copyTimer = null

const menuTypeName = computed(() => {
  if (props.menuType === 'daily') return '本日のおすすめ'
  if (props.menuType === 'drink') return 'お飲み物メニュー'
  return '定番料理メニュー'
})

const itemCount = computed(() => {
  if (props.currentData.items) return props.currentData.items.length
  if (props.currentData.sections) {
    return props.currentData.sections.reduce((acc, s) => acc + (s.items?.length || 0), 0)
  }
  return 0
})

const sectionCount = computed(() => {
  return props.currentData.sections ? props.currentData.sections.length : 0
})

const canNativeShare = computed(() => {
  return typeof navigator !== 'undefined' && !!navigator.share
})

const lineShareUrl = computed(() => {
  const text = `【お品書きメーカー】${menuTypeName.value}を共有します\n${shareUrl.value}`
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`
})

async function generateUrl() {
  isGenerating.value = true
  try {
    const encoded = await compressMenuData(props.menuType, props.currentData)
    // URLハッシュ形式: #share=<encoded>
    const baseUrl = window.location.origin + window.location.pathname
    shareUrl.value = `${baseUrl}#share=${encoded}`
  } catch (err) {
    console.error('Failed to generate share URL:', err)
  } finally {
    isGenerating.value = false
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      copied.value = false
      generateUrl()
    }
  },
  { immediate: true }
)

async function copyShareUrl() {
  if (!shareUrl.value) return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error(e)
    alert('URLのコピーに失敗しました。下の枠から直接コピーしてください。')
  }
}

async function handleNativeShare() {
  if (!navigator.share || !shareUrl.value) return
  try {
    await navigator.share({
      title: `お品書きメーカー - ${menuTypeName.value}`,
      text: `【お品書き】${menuTypeName.value}を共有します。タップして編集・印刷できます。`,
      url: shareUrl.value
    })
  } catch (e) {
    // ユーザーが共有をキャンセルした場合は無視
    if (e.name !== 'AbortError') {
      console.error(e)
    }
  }
}
</script>
