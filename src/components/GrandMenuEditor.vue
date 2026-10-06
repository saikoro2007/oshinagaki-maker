<template>
  <div class="space-y-5 pb-16">
    <!-- Header Card -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200">
      <div class="flex items-start sm:items-center justify-between gap-2 mb-2">
        <div class="min-w-0 flex-1">
          <span
            class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold mb-1"
            :class="isDrink ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'"
          >
            {{ isDrink ? 'お飲み物メニュー（ドリンク）' : 'グランドメニュー（定番・全品一覧）' }}
          </span>
          <h2 class="text-base sm:text-lg font-bold text-stone-900 truncate">
            {{ isDrink ? 'お飲み物メニュー編集' : '定番メニュー編集' }}
          </h2>
        </div>

        <button
          type="button"
          @click="$emit('reset-mozu-default')"
          class="shrink-0 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
          :title="isDrink ? 'お飲み物メニューの初期データに戻す' : '定番メニューの初期データに戻す'"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">初期データに戻す</span>
          <span class="sm:hidden">初期化</span>
        </button>
      </div>

      <p class="text-xs text-stone-500 leading-relaxed">
        カテゴリの追加・並び替え・削除や、各品の品名・価格を編集できます。変更は自動保存されます。
      </p>
    </div>

    <!-- Paper Format & Orientation Settings -->
    <PaperFormatSection :menu-data="menuData" />

    <!-- Layout & Spacing Settings (カテゴリ間隔・自動均等整列・文字サイズ一括調整) -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-3">
      <h3 class="font-bold text-sm text-stone-900 flex items-center justify-between">
        <span>配置バランス・文字サイズ</span>
        <span class="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
          用紙に合わせて一括自動調整
        </span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <!-- Section Spacing / Alignment -->
        <div>
          <label class="block text-stone-600 mb-1.5 font-medium flex items-center justify-between">
            <span>カテゴリ間の隙間・整列</span>
          </label>
          <div class="grid grid-cols-4 gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              @click="menuData.sectionSpacing = 'spacious'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                (!menuData.sectionSpacing || menuData.sectionSpacing === 'spacious')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
              title="広めのゆったり配置（おすすめ・標準）"
            >
              広め (標準)
            </button>
            <button
              type="button"
              @click="menuData.sectionSpacing = 'auto'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.sectionSpacing === 'auto'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
              title="用紙の幅に合わせて自動で均等に広げます"
            >
              自動均等
            </button>
            <button
              type="button"
              @click="menuData.sectionSpacing = 'normal'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.sectionSpacing === 'normal'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              普通
            </button>
            <button
              type="button"
              @click="menuData.sectionSpacing = 'compact'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.sectionSpacing === 'compact'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              狭め
            </button>
          </div>
        </div>

        <!-- Item Font Size Scaling -->
        <div>
          <label class="block text-stone-600 mb-1.5 font-medium flex items-center justify-between">
            <span>文字サイズ（全体の文字スケール）</span>
          </label>
          <div class="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              @click="menuData.itemFontSize = 'large'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                (!menuData.itemFontSize || menuData.itemFontSize === 'large')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              大（ゆったり標準）
            </button>
            <button
              type="button"
              @click="menuData.itemFontSize = 'normal'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.itemFontSize === 'normal'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              中（標準）
            </button>
            <button
              type="button"
              @click="menuData.itemFontSize = 'small'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.itemFontSize === 'small'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              小（すっきり）
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Design & Paper Appearance Settings (書体フォント・背景色・和紙風合い・価格表記・中黒) -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
      <h3 class="font-bold text-sm text-stone-900 flex items-center justify-between">
        <span>デザイン・和紙設定</span>
        <span class="text-[11px] text-stone-400 font-normal">フォント・和紙・色合い</span>
      </h3>

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
              明朝体
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

        <!-- Price Format (漢数字 / 数字表記) -->
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
              漢数字 (五〇〇円)
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
              算用数字 (500円)
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <!-- Paper Color -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-stone-600 font-medium">背景色（和紙の色）</label>
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
          <div class="grid grid-cols-2 gap-1.5 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              @click="menuData.bgColor = '#e3ebdc'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs flex items-center justify-center gap-1.5',
                (!menuData.bgColor || menuData.bgColor === '#e3ebdc')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
              title="実物メニューの若草色"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-[#e3ebdc] border border-stone-300 shrink-0"></span>
              <span>若草色 {{ !isDrink ? '(定番)' : '' }}</span>
            </button>
            <button
              type="button"
              @click="menuData.bgColor = '#ffffff'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-xs flex items-center justify-center gap-1.5',
                menuData.bgColor === '#ffffff'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              <span class="w-2.5 h-2.5 rounded-full bg-white border border-stone-300 shrink-0"></span>
              <span>純白 {{ isDrink ? '(定番)' : '' }}</span>
            </button>
          </div>
        </div>

        <!-- Paper Texture (風合い) -->
        <div>
          <label class="block text-stone-600 mb-1.5 font-medium">和紙の風合い（テクスチャ）</label>
          <div class="grid grid-cols-4 gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              @click="menuData.bgPattern = 'none'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                (!menuData.bgPattern || menuData.bgPattern === 'none')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              なし
            </button>
            <button
              type="button"
              @click="menuData.bgPattern = 'washi'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.bgPattern === 'washi'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              和紙調
            </button>
            <button
              type="button"
              @click="menuData.bgPattern = 'cloud'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.bgPattern === 'cloud'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              雲竜
            </button>
            <button
              type="button"
              @click="menuData.bgPattern = 'grid'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.bgPattern === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              方眼
            </button>
          </div>
        </div>
      </div>

      <!-- Dot Prefix toggle -->
      <div class="pt-2 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span class="text-xs text-stone-700 font-medium block">品名の頭に中黒「・」をつける</span>
          <span class="text-[11px] text-stone-400">実物メニューのような縦書きの箇条書き表現</span>
        </div>
        <input
          type="checkbox"
          v-model="menuData.showDotPrefix"
          class="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
        />
      </div>
    </div>

    <!-- Category Sections Accordions (汎用追加・削除・並び替え・全カテゴリ一括価格対応) -->
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
          <span>メニューカテゴリ一覧</span>
          <span class="text-xs text-stone-500 font-normal">({{ menuData.sections?.length || 0 }}カテゴリ)</span>
        </h3>
        
        <button
          type="button"
          @click="addNewCategory"
          class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>カテゴリを追加</span>
        </button>
      </div>

      <!-- Categories List -->
      <div
        v-for="(section, sIdx) in menuData.sections"
        :key="section.id || sIdx"
        class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden transition-all"
      >
        <!-- Category Header -->
        <div class="w-full px-3.5 py-3 flex items-center justify-between bg-stone-50/80 border-b border-stone-100 gap-2">
          <!-- Checkbox: メニューに表示する -->
          <label
            @click.stop
            class="flex items-center gap-1.5 cursor-pointer select-none p-1 rounded hover:bg-stone-200/60 transition shrink-0"
            title="メニューに表示 / 非表示を切り替え"
          >
            <input
              type="checkbox"
              :checked="section.visible !== false"
              @change="toggleSectionVisible(section, $event)"
              class="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span class="text-xs text-stone-600 font-bold hidden sm:inline">表示</span>
          </label>

          <!-- Left: Title & Status -->
          <div
            @click="toggleSection(section.id)"
            :class="[
              'flex-1 flex items-center gap-2 cursor-pointer select-none overflow-hidden transition-opacity',
              section.visible === false ? 'opacity-50' : 'opacity-100'
            ]"
          >
            <span class="w-2 h-4 rounded-full shrink-0" :class="section.visible === false ? 'bg-stone-300' : 'bg-emerald-600'"></span>
            <span class="font-bold text-stone-900 text-sm truncate">
              {{ section.name || '（名称未設定）' }}
            </span>
            <span v-if="section.visible === false" class="text-[10px] px-1.5 py-0.5 bg-stone-200 text-stone-600 rounded font-bold shrink-0">
              非表示
            </span>
            <span class="text-[11px] px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full font-medium shrink-0">
              {{ section.items?.length || 0 }}品
            </span>
            <span v-if="section.subtitle" class="text-xs text-stone-500 truncate hidden sm:inline">
              ({{ section.subtitle }})
            </span>
            <span v-if="section.placement" class="text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0" :class="section.placement === 'top' ? 'bg-sky-100 text-sky-800' : 'bg-orange-100 text-orange-800'">
              {{ section.placement === 'top' ? '上段' : '下段' }}
            </span>
            <span v-if="section.uniformPrice" class="text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
              各{{ section.uniformPrice }}円
            </span>
          </div>

          <!-- Right: Category Order & Delete Controls -->
          <div class="flex items-center gap-1.5 shrink-0 pl-1">
            <!-- Move Category Up (矢印アイコン ArrowUp で開閉と明確に区別) -->
            <button
              type="button"
              @click="moveSection(sIdx, -1)"
              :disabled="sIdx === 0"
              class="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 active:scale-95 disabled:opacity-20 transition rounded-lg"
              title="カテゴリを前へ"
            >
              <ArrowUp class="w-4 h-4" />
            </button>
            <!-- Move Category Down (矢印アイコン ArrowDown で開閉と明確に区別) -->
            <button
              type="button"
              @click="moveSection(sIdx, 1)"
              :disabled="sIdx === menuData.sections.length - 1"
              class="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 active:scale-95 disabled:opacity-20 transition rounded-lg"
              title="カテゴリを次へ"
            >
              <ArrowDown class="w-4 h-4" />
            </button>
            <!-- Delete Category -->
            <button
              type="button"
              @click="removeCategory(sIdx)"
              class="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition rounded-lg ml-0.5"
              title="カテゴリを削除"
            >
              <Trash2 class="w-4 h-4" />
            </button>
            <!-- Accordion Toggle Chevron (独立した専用開閉ボタン) -->
            <button
              type="button"
              @click="toggleSection(section.id)"
              class="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-200/80 active:scale-95 transition rounded-lg ml-1 bg-stone-100 border border-stone-200/60"
              title="詳細を開閉"
            >
              <component
                :is="isSectionOpen(section.id) ? ChevronUp : ChevronDown"
                class="w-4 h-4"
              />
            </button>
          </div>
        </div>

        <!-- Category Content (Collapsible) -->
        <div v-if="isSectionOpen(section.id)" class="p-3.5 sm:p-4 space-y-3.5">
          
          <!-- Category Settings (Name, Subtitle, Uniform Price for ALL categories) -->
          <div class="bg-stone-50 p-3 rounded-xl border border-stone-200/70 space-y-2.5 text-xs">
            <!-- 表示チェックボックス -->
            <div class="flex items-center justify-between pb-2 border-b border-stone-200/60">
              <label class="flex items-center gap-2 cursor-pointer text-stone-800 font-bold select-none">
                <input
                  type="checkbox"
                  :checked="section.visible !== false"
                  @change="toggleSectionVisible(section, $event)"
                  class="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>メニューにこのカテゴリを表示する</span>
              </label>
              <span class="text-[11px] text-stone-400">チェックを外すと印刷・プレビューから非表示になります</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label class="block text-stone-600 font-medium mb-1">カテゴリ名</label>
                <input
                  v-model="section.name"
                  type="text"
                  placeholder="例: 焼き物、お飲み物、一品など"
                  class="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label class="block text-stone-600 font-medium mb-1">サブ注記（任意）</label>
                <input
                  v-model="section.subtitle"
                  type="text"
                  placeholder="例: 一本 塩・タレ、グラス・ボトルなど"
                  class="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label class="block text-stone-600 font-medium mb-1">配置段（横置き時）</label>
                <select
                  v-model="section.placement"
                  class="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="top">上段に配置</option>
                  <option value="bottom">下段に配置</option>
                  <option value="">自動分割</option>
                </select>
              </div>
            </div>

            <!-- Uniform Price Setting (Available for ALL categories!) -->
            <div class="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2">
              <label class="flex items-center gap-1.5 cursor-pointer text-stone-700 font-medium">
                <input
                  type="checkbox"
                  :checked="Boolean(section.uniformPrice)"
                  @change="toggleUniformPrice(section, $event)"
                  class="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span>このカテゴリを一括価格にする（例: 各〇〇円）</span>
              </label>

              <div v-if="section.uniformPrice !== undefined && section.uniformPrice !== ''" class="flex items-center gap-1">
                <span class="text-stone-500 font-medium">各</span>
                <input
                  v-model="section.uniformPrice"
                  type="text"
                  inputmode="numeric"
                  placeholder="50"
                  class="w-20 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-right focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <span class="text-stone-600">円</span>
              </div>
            </div>
          </div>

          <!-- Items List inside Category -->
          <div class="space-y-2">
            <div
              v-for="(item, idx) in section.items"
              :key="item.id || idx"
              class="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 hover:border-amber-300 transition"
            >
              <!-- Index / Number -->
              <span class="text-[11px] font-mono font-bold text-stone-400 w-4 text-center shrink-0">
                {{ idx + 1 }}
              </span>

              <!-- Item Name Input -->
              <div class="flex-1 min-w-0">
                <input
                  v-model="item.name"
                  type="text"
                  placeholder="品名"
                  class="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <!-- Price Input (Hidden if category has uniform price) -->
              <div v-if="!section.uniformPrice" class="w-20 sm:w-24 shrink-0 flex items-center gap-1">
                <input
                  v-model="item.price"
                  type="text"
                  inputmode="numeric"
                  placeholder="価格"
                  class="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm font-mono font-bold text-right text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <span class="text-xs text-stone-500 shrink-0">円</span>
              </div>

              <!-- Actions (Reorder & Delete) -->
              <div class="flex items-center gap-1 shrink-0">
                <!-- 品目の上下移動ボタン: 矢印アイコン ArrowUp / ArrowDown -->
                <button
                  type="button"
                  @click="moveItem(section, idx, -1)"
                  :disabled="idx === 0"
                  class="p-1.5 text-stone-400 hover:text-stone-800 disabled:opacity-20 hover:bg-stone-100 rounded transition"
                  title="前へ"
                >
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="moveItem(section, idx, 1)"
                  :disabled="idx === section.items.length - 1"
                  class="p-1.5 text-stone-400 hover:text-stone-800 disabled:opacity-20 hover:bg-stone-100 rounded transition"
                  title="次へ"
                >
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="removeItem(section, idx)"
                  class="p-1.5 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="削除"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Add Item Button -->
          <button
            type="button"
            @click="addItem(section)"
            class="w-full py-2 bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5 text-emerald-600" />
            <span>「{{ section.name || 'このカテゴリ' }}」に品目を追加</span>
          </button>
        </div>
      </div>

      <!-- Add New Category Bottom Button -->
      <button
        type="button"
        @click="addNewCategory"
        class="w-full py-3 bg-white hover:bg-emerald-50 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl text-xs sm:text-sm font-bold text-emerald-800 flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
      >
        <Plus class="w-4 h-4 text-emerald-600" />
        <span>新しいカテゴリを追加する</span>
      </button>
    </div>

    <!-- Store Rules & Notice Block Settings (はみ出し防止 & すっきりレイアウト) -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-3.5 overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-stone-100">
        <h3 class="font-bold text-sm text-stone-900">
          店舗案内・営業ルール
        </h3>
        <label class="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            v-model="menuData.noticeBlock.show"
            class="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          <span>メニューに表示する</span>
        </label>
      </div>

      <div v-if="menuData.noticeBlock.show" class="space-y-3">
        <!-- Lines list (自由に追加・削除・並び替え可能) -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-medium text-stone-500">案内文（縦書きで表示、自由に追加可能）</label>
            <span class="text-[11px] text-stone-400">現在 {{ menuData.noticeBlock.lines?.length || 0 }}行</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="(line, lIdx) in menuData.noticeBlock.lines"
              :key="lIdx"
              class="flex items-center gap-2 min-w-0 bg-stone-50/70 p-1.5 rounded-xl border border-stone-200/80"
            >
              <span class="text-xs text-stone-400 font-mono w-4 text-center shrink-0">{{ lIdx + 1 }}</span>
              <input
                v-model="menuData.noticeBlock.lines[lIdx]"
                type="text"
                placeholder="案内文を入力"
                class="flex-1 min-w-0 px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
              
              <!-- 並び替え・削除ボタン -->
              <div class="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  @click="moveNoticeLine(lIdx, -1)"
                  :disabled="lIdx === 0"
                  class="p-1.5 text-stone-400 hover:text-stone-800 disabled:opacity-20 hover:bg-stone-200/60 rounded transition"
                  title="行を前へ"
                >
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="moveNoticeLine(lIdx, 1)"
                  :disabled="lIdx === (menuData.noticeBlock.lines?.length || 1) - 1"
                  class="p-1.5 text-stone-400 hover:text-stone-800 disabled:opacity-20 hover:bg-stone-200/60 rounded transition"
                  title="行を次へ"
                >
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="removeNoticeLine(lIdx)"
                  class="p-1.5 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="この行を削除"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Add Line Button -->
          <button
            type="button"
            @click="addNoticeLine"
            class="w-full py-2 bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5 text-amber-600" />
            <span>案内文の行を追加する</span>
          </button>
        </div>

        <!-- 店舗ロゴ画像設定（デフォルト印字なし、ユーザー画像登録のみ） -->
        <div class="pt-3 border-t border-stone-100">
          <label class="block text-stone-700 font-bold text-xs mb-2">店舗ロゴ画像</label>
          <div class="flex items-center gap-3">
            <!-- プレビュー枠 -->
            <div class="w-14 h-14 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden shrink-0">
              <img
                v-if="currentLogoImage"
                :src="currentLogoImage"
                alt="店舗ロゴ"
                class="w-full h-full object-contain p-1"
              />
              <span v-else class="text-[10px] text-stone-400 text-center px-1">
                未設定
              </span>
            </div>

            <!-- アップロード・削除ボタン -->
            <div class="flex-1 min-w-0 flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref="logoFileInput"
                accept="image/*"
                class="hidden"
                @change="handleLogoUpload"
              />
              <button
                type="button"
                @click="triggerLogoUpload"
                class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Upload class="w-3.5 h-3.5" />
                <span>{{ currentLogoImage ? '画像を変更' : 'ロゴ画像を登録' }}</span>
              </button>

              <button
                v-if="currentLogoImage"
                type="button"
                @click="removeLogoImage"
                class="px-2.5 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 font-medium rounded-lg text-xs transition cursor-pointer"
              >
                削除
              </button>
            </div>
          </div>

          <!-- ロゴの詳細カスタマイズ（大きさ・上下位置・間隔） -->
          <div v-if="currentLogoImage" class="mt-3 pt-3 border-t border-stone-200/60 space-y-3 bg-stone-50/70 p-3 rounded-xl">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <!-- ロゴの大きさ -->
              <div class="space-y-1.5">
                <label class="block text-stone-600 font-medium flex items-center justify-between">
                  <span>ロゴの大きさ</span>
                  <span class="font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">{{ menuData.logoSize || 140 }}px</span>
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-stone-400">40px</span>
                  <input
                    type="range"
                    min="40"
                    max="280"
                    step="4"
                    :value="menuData.logoSize || 140"
                    @input="menuData.logoSize = Number($event.target.value)"
                    class="w-full accent-amber-600 cursor-pointer"
                  />
                  <span class="text-[10px] text-stone-400">280px</span>
                </div>
                <!-- ワンタッチサイズ選択 -->
                <div class="grid grid-cols-4 gap-1 pt-0.5">
                  <button
                    type="button"
                    @click="menuData.logoSize = 90"
                    class="py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-medium transition cursor-pointer"
                  >
                    小 (90px)
                  </button>
                  <button
                    type="button"
                    @click="menuData.logoSize = 140"
                    class="py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-bold transition cursor-pointer"
                  >
                    標準 (140px)
                  </button>
                  <button
                    type="button"
                    @click="menuData.logoSize = 190"
                    class="py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-medium transition cursor-pointer"
                  >
                    特大 (190px)
                  </button>
                  <button
                    type="button"
                    @click="menuData.logoSize = 240"
                    class="py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-medium transition cursor-pointer"
                  >
                    最大 (240px)
                  </button>
                </div>
              </div>

              <!-- 上下の位置 -->
              <div>
                <label class="block text-stone-600 font-medium mb-1">ロゴの配置位置</label>
                <div class="grid grid-cols-3 gap-1 bg-stone-200/60 p-1 rounded-lg">
                  <button
                    type="button"
                    @click="menuData.logoPosition = 'bottom-left'"
                    :class="[
                      'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                      (!menuData.logoPosition || menuData.logoPosition === 'bottom-left' || menuData.logoPosition === 'bottom')
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    ]"
                  >
                    左下 (推奨)
                  </button>
                  <button
                    type="button"
                    @click="menuData.logoPosition = 'center'"
                    :class="[
                      'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                      menuData.logoPosition === 'center'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    ]"
                  >
                    中央
                  </button>
                  <button
                    type="button"
                    @click="menuData.logoPosition = 'top'"
                    :class="[
                      'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                      menuData.logoPosition === 'top'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    ]"
                  >
                    上寄せ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PaperFormatSection from './PaperFormatSection.vue'
