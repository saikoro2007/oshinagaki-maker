<template>
  <div class="space-y-4">
    <!-- Top Action Toolbar (Hidden on Print) -->
    <div
      class="no-print bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
          グランドメニュー（定番）
        </span>
        <span class="text-xs text-stone-500 font-medium">
          {{ menuData.paperSize || 'A4' }} {{ isLandscape ? '横置き' : '縦置き' }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Save as PNG button -->
        <button
          @click="saveAsImage"
          type="button"
          :disabled="isGeneratingImage"
          class="px-3 py-2 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 font-bold rounded-xl text-xs sm:text-sm border border-stone-300 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
        >
          <Loader2 v-if="isGeneratingImage" class="w-4 h-4 animate-spin text-amber-600" />
          <ImageIcon v-else class="w-4 h-4 text-stone-600" />
          <span class="hidden sm:inline">画像保存 (PNG)</span>
          <span class="sm:hidden">画像</span>
        </button>

        <!-- Print PDF Button -->
        <button
          @click="triggerPrint"
          type="button"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition cursor-pointer"
        >
          <Printer class="w-4 h-4" />
          <span>印刷する (PDF)</span>
        </button>
      </div>
    </div>

    <!-- Mobile swipe hint -->
    <div
      class="no-print lg:hidden text-center text-xs text-stone-500 flex items-center justify-center gap-1.5 py-1"
    >
      <ArrowLeftRight class="w-3.5 h-3.5 text-amber-600 animate-pulse" />
      <span>左右にスクロールして全体を確認・文字編集できます</span>
    </div>

    <!-- Paper Scroll Container -->
    <div
      ref="scrollContainer"
      class="preview-scroll w-full overflow-x-auto pb-8 flex justify-start lg:justify-center px-1 sm:px-2 print:p-0 print:overflow-visible print:block print:h-full"
    >
      <div
        ref="printSheetRef"
        :class="[
          'print-sheet shrink-0 shadow-2xl transition-all relative select-none border border-current/20 print:shadow-none print:border-none print:min-w-0 print:max-w-none print:w-full print:h-full print:min-h-0 print:p-2 overflow-hidden',
          fontClass,
          sheetDimensionClasses
        ]"
        :style="sheetStyle"
      >
        <!-- ==============================================================
             A. LANDSCAPE LAYOUT (横置き・実写真そのままの2段組)
             ============================================================== -->
        <div
          v-if="isLandscape"
          class="w-full h-full flex flex-col justify-between relative z-10 p-3 sm:p-5 print:p-2 box-border overflow-hidden"
        >
          <!-- ------------------------------------------------------------
               上段 (Top Half): 焼き物 (20品) / トッピング / サラダ
               ------------------------------------------------------------ -->
          <div class="vertical-rl h-[48%] flex flex-col justify-start items-stretch border-b border-stone-800/20 pb-2 overflow-visible">
            
            <!-- 1. 焼き物ブロック (右端) -->
            <div v-if="yakimonoSection" class="flex flex-col items-stretch h-full pl-2 sm:pl-3 shrink-0">
              <!-- 見出し列「焼き物」＋サブ「一本 塩・タレ」 -->
              <div class="flex flex-row justify-start items-center h-full px-1.5 sm:px-2 shrink-0 border-l border-current/25">
                <h2
                  contenteditable="true"
                  @blur="onTextBlur(yakimonoSection, 'name', $event)"
                  class="editable-field text-xl sm:text-2xl font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5"
                >
                  {{ yakimonoSection.name }}
                </h2>
                <span
                  v-if="yakimonoSection.subtitle"
                  contenteditable="true"
                  @blur="onTextBlur(yakimonoSection, 'subtitle', $event)"
                  class="editable-field text-[10px] sm:text-xs opacity-80 tracking-wider mt-2 outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 whitespace-nowrap"
                >
                  {{ yakimonoSection.subtitle }}
                </span>
              </div>

              <!-- 焼き物品目列 (20品) -->
              <div
                v-for="(item, idx) in yakimonoSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[15px] sm:min-w-[18px] shrink-0"
              >
                <!-- 品名 (上部・上揃え) -->
                <div class="pt-0.5 whitespace-nowrap overflow-visible">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold leading-tight outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 block',
                      getItemNameClass(item.name)
                    ]"
                  >
                    <span v-if="menuData.showDotPrefix" class="text-[9px] opacity-70 mr-0.5">・</span>{{ item.name }}
                  </span>
                </div>

                <!-- 価格 (下部・下端固定でベースライン一直線！) -->
                <div class="self-end pb-0.5 whitespace-nowrap shrink-0">
                  <span
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    class="editable-field text-[11px] sm:text-xs font-bold tracking-tighter outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 font-mono"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 2. トッピングブロック (中央上) -->
            <div v-if="toppingSection" class="flex flex-col items-stretch h-full px-2 sm:px-2.5 border-r border-current/25 pl-2.5 sm:pl-3.5 shrink-0">
              <!-- 見出し列「トッピング」 -->
              <div class="flex flex-row justify-start items-center h-full px-1 sm:px-1.5 shrink-0">
                <h3
                  contenteditable="true"
                  @blur="onTextBlur(toppingSection, 'name', $event)"
                  class="editable-field text-base sm:text-lg font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5"
                >
                  {{ toppingSection.name }}
                </h3>
              </div>

              <!-- トッピング品目列（梅、チーズ、山わさび） -->
              <div
                v-for="(item, idx) in toppingSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-start h-full px-0.5 min-w-[15px] sm:min-w-[17px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    class="editable-field text-[11px] sm:text-xs font-bold tracking-normal leading-snug outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5"
                  >
                    <span v-if="menuData.showDotPrefix" class="text-[9px] opacity-70 mr-0.5">・</span>{{ item.name }}
                  </span>
                </div>
              </div>

              <!-- 一括価格「各五〇円」列 (ベースライン下揃え) -->
              <div class="flex flex-row justify-end items-end h-full px-0.5 shrink-0 pb-0.5">
                <span
                  contenteditable="true"
                  @blur="onTextBlur(toppingSection, 'uniformPrice', $event)"
                  class="editable-field text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5"
                >
                  各{{ formatPrice(toppingSection.uniformPrice || '50', menuData.priceFormat, true) }}
                </span>
              </div>
            </div>

            <!-- 3. サラダブロック (左手上) -->
            <div v-if="saladSection" class="flex flex-col items-stretch h-full px-2 sm:px-2.5 pl-2.5 sm:pl-3.5 shrink-0">
              <!-- 見出し列「サラダ」 -->
              <div class="flex flex-row justify-start items-center h-full px-1 sm:px-1.5 shrink-0">
                <h3
                  contenteditable="true"
                  @blur="onTextBlur(saladSection, 'name', $event)"
                  class="editable-field text-base sm:text-lg font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5"
                >
                  {{ saladSection.name }}
                </h3>
              </div>

              <!-- サラダ品目列 (2品) -->
              <div
                v-for="(item, idx) in saladSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[17px] sm:min-w-[20px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold leading-tight outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 block',
                      getItemNameClass(item.name)
                    ]"
                  >
                    <span v-if="menuData.showDotPrefix" class="text-[9px] opacity-70 mr-0.5">・</span>{{ item.name }}
                  </span>
                </div>
                <div class="self-end pb-0.5 whitespace-nowrap shrink-0">
                  <span
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    class="editable-field text-[11px] sm:text-xs font-bold tracking-tighter outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 font-mono"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- ------------------------------------------------------------
               下段 (Bottom Half): 一品料理 (17品) / ご飯もの / 店舗ロゴ＆案内
               ------------------------------------------------------------ -->
          <div class="vertical-rl h-[48%] flex flex-col justify-start items-stretch pt-2 overflow-visible">
            
            <!-- 1. 一品料理ブロック (右端) -->
            <div v-if="ippinSection" class="flex flex-col items-stretch h-full pl-2 sm:pl-3 shrink-0">
              <!-- 見出し列「一品」 -->
              <div class="flex flex-row justify-start items-center h-full px-1.5 sm:px-2 shrink-0 border-l border-current/25">
                <h2
                  contenteditable="true"
                  @blur="onTextBlur(ippinSection, 'name', $event)"
                  class="editable-field text-xl sm:text-2xl font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5"
                >
                  {{ ippinSection.name }}
                </h2>
              </div>

              <!-- 一品 品目列 (17品) -->
              <div
                v-for="(item, idx) in ippinSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[13.5px] sm:min-w-[16px] shrink-0"
              >
                <!-- 品名 (上部・上揃え、長い品名は自動縮小) -->
                <div class="pt-0.5 whitespace-nowrap overflow-visible">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold leading-tight outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 block',
                      getItemNameClass(item.name)
                    ]"
                  >
                    <span v-if="menuData.showDotPrefix" class="text-[9px] opacity-70 mr-0.5">・</span>{{ item.name }}
                  </span>
                </div>

                <!-- 価格 (下部・下端固定でベースライン一直線！) -->
                <div class="self-end pb-0.5 whitespace-nowrap shrink-0">
                  <span
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    class="editable-field text-[10.5px] sm:text-[11.5px] font-bold tracking-tighter outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 font-mono"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 2. ご飯ものブロック (中央〜左) -->
            <div v-if="gohanSection" class="flex flex-col items-stretch h-full px-2 sm:px-2.5 border-r border-current/25 pl-2 sm:pl-3 shrink-0">
              <!-- 見出し列「ご飯もの」 -->
              <div class="flex flex-row justify-start items-center h-full px-1 sm:px-1.5 shrink-0">
                <h3
                  contenteditable="true"
                  @blur="onTextBlur(gohanSection, 'name', $event)"
                  class="editable-field text-base sm:text-lg font-black tracking-widest outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5"
                >
                  {{ gohanSection.name }}
                </h3>
              </div>

              <!-- ご飯もの品目列 (6品) -->
              <div
                v-for="(item, idx) in gohanSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[15px] sm:min-w-[17.5px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap overflow-visible">
                  <span
                    contenteditable="true"
                    @blur="onTextBlur(item, 'name', $event)"
                    :class="[
                      'editable-field font-bold leading-tight outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 block',
                      getItemNameClass(item.name)
                    ]"
                  >
                    <span v-if="menuData.showDotPrefix" class="text-[9px] opacity-70 mr-0.5">・</span>{{ item.name }}
                  </span>
                </div>
                <div class="self-end pb-0.5 whitespace-nowrap shrink-0">
                  <span
                    contenteditable="true"
                    @blur="onPriceBlur(item, $event)"
                    class="editable-field text-[11px] sm:text-xs font-bold tracking-tighter outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5 font-mono"
                  >
                    {{ formatPrice(item.price, menuData.priceFormat, true) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 3. 店舗ロゴ & 営業案内ブロック (左端・実写真完全再現) -->
            <div
              v-if="menuData.noticeBlock && menuData.noticeBlock.show"
              class="flex flex-col items-stretch h-full pl-2 sm:pl-3 pr-1 shrink-0"
            >
              <!-- 案内文 (3行) -->
              <div class="flex flex-col justify-center items-start h-full gap-1.5 sm:gap-2 text-[9px] sm:text-[10.5px] leading-relaxed opacity-85 pt-1">
                <div
                  v-for="(line, lIdx) in menuData.noticeBlock.lines"
                  :key="lIdx"
                  contenteditable="true"
                  @blur="onNoticeBlur(lIdx, $event)"
                  class="editable-field whitespace-nowrap outline-none hover:bg-amber-100/60 focus:bg-amber-100/90 rounded px-0.5"
                >
                  {{ line }}
                </div>
              </div>

              <!-- 店舗ロゴ（ユーザー登録画像優先、無ければMozuLogo） -->
              <div class="flex items-center justify-center pl-2 sm:pl-3 self-center shrink-0">
                <img
                  v-if="currentLogoImage"
                  :src="currentLogoImage"
                  alt="店舗ロゴ"
                  class="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xs"
                />
                <MozuLogo
                  v-else
                  wrapper-class="w-14 h-14 sm:w-16 sm:h-16 text-stone-900"
                />
              </div>
            </div>

          </div>

        </div>

        <!-- ==============================================================
             B. PORTRAIT LAYOUT (縦置き・3段組で全品一覧)
             ============================================================== -->
        <div
          v-else
          class="w-full h-full flex flex-col justify-between relative z-10 p-3 sm:p-5 print:p-2 box-border overflow-hidden"
        >
          <!-- 1段目 (上段): 焼き物 (20品) -->
          <div class="vertical-rl h-[32%] flex flex-col justify-start items-stretch border-b border-stone-800/20 pb-1.5 overflow-visible">
            <div v-if="yakimonoSection" class="flex flex-col items-stretch h-full shrink-0">
              <div class="flex flex-row justify-start items-center h-full px-1.5 shrink-0 border-l border-current/25">
                <h2 class="text-base sm:text-lg font-black tracking-widest">{{ yakimonoSection.name }}</h2>
                <span v-if="yakimonoSection.subtitle" class="text-[9px] opacity-80 mt-1 whitespace-nowrap">{{ yakimonoSection.subtitle }}</span>
              </div>
              <div
                v-for="(item, idx) in yakimonoSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[16px] sm:min-w-[19px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold leading-tight">
                  <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70">・</span>{{ item.name }}
                </div>
                <div class="self-end pb-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold font-mono">
                  {{ formatPrice(item.price, menuData.priceFormat, true) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 2段目 (中段): 一品料理 (17品) -->
          <div class="vertical-rl h-[32%] flex flex-col justify-start items-stretch border-b border-stone-800/20 py-1.5 overflow-visible">
            <div v-if="ippinSection" class="flex flex-col items-stretch h-full shrink-0">
              <div class="flex flex-row justify-start items-center h-full px-1.5 shrink-0 border-l border-current/25">
                <h2 class="text-base sm:text-lg font-black tracking-widest">{{ ippinSection.name }}</h2>
              </div>
              <div
                v-for="(item, idx) in ippinSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-0.5 min-w-[16px] sm:min-w-[19px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold leading-tight">
                  <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70">・</span>{{ item.name }}
                </div>
                <div class="self-end pb-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold font-mono">
                  {{ formatPrice(item.price, menuData.priceFormat, true) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 3段目 (下段): トッピング + サラダ + ご飯もの + ロゴ案内 -->
          <div class="vertical-rl h-[34%] flex flex-col justify-start items-stretch pt-1.5 overflow-visible">
            <!-- トッピング -->
            <div v-if="toppingSection" class="flex flex-col items-stretch h-full pr-1.5 shrink-0">
              <div class="flex flex-row justify-start items-center h-full px-1 shrink-0 border-l border-current/25">
                <h3 class="text-xs sm:text-sm font-black">{{ toppingSection.name }}</h3>
              </div>
              <div
                v-for="(item, idx) in toppingSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-start h-full px-1 min-w-[16px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold">
                  <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70">・</span>{{ item.name }}
                </div>
              </div>
              <div class="flex flex-row justify-end items-end h-full px-1 shrink-0 pb-0.5">
                <span class="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">各{{ formatPrice(toppingSection.uniformPrice || '50', menuData.priceFormat, true) }}</span>
              </div>
            </div>

            <!-- サラダ -->
            <div v-if="saladSection" class="flex flex-col items-stretch h-full px-1.5 border-r border-current/20 pl-1.5 shrink-0">
              <div class="flex flex-row justify-start items-center h-full px-1 shrink-0">
                <h3 class="text-xs sm:text-sm font-black">{{ saladSection.name }}</h3>
              </div>
              <div
                v-for="(item, idx) in saladSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-1 min-w-[17px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold">
                  <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70">・</span>{{ item.name }}
                </div>
                <div class="self-end pb-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold font-mono">
                  {{ formatPrice(item.price, menuData.priceFormat, true) }}
                </div>
              </div>
            </div>

            <!-- ご飯もの -->
            <div v-if="gohanSection" class="flex flex-col items-stretch h-full px-1.5 border-r border-current/20 pl-1.5 shrink-0">
              <div class="flex flex-row justify-start items-center h-full px-1 shrink-0">
                <h3 class="text-xs sm:text-sm font-black">{{ gohanSection.name }}</h3>
              </div>
              <div
                v-for="(item, idx) in gohanSection.items"
                :key="item.id || idx"
                class="flex flex-row justify-between h-full px-1 min-w-[17px] shrink-0"
              >
                <div class="pt-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold">
                  <span v-if="menuData.showDotPrefix" class="text-[8px] opacity-70">・</span>{{ item.name }}
                </div>
                <div class="self-end pb-0.5 whitespace-nowrap text-[10px] sm:text-[11px] font-bold font-mono">
                  {{ formatPrice(item.price, menuData.priceFormat, true) }}
                </div>
              </div>
            </div>

            <!-- 店舗ロゴ＆案内 -->
            <div v-if="menuData.noticeBlock && menuData.noticeBlock.show" class="flex flex-col items-stretch h-full pl-2 pr-1 shrink-0">
              <div class="flex flex-col justify-center items-start h-full gap-1 text-[8.5px] sm:text-[9.5px] leading-relaxed opacity-85">
                <div v-for="(line, lIdx) in menuData.noticeBlock.lines" :key="lIdx" class="whitespace-nowrap">
                  {{ line }}
                </div>
              </div>
              <div class="flex items-center justify-center pl-1.5 self-center">
                <img
                  v-if="currentLogoImage"
                  :src="currentLogoImage"
                  alt="店舗ロゴ"
                  class="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xs"
                />
                <MozuLogo
                  v-else
                  wrapper-class="w-14 h-14 sm:w-16 sm:h-16 text-stone-900"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="showImageModal"
      class="no-print fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      @click.self="showImageModal = false"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-stone-200">
          <div class="flex items-center gap-2">
            <ImageIcon class="w-5 h-5 text-amber-600" />
            <h3 class="font-bold text-stone-900 text-base">生成されたグランドメニュー画像</h3>
          </div>
          <button
            @click="showImageModal = false"
            class="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-auto py-4 flex items-center justify-center bg-stone-100 rounded-xl my-3">
          <img
            :src="generatedImageUrl"
            alt="グランドメニュー画像"
            class="max-h-[60vh] max-w-full rounded shadow-md object-contain"
          />
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <button
            @click="showImageModal = false"
            class="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            閉じる
          </button>
          <button
            @click="downloadGeneratedImage"
            class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-sm font-black shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download class="w-4 h-4" />
            <span>保存する</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { formatPrice } from '../utils/formatters'
import MozuLogo from './MozuLogo.vue'
import { Printer, Image as ImageIcon, Loader2, Download, X, ArrowLeftRight } from '@lucide/vue'
import { toPng } from 'html-to-image'

const props = defineProps({
  menuData: {
    type: Object,
    required: true,
  }
})

const scrollContainer = ref(null)
const printSheetRef = ref(null)
const isGeneratingImage = ref(false)
const generatedImageUrl = ref(null)
const showImageModal = ref(false)

const isLandscape = computed(() => props.menuData.paperOrientation !== 'portrait')
const isB5 = computed(() => props.menuData.paperSize === 'B5')

// アップロードされたロゴ画像（ルートまたはnoticeBlock内）
const currentLogoImage = computed(() => {
  return props.menuData.logoImage || props.menuData.noticeBlock?.logoImage || ''
})

onMounted(() => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollLeft = scrollContainer.value.scrollWidth
    }
  })
})

// 品名の文字数に応じたクラス判定（長い品名でも価格を押し出さない！）
function getItemNameClass(name) {
  const len = name ? name.length : 0
  if (len <= 6) {
    return 'text-[11.5px] sm:text-[13px] tracking-normal'
  } else if (len <= 8) {
    return 'text-[10px] sm:text-[11.5px] tracking-tight'
  } else {
    // 9文字以上（モッツァレラわさび醤油漬け、つくね（月見・チーズ・梅）など）
    return 'text-[9px] sm:text-[10px] tracking-tighter'
  }
}

const yakimonoSection = computed(() => {
  return props.menuData.sections?.find(s => s.id === 'yakimono' || s.name.includes('焼き'))
})

const ippinSection = computed(() => {
  return props.menuData.sections?.find(s => s.id === 'ippin' || s.name.includes('一品'))
})

const toppingSection = computed(() => {
  return props.menuData.sections?.find(s => s.id === 'topping' || s.name.includes('トッピング'))
})

const saladSection = computed(() => {
  return props.menuData.sections?.find(s => s.id === 'salad' || s.name.includes('サラダ'))
})

const gohanSection = computed(() => {
  return props.menuData.sections?.find(s => s.id === 'gohan' || s.name.includes('ご飯'))
})

const fontClass = computed(() => {
  switch (props.menuData.fontFamily) {
    case 'brush':
      return 'font-brush'
    case 'gothic':
      return 'font-gothic'
    case 'mincho':
    default:
      return 'font-mincho'
  }
})

// 用紙の正確な比率（1.414 : 1 または 1 : 1.414）
const sheetDimensionClasses = computed(() => {
  if (isLandscape.value) {
    return isB5.value
      ? 'w-full max-w-[820px] aspect-[1.414/1] min-w-[560px] lg:min-w-0' // B5横 (257x182比率)
      : 'w-full max-w-[940px] aspect-[1.414/1] min-w-[600px] lg:min-w-0' // A4横 (297x210比率 1.414:1)
  } else {
    return isB5.value
      ? 'w-full max-w-[480px] aspect-[1/1.414] min-w-[340px] lg:min-w-0' // B5縦
      : 'w-full max-w-[540px] aspect-[1/1.414] min-w-[360px] lg:min-w-0' // A4縦 (1:1.414比率)
  }
})

const bgToneStyle = computed(() => {
  const color = props.menuData.bgColor || '#e3ebdc'
  const pattern = props.menuData.bgPattern || 'washi'

  let backgroundImage = 'none'
  let backgroundSize = 'auto'

  switch (pattern) {
    case 'cloud':
      backgroundImage = 'radial-gradient(rgba(120, 100, 70, 0.16) 0.8px, transparent 0.8px), radial-gradient(rgba(140, 120, 90, 0.11) 0.6px, transparent 0.6px)'
      backgroundSize = '24px 24px, 16px 16px'
      break
    case 'washi':
      backgroundImage = 'radial-gradient(rgba(80, 100, 70, 0.14) 0.6px, transparent 0.6px)'
      backgroundSize = '16px 16px'
      break
    case 'grid':
      backgroundImage = 'linear-gradient(rgba(100, 120, 90, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 120, 90, 0.08) 1px, transparent 1px)'
      backgroundSize = '32px 32px'
      break
    case 'none':
    default:
      backgroundImage = 'none'
      break
  }

  return {
    backgroundColor: color,
    backgroundImage,
    backgroundSize,
  }
})

const sheetStyle = computed(() => {
  return {
    ...bgToneStyle.value,
    color: props.menuData.textColor || '#1a1f1b',
    boxSizing: 'border-box'
  }
})

function onTextBlur(targetObj, key, event) {
  const text = event.target.innerText.trim()
  targetObj[key] = text
}

function onPriceBlur(item, event) {
  const rawText = event.target.innerText.trim()
  const cleaned = rawText.replace(/円/g, '').trim()
  if (cleaned) {
    item.price = cleaned
  }
}

function onNoticeBlur(index, event) {
  const text = event.target.innerText.trim()
  if (props.menuData.noticeBlock?.lines) {
    props.menuData.noticeBlock.lines[index] = text
  }
}

function triggerPrint() {
  window.print()
}

async function saveAsImage() {
  if (!printSheetRef.value || isGeneratingImage.value) return
  isGeneratingImage.value = true
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready
    }
    await new Promise((resolve) => setTimeout(resolve, 150))
    const dataUrl = await toPng(printSheetRef.value, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
    })
    generatedImageUrl.value = dataUrl
    showImageModal.value = true
  } catch (error) {
    console.error('画像生成に失敗しました:', error)
    alert('画像の生成中にエラーが発生しました。もう一度お試しください。')
  } finally {
    isGeneratingImage.value = false
  }
}

function downloadGeneratedImage() {
  if (!generatedImageUrl.value) return
  const filename = `グランドメニュー_${new Date().toISOString().slice(0, 10)}.png`
  const link = document.createElement('a')
  link.download = filename
  link.href = generatedImageUrl.value
  link.click()
}
</script>

<style scoped>
.editable-field:focus {
  outline: 2px solid #d97706;
  outline-offset: 1px;
}

@media print {
  @page {
    size: auto;
    margin: 4mm;
  }
}
</style>
