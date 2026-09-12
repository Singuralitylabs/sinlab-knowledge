---
title: "SpreadsheetApp の基本とバッチ処理"
description: "SpreadsheetApp の基本操作（getRange、getValues、setValues）と、6 分制限を回避し高速化するためのバッチ処理の重要性を学ぶ。"
order: 1
type: lecture
difficulty: beginner
tags: [gas, google-apps-script, spreadsheet]
status: published
---

# SpreadsheetApp の基本とバッチ処理

Google スプレッドシートの操作は、GAS で最も頻繁に行われるタスクです。Google が提供する `SpreadsheetApp` サービスを使えば、シートの新規作成から値の読み書き、装飾、数式の挿入まであらゆる操作をコード化できます。

しかし、スプレッドシートの API 操作には独特のルールがあり、特に **「バッチ処理（一括読み書き）」** の作法を理解していないと、処理速度が数百倍遅くなり、GAS の 6 分実行制限に引っかかってしまいます。本ページでは、`SpreadsheetApp` の最小セットと必須のパフォーマンス原則を解説します。

## このページで学べること

- `SpreadsheetApp` のオブジェクト階層（Spreadsheet → Sheet → Range）
- 単一セルの読み書きとセル範囲（Range）の指定方法
- **アンチパターン**: ループ内での `getValue()` / `setValue()` 連打
- **ベストプラクティス**: `getValues()` と `setValues()` によるバッチ処理
- 実践コード例（データのフィルタリングと集計の一括反映）

## SpreadsheetApp のオブジェクト階層

`SpreadsheetApp` を扱う際は、オブジェクトの親子関係をイメージすることが重要です。

```text
[SpreadsheetApp]  ── 操作のエントリポイント
      │
      ▼
[Spreadsheet]     ── スプレッドシートファイル全体（ブックに相当）
      │
      ▼
[Sheet]           ── 1 つのシート（タブ）
      │
      ▼
[Range]           ── セルまたはセル範囲（「A1:C10」など）
```

### スプレッドシートとシートの取得

```javascript
// コンテナバインドスクリプトの場合：現在開いているスプレッドシートを取得
const ss = SpreadsheetApp.getActiveSpreadsheet();

// シート名を指定して取得
const sheet = ss.getSheetByName("売上データ");

// または、現在アクティブになっているシートを取得
const activeSheet = ss.getActiveSheet();
```

> [!NOTE]
> スタンドアロンスクリプトから特定のスプレッドシートを操作する場合は、ファイル URL や ID を指定する `SpreadsheetApp.openById("スプレッドシートID")` を使用します。

## 範囲（Range）の指定と値の読み書き

セルの値を読み書きするには、まず操作対象の「範囲（Range）」を取得します。

### 1. 単一セルの操作

```javascript
// A1 セルの値を取得
const range = sheet.getRange("A1");
const value = range.getValue();
console.log(`A1の値: ${value}`);

// B1 セルに値を書き込む
sheet.getRange("B1").setValue("完了");
```

行番号と列番号（1 始まりの数値）で指定することもできます。

```javascript
// getRange(row, column) => 1行目、1列目（A1）
const a1 = sheet.getRange(1, 1).getValue();

// getRange(row, column, numRows, numColumns) => 2行目の1列目から、3行2列分（A2:B4）
const rangeArea = sheet.getRange(2, 1, 3, 2);
```

## 最大の落とし穴：ループ内での setValue 連打

初心者が最も陥りやすく、生成 AI もプロンプト次第で出力してしまう最大のアンチパターンが **「for ループの中で 1 行ずつセルを読み書きするコード」** です。

### ❌ 悪い例（アンチパターン：1 行ずつ処理）

