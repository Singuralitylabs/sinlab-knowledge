---
title: "実践演習：フォーム回答集計・メール通知アプリを AI と作りきる"
description: "講座の総まとめとして「Google フォーム回答 → スプレッドシート集計 → Gmail 通知」の業務自動化を、Claude Code と clasp を使って一気通貫で開発・検証・デプロイする通し手順。"
order: 8
type: lecture
difficulty: beginner
tags: [gas, google-apps-script, clasp, claude-code, hands-on]
status: draft
---

# 実践演習：フォーム回答集計・メール通知アプリを AI と作りきる

本講座の締めくくりとして、これまでに学んだすべての知識（GAS の基本、バッチ処理、clasp によるローカル環境構築、Claude Code によるコンテキスト設計、そして検証ループ）を総動員し、実践的な業務自動化アプリケーションを AI と協働して作り上げます。

題材は、企業の現場で最も需要の高い **「Google フォーム回答 → スプレッドシート集計 → 集計レポートの Gmail 自動送信」** です。

ブラウザでの手作業コピペから脱却し、**「プロンプトの設計 → Claude Code による自律実装 → clasp による push とテスト → 自動化トリガーの設定」** までの一連のフローを体験しましょう。

## このページで学べること

- 実践課題「フォーム集計・メール通知アプリ」の要件定義と仕様設計
- Claude Code に渡すプロンプトとコンテキストの組み立て方
- AI が生成したコードのレビューポイント（バッチ処理・同期 API・型）
- clasp によるデプロイと動作検証
- 開発時によくあるつまずきポイントとトラブルシューティング

## 作成するアプリケーションの仕様

```text
[Google フォーム] ──(回答送信)──> [スプレッドシート（親コンテナ）]
                                         │
                                         ▼ (毎日 18:00 にトリガー実行)
                                  [集計スクリプト]
                                   ・未集計データを一括読み込み (getValues)
                                   ・部署ごとの件数を集計
                                   ・処理済みフラグを書き戻し (setValues)
                                         │
                                         ▼ (GmailApp で送信)
                                  [担当者宛て集計レポート]
```

### 要件詳細

1. **対象シート構造**:
   - フォームの回答送信先として紐付けられたシート（通常タブ名: `フォームの回答 1`）
   - A 列: タイムスタンプ
   - B 列: 回答者名
   - C 列: 所属部署（営業部 / 開発部 / 人事部 等）
   - D 列: 処理ステータス（未処理なら空欄、処理済みなら日時の文字列）
2. **集計ロジック**:
   - D 列が空欄のレコードのみを抽出。
   - 部署ごとの新規回答件数をカウント。
   - 抽出した全レコードの D 列に現在日時（`yyyy/MM/dd HH:mm`）を一括書き込み。
3. **通知ロジック**:
   - 集計結果を整形したテキストメールを作成。
   - 管理者アドレス宛に `GmailApp.sendEmail` で送信。
   - 新規回答が 0 件の場合はメール送信をスキップ。

## ステップ 1: プロジェクトの初期設定

実務では「既存の Google フォームの回答シート」に対してスクリプトを作成することが一般的です。ここでは、新規作成した親スプレッドシート（またはフォームの回答シート）を対象にローカル環境を立ち上げます。

```bash
# プロジェクトフォルダを作成
mkdir gas-form-automation
cd gas-form-automation

# npm 初期化と型定義のインストール（Node.js >= 22 推奨）
npm init -y
npm install --save-dev @types/google-apps-script

# ソースディレクトリを作成
mkdir src

# 方法 A: 既存のフォーム回答スプレッドシートに紐付ける場合（推奨）
# （ブラウザでシートを開き、URL のスプレッドシート ID を指定）
# clasp create-script --title "FormAutomation" --type sheets --parentId <SPREADSHEET_ID> --rootDir src

# 方法 B: 新規にスプレッドシートとコンテナバインドスクリプトを作る場合
clasp create-script --title "FormAutomation" --type sheets --rootDir src
```

このコマンドにより、`.clasp.json` 内に `"rootDir": "src"` が設定され、`src/appsscript.json` が生成されます。

> [!NOTE]
> スプレッドシート作成後、ブラウザで開き「ツール」>「新しいフォームを作成」をクリックすると、そのスプレッドシートに「フォームの回答 1」タブが自動生成され、フォーム送信とシートが連動します。

### マニフェスト（src/appsscript.json）の確認とタイムゾーン設定

生成された `src/appsscript.json` を開き、タイムゾーンと必要な OAuth スコープを確認・設定します。
デフォルトでは `timeZone` が `"America/New_York"` になっている場合があるため、`"Asia/Tokyo"` に変更します。また、`oauthScopes` を明示してスプレッドシート操作とメール送信の権限を設定します。

```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/gmail.send"
  ]
}
```

### .claspignore の準備

プロジェクトルートに `.claspignore` を作成します（パターンは `rootDir` 相対で評価されます）。

```text
**/**
!appsscript.json
!**/*.js
!**/*.html
```