import {
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  Upload
} from '@lucide/vue'
import { compressImageFile } from '../utils/imageCompressor'

const props = defineProps({
  menuData: {
    type: Object,
    required: true,
  }
})

defineEmits(['reset-mozu-default'])

const logoFileInput = ref(null)

const isDrink = computed(() => {
  return props.menuData.menuType === 'drink' || (props.menuData.title && props.menuData.title.includes('飲み物'))
})

const currentLogoImage = computed(() => {
  return props.menuData.logoImage || props.menuData.noticeBlock?.logoImage || ''
})

function triggerLogoUpload() {
  if (logoFileInput.value) {
    logoFileInput.value.click()
  }
}

async function handleLogoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const compressedBase64 = await compressImageFile(file, 400, 0.85)
    props.menuData.logoImage = compressedBase64
    if (props.menuData.noticeBlock) {
      props.menuData.noticeBlock.logoImage = compressedBase64
    }
  } catch (err) {
    console.error('ロゴ画像の圧縮に失敗しました:', err)
    alert('画像の読み込みに失敗しました。別の画像をお試しください。')
  } finally {
    event.target.value = ''
  }
}

function removeLogoImage() {
  props.menuData.logoImage = ''
  if (props.menuData.noticeBlock) {
    props.menuData.noticeBlock.logoImage = ''
  }
}

