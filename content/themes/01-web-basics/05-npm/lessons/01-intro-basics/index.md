---
title: "npm入門 基礎編"
order: 1
type: lecture
difficulty: beginner
tags: [npm, package-manager, fundamentals, concept]
estimatedMinutes: 14
status: published
---
# npm入門 基礎編

## はじめに

### npmとは？

**npm (Node Package Manager)** は、Node.jsの標準パッケージマネージャーです。世界中の開発者が公開しているオープンソースライブラリ（パッケージ）を、自分のプロジェクトに簡単に導入・管理・共有できるツールです。

> [!NOTE]
> npmは [Node.js](https://nodejs.org/) をインストールすると同梱されます。`node -v` と `npm -v` の両方が表示されれば準備OKです。

### なぜパッケージ管理が必要なのか

パッケージ管理ツールがない場合、開発は次のような問題に直面します。

- ライブラリを手動でダウンロードしてプロジェクトに配置する必要がある
- ライブラリのバージョン更新や、依存ライブラリ（依存の依存）の追跡が難しい
- チーム開発で「同じバージョンを使う」という環境の統一が難しい

npmを使うことで、これらの問題が一挙に解決されます。

::detail{slug="what-is-npm"}

---

## package.json — プロジェクトの設計図

npmプロジェクトのルートディレクトリには `package.json` というファイルが置かれます。プロジェクトのメタ情報（名前・バージョン・説明）、依存しているパッケージの一覧、実行スクリプトなどを記述する、いわば**プロジェクトの設計図**です。

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

::detail{slug="package-json"}

---

## package-lock.json — バージョンを固定する

`package.json` と並んでもう1つ重要なのが `package-lock.json` です。実際にインストールされたパッケージの**正確なバージョン**と、依存関係のツリー構造を完全に記録・固定（ロック）します。

これにより、別の開発者やCI/CD環境で `npm install` を実行しても、まったく同じ構成でパッケージが再現されます。

::detail{slug="package-lock-json"}

---

## 依存関係とバージョンの指定

`package.json` には `dependencies`（本番用）と `devDependencies`（開発用）という2種類の依存関係が記録され、それぞれのバージョンは `^`（キャレット）や `~`（チルダ）といった記号で「どこまでの更新を許すか」を表します。

```json
{
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.5.0"
  }
}
```

::detail{slug="dependencies-and-versioning"}

---

## 基本コマンドまとめ

| コマンド | 説明 | 使用例 |
|----------|------|--------|
| `npm init` | `package.json` を作成 | `npm init -y` |
| `npm install` | 依存パッケージをインストール | `npm install express` |
| `npm install -D` | 開発用依存としてインストール | `npm install -D jest` |
| `npm ci` | ロックファイル通りに厳密インストール | `npm ci` |
| `npm uninstall` | パッケージを削除 | `npm uninstall lodash` |
| `npm update` | パッケージを更新 | `npm update` |
| `npm outdated` | 古くなったパッケージを確認 | `npm outdated` |
| `npm -v` / `node -v` | バージョンを確認 | `npm -v` |

---

## 実践演習：最初のnpmプロジェクト

```bash
# 1. プロジェクトディレクトリを作成
mkdir npm-practice && cd npm-practice

# 2. package.json を作成
npm init -y

# 3. パッケージをインストールしてみる
npm install lodash
npm install -D jest

# 4. package.json と package-lock.json の中身を確認
cat package.json
cat package-lock.json | head -20

# 5. node_modules が作られたことを確認
ls node_modules | head -5
```

---

## まとめ

本記事では、npmの役割と、`package.json` / `package-lock.json` という2つの設定ファイルの役割、そして依存関係とバージョン指定の読み方を解説しました。

npmは「**設計図（package.json）**」と「**正確な記録（package-lock.json）**」の2枚で、依存関係を管理しています。まずはこの2つのファイルが何のためにあるかを押さえましょう。

### 次のステップ

- 応用編に進み、`scripts` によるコマンドの自動化や `node_modules` の扱い方を学びましょう
- 実際に自分の手で `npm init` から `npm install` までを試してみましょう

### 参考リソース

- [npm公式ドキュメント](https://docs.npmjs.com/)：npmの公式リファレンス
- [Semantic Versioning](https://semver.org/lang/ja/)：セマンティックバージョニングの公式仕様

---

お疲れさまでした！基礎編の内容をマスターしたら、応用編に進みましょう。
