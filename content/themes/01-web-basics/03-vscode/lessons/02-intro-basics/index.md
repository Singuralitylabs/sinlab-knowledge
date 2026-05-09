---
title: "VS Code の基本操作"
order: 2
type: lecture
difficulty: beginner
tags: [vscode, fundamentals, concept]
estimatedMinutes: 18
status: published
---
# VS Code の基本操作

## はじめに

### このレッスンのゴール

VS Code を「コードを書く道具」として日常的に使いこなすための、もっとも頻度の高い操作を整理します。ファイル操作・検索 / 置換・マルチカーソル・統合ターミナル・拡張機能の 5 トピックを扱います。

> **前提**：本レッスンでは `画面構成` レッスンで紹介した領域名（エクスプローラー、ターミナルなど）を前提知識として使います。先にそちらに目を通しておくとスムーズです。

---

## トピック一覧

### 1. ファイルとフォルダの操作

ワークスペース / フォルダを開く方法、新規ファイル作成、リネーム、削除、複数選択といった基本操作。`Cmd + P` / `Ctrl + P` のクイックオープンで、ファイル名を数文字打つだけで目的のファイルにジャンプできます。

::detail{slug="files"}

### 2. 検索と置換

エディタ内検索（`Cmd + F` / `Ctrl + F`）とワークスペース全体検索（`Cmd + Shift + F` / `Ctrl + Shift + F`）の使い分け、正規表現・大文字小文字・単語一致のトグル、検索対象を絞る `files to include` / `files to exclude`。

::detail{slug="search-replace"}

### 3. マルチカーソル

VS Code の生産性を象徴する機能のひとつ。複数箇所に同時にカーソルを置き、同じ編集を一度に行えます。`Cmd/Ctrl + D` で次の同一語を追加、`Cmd/Ctrl + Shift + L` で全一致を一気に選択するのが特に強力です。

::detail{slug="multi-cursor"}

### 4. 統合ターミナル

`` Ctrl + ` ``（バッククォート）で開く統合ターミナルは、シェルとして bash / zsh / PowerShell などを切り替えられ、複数ターミナルを並べたり分割したりも自由です。テストやビルド、Git 操作の起点になります。

::detail{slug="terminal"}

### 5. 拡張機能（Extensions）

VS Code の真価は **Marketplace の拡張機能** で発揮されます。言語サーバ、Linter、フォーマッタ、Git 補助、AI 補完など、用途別のおすすめと、ワークスペース推奨拡張（`.vscode/extensions.json`）の仕組みを紹介します。

::detail{slug="extensions"}

---

## まとめ

- 各操作はキーボードショートカットを覚えると一気に速くなる（詳しくは `ショートカット` カテゴリで）
- 拡張機能は入れすぎると重くなるため、目的に応じて選別する
