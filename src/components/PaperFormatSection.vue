<template>
  <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-3">
    <h3 class="font-bold text-sm text-stone-900 flex items-center justify-between">
      <span>用紙サイズ・向き</span>
    </h3>

    <div class="grid grid-cols-2 gap-3 text-xs">
      <!-- Paper Orientation -->
      <div>
        <label class="block text-stone-500 mb-1.5 font-medium">用紙の向き</label>
        <div class="grid grid-cols-2 gap-1.5 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            @click="menuData.paperOrientation = 'landscape'"
            :class="[
              'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
              menuData.paperOrientation !== 'portrait'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            ]"
          >
            横置き (定番)
          </button>
          <button
            type="button"
            @click="menuData.paperOrientation = 'portrait'"
            :class="[
              'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
              menuData.paperOrientation === 'portrait'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            ]"
          >
            縦置き
          </button>
        </div>
      </div>

      <!-- Paper Size -->
      <div>
        <label class="block text-stone-500 mb-1.5 font-medium">用紙サイズ</label>
        <div class="grid grid-cols-2 gap-1.5 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            @click="menuData.paperSize = 'A4'"
            :class="[
              'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
              menuData.paperSize !== 'B5'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            ]"
          >
            A4
          </button>
          <button
            type="button"
            @click="menuData.paperSize = 'B5'"
            :class="[
              'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs',
              menuData.paperSize === 'B5'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            ]"
          >
            B5
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  menuData: {
    type: Object,
    required: true,
  }
})
</script>
