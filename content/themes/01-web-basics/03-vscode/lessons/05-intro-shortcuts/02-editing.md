---
title: "編集"
order: 2
type: detail
difficulty: beginner
tags: [vscode, shortcuts, reference]
estimatedMinutes: 6
status: published
---
# 編集

## 解説

コードを書き換えるときの **行操作・コメント・フォーマット** 系のショートカットです。1 つひとつは小さな時短ですが、組み合わせると 1 日に数百回節約できます。

---

## 行の操作

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 行を上下に移動 | `Option + ↑` / `↓` | `Alt + ↑` / `↓` |
| 行を上下にコピー | `Option + Shift + ↑` / `↓` | `Alt + Shift + ↑` / `↓` |
| 行を削除 | `Cmd + Shift + K` | `Ctrl + Shift + K` |
| 行をカット（選択なしで動作） | `Cmd + X` | `Ctrl + X` |
| 行をコピー（選択なしで動作） | `Cmd + C` | `Ctrl + C` |
| 行を上に挿入 | `Cmd + Shift + Enter` | `Ctrl + Shift + Enter` |
| 行を下に挿入 | `Cmd + Enter` | `Ctrl + Enter` |

選択なしで `Cmd/Ctrl + X` を押すと「現在行をクリップボードに移動」になるので、行ごと別の場所に貼り直すときに便利です。

---

## カーソル移動

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 単語単位で移動 | `Option + ←` / `→` | `Ctrl + ←` / `→` |
| 行頭 / 行末へ | `Cmd + ←` / `→` | `Home` / `End` |
| ファイル先頭 / 末尾へ | `Cmd + ↑` / `↓` | `Ctrl + Home` / `End` |
| 単語単位で削除（後方） | `Option + Backspace` | `Ctrl + Backspace` |
| 単語単位で削除（前方） | `Option + Delete` | `Ctrl + Delete` |

---

## インデントとコメント

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| インデントを増やす | `Tab`（行選択時） | `Tab` |
| インデントを減らす | `Shift + Tab` | `Shift + Tab` |
| 行コメントをトグル | `Cmd + /` | `Ctrl + /` |
| ブロックコメントをトグル | `Option + Shift + A` | `Alt + Shift + A` |

複数行を選択した状態で `Cmd/Ctrl + /` を押すと一括で `//` がついたり外れたりします。

---

## フォーマット

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| ファイル全体をフォーマット | `Option + Shift + F` | `Alt + Shift + F` |
| 選択範囲のみフォーマット | `Cmd + K, Cmd + F` | `Ctrl + K, Ctrl + F` |

設定 `editor.formatOnSave` を `true` にしておくと、保存時に自動でフォーマットされます。

---

## 元に戻す / やり直す

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 元に戻す（Undo） | `Cmd + Z` | `Ctrl + Z` |
| やり直す（Redo） | `Cmd + Shift + Z` | `Ctrl + Y` または `Ctrl + Shift + Z` |

---

## Emmet（HTML / CSS）

HTML / CSS / JSX ファイルでは、Emmet 略記をタイプして `Tab` で展開できます。

```
div.container>ul>li*3   →   <div class="container"><ul><li></li><li></li><li></li></ul></div>
```

| 操作 | キー |
|------|------|
| Emmet 展開 | `Tab`（略記直後） |
| Emmet 略記の絞り込み（候補から選ぶ） | `Cmd/Ctrl + Space` |

JSX で動かない場合は設定 `emmet.includeLanguages` に `"javascriptreact": "html"` を追加します。

---

## ありがちなつまずき

- 「`Cmd/Ctrl + /` でコメントが付かない」 → 言語が未認識。ステータスバーの言語モード表示で正しい言語に切替
- 「フォーマッタが動かない」 → 設定 `editor.defaultFormatter` で言語ごとのフォーマッタを指定。複数の拡張が競合していないか確認
- 「`Tab` でインデントが進まず Emmet が暴発する」 → JSX や類似言語で起こりがち。設定 `emmet.triggerExpansionOnTab` を `false` にすると Emmet を `Cmd/Ctrl + Space` のみに限定できる
