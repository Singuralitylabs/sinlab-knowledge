---
title: "他のパッケージ管理ツール"
order: 3
type: detail
difficulty: intermediate
tags: [npm, yarn, pnpm, bun, package-manager]
estimatedMinutes: 6
status: published
---
# 他のパッケージ管理ツール

## 解説

JavaScript / Node.js のエコシステムでは、npm以外にも代表的なパッケージ管理ツールとして **Yarn**・**pnpm**・**Bun** の3つがよく使われています。

### Yarn（ヤーン）

Meta（旧Facebook）が開発したツールで、当時のnpmの課題だった「インストール速度の遅さ」や「安定性」を解決するために登場しました。

- **特徴**：並列ダウンロードによる高速な動作、複数のプロジェクトを1つのリポジトリで管理する**モノレポ（Workspaces）**機能に強みがあります
- **こんな時におすすめ**：大型プロジェクトや、複数のパッケージをまとめて管理したい場合

### pnpm（ピーエヌピーエム）

「Performant npm」の略で、**ディスク容量の節約**と**高速なインストール**に特化したツールです。

- **特徴**：パッケージをPC内の1箇所（グローバルストア）にのみ保存し、各プロジェクトへはシンボリックリンク（ショートカットのようなもの）を貼る仕組みです。`node_modules` が重複してディスクを圧迫するのを防げます
- **こんな時におすすめ**：ストレージ容量を節約したい時、複数プロジェクトを並行して開発する時

### Bun（バン）

JavaScriptの新しいオールインワン実行環境（Node.jsの代替）であり、標準でパッケージマネージャー機能も備えています。

- **特徴**：Zig言語で書かれており、他のツールより高速に動作します。npm互換のコマンド（`bun install` など）で利用できます
- **こんな時におすすめ**：インストール時間を短縮したい場合、実行環境ごと新しいツールに揃えたい場合

### コマンド対応表

| 操作 | npm | Yarn | pnpm | Bun |
|---|---|---|---|---|
| 初期化 | `npm init -y` | `yarn init -y` | `pnpm init` | `bun init` |
| インストール（全体） | `npm install` | `yarn` / `yarn install` | `pnpm install` | `bun install` |
| パッケージ追加 | `npm install <pkg>` | `yarn add <pkg>` | `pnpm add <pkg>` | `bun add <pkg>` |
| 開発用に追加 | `npm install -D <pkg>` | `yarn add -D <pkg>` | `pnpm add -D <pkg>` | `bun add -d <pkg>` |
| スクリプト実行 | `npm run <name>` | `yarn <name>` | `pnpm <name>` | `bun run <name>` |
| ロックファイル | `package-lock.json` | `yarn.lock` | `pnpm-lock.yaml` | `bun.lock` |
| CIでの厳密インストール | `npm ci` | `yarn install --frozen-lockfile` | `pnpm install --frozen-lockfile` | `bun install --frozen-lockfile` |

> [!NOTE]
> 本リポジトリ（sinlab-knowledge）では **Bun** をパッケージマネージャー兼TSランタイムとして使用しています。詳細は `CLAUDE.md` を参照してください。

---

## コマンドサンプル

```bash
# Yarn を使う場合
yarn init -y
yarn add express
yarn add -D jest
yarn dev

# pnpm を使う場合
pnpm init
pnpm add express
pnpm add -D jest
pnpm run dev

# Bun を使う場合
bun init
bun add express
bun add -d jest
bun run dev
```

---

## 実行結果

```text
$ bun install
bun install v1.1.0

+ express@4.18.2
+ 56 more packages installed [312ms]

$ pnpm install
Packages: +57
++++++++++++++++++++++++++++++++++++
Progress: resolved 57, reused 57, downloaded 0, added 57, done

dependencies:
+ express 4.18.2

Done in 1.2s
```

---

## よくある間違い

### 1. 複数のロックファイルが混在する

```text
❌ package-lock.json（npm）と yarn.lock（Yarn）が
   同じプロジェクトに両方存在する
   → チームメンバーによって使うツールがバラバラになり、
     依存関係の再現性が崩れる

✅ プロジェクトごとに使うパッケージマネージャーを1つに決め、
   README や CLAUDE.md 等に明記する
```

### 2. ツールを混ぜて使ってしまう

```bash
# ❌ npm でインストールした後、別の日に yarn で追加する
npm install express
yarn add lodash
# → ロックファイルの整合性が壊れる

# ✅ プロジェクトで決めたツールのコマンドだけを使い続ける
npm install express
npm install lodash
```

### 3. 案件のツールを確認せずnpmで進めてしまう

```bash
# ❌ プロジェクトに pnpm-lock.yaml があるのに気づかず npm install を実行
npm install
# → package-lock.json が新たに作られ、ロックファイルが二重管理になる

# ✅ 作業前にロックファイルの種類を確認する
ls *lock*
# pnpm-lock.yaml があれば pnpm install を使う
```

---

## 実用例

### プロジェクトのパッケージマネージャーを確認する

```bash
# どのロックファイルがあるかで、使うべきツールを判断できる
ls | grep -E "lock"

# package.json に packageManager フィールドがあれば、それに従う
cat package.json | grep packageManager
```

### モノレポでYarn/pnpmのWorkspacesを使う（概要）

```json
{
  "name": "my-monorepo",
  "workspaces": ["packages/*"]
}
```

複数の関連パッケージを1つのリポジトリでまとめて管理したい場合、YarnやpnpmのWorkspaces機能が便利です。

---

## 実習

### 課題1：コマンドを対応表で確認する

`npm install -D typescript` を、Yarn・pnpm・Bunそれぞれの書き方に書き換えてみてください（実際にインストールする必要はありません）。

### 課題2：ロックファイルを見分ける

架空のプロジェクトに `yarn.lock` だけが存在するとしたら、どのコマンドで依存関係をインストールすべきか答えてください。

### 課題3（発展）：Bunを試す

もし環境にBunがインストールされていれば、練習用プロジェクトで `bun install` を実行し、`node_modules` の生成速度や `bun.lock` の中身をnpmと比較してみてください。
