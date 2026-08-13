---
title: "ワークスペースと .vscode ディレクトリ"
order: 3
type: detail
difficulty: beginner
tags: [vscode, settings, reference]
estimatedMinutes: 6
status: published
---
# ワークスペースと .vscode ディレクトリ

## 解説

VS Code でプロジェクトを開く方法は **3 種類** あり、それぞれ「設定がどこに保存されるか」「他のメンバーと共有されるか」が異なります。

| 開き方 | 何を開く | 共有設定の置き場 |
|--------|---------|----------------|
| **単一フォルダ** | 1 つのディレクトリ | そのフォルダ内の `.vscode/` |
| **マルチルートワークスペース** | 複数フォルダを 1 ウィンドウで | `*.code-workspace` ファイルに直接記述 + 各フォルダの `.vscode/` |
| **単一ファイル** | ファイルだけ | 共有設定なし（推奨されない） |

通常の Web 開発では **単一フォルダ + `.vscode/`** が標準。モノレポやフロント / バックを 1 画面で扱いたい場合に **マルチルート** を選びます。

---

## `.vscode/` ディレクトリの中身

プロジェクトルートに `.vscode/` を置き、その中身をコミットすることでチーム全体に同じ環境を共有できます。

| ファイル | 役割 |
|---------|------|
| **`settings.json`** | このプロジェクト用の設定（フォーマッタ、改行、タブ幅など） |
| **`extensions.json`** | 推奨拡張機能の ID 一覧 |
| **`launch.json`** | デバッグ構成 |
| **`tasks.json`** | ビルドやテストのタスク定義 |

個人のフォント・テーマ・API キーは入れず、User 設定または `.gitignore` 側で扱います。

---

## ワークスペース版 settings.json

`.vscode/settings.json` の構文・コメント可否・言語別オーバーライドの書き方は User の `settings.json` と同じです。詳細は [設定の編集方法](/themes/01-web-basics/03-vscode/intro-settings/settings) を参照してください。

ここに書くのは **プロジェクト固有の規約だけ**（フォーマッタ、改行コード、タブ幅、Linter ルールなど）。User 設定と同じキーがあった場合は **Workspace の値が優先** されます。

---

## `extensions.json`

このプロジェクトで **使ってほしい（または避けてほしい）拡張機能** を列挙するファイル。リポジトリを初めて開いた人に「推奨拡張をインストールしますか？」と通知が出ます。

### 作り方

- 拡張機能ビュー（`Cmd/Ctrl + Shift + X`）で対象拡張を右クリック › `Add to Workspace Recommendations` で自動追記
- 既存環境を一括移植したい場合は `code --list-extensions` で ID 一覧を取得してコピー
- 手書きする場合は `<publisher>.<name>` 形式（拡張詳細ビューの `Copy Extension ID` で取得）

### 例

```jsonc
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "biomejs.biome"
  ],
  "unwantedRecommendations": [
    "hookyqr.beautify"
  ]
}
```

`unwantedRecommendations` は同じ機能の競合拡張を Marketplace の自動レコメンドから外したい場合に使います。

### 実行方法

特別な操作は不要。`.vscode/extensions.json` を含むリポジトリを開くと、未インストールの推奨があれば自動で通知が出ます。後から見たいときはコマンド `Extensions: Show Recommended Extensions`。

---

## `launch.json`（デバッグ構成）

ブレークポイントを置いて変数やコールスタックを覗きながらコードを実行するための設定ファイル。Node.js / Python / Chrome などランタイムごとに異なる起動方法を、名前付きで複数保存しておけます。

### 作り方

1. アクティビティバーの「実行とデバッグ」（`Cmd/Ctrl + Shift + D`）を開く
2. **`create a launch.json file`** リンクをクリック
3. 環境（Node.js / Chrome / Python など）を選ぶと、ひな型が `.vscode/launch.json` に生成される

### 例

```jsonc
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run main.ts",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "runtimeExecutable": "bun",
      "console": "integratedTerminal"
    }
  ]
}
```

