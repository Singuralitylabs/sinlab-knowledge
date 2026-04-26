---
title: "Plugins"
description: "Skills / Hooks / Agents / MCP をパッケージ化する Plugins と、配布基盤の Marketplaces を解説。"
order: 9
type: lecture
category: extension
difficulty: intermediate
tags: [claude-code, ai-coding, plugins]
estimatedMinutes: 10
status: published
---
# Plugins

Skills、Hooks、サブエージェント、MCP サーバーといった主要な拡張要素（さらに LSP サーバーやバックグラウンドモニターなども）を 1 つのパッケージにまとめて配布できる「Plugins」の仕組みと、その配布基盤である「Marketplaces」を解説します。チームやコミュニティで共通の拡張機能を共有したいときの中核的な仕組みです。

## このページで学べること

- Plugin の構造（マニフェスト、`skills/` / `hooks/` / `agents/` / `.mcp.json` の同梱）
- 名前空間によるスキル参照（`/plugin-name:skill-name`）
- `/plugin` コマンドによる管理と、`--plugin-dir` を使ったローカル開発
- Marketplaces の位置付けとチーム配布の考え方

## Plugins の概念

Plugin（プラグイン）は、Claude Code の拡張機能を 1 つのインストール可能なパッケージにまとめる仕組みです。主要なコンポーネントとして **Skills、Hooks、サブエージェント、MCP サーバー設定** を 1 つのユニットにバンドルでき、加えて LSP サーバー（`.lsp.json`）、バックグラウンドモニター（`monitors/`）、実行ファイル（`bin/`）、デフォルト設定（`settings.json`）も同梱可能です。これらをまとめてリポジトリ間で再利用できます。

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
| `commands/` | 旧形式のフラットな Markdown スキル（互換用。新規プラグインでは `skills/` を推奨） |
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

プラグインの管理は Claude Code 内のスラッシュコマンド `/plugin` から行います。Marketplace 経由のインストールや一覧表示、削除はインタラクティブに操作できます。開発中のプラグインを動作確認したい場合は、`--plugin-dir` フラグでローカルパスを指定して読み込みます。変更を反映するときはセッション内で `/reload-plugins` を実行すれば、再起動なしで再読み込みできます。

```bash
# Claude Code 内でプラグイン管理 UI を開く
/plugin

# Marketplace のプラグインをインストール（@マーケットプレイス名 が必須）
# 例: 公式マーケットプレイス（claude-plugins-official）から GitHub プラグインを入れる
/plugin install <plugin-name>@<marketplace-name>
/plugin install github@claude-plugins-official

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
> まとめ: [Hooks](/themes/04-ai-driven-development/02-claude-code/hooks) は「LLM を介さない決定論的な自動化」、Plugins は「拡張機能のパッケージ化と配布」、Marketplaces は「その配布を束ねる場」です。まずは `settings.json` に 1 つだけ Hooks を追加するところから始め、チームで共有したくなったら Plugin 化を検討しましょう。

## 関連ページ

- [Plugins（公式ドキュメント）](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplaces（公式ドキュメント）](https://code.claude.com/docs/en/plugin-marketplaces)
- [Skills（Plugin にバンドルして配布する）](https://code.claude.com/docs/en/skills)
