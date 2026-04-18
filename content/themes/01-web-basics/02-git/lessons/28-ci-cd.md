---
title: "CI/CDの基礎"
order: 28
type: reference
category: team
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# CI/CDの基礎

## 解説

**CI/CD**は、ソフトウェア開発の自動化プロセスです。コードの変更を安全かつ迅速に本番環境へ届けるための仕組みです。

### CI（継続的インテグレーション）

```text
CI = Continuous Integration（継続的インテグレーション）

コードの変更がリポジトリにpushされるたびに、
自動でビルド・テストを実行する仕組み。

目的：
  - コードの統合時にバグを早期発見する
  - 「昨日は動いていたのに…」を防ぐ
  - チーム全員のコードが常に統合可能な状態を保つ
```

### CD（継続的デリバリー / デプロイ）

```text
CD = Continuous Delivery（継続的デリバリー）
     または
     Continuous Deployment（継続的デプロイ）

Delivery：
  テスト通過後、本番リリースの「準備」まで自動化
  最終的なデプロイは手動で承認

Deployment：
  テスト通過後、本番環境への「デプロイ」まで全自動
  人の介入なしにリリースされる
```

### CI/CDの流れ

```text
コード変更 → push → 自動ビルド → 自動テスト → デプロイ準備 → デプロイ
              ↑                                              ↑
              CI の範囲                                    CD の範囲
              ├──────────────┤                   ├───────────────┤
```

### なぜCI/CDが重要なのか

| メリット | 説明 |
|---------|------|
| バグの早期発見 | pushするたびにテストが走る |
| 手動作業の削減 | ビルド・テスト・デプロイを自動化 |
| リリースの高速化 | 安全に素早くデプロイできる |
| 品質の安定 | 毎回同じ手順でチェックされる |
| チームの信頼性 | 「mainは常に動く」状態を維持 |

---

## GitHub Actions

### 概要

GitHub Actionsは、GitHubに組み込まれたCI/CDサービスです。リポジトリの `.github/workflows/` にYAMLファイルを置くだけで利用できます。

### 基本構造

```text
GitHub Actions の構成要素：

ワークフロー（Workflow）
  └─ イベント（Event）：何がトリガーか
  └─ ジョブ（Job）：実行単位
      └─ ステップ（Step）：個々の処理
          └─ アクション（Action）：再利用可能な部品
```

---

## コマンドサンプル

### 最初のワークフロー：自動テスト

`.github/workflows/test.yml` を作成します。

```yaml
name: テスト実行

# トリガー：pushまたはPR作成時に実行
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest  # 実行環境

    steps:
      # リポジトリのコードをチェックアウト
      - uses: actions/checkout@v4

      # Node.jsのセットアップ
      - name: Node.jsのセットアップ
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      # 依存パッケージのインストール
      - name: 依存パッケージのインストール
        run: npm ci

      # テストの実行
      - name: テスト実行
        run: npm test
```

### リンティングのワークフロー

```yaml
name: Lint

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Node.jsのセットアップ
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: 依存パッケージのインストール
        run: npm ci

      - name: ESLint実行
        run: npm run lint

      - name: TypeScript型チェック
        run: npx tsc --noEmit
```

### テストとリントを同時実行するワークフロー

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # リントジョブ
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint

  # テストジョブ（リントと並列実行）
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  # ビルドジョブ（lint と test の両方が成功してから実行）
  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
```

---

## 実行結果

### ワークフロー成功時

```text
GitHubのActionsタブに表示される結果：

CI ✅
├── lint    ✅ 成功（45秒）
├── test    ✅ 成功（1分23秒）
└── build   ✅ 成功（2分10秒）

合計: 3分18秒（lint と test は並列実行）
```

### ワークフロー失敗時

```text
CI ❌
├── lint    ✅ 成功（42秒）
├── test    ❌ 失敗（1分5秒）
│   └─ Error: src/auth.test.ts
│      Expected: "ログインに成功しました"
│      Received: undefined
└── build   ⏭️ スキップ（test が失敗したため）
```

### PRへのステータス表示

```text
PR #42: ログイン機能の追加

  ✅ lint — All checks have passed
  ❌ test — 2 tests failed
  ⏭️ build — Waiting for test

