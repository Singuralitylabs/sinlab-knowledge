---
title: "Git Flow / GitHub Flow"
order: 1
type: detail
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# Git Flow / GitHub Flow

## 解説

チーム開発では、ブランチをどのように使い分けるかの「戦略」が重要です。ブランチ戦略を決めることで、チーム全員が同じルールでブランチを管理でき、リリースプロセスがスムーズになります。

### 代表的なブランチ戦略

| 戦略 | 複雑さ | 適したプロジェクト |
|------|--------|-------------------|
| Git Flow | 高 | 定期リリースのある大規模プロジェクト |
| GitHub Flow | 低 | 継続的デプロイのWebアプリ |
| トランクベース開発 | 最低 | 高頻度デプロイのモダンな開発 |

---

## Git Flow

### 概要

Git Flowは、Vincent Driessen氏が2010年に提唱したブランチモデルです。5種類のブランチを使い分けて、計画的なリリースを管理します。

### ブランチの種類

| ブランチ | 寿命 | 目的 |
|---------|------|------|
| `main` | 永続 | リリース済みの安定版コード |
| `develop` | 永続 | 次回リリースに向けた開発の統合先 |
| `feature/*` | 一時 | 新機能の開発 |
| `release/*` | 一時 | リリース準備（テスト・修正） |
| `hotfix/*` | 一時 | 本番環境の緊急バグ修正 |

### Git Flowの全体像

```text
main     ──●───────────────────●──────────────●──→
            \                 / \            /
hotfix       \               /   ●──────────●
              \             /     hotfix/fix-bug
develop    ────●───●───●───●───────●───●──────●──→
               \  / \ /   /        \  /
feature    ─────●●   ●●──●          ●●
           feature/   feature/    feature/
           login      payment    dashboard
               \           \
release         \           ●────●
                        release/v1.1
```

### コマンドサンプル

```bash
# --- developブランチから機能開発を始める ---
git checkout develop
git checkout -b feature/user-registration

# （機能を実装）

# developにマージ
git checkout develop
git merge --no-ff feature/user-registration
git branch -d feature/user-registration

# --- リリース準備 ---
git checkout develop
git checkout -b release/v1.0

# （テスト・バグ修正）

# mainにマージしてタグを付ける
git checkout main
git merge --no-ff release/v1.0
git tag -a v1.0 -m "Version 1.0"

# developにもマージ
git checkout develop
git merge --no-ff release/v1.0
git branch -d release/v1.0

# --- 緊急修正 ---
git checkout main
git checkout -b hotfix/fix-login-bug

# （修正を実施）

# mainにマージしてタグを付ける
git checkout main
git merge --no-ff hotfix/fix-login-bug
git tag -a v1.0.1 -m "Hotfix: login bug"

# developにもマージ
git checkout develop
git merge --no-ff hotfix/fix-login-bug
git branch -d hotfix/fix-login-bug
```

### `--no-ff` オプションの意味

```text
--no-ff（no fast-forward）を使う理由：
  マージコミットが必ず作られるため、
  「どのブランチからマージされたか」が履歴に残る。

fast-forward（デフォルト）の場合：
  main: A → B → C → D → E
  （どこからどこまでが feature ブランチか分からない）

--no-ff の場合：
  main: A → B ────────→ M（マージコミット）
             \         /
  feature:    C → D → E
  （feature ブランチの範囲が明確）
```

---

## GitHub Flow

### 概要

GitHub Flowは、GitHubが提唱するシンプルなブランチ戦略です。`main` ブランチと `feature` ブランチの2種類だけを使います。

### GitHub Flowのルール

```text
1. mainブランチは常にデプロイ可能な状態を保つ
2. 新しい作業はmainから分岐したブランチで行う
3. ブランチにコミットしたらこまめにpushする
4. フィードバックが欲しい時はPRを作成する
5. レビューで承認されたらmainにマージする
6. mainにマージしたらすぐにデプロイする
```

### GitHub Flowの図

```text
main    ──●────────────●────────────●────────●──→
           \          /  \         /          |
feature     ●──●──●──●    ●──●──●──●      デプロイ
          feature/login  feature/signup
```

### コマンドサンプル

```bash
# mainから新しいブランチを作成
git checkout main
git pull origin main
git checkout -b feature/add-search

# 作業してコミット
git add .
git commit -m "検索機能のUIを追加"

# リモートにpush
git push origin feature/add-search

# GitHubでPRを作成 → レビュー → マージ
gh pr create --title "検索機能の追加" --body "closes #15"

# マージ後、ローカルを更新
git checkout main
git pull origin main
git branch -d feature/add-search
```

