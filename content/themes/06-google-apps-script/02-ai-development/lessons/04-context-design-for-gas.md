---
title: "GAS 向けコンテキスト設計（CLAUDE.md と型定義）"
description: "GAS 固有の制約（6分制限・同期API・バッチ処理・スコープ最小化）を AI に確実に守らせるための CLAUDE.md テンプレートと、@types/google-apps-script による型補完の設計法。"
order: 4
type: lecture
difficulty: intermediate
tags: [gas, google-apps-script, claude-code, context-engineering]
status: draft
---

# GAS 向けコンテキスト設計（CLAUDE.md と型定義）

[コンテキストエンジニアリング](/themes/04-ai-driven-development/01-overview/context-engineering) で学んだ通り、AI コーディングエージェントの出力精度は「AI に何を見せるか（どのような前提情報を与えるか）」で決定づけられます。

特に Google Apps Script（GAS）は、一般的な Node.js 開発とは異なる「6 分制限」「同期 API」「バッチ処理の必須性」といった強いルールを持っています。何も指示を与えずに Claude Code を走らせると、一般的なモダン JavaScript の知識で `async/await` を乱用したり、ループ内で `setValue` を連打するコードを出力してしまいます。

本ページでは、これらの失敗を根絶し、AI に常に堅牢で GAS 最適化されたコードを書かせるための **`CLAUDE.md` テンプレート** と、**`@types/google-apps-script` による型定義の活用法** を解説します。

## このページで学べること

- GAS プロジェクトにおけるコンテキスト設計の重要性
- Claude Code が参照するプロジェクト固有メモリ `CLAUDE.md` の役割
- 実践的ですぐに使える **GAS 開発用 `CLAUDE.md` テンプレート**
- `@types/google-apps-script` の導入と AI のハルシネーション抑制
- `appsscript.json` をコンテキストとして読ませる効果

## なぜ GAS には専用のコンテキスト設計が必要なのか

Claude や GPT などのフロンティアモデルは、インターネット上の膨大な JavaScript/TypeScript コードを学習しています。その大半は Node.js、ブラウザの DOM API、React などのコードです。

一方、GAS のコード量はそれらに比べると少数派であり、以下のような**「一般的な JavaScript とは真逆のルール」** を AI は見落としがちです。

| 一般的な Web/Node.js 開発 | GAS 開発の掟 | AI が起こしやすいミス |
| --- | --- | --- |
| I/O は `async` / `await` や `Promise` が基本 | 組み込み API は **同期型**（Promise は不要） | `await SpreadsheetApp...` や不要な Promise チェーンを生成する |
| `process.env.API_KEY` で環境変数取得 | `PropertiesService` を使用 | `process is not defined` でスクリプトが落ちる |
| 単一レコードの更新も容易 | ループ内 RPC は厳禁、`setValues` の一括処理が必須 | 処理が極端に遅くなり 6 分タイムアウトで停止する |
| npm パッケージを `import` して使用 | バンドラなしでは外部ライブラリの import は不可 | `import lodash from 'lodash'` などをそのまま書いて push で構文エラー |

これらの落とし穴を事前に AI のコンテキストウィンドウへ注入するのが、プロジェクトルートに配置する `CLAUDE.md` です。

## GAS 開発用 CLAUDE.md テンプレート

プロジェクトのルートディレクトリに以下の `CLAUDE.md` を作成しておくと、Claude Code はセッション開始時に自動的にこのルールを読み込み、GAS に適したコードだけを生成するようになります。

