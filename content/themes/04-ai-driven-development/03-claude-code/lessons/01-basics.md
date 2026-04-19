---
title: "Claude Code の基本構造"
description: "Claude Codeとは何か、.claude ディレクトリ・settings.json・CLAUDE.md の役割と他のAIツールとの違いを解説。"
order: 1
type: lecture
category: overview
difficulty: intermediate
tags: [claude-code, ai-coding, fundamentals, concept]
estimatedMinutes: 12
status: published
---
💡 Tip：

.claude ディレクトリの構造、settings.json の設定、 対話モードと非対話モードの使い分けなど、Claude Code の基本操作をまとめて解説します。

## このページで学べること

## .claude ディレクトリの構造

Claude Code の設定やメモリは、 ホームディレクトリとプロジェクトルートの 2 箇所に配置される .claude ディレクトリで管理されます。

### ホームディレクトリ（~/.claude/）

ユーザー全体に適用される設定やルールが格納されます。 どのプロジェクトで Claude Code を起動しても、ここの設定は常に読み込まれます。

```text
~/.claude/
├── CLAUDE.md          # グローバルな指示（全プロジェクト共通のルール）
├── settings.json      # ユーザー設定（許可ツール、APIキー設定など）
├── credentials.json   # 認証情報（自動管理、手動編集不要）
├── commands/          # カスタムスラッシュコマンド（グローバル）
│   └── my-command.md
├── memories/          # 自動メモリ（プロジェクト横断で学習した情報）
└── projects/          # プロジェクト別の自動メモリ
    └── <project-hash>/
        └── MEMORY.md
```

### プロジェクトルート（.claude/）

プロジェクト固有の設定が格納されます。 チームで共有する場合は Git で管理することを推奨します。

```text
your-project/
├── CLAUDE.md          # プロジェクト固有の指示（最も重要）
├── .claude/
│   ├── settings.json  # プロジェクト設定（許可ツール、MCP設定など）
│   └── commands/      # プロジェクト固有のカスタムコマンド
│       └── deploy.md
└── src/
    └── CLAUDE.md      # サブディレクトリ固有の指示（オプション）
```

### 設定の読み込み優先順位

プロジェクト固有の設定（MCP サーバー、許可ツールなど）

ユーザー全体の設定（グローバルな許可ツール、デフォルト設定）

設定ファイルがない場合に使われるデフォルト値

## settings.json の設定

settings.json は Claude Code の動作を制御する設定ファイルです。 許可するツール、MCP サーバーの接続、環境変数などを定義します。

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(npm run *)",
      "Bash(git *)"
    ],
    "deny": [
      "Bash(rm -rf *)"
    ]
  },
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-playwright"]
    }
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```

### 主な設定項目

## CLAUDE.md — プロジェクトの "取扱説明書"

CLAUDE.md は、Claude Code に対する永続的な指示書です。 プロジェクトのルール、コーディング規約、アーキテクチャの方針などを記述しておくと、 セッションを開始するたびに Claude が自動的に読み込み、それに従って動作します。

### CLAUDE.md とは

CLAUDE.md はいわば「Claude Code へのシステムプロンプト」です。 毎回チャットで伝え直す必要なく、プロジェクト固有の知識やルールを常に反映させることができます。

セッションごとに自動で読み込まれる

Git 管理して全員に同じルールを適用

プロジェクト文脈をClaude が正しく理解

### 配置場所と読み込み順序

CLAUDE.md は複数の場所に配置でき、すべてが統合されて読み込まれます。 スコープが狭いほど優先されるため、サブディレクトリの指示がプロジェクト全体の指示を上書きします。

全プロジェクト共通のルール。コーディングスタイルの好み、使用言語の設定など個人的な指示に最適。

プロジェクト固有のルール。アーキテクチャ、技術スタック、ビルドコマンドなどを記述。 最も重要な CLAUDE.md です。Git で管理してチームに共有しましょう。

特定のディレクトリに限定した指示。そのディレクトリ内のファイルを操作する際に追加で読み込まれる。

### 何を書くべきか

CLAUDE.md に書く内容に正解はありませんが、以下のカテゴリが特に効果的です。

ビルド、テスト、lint、デプロイなどのコマンドを記述。 Claude がコマンドを推測する必要がなくなります。

フレームワーク、ディレクトリ構造、主要なパターンを説明。 新しいコードが既存のアーキテクチャに沿って生成されます。

命名規則、インポート順序、エラーハンドリングのルールなど。 チームのスタイルに一致したコードが生成されます。

「any 型を使わない」「console.log をコミットしない」など、 Claude に避けさせたいパターンを明記します。

### CLAUDE.md の実例

プロジェクトルートに置く CLAUDE.md の具体的な書き方の例です。 claude /init コマンドで 自動生成することもできます。

```bash
# CLAUDE.md

## プロジェクト概要
ECサイトのバックエンドAPI。Next.js App Router + Prisma + PostgreSQL。

