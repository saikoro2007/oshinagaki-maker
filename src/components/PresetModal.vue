<script setup>
import { ref } from 'vue'
import { RESTAURANT_PRESETS } from '../constants/presets'
import { X, Plus, Check } from '@lucide/vue'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close', 'add-item'])

const activeCategory = ref(RESTAURANT_PRESETS[0].category)
const addedItems = ref(new Set())

function handleAdd(item) {
  emit('add-item', { ...item })
  addedItems.value.add(item.name)
  setTimeout(() => {
    addedItems.value.delete(item.name)
  }, 1200)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
    <div class="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
        <div>
          <h3 class="font-bold text-lg text-stone-800 flex items-center gap-2">
            <span>🏮</span> 定番メニューから追加
          </h3>
          <p class="text-xs text-stone-500 mt-0.5">タップするとそのままお品書きに追加されます</p>
        </div>
        <button
          @click="emit('close')"
          class="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Categories tabs -->
      <div class="flex overflow-x-auto border-b border-stone-200 px-3 py-2 gap-1.5 bg-stone-100/60 no-scrollbar">
        <button
          v-for="cat in RESTAURANT_PRESETS"
          :key="cat.category"
          @click="activeCategory = cat.category"
          :class="[
            'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition',
            activeCategory === cat.category
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-200'
          ]"
        >
          {{ cat.category }}
        </button>
      </div>

      <!-- Items Grid -->
      <div class="p-4 overflow-y-auto space-y-2 flex-1">
        <div
          v-for="cat in RESTAURANT_PRESETS"
          :key="cat.category"
          v-show="activeCategory === cat.category"
          class="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          <div
            v-for="item in cat.items"
            :key="item.name"
            class="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-amber-600 bg-stone-50 hover:bg-amber-50/50 transition cursor-pointer group"
            @click="handleAdd(item)"
          >
            <div class="min-w-0 pr-2">
              <div class="font-bold text-stone-800 text-sm group-hover:text-amber-900 truncate">
                {{ item.name }}
              </div>
              <div class="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                <span class="font-semibold text-amber-900">{{ item.price }}円</span>
                <span v-if="item.note" class="text-[11px] bg-stone-200/80 px-1.5 py-0.5 rounded text-stone-600">
                  {{ item.note }}
                </span>
              </div>
            </div>

            <button
              type="button"
              class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition"
              :class="addedItems.has(item.name) ? 'bg-emerald-600 text-white' : 'bg-stone-200 group-hover:bg-amber-800 group-hover:text-white text-stone-700'"
            >
              <Check v-if="addedItems.has(item.name)" class="w-4 h-4" />
              <Plus v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
        <button
          @click="emit('close')"
          class="w-full sm:w-auto px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-sm font-semibold transition"
        >
          完了（編集に戻る）
        </button>
      </div>
    </div>
  </div>
</template>
