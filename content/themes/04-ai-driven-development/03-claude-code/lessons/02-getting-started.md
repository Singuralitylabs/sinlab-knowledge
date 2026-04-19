---
title: "Claude Code を使い始める"
description: "インストールから初回起動・認証・/init までの導入手順をまとめた入門ガイド。"
order: 2
type: lecture
category: overview
difficulty: intermediate
tags: [claude-code, ai-coding, fundamentals, tutorial]
estimatedMinutes: 8
status: published
---
Claude Code を初めて使う人向けに、インストールから初回起動までを最短経路でまとめます。

## 動作環境

- Node.js 18 以上 (LTS 推奨)
- macOS / Linux / Windows (WSL2 推奨)
- Anthropic アカウント (`https://console.anthropic.com/`)

## インストール

npm でグローバルインストールします。

```bash
npm install -g @anthropic-ai/claude-code
```

インストール後、任意のプロジェクトディレクトリで `claude` を実行すると対話モードが起動します。

```bash
cd your-project
claude
```

## 認証

初回起動時にブラウザが開き、Anthropic アカウントでのログインを求められます。
認証情報は `~/.claude/credentials.json` に保存され、以降は自動的に読み込まれます。

## /init でプロジェクトを学習させる

対話モードで `/init` を実行すると、Claude がプロジェクトの構造を解析して `CLAUDE.md` を自動生成します。
この `CLAUDE.md` がプロジェクト固有の指示書として機能し、以降のセッションで自動的に読み込まれます。

```text
> /init
Claude: プロジェクトを分析しています...
✓ package.json を解析
✓ ディレクトリ構造を分析
CLAUDE.md を生成しました。
```

## 次のステップ

- **コマンド一覧**: スラッシュコマンドや CLI フラグの全体像を把握する。
- **メモリとコンテキスト管理**: `CLAUDE.md` の書き方とコンテキスト最適化を学ぶ。
- **MCP**: 外部ツールやデータソースとの接続を覚えると一気に表現力が広がる。

> このレッスンは新規執筆です。Claude Code の更新に合わせて随時アップデートします。
