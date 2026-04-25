---
title: "Hooks と Plugins"
description: "イベント駆動の Hooks とプラグインによる Claude Code の拡張方法を解説。"
order: 8
type: lecture
category: automation
difficulty: intermediate
tags: [claude-code, ai-coding, hooks]
estimatedMinutes: 15
status: published
---
# Hooks & Plugins

イベント駆動の自動化とパッケージ化された拡張機能の仕組みを解説します。Skills や MCP が「LLM の判断を伴う柔軟な拡張」であるのに対し、Hooks と Plugins は「決定論的な自動化」と「再利用可能な配布単位」を担当します。

## このページで学べること

- Hooks の仕組みと、LLM を介さない決定論的自動化の基本概念
- 主要なイベントタイプ（PreToolUse / PostToolUse / UserPromptSubmit など）とそれぞれのタイミング
- `settings.json` の `hooks` フィールドと `matcher` を使った設定方法
- フォーマット自動化、危険コマンドのブロック、lint 自動実行などの典型ユースケース
- スキルやエージェントのフロントマターに Hooks を埋め込む方法（v2.1 以降）
- Plugins の構造（マニフェスト、skills / hooks / agents / mcp の同梱）とインストールの流れ
- Marketplaces の位置付けとチーム配布の考え方

## Hooks の基本概念

Hooks（フック）は、Claude Code のエージェントループ内で特定のイベントが発生したときに、**決定論的にシェルスクリプトを実行する仕組み**です。LLM（大規模言語モデル）を介さずに動作するため、毎回確実に同じ処理が実行されます。

フックの実行自体は LLM を介さないため、基本的にコンテキストをほとんど消費しません（フックが `additionalContext` などを通じて結果を Claude に渡す場合は除きます）。フォーマッターの実行やログ記録のような定型的な自動化に最適で、コスト面でも予測可能です。

### LLM 判断 vs 決定論的処理の比較

| 観点 | Skills / MCP（LLM 判断） | Hooks（決定論的） |
| --- | --- | --- |
| 判断主体 | LLM が文脈に応じて柔軟に判断 | シェルが matcher に基づいて実行 |
| コンテキスト消費 | 消費する | ゼロ |
| 結果の再現性 | 毎回変わる可能性あり | 完全に予測可能 |
| 向いている用途 | 複雑な判断、動的な意思決定 | フォーマットや lint など定型処理 |

### フックの実行フロー

```text
イベント発生 → matcher の条件評価 → シェルコマンド実行
```

`matcher` に一致した場合のみスクリプトが実行されます。LLM はこのフローに関与しません。

> [!TIP]
> Hooks は Claude Code の中でもユニークな位置づけです。他の拡張機能（Skills、MCP、サブエージェント）はすべて LLM が判断に関与しますが、Hooks だけは完全に LLM の外で動作します。「必ず実行したい処理」の自動化にこそ使う価値があります。

## フックの種類

エージェントループの随所に発火ポイントが用意されています。ブロック可能なフック（`exit 2` で処理を中断できるもの）と、情報収集や後処理に使うフックに大別できます。下表は発火順に並べています（`InstructionsLoaded` や `Stop`、`SubagentStart/Stop` などは省略）。

| # | フック | タイミング | ブロック可能 | 用途例 |
| --- | --- | --- | --- | --- |
| 1 | `SessionStart` | セッション開始時 | - | 環境チェック、Git 状態の確認 |
| 2 | `UserPromptSubmit` | ユーザーのプロンプト送信時 | ✓ | 入力バリデーション、機密語のフィルタ |
| 3 | `PreToolUse` | ツール実行前 | ✓ | 危険なコマンドのブロック、承認判定 |
| 4 | `PermissionRequest` | 権限要求時 | ✓ | 自動承認 / 自動拒否の判定 |
| 5 | `PermissionDenied` | パーミッション拒否時 | - | 拒否ログの記録、通知 |
| 6 | `PostToolUse` | ツール実行後 | △ (実行後ブロック) | 編集後の自動フォーマット、lint |
| 7 | `PreCompact` | コンテキスト圧縮前 | ✓ | 圧縮対象の調整、通知 |
| 8 | `PostCompact` | コンテキスト圧縮後 | - | 圧縮結果の記録 |
| 9 | `SessionEnd` | セッション終了時 | - | サマリ保存、ログのアーカイブ |