| 主要キー | 役割 |
|---------|------|
| `name` | デバッグタブのドロップダウンに表示される名前 |
| `type` | デバッガの種類（`node` / `chrome` / `python` など） |
| `request` | `launch`（プロセス起動）か `attach`（既存プロセスに接続） |
| `program` | 実行するスクリプトのパス。`${file}` で「現在開いているファイル」を指定可 |
| `runtimeExecutable` | 既定ランタイムの上書き（例：`bun`、`tsx`） |
| `console` | 出力先：`integratedTerminal` / `internalConsole` / `externalTerminal` |

### 実行方法

「実行とデバッグ」タブ上部のドロップダウンで構成名を選び、▶︎ ボタンまたは `F5`。デバッグ中は `F9`（ブレークポイント）、`F10`（ステップオーバー）、`F11`（ステップイン）が標準ショートカットです。

---

## `tasks.json`（タスク定義）

`bun run build` や `pytest` のような頻用シェルコマンドを **名前付きタスク** として登録するファイル。コマンドパレットやショートカットから呼び出せるほか、エラー出力を「問題」パネルに自動分類できる点がターミナル直打ちと比べた利点です。

### 作り方

1. コマンドパレット → `Tasks: Configure Task`
2. テンプレートを選ぶ（`npm` を選ぶと `package.json` の scripts を自動タスク化）か、「Create tasks.json file from template」で空のひな型から始める
3. `.vscode/tasks.json` が生成される

### 例

```jsonc
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "shell",
      "command": "bun run build",
      "group": { "kind": "build", "isDefault": true },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "dev",
      "type": "shell",
      "command": "bun run dev",
      "isBackground": true
    }
  ]
}
```

| 主要キー | 役割 |
|---------|------|
| `label` | タスク名（コマンドパレットに表示） |
| `type` | `shell`（シェル経由）または `process`（直接実行） |
| `command` | 実行するコマンド |
| `group` | `build` / `test` に分類。`isDefault: true` で既定として登録 |
| `problemMatcher` | エラー出力を「問題」パネルに分類するパーサ。組み込みで `$tsc`、`$eslint-stylish` など |
| `isBackground` | `true` で `dev` のような常駐プロセス向け |

### 実行方法

| 操作 | 動作 |
|------|------|
| `Cmd/Ctrl + Shift + B` | `group: { kind: "build", isDefault: true }` のタスクを実行 |
| コマンドパレット → `Tasks: Run Task` | 一覧から選択 |
| コマンドパレット → `Tasks: Run Test Task` | `group: "test"` の既定タスクを実行 |

任意のタスクに固有のショートカットを割り当てたければ、`keybindings.json` で `command: "workbench.action.tasks.runTask"` + `args: "<label>"` を指定します。

---

## マルチルートワークスペース

複数のリポジトリ / ディレクトリを 1 つの VS Code ウィンドウで扱う仕組みです。モノレポの分割表示や、フロント + バック + ドキュメントなど別 Git 管理のフォルダを並べて開きたい時に使います。

`.code-workspace` ファイルにフォルダ一覧と共通設定を書き、`File: Save Workspace As...` で保存、`File: Open Workspace from File...` で開きます。

```jsonc
{
  "folders": [
    { "name": "Frontend", "path": "./web" },
    { "name": "Backend", "path": "./api" }
  ],
  "settings": { "editor.tabSize": 2 },
  "extensions": { "recommendations": ["dbaeumer.vscode-eslint"] }
}
```

各フォルダ内に `.vscode/settings.json` を置けばフォルダ固有の設定も共存させられます。`.vscode/settings.json` や `tasks.json` で絶対パスを書きたくなったら `${workspaceFolder}`（マルチルート時は `${workspaceFolder:Frontend}` のように名前で指定）を使うと、メンバー間で破綻しません。

---

## ありがちなつまずき

- 「`.vscode/` をコミットしてよいか分からない」 → 一般的にはコミットする。ただし `*.local.json` や個人 API キーを含むものは除外
- 「Workspace 設定がチームに反映されない」 → User 設定として書いていないか確認。`Preferences: Open Workspace Settings (JSON)` で開いた `.vscode/settings.json` に書く
- 「`.code-workspace` を使うと `.vscode/settings.json` が無視される」 → 無視されない。優先度は `.code-workspace` < 各フォルダの `.vscode/settings.json`
- 「マルチルートで開くと `${workspaceFolder}` が曖昧」 → `${workspaceFolder:<name>}` で明示。タスク・デバッグ構成を定義したフォルダごとに変数のスコープが分かれる
