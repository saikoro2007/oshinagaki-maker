# AGENTS.md

「お品書きメーカー (Oshinagaki Maker)」開発における AI エージェント向け共通指示書。
Antigravity (Gemini)、Claude (Claude Code / Cursor / Cline) 等のすべてのエージェントに適用される。

---

## 1. プロダクト概要

- **プロダクト名**: お品書きメーカー (Oshinagaki Maker)
- **概要**: 飲食店（和食、居酒屋、焼き鳥、そば・うどん等）の店主やスタッフが、**PCを使わずスマートフォンから手軽に美しい縦書きメニューを作成し、A4/B5用紙へ直接印刷・PDF保存できるWebツール**。
- **リポジトリ**: `saikoro2007/oshinagaki-maker`
- **公開先 (GitHub Pages)**: `https://saikoro2007.github.io/oshinagaki-maker/`
- **誕生背景 (First Test Case)**:
  - 北海道帯広市の焼き鳥店「やきとりもず」を経営する弟様が、厨房にノートPC（Office）を持ち込むのが不便だったことから着想。
  - 実店舗の現場における「スマホ片手にすぐ作って、すぐ印刷したい」という強いニーズを解決するための汎用Webプロダクト。

---

## 2. アーキテクチャと設計方針

1. **完全クライアントサイド SPA (Vue 3 + Vite + Tailwind CSS)**:
   - サーバーレス、DBレス。データはブラウザの `localStorage` に保持。
   - バックアップや端末間のデータ移行用に JSON エクスポート/インポートに対応。
2. **本格的な縦書き組版**:
   - `writing-mode: vertical-rl` による右から左へ流れる和風レイアウト。
   - 縦中横（`text-combine-upright: all`）による数字・英字の配置。
   - Google Fonts による毛筆風（Yuji Boku）・伝統明朝（Shippori Mincho）・和風ゴシック対応。
3. **スマホ印刷最適化 (`@media print`)**:
   - 印刷ダイアログ呼出時、ヘッダー・タブ・入力フォーム等のWeb UIは自動非表示。
   - A4/B5用紙にフィットしたメニュー紙面のみが出力される。
4. **汎用性とプライバシー**:
   - リポジトリやコードには特定店舗の機密情報やハードコードを含めない。
   - 店名・メニュー項目・価格はすべて各ユーザーのブラウザに安全に保存される。

---

## 3. 開発・テストコマンド

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド検証
npm run build
```