テーブルだけでは見えにくい「ループ構造」と「分岐」を図にすると次のようになります。`UserPromptSubmit` から `PostToolUse` までは 1 ターン内で複数回繰り返され、これがエージェントループの本質です。

![Claude Code Hooks の実行タイミングを示すフローチャート](/images/ai-driven-development/hooks-plugins/hook-timing.png)

> [!NOTE]
> ブロック可能なフックで `exit 2` を返すと、対応する処理（ツール実行やプロンプト処理）は中止されます。`exit 0` を返した場合は通常通り続行します。`exit 1` は「ブロックしないエラー」として扱われ、処理は継続される点に注意してください。

## Hooks の設定と実用例

Hooks は `settings.json` の `hooks` フィールドで設定します。各フックタイプには `matcher`（対象ツール名のパターン）と `hooks` 配列を指定し、配列内の各エントリで `type: "command"` と `command`（実行するシェルコマンド）を定義します。`matcher` には `Write|Edit` のようにパイプで複数ツールを OR 指定できます。フック発火時のツール入力は標準入力に JSON で渡されるため、`jq` などで必要な値を抽出して使います。

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command' | grep -q 'rm -rf' && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

### 1. ファイル編集後の自動フォーマット（format-on-write）

Claude がファイルを編集（Write または Edit）するたびに Prettier を自動実行してコードスタイルを統一します。`PostToolUse` はツール実行後に発火するため、フォーマットに失敗しても既に編集自体は完了しています。

```json
{
  "matcher": "Write|Edit",
  "hooks": [
    {
      "type": "command",
      "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
    }
  ]
}
```

> [!NOTE]
> フックには標準入力経由で JSON 形式のフックデータが渡されます。`tool_input.file_path` のように `jq` で必要な値を抽出して利用してください。プロジェクトルートは `$CLAUDE_PROJECT_DIR`、プラグインルートは `$CLAUDE_PLUGIN_ROOT` のような環境変数で参照できます。

### 2. 危険なコマンドのブロック

`Bash` ツールが実行される前に、コマンド内容を検査します。`rm -rf` などの破壊的コマンドが含まれている場合、`exit 2` で実行をブロックします。`PreToolUse` はブロック可能なフックです。

```json
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "command": "jq -r '.tool_input.command' | grep -q 'rm -rf' && exit 2 || exit 0"
    }
  ]
}
```

> [!WARNING]
> `PreToolUse` で `exit 2` を返すと、そのツール実行は中止されます。`exit 0` を返すと通常通り実行され、`exit 1` は「ブロックしないエラー」として扱われ実行が継続されます。ブロック条件の誤検知を避けるため、パターンは慎重に定義してください。

### 3. コード変更後の自動 ESLint

JavaScript / TypeScript ファイルが編集された後に ESLint を自動実行し、コード品質を維持します。フック内で拡張子を判定し、対象ファイルのみ lint を実行します。

```json
{
  "matcher": "Write|Edit",
  "hooks": [
    {
      "type": "command",
      "command": "FILE=$(jq -r '.tool_input.file_path'); if echo \"$FILE\" | grep -qE '\\.(js|ts|jsx|tsx)$'; then npx eslint --fix \"$FILE\"; fi"
    }
  ]
}
```

## スキル・エージェント内フック定義

近年の Claude Code では、スキルやエージェントの Markdown ファイル内のフロントマターで直接 Hooks を定義できます。関連するフックをスキルと一緒にパッケージ化できるため、スキルの振る舞いと自動化処理をまとめて管理できます。

```yaml
---
description: コードレビュースキル
hooks:
  PostToolUse:
    - matcher: "Edit"
      hooks:
        - type: command
          command: "jq -r '.tool_input.file_path' | xargs npx eslint --fix"
---

# コードレビュースキル

コードの品質をチェックし、改善提案を行います。
編集後に自動で ESLint が実行されます。
```

| メリット | 説明 |
| --- | --- |
| スキルと一緒に管理 | スキルに必要なフックがスキルファイル内で完結するため、設定の分散を防げます。 |
| スキル有効時のみ発火 | フロントマターで定義したフックは、そのスキルがアクティブなときだけ実行されます。 |

> [!TIP]
> `settings.json` のフックはグローバルに常時有効です。一方、スキル内のフックはそのスキルが有効な間だけ動作します。「どんなスキルでも常にフォーマットしたい」場合は `settings.json` に、「このスキルを使うときだけ lint したい」場合はスキル内に定義しましょう。

