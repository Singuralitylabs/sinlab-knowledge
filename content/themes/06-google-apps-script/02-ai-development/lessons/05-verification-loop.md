---
title: "GAS における検証ループの作り方"
description: "AI が自律的にコードを直すための検証ループの設計。clasp run-function、gas-fakes によるローカル実行、テスト用シートの分離、および典型的な失敗パターンの対策を解説。"
order: 5
type: lecture
difficulty: intermediate
tags: [gas, google-apps-script, claude-code, loop-engineering]
status: published
---

# GAS における検証ループの作り方

[ループエンジニアリング](/themes/04-ai-driven-development/01-overview/loop-engineering) で解説した通り、AI コーディングエージェントに自律的な問題解決を期待する場合、**「行動した結果を客観的に検証できる環境（フィードバックループ）」** の存在が不可欠です。

一般的な Node.js 開発なら `npm test` を回せば済みますが、GAS は Google のクラウド上で動作するため、そのままではローカルでテストを実行できません。テスト手段がない状態のエージェントは「コードを書いたので動くはずです」と主張するだけで、実際の実行エラーに気づくことができません。

本ページでは、GAS 開発において AI が自律的に「実装 → テスト実行 → エラー検知 → 修正」を繰り返せるようにするための **検証ループの構築手法** を解説します。

## このページで学べること

- GAS 開発で検証ループが回りにくい根本理由
- 検証手法 1: **`clasp run-function` によるクラウド直接実行**
- 検証手法 2: **`@mcpher/gas-fakes` による Node.js からの直接テスト実行**
- 検証手法 3: **純粋関数（ビジネスロジック）を切り出した完全ローカル単体テスト**
- 安全にループを回すための「テスト用スプレッドシート」分離原則
- 典型的な 3 つの失敗パターン（権限未承認・スコープ不足・6 分超過）と AI への教え方

## GAS における検証アプローチ

GAS の検証環境を構築するには、主に以下の手法を組み合わせて設計します。

```text
【アプローチ A：クラウド実行（clasp run-function）】
  ローカルで編集 ──> clasp push ──> clasp run-function ──> クラウドの実行ログで判定
  ・長所：本物の Apps Script インフラで動くため、権限やクォータも含めて最も忠実
  ・短所：push とリモート RPC のオーバーヘッドがあり、GCP 紐付け・API 実行可能設定が必要

【アプローチ B：@mcpher/gas-fakes（Node.js からの Google API 連携実行）】
  ローカルで編集 ──> Node.js (Vitest/Jest) から実行 ──> 実 Google API へ通信してテスト
  ・長所：clasp push なしでローカルから直接 GAS サービス構文のコードを実行・検証できる
  ・特性：オフラインモックではなく実 Google API リクエストに変換される（GCP / ADC 設定が必要）

【アプローチ C：純粋関数の切り出し（最も推奨される高速ローカルループ）】
  SpreadsheetApp 依存の「データ取得/書込」と「計算・加工ロジック」を分離
  ・長所：完全オフライン・通信ゼロ・数ミリ秒で Vitest/Jest が回る
  ・短所：SpreadsheetApp 呼び出しそのものは別途テストが必要
```

## アプローチ A: `clasp run-function` によるクラウド直接実行

`clasp` には、クラウド上にデプロイされたスクリプトの特定の関数をリモートから直接呼び出す `run-function`（旧 `run`）コマンドが用意されています。

### 事前準備（GCP 設定と自前 OAuth クライアントが必要）

一般的な `clasp push` や `pull` はデフォルトの認証トークン（`clasp login`）で動作しますが、**`clasp run-function` は Apps Script 実行 API（`scripts.run`）を呼び出すため、追加の環境構築が必須**となります（公式 `docs/run.md` 参照）。

1. **Google Cloud プロジェクトの作成と紐付け**:
   標準のデフォルトプロジェクトではなく、自身の Google Cloud プロジェクトを「プロジェクトの設定」からスクリプトに紐付けます。`.clasp.json` にも `"projectId": "GCPプロジェクトID"` を記載します。
2. **Apps Script API の有効化**:
   Google Cloud Console 側で「Google Apps Script API」を有効化します。
3. **自前の OAuth クライアント（デスクトップアプリ）の作成**:
   GCP 上でデスクトップアプリ用の OAuth 2.0 クライアント ID を作成し、認証情報 JSON（例: `creds.json`）をダウンロードします。
