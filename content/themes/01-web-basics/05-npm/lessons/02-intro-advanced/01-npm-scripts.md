---
title: "npm scripts"
order: 1
type: detail
difficulty: intermediate
tags: [npm, scripts, automation]
estimatedMinutes: 6
status: published
---
# npm scripts

## 解説

`package.json` の `scripts` フィールドには、よく使うコマンドやビルド手順をショートカットとして登録できます。長いコマンドラインを覚える必要がなくなり、チーム全員が同じコマンドで同じ処理を実行できます。

### 定義例

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

### コマンドの実行方法

npmの `scripts` には、名前によって実行方法が2種類あります。

```text
組み込みスクリプト（start, test, stop, restart）
  → npm <name> でそのまま実行できる
    npm start
    npm test

カスタムスクリプト（それ以外の名前）
  → npm run <name> と「run」を付けて実行する
    npm run dev
    npm run build
    npm run lint
```

### pre・postスクリプトの仕組み

スクリプト名に `pre` または `post` を付与すると、前後処理を自動化できます。

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc",
    "postbuild": "echo ビルドが完了しました"
  }
}
```

`npm run build` を実行すると、自動的に `prebuild` → `build` → `postbuild` の順で実行されます。

```text
npm run build
   │
   ├─ 1. prebuild を実行（distフォルダを削除）
   ├─ 2. build を実行（TypeScriptをコンパイル）
   └─ 3. postbuild を実行（完了メッセージを表示）
```

---

## コマンドサンプル

```bash
# 定義済みのスクリプト一覧を表示
npm run

# 組み込みスクリプトの実行
npm start
npm test
npm stop
npm restart

# カスタムスクリプトの実行
npm run dev
npm run build
npm run lint

# スクリプトに追加の引数を渡す（-- の後ろが渡される）
npm run lint -- --fix

# 複数のスクリプトを直列に実行する
npm run lint && npm run test && npm run build
```

---

## 実行結果

```text
$ npm run
Lifecycle scripts included in my-app:
  test
    jest
available via `npm run-script`:
  dev
    nodemon index.js
  build
    tsc
  lint
    eslint .

$ npm run build
> my-app@1.0.0 prebuild
> rimraf dist

> my-app@1.0.0 build
> tsc

> my-app@1.0.0 postbuild
> echo ビルドが完了しました
ビルドが完了しました
```

---

## よくある間違い

### 1. カスタムスクリプトで `run` を付け忘れる

```bash
# ❌ カスタムスクリプトは run なしでは実行できない
npm dev
npm error Unknown command: "dev"

# ✅ run を付ける
npm run dev
```

### 2. pre/postの命名を間違える

```json
// ❌ ハイフンを入れてしまい、自動実行の対象にならない
{
  "scripts": {
    "pre-build": "rimraf dist",
    "build": "tsc"
  }
}

// ✅ 対象のスクリプト名の直前にそのまま pre/post を付ける（ハイフンなし）
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc"
  }
}
```

### 3. スクリプトへの引数の渡し方を間違える

```bash
# ❌ -- を付けずに引数を渡すと npm 自体のオプションとして解釈される
npm run lint --fix

# ✅ -- の後ろに書くとスクリプト側に渡される
npm run lint -- --fix
```

---

## 実用例

### lintとtestをまとめて実行する

```json
{
  "scripts": {
    "lint": "eslint .",
    "test": "jest",
    "check": "npm run lint && npm run test"
  }
}
```

```bash
npm run check   # lint と test を1コマンドでまとめて実行
```

### ビルド前にクリーンアップを自動化する

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc",
    "postbuild": "echo ビルド成果物: dist/"
  }
}
```

---

## 実習

### 課題1：基本のscriptsを定義する

1. 練習用プロジェクトの `package.json` に `hello` という名前のスクリプトを追加してください（`echo Hello`など）
2. `npm run hello` で実行できることを確認してください

### 課題2：pre/postを試す

1. `prehello` と `posthello` というスクリプトを追加してください（それぞれ異なるメッセージを表示）
2. `npm run hello` を実行し、3つのメッセージが順番に表示されることを確認してください

### 課題3：複数コマンドを1つにまとめる

`lint`（`echo lint実行中`で代用可）と `test`（`echo test実行中`で代用可）を定義し、両方を順番に呼び出す `check` スクリプトを作成してください。
