---
title: "エディタ・権限承認・ログ・マニフェスト"
description: "Apps Script オンラインエディタの基本操作、初回実行時のOAuth権限承認フロー、実行ログとLogger、およびappsscript.jsonによるスコープ管理を解説。"
order: 2
type: lecture
difficulty: beginner
tags: [gas, google-apps-script]
status: published
---

# エディタ・権限承認・ログ・マニフェスト

Google Apps Script の開発を始めるにあたって、まず理解しておくべきなのが **ブラウザ内エディタの操作感**、スクリプト実行時に必ず現れる **権限承認ダイアログ**、そして設定ファイルである **`appsscript.json`（マニフェストファイル）** です。

特に権限承認や OAuth スコープの仕組みは、後で学ぶローカル開発ツール（clasp）や生成 AI を使う際にもそのまま適用されるコアな概念です。

## このページで学べること

- Apps Script オンラインエディタの画面構成と基本操作
- スタンドアロンスクリプトとコンテナバインドスクリプトの違い
- 初回実行時に表示される OAuth 権限承認のフローと「安全ではないページ」の理由
- デバッグとログ出力（`Logger.log` と `console.log` の使い分け）
- `appsscript.json`（マニフェスト）の役割とスコープの最小化

## オンラインエディタの開き方と 2 つのスクリプト形態

GAS には大きく分けて 2 種類のプロジェクト形態があります。