## コマンド
\`\`\`bash
npm run dev       # 開発サーバー起動 (localhost:3000)
npm run build     # プロダクションビルド
npm run test      # Jest でテスト実行
npm run lint      # ESLint + Prettier
npm run db:push   # Prisma スキーマを DB に反映
\`\`\`

## アーキテクチャ
- app/ ディレクトリベースルーティング（App Router）
- app/api/ に Route Handlers を配置
- lib/ に共有ユーティリティ
- prisma/schema.prisma でデータモデル定義

## コーディング規約
- TypeScript strict モード、any 型禁止
- コンポーネントは named export を使用
- エラーハンドリングは Result 型パターンで統一
- テストは __tests__/ ディレクトリに配置

## 禁止事項
- console.log をコミットしない（logger を使う）
- API キーをハードコードしない（環境変数を使う）
- default export は page.tsx と layout.tsx のみ
```

### /init で自動生成する

対話モードで /init コマンドを実行すると、Claude がプロジェクトの構造を分析して CLAUDE.md を自動生成してくれます。これをベースに必要な情報を加筆するのが効率的です。

```bash
$ claude
> /init

Claude: プロジェクトを分析しています...

✓ package.json を解析 → Next.js 16 + TypeScript プロジェクト
✓ ディレクトリ構造を分析 → App Router パターン
✓ 設定ファイルを確認 → ESLint, Tailwind CSS, PostCSS

CLAUDE.md を生成しました。内容を確認してください。
```

## 基本的な使い方

### インストールと初期設定

Claude Code は npm パッケージとして配布されています。 Node.js 18 以上の環境で、以下のコマンドを実行するだけでセットアップが完了します。

```bash
# グローバルインストール
npm install -g @anthropic-ai/claude-code

# プロジェクトディレクトリで起動
cd your-project
claude

# 初回は認証フローが開始
# ブラウザで Anthropic アカウントにログイン → 認証完了
```

/init で CLAUDE.md が自動生成され、プロジェクトの文脈が Claude に伝わります

Claude Code には大きく分けて対話モードと 非対話モードの 2 つの使い方があります。 状況に応じて使い分けることで、効率的に開発を進められます。

### 対話モード

最も基本的な使い方です。ターミナルで claude と入力して起動し、自然言語で指示を出します。 Claude は質問に答えたり、コードを編集したり、コマンドを実行したりします。

```bash
$ claude
╭──────────────────────────────────────╮
│ Claude Code                          │
│                                      │
│ /help for available commands         │
╰──────────────────────────────────────╯

> このプロジェクトの構造を教えて

Claude: このプロジェクトは Next.js App Router を使った
Web アプリケーションです。主な構造は...

> src/components/Header.tsx にダークモード切替ボタンを追加して

Claude: Header.tsx を編集してダークモード切替ボタンを
追加しました。変更内容は...
```

### 非対話モード（-p / --print）

ワンショットで質問に答えてもらいたい場合や、 スクリプト・CI パイプラインに組み込みたい場合に使います。 結果を出力して即座に終了します。

```bash
# 質問に回答して終了
claude -p "package.json の依存関係を一覧にして"

# パイプと組み合わせて使う
cat error.log | claude -p "このエラーログの原因を分析して"

# 特定のファイルを渡して分析
claude -p "このコードのセキュリティリスクを指摘して" < auth.ts
```

### 初期プロンプト付き起動

対話モードで起動しつつ、最初の質問を一緒に渡すことができます。

```bash
# 質問を渡して対話モードを開始
claude "このプロジェクトのテストカバレッジを改善したい"

# セッション再開
claude -c              # 直前のセッションを再開
claude -r              # 過去のセッション一覧から選択
```

## 権限システム

Claude Code はファイルの編集やコマンドの実行を行う際に、 ユーザーの明示的な許可を求めます。 これにより、意図しない変更やコマンド実行を防ぎ、安全に作業を進められます。

### 権限確認の種類

ファイルの内容を読む操作。デフォルトで許可されています。

ファイルの作成・編集・削除。操作ごとにユーザーの確認が必要です。 diff が表示されるので、変更内容を確認してから承認できます。

シェルコマンドの実行。実行前にコマンド内容が表示され、 承認するまで実行されません。

### 権限の事前設定

毎回の確認が煩わしい場合は、settings.json で許可ルールを事前に設定できます。 よく使うコマンドやツールを許可リストに追加しておくと、スムーズに作業できます。

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(npm test *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)"
    ]
  }
}
```

## 典型的なワークフロー

Claude Code を日常の開発に組み込む際の、典型的なワークフローを紹介します。

### 新機能の開発フロー

「このプロジェクトの構造を教えて」「認証周りのコードを説明して」 など、まずプロジェクトの理解から始める

「ユーザープロフィール機能を追加したい。どういう実装方針がいい？」 のように、まず計画を相談する

「その方針で実装して」と指示。Claude がファイルの作成・編集を実行。 変更ごとに diff を確認して承認する

「テストを実行して」「lint を通して」など、品質チェックを依頼。 エラーがあれば Claude が自動で修正を提案

「変更をコミットして」「PR を作成して」で Git 操作も Claude に任せられる。 コミットメッセージも自動生成してくれる

### 効率的に使うコツ

「コードを直して」より「src/auth.ts の validateToken 関数で JWT の有効期限チェックが漏れているので追加して」の方が正確な結果が得られます

プロジェクトのルールや規約を CLAUDE.md に書いておくと、 毎回指示しなくても Claude が従ってくれます

大きなタスクは一度に全部頼まず、ステップに分けて依頼する方が 品質の高い結果が得られます

Claude の変更は必ず diff で確認してから承認しましょう。 意図しない変更を早期に発見できます

---

**原典**: `claude-code-website/app/features/basics/page.tsx`