// 最初に開いておくカテゴリ（初期値は先頭2つ）
const openSections = ref(props.menuData.sections?.slice(0, 2).map(s => s.id) || [])

function isSectionOpen(id) {
  return openSections.value.includes(id)
}

function toggleSection(id) {
  const index = openSections.value.indexOf(id)
  if (index >= 0) {
    openSections.value.splice(index, 1)
  } else {
    openSections.value.push(id)
  }
}

// カテゴリ全体の並び替え
function moveSection(index, direction) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= props.menuData.sections.length) return
  const sec = props.menuData.sections.splice(index, 1)[0]
  props.menuData.sections.splice(targetIndex, 0, sec)
}

// カテゴリ削除
function removeCategory(index) {
  const sec = props.menuData.sections[index]
  const name = sec.name || 'このカテゴリ'
  if (confirm(`「${name}」を削除してもよろしいですか？（含まれる品目もすべて削除されます）`)) {
    props.menuData.sections.splice(index, 1)
  }
}

function toggleSectionVisible(section, event) {
  section.visible = event.target.checked
}

// 案内文の行操作
function addNoticeLine() {
  if (!props.menuData.noticeBlock) {
    props.menuData.noticeBlock = { show: true, lines: [] }
  }
  if (!props.menuData.noticeBlock.lines) {
    props.menuData.noticeBlock.lines = []
  }
  props.menuData.noticeBlock.lines.push('')
}