## Plugins の概念

Plugin（プラグイン）は、Claude Code の拡張機能を 1 つのインストール可能なパッケージにまとめる仕組みです。**Skills、Hooks、サブエージェント、MCP サーバー設定**を 1 つのユニットにバンドルし、リポジトリ間で再利用できます。

### プラグインのディレクトリ構造

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json   # マニフェスト（プラグイン名・バージョン・説明など）
├── skills/
│   ├── review/
│   │   └── SKILL.md  # コードレビュー用スキル
│   └── deploy/
│       └── SKILL.md  # デプロイ用スキル
├── hooks/
│   └── hooks.json    # イベント駆動の自動化ルール
├── agents/
│   └── security.md   # セキュリティ特化サブエージェント
└── .mcp.json         # MCP サーバー接続設定
```

| パス | 内容 |
| --- | --- |
| `.claude-plugin/plugin.json` | プラグインのメタデータ（名前・バージョン・説明など）を定義するマニフェスト |
| `skills/<name>/SKILL.md` | 再利用可能なワークフローやナレッジを定義するスキルディレクトリ |
| `hooks/hooks.json` | イベント駆動の自動化ルールを定義する設定ファイル |
| `agents/` | 専用のシステムプロンプトとツール制限を持つサブエージェント |
| `.mcp.json` | 外部サービス接続のための MCP サーバー設定 |

### 名前空間によるスキルの参照

プラグイン内のスキルは、プラグイン名をプレフィックスとした名前空間付きで公開されます。これにより、複数のプラグインが同じ名前のスキルを持っていても衝突しません。

```text
/my-plugin:review     ← my-plugin の review スキル
/my-plugin:deploy     ← my-plugin の deploy スキル
/other-plugin:review  ← 別プラグインの review（衝突しない）
```

### インストールとリポジトリ間の再利用

プラグインはパッケージとしてインストールできるため、チーム全体で統一された開発環境を簡単に共有できます。一度作成したプラグインを複数のリポジトリで再利用することで、設定のコピーペーストを排除し、メンテナンスを一元化できます。

```text
Plugin 作成 → 公開 / 共有 → 各リポジトリにインストール
```

プラグインの管理は Claude Code 内のスラッシュコマンド `/plugin` から行います。Marketplace 経由のインストールや一覧表示、削除はインタラクティブに操作できます。開発中のプラグインを動作確認したい場合は、`--plugin-dir` フラグでローカルパスを指定して読み込みます。

```bash
# Claude Code 内でプラグイン管理 UI を開く
/plugin

# Marketplace のプラグインをインストール
/plugin install <plugin-name>

# 開発中のプラグインをローカルから読み込む
claude --plugin-dir ./my-plugin
```

> [!IMPORTANT]
> Plugins は Skills / Hooks / Agents / MCP を「束ねて配る」レイヤーです。個別に配布すると散らかりやすい拡張資産を、バージョン付きのパッケージとしてまとめられる点が価値の中核になります。

## Marketplaces（マーケットプレイス）

Marketplaces は、プラグインのホスティング・配布を行うプラットフォームです。チームや組織でプラグインコレクションを管理し、標準化された開発環境を共有するための基盤として設計されています。

| 役割 | 説明 |
| --- | --- |
| プラグインのホスティング | 作成したプラグインを公開し、他のユーザーやチームが発見・インストールできるようにします。 |
| チーム / 組織での管理 | 組織内で承認済みのプラグインセットを管理し、メンバー全員の環境を統一できます。 |
| 標準化された開発環境 | フォーマッター設定、lint ルール、デプロイ手順などをプラグインとして統一配布します。 |
| 将来のビジョン | コミュニティによるプラグインエコシステムの発展、レビュー・評価システムなどが構想されています。 |

> [!TIP]
> まとめ: Hooks は「LLM を介さない決定論的な自動化」、Plugins は「拡張機能のパッケージ化と配布」、Marketplaces は「その配布を束ねる場」です。まずは `settings.json` に 1 つだけフックを追加するところから始め、チームで共有したくなったら Plugin 化を検討しましょう。

## 関連ページ

- [Hooks（公式ドキュメント）](https://code.claude.com/docs/en/hooks)
- [Plugins（公式ドキュメント）](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplaces（公式ドキュメント）](https://code.claude.com/docs/en/plugin-marketplaces)
- [Skills（Plugin にバンドルして配布する）](https://code.claude.com/docs/en/skills)