4. **専用の認証トークンでログイン**:
   ```bash
   clasp login --use-project-scopes --creds creds.json
   ```
   ※デフォルトの `clasp login` では `scripts.run` の実行権限スコープが含まれていないため、この自前クレデンシャルでの再ログインが必要です。
5. **`appsscript.json` に実行 API 設定を追加し、API 実行可能ファイルとしてデプロイ**:
   ```json
   "executionApi": {
     "access": "MYSELF"
   }
   ```
   エディタのデプロイ画面で「種類: API 実行可能ファイル」としてデプロイを作成します。

### 実行と判定のコマンド

```bash
# 1. ローカルのコードをアップロード
clasp push

# 2. テスト用エントリポイント関数を実行
clasp run-function 'runAllTests'

# 3. ログの確認（※GCP プロジェクト紐付け環境で利用可能）
clasp tail-logs --simplified
```

Claude Code などのエージェントには、テスト用の関数（例: `runAllTests()`）を用意させ、「コードを書き換えたら `clasp push && clasp run-function runAllTests` を実行して、エラーが出たら修正して」と指示します。

> [!NOTE]
> このように `clasp run-function` は設定ハードル（GCP プロジェクト・OAuth クライアント・専用ログイン）が高いため、まずは後述の「アプローチ C: 純粋関数の切り出し」によるローカルユニットテストを日常の開発ループにし、クラウド結合確認は手動または CI で行うのが実務では一般的です。

## アプローチ B: `@mcpher/gas-fakes` による Node.js からの直接テスト

Apps Script のコードを clasp push せずにローカルの Node.js 環境から直接テストしたい場合、コミュニティで開発されている **`@mcpher/gas-fakes`** ライブラリが選択肢になります。

### `@mcpher/gas-fakes` の仕組みと注意点

`@mcpher/gas-fakes` は、GAS の主要サービス（`SpreadsheetApp`、`PropertiesService`、`DriveApp` など、約 7 割のメソッド）を Node.js 環境へ注入するツールです。

ここで極めて重要なのは、**「これはオフラインのインメモリフェイクではなく、GAS サービス呼び出しを実際の Google REST API（Google Sheets API 等）リクエストに変換して通信する」** という点です。

- **必要な設定**: Google Cloud プロジェクト、ADC（Application Default Credentials）や OAuth クライアント設定、および `gas-fakes init` による初期設定が必要です。
- **実データへの影響**: たとえば `SpreadsheetApp.create("テストシート")` を実行すると、**本物の Google ドライブ上にファイルが新規作成**されます。

```bash
# インストール（パッケージ名は @mcpher/gas-fakes）
npm install --save-dev @mcpher/gas-fakes vitest
```

```javascript
// tests/spreadsheet.test.js
import { describe, it, expect, beforeEach } from "vitest";

// 副作用 import によりグローバル空間に SpreadsheetApp 等が注入される
import "@mcpher/gas-fakes";

// テスト対象の関数を読み込み
import { calculateTotals } from "../src/Code.js";

describe("売上集計のテスト", () => {
  let sheet;

  beforeEach(() => {
    // 実際の Google ドライブ上にテスト用シートが作成される
    const ss = SpreadsheetApp.create("テスト用一時シート");
    sheet = ss.getActiveSheet();
    sheet.getRange("A1:B3").setValues([
      ["商品A", 100],
      ["商品B", 200],
      ["合計", 0],
    ]);
  });

  it("正しく合計が計算されて B3 に書き込まれること", () => {
    calculateTotals(sheet);
    expect(sheet.getRange("B3").getValue()).toBe(300);
  });
});
```

API 呼び出しの構文レベルでの動作確認には有用ですが、実 Google API への通信を伴うため、ネットワーク環境とテスト用ファイルのクリーンアップ（削除）が必要です。

## アプローチ C: 純粋関数の切り出しによる超高速オフライン検証（推奨）

Google のサーバー通信を一切挟まず、ミリ秒単位で AI にループを回させたい場合、実務で最も推奨されるのが **「GAS 依存の I/O 部分と、ビジネスロジック（純粋関数）の分離」** です。

