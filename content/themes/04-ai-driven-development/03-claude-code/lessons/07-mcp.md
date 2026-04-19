---
title: "Model Context Protocol (MCP)"
description: "MCP サーバーの仕組み、Tools / Resources / Prompts の使い分けと接続例。"
order: 7
type: lecture
category: extension
difficulty: intermediate
tags: [claude-code, ai-coding, mcp]
estimatedMinutes: 15
status: published
---

# Model Context Protocol (MCP)

Model Context Protocol (MCP) を使って、Claude Code を外部のツールやサービスに接続する方法を学びます。プロトコルの考え方、設定ファイルの書き方、`/mcp` コマンドによる管理、代表的な MCP サーバー、そしてカスタム MCP サーバーの概要までをひととおり扱います。

## このページで学べること

- MCP (Model Context Protocol) の仕組みと 3 つの柱
- MCP サーバーの設定方法とスコープ
- ツールサーチによるコンテキスト効率化
- `/mcp` コマンドによるサーバー管理と OAuth 認証
- 代表的な MCP サーバーとその用途
- カスタム MCP サーバーの作成方法

## MCP とは

MCP (Model Context Protocol) は、AI モデルと外部ツール・サービスを接続するための **オープンプロトコル** です。Claude Code はこのプロトコルを通じて、データベース、チャットツール、プロジェクト管理ツール、ブラウザなど、さまざまな外部サービスの機能を利用できます。

### MCP アーキテクチャ

MCP は、Claude Code (クライアント) と MCP サーバー (外部サービスとの橋渡し役) の間で行われる通信規約を定めています。

```text
Claude Code  <-- MCP プロトコル -->  MCP サーバー  <-->  外部サービス
 (AI)          (標準化された通信)     (アダプター)        (DB / Slack / Jira / ブラウザ 等)
```

Claude Code は MCP プロトコルを介して、さまざまな外部サービスと双方向に通信します。サーバー側は自分が公開する機能を MCP の形式で定義し、Claude Code はそれを会話の中で呼び出します。

### MCP の 3 つの柱

MCP サーバーは次の 3 種類の要素を Claude Code に公開します。使い分けを押さえておくと、サーバーの挙動をイメージしやすくなります。

| 種類 | 役割 | 具体例 |
| :--- | :--- | :--- |
| Tools (ツール) | Claude が呼び出せる関数として公開される具体的なアクション | DB クエリ実行、Slack 送信、ブラウザ操作 |
| Resources (リソース) | Claude が参照できるデータをコンテキストとして提供 | ファイル内容、DB スキーマ、API レスポンス |
| Prompts (プロンプト) | サーバーが定義したテンプレートをスラッシュコマンドとして提供 | 定型的なレビューコマンドなど |

- **Tools** は「何かを行う」ための API で、副作用を伴うことが多いです。
- **Resources** は「読み取り用のデータ源」で、Claude が必要に応じて参照します。
- **Prompts** は「定型の呼び出し口」で、同じ操作を何度も繰り返すときに便利です。

### 接続方式 (トランスポート)

MCP サーバーと Claude Code の接続方法にはいくつかの種類があります。用途に応じて選びます。

| 方式 | 特徴 | 主な用途 |
| :--- | :--- | :--- |
| stdio | ローカルで子プロセスを起動し、標準入出力でやり取り | ローカル向けサーバー (Playwright、Context7 など) |
| SSE (Server-Sent Events) | HTTP 上でサーバーから長時間のストリームを受け取る | 中継サーバーやホスティング済みサーバー |
| HTTP | 通常の HTTP リクエスト／レスポンス | REST 的なリモート MCP サーバー |

`.mcp.json` では、サーバーごとにどのトランスポートで起動するかを記述します。もっとも一般的なのは `command` と `args` を指定する **stdio** 方式です。

## MCP サーバーの設定方法

MCP サーバーの設定はプロジェクトルートの `.mcp.json` ファイルに記述するのが公式推奨です。`mcpServers` オブジェクトにサーバー名をキーとして、起動コマンドと引数を指定します。このファイルを Git に含めることでチーム全体で設定を共有できます。

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-playwright"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

### 設定ファイルのスコープ

MCP サーバーの設定は 2 つのスコープで管理できます。プロジェクト単位の設定は `.mcp.json`、全プロジェクト共通の設定はユーザー設定ファイルに記述します。

| スコープ | パス | 説明 | 優先度 |
| :--- | :--- | :--- | :--- |
| project | `.mcp.json` | プロジェクト共通。Git に含めてチームで共有 (推奨) | 推奨 |
| user | `~/.claude/settings.json` | 全プロジェクト共通のユーザー設定 (`mcpServers` キーに記載) | 補助 |