---

## Git Flow vs GitHub Flow の比較

| 項目 | Git Flow | GitHub Flow |
|------|----------|-------------|
| ブランチ数 | 5種類 | 2種類 |
| 複雑さ | 高い | 低い |
| リリース | 計画的・定期的 | 継続的 |
| develop ブランチ | あり | なし |
| リリースブランチ | あり | なし |
| hotfix ブランチ | あり | なし（mainから直接） |
| デプロイ頻度 | 低い（週〜月） | 高い（日〜週） |
| 学習コスト | 高い | 低い |
| 適したチーム | 大規模・厳密な管理 | 小〜中規模・アジャイル |

### 使い分けの目安

```text
Git Flow を選ぶ場合：
  ✓ バージョン番号付きのリリースがある（v1.0, v2.0）
  ✓ モバイルアプリなどストア申請が必要
  ✓ 複数バージョンを同時にサポートする
  ✓ QAチームによるリリース前テストがある

GitHub Flow を選ぶ場合：
  ✓ Webアプリで継続的にデプロイしたい
  ✓ チームが小〜中規模（2〜10人）
  ✓ CI/CDが整備されている
  ✓ シンプルな運用を好む
```

---

## トランクベース開発（補足）

### 概要

```text
トランクベース開発（Trunk-Based Development）：
  - mainブランチ（トランク）に直接コミットするか、
    非常に短命なブランチ（1〜2日）を使う
  - featureフラグで未完成の機能を隠す
  - Google、Facebookなどの大企業で採用

main ──●──●──●──●──●──●──●──●──→
        ↑  ↑  ↑  ↑  ↑  ↑
        直接コミット or 短命ブランチ
```

---

## よくある間違い

### 1. Git Flowでdevelopを経由しない

```text
悪い例：
  featureブランチをmainに直接マージしてしまう
  → リリース準備なしに本番に出てしまう

良い例：
  feature → develop → release → main
  の順序を必ず守る
```

### 2. GitHub Flowでmainを壊す

```text
悪い例：
  レビューやテストなしでmainにマージ
  → 本番環境に不具合が出る

良い例：
  CI/CDでテストを自動実行し、パスしてからマージする
  ブランチ保護ルールを設定する
```

### 3. ブランチ戦略を途中で変える

```text
悪い例：
  Git Flowで始めたが、面倒になって適当に運用
  → ブランチの役割が曖昧になり混乱

良い例：
  プロジェクト開始時に戦略を決め、ドキュメントに明記
  全員が同じルールで運用する
```

### 4. 長寿命のfeatureブランチ

```text
悪い例：
  featureブランチを1ヶ月以上放置
  → mainとの差分が大きくなりコンフリクトが多発

良い例：
  featureブランチは数日〜1週間で完了させる
  長引く場合は小さく分割する
```

---

## 実用例

### チームでGitHub Flowを導入する

```text
1. リポジトリの設定
   - mainブランチの保護を有効化
   - PR必須、最低1人のレビュー承認を要求
   - CIテストのパスを必須に

2. ブランチ命名規則を決める
   - feature/  → 新機能
   - fix/      → バグ修正
   - docs/     → ドキュメント
   - refactor/ → リファクタリング

3. PR運用ルールを文書化
   - CONTRIBUTING.md に記載
   - 新メンバーのオンボーディングで説明
```

---

## 実習

### 課題1：GitHub Flowを実践しよう

1. リポジトリを作成し、`main` ブランチを保護設定する
2. `feature/add-readme` ブランチを作成する
3. READMEを追加してPRを作成する
4. セルフレビューしてマージする
5. `git log --oneline --graph` で履歴を確認する

### 課題2：Git Flowを体験しよう

1. `main` と `develop` ブランチを作成する
2. `develop` から `feature/hello` ブランチを切る
3. 機能を追加して `develop` にマージ（`--no-ff`）
4. `release/v1.0` ブランチを作成してテスト
5. `main` にマージしてタグ `v1.0` を付ける
6. `git log --all --oneline --graph` で全体を確認する

### 課題3：比較レポートを書こう

Git FlowとGitHub Flowを両方試した上で、自分のプロジェクトにはどちらが適しているか、理由とともにまとめてみましょう。
