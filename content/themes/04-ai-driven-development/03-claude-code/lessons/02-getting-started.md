---
title: "Claude Code を使い始める"
description: "インストールから初回起動・認証・/init までの導入手順をまとめた入門ガイド。"
order: 2
type: lecture
category: overview
difficulty: intermediate
tags: [claude-code, ai-coding, fundamentals, tutorial]
estimatedMinutes: 15
status: published
---
# Claude Code を使い始める

Claude Code を初めて使う人向けに、インストールから初回起動、初期プロンプト付き起動や権限モードの基本までをまとめます。npm で入れてターミナルから `claude` を叩くだけで、エディタを問わず AI との対話型開発が始められます。

## 動作環境

- Node.js 18 以上 (LTS 推奨)
- macOS / Linux / Windows (WSL2 推奨)
- Anthropic アカウント (`https://console.anthropic.com/`)

> [!NOTE]
> Claude Code はエディタに依存しません。VS Code、Vim、JetBrains 系など、普段お使いのエディタをそのまま併用できます。

## インストール

Claude Code は npm パッケージとして配布されています。Node.js 18 以上の環境で、次のコマンドを実行するだけでセットアップが完了します。

```bash
# グローバルインストール
npm install -g @anthropic-ai/claude-code
```

インストール後、任意のプロジェクトディレクトリで `claude` を実行すると対話モードが起動します。

```bash
cd your-project
claude
```

## セットアップの流れ

初回セットアップの全体像は次の 4 ステップです。

1. `npm install -g @anthropic-ai/claude-code` でグローバルインストール
2. プロジェクトディレクトリに移動して `claude` を起動
3. ブラウザが開くので Anthropic アカウントで認証
4. `/init` を実行して `CLAUDE.md` を自動生成

## 認証

初回起動時にブラウザが開き、Anthropic アカウントでのログインを求められます。認証情報は `~/.claude/credentials.json` に保存され、以降は自動的に読み込まれます。このファイルは手動で編集する必要はありません。

> [!WARNING]
> `~/.claude/credentials.json` には認証情報が含まれます。Git リポジトリにコミットしないよう注意してください。

## /init でプロジェクトを学習させる

対話モードで `/init` を実行すると、Claude がプロジェクトの構造を解析して `CLAUDE.md` を自動生成します。この `CLAUDE.md` がプロジェクト固有の指示書として機能し、以降のセッションで自動的に読み込まれます。

```text
$ claude
> /init

Claude: プロジェクトを分析しています...

✓ package.json を解析 → Next.js 16 + TypeScript プロジェクト
✓ ディレクトリ構造を分析 → App Router パターン
✓ 設定ファイルを確認 → ESLint, Tailwind CSS, PostCSS

CLAUDE.md を生成しました。内容を確認してください。
```

生成された `CLAUDE.md` をベースに、プロジェクト固有のルールやコーディング規約を加筆していくのが効率的です。

## 対話モード

最も基本的な使い方です。ターミナルで `claude` と入力して起動し、自然言語で指示を出します。Claude は質問に答えたり、コードを編集したり、コマンドを実行したりします。

```text
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

## 非対話モード (-p / --print)

ワンショットで質問に答えてもらいたい場合や、スクリプト・CI パイプラインに組み込みたい場合に使います。結果を出力して即座に終了します。

```bash
# 質問に回答して終了
claude -p "package.json の依存関係を一覧にして"

# パイプと組み合わせて使う
cat error.log | claude -p "このエラーログの原因を分析して"

# 特定のファイルを渡して分析
claude -p "このコードのセキュリティリスクを指摘して" < auth.ts
```

> [!TIP]
> まずは対話モードで使い始めるのがおすすめです。慣れてきたら非対話モード (`-p`) を CI やスクリプトに組み込むと、自動化の幅が広がります。

## 初期プロンプト付き起動

対話モードで起動しつつ、最初の質問を一緒に渡すこともできます。セッションの再開もフラグひとつで行えます。

```bash
# 質問を渡して対話モードを開始
claude "このプロジェクトのテストカバレッジを改善したい"

# 直前のセッションを再開
claude -c

# 過去のセッション一覧から選択して再開
claude -r
```

`-c` は「continue (続ける)」、`-r` は「resume (選んで再開)」と覚えておくと便利です。

## 権限モードの基本

Claude Code はファイルの編集やコマンドの実行を行う際に、ユーザーの明示的な許可を求めます。これにより、意図しない変更やコマンド実行を防ぎ、安全に作業を進められます。

| 操作カテゴリ | 挙動 |
|---|---|
| 読み取り (Read) | デフォルトで許可。ファイルの内容を読むのみ |
| 書き込み (Write / Edit) | 操作ごとに diff が表示され、承認が必要 |
| コマンド実行 (Bash) | 実行前にコマンド内容が表示され、承認が必要 |

毎回の確認が煩わしい場合は、`settings.json` の `permissions.allow` によく使うコマンドを登録しておくと、スムーズに作業できます。セッション中の確認プロンプトで「Always allow」を選べば自動的に許可リストへ追加されます。

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
      "Bash(git status)",
      "Bash(git diff *)"
    ]
  }
}
```

> [!IMPORTANT]
> 対話中に `Shift + Tab` を押すと、通常モードと Plan モード (計画のみで実変更を行わないモード) を素早く切り替えられます。大きな変更を行う前に一度計画だけ立ててもらうと安心です。

## 最初に試したいワークフロー

Claude Code を日常の開発に組み込むなら、次の流れが基本になります。

1. **プロジェクトを理解してもらう**: 「このプロジェクトの構造を教えて」「認証周りのコードを説明して」など、まずプロジェクトの理解から始める。
2. **計画を立てる**: 「ユーザープロフィール機能を追加したい。どういう実装方針がいい？」と計画を相談する。
3. **実装を依頼する**: 「その方針で実装して」と指示し、変更ごとに diff を確認して承認する。
4. **テストと検証**: 「テストを実行して」「lint を通して」など、品質チェックを依頼。エラーがあれば修正提案まで任せる。
5. **コミットと PR**: 「変更をコミットして」「PR を作成して」で Git 操作もまとめて依頼できる。

> [!TIP]
> 指示は具体的にするほど精度が上がります。「コードを直して」より「`src/auth.ts` の `validateToken` 関数で JWT の有効期限チェックが漏れているので追加して」と伝えるのがコツです。

## 次のステップ

- **コマンド一覧**: スラッシュコマンドや CLI フラグの全体像を把握する。
- **メモリとコンテキスト管理**: `CLAUDE.md` の書き方とコンテキスト最適化を学ぶ。
- **MCP**: 外部ツールやデータソースとの接続を覚えると一気に表現力が広がる。

## 関連ページ

- [Claude Code quickstart（公式ドキュメント）](https://code.claude.com/docs/en/quickstart)
- [Claude Code setup（インストール・認証）](https://code.claude.com/docs/en/setup)
- [Memory（`CLAUDE.md` の書き方）](https://code.claude.com/docs/en/memory)