> [!TIP]
> `.mcp.json` は Git に含めてチームで共有するファイルです。API キーなどの秘密情報は直接書かず、環境変数参照 (`${API_KEY}` のような記法) を使いましょう。個人的な設定のみ `~/.claude/settings.json` の `mcpServers` キーに追記します。設定変更後は **Claude Code を再起動** することで反映されます。

### コマンドラインから設定する方法

JSON ファイルを直接編集する代わりに、`claude mcp add` コマンドで MCP サーバーを登録することもできます。JSON の記法を気にせず手軽に追加・削除できるのが利点です。

```bash
# ユーザー設定に追加する (~/.claude/settings.json に反映)
claude mcp add playwright npx @playwright/mcp@latest

# 環境変数を指定して追加する
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=your_token \
  npx -y @modelcontextprotocol/server-github

# プロジェクト設定に追加する (.mcp.json に反映)
claude mcp add playwright --scope project npx @playwright/mcp@latest

# 登録済みサーバーの一覧を確認する
claude mcp list

# サーバーを削除する
claude mcp remove playwright
```

> [!NOTE]
> **使い分けの目安**: チームで統一する設定は `.mcp.json` に書いておき、個人の試用や一時的な追加はコマンドで行うのが実用的です。

## ツールサーチ

MCP サーバーを複数接続すると、利用可能なツールの数が膨大になります。Claude Code はコンテキストウィンドウを効率的に管理するために、**ツールサーチ** という仕組みを使っています。

### ツールのロード戦略

1. **セッション開始**: 接続済みの MCP サーバーから利用可能なツールを列挙します。
2. **上位 10% のツールを常時ロード**: 使用頻度の高いツールを優先してロードします。
3. **残りは必要に応じて動的ロード**: 会話の内容に応じて必要なツールを引き込みます。

使用頻度の高いツールを優先的にロードし、コンテキストウィンドウを節約する仕組みです。

> [!TIP]
> **なぜこれが重要か**: コンテキストウィンドウには上限があります。すべてのツール定義を常にロードすると、実際の作業に使えるコンテキストが減ってしまいます。ツールサーチにより、必要なツールだけを効率的にロードすることで、コンテキストを最大限に活用できます。

## `/mcp` コマンド

セッション中に `/mcp` と入力すると、MCP サーバーの管理ダイアログが開きます。設定済みのサーバー一覧の確認から OAuth 認証まで、MCP に関する操作をここで一元管理できます。

### 管理ダイアログでできること

- **サーバー一覧・ステータス確認** -- 接続中・設定済みのサーバーと現在の状態を確認
- **有効 / 無効の切り替え** -- サーバーをその場でオン・オフ
- **再接続** -- 切断されたサーバーに再接続
- **OAuth 認証・クリア** -- ブラウザ経由でログイン、または保存済みトークンを削除

### OAuth 認証フロー

GitHub など、認証が必要なリモートサーバーを初めて使う場合の手順です。

1. **サーバーを追加** -- `claude mcp add` で MCP サーバーを登録します。
2. **管理ダイアログを開く** -- セッション内で `/mcp` と入力します。
3. **ブラウザで認証** -- 画面の案内に従って外部サービスにログインします。
4. **接続完了** -- トークンは自動保存・自動更新されます。

認証を取り消したい場合は、管理ダイアログの **Clear authentication** から保存済みトークンを削除できます。

> [!IMPORTANT]
> OAuth トークンはユーザー設定に保存されます。共有マシンで作業する場合や、権限を変更したい場合は `/mcp` から明示的にクリアしましょう。

## 実務での活用イメージ

MCP を活用すると、調査・実装・検証・共有までの複数工程を 1 つの会話フローでつなげられます。

### 典型的な作業フロー

1. **要件整理・計画**: 実装計画を作成します。
2. **Resources**: 外部データをコンテキストに読み込みます (仕様書・DB スキーマなど)。
3. **Tools**: 実装・検証・報告を実行します (コード生成・ブラウザ検証・PR 作成など)。
4. **Prompts**: 定型タスクを再利用します (レビュー・リリースノート生成など)。

### 具体例: 設計〜リリースまでの一連の流れ

| サーバー | 役割 |
| :--- | :--- |
| Context7 | 公式ドキュメントを確認しながら設計 |
| Playwright | 実ブラウザで動作検証・スクリーンショット取得 |
| GitHub | PR 作成・レビュー依頼・Issue 管理 |

このように複数の MCP サーバーを組み合わせることで、Claude Code が「調べる → 作る → 試す → 共有する」までを会話の中で一気通貫に扱えるようになります。

## 代表的な MCP サーバー

Claude Code のエコシステムには、さまざまな MCP サーバーが用意されています。主要なサーバーとその用途を紹介します。

