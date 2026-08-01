---
title: "依存関係とバージョン指定"
order: 4
type: detail
difficulty: beginner
tags: [npm, semver, dependencies]
estimatedMinutes: 7
status: published
---
# 依存関係とバージョン指定

## 解説

`package.json` には主に2種類の依存関係指定エリアがあります。

### dependencies と devDependencies

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

| 区分 | 役割 | 例 | インストールコマンド |
|---|---|---|---|
| `dependencies` | 本番環境でアプリを動かすために必要 | Express, React, Vue, Lodash | `npm install <pkg>` |
| `devDependencies` | 開発・テスト・ビルド時のみ必要 | Jest, ESLint, Prettier, TypeScript, Webpack | `npm install -D <pkg>` |

### セマンティックバージョニング（SemVer）

npmパッケージは **セマンティックバージョニング (SemVer)** に従って管理されています。形式は `MAJOR.MINOR.PATCH` です。

```text
4.18.2
│  │  │
│  │  └─ PATCH：後方互換性のあるバグ修正
│  └──── MINOR：後方互換性のある機能追加
└─────── MAJOR：互換性のない大きな変更（破壊的変更）
```

### バージョン記号の意味

| 記号 | 例 | 意味・更新範囲 |
|---|---|---|
| キャレット (`^`) | `^4.18.2` | **MAJORを固定**し、MINOR/PATCHの自動更新を許可（`>=4.18.2 <5.0.0`） |
| チルダ (`~`) | `~4.18.2` | **MAJORとMINORを固定**し、PATCHの自動更新のみ許可（`>=4.18.2 <4.19.0`） |
| 固定 | `4.18.2` | 完全一致のバージョンのみ |
| ワイルドカード (`*`) | `*` | 常に最新バージョン（非推奨） |

> [!TIP]
> `npm install` でパッケージを追加すると、デフォルトでキャレット (`^`) が付きます。完全な再現性は `package-lock.json` が担うので、`package.json` 側は柔軟な範囲指定で問題ありません。

---

## コマンドサンプル

```bash
# 本番用の依存関係としてインストール
npm install express
npm i express          # 短縮形

# 開発用の依存関係としてインストール
npm install -D jest
npm i --save-dev jest  # 同じ意味の長い書き方

# バージョンを指定してインストール
npm install express@4.17.0    # 特定バージョン
npm install express@latest    # 最新版
npm install express@^4.0.0    # 範囲指定

# インストール済みパッケージを削除
npm uninstall lodash

# パッケージを更新
npm update             # package.json の範囲内で更新
npm outdated           # 更新可能なパッケージの一覧を表示
```

---

## 実行結果

```text
$ npm install express
added 57 packages, and audited 58 packages in 2s

$ npm install -D jest
added 214 packages, and audited 272 packages in 4s

$ cat package.json
{
  "name": "my-app",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.5.0"
  }
}

$ npm outdated
Package  Current  Wanted  Latest  Location
express  4.18.2   4.18.2  4.19.2  my-app
```

---

## よくある間違い

### 1. 開発用ツールを dependencies に入れてしまう

```bash
# ❌ ESLintは開発時にしか使わないのに本番依存に入れてしまう
npm install eslint

# ✅ -D を付けて devDependencies に入れる
npm install -D eslint
```

### 2. `^` と `~` の違いを逆に覚える

```text
❌ 「^ の方が厳しい制限」と勘違いする

✅ 正しい理解：
   ^4.18.2 → 4.x.x の範囲で更新（緩い。MAJORだけ固定）
   ~4.18.2 → 4.18.x の範囲で更新（厳しい。MAJORとMINORを固定）
```

### 3. バージョンを固定しすぎて更新が止まる

```json
// ❌ すべて完全固定にすると、バグ修正が入っても自動更新されない
{
  "dependencies": {
    "express": "4.18.2"
  }
}

// ✅ 通常はキャレットのまま運用し、package-lock.jsonで再現性を担保する
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

## 実用例

### 本番用と開発用を意識してインストールする

```bash
# アプリの動作に必要なもの
npm install express dotenv

# 開発・テストにしか使わないもの
npm install -D jest eslint prettier typescript
```

### 依存関係の更新をチェックする定期作業

```bash
# 更新可能なパッケージを確認してから、慎重に更新する
npm outdated
npm update
npm test   # 更新後は必ずテストを実行して壊れていないか確認
```

---

## 実習

### 課題1：dependenciesとdevDependenciesを分ける

1. 練習用プロジェクトに `express`（本番用）と `nodemon`（開発用）をインストールしてください
2. `package.json` を開き、それぞれが正しい区分に入っていることを確認してください

### 課題2：バージョン記号を読み解く

以下のバージョン指定が許容する範囲を、それぞれ書き出してください。

```text
1. "lodash": "^4.17.21"
2. "axios": "~1.6.0"
3. "react": "18.2.0"
```

### 課題3：outdatedを確認する

`npm outdated` を実行し、`Current` / `Wanted` / `Latest` の3つの列がそれぞれ何を意味するか調べてまとめてください。
