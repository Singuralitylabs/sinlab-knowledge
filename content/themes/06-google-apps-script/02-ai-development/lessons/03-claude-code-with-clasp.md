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

- **clasp 3.x に実験的に搭載された `clasp mcp` の役割と仕組み（提供ツール: `push_files`, `pull_files`, `create_project`, `clone_project`, `list_projects`）**
- Claude Code への MCP サーバー追加手順（`claude mcp add` と設定ファイル）
- 認証資格情報（`~/.clasprc.json`）の共有モデル
- **AI エージェントに push / pull を任せ、テスト実行やログ確認を CLI コマンドで行う実践ワークフロー**
- エージェントに任せる際の安全管理とスコープ

## clasp mcp とは何か

`clasp mcp`（または `clasp start-mcp-server`）は、clasp を **MCP サーバー（標準入出力 STDIO トランスポート）** として起動するコマンドです。

```text
+-------------------+           +-------------------+           +-----------------------+
|    Claude Code    |  STDIO    |     clasp mcp     |  REST API |  Google Apps Script   |
|   (AI エージェント) | <=======> |   (MCP サーバー)   | <=======> |     (クラウド環境)      |
+-------------------+           +-------------------+           +-----------------------+
    │                               │
    ├─ ファイルの読み書き (ローカル)        ├─ push_files / pull_files
    ├─ MCP ツール呼び出し ──────────────┼─ create_project / clone_project
    │                               └─ list_projects
    └─ シェルコマンド実行 ──────────────────> clasp run-function / tail-logs (CLI 実行)
```

### clasp mcp が提供するツール

clasp 3.x の MCP サーバー（`src/mcp/server.ts`）は実験的機能（EXPERIMENTAL）として提供されており、以下の **5 つのプロジェクト管理ツール** を公開しています。

| ツール名 | 説明 |
| --- | --- |
| `push_files` | ローカルのコードファイルをリモートの Apps Script プロジェクトへ送信する |
| `pull_files` | リモートの最新コードファイルをローカルへ取り込む |
| `create_project` | 新規 Apps Script プロジェクトを作成する |
| `clone_project` | 既存のスクリプト ID からプロジェクトをクローンする |
| `list_projects` | ユーザーのアカウント内のスクリプト一覧を取得する |

> [!NOTE]
> 現在の `clasp mcp` には、スクリプト関数のリモート実行やログ取得の MCP ツールは含まれていません（公式 README でも一部ツールの先行提供と明記されています）。そのため、**コード同期（push/pull）は MCP 経由で AI が自律的に行い、テスト実行（`clasp run-function`）やログ監視（`clasp tail-logs`）は Claude Code の Bash 実行機能（CLI コマンド）を組み合わせるハイブリッド運用** が現在のベストプラクティスです。

### なぜ MCP で連携するのか？

ファイル同期を MCP ツールとして定義することで、以下のメリットが生まれます。

1. **ツールの明確な構造化**: `push_files` や `create_project` の引数スキーマが厳密に定義され、AI のコマンド構文ミスや誤作動を防げる。
2. **プロジェクト境界の分離**: MCP サーバーは起動ディレクトリに縛られず、ツール呼び出し時にプロジェクトパスを受け取って柔軟に動作する。
3. **安全な権限管理**: 破壊的な上書き操作に対して、確認プロンプト（承認ゲート）を制御しやすい。

## Claude Code への導入手順

Claude Code に clasp mcp を組み込むには、以下の方法で登録します。

### 方法 1: `claude mcp add` コマンドで追加（推奨）

ターミナルで以下のコマンドを実行し、clasp の MCP サーバーをローカルツールとして登録します。

```bash
claude mcp add clasp -- npx -y @google/clasp mcp
```

### 方法 2: 設定ファイル（`.mcp.json`）で追加

プロジェクトルートの `.mcp.json` やユーザー設定に以下のように記述することでも登録できます。

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
3. **リモートへのプッシュ（MCP ツール連携）**:
   - MCP ツール `push_files`（または `clasp push` コマンド）を呼び出し、ローカルの変更を Apps Script クラウド環境へ即座に送信。
4. **テスト実行と検証（CLI 連携）**:
   - ターミナルから `clasp run-function testSendWelcomeEmails` を実行（※実行可能設定済み環境）。
   - 必要に応じて `clasp tail-logs --simplified` でログ出力を取得し、正常終了したかを確認する。
5. **自己修正（エラーがあった場合）**:
   - ログにエラー（例: 列インデックスの範囲外アクセス）が出ていれば、コードの該当行を特定して修正し、再度 push して再実行する。

人間はエディタを立ち上げてコピペしたり、ブラウザの実行ボタンを手動で連打したりすることなく、Claude Code の画面を見守るだけで機能が完成します。

## 安全運用のための注意点

- **実行権限のスコープ**:
  ファイルのプッシュやプル（`push_files` / `pull_files`）は通常の `clasp login` 資格情報で動作します。一方、リモートで関数を実行する（`clasp run-function`）には、Google Cloud プロジェクトの設定や自前 OAuth クライアントによる専用ログイン（`clasp login --creds ...`）、API 実行可能ファイルとしてのデプロイ設定が必要です（詳細はモジュール 2 レッスン 05 で解説）。
- **破壊的変更の抑止**:
  テスト対象のスプレッドシートは、本番用の業務シートではなく、必ず開発・検証用のダミーシートを用意して ID を渡すようにしてください。

## まとめ

- **clasp mcp**: clasp 3.x で実験的に追加された MCP サーバー機能。`push_files` / `pull_files` / `create_project` / `clone_project` / `list_projects` の 5 つのプロジェクト管理ツールを提供。
- **導入方法**: `claude mcp add clasp -- npx -y @google/clasp mcp` で簡単に追加可能。
- **認証の仕組み**: `clasp login` で作成された `~/.clasprc.json` の認証情報をそのまま透過的に利用。
- **ワークフローの変革**: ファイル同期は MCP ツール、関数のリモート実行やログ監視は CLI コマンドを組み合わせることで、AI による「編集 → push → テスト実行 → 修正」のエージェンティックループが実現する。