### CLAUDE.md の準備

プロジェクトルートに、レッスン 04 で学んだ `CLAUDE.md` を配置します。

```markdown
# CLAUDE.md
本プロジェクトは Google Apps Script アプリケーションです。
- SpreadsheetApp は getRange().getValues() と setValues() によるバッチ処理を徹底してください。
- 組み込み API はすべて同期呼び出しです。async/await は使用しないでください。
- 秘密情報や設定値は PropertiesService から読み出してください。
- clasp 3.x のコマンドを使用してください（clasp push, clasp open-script）。
```

## ステップ 2: Claude Code へのプロンプト指示

Claude Code を起動し、要件を明確に伝えます。

```bash
claude
```

### 対話プロンプト例

```text
「スプレッドシートのフォーム回答を集計してメール送信する機能を実装したいです。

要件:
1. シート『フォームの回答 1』の未処理行（D列が空欄の行）を対象にします。
2. 部署ごと（C列）の件数を集計してください。
3. 処理した行のD列には現在日時を一括書き戻してください（必ず getValues と setValues でバッチ処理すること）。
4. 送信先メールアドレスは PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL') から取得してください。
5. 動作確認用のテスト関数 testProcessFormResponses() も一緒に作成してください。
6. 実装が完了したら、clasp push で反映してください。」
```

## ステップ 3: 生成コードのレビューポイント

Claude Code がコードを出力したら、人間が「GAS の掟」に沿っているかをさっとレビューします。

### 生成されるコードの理想形（`src/Code.js`）

```javascript
/**
 * フォームの未処理回答を集計し、管理者にメール通知する
 */
function processFormResponses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("フォームの回答 1");
  if (!sheet) {
    console.error("シート『フォームの回答 1』が見つかりません。");
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    console.log("処理対象のデータが存在しません。");
    return;
  }

  // 1. A2 から 最終行までのデータを一括取得（バッチ取得）
  const numRows = lastRow - 1;
  const range = sheet.getRange(2, 1, numRows, 4);
  const data = range.getValues();

  const nowString = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm");
  const departmentCounts = {};
  let processedCount = 0;

  // 2. メモリ上で集計（まだシートは更新しない）
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const status = row[3]; // D列

    if (!status) {
      const department = row[2] || "未指定"; // C列
      departmentCounts[department] = (departmentCounts[department] || 0) + 1;
      processedCount++;
    }
  }

  if (processedCount === 0) {
    console.log("未処理の回答はありませんでした。");
    return;
  }

  // 3. 先に管理者へメール送信（送信に失敗した場合はシートを更新せず次回再試行可能にする）
  sendReportEmail(departmentCounts, processedCount);

  // 4. 送信成功後、メモリ上の D 列に完了日時をセットして一括書き戻し（バッチ更新）
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row[3]) {
      row[3] = nowString;
    }
  }
  range.setValues(data);
  console.log(`集計完了: ${processedCount} 件のステータスを更新しました。`);
}

function sendReportEmail(counts, total) {
  const adminEmail = PropertiesService.getScriptProperties().getProperty("ADMIN_EMAIL");
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL が設定されていないため、処理を中断しました。");
  }

  let body = `フォーム回答の集計が完了しました。\n\n新規回答総数: ${total} 件\n\n【部署別内訳】\n`;
  for (const [dept, count] of Object.entries(counts)) {
    body += `- ${dept}: ${count} 件\n`;
  }
  body += `\n※本メールは Apps Script から自動送信されています。`;

  GmailApp.sendEmail(adminEmail, `【自動集計】フォーム新規回答レポート（${total}件）`, body);
  console.log(`レポートメールを ${adminEmail} 宛に送信しました。`);
}

/**
 * 動作確認用のテスト関数
 * 本番の回答シートを汚さないよう、検証用の別シート（タブ）を作成して動作を検証する
 */
function testProcessFormResponses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const testSheetName = "【検証用】フォーム回答テスト";
  let testSheet = ss.getSheetByName(testSheetName);

  // 既存の検証用シートがあれば一度削除して再作成
  if (testSheet) {
    ss.deleteSheet(testSheet);
  }
  testSheet = ss.insertSheet(testSheetName);
  testSheet.appendRow(["タイムスタンプ", "回答者名", "所属部署", "処理ステータス"]);

  // テスト用の未処理ダミー行を追加
  testSheet.appendRow([new Date(), "テスト花子", "開発部", ""]);
  testSheet.appendRow([new Date(), "テスト太郎", "営業部", ""]);

  console.log(`検証用シート『${testSheetName}』を作成しました。テスト実行します...`);

  // 本番関数と同様の集計ロジックをテスト用シートに対して実行
  const lastRow = testSheet.getLastRow();
  const range = testSheet.getRange(2, 1, lastRow - 1, 4);
  const data = range.getValues();
  const counts = {};
  let processedCount = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row[3]) {
      const dept = row[2] || "未指定";
      counts[dept] = (counts[dept] || 0) + 1;
      processedCount++;
    }
  }

  // レポートメール送信テスト
  sendReportEmail(counts, processedCount);

  // 検証用シートのステータス更新
  const nowString = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm");
  for (let i = 0; i < data.length; i++) {
    if (!data[i][3]) data[i][3] = nowString;
  }
  range.setValues(data);

  console.log("テスト実行完了: メールが届き、検証用シートの D 列が更新されたことを確認してください。");
}
```