マージボタン：❌ Some checks were not successful
```

---

## ワークフローのトリガー

### よく使うイベント

```yaml
# push時に実行
on:
  push:
    branches: [main, develop]

# PR作成・更新時に実行
on:
  pull_request:
    branches: [main]

# 定期実行（cron）
on:
  schedule:
    - cron: '0 9 * * 1'  # 毎週月曜9:00 UTC

# 手動実行
on:
  workflow_dispatch:

# 複数イベントの組み合わせ
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜0:00 UTC
```

### パスフィルター

```yaml
# 特定のディレクトリが変更された時のみ実行
on:
  push:
    paths:
      - 'src/**'
      - 'tests/**'
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

---

## ステータスバッジ

READMEにCI/CDの状態を表示できます。

```markdown
## README.md に追加

![CI](https://github.com/ユーザー名/リポジトリ名/actions/workflows/test.yml/badge.svg)
```

```text
表示例：

CI: ✅ passing    ← テストが通っている
CI: ❌ failing    ← テストが失敗している
```

---

## よくある間違い

### 1. テストを書かずにCIだけ導入する

```text
悪い例：
  CIワークフローはあるが、テストコードが空
  → CI が通っても品質は保証されない

良い例：
  テストを先に書いてから CI を設定する
  最低限のユニットテストから始める
```

### 2. シークレットをコードに含める

```text
悪い例：
  APIキーやパスワードをYAMLファイルに直接書く
  → リポジトリに公開されてしまう

良い例：
  GitHubのSecretsに登録して参照する

  # リポジトリの Settings → Secrets → New repository secret
  # ワークフローでの参照：
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

### 3. 全てのブランチでワークフローを実行する

```text
悪い例：
  on: push（ブランチ指定なし）
  → 全ブランチで実行され、コストと時間がかかる

良い例：
  on:
    push:
      branches: [main]
    pull_request:
      branches: [main]
```

### 4. 失敗したCIを無視する

```text
悪い例：
  CIが失敗しているのにマージしてしまう

良い例：
  ブランチ保護ルールで「CIパス必須」を設定する
  CI が通るまでマージボタンを押せないようにする
```

---

## 実用例

### 他のCI/CDツール

```text
GitHub Actions以外にも様々なCI/CDツールがある：

ツール          特徴
────────────────────────────────────
Jenkins        オープンソース、高いカスタマイズ性
CircleCI       高速なビルド、Docker対応が強い
GitLab CI/CD   GitLabに統合、パイプライン機能が充実
Vercel         フロントエンドに特化、自動デプロイ
Netlify        静的サイトに強い、プレビュー機能

初心者には GitHub Actions がおすすめ：
  - GitHubに統合されている
  - 無料枠が充実している
  - マーケットプレイスでアクションが豊富
  - YAMLベースで設定がシンプル
```

### 実務で使うワークフローの組み合わせ

```text
PRワークフロー：
  push to feature → リント → テスト → ビルド → プレビュー環境デプロイ

本番デプロイワークフロー：
  merge to main → リント → テスト → ビルド → ステージング → 本番デプロイ

定期ワークフロー：
  毎週月曜 → 依存パッケージの脆弱性チェック → Slack通知
```

---

## 実習

### 課題1：テストワークフローを作成しよう

1. Node.jsプロジェクトを用意する（`npm init -y`）
2. 簡単なテストを書く（Jestなど）
3. `.github/workflows/test.yml` を作成する
4. pushしてGitHub Actionsで自動テストが実行されることを確認する

### 課題2：リントワークフローを追加しよう

テストワークフローに加えて、ESLintを実行するワークフローを追加してみましょう。テストとリントが並列実行されるように設定してください。

### 課題3：ステータスバッジを追加しよう

READMEにCIのステータスバッジを追加してみましょう。テストが通っている状態と失敗している状態の両方を確認してください。

### 課題4：ブランチ保護と組み合わせよう

リポジトリの設定で以下を行ってみましょう。

1. mainブランチの保護ルールを設定する
2. CIのパスを必須にする
3. わざとテストが失敗するPRを作成して、マージがブロックされることを確認する
