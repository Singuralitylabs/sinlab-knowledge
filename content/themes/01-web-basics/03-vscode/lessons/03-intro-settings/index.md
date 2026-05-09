---
title: "VS Code の設定とカスタマイズ"
order: 3
type: lecture
difficulty: beginner
tags: [vscode, settings, fundamentals, concept]
estimatedMinutes: 18
status: published
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

## トピック一覧

### 1. 設定の編集方法

設定 UI（`Cmd/Ctrl + ,`）と `settings.json` を直接編集する 2 通りの入口、その使い分け。JSONC 構文・言語別オーバーライド・よく使う設定例を整理します。

::detail{slug="settings"}

### 2. テーマとキーバインドのカスタマイズ

カラーテーマ / アイコンテーマ / Product Icon テーマの違いと切替、OS のライト / ダーク追従、キーバインドの調べ方（Recording Keys）と `keybindings.json` の基本。

::detail{slug="customization"}

### 3. ワークスペースと .vscode ディレクトリ

`.code-workspace` ファイルとマルチルートワークスペース、`.vscode/` 配下の `settings.json` / `extensions.json` / `launch.json` / `tasks.json` の役割分担。

::detail{slug="workspace"}

---

## まとめ

- 設定は **User → Workspace → Folder** の 3 階層、下ほど優先される
- GUI（設定 UI）と JSON 直接編集は同じ設定の異なる入口
- チーム共有設定は `.vscode/settings.json` に、個人の好みは User 設定に
