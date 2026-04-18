---
title: "チーム開発のワークフロー"
order: 29
type: reference
category: team
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# チーム開発のワークフロー

## 解説

チーム開発では、個人開発とは異なり「ルール」と「仕組み」が重要になります。全員が同じ方法で開発を進めることで、混乱を防ぎ、効率的に協力できます。

### チーム開発で必要な要素

| 要素 | 目的 | 実現方法 |
|------|------|---------|
| ブランチ保護 | mainブランチの品質を守る | Branch protection rules |
| コード所有権 | 誰がどの部分を管理するか | CODEOWNERS |
| 貢献ガイド | 新メンバーが迷わない | CONTRIBUTING.md |
| コミット規約 | 変更履歴を分かりやすく | Conventional Commits |
| リリース管理 | 安定したリリースプロセス | タグ・リリース機能 |

---

## コマンドサンプル

### リポジトリの初期設定

```bash
# リポジトリの作成
gh repo create myteam/webapp --public --clone

# 必要なディレクトリを作成
mkdir -p .github
mkdir -p docs

# 初期ファイルを作成
touch CONTRIBUTING.md
touch .github/CODEOWNERS
touch .github/PULL_REQUEST_TEMPLATE.md
```

---

## ブランチ保護ルール

### 設定方法（GitHub Web UI）

```text
Settings → Branches → Add branch protection rule

設定すべき項目：
  ✅ Require a pull request before merging
     └ ✅ Require approvals（最低1人の承認）
  ✅ Require status checks to pass before merging
     └ ✅ Require branches to be up to date
     └ CIワークフローを指定
  ✅ Require conversation resolution before merging
  ✅ Do not allow bypassing the above settings
```

### 保護ルールの効果

```text
保護ルール適用後：

  ❌ mainに直接pushできない
  ❌ レビューなしでマージできない
  ❌ テストが失敗した状態でマージできない

  ✅ PRを通してのみ変更可能
  ✅ 最低1人の承認が必要
  ✅ CIが通っていることが必須
```

---

## CODEOWNERSファイル

`.github/CODEOWNERS` に配置し、ファイルやディレクトリごとにレビュー担当者を自動指定します。

### 設定例

```text
# デフォルトのオーナー（全ファイル）
* @myteam/core-team

# フロントエンドのコードは frontend チームがレビュー
/src/components/ @myteam/frontend-team
/src/pages/      @myteam/frontend-team
*.css            @myteam/frontend-team
*.tsx            @myteam/frontend-team

# バックエンドのコードは backend チームがレビュー
/src/api/        @myteam/backend-team
/src/db/         @myteam/backend-team

# インフラ設定は DevOps チームがレビュー
/infrastructure/ @myteam/devops-team
Dockerfile       @myteam/devops-team
docker-compose.yml @myteam/devops-team

# ドキュメントはテックリードがレビュー
/docs/           @tanaka
README.md        @tanaka

# CI/CD設定はリーダーの承認が必要
/.github/workflows/ @suzuki @tanaka
```

### 実行結果

```text
CODEOWNERSの効果：

PR #50: src/components/Button.tsx を変更
  → @myteam/frontend-team が自動的にレビュアーに追加される

PR #51: Dockerfile を変更
  → @myteam/devops-team が自動的にレビュアーに追加される
```

---

## CONTRIBUTING.md（貢献ガイド）

### テンプレート

```markdown
# コントリビューションガイド

このプロジェクトへの貢献に感謝します！
以下のガイドラインに従って開発を進めてください。

## 開発環境のセットアップ

1. リポジトリをフォーク & クローン
2. 依存パッケージをインストール：`npm install`
3. 開発サーバーを起動：`npm run dev`

## ブランチの命名規則

| プレフィックス | 用途 | 例 |
|-------------|------|-----|
| `feature/`  | 新機能 | `feature/add-search` |
| `fix/`      | バグ修正 | `fix/login-error` |
| `docs/`     | ドキュメント | `docs/update-readme` |
| `refactor/` | リファクタリング | `refactor/auth-module` |
| `test/`     | テスト追加 | `test/add-unit-tests` |

## コミットメッセージの規約

Conventional Commitsに従ってください（詳細は下記参照）。

## プルリクエストの手順

1. mainブランチを最新にする
2. featureブランチを作成する
3. 変更を加えてコミットする
4. pushしてPRを作成する
5. レビューを受けて修正する
6. 承認後にマージする

## コードスタイル

- ESLintのルールに従う
- Prettierでフォーマットする
- TypeScriptの型を適切に付ける
```

---

## Conventional Commits

### 概要

コミットメッセージに統一されたフォーマットを使うことで、変更履歴が分かりやすくなります。

### フォーマット

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### typeの種類

| type | 用途 | 例 |
|------|------|-----|
| `feat` | 新機能 | `feat(auth): ログイン機能を追加` |
| `fix` | バグ修正 | `fix(login): パスワード検証のエラーを修正` |
| `docs` | ドキュメント | `docs: READMEにセットアップ手順を追加` |
| `style` | フォーマット | `style: インデントを修正` |
| `refactor` | リファクタリング | `refactor(api): エラーハンドリングを統一` |
| `test` | テスト | `test(auth): ログインのテストを追加` |
| `chore` | 雑務 | `chore: eslintの設定を更新` |
| `ci` | CI設定 | `ci: テストワークフローを追加` |
| `perf` | パフォーマンス | `perf(db): クエリのインデックスを最適化` |

### コマンドサンプル

