<template>
  <div class="space-y-5 pb-16">
    <!-- Header Card -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200">
      <div class="flex items-center justify-between mb-2">
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-1">
            グランドメニュー（定番・全品一覧）
          </span>
          <h2 class="text-base sm:text-lg font-bold text-stone-900">
            定番メニュー編集
          </h2>
        </div>

        <button
          type="button"
          @click="$emit('reset-mozu-default')"
          class="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
          title="店舗メニューの初期状態に戻す"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>初期データに戻す</span>
        </button>
      </div>

      <p class="text-xs text-stone-500 leading-relaxed">
        カテゴリの追加・並び替え・削除や、各品の品名・価格を編集できます。変更は自動保存されます。
      </p>
    </div>

    <!-- Paper Format & Orientation Settings -->
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
              @click="menuData.sectionSpacing = 'auto'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                (!menuData.sectionSpacing || menuData.sectionSpacing === 'auto')
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
              標準
            </button>
            <button
              type="button"
              @click="menuData.sectionSpacing = 'spacious'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.sectionSpacing === 'spacious'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              広め
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
            <button
              type="button"
              @click="menuData.itemFontSize = 'normal'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                (!menuData.itemFontSize || menuData.itemFontSize === 'normal')
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              中（標準）
            </button>
            <button
              type="button"
              @click="menuData.itemFontSize = 'large'"
              :class="[
                'py-1.5 rounded-lg font-bold text-center transition cursor-pointer text-[11px]',
                menuData.itemFontSize === 'large'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              ]"
            >
              大（ゆったり）
            </button>
          </div>
        </div>
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
              <div>
                <label class="block text-stone-600 font-medium mb-1 flex items-center justify-between">
                  <span>ロゴの大きさ</span>
                  <span class="font-mono text-stone-500 font-bold">{{ menuData.logoSize || 64 }}px</span>
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-stone-400">小</span>
                  <input
                    type="range"
                    min="36"
                    max="120"
                    step="4"
                    :value="menuData.logoSize || 64"
                    @input="menuData.logoSize = Number($event.target.value)"
                    class="w-full accent-amber-600 cursor-pointer"
                  />
                  <span class="text-[10px] text-stone-400">大</span>
                </div>
              </div>

              <!-- 上下の位置 -->
              <div>
                <label class="block text-stone-600 font-medium mb-1">上下の配置</label>
                <div class="grid grid-cols-3 gap-1 bg-stone-200/60 p-1 rounded-lg">
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
                  <button
                    type="button"
                    @click="menuData.logoPosition = 'center'"
                    :class="[
                      'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                      (!menuData.logoPosition || menuData.logoPosition === 'center')
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    ]"
                  >
                    中央
                  </button>
                  <button
                    type="button"
                    @click="menuData.logoPosition = 'bottom'"
                    :class="[
                      'py-1 rounded font-bold text-center transition cursor-pointer text-[11px]',
                      menuData.logoPosition === 'bottom'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    ]"
                  >
                    下寄せ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Design & Paper Appearance Settings -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
      <h3 class="font-bold text-sm text-stone-900">
        デザイン・和紙設定
      </h3>

      <div class="grid grid-cols-2 gap-3 text-xs">
        <!-- Paper Color -->
        <div>
          <label class="block text-stone-500 mb-1 font-medium">背景色（和紙の色）</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              v-model="menuData.bgColor"
              class="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
            />
            <div class="flex gap-1">
              <button
                type="button"
                @click="menuData.bgColor = '#e3ebdc'"
                class="px-2 py-1 bg-[#e3ebdc] text-stone-800 border border-stone-300 rounded text-[10px] font-bold"
                title="写真の実物カラー（若草色）"
              >
                若草色
              </button>
              <button
                type="button"
                @click="menuData.bgColor = '#ffffff'"
                class="px-2 py-1 bg-white text-stone-800 border border-stone-300 rounded text-[10px]"
              >
                白
              </button>
            </div>
          </div>
        </div>

        <!-- Font Family -->
        <div>
          <label class="block text-stone-500 mb-1 font-medium">書体</label>
          <select
            v-model="menuData.fontFamily"
            class="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="brush">毛筆体（推奨・実物同様）</option>
            <option value="mincho">明朝体</option>
            <option value="gothic">ゴシック体</option>
          </select>
        </div>
      </div>

      <!-- Dot Prefix toggle -->
      <div class="pt-2 border-t border-stone-100 flex items-center justify-between">
        <span class="text-xs text-stone-700">品名の頭に中黒「・」をつける</span>
        <input
          type="checkbox"
          v-model="menuData.showDotPrefix"
          class="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
