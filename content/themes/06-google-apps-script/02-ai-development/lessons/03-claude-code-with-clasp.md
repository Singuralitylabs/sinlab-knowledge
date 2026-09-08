---
title: "Claude Code と clasp mcp による開発ワークフロー"
description: "clasp 3.x の MCP サーバー（clasp mcp）を Claude Code に接続し、AI エージェントが push・実行・ログ取得を自律的に行う次世代の開発フローを解説。"
order: 3
type: lecture
difficulty: beginner
tags: [gas, google-apps-script, clasp, claude-code, mcp]
status: published
---

# Claude Code と clasp mcp による開発ワークフロー

前ページでは、`clasp` を使ってローカルでファイルを編集し、コマンドで push する方法を学びました。これだけでも大幅に開発体験は向上しますが、コードを修正するたびにターミナルで `clasp push` を叩き、実行結果を確認するのは人間側の手作業です。

この手作業をエージェントに委譲し、AI 主導の開発サイクルを完成させるのが **`clasp mcp`** です。

[Model Context Protocol (MCP)](/themes/04-ai-driven-development/02-claude-code/mcp) を介して Claude Code と clasp を接続することで、AI エージェントはローカルコードの編集だけでなく、**自らコードを push し、リモート関数を実行し、ログを読み取って自己修正する** ことが可能になります。

## このページで学べること

- clasp 3.x に実験的に搭載された `clasp mcp` の役割と仕組み
- Claude Code へのプラグイン・手動 MCP サーバー追加手順
- 認証資格情報（`~/.clasprc.json`）の共有モデル
- AI エージェントに push / run-function / ログ確認を任せる実演シナリオ
- エージェントに任せる際の安全管理とスコープ

## clasp mcp とは何か

`clasp mcp`（または `clasp start-mcp-server`）は、clasp を **MCP サーバー（標準入出力 STDIO トランスポート）** として起動するコマンドです。

```text
+-------------------+           +-------------------+           +-----------------------+
|    Claude Code    |  STDIO    |     clasp mcp     |  REST API |  Google Apps Script   |
|   (AI エージェント) | <=======> |   (MCP サーバー)   | <=======> |     (クラウド環境)      |
+-------------------+           +-------------------+           +-----------------------+
    │                               │
    ├─ ファイルの読み書き (ローカル)        ├─ clasp push の実行
    └─ ツールの呼び出し ───────────────┼─ clasp run-function の実行
                                    └─ ログ・ステータスの取得
```

### なぜ MCP なのか？

Claude Code にシェルコマンド（`clasp push` など）を直接実行させることも可能ですが、MCP ツールとして定義されることで、以下のようなメリットが生まれます。

1. **ツールの明確な構造化**: 引数のスキーマ（関数名、パラメータなど）が厳密に定義され、AI の誤用やコマンド構文ミスが防げる。
2. **プロジェクト境界の分離**: MCP サーバーは起動ディレクトリに縛られず、ツール呼び出し時にプロジェクトパスを受け取って柔軟に動作する。
3. **安全な権限管理**: 危険な破壊的操作に対して、確認プロンプト（承認ゲート）を制御しやすい。

## Claude Code への導入手順

Claude Code に clasp mcp を組み込むには、以下の 2 つの方法があります。

### 方法 1: プラグインとしてインストール（推奨）

[Claude Code プラグイン](/themes/04-ai-driven-development/02-claude-code/plugins) 機能を使って、公式リポジトリからワンステップでインストールします。

```bash
# Claude Code のプロンプト内で実行
/plugin install @google/clasp
```

プラグインとして導入すると、必要な MCP サーバー設定が自動的に環境に追加されます。

### 方法 2: 手動で MCP サーバーを追加

手動で `claude mcp add` コマンドを使って登録することも可能です。

```bash
# ターミナルで実行
claude mcp add clasp -- npx -y @google/clasp mcp
```

または、プロジェクト単位の `.mcp.json` やユーザー設定に以下のように記述します。

