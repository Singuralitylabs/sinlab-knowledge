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
- 検証手法 2: **`gas-fakes` によるローカル高速エミュレーション**
- 安全にループを回すための「テスト用スプレッドシート」分離原則
- 典型的な 3 つの失敗パターン（権限未承認・スコープ不足・6 分超過）と AI への教え方

## GAS における検証ループの 2 大アプローチ

GAS の検証ループを構築するには、主に 2 つの道があります。

```text
【アプローチ A：クラウド実行（clasp run-function）】
  ローカルで編集 ──> clasp push ──> clasp run-function ──> クラウドの実行ログで判定
  ・長所：本物の Google インフラで実行されるため、最も信頼性が高い
  ・短所：push とリモート RPC のオーバーヘッドがあり、1 周に数秒〜十数秒かかる

【アプローチ B：ローカルエミュレーション（gas-fakes）】
  ローカルで編集 ──> Node.js 上で gas-fakes を使ってテスト実行 ──> 判定
  ・長所：ネットワーク通信不要、ミリ秒単位で超高速にループが回る
  ・短所：SpreadsheetApp などの振る舞いを 100% 完全には再現できない
```

プロジェクトの規模や開発段階に応じて、これらを使い分ける（または組み合わせる）のが定石です。

## アプローチ A: `clasp run-function` によるクラウド直接実行

`clasp` には、クラウド上にデプロイされたスクリプトの特定の関数をリモートから直接呼び出す `run-function`（旧 `run`）コマンドが用意されています。

### 事前準備（API 実行可能ファイルとしての設定）

リモートから関数を実行するには、スクリプト側でいくつかの設定が必要です。

1. **`appsscript.json` に実行 API 設定を追加**:
   ```json
   "executionApi": {
     "access": "MYSELF"
   }
   ```
2. **Google Cloud プロジェクトの紐付け**:
   標準のデフォルトプロジェクトではなく、自身の GCP プロジェクト番号を「プロジェクトの設定」から紐付け、Google Cloud Console 側で「Google Apps Script API」を有効化します。

### 実行と判定のコマンド

```bash
# 1. ローカルのコードをアップロード
clasp push

# 2. テスト用エントリポイント関数を実行
clasp run-function 'runAllTests'

# 3. ログの確認
clasp tail-logs --simplified
```

Claude Code などのエージェントには、テスト用の関数（例: `runAllTests()`）を用意させ、「コードを書き換えたら `clasp push && clasp run-function runAllTests` を実行して、エラーが出たら修正して」と指示します。

## アプローチ B: `gas-fakes` によるローカルエミュレーション

クラウドへの往復時間をゼロにして、秒単位で AI にループを回させたい場合に極めて強力なのが **`gas-fakes`** ライブラリです。

`gas-fakes` は、Google Apps Script の主要サービス（`SpreadsheetApp`、`PropertiesService`、`Utilities` など）の振る舞いを Node.js 上で模倣（フェイク）するオープンソースのライブラリです。

### 導入手順

```bash
# 開発用依存関係としてインストール
npm install --save-dev gas-fakes vitest
```

### テストコードの例（Vitest / Jest）

```javascript
// tests/spreadsheet.test.js
import { describe, it, expect, beforeEach } from "vitest";
import { SpreadsheetApp } from "gas-fakes";

// グローバルスコープに SpreadsheetApp を注入
global.SpreadsheetApp = SpreadsheetApp;

// テスト対象の関数を読み込み
import { calculateTotals } from "../src/Code.js";

describe("売上集計のテスト", () => {
  let sheet;

  beforeEach(() => {
    // インメモリ上に仮想のスプレッドシートを作成
    const ss = SpreadsheetApp.create("テスト用シート");
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

### エージェントへの指示

この構成にしておけば、エージェントはローカル完結で `npx vitest run` を実行できます。Google のサーバーと通信することなく、**数ミリ秒でテスト結果が得られる** ため、AI の試行錯誤（自己修正ループ）が劇的に加速します。

> [!NOTE]
> `gas-fakes` は主要な基本 API の約 7 割をカバーしていますが、特殊なアドオン機能や高度な外部通信など、未対応のメソッドもあります。単体ロジックの検証は `gas-fakes` で行い、最終的な統合確認は実環境で行うハイブリッド構成が推奨されます。

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

## 典型的な 3 つの失敗パターンと対策

エージェントが検証ループで引っかかりやすい代表的なエラーとその対処法を把握しておきましょう。

### 1. 権限未承認（`Authorization is required`）

- **症状**: `clasp run-function` を実行すると `ScriptError: Authorization is required to perform that action` が返ってくる。
- **原因**: コードに新しいサービス（`GmailApp` 等）が追加されたが、ブラウザ上で OAuth 権限が承認されていない。
- **対策**: エージェントには承認画面をクリックする権限がありません。人間が一度 `clasp open-script` でブラウザを開き、エディタ上で手動実行して承認を完了させる必要があります。

### 2. スコープ不足（`Insufficient Permission`）

- **症状**: API 呼び出し時にパーミッションエラーが出る。
- **原因**: `appsscript.json` の `oauthScopes` 配列に、新しく利用したサービス用のスコープが含まれていない。
- **対策**: `appsscript.json` を編集して必要なスコープを追記し、再度 `clasp push` してからブラウザで再承認します。

### 3. 6 分超過（`Exceeded maximum execution time`）

- **症状**: 実行が途中で突然タイムアウトする。
- **原因**: 大量ループ内でセルを 1 つずつ操作しているか、無限ループが発生している。
- **対策**: [SpreadsheetApp の基本](/themes/06-google-apps-script/01-basics/spreadsheet-basics) で学んだ `getValues` / `setValues` によるバッチ処理にリファクタリングするようエージェントに指示します。

## まとめ

- **検証ループの重要性**: テスト手段がないと、AI はコードが正しく動いたかを判定できず、自己修正が機能しない。
- **2 つの手段**:
  - `clasp run-function`: 実環境での高精度な結合テスト
  - `gas-fakes`: Node.js 上でミリ秒単位で回る高速単体テスト
- **安全運用の鉄則**: 本番データには絶対に触らせず、テスト専用のダミーシートを用意してループを回す。
