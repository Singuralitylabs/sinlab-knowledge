---
title: "統合ターミナル"
order: 4
type: detail
difficulty: beginner
tags: [vscode, reference]
estimatedMinutes: 6
status: draft
---
# 統合ターミナル

## 解説

**統合ターミナル** は VS Code 内に組み込まれたシェルで、別のターミナルアプリを開かなくてもエディタの隣でコマンドを実行できます。**カレントディレクトリは自動的にワークスペースのルート** になり、相対パスでファイルを開いたり、`code .` 風の操作と自然に組み合わせられます。

下部パネルの `Terminal` タブとして表示され、複数同時に開く・分割する・別シェルを並べる、といった使い分けが可能です。

---

## 開く / 閉じる

| 操作 | macOS / Windows / Linux 共通 |
|------|------------------------------|
| ターミナルの表示切替 | `` Ctrl + ` ``（Ctrl + バッククォート） |
| パネル全体の表示切替 | `Cmd + J` / `Ctrl + J` |
| 新しいターミナルを追加 | `` Cmd + Shift + ` `` / `` Ctrl + Shift + ` `` |
| ターミナルを閉じる | パネル右上のごみ箱アイコン、または `exit` |

> **環境による違い**：日本語キーボードでバッククォートが入力しにくい場合、`Terminal: Toggle Terminal` をキーバインドに割り当て直すと運用しやすくなります（`Cmd/Ctrl + K, Cmd/Ctrl + S` でキーバインド設定を開く）。

---

## 複数ターミナルとレイアウト

| 操作 | やり方 |
|------|--------|
| ターミナルを **分割** | パネル右上の分割アイコン、またはコマンド `Terminal: Split Terminal` |
| ターミナルを **タブで切替** | パネル右側のターミナル一覧をクリック |
| ターミナルの **リネーム** | タブを右クリック › `Rename` |
| アイコン / 色を変更 | タブ右クリック › `Change Icon` / `Change Color`（複数並べた時の識別に） |

分割すると **同じグループ内で左右に並んで** 表示され、`Focus Next Pane` / `Focus Previous Pane` コマンドで行き来できます。

---

## シェル（プロファイル）の切替

VS Code はインストール時に検出した複数のシェルから既定を選びます。明示的に切り替えるには:

1. パネル右上のターミナル名（`zsh` など）の隣の **下矢印** をクリック
2. `Select Default Profile` を選ぶ
3. または **新しいターミナルの追加メニュー** から `Select Default Profile`

OS ごとの主な選択肢:

| OS | 既定 | 他に選べる例 |
|----|------|--------------|
| macOS | `zsh` | `bash`、`fish`、`tmux` |
| Windows | `PowerShell` | `Command Prompt`、`Git Bash`、`WSL`（Ubuntu など） |
| Linux | ログインシェル（`bash` 等） | システムにインストールされた他シェル |

設定で固定するには `terminal.integrated.defaultProfile.osx` / `windows` / `linux` を編集します。

---

## ターミナル内のショートカット

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| カーソル行へスクロール（最下部へ） | `Cmd + End` | `Ctrl + End` |
| 出力をクリア | `Cmd + K` | `Ctrl + L`（シェル依存） |
| 検索 | `Cmd + F` | `Ctrl + F` |
| 直近のコマンドへ移動 | `Cmd + ↑` / `↓` | （同等は標準では未割当。コマンド `Terminal: Go to Previous/Next Command`） |
| 現在のコマンドの選択 | コマンド `Terminal: Select to Previous Command` | 同左 |

ターミナル内のテキストはそのまま選択 → コピーできます。URL や file:line:column のリンクは `Cmd/Ctrl + クリック` でジャンプします。

---

## デバッグ・タスクとの連携

- **タスク**：`tasks.json` に登録したビルドやテストはターミナル内で実行され、終了コードや出力がそのまま表示される
- **デバッグ**：`launch.json` の構成によってはデバッグ対象のプロセスがターミナル経由で起動し、標準入出力がここに流れる
- **問題ビュー連携**：エラー出力は問題マッチャの設定により、自動でパネルの `問題` タブに分類される

---

## ありがちなつまずき

- 「Path が外部ターミナルと違う」 → VS Code 起動時の環境変数を引き継ぐかは設定 `terminal.integrated.inheritEnv` で制御。`.zshrc` などのプロファイル読み込みは設定 `terminal.integrated.defaultProfile.*` で指定したシェルに依存
- 「ターミナルが消えた」 → パネル下部のターミナル一覧で他のターミナルに切り替わっただけのことが多い。`` Ctrl + ` `` で再表示
- 「色がおかしい / プロンプトが崩れる」 → シェルの `LANG` / `TERM` 環境変数や Powerlevel10k などのフォント依存設定を確認。VS Code 側の設定 `terminal.integrated.fontFamily` で Nerd Font などに切替
- 「`code .` が動かない」 → macOS / Linux ではコマンドパレットで `Shell Command: Install 'code' command in PATH` を実行する。Windows ではインストーラーで「PATH へ追加」オプションを有効にして再インストールするか、`%LOCALAPPDATA%\Programs\Microsoft VS Code\bin` を環境変数 `PATH` に追加する