```json
{
  "mcpServers": {
    "clasp": {
      "command": "npx",
      "args": ["-y", "@google/clasp", "mcp"]
    }
  }
}
```

登録後、Claude Code のセッション内で `/mcp` を実行し、`clasp` サーバーが `connected` 状態になっていることを確認します。

## 資格情報（Credentials）の扱い

clasp mcp を使う上で最も重要なポイントは、**「認証は通常の clasp CLI と共通の資格情報を使用する」** という点です。

```bash
# 事前にターミナルで一度だけ実行しておく
clasp login
```

`clasp login` に成功すると、ホームディレクトリに `~/.clasprc.json` が生成されます。`clasp mcp` サーバーはこの既存の認可トークンをそのまま読み込んで Google API と通信します。

したがって、MCP サーバー起動時に対話的な OAuth 認証画面が立ち上がったり、API キーを環境変数に直書きしたりする必要はありません。

> [!IMPORTANT]
> Google アカウントを切り替えたい場合は、ターミナルで `clasp login --user <アカウント名>` を行い、Claude Code 側の MCP サーバーを再起動します。

## 実演シナリオ：Claude Code に任せる開発ループ

Claude Code と clasp mcp を組み合わせると、人間は自然言語で要件を指示するだけで、AI が実装からクラウドへのプッシュ・動作検証までを自律して進めてくれます。

### プロンプトの例

```text
ユーザー:
「スプレッドシートの A 列にメールアドレス、B 列に名前が一覧されている。
  C 列が空欄の行に対して挨拶メールを一括送信し、送信完了したら C 列に
  現在日時を書き込む関数 `sendWelcomeEmails` を作って。
  実装したら clasp で push して、動作テスト関数を一度実行してみて。」
```

### Claude Code の自律アクションの流れ

1. **コンテキストの収集**:
   - ローカルの `appsscript.json` や既存のコード（`src/Code.js` 等）を読み取る。
2. **コードの実装**:
   - `SpreadsheetApp` のバッチ処理（`getRange().getValues()` と `setValues()`）を使った高速な送信処理を記述する。
   - テスト用関数 `testSendWelcomeEmails()` を併記する。
3. **リモートへのプッシュ（clasp 連携）**:
   - MCP ツール `clasp_push` を呼び出し、ローカルの変更を Apps Script クラウド環境へ即座に送信。
4. **テスト実行と検証**:
   - MCP ツール `clasp_run` を呼び出し、クラウド上で `testSendWelcomeEmails` を実行。
   - 実行結果やログ出力を取得し、正常終了したかを確認する。
5. **自己修正（エラーがあった場合）**:
   - ログにエラー（例: 列インデックスの範囲外アクセス）が出ていれば、コードの該当行を特定して修正し、再度 push して再実行する。

人間はエディタを立ち上げてコピペしたり、ブラウザの実行ボタンを連打したりすることなく、Claude Code のターミナル画面を見守るだけで機能が完成します。

## 安全運用のための注意点

- **実行権限のスコープ**:
  リモートで関数を実行する（`clasp run-function`）には、対象スクリプトの GCP プロジェクト設定や API 実行可能ファイルとしてのデプロイ設定が必要です。環境によっては実行権限の事前準備が必要となります（詳細は次章以降で解説）。
- **破壊的変更の抑止**:
  テスト対象のスプレッドシートは、本番用の業務シートではなく、必ず開発・検証用のダミーシートを用意して ID を渡すようにしてください。

## まとめ

- **clasp mcp**: clasp 3.x で実験的に追加された MCP サーバー機能。AI エージェントが直接スクリプトの push や関数実行を行える。
- **導入方法**: Claude Code 内の `/plugin install @google/clasp`、または `claude mcp add` コマンドで簡単に追加可能。
- **認証の仕組み**: `clasp login` で作成された `~/.clasprc.json` の認証情報をそのまま透過的に利用。
- **ワークフローの変革**: コードの編集だけでなく、「push → 実行 → ログ確認 → 修正」のエージェンティックループを AI に丸ごと任せられるようになる。
