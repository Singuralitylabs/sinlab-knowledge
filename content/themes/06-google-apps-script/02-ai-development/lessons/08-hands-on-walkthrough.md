---
title: "実践演習：フォーム回答集計・メール通知アプリを AI と作りきる"
description: "講座の総まとめとして「Google フォーム回答 → スプレッドシート集計 → Gmail 通知」の業務自動化を、Claude Code と clasp を使って一気通貫で開発・検証・デプロイする通し手順。"
order: 8
type: lecture
difficulty: beginner
tags: [gas, google-apps-script, clasp, claude-code, hands-on]
status: published
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
[Google フォーム] ──(回答送信)──> [スプレッドシート]
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
   - シート名: `フォームの回答 1`
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

ローカル環境にディレクトリを作成し、clasp と Claude Code の準備を整えます。

```bash
# プロジェクトフォルダを作成
mkdir gas-form-automation
cd gas-form-automation

# npm 初期化と型定義のインストール
npm init -y
npm install --save-dev @types/google-apps-script

# clasp でスプレッドシートに紐づくスクリプトを新規作成
clasp create-script --title "FormAutomation" --type sheets
```

### CLAUDE.md の準備

プロジェクトルートに、前章で学んだ `CLAUDE.md` を配置します。

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

  // 2. メモリ上で集計とフラグ更新
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const status = row[3]; // D列

    if (!status) {
      const department = row[2] || "未指定"; // C列
      departmentCounts[department] = (departmentCounts[department] || 0) + 1;

      row[3] = nowString; // D列に完了日時をセット
      processedCount++;
    }
  }

  if (processedCount === 0) {
    console.log("未処理の回答はありませんでした。");
    return;
  }

  // 3. 更新されたデータを一括書き戻し（バッチ更新）
  range.setValues(data);

  // 4. 管理者へメール送信
  sendReportEmail(departmentCounts, processedCount);
}

function sendReportEmail(counts, total) {
  const adminEmail = PropertiesService.getScriptProperties().getProperty("ADMIN_EMAIL");
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL が設定されていないため、メール送信をスキップしました。");
    return;
  }

  let body = `フォーム回答の集計が完了しました。\n\n新規回答総数: ${total} 件\n\n【部署別内訳】\n`;
  for (const [dept, count] of Object.entries(counts)) {
    body += `- ${dept}: ${count} 件\n`;
  }
  body += `\n※本メールは Apps Script から自動送信されています。`;

  GmailApp.sendEmail(adminEmail, `【自動集計】フォーム新規回答レポート（${total}件）`, body);
  console.log(`レポートメールを ${adminEmail} 宛に送信しました。`);
}
```

### レビューチェックリスト

- [x] `sheet.getRange(i, 4).setValue()` などのループ内通信が存在せず、`setValues(data)` で一括更新されているか？
- [x] `async / await` が紛れ込んでいないか？
- [x] 管理者のメールアドレスが直書きされず、`PropertiesService` から取得されているか？
- [x] シートが存在しない場合やデータが 0 件の場合のエラーハンドリングが考慮されているか？

## ステップ 4: クラウド反映と初回認可

Claude Code が `clasp push` を完了したら、ブラウザで動作確認を行います。

```bash
clasp open-script
```

1. エディタの「プロジェクトの設定」を開き、スクリプトプロパティに `ADMIN_EMAIL`（あなたのメールアドレス）を設定します。
2. エディタ上で `processFormResponses` を選択し、「**実行**」ボタンをクリックします。
3. 初回実行時の **OAuth 権限承認ポップアップ**（スプレッドシートの操作と Gmail の送信権限）が表示されるので、画面の指示に従って「許可」します。
4. スプレッドシートの D 列に日時が記録され、Gmail にレポートメールが届いたことを確認します。

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
| メールが届かない | `ADMIN_EMAIL` のスペルミス、またはプロパティ未設定 | 「プロジェクトの設定」でプロパティ名と値が正しいか再確認する |
| `TypeError: Cannot read properties of null` | シート名が一致していない | `getSheetByName("フォームの回答 1")` の名前がシートのタブ名と完全一致しているか確認 |
| 実行すると権限エラーで落ちる | Gmail 送信権限が未承認 | 一度ブラウザのエディタ上で関数を手動実行し、認可ダイアログを完了させる |
| 日時が UTC（9時間ズレ）で記録される | タイムゾーン設定が未設定 | `appsscript.json` の `"timeZone": "Asia/Tokyo"` を確認する |

## 講座全体のまとめ

本講座「Google Apps Script」を通じて、私たちは以下のスキルを習得しました。

1. **GAS の基礎と制約（モジュール 1）**:
   - クラウドで手軽に動く利便性と、6 分制限・同期 API・バッチ処理の重要性
   - 権限承認フロー、ログ管理、トリガーとデプロイの基礎
2. **生成 AI 前提の GAS 開発（モジュール 2）**:
   - なぜブラウザ完結型から脱却し、ローカル（clasp）に降りるべきなのか
   - clasp 3.x による環境構築とコマンド体系
   - Claude Code と `clasp mcp` による自律エージェンティックループの実現
   - `CLAUDE.md` と型定義によるハルシネーションの徹底排除
   - 実環境での結合テスト（`clasp run-function`）とローカル高速検証（`gas-fakes`）
   - Gemini サイドパネルとの適切な使い分け
   - `PropertiesService` や Git、CI/CD を活用したセキュアな本番運用

生成 AI は、正しいコンテキスト（制約・規約・型）と検証手段（ループ）を与えられたとき、最高のパートナーになります。本講座で身につけたワークフローを活用し、日々の業務自動化や高度なシステム連携をスピーディに形にしていきましょう。
