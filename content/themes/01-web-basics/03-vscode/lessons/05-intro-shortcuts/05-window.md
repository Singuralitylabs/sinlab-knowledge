---
title: "ウィンドウ操作"
order: 5
type: detail
difficulty: beginner
tags: [vscode, shortcuts, reference]
estimatedMinutes: 5
status: draft
---
# ウィンドウ操作

## 解説

サイドバー / パネル / エディタの分割など、**画面レイアウトを整える** ためのショートカット集です。集中したいときにサッと余計な領域を畳めるかどうかで、コーディングの体感が変わります。

---

## サイドバー・パネルの開閉

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| プライマリサイドバーの表示切替 | `Cmd + B` | `Ctrl + B` |
| セカンダリサイドバーの表示切替 | `Cmd + Option + B` | `Ctrl + Alt + B` |
| パネル（下部）の表示切替 | `Cmd + J` | `Ctrl + J` |
| ターミナルの表示切替 | `` Ctrl + ` `` | `` Ctrl + ` `` |
| パネルを最大化 | コマンド `View: Toggle Maximized Panel` | 同左 |

---

## アクティビティバーのビュー切替

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| エクスプローラー | `Cmd + Shift + E` | `Ctrl + Shift + E` |
| 検索 | `Cmd + Shift + F` | `Ctrl + Shift + F` |
| ソース管理 | `Cmd + Shift + G` | `Ctrl + Shift + G` |
| 実行とデバッグ | `Cmd + Shift + D` | `Ctrl + Shift + D` |
| 拡張機能 | `Cmd + Shift + X` | `Ctrl + Shift + X` |

同じキーをもう一度押すとサイドバー自体が閉じるので、開閉トグルとしても使えます。

---

## エディタの分割とグループ移動

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 右に分割 | `Cmd + \` | `Ctrl + \` |
| 下に分割 | `Cmd + K, Cmd + \` | `Ctrl + K, Ctrl + \` |
| 1 つ目 / 2 つ目 / 3 つ目のグループへ移動 | `Cmd + 1` / `2` / `3` | `Ctrl + 1` / `2` / `3` |
| 隣のグループへフォーカス移動 | `Cmd + K, Cmd + ↑/↓/←/→` | `Ctrl + K, Ctrl + ↑/↓/←/→` |
| 現在のエディタを別グループへ移動 | `Cmd + K, ←` / `→` | `Ctrl + K, ←` / `→` |

レイアウト全体を変えたい時はコマンド `View: Editor Layout: ...` から `Single` / `Two Columns` / `Grid (2x2)` などを選べます。

---

## タブ切替

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 直近のタブへ切替（履歴順） | `Ctrl + Tab` | `Ctrl + Tab` |
| 隣のタブへ移動 | `Cmd + Option + ←` / `→` | `Ctrl + PageUp` / `PageDown` |
| タブを閉じる | `Cmd + W` | `Ctrl + W` |
| 直前に閉じたタブを再度開く | `Cmd + Shift + T` | `Ctrl + Shift + T` |

---

## ズームとフルスクリーン

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 拡大 | `Cmd + +` | `Ctrl + +` |
| 縮小 | `Cmd + -` | `Ctrl + -` |
| ズームをリセット | `Cmd + 0` | `Ctrl + 0` |
| フルスクリーン切替 | `Ctrl + Cmd + F` | `F11` |
| Zen Mode（最低限の UI のみ表示） | `Cmd + K, Z` | `Ctrl + K, Z` |

Zen Mode は集中作業にうってつけで、`Esc` を 2 回押すと解除されます。

---

## ありがちなつまずき

- 「`Cmd/Ctrl + B` を押しても何も変わらない」 → 既にサイドバーが閉じている状態。同じキーで開く
- 「Zen Mode から抜けられない」 → `Esc` を **2 回** 押す（1 回だけだと別の Esc 動作）
- 「分割エディタが多すぎてレイアウトが崩れた」 → コマンド `View: Editor Layout: Single` で 1 つに戻せる
- 「`Cmd/Ctrl + W` で VS Code 全体が閉じた」 → タブが残っていない状態で押すとウィンドウが閉じる挙動。タブを 1 つ残しておくか、`Cmd/Ctrl + Shift + T` で復帰
