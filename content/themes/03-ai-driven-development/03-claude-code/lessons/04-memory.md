---
title: "メモリとコンテキスト管理"
description: "CLAUDE.md / 自動メモリ / コンテキスト圧縮など、Claude Code のメモリ機能を体系的に整理。"
order: 4
type: reference
difficulty: intermediate
tags: [claude-code, ai-coding, memory, reference]
estimatedMinutes: 10
status: published
---
💡 Tip：

CLAUDE.md によるプロジェクト知識の永続化、自動メモリ、コンテキスト圧縮、セッション管理など、 Claude Code がどのように情報を記憶・活用するかを詳しく解説します。

## このページで学べること

## CLAUDE.md とは

CLAUDE.md は、Claude Code がセッション開始時に最初に読み込むマークダウンファイルです。 プロジェクトの概要、ビルドコマンド、コーディング規約、アーキテクチャの方針など 「Claude に常に覚えていてほしい情報」をここに書いておきます。

人間にとっての「プロジェクト README + チーム開発ルール集」にあたるものを、 AI 向けに最適化した形式で記述するイメージです。 Claude Code はこのファイルの内容をシステムプロンプトの一部として扱い、 全てのやり取りに反映します。

```bash
# CLAUDE.md

## Project Overview
Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 のWebサイト。
日本語コンテンツの教育用サイト。

## Commands
npm run dev      # 開発サーバー起動 (localhost:3000)
npm run build    # プロダクションビルド
npm run lint     # ESLint 実行

## Architecture
- App Router: app/ ディレクトリベースルーティング
- Server Components がデフォルト
- Client Component は最小限（状態管理が必要な場合のみ）

## Conventions
- TypeScript strict mode を使用
- コンテンツは全て日本語
- コンポーネントは app/components/ に配置
- パスエイリアス: @/* → プロジェクトルート
```

### CLAUDE.md に書くべきこと / 書かないこと

## CLAUDE.md の階層構造

CLAUDE.md は 3 つの階層に配置できます。 Claude Code はセッション開始時にこれらを全て読み込み、内容をマージします。 より限定的なスコープの指示が優先されます。

### CLAUDE.md の読み込み階層

全プロジェクト共通のルール（個人設定、コーディングスタイル）

プロジェクト固有のルール（アーキテクチャ、コマンド、規約）

ディレクトリ固有のルール（そのフォルダの作業時のみ読み込み）

さらに、 @path/to/file.md 構文を使うことで、CLAUDE.md から別のマークダウンファイルをインポートできます。 これにより、内容を分割して管理しやすくなります。

```text
# CLAUDE.md

## 基本ルール
- TypeScript strict mode を使用
- テストは必ず書く

## 詳細ドキュメント
@docs/architecture.md
@docs/coding-standards.md
@docs/api-guidelines.md
```

## 自動メモリ

Claude Code は作業中に学んだパターンやプロジェクト固有の知識を 自動的に記録します。 明示的に「覚えて」と指示しなくても、会話の中で重要だと判断した情報を メモリに保存し、次のセッションでも活用します。

### 自動メモリに記録される情報の例

このプロジェクトでは fetch の代わりに axios を使う、 エラーハンドリングは Result 型で統一する、など

状態管理は Zustand を使用、API レイヤーは Repository パターンで実装、など

日本語でコメントを書く、型は明示的に書く、 テストは describe/it スタイルで書く、など

データベースのテーブル構造、API エンドポイントの規則、 特殊な命名規則、など

### メモリの保存場所

自動メモリは以下の場所に保存されます。 これらのファイルはユーザーが直接編集することも可能です。

```text
# ユーザーレベルのメモリ
~/.claude/memories/

# プロジェクトレベルのメモリ
.claude/memories/
```

## コンテキスト圧縮（/compact）

Claude Code との会話が長くなると、コンテキストウィンドウ（Claude が一度に 保持できる情報量）が不足してきます。 /compact コマンドは、これまでの会話を要約して圧縮し、コンテキストの空きを確保します。

### /compact の処理フロー

要約後のコンテキストは元の会話より大幅に小さくなり、新しい会話のための余裕が生まれます

/compact にはオプションでフォーカス指示を添えることができます。 何を優先的に残すかを指定することで、圧縮後も重要な情報が失われにくくなります。

```text
# TypeScript の型情報を優先的に残す
/compact TypeScript の型情報を優先的に残して

# アーキテクチャの議論を残す
/compact アーキテクチャに関する決定事項を優先して

# 直近のエラーのデバッグ情報を残す
/compact 直近のバグ修正に関連する情報を残して
```

### /compact を使うタイミング

## セッション管理

Claude Code は会話の履歴をセッションとして保存しています。 過去のセッションを再開したり、名前をつけて管理したりすることで、 作業の中断・再開をスムーズに行えます。

### セッション管理のワークフロー例

claude で起動し、認証機能の実装を開始

/rename auth-implementation でセッションに名前をつけてから離席

claude -c で直前のセッションから再開し、続きの作業

claude -r で一覧から「auth-implementation」を選択して再開

## タスクリスト

Claude Code には TODO 追跡のためのタスクリスト機能が組み込まれています。 複雑な作業を分解し、進捗をリアルタイムで管理できます。 特筆すべき点として、タスクリストは コンテキスト圧縮（/compact）後も保持される ため、長いセッションでも作業の全体像を見失いません。

### タスクリストの操作方法

作業中にいつでもトグルして進捗を確認できます

作業の進行に応じて、未着手 / 進行中 / 完了 のステータスが自動的に変わります

### タスク進行の例

「ユーザー認証を実装して」と依頼した場合のタスクリストの変化：

## 関連ページ

CLAUDE.md から分離した詳細な手順や知識を、再利用可能なスキルとして定義する方法

サブエージェント、Agent Teams、Cowork による並列・協調作業の仕組み

---

**原典**: `claude-code-website/app/features/memory/page.tsx`
