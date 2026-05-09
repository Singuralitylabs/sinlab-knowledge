---
title: "アクティビティバー"
order: 1
type: detail
difficulty: beginner
tags: [vscode, ui, reference]
estimatedMinutes: 5
status: published
---
# アクティビティバー

## 解説

**アクティビティバー** は VS Code の左端にある縦のアイコン列で、サイドバーに表示する機能を切り替えるための入口です。標準では次の 5 つのアイコンが上部に並びます。

![アクティビティバー（左端の縦アイコン列）の標準表示](/content-assets/01-web-basics/03-vscode/images/04-activity-bar.png)

| アイコン | 機能 | サイドバーの中身 |
|---------|------|-----------------|
| ファイル（書類）| エクスプローラー | フォルダのファイルツリー |
| 虫眼鏡 | 検索 | ワークスペース全体の検索 UI と結果 |
| 分岐 | ソース管理 | Git の変更ファイル一覧 |
| 三角＋虫 | 実行とデバッグ | デバッグセッションの設定・変数 |
| 四角ピース | 拡張機能 | Marketplace と導入済み拡張 |

下部にはアカウントアイコンと **管理（歯車）** アイコンがあり、設定 / コマンドパレット / キーバインド / カラーテーマ / 拡張機能の更新 などへ素早くアクセスできます。

![管理（歯車）アイコンをクリックして開いたメニュー](/content-assets/01-web-basics/03-vscode/images/03-settings-button.png)

> **環境による違い**：GitHub Copilot 同梱版や Insider ビルドでは、Chat（吹き出し）アイコンが標準で追加されることがあります。拡張機能を入れると GitLens、Docker、Remote-SSH などのアイコンも追加されます。

---

## 主要ショートカット

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| エクスプローラーを開く | `Cmd + Shift + E` | `Ctrl + Shift + E` |
| 検索を開く | `Cmd + Shift + F` | `Ctrl + Shift + F` |
| ソース管理を開く | `Cmd + Shift + G` | `Ctrl + Shift + G` |
| 実行とデバッグを開く | `Cmd + Shift + D` | `Ctrl + Shift + D` |
| 拡張機能を開く | `Cmd + Shift + X` | `Ctrl + Shift + X` |
| サイドバーの表示切替 | `Cmd + B` | `Ctrl + B` |

同じアイコンをもう一度クリック、または `Cmd/Ctrl + B` でサイドバーを閉じてエディタを広く使えます。

---

## カスタマイズ

- アイコンの **並び替え**：ドラッグ&ドロップで順序を変更できます
- **非表示**：右クリックメニューで使わないアイコンを隠せます
- **位置の切替**：右クリックメニューの `Activity Bar Position`、または **View › Appearance › Activity Bar Position** から **Side / Top / Bottom / Hidden** を選択できます。コマンドパレットからは `View: Move Activity Bar to Side`（あるいは `Top` / `Bottom` / `Hidden`）を実行
- 拡張機能を入れると、独自のアイコン（GitLens、Docker、Remote-SSH など）が追加されることがあります

---

## ありがちなつまずき

- アクティビティバーが消えた → `Activity Bar Position` が `Hidden` になっている可能性。コマンドパレットで `View: Move Activity Bar to Side` を実行するか、`View › Appearance › Activity Bar Position` から `Side` を選び直す
- 通知バッジが消えない → ソース管理ならコミット / プッシュ漏れ、拡張機能ならアップデート可能のサイン
