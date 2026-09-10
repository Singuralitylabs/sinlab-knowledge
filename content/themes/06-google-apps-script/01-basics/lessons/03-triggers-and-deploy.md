---
title: "トリガー・バージョン・デプロイ"
description: "GASの自動化を支える時間主導型・イベント主導型トリガー、Webアプリとしての公開（doGet/doPost）、およびバージョンとデプロイ管理の概念を学ぶ。"
order: 3
type: lecture
difficulty: beginner
tags: [gas, google-apps-script, deploy]
status: published
---

# トリガー・バージョン・デプロイ

Google Apps Script の真価は、人間の手による実行だけでなく、**「指定した日時に自動実行する」「スプレッドシートの編集やフォーム送信をきっかけに動かす」「外部からアクセスできる Web API として公開する」** という自動化機能にあります。

これらを可能にするのが **トリガー（Trigger）** と **デプロイ（Deployment）** の仕組みです。本ページでは、自動化の要となるトリガーの設定方法と、本番運用に欠かせないバージョン管理・デプロイの概念を解説します。

## このページで学べること

- シンプルトリガーとインストーラブルトリガーの違い
- 時間主導型（タイマー）トリガーとイベント主導型トリガーの設定
- Web アプリケーション / Webhook としての公開（`doGet` / `doPost`）
- バージョンとデプロイの概念（HEAD 実行と固定バージョンの違い）
- 運用の注意点（トリガーの重複登録やクォータ）

## トリガーの 2 つの分類

GAS のトリガーには、設定方法と権限の強さにより 2 つの分類が存在します。

```text
[GAS のトリガー]
 ├── シンプルトリガー (Simple Triggers)
 │     └── 関数名を決めるだけ（onOpen, onEdit など）
 │     └── 権限が必要な処理（メール送信や外部通信）は不可
 │
 └── インストーラブルトリガー (Installable Triggers)
       └── GUI またはコードから明示的に登録
       └── 時間主導型、フォーム送信時、変更時など
       └── ユーザーの認可権限で動作（メール送信や外部通信も可能）
```

### 1. シンプルトリガー（予約関数名）

コード内で特定の名前の関数を定義するだけで、事前設定なしに自動実行されるトリガーです。

| 関数名 | 実行されるタイミング | 代表的な用途 |
| --- | --- | --- |
| `onOpen(e)` | スプレッドシートやドキュメントが開かれた時 | カスタムメニューの追加（`ui.createMenu`） |
| `onEdit(e)` | ユーザーがシートのセルを手動で編集した時 | 編集日時の自動スタンプ、入力値の簡易検証 |

```javascript
// スプレッドシートが開かれたときにカスタムメニューを追加
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("業務自動化")
    .addItem("データ集計を実行", "aggregateSales")
    .addToUi();
}
```

> [!WARNING]
> シンプルトリガーはセキュリティ上の理由から **「認可が必要なサービス（メール送信、Google ドライブ操作、UrlFetchApp など）」を実行できません**。編集時にメールを送りたい場合は、後述のインストーラブルトリガーを使用します。

### 2. インストーラブルトリガー

エディタの左サイドバーにある「時計アイコン（トリガー）」画面から手動で登録するか、`ScriptApp.newTrigger()` を使ってコードから作成するトリガーです。

- **時間主導型（Time-driven）**:
  - 特定の日時（例: 2026 年 12 月 31 日 15:00）
  - 分単位（1分/5分/10分/15分/30分おき）
  - 時間単位（毎時）
  - 日単位（毎日午前 9 時〜10 時の間など）
  - 週単位、月単位
- **イベント主導型（Event-driven）**:
  - スプレッドシートから: 「起動時」「編集時」「変更時」「フォーム送信時」
  - Google フォームから: 「フォーム送信時」
  - カレンダーから: 「予定の更新時」

インストーラブルトリガーは **登録したユーザーの権限で実行される** ため、外部 API へのアクセスやメール送信も自由に実行可能です。

## Web アプリケーションとしてのデプロイ（doGet / doPost）

GAS では、特殊な関数 `doGet(e)` または `doPost(e)` を定義してデプロイすることで、**インターネット上に公開された Web アプリケーションや REST API エンドポイント** を構築できます。

```javascript
// GET リクエストを受信したときの処理
function doGet(e) {
  const name = e.parameter.name || "ゲスト";
  const result = {
    message: `こんにちは、${name}さん！`,
    timestamp: new Date().toISOString()
  };

  // JSON レスポンスを返す
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST リクエストを受信したときの処理（Webhook 受信等）
function doPost(e) {
  const jsonString = e.postData.contents;
  const data = JSON.parse(jsonString);

  // 受け取ったデータをスプレッドシートに追記
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date(), data.event, data.userId]);

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

外部の SaaS（Slack、GitHub、Stripe など）からの Webhook を受け取る受け皿として非常に便利です。

## バージョンとデプロイの概念

スクリプトを Web アプリや API 実行可能ファイル、アドオンとして外部に公開する場合、**「バージョン（Version）」** と **「デプロイ（Deployment）」** の理解が欠かせません。

```text
[開発中のコード (@HEAD)]
      │
      ▼  (バージョンを作成: 例「バージョン 1」)
[不変のアーカイブスナップショット (Version 1)]
      │
      ▼  (デプロイを作成または更新)
[公開デプロイ URL (Deployment ID: AKfycb...)]
```

### HEAD と バージョンの違い

- **`@HEAD`（最新コード）**:
  オンラインエディタで編集中の最新コードです。エディタ上で「実行」ボタンを押したときは、常にこの `@HEAD` が実行されます。
- **バージョン（不変の記録）**:
  特定時点のスクリプトコードを「読み取り専用の番号付きスナップショット（例: バージョン 3）」として固定したものです。

### デプロイの重要ルール

Web アプリケーションとしてデプロイする際、**「どのバージョンをデプロイするか」** を指定します。

> [!IMPORTANT]
> **初心者が最も陥りやすいトラブル**:
> エディタでコードを修正して保存したのに、公開した Web アプリの URL にアクセスしても**変更が一切反映されていない**ことがあります。
> これは、デプロイが以前の固定バージョン（例: バージョン 1）を参照しているためです。本番 URL に反映させるには、**新しいバージョンを作成し、既存のデプロイをそのバージョンに更新する（再デプロイ）** 必要があります。

なお、開発中の動作確認用には、最新コードが即時反映される「テスト用デプロイ（devMode）」の URL も提供されています。

## まとめ

- **シンプルトリガー**: `onOpen` や `onEdit` など命名だけで動くが、認証が必要な処理は実行できない。
- **インストーラブルトリガー**: 時間指定やフォーム送信イベントなどをトリガー画面から設定。メール送信などの外部通信が可能。
- **Web アプリ公開**: `doGet(e)` / `doPost(e)` で簡単に Web API や Webhook 受信サーバを作れる。
- **バージョンとデプロイ**: 公開 URL はバージョンに紐づく。コードを直したら新バージョン作成とデプロイ更新が必要。
- **次のステップ**: 次のモジュールでは `SpreadsheetApp` によるスプレッドシート操作とバッチ処理を学び、その後のモジュールでローカルの CLI（clasp）と生成 AI（Claude Code）を組み合わせた開発ワークフローへ進みます。
