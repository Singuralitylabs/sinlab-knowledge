---
title: "検索"
order: 3
type: detail
difficulty: beginner
tags: [vscode, shortcuts, reference]
estimatedMinutes: 4
status: published
---
# 検索

## 解説

検索系のショートカットは「エディタ内」と「ワークスペース全体」の 2 階層を分けて覚えると整理できます。**`Cmd/Ctrl + F`（エディタ内）** と **`Cmd/Ctrl + Shift + F`（ワークスペース全体）** の関係がベースです。

詳細な機能（include / exclude グロブ、検索結果の操作など）は `基本操作` カテゴリの `検索と置換` 詳細を参照してください。

---

## エディタ内検索

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 検索バーを開く | `Cmd + F` | `Ctrl + F` |
| 置換バーを開く | `Cmd + Option + F` | `Ctrl + H` |
| 次の一致へ移動 | `Cmd + G` または `Enter` | `F3` または `Enter` |
| 前の一致へ移動 | `Cmd + Shift + G` または `Shift + Enter` | `Shift + F3` または `Shift + Enter` |
| 選択範囲内のみ検索 | 検索バー内で `Option + L` | `Alt + L` |
| 検索履歴を遡る | 検索バー内で `↑` `↓` | 同左 |
| 検索バーを閉じる | `Esc` | `Esc` |

検索バー右の 3 つのトグル（`Aa` 大小区別 / `Ab|` 単語単位 / `.*` 正規表現）はマウスのほか、検索バー内で次のキーで切り替えられます。

| トグル | キー |
|--------|------|
| 大文字小文字を区別 | `Option + C` / `Alt + C` |
| 単語単位の一致 | `Option + W` / `Alt + W` |
| 正規表現 | `Option + R` / `Alt + R` |

---

## ワークスペース全体検索

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| ワークスペース検索を開く | `Cmd + Shift + F` | `Ctrl + Shift + F` |
| ワークスペース置換を開く | `Cmd + Shift + H` | `Ctrl + Shift + H` |
| 検索結果ビューにフォーカス | `Cmd + Shift + F` を再押下 | `Ctrl + Shift + F` を再押下 |
| 結果から該当箇所へジャンプ | 結果行で `Enter` | 同左 |
| 該当マッチを除外 | 結果行で `Cmd + Backspace` | `Delete` |

`files to include` / `files to exclude` 欄は検索バー下に表示され、`**/*.ts` のようなグロブで対象を絞れます。

---

## 関連するジャンプ系

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| シンボル検索（現在ファイル） | `Cmd + Shift + O` | `Ctrl + Shift + O` |
| シンボル検索（ワークスペース全体） | `Cmd + T` | `Ctrl + T` |
| 行ジャンプ | `Ctrl + G` | `Ctrl + G` |

これらはコマンドパレットを開いた状態で先頭に `@` / `#` / `:` を打っても同じ動作になります。

---

## ありがちなつまずき

- 「検索結果に `node_modules` が大量に出る」 → 設定 `search.exclude` を確認。検索バー下の歯車アイコンから `.gitignore` を尊重するモードにすると一時的に絞れる
- 「正規表現が使えない」 → 検索バー右の `.*` トグルがオンになっているか確認
- 「`Cmd/Ctrl + F` の検索結果がチラつく」 → 大きなファイルでは検索範囲を選択範囲に限定（`Option/Alt + L`）すると軽くなる
