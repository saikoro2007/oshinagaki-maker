<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="$emit('close')"
    >
      <div
        class="bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-4 py-3 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-amber-400 font-bold flex items-center gap-1.5 text-sm sm:text-base">
              <ImageIcon class="w-4 h-4" />
              <span>{{ title || 'お品書き画像の書き出し完了' }}</span>
            </span>
          </div>
          <button
            @click="$emit('close')"
            type="button"
            class="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
            title="閉じる"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 overflow-y-auto space-y-3 flex-1 flex flex-col items-center">
          <!-- Mobile Guidance Banner -->
          <div class="w-full bg-amber-950/60 border border-amber-700/60 rounded-xl p-3 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
            <span class="text-base shrink-0">📱</span>
            <div>
              <p class="font-bold text-white mb-0.5">スマートフォンでご利用の場合</p>
              <p class="leading-relaxed opacity-90 text-[11px] sm:text-xs">
                下の画像を<strong class="text-amber-300">「長押し」</strong>して<strong class="text-white">「写真に追加」</strong>または<strong class="text-white">「画像を保存」</strong>を選ぶとカメラロールに保存されます。Instagramの投稿やストーリー、LINE配信にそのままお使いいただけます。
              </p>
            </div>
          </div>

          <!-- Image Container -->
          <div class="w-full flex justify-center bg-stone-950 p-2 sm:p-3 rounded-xl border border-stone-800 overflow-hidden">
            <img
              :src="imageUrl"
              alt="生成されたお品書き画像"
              class="max-h-[50vh] sm:max-h-[55vh] w-auto max-w-full object-contain rounded shadow-lg border border-stone-800/80 select-auto"
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-4 py-3 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <span class="text-xs text-stone-400 hidden sm:inline">高解像度 PNG形式</span>
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              @click="$emit('download')"
              type="button"
              class="flex-1 sm:flex-initial px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download class="w-4 h-4" />
              <span>保存する</span>
            </button>
            <button
              @click="$emit('close')"
              type="button"
              class="px-4 py-2 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 hover:text-white rounded-xl text-xs sm:text-sm transition cursor-pointer"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Image as ImageIcon, Download, X } from '@lucide/vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['close', 'download'])
</script>