```javascript
function slowProcess() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  // 1,000行あると、1,000回のネットワーク通信が発生してタイムアウトする！
  for (let i = 2; i <= lastRow; i++) {
    const status = sheet.getRange(i, 2).getValue(); // 通信 1 回
    if (status === "未処理") {
      sheet.getRange(i, 3).setValue("処理済み");     // 通信 1 回
    }
  }
}
```

### なぜこれが遅いのか？

`getValue()` や `setValue()` を呼び出すたびに、GAS の実行サーバーから Google スプレッドシートのストレージサーバーへとネットワーク通信（RPC）が行われます。

- 1 回の RPC に約 0.05 〜 0.1 秒かかります。
- 1,000 行のデータでそれぞれ 2 回呼び出すと、2,000 回 × 0.05 秒 ＝ **約 100 秒（1 分半以上）**。
- データが数千行を超えると、あっという間に **6 分の制限時間を超えて強制終了** します。

## ベストプラクティス：getValues / setValues によるバッチ処理

高速に処理するための鉄則は、**「通信は 2 回だけ（最初に全部読み、最後に全部書く）」** です。

```text
【低速な方法】
GAS ──────(読む)──────> シート
GAS <─────(1行)─────── シート
GAS ──────(書く)──────> シート
  ... (これを1000回繰り返す = 数分かかる)

【バッチ処理（高速）】
GAS ──────(getValues で全件一括取得)──────> シート （通信 1 回）
  [GAS のメモリ・配列上で高速に全行ループ処理] （0.01秒で完了）
GAS ──────(setValues で全件一括書き込み)────> シート （通信 1 回）
```

### ✅ 良い例（ベストプラクティス：バッチ処理）

```javascript
function fastProcess() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return; // ヘッダーのみ、または空の場合は終了

  // 1. 必要な範囲を 2 次元配列として一括取得（通信 1 回）
  // A2 から 最終行-1 行分、3 列分を取得（A列:ID, B列:ステータス, C列:結果）
  const range = sheet.getRange(2, 1, lastRow - 1, 3);
  const data = range.getValues(); // 2次元配列: [[id, status, result], ...]

  // 2. JavaScript のインメモリで配列を加工
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const status = row[1]; // B列（インデックス1）
    if (status === "未処理") {
      row[2] = "処理済み"; // C列（インデックス2）の配列要素を更新
    }
  }

  // 3. 加工した 2 次元配列を同じ範囲に一括書き込み（通信 1 回）
  range.setValues(data);
}
```

この方法であれば、1,000 行のデータであっても **わずか 1 秒未満** で処理が完了します。

### バッチ処理のポイント

1. **`getValues()` の戻り値は 2 次元配列 `data[行][列]`**:
   1 行 1 列であっても、戻り値は必ず `[[値]]` という二重配列になります。
2. **インデックスのズレに注意**:
   スプレッドシートの行・列番号は **1 始まり**（1-indexed）ですが、JavaScript の配列インデックスは **0 始まり**（0-indexed）です。
3. **書き込むサイズの一致**:
   `range.setValues(array)` に渡す 2 次元配列の「行数・列数」は、取得した `range` の「行数・列数」と完全に一致していなければ例外エラーになります。

## まとめ

- **階層構造**: `SpreadsheetApp` → `Spreadsheet` → `Sheet` → `Range`。
- **絶対厳禁**: `for` ループの中で `getValue()` や `setValue()` を呼び出さない。
- **バッチ処理**:
  1. `range.getValues()` でデータを 2 次元配列として一括取得
  2. JavaScript の配列操作でメモリ上で高速に加工
  3. `range.setValues()` で一括書き戻し
- **AI への指示**: 生成 AI にコードを書かせる際、「必ず `getValues` と `setValues` を使ったバッチ処理にすること」を前提条件として明記することが極めて重要です。
- **次のステップ**: 前のモジュールで学んだ clasp × Claude Code のワークフローと組み合わせて、バッチ処理を実践しましょう。今後のモジュールでは DriveApp や GmailApp など、他の Google サービス連携も扱います。
