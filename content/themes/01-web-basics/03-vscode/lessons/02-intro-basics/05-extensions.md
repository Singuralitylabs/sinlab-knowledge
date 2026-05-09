---
title: "拡張機能"
order: 5
type: detail
difficulty: beginner
tags: [vscode, reference]
estimatedMinutes: 7
status: published
---
# 拡張機能（Extensions）

## 解説

VS Code 自体は **言語非依存の軽量エディタ** で、TypeScript / Python / Go などの専門機能はすべて **拡張機能** によって追加されます。標準で何でも入っているのではなく、「必要なものだけ後から足す」設計です。

そのため、新しい言語やフレームワークを始めるたびに「どの拡張を入れるか」を選ぶ判断が必要になります。

---

## Marketplace を開く

| 操作 | macOS | Windows / Linux |
|------|-------|-----------------|
| 拡張機能ビューを開く | `Cmd + Shift + X` | `Ctrl + Shift + X` |

サイドバー左側の四角いピース型アイコンが入口です。検索バーで拡張名を打つと一覧が絞り込まれます。

### 検索バーで使えるフィルタ

| 入力 | 意味 |
|------|------|
| `@installed` | インストール済みのみ |
| `@enabled` / `@disabled` | 有効 / 無効のみ |
| `@outdated` | 更新可能なもの |
| `@workspaceUnsupported` | このワークスペースで動作しない警告ありのもの |
| `@category:formatters` | カテゴリ指定（他に `linters`、`debuggers`、`themes`、`snippets` など） |
| `@id:publisher.name` | ID 完全一致 |
| `@tag:python` | タグで絞り込み |

複数のフィルタは空白区切りで AND 結合できます（例：`@installed @category:linters`）。

---

## 拡張の選び方

カードに表示される情報を読み解くのが第一歩です。

| 表示 | 何を意味するか |
|------|---------------|
| **ダウンロード数** | 利用者数の目安。極端に少ないものは要注意 |
| **★ レーティング** | 主観評価。星より「最終更新日」「Issue の活発さ」を優先 |
| **`✓ Verified` バッジ** | 公式 / 大手企業の検証済みパブリッシャ。Microsoft、GitHub、Anthropic、ESLint 公式など |
| **`Pre-Release` バッジ** | プレリリース版。本番用には正式版を推奨 |

迷ったら **公式パブリッシャ + 最終更新が直近 1 年以内** を基準に選ぶと外しにくいです。

### 用途別カテゴリの代表例

| 用途 | 例 |
|------|----|
| 言語サーバ | `Python`（Microsoft）、`Go`（Google） |
| Linter / フォーマッタ | `ESLint`、`Biome`、`Prettier - Code formatter`、`Ruff` |
| Git 補助 | `GitLens`、`GitHub Pull Requests` |
| AI 補完 / Chat | `GitHub Copilot`、`GitHub Copilot Chat`、`Claude Code`（Anthropic）、`Cline`、`Continue`、`Windsurf`（旧 Codeium） |
| リモート開発 | `Remote - SSH`、`Dev Containers`、`WSL` |
| 補助系 | `Path Intellisense`、`Error Lens`、`Code Spell Checker` |

---

## ワークスペース推奨拡張

チームで共通の拡張を揃えるには `.vscode/extensions.json` を使います。リポジトリをクローンしたメンバーが初回オープン時に「推奨をインストールしますか？」と通知される仕組みです。

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-python.python"
  ],
  "unwantedRecommendations": [
    "hookyqr.beautify"
  ]
}
```

| キー | 役割 |
|------|------|
| `recommendations` | インストール推奨。配列の値は `<publisher>.<name>` 形式の Extension ID |
| `unwantedRecommendations` | 推奨しない拡張（重複や非推奨ツールを抑止） |

Extension ID は Marketplace ページの右側、または拡張詳細ビュー内の `Copy Extension ID` で取得できます。

---

## 有効化スコープ

拡張は **ユーザー単位**（全プロジェクト）または **ワークスペース単位**（このプロジェクトだけ）で有効化できます。`Disable (Workspace)` を使うと「他では有効だけどこのプロジェクトでは無効」という設定が可能です。

リモート（SSH / Container / WSL）に接続している場合、拡張は **ローカル側 / リモート側のどちらに入るか** が UI でラベル分けされます。`Install in SSH` のように明示的に選びます。

---

## CLI から扱う

`code` コマンドが PATH に通っていれば（コマンドパレットで `Shell Command: Install 'code' command in PATH` を実行すると追加）、CLI からも操作できます。

```bash
code --list-extensions
code --install-extension dbaeumer.vscode-eslint
code --uninstall-extension hookyqr.beautify
```

`code --list-extensions > .vscode/extensions.txt` で一覧を保存し、新環境で一括導入する手順をスクリプト化できます。

---

## ありがちなつまずき

- 「入れたのに何も起きない」 → 言語サーバ系は対応する言語ファイルを開いた時点で初期化される。`Output` パネルで該当拡張のログを確認
- 「VS Code が重くなった」 → `Help: Show Running Extensions` で各拡張の起動時間 / アクティブ状態を確認。古い / 非推奨のものを `Disable` または `Uninstall`
- 「同じ機能の拡張が複数ある」 → フォーマッタが競合すると保存時に挙動が安定しない。設定 `editor.defaultFormatter` で言語ごとに 1 つに固定
- 「組織のセキュリティで Marketplace が使えない」 → エンタープライズ環境では VSIX ファイルからの手動インストール、または社内ミラーを使う運用がある