### レビューチェックリスト

- [x] `sheet.getRange(i, 4).setValue()` などのループ内通信が存在せず、`setValues(data)` で一括更新されているか？
- [x] `async / await` が紛れ込んでいないか？
- [x] 管理者のメールアドレスが直書きされず、`PropertiesService` から取得されているか？
- [x] 通知送信（`sendReportEmail`）の成功後にステータスを更新し、送信失敗時に未集計行が消失しないよう考慮されているか？
- [x] シートが存在しない場合やデータが 0 件の場合のエラーハンドリングが考慮されているか？
- [x] 動作確認用のテスト関数（`testProcessFormResponses`）が実装されているか？

## ステップ 4: クラウド反映と初回認可

Claude Code が `clasp push` を完了したら、ブラウザで動作確認を行います。

```bash
clasp open-script
```

1. エディタの「プロジェクトの設定」を開き、スクリプトプロパティに `ADMIN_EMAIL`（あなたのメールアドレス）を設定します。
2. エディタ上で `testProcessFormResponses` を選択し、「**実行**」ボタンをクリックします。
3. 初回実行時の **OAuth 権限承認ポップアップ**（スプレッドシートの操作と Gmail の送信権限）が表示されるので、画面の指示に従って「許可」します。
4. テストデータが追加された上で集計が走り、スプレッドシートの D 列に日時が記録され、Gmail にレポートメールが届いたことを確認します。本番関数 `processFormResponses` も同様に正常終了することを確認します。

## ステップ 5: 定期実行トリガーの設定

動作確認が完了したら、毎日夕方に自動実行されるようインストーラブルトリガーを設定します。

1. エディタ左サイドバーの「**トリガー**（時計アイコン）」をクリックします。
2. 右下の「**トリガーを追加**」をクリックします。
3. 以下の通り設定して「保存」します:
   - 実行する関数: `processFormResponses`
   - イベントのソース: **時間主導型**
   - 時間ベースのトリガーのタイプ: **日付ベースのタイマー**
   - 時間帯: **午後 6 時〜7 時**

これで、毎日定刻になるとスクリプトが自動でシートをチェックし、新規回答があれば集計してメールを送る完全自動化システムが稼働します。

## つまずきポイントと解決策

| トラブル | 原因 | 解決策 |
| --- | --- | --- |
| メールが届かない / 処理が中断する | `ADMIN_EMAIL` のスペルミス、またはスクリプトプロパティ未設定 | 「プロジェクトの設定」でプロパティ名と値が正しいか再確認する |
| シートが見つからないログが出る | シート名が一致していない | `getSheetByName("フォームの回答 1")` の名前がシートのタブ名と完全一致しているか確認する |
| 実行すると権限エラーで落ちる | Gmail 送信権限が未承認 | 一度ブラウザのエディタ上で関数を手動実行し、認可ダイアログを完了させる（`appsscript.json` の `gmail.send` スコープも確認） |
| 日時のフォーマットやタイムゾーンが意図と異なる | `Utilities.formatDate` の引数でタイムゾーン指定が誤っているか、`new Date()` の変換ミス | `Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm")` のように対象タイムゾーンを明示的に指定しているか確認する |

## 講座全体のまとめ

本講座「Google Apps Script」を通じて、私たちは以下のスキルを習得しました。

1. **GAS の基礎と設定（モジュール 1）**:
   - クラウドで手軽に動く利便性と、6 分制限・同期 API・V8 ランタイムの制約
   - 権限承認フロー、ログ管理、トリガーとデプロイの基礎
2. **生成 AI 前提の GAS 開発（モジュール 2）**:
   - なぜブラウザ完結型から脱却し、ローカル（clasp）に降りるべきなのか
   - clasp 3.x による環境構築とコマンド体系
   - Claude Code と `clasp mcp`（プロジェクト同期ツール）および CLI を組み合わせた自律エージェンティックループの実現
   - `CLAUDE.md` と型定義によるハルシネーションの徹底排除
   - 実環境での結合テスト（`clasp run-function`）と純粋関数・ローカルテストによる高速検証
   - Gemini サイドパネルとの適切な使い分け
   - `PropertiesService` や Git、CI/CD を活用したセキュアな本番運用
3. **SpreadsheetApp（モジュール 3）**:
   - オブジェクト階層と Range 操作
   - `getValues` / `setValues` によるバッチ処理

生成 AI は、正しいコンテキスト（制約・規約・型）と検証手段（ループ）を与えられたとき、最高のパートナーになります。本講座で身につけたワークフローを活用し、日々の業務自動化や高度なシステム連携をスピーディに形にしていきましょう。