```bash
# 新機能の追加
git commit -m "feat(auth): ソーシャルログインを追加"

# バグ修正
git commit -m "fix(cart): 数量が0になるバグを修正

カートの数量変更で0以下を入力した場合に
バリデーションが効いていなかった問題を修正。

fixes #78"

# 破壊的変更を含む場合
git commit -m "feat(api)!: レスポンス形式をv2に変更

BREAKING CHANGE: APIレスポンスのJSON構造が変更されました。
移行ガイドは docs/migration-v2.md を参照してください。"
```

---

## リリースワークフロー

### タグを使ったリリース

```bash
# リリースタグの作成
git tag -a v1.0.0 -m "バージョン 1.0.0 リリース"

# タグをリモートにpush
git push origin v1.0.0

# GitHub CLIでリリースを作成
gh release create v1.0.0 --title "v1.0.0" --notes "初回リリース"

# リリースノートを自動生成
gh release create v1.0.0 --generate-notes
```

### 実行結果

```text
$ gh release create v1.0.0 --generate-notes

? Title (optional) v1.0.0
? Is this a prerelease? No
? Submit? Publish release

https://github.com/myteam/webapp/releases/tag/v1.0.0
```

### セマンティックバージョニング

```text
バージョン番号: MAJOR.MINOR.PATCH

MAJOR（メジャー）: 後方互換性のない変更  1.0.0 → 2.0.0
MINOR（マイナー）: 後方互換性のある機能追加  1.0.0 → 1.1.0
PATCH（パッチ）: バグ修正  1.0.0 → 1.0.1

例：
  v1.0.0  初回リリース
  v1.0.1  ログインバグの修正
  v1.1.0  検索機能の追加
  v2.0.0  API仕様の大幅変更
```

---

## コミュニケーションのベストプラクティス

```text
1. PRの説明を丁寧に書く
   → 何を・なぜ・どうやって変えたか
   → レビュアーの時間を尊重する

2. レビューは24時間以内に
   → レビュー待ちが長いと開発が止まる
   → 忙しい場合はその旨を伝える

3. 定期的なスタンドアップ
   → 「昨日やったこと」「今日やること」「困っていること」
   → 15分程度で簡潔に

4. ドキュメントを更新する
   → コードだけでなくドキュメントも一緒に更新
   → 将来の自分やチームメンバーのために
```

---

## Monorepo vs Multi-repo

```text
Monorepo（モノレポ）：
  1つのリポジトリに複数プロジェクトを格納
  例：
    webapp/
    ├── packages/
    │   ├── frontend/
    │   ├── backend/
    │   └── shared/
    └── package.json

  メリット：コード共有が容易、一括管理
  デメリット：リポジトリが大きくなる

Multi-repo（マルチレポ）：
  プロジェクトごとに別リポジトリ
  例：
    webapp-frontend/
    webapp-backend/
    webapp-shared/

  メリット：独立したリリース、シンプルな権限管理
  デメリット：コード共有が手間、バージョン管理が複雑

初心者のうちはどちらでも大丈夫。
チーム規模が大きくなったら検討しましょう。
```

---

## よくある間違い

### 1. ルールを決めずに開発を始める

```text
悪い例：
  ブランチ名もコミットメッセージもバラバラ
  → 履歴が混乱し、後から追跡できない

良い例：
  開発開始前にCONTRIBUTING.mdでルールを明記
  最初の1時間で設定を整える
```

### 2. ブランチ保護を設定しない

```text
悪い例：
  誰でもmainに直接pushできる
  → 誤ったコードが本番に出てしまう

良い例：
  プロジェクト作成直後にブランチ保護を設定
  PR + レビュー + CI必須にする
```

### 3. コミットメッセージが適当

```text
悪い例：
  "fix" "update" "修正" "あ"
  → 何を変えたか分からない

良い例：
  "fix(auth): パスワードリセットメールが送信されない問題を修正"
  → 一目で内容が分かる
```

### 4. ドキュメントを更新しない

```text
悪い例：
  機能を追加したがREADMEに記載しない
  → 新メンバーがセットアップできない

良い例：
  コード変更と一緒にドキュメントも更新
  PRに「ドキュメント更新」のチェック項目を入れる
```

---

## 実用例

### プロジェクト開始時のチェックリスト

```text
□ リポジトリを作成
□ README.md を作成
□ .gitignore を設定
□ ライセンスを追加
□ CONTRIBUTING.md を作成
□ .github/CODEOWNERS を設定
□ .github/PULL_REQUEST_TEMPLATE.md を作成
□ .github/ISSUE_TEMPLATE/ を作成
□ ブランチ保護ルールを設定
□ CI/CDワークフローを設定
□ ラベルを整備
□ プロジェクトボードを作成
```

---

## 実習

### 課題1：チーム開発用リポジトリを設定しよう

新しいリポジトリを作成し、以下のファイルを全て設定してみましょう。

1. `CONTRIBUTING.md`（ブランチ命名規則、コミットメッセージ規約を含む）
2. `.github/CODEOWNERS`
3. `.github/PULL_REQUEST_TEMPLATE.md`
4. ブランチ保護ルール

### 課題2：Conventional Commitsを実践しよう

3つ以上のコミットを、Conventional Commitsのフォーマットで作成してみましょう。`feat`、`fix`、`docs` のそれぞれを使ってください。

### 課題3：リリースを作成しよう

1. いくつかの変更をmainにマージする
2. `v1.0.0` のタグを付ける
3. `gh release create` でリリースを作成する
4. リリースノートを確認する
