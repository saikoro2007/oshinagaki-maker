<template>
  <div class="relative inline-flex items-center justify-center select-none" :class="wrapperClass">
    <svg
      viewBox="0 0 160 160"
      class="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 円相（筆書きのサークル） -->
      <path
        d="M 80 18
           C 114 18 142 45 142 80
           C 142 115 115 142 80 142
           C 44 142 18 114 18 78
           C 18 48 38 24 66 19"
        fill="none"
        stroke="currentColor"
        stroke-width="7"
        stroke-linecap="round"
        stroke-dasharray="380"
        stroke-dashoffset="15"
        class="opacity-95"
      />
      <!-- かすれ筆タッチのアクセント重ね -->
      <path
        d="M 68 20
           C 106 17 140 46 139 82
           C 138 116 112 140 76 139"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        class="opacity-60"
      />

      <!-- ロゴ文字「もず」（毛筆体スタイル） -->
      <text
        x="80"
        y="96"
        text-anchor="middle"
        dominant-baseline="central"
        fill="currentColor"
        class="font-brush font-black text-[54px] tracking-tight"
        style="letter-spacing: -0.05em;"
      >
        もず
      </text>

      <!-- 下部の角印（落款風アクセント） -->
      <g transform="translate(68, 126)">
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          rx="4"
          fill="#b91c1c"
          stroke="#991b1b"
          stroke-width="1"
        />
        <text
          x="12"
          y="13"
          text-anchor="middle"
          dominant-baseline="central"
          fill="#ffffff"
          class="font-serif-jp font-bold text-[11px]"
        >
          炭
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  wrapperClass: {
    type: String,
    default: 'w-24 h-24 sm:w-28 sm:h-28'
  }
})
</script>