function removeNoticeLine(index) {
  props.menuData.noticeBlock.lines.splice(index, 1)
}

function moveNoticeLine(index, direction) {
  const target = index + direction
  const lines = props.menuData.noticeBlock.lines
  if (!lines || target < 0 || target >= lines.length) return
  const line = lines.splice(index, 1)[0]
  lines.splice(target, 0, line)
}

// 新規カテゴリ追加（常に一番最後・下段末尾に追加）
function addNewCategory() {
  if (!props.menuData.sections) {
    props.menuData.sections = []
  }
  const newId = 'sec_' + Date.now().toString(36)
  props.menuData.sections.push({
    id: newId,
    name: '新しいカテゴリ',
    subtitle: '',
    placement: 'bottom', // 既に2段表示の際も常に一番最後（下段の末尾）に追加
    visible: true,
    uniformPrice: '',
    items: [
      { id: Date.now().toString() + '_1', name: 'おすすめ品目', price: '300' }
    ]
  })
  if (!openSections.value.includes(newId)) {
    openSections.value.push(newId)
  }
}

// 一括価格トグル
function toggleUniformPrice(section, event) {
  if (event.target.checked) {
    section.uniformPrice = section.uniformPrice || '50'
  } else {
    // 一括価格をオフにした時、中身のアイテムの金額が空なら一括価格をデフォルト値として代入
    const previousPrice = section.uniformPrice ? String(section.uniformPrice).trim() : ''
    if (previousPrice && section.items && section.items.length > 0) {
      section.items.forEach(item => {
        if (!item.price || String(item.price).trim() === '') {
          item.price = previousPrice
        }
      })
    }
    section.uniformPrice = ''
  }
}

// 品目操作
function addItem(section) {
  if (!section.items) section.items = []
  section.items.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
    name: '',
    price: '',
    note: ''
  })
}

function removeItem(section, index) {
  section.items.splice(index, 1)
}

function moveItem(section, index, direction) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= section.items.length) return
  const item = section.items.splice(index, 1)[0]
  section.items.splice(targetIndex, 0, item)
}
</script>
