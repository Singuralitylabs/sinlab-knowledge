---
title: "package.json"
order: 2
type: detail
difficulty: beginner
tags: [npm, package-json, reference]
estimatedMinutes: 6
status: published
---
# package.json

## 解説

`package.json` は、npmプロジェクトのルートディレクトリに置かれるマニフェストファイルです。プロジェクトのメタ情報、依存パッケージの一覧、実行スクリプトなどを1つのJSONファイルにまとめます。

### 主要フィールド

| フィールド | 役割 | 例 |
|---|---|---|
| `name` | パッケージ名（小文字・ハイフン区切り推奨） | `"my-app"` |
| `version` | セマンティックバージョニングに従ったバージョン | `"1.0.0"` |
| `description` | パッケージの説明 | `"社内向けタスク管理アプリ"` |
| `main` | エントリーポイントのファイル | `"index.js"` |
| `scripts` | `npm run` で実行できるコマンド集 | `{ "start": "node index.js" }` |
| `dependencies` | 本番用の依存パッケージ | `{ "express": "^4.18.2" }` |
| `devDependencies` | 開発用の依存パッケージ | `{ "jest": "^29.5.0" }` |
| `author` | 作者情報 | `"Taro Yamada"` |
| `license` | ライセンス種別 | `"MIT"` |
| `private` | `true` にするとnpm公開を誤って防止できる | `true` |

### `name` の命名ルール

```text
【OK】
my-app
my-app-2
@my-org/my-app     … スコープ付きパッケージ

【NG】
My App             … 大文字・スペースは不可
my_app!             … 記号（アンダースコア以外）は不可
```

---

## コマンドサンプル

```bash
# 対話式で package.json を作成
npm init

# 質問なしでデフォルト値のまま作成
npm init -y

# 特定のテンプレートから作成（例: Vite）
npm create vite@latest my-app

# package.json の特定フィールドを取得
npm pkg get name
npm pkg get scripts

# package.json の特定フィールドを更新
npm pkg set description="タスク管理アプリ"
```

---

## 実行結果

```text
$ npm init -y
Wrote to /Users/you/my-app/package.json:

{
  "name": "my-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

$ npm pkg set description="タスク管理アプリ"

$ npm pkg get description
"タスク管理アプリ"
```

---

## よくある間違い

### 1. package.json を直接編集した後にJSONの文法ミス

```json
// ❌ 末尾カンマ（トレイリングカンマ）はJSONでは無効
{
  "name": "my-app",
  "version": "1.0.0",
}

// ✅ 最後の項目にカンマを付けない
{
  "name": "my-app",
  "version": "1.0.0"
}
```

### 2. `name` に大文字やスペースを使ってしまう

```bash
# ❌ npm init 実行時にエラーになる
package name: (My App)
npm error Invalid package name "My App"

# ✅ 小文字とハイフンで命名する
package name: (my-app)
```

### 3. `private: true` を付け忘れて社内用パッケージを公開してしまう

```json
// ✅ 公開する予定のないプロジェクトには必ず付ける
{
  "name": "internal-tool",
  "private": true
}
```

---

## 実用例

### チームの新規プロジェクトの雛形を整える

```bash
npm init -y
npm pkg set description="社内ダッシュボード"
npm pkg set license="UNLICENSED"
npm pkg set private=true
```

### CLIで依存関係を確認する

```bash
# package.json をパースせずに一覧で見たいとき
npm pkg get dependencies
npm pkg get devDependencies
```

---

## 実習

### 課題1：package.jsonを作って編集する

1. 新しいディレクトリで `npm init -y` を実行してください
2. `npm pkg set` を使って `description` と `author` を自分の情報に書き換えてください
3. `cat package.json` で結果を確認してください

### 課題2：命名ルールを確認する

`npm init` を対話式で実行し、パッケージ名に大文字やスペースを入れてエラーになることを確認してください（`Ctrl+C` で途中終了してOKです）。

### 課題3：privateフィールドを追加する

既存の `package.json` に `"private": true` を追加し、`npm pkg get private` で確認してください。
