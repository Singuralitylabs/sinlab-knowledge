---
title: "Hooks と Plugins"
description: "イベント駆動の Hooks とプラグインによる Claude Code の拡張方法を解説。"
order: 8
type: reference
difficulty: intermediate
tags: [claude-code, ai-coding, hooks, reference]
estimatedMinutes: 10
status: published
---
イベント駆動の自動化とパッケージ化された拡張機能

## このページで学べること

## Hooks の基本概念

Hooks（フック）は、Claude Code のエージェントループ内で特定のイベントが発生したときに、 決定論的にシェルスクリプトを実行する仕組み です。LLM（大規模言語モデル）を介さずに動作するため、 毎回確実に同じ処理が実行されます。

最大の利点は、LLM のコンテキストを一切消費しないことです。フォーマッターの実行やログ記録のような定型的な自動化に最適です。

### LLM 判断 vs 決定論的 処理の比較

Skills / MCP

Hooks

### フックの実行フロー

matcher に一致した場合のみスクリプトが実行されます。LLM は関与しません。

## フックの種類

### エージェントループ内での発火タイミング

赤・オレンジ・黄色のフックはブロック可能（exit 1 で処理を中断できます）

## Hooks の設定と実用例

Hooks は settings.json の hooks フィールドで設定します。各フックタイプに対して、 matcher（対象ツール名のパターン）と command（実行するシェルコマンド）を指定します。

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "npx prettier --write $CLAUDE_FILE_PATH"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "echo '$CLAUDE_TOOL_INPUT' | grep -q 'rm -rf' && exit 1 || exit 0"
      }
    ]
  }
}
```

### ファイル編集後の自動フォーマット

Claude がファイルを編集（Write または Edit）するたびに、Prettier を自動実行してコードスタイルを統一します。PostToolUse フックはブロックしないため、フォーマットに失敗してもエージェントの処理は続行されます。

```json
{
  "matcher": "Write|Edit",
  "command": "npx prettier --write $CLAUDE_FILE_PATH"
}
```

### 危険なコマンドのブロック

Bash ツールが実行される前に、コマンド内容を検査します。 rm -rf などの破壊的コマンドが含まれている場合、 exit 1 で実行をブロックします。PreToolUse はブロック可能なフックです。

```json
{
  "matcher": "Bash",
  "command": "echo '$CLAUDE_TOOL_INPUT' | grep -q 'rm -rf' && exit 1 || exit 0"
}
```

⚠ 注意： PreToolUse フックで exit 1 を返すと、そのツール実行は中止されます。exit 0 を返すと、通常通り実行されます。

### コード変更後の自動 ESLint

JavaScript / TypeScript ファイルが編集された後に ESLint を自動実行し、コード品質を維持します。フック内で拡張子をチェックし、対象ファイルのみ lint を実行しています。

```json
{
  "matcher": "Write|Edit",
  "command": "if echo '$CLAUDE_FILE_PATH' | grep -qE '\\.(js|ts|jsx|tsx)$'; then npx eslint --fix '$CLAUDE_FILE_PATH'; fi"
}
```

## スキル・エージェント内フック定義

Claude Code v2.1 から、スキルやエージェントの Markdown ファイル内のフロントマターで直接 Hooks を定義できるようになりました。 関連するフックをスキルと一緒にパッケージ化できるため、 スキルの振る舞いと自動化処理をまとめて管理できます。

```text
---
description: コードレビュースキル
hooks:
  PostToolUse:
    - matcher: "Edit"
      command: "npx eslint --fix $CLAUDE_FILE_PATH"
---

# コードレビュースキル

コードの品質をチェックし、改善提案を行います。
編集後に自動で ESLint が実行されます。
```

スキルと一緒に管理

スキルに必要なフックがスキルファイル内で完結するため、設定の分散を防げます。

スキル有効時のみ発火

フロントマターで定義したフックは、そのスキルがアクティブなときだけ実行されます。

## Plugins の概念

Plugin（プラグイン）は、Claude Code の拡張機能を1つのインストール可能なパッケージにまとめる仕組みです。 Skills、Hooks、サブエージェント、MCP サーバー設定 を1つのユニットにバンドルし、リポジトリ間で再利用できます。

### プラグインのディレクトリ構造

📁 skills/

再利用可能なワークフローやナレッジを定義する Markdown ファイル群

📁 hooks/

イベント駆動の自動化ルールを定義する設定ファイル

📁 agents/

専用のシステムプロンプトとツール制限を持つサブエージェント

📁 mcp/

外部サービス接続のための MCP サーバー設定

### 名前空間によるスキルの参照

プラグイン内のスキルは、プラグイン名をプレフィックスとした名前空間付きで公開されます。 これにより、複数のプラグインが同じ名前のスキルを持っていても衝突しません。

### インストールとリポジトリ間の再利用

プラグインはパッケージとしてインストールできるため、チーム全体で統一された開発環境を簡単に共有できます。 一度作成したプラグインを複数のリポジトリで再利用することで、設定のコピーペーストを排除し、メンテナンスを一元化できます。

## Marketplaces（マーケットプレイス）

Marketplaces は、プラグインのホスティング・配布を行うプラットフォームです。 チームや組織でプラグインコレクションを管理し、標準化された開発環境を共有するための基盤として設計されています。

作成したプラグインを公開し、他のユーザーやチームが発見・インストールできるようにします。

組織内で承認済みのプラグインセットを管理し、メンバー全員の環境を統一できます。

フォーマッター設定、lint ルール、デプロイ手順などをプラグインとして統一配布します。

コミュニティによるプラグインエコシステムの発展、レビュー・評価システムなどが構想されています。

---

**原典**: `claude-code-website/app/features/hooks-plugins/page.tsx`
