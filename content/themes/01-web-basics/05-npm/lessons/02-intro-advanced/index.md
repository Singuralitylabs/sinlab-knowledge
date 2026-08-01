---
title: "npm入門 応用編"
order: 2
type: lecture
difficulty: intermediate
tags: [npm, scripts, gitignore, package-manager]
estimatedMinutes: 14
status: published
---
# npm入門 応用編

## はじめに

基礎編では、`package.json` / `package-lock.json` の役割と、依存関係のインストール方法を学びました。応用編では、npmを**日々の開発でもっと便利に使う**ための3つのテーマを扱います。

- **scripts**：よく使うコマンドをショートカット化して自動実行する
- **node_modules と .gitignore**：巨大なパッケージ群をGitに含めないための正しい扱い方
- **他のパッケージ管理ツール**：Yarn・pnpm・Bunとの違いを知り、現場での選択肢を広げる

---

## scriptsでコマンドを自動化する

`package.json` の `scripts` フィールドには、よく使うコマンドやビルド手順をショートカットとして登録できます。

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

`npm run dev` や `npm test` のように短いコマンドで、長いコマンドラインを何度も打たずに済みます。`pre` / `post` という接頭辞を付けると、前処理・後処理も自動化できます。

::detail{slug="npm-scripts"}

---

## node_modules と .gitignore

`npm install` を実行すると、依存パッケージとその子依存パッケージがすべて `node_modules` ディレクトリにダウンロードされます。このディレクトリは**サイズが大きく、環境依存のコードを含むことがある**ため、Gitでは管理しません。

```text
# .gitignore の最低限の1行
node_modules
```

::detail{slug="node-modules-and-gitignore"}

---

## 他のパッケージ管理ツール

JavaScript / Node.js のエコシステムでは、npm以外にも **Yarn**・**pnpm**・**Bun** といったパッケージ管理ツールがよく使われます。それぞれ「速さ」「ディスク効率」「モノレポ対応」など異なる強みを持っています。

::detail{slug="package-manager-alternatives"}

---

## コマンドまとめ

| コマンド | 説明 | 使用例 |
|----------|------|--------|
| `npm run <name>` | カスタムスクリプトを実行 | `npm run build` |
| `npm start` / `npm test` | 組み込みスクリプトを実行 | `npm start` |
| `npm run` | 定義済みスクリプト一覧を表示 | `npm run` |
| `git rm -r --cached` | Git追跡から外す（ファイルは残す） | `git rm -r --cached node_modules` |
| `yarn add <pkg>` | Yarnで依存関係を追加 | `yarn add express` |
| `pnpm add <pkg>` | pnpmで依存関係を追加 | `pnpm add express` |
| `bun install` | Bunで依存関係をインストール | `bun install` |

---

## 実践演習：scriptsとgitignoreを整える

```bash
# 1. 練習用プロジェクトを作成
mkdir npm-advanced-practice && cd npm-advanced-practice
npm init -y

# 2. scripts を追加する（package.json を編集）
npm pkg set scripts.hello="echo Hello from npm scripts"
npm pkg set scripts.prehello="echo 前処理を実行中..."

# 3. 実行してみる（pre → 本体 の順で走ることを確認）
npm run hello

# 4. .gitignore を作成する
echo "node_modules" > .gitignore

# 5. Gitリポジトリとして確認する
git init
git add .
git status   # node_modules が含まれていないことを確認
```

---

## まとめ

応用編では、`scripts` によるコマンド自動化、`node_modules` の正しい扱い方、そして代表的な他ツールとの違いを解説しました。

`npm run <name>` を使いこなせば、複雑なビルド・テスト手順もチーム全員が同じコマンドで再現できます。`node_modules` は「再現可能な生成物」であり、Gitで管理する必要がないという原則も、忘れずに押さえておきましょう。

これで **npmモジュール** は完了です。基礎編・応用編を通して、npmの仕組みと構成ファイルを理解できていれば、依存関係のエラー対処やプロジェクトの環境構築がスムーズに行えるようになります。

### 次のステップ

- **Web技術基礎テーマ**（マークダウン・Git・VS Code・ターミナル・npm）はこれで完了です。次は **Web開発基礎テーマ**（HTML・CSS・JavaScript）に進み、実際にブラウザで動くWebページを作ってみましょう
- 実際のプロジェクトで `package.json` の `scripts` を読み、どんなビルド・テストフローが組まれているか観察してみましょう

### 参考リソース

- [npm scripts公式ドキュメント](https://docs.npmjs.com/cli/v10/using-npm/scripts)：scriptsの詳細な仕様
- [pnpm公式サイト](https://pnpm.io/ja/)：ディスク効率に特化したパッケージマネージャー
- [Bun公式サイト](https://bun.sh/)：高速なオールインワンJavaScriptランタイム

---

お疲れさまでした！これでnpmモジュールは完了です。次はWeb開発基礎テーマへ進みましょう。
