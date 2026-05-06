---
title: "VS Code の設定とカスタマイズ"
order: 3
type: lecture
difficulty: beginner
tags: [vscode, settings, fundamentals, concept]
estimatedMinutes: 18
status: draft
---
# VS Code の設定とカスタマイズ

## はじめに

### このレッスンのゴール

VS Code を自分の好みやプロジェクトの規約に合わせて調整する方法を整理します。VS Code の設定は **3 階層構造** になっており、これを理解すると「なぜチームメンバーと同じ環境にできるのか」「個人設定とプロジェクト設定はどこで分かれるのか」が腑に落ちます。

---

## 設定の 3 階層

VS Code の設定は次の優先順位で適用されます（下にあるものほど強い）。

| 階層 | 適用範囲 | 保存場所 |
|------|----------|----------|
| **User（ユーザー）** | 自分の VS Code 全体 | macOS: `~/Library/Application Support/Code/User/settings.json`<br>Windows: `%APPDATA%\Code\User\settings.json` |
| **Workspace（ワークスペース）** | 開いているプロジェクト | プロジェクト内の `.vscode/settings.json` |
| **Folder（フォルダ）** | マルチルートワークスペースの個別フォルダ | 各フォルダの `.vscode/settings.json` |

「自分用のフォントサイズ」は User、「プロジェクトのインデント幅」は Workspace、というように分けて保存できます。

> **Tips**：チーム開発では、共有すべき設定（フォーマッタ、改行コードなど）を `.vscode/settings.json` に書いてリポジトリにコミットし、個人の好み（フォント、カラーテーマ）は User 設定に置く、と分けるのが定石です。

---

## 設定の編集方法

### GUI から編集する（設定 UI）

`Cmd + ,` / `Ctrl + ,` で設定 UI を開きます。検索バーに「font」「format」などのキーワードを入れて目的の設定を探し、チェックボックスや入力欄で値を変更します。

::detail{slug="settings-ui"}

### JSON で直接編集する

設定 UI に表示されない項目や、複雑な値（オブジェクト・配列）を扱うときは `settings.json` を直接編集します。コマンドパレットから `Preferences: Open User Settings (JSON)` を実行すると開きます。

::detail{slug="settings-json"}

---

## カスタマイズのトピック

### カラーテーマ・アイコンテーマ

`Cmd + K, Cmd + T` / `Ctrl + K, Ctrl + T` でカラーテーマ切替。Marketplace から好みのテーマを追加できます。アイコンテーマ（ファイルアイコン）と Product Icon テーマ（VS Code 全体のアイコン）も別途設定可能です。

::detail{slug="themes"}

### キーバインドのカスタマイズ

`Cmd + K, Cmd + S` / `Ctrl + K, Ctrl + S` でキーバインドエディタ。既存ショートカットの変更や、`when` 句を使った文脈依存のキー割り当てができます。`keybindings.json` に直接記述することも可能です。

::detail{slug="keybindings"}

### ワークスペースと .vscode ディレクトリ

`.code-workspace` ファイルと `.vscode/` ディレクトリの中身（`settings.json` / `extensions.json` / `launch.json` / `tasks.json`）の役割。マルチルートワークスペースの使いどころも整理します。

::detail{slug="workspace"}

---

## まとめ

- 設定は **User → Workspace → Folder** の 3 階層、下ほど優先される
- GUI（設定 UI）と JSON 直接編集は同じ設定の異なる入口
- チーム共有設定は `.vscode/settings.json` に、個人の好みは User 設定に
- キーバインド、テーマ、ワークスペースなど、変えると効くポイントは多い