```markdown
# CLAUDE.md (Google Apps Script プロジェクト用)

本プロジェクトは Google Apps Script (GAS) 環境で動作するアプリケーションです。
コードの生成およびリファクタリング時は、以下の GAS 固有の制約を厳守してください。

## 1. 実行環境とアーキテクチャの制約
- **同期 API の徹底**: `SpreadsheetApp`, `DriveApp`, `GmailApp`, `UrlFetchApp` などの
  Google Apps Script 組み込みサービスはすべて同期実行されます。不要な `async` / `await` や
  `Promise` を追加しないでください。
- **6 分実行制限**: 1 回の最長実行時間は 6 分です。大量データ処理時は `getValues` / `setValues` による
  バッチ処理を徹底し、実行時間が長引く設計を避けてください。
- **Node.js 依存の禁止**: `fs`, `path`, `crypto`, `process` などの Node.js 組み込みモジュールは存在しません。
  環境変数や秘密情報は `PropertiesService.getScriptProperties()` を使用してください。

## 2. スプレッドシート操作のコーディング規約
- **バッチ処理の義務付け**: ループ内での `getValue()` / `setValue()` の呼び出しは厳禁です。
  必ず `getRange().getValues()` で 2 次元配列として一括取得し、メモリ上で処理した後、
  `range.setValues()` で一括書き戻しを行ってください。
- **インデックスの扱い**: スプレッドシートの行・列は 1 始まり、JavaScript 配列は 0 始まりです。
  境界値のズレ（Off-by-one エラー）に十分注意してください。

## 3. セキュリティとマニフェスト
- **最小権限スコープ**: `appsscript.json` に設定された `oauthScopes` を常に意識してください。
  不要に広範な権限（ドライブ全体へのアクセス等）を要求する API の利用は避け、
  可能な限り `.currentonly` や必要最小限のスコープに留めてください。

## 4. clasp コマンド規約 (clasp 3.x)
- push: `clasp push`
- 実行: `clasp run-function <関数名>`（※自前クレデンシャル・デプロイ設定環境）
- ログ取得: `clasp tail-logs --simplified`（※GCP プロジェクト紐付け環境）
- エディタを開く: `clasp open-script`
```

> [!TIP]
> プロジェクト固有のシート構造（例:「『ユーザーマスタ』シートの A 列に ID、B 列に名前がある」など）や、独自の命名規則がある場合は、上記テンプレートの下部に追記しておくと、AI が正確な列インデックスでコードを組み立ててくれます。

## `@types/google-apps-script` による型安全性の担保

TypeScript を直接トランスパイルしない JavaScript プロジェクトであっても、型定義ファイル `@types/google-apps-script` をインストールしておくことは絶大な効果があります。

```bash
# プロジェクトに開発用依存関係として追加
npm install --save-dev @types/google-apps-script
```

### なぜ型定義が AI 開発に効くのか？

1. **AI のハルシネーション（嘘の API 生成）を防ぐ**:
   AI は存在しないメソッド（例: `SpreadsheetApp.getSheet()` のような誤った推測）を稀に出力しますが、型定義が存在していれば、エージェントが型チェックコマンド（`tsc --noEmit`）を実行した瞬間にエラーを検知して自己修正できます。
2. **VS Code でのコード補完・ホバー解説**:
   人間がコードを確認する際にも、引数や戻り値の型がインテリセンスとして表示されるため、レビューの負担が激減します。

プロジェクトルートに最小限の `jsconfig.json`（または `tsconfig.json`）を置いておくだけで、エディタおよび AI ツールに型定義が認識されます。

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "types": ["google-apps-script"],
    "checkJs": true
  },
  "include": ["src/**/*"]
}
```

## `appsscript.json` を常に読ませる

プロジェクトの `appsscript.json` には、タイムゾーン（`timeZone`）や利用可能な OAuth スコープが記載されています。

Claude Code などのエージェントに機能開発を依頼する際は、「`appsscript.json` を確認した上で実装して」と一言添えるか、`CLAUDE.md` 内で参照を指示しておくことで、次のような事故を防げます。

- 日本標準時（`Asia/Tokyo`）前提のコードなのに、UTC で時刻計算してしまうミス
- スクリプトに必要な OAuth スコープが `appsscript.json` に不足しており、push 後に権限エラーで落ちるミス

## まとめ

- **コンテキストの重要性**: GAS は一般的な JavaScript と異なり、同期 API・6 分制限・バッチ処理必須という強い前提がある。
- **`CLAUDE.md` の活用**: GAS 固有の掟を明文化したテンプレートを配置することで、AI のミスを未然に防止。
- **型定義の導入**: `@types/google-apps-script` を導入することで、AI のハルシネーションを型チェックで弾き、自己修正ループを強化する。
- **マニフェストとの連携**: `appsscript.json` のタイムゾーンやスコープを AI に把握させることが安定稼働への鍵。
