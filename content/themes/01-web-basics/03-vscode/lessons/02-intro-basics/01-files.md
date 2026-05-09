---
title: "ファイルとフォルダの操作"
order: 1
type: detail
difficulty: beginner
tags: [vscode, reference]
estimatedMinutes: 6
status: published
---
# ファイルとフォルダの操作

## 解説

VS Code は **フォルダ単位で開く** ことが基本です。`File › Open Folder...` でプロジェクトのルートを開くと、エクスプローラーにツリーが表示され、ターミナル・検索・Git などすべての機能がそのフォルダを起点に動きます（macOS では `File › Open...` でもファイル / フォルダのどちらも選択できます）。

単一フォルダで足りない場合は **マルチルートワークスペース** を使い、`*.code-workspace` ファイルに複数のフォルダ参照と共通設定を保存します。

---

## ファイルを開く / 切り替える

### クイックオープン

`Cmd + P` / `Ctrl + P` を押し、ファイル名の一部を打つと候補がインクリメンタル絞り込みされます。サイドバーを開かずにファイル間を行き来できる、最頻出の操作です。

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| クイックオープン | `Cmd + P` | `Ctrl + P` |
| 直近のファイル一覧 | クイックオープンを開いた直後に表示 | 同左 |
| プレビューでなく通常タブで開く | 候補で `→` を押す（または Enter 後にダブルクリック） | 同左 |

### エクスプローラーからの操作

| 操作 | やり方 |
|------|--------|
| 新規ファイル / フォルダ作成 | エクスプローラー上部の `+` アイコン、または右クリック › `New File` / `New Folder` |
| リネーム | ファイルを選択して `F2` |
| 削除（ゴミ箱へ移動） | `Delete`（macOS は `Cmd + Backspace`） |
| 複数選択 | `Cmd/Ctrl + クリック`、連続範囲は `Shift + クリック` |
| Finder / エクスプローラーで開く | 右クリック › `Reveal in Finder` / `Reveal in File Explorer` |

> **削除は完全削除ではない**：既定では OS のゴミ箱へ移動します。挙動は設定 `explorer.confirmDelete`（削除前確認）と `explorer.confirmDragAndDrop`（ドラッグ確認）で制御できます。

---

## 保存と自動保存

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 保存 | `Cmd + S` | `Ctrl + S` |
| 別名で保存 | `Cmd + Shift + S` | `Ctrl + Shift + S` |
| すべて保存 | コマンド `File: Save All` | `Ctrl + K, S` |

自動保存は設定 `files.autoSave` で制御します。

| 値 | 挙動 |
|----|------|
| `off` | 手動保存のみ |
| `afterDelay` | `files.autoSaveDelay`（既定 1000ms）経過後に保存 |
| `onFocusChange` | 別タブや別ウィンドウへフォーカスが移った瞬間 |
| `onWindowChange` | VS Code から OS の別アプリへフォーカスが移った瞬間 |

---

## ワークスペースとフォルダ

| 用語 | 意味 |
|------|------|
| **フォルダ** | 単一のディレクトリを開いた状態。フォルダ用設定は `.vscode/settings.json` |
| **マルチルートワークスペース** | 複数フォルダを 1 ウィンドウで扱う。`*.code-workspace` ファイルにルート一覧と設定を保存 |
| **`.vscode/` ディレクトリ** | プロジェクト同梱の設定群。`settings.json`、`launch.json`（デバッグ）、`tasks.json`（タスク）、`extensions.json`（推奨拡張） |

ワークスペースの保存は `File › Save Workspace As...`、開くのは `File › Open Workspace from File...`。

---

## ありがちなつまずき

- 「フォルダを開いたつもりが空のエクスプローラー」 → ファイルを単体で開いた状態。`File › Open Folder...` でフォルダ自体を開き直す
- 「保存しているのに反映されない」 → 別のファイルを編集していないか確認。タブ名横の `●` が未保存マーク
- 「クイックオープンに目的のファイルが出ない」 → 既定では `.gitignore` で除外されたファイルは検索対象外。設定 `search.useIgnoreFiles` を `false` にすると無視を解除できる
- 「リネーム後に import が壊れた」 → TypeScript / JavaScript なら設定 `typescript.updateImportsOnFileMove.enabled` を `always` にすると自動更新される
