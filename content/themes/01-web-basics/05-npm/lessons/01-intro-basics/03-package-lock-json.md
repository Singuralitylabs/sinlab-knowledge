---
title: "package-lock.json"
order: 3
type: detail
difficulty: beginner
tags: [npm, package-lock, ci-cd]
estimatedMinutes: 6
status: published
---
# package-lock.json

## 解説

`package-lock.json` は、実際にインストールされたパッケージの**正確なバージョン**と、依存関係のツリー構造（依存の依存まで含む）を完全に記録・固定（ロック）するファイルです。`npm install` を実行すると自動的に生成・更新されます。

### なぜ package.json だけでは不十分なのか

```json
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

`package.json` の `^4.18.2` は「4.18.2以上、5.0.0未満のどれか」という**範囲指定**です。そのため、同じ `package.json` からでもインストールのタイミングによって、実際にインストールされるバージョンが変わる可能性があります。

```text
package.json だけの場合
  Aさんが npm install → express 4.18.2 が入る
  Bさんが1週間後に npm install → express 4.18.5 が入る（微妙にズレる）

package-lock.json がある場合
  誰が・いつ npm install しても → 全員 express 4.18.2 で統一
```

`package-lock.json` は、この「誰がいつインストールしても同じ構成になる」再現性を保証します。

### 必ずGitで管理する

`package-lock.json` は `.gitignore` に含めず、**必ずコミットして共有**します。これを共有しないと、ロックファイルの意味がなくなります。

---

## コマンドサンプル

```bash
# 通常のインストール（package.json / package-lock.json の両方を更新しうる）
npm install

# ロックファイル通りに厳密にインストール（CI/CD・本番ビルドで推奨）
npm ci

# ロックファイルの整合性のみ検証する
npm ci --dry-run
```

### `npm install` と `npm ci` の違い

| 項目 | `npm install` | `npm ci` |
|---|---|---|
| 用途 | 日常の開発（パッケージ追加・更新） | CI/CDや本番ビルドでの再現 |
| `package-lock.json` | 状況に応じて更新することがある | 更新しない（あれば厳密に従う） |
| 既存の `node_modules` | 差分だけ更新 | 削除してから再インストール |
| `package.json` と齟齬があるとき | 自動で解決しようとする | エラーで停止する |

---

## 実行結果

```text
$ npm install express
added 57 packages in 2s

$ ls
package.json  package-lock.json  node_modules

$ npm ci
npm warn old lockfile
added 57 packages in 1s

$ rm -rf node_modules package-lock.json
$ npm install express@4.18.0     # package.json と食い違わせてみる
$ npm ci
npm error `npm ci` can only install packages when your package.json and
npm error package-lock.json or npm-shrinkwrap.json are in sync. Please
npm error update your lock file with `npm install` before continuing.
```

---

## よくある間違い

### 1. `.gitignore` に `package-lock.json` を含めてしまう

```text
# ❌ ロックファイルを除外してしまうと再現性がなくなる
node_modules/
package-lock.json

# ✅ node_modules だけを除外する
node_modules/
```

### 2. CI環境で `npm install` を使ってしまう

```bash
# ❌ CI環境で npm install を使うと、微妙なバージョン差異が紛れ込む可能性がある
npm install
npm run build

# ✅ CI環境では npm ci で厳密に再現する
npm ci
npm run build
```

### 3. `package-lock.json` を手動で編集する

```text
❌ package-lock.json は依存関係の整合性ハッシュを含む自動生成ファイル。
   手動で書き換えると壊れやすく、npm install / npm ci が失敗する原因になる。

✅ バージョンを変えたい場合は npm install <pkg>@<version> のように
   npm コマンド経由で更新する。
```

---

## 実用例

### CIパイプラインでの典型的な使い方

```yaml
# GitHub Actions の例（抜粋）
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
  - run: npm ci
  - run: npm run build
  - run: npm test
```

### ロックファイルの更新だけを目的とした操作

```bash
# 依存関係は変えずに package-lock.json の整合性だけ再構築したいとき
rm -rf node_modules package-lock.json
npm install
```

---

## 実習

### 課題1：install と ci の違いを体験する

1. `npm install express` で依存関係を追加してください
2. `node_modules` と `package-lock.json` を削除してください
3. `npm ci` で再インストールし、`npm install` との実行速度やログの違いを観察してください

### 課題2：わざと不整合を起こす

1. `package.json` の `express` のバージョン番号を手動で書き換えてください（`package-lock.json` は変えない）
2. `npm ci` を実行し、エラーメッセージを確認してください
3. `npm install` で修復し、再度 `npm ci` が通ることを確認してください

### 課題3：.gitignoreの確認

自分の練習用プロジェクトの `.gitignore` に `package-lock.json` が**含まれていない**ことを確認してください。
