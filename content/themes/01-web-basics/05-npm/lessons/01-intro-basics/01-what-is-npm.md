---
title: "npmとは"
order: 1
type: detail
difficulty: beginner
tags: [npm, fundamentals]
estimatedMinutes: 5
status: published
---
# npmとは

## 解説

**npm (Node Package Manager)** は、Node.jsの標準パッケージマネージャーです。世界中の開発者が共有しているオープンソースライブラリ（パッケージ）を、自分のプロジェクトに簡単に導入・管理・共有するためのツールです。

### npmを構成する3つの要素

npmという言葉は、実は3つの異なるものを指しています。

```text
1. npm レジストリ  … パッケージが公開されている巨大なオンラインデータベース
2. npm CLI        … npmコマンド。パッケージのインストールや管理を行うツール（本記事の主役）
3. npm, Inc.       … レジストリを運営する組織（現在はGitHub傘下）
```

普段「npm」と言うときは、多くの場合 `npm install` などのコマンドを指す**npm CLI**のことです。

### パッケージ管理がない場合の問題点

もしパッケージ管理ツールがなければ、開発は次のような問題に直面します。

1. **手動配置の手間** — ライブラリを手動でダウンロードしてプロジェクトに配置する必要がある
2. **バージョン管理の困難** — ライブラリの更新や、依存ライブラリ（依存の依存）の追跡が難しい
3. **環境差異** — チーム開発で「全員が同じバージョンを使う」という統一が難しい

npmはこれらをすべて自動化し、`package.json` というファイル1つで依存関係を宣言的に管理できるようにします。

### npmとNode.jsの関係

npmは [Node.js](https://nodejs.org/) をインストールすると自動的に同梱されます。別途npmだけをインストールする必要はありません。

```text
Node.js のインストール
  └─ node コマンド（JavaScriptの実行環境）
  └─ npm コマンド（パッケージマネージャー）※同梱
```

---

## コマンドサンプル

```bash
# Node.js のバージョンを確認
node -v

# npm のバージョンを確認
npm -v

# npm に関する各種情報を表示
npm help
npm help install

# 新しいプロジェクトの package.json を対話式で作成
npm init

# 質問に答えずデフォルト値で package.json を作成
npm init -y
```

---

## 実行結果

```text
$ node -v
v20.11.0

$ npm -v
10.2.4

$ mkdir hello-npm && cd hello-npm
$ npm init -y
Wrote to /Users/you/hello-npm/package.json:

{
  "name": "hello-npm",
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
```

---

## よくある間違い

### 1. npmを個別にインストールしようとする

```bash
# ❌ npm単体をインストールしようとする必要はない
# （Node.jsに同梱されているため、通常は不要）

# ✅ Node.js をインストールすれば npm もついてくる
# https://nodejs.org/ から LTS 版をダウンロード
```

### 2. npmとnpxを混同する

```text
npm  … パッケージを「インストール・管理」するコマンド
npx  … パッケージを「一時的に実行」するコマンド（インストール不要）

npm install create-vite    # インストールしてから使う
npx create-vite my-app     # インストールせずに一度だけ実行する
```

### 3. `npm init` の質問にすべて答えようとして混乱する

```bash
# ❌ 全項目を手入力しようとして詰まる
$ npm init
package name: (my-app)
version: (1.0.0)
description:
...

# ✅ とりあえず動かしたいだけならデフォルト値で作成し、後から package.json を編集する
$ npm init -y
```

---

## 実用例

### 新規プロジェクトを立ち上げる典型的な流れ

```bash
mkdir my-project && cd my-project
npm init -y
npm install express          # 本番用の依存関係を追加
npm install -D nodemon       # 開発用の依存関係を追加
```

### バージョンだけをすばやく確認する

```bash
# 環境構築のトラブルシューティングでまず確認する2行
node -v
npm -v
```

---

## 実習

### 課題1：バージョンを確認する

自分のPCで `node -v` と `npm -v` を実行し、バージョンが表示されることを確認してください。

### 課題2：最初のプロジェクトを作る

1. `npm-first-project` というディレクトリを作成してください
2. `npm init -y` で `package.json` を作成してください
3. できあがった `package.json` の中身を見て、`name` と `version` がどこから来たか確認してください

### 課題3：npmとnpxの違いを体験する

`npx cowsay "hello npm"`（インストールせずに一度だけ実行）を試し、`node_modules` が作られないことを確認してください。