| サーバー | 用途 | 主な機能 |
| :--- | :--- | :--- |
| Playwright | ブラウザ自動化 | E2E テスト、スクリーンショット、フォーム操作 |
| Context7 | 公式ドキュメント | ライブラリドキュメント検索、API リファレンス |
| Serena | コード理解 | シンボル操作、プロジェクトメモリ、LSP 連携 |
| Sequential | 多段推論 | 複雑な分析、仮説検証、構造化思考 |
| Magic | UI 生成 | 21st.dev パターンからコンポーネント生成 |
| GitHub | GitHub 連携 | PR、Issue、コードレビュー、リポジトリ操作 |

### サーバーの特徴

- **Playwright** -- 実際のブラウザを起動してページ操作やテストを実行します。アクセシビリティスナップショットの取得も可能です。
- **Context7** -- React や Next.js などのフレームワークの公式ドキュメントをバージョン指定で参照できます。正確なパターンに基づいた実装に役立ちます。
- **Serena** -- セマンティックなコード理解により、関数のリネーム、参照検索、プロジェクト全体の構造把握を実現します。
- **Sequential** -- 多段階の推論エンジンとして機能し、複雑なデバッグや設計分析を体系的に進めます。
- **Magic** -- モダンな UI コンポーネントを 21st.dev のデザインパターンに基づいて生成します。
- **GitHub** -- Pull Request の作成・レビューや Issue のトリアージなど、GitHub のワークフローを Claude から直接操作できます。

そのほかにも Slack、Notion、Jira、各種データベース、クラウドサービス向けの MCP サーバーが公式・コミュニティから提供されています。

## カスタム MCP サーバーの作成

> [!NOTE]
> **発展知識**: このセクションは自社・社内サービスを Claude Code に接続したい開発者向けの内容です。まず公式が提供する MCP サーバーを使いこなすことを優先し、必要になったときに参照してください。

Playwright や GitHub など、公式の MCP サーバーが存在しないサービスを Claude Code に繋ぎたい場合に、カスタム MCP サーバーを自分たちで作成します。カスタム MCP サーバーは既存の REST API・CLI・データベースなどを MCP プロトコルに対応させる **アダプター** として機能します。

### 主なユースケース

- **社内 REST API** -- API をラップして Claude からデータ取得・操作できるようにする
- **社内データベース** -- SQL クエリを MCP ツールとして公開し、Claude がデータを参照できるようにする
- **独自の CLI ツール** -- コマンド実行を MCP 経由で呼び出せるようにする
- **社内固有のワークフロー** -- 複数の処理をまとめた MCP ツールとして定義し、Claude に自動化させる

### 実装イメージ

カスタム MCP サーバーは、公式 SDK を使って短いコードで書き始められます。TypeScript の場合のイメージは次のとおりです。

```ts
// 社内 REST API を MCP ツールとして公開する例
const server = new MCPServer({
  name: "my-internal-api",
  tools: [
    {
      name: "get_user",
      description: "社内 API からユーザー情報を取得",
      handler: async (params) => {
        return await internalApi.get(`/users/${params.userId}`);
      },
    },
  ],
});
```

ポイントは次のとおりです。

- **Tools / Resources / Prompts のどれを公開するかを決める**: まずはツールだけでも十分です。
- **入出力のスキーマを明確にする**: Claude が適切に呼び出せるよう、引数と返り値をわかりやすく定義します。
- **認証と権限を設計する**: 社内 API であってもトークンや権限スコープを慎重に扱います。

> [!CAUTION]
> 社内データや本番環境に触れる MCP サーバーを作る場合は、**どの操作を許可するか** を明示的に絞り込みましょう。読み取り専用のツールから始め、更新系は段階的に追加するのが安全です。

> [!TIP]
> **参考**: カスタム MCP サーバーの作成方法については、[MCP 公式仕様](https://modelcontextprotocol.io) を参照してください。TypeScript・Python をはじめ、複数の言語で SDK が提供されています。

## まとめ

- MCP は Claude Code と外部サービスをつなぐ **オープンプロトコル** で、Tools / Resources / Prompts の 3 種類の要素を公開します。
- 設定は `.mcp.json` (プロジェクト共有) と `~/.claude/settings.json` (ユーザー共通) の 2 スコープで管理します。
- 複数サーバー接続時は **ツールサーチ** によりコンテキストを効率的に使います。
- `/mcp` コマンドからサーバーの有効化・再接続・OAuth 認証をまとめて管理できます。
- Playwright・Context7・GitHub などの既成サーバーに加え、自社システム向けにカスタム MCP サーバーを作成することもできます。

## 関連ページ

- [Model Context Protocol (公式ドキュメント)](https://code.claude.com/docs/en/mcp)
- [MCP 仕様 (modelcontextprotocol.io)](https://modelcontextprotocol.io)
- [Subagents (MCP サーバーと連携させる)](https://code.claude.com/docs/en/sub-agents)