| 形態 | 作成方法 | 特徴 |
| --- | --- | --- |
| **コンテナバインド**（推奨：特定シート向け） | スプレッドシートやドキュメントの「拡張機能」>「Apps Script」から作成 | 親ファイルに紐づく。`SpreadsheetApp.getActiveSpreadsheet()` で親シートを直接取得可能 |
| **スタンドアロン** | [script.google.com](https://script.google.com) または Google ドライブの「新規」から作成 | 単独のスクリプトファイルとしてドライブ上に保存。複数シートをまたぐ処理や Web API 化に向く |

ブラウザでエディタを開くと、左側にファイル一覧（`.gs` ファイルや `.html` ファイル）、中央にコードエディタ、上部に実行関数セレクタと「実行」「デバッグ」ボタンが配置されています。

```text
+-------------------------------------------------------------+
|  [プロジェクト名]   [関数選択: myFunction v] [実行] [デバッグ]  |
+--------------+----------------------------------------------+
| [ファイル]   | function myFunction() {                      |
|  コード.gs    |   Logger.log("Hello, Apps Script!");        |
|  appsscript  | }                                            |
|   .json      |                                              |
|              |                                              |
+--------------+----------------------------------------------+
| [実行ログ]    |                                              |
|  12:00:00 情報 Hello, Apps Script!                         |
+-------------------------------------------------------------+
```

## 初回実行時の権限承認フロー

スクリプトに Google サービス（スプレッドシートや Gmail など）を操作するコードを書き、初めて「実行」ボタンを押すと、必ず **「承認が必要です」** というポップアップが表示されます。

これは、スクリプトがユーザーの権限で Google Workspace のデータにアクセスしてよいかをブラウザ上で確認するセキュリティ機構（OAuth 2.0）です。

### 承認手順の流れ

1. **「承認が必要です」ダイアログ** で「権限を確認」をクリックします。
2. 実行する Google アカウントを選択します。
3. **「Google でログインしていません」または「このアプリは Google で確認されていません」という警告画面** が表示されます。
4. 画面左下の **「詳細」**（Advanced）リンクをクリックします。
5. 最下部に現れる **「（安全ではないページ）に移動」** をクリックします。
6. スクリプトが要求している権限一覧（「Google スプレッドシートの表示と管理」など）を確認し、**「許可」** をクリックします。

> [!WARNING]
> 自作のスクリプトを実行する場合、Google による審査を受けていないため「このアプリは Google で確認されていません」「安全ではないページ」という警告が出ますが、自分が書いたスクリプトであれば問題ありません。

### 権限承認のトリガーと注意点

GAS はコードを解析し、使用されているサービスに応じて必要な OAuth スコープを自動検出します。コードに新しいサービス（例: `GmailApp.sendEmail`）を追加した場合、**次回の実行時に再度承認画面が表示されます**。

> [!IMPORTANT]
> 後述する clasp や AI エージェント（Claude Code 等）からスクリプトを実行する場合でも、**新しい権限の初回承認だけはブラウザのエディタ上で人間が手動で済ませる必要があります**。ここを見落とすと、CLI や API 経由の実行が `ScriptError: Authorization is required` で失敗し続けます。

## ログ出力とデバッグ

コードの動作確認には、ログ出力が欠かせません。GAS には歴史的経緯から 2 種類のログ出力方法が存在します。

```javascript
function testLogging() {
  // 1. Logger.log（従来からの Apps Script 標準）
  Logger.log("Logger: 処理を開始しました");

  // 2. console.log（Google Cloud Logging と連携）
  console.log("Console: 処理中...", { count: 42 });
  console.warn("警告メッセージ");
  console.error("エラーメッセージ");
}
```

### `Logger.log` と `console.log` の違い

| 項目 | `Logger.log()` | `console.log()` |
| --- | --- | --- |
| 出力先 | エディタ下部の実行ログ | エディタ下部の実行ログ + **Google Cloud Logging** |
| オブジェクト出力 | 文字列化される（`[object Object]` となり中身が見えないことがある） | JSON 構造として展開・閲覧可能 |
| clasp CLI での取得 | エディタを開かないと見られない | `clasp tail-logs`（`clasp logs`）でターミナルから取得可能 |
| 推奨用途 | 簡単な確認用 | **AI 駆動開発・ローカル開発での標準** |

CLI や AI ツールからログを収集・解析させる場合は、Cloud Logging に記録される `console.log()` や `console.error()` を使うのがベストプラクティスです。

## `appsscript.json`（マニフェストファイル）

`appsscript.json` は、プロジェクトの全体設定を定義する JSON ファイルです。

### マニフェストファイルの表示方法

デフォルトではオンラインエディタ上で非表示になっています。以下の手順で表示させます。

1. 左サイドバーの歯車アイコン（**プロジェクトの設定**）をクリックします。
2. 「**「appsscript.json」マニフェスト ファイルをエディタで表示する**」のチェックボックスをオンにします。
3. エディタのファイル一覧に戻ると、`appsscript.json` が表示されます。

### 基本構造と主要設定

```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {
    "enabledAdvancedServices": []
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

- **`timeZone`**: 日時処理（`Utilities.formatDate` 等）で使われるタイムゾーン。日本標準時は `"Asia/Tokyo"` です。
- **`runtimeVersion`**: `"V8"` を指定（現代のプロジェクトでは必須）。
- **`oauthScopes`**: スクリプトが要求する権限（スコープ）を明示的に固定します。

### スコープの最小化（最小権限の原則）

`oauthScopes` を明示しない場合、GAS はコード内の記述から広範なスコープ（例: `https://www.googleapis.com/auth/spreadsheets` ＝ ドライブ内の**全スプレッドシートへの読み書き権限**）を自動要求します。

これに対し、`https://www.googleapis.com/auth/spreadsheets.currentonly`（**開いているスプレッドシートのみに限定**）を `appsscript.json` に明示的に設定することで、意図しない他ファイルへのアクセスを防ぎ、安全性を高めることができます。

## まとめ

- **エディタと形態**: スプレッドシート専用ならコンテナバインド、汎用的な連携や API ならスタンドアロン。
- **権限承認**: Google サービスの利用には初回実行時の手動承認が不可欠。CLI や AI ツールで動かす前にも一度エディタで承認を済ませておく。
- **ログ**: 基本は `console.log()` を推奨。Cloud Logging と連携するため、ローカル CLI や AI ツールからの取得が可能。
- **`appsscript.json`**: タイムゾーンやランタイム、OAuth スコープを管理する重要ファイル。スコープを絞り込んで安全性を確保する。