```javascript
// 1. 純粋関数（GAS の API に一切依存しない）=> 完全オフラインで 1ms でテスト可能！
export function aggregateDepartments(rows) {
  const counts = {};
  let processedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const [timestamp, name, department, status] = rows[i];
    if (!status) {
      const dept = department || "未指定";
      counts[dept] = (counts[dept] || 0) + 1;
      processedCount++;
    }
  }

  return { counts, processedCount };
}

// 2. GAS 結合部（I/O のみ担当）=> クラウド側で結合確認
function processFormResponses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4);
  const data = range.getValues();

  // 純粋関数にデータを渡して計算
  const { counts, processedCount } = aggregateDepartments(data);
  // ... メール送信と書き戻し
}
```

このように設計しておけば、Claude Code は Node.js の標準ランナー（`npx vitest run` 等）を使い、通信なし・数ミリ秒でユニットテストを回してロジックのバグを即座に修正できます。

## 安全にループを回すための「テスト用シートの分離」

AI に自動実行を行わせる際、最も恐ろしいのは **「本番のスプレッドシートのデータを誤って上書き・消去してしまうこと」** です。

検証ループを組む際は、以下の安全策を徹底してください。

1. **テスト専用のスプレッドシートを新規作成する**:
   本番シートとは別に「【検証用】顧客データ」といったダミーシートを作成し、そのスプレッドシート ID を環境変数やテストコードに渡します。
2. **スクリプトプロパティで切り替える**:
   ```javascript
   function getTargetSpreadsheet() {
     const env = PropertiesService.getScriptProperties().getProperty("ENV");
     if (env === "production") {
       return SpreadsheetApp.openById("本番シートID");
     }
     return SpreadsheetApp.openById("テスト用ダミーシートID");
   }
   ```
   ※なお、`openById` で外部シートを開く場合は、`appsscript.json` のスコープに `spreadsheets.currentonly` ではなく `https://www.googleapis.com/auth/spreadsheets`（または適切なドライブスコープ）が必要です。コンテナバインドスクリプトで同一シート内の「テスト用タブ」を作成して検証する場合は `currentonly` のままでも動作します。

## 典型的な 3 つの失敗パターンと対策

エージェントが検証ループで引っかかりやすい代表的なエラーとその対処法を把握しておきましょう。

### 1. 権限未承認（`Authorization is required`）

- **症状**: 関数の実行時や `clasp run-function` 実行時に `ScriptError: Authorization is required to perform that action` が返ってくる。
- **原因**: コードに新しいサービス（`GmailApp` 等）が追加されたが、実行アカウントで OAuth 権限が認可されていない。
- **対策**:
  - オンラインエディタで実行している場合は、ブラウザで関数を手動実行して承認ダイアログを完了させます。
  - `clasp run-function` を利用している場合は、自前の `creds.json` を使って `clasp login --use-project-scopes --creds creds.json` で再度ログインし直し、新しいスコープを認可します。

### 2. スコープ不足（`Insufficient Permission`）

- **症状**: API 呼び出し時にパーミッションエラーが出る。
- **原因**: `appsscript.json` の `oauthScopes` 配列に、新しく利用したサービス用のスコープが含まれていない。
- **対策**: `appsscript.json` を編集して必要なスコープを追記し、再度 `clasp push` してからブラウザで再承認します。

### 3. 6 分超過（`Exceeded maximum execution time`）

- **症状**: 実行が途中で突然タイムアウトする。
- **原因**: 大量ループ内でセルを 1 つずつ操作しているか、無限ループが発生している。
- **対策**: [SpreadsheetApp の基本](/themes/06-google-apps-script/03-spreadsheet/spreadsheet-basics) で学んだ `getValues` / `setValues` によるバッチ処理にリファクタリングするようエージェントに指示します。

## まとめ

- **検証ループの重要性**: テスト手段がないと、AI はコードが正しく動いたかを判定できず、自己修正が機能しない。
- **3 つの検証手段**:
  - `clasp run-function`: 実環境での高精度な結合テスト
  - `@mcpher/gas-fakes`: Node.js から実 Google API へリクエストを中継する実行確認
  - 純粋関数の切り出し: 外部通信不要でミリ秒単位で回るオフライン単体テスト（推奨）
- **安全運用の鉄則**: 本番データには絶対に触らせず、テスト専用のダミーシートを用意してループを回す。
