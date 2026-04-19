---
title: "プルリクエストの作成とレビュー"
order: 2
type: detail
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# プルリクエストの作成とレビュー

## 解説

**プルリクエスト（Pull Request / PR）** とは、自分が作業したブランチの変更を別のブランチ（通常は `main`）に取り込んでもらうためのリクエストです。GitHub上でコードレビューを行い、チームメンバーの承認を得てからマージする仕組みです。

### なぜプルリクエストが重要なのか

| メリット | 説明 |
|---------|------|
| コード品質の向上 | レビューによりバグや設計上の問題を早期発見 |
| 知識の共有 | チーム全体がコードベースを理解できる |
| 変更履歴の記録 | なぜその変更が行われたかが残る |
| 安全なマージ | テストやCIを通過してからマージできる |

### PRの基本的な流れ

```text
1. featureブランチで作業
2. 変更をリモートにpush
3. GitHub上でPRを作成
4. レビュアーがレビュー
5. 修正があれば対応
6. 承認後にマージ
7. featureブランチを削除
```

---

## コマンドサンプル

### PRを作成する前の準備

```bash
# featureブランチで作業を完了
git checkout feature/add-login

# 最新のmainを取り込む
git fetch origin
git rebase origin/main

# リモートにpush
git push origin feature/add-login
```

### GitHub CLIでPRを作成する

```bash
# PRの作成（対話形式）
gh pr create

# タイトルと本文を指定して作成
gh pr create --title "ログイン機能の追加" --body "ログインフォームとバリデーションを実装"

# ドラフトPRとして作成
gh pr create --draft --title "WIP: ログイン機能" --body "作業中"

# レビュアーを指定して作成
gh pr create --title "ログイン機能の追加" --reviewer tanaka,suzuki

# ラベルを付けて作成
gh pr create --title "バグ修正" --label "bug,urgent"
```

### PRの確認・レビュー（GitHub CLI）

```bash
# PRの一覧を表示
gh pr list

# 特定のPRの詳細を確認
gh pr view 42

# PRをブラウザで開く
gh pr view 42 --web

# PRをマージ
gh pr merge 42

# スカッシュマージ
gh pr merge 42 --squash

# リベースマージ
gh pr merge 42 --rebase
```

---

## 実行結果

### PR作成時の出力

```text
$ gh pr create --title "ログイン機能の追加" --body "ログインフォームを実装"

Creating pull request for feature/add-login into main in myteam/webapp

https://github.com/myteam/webapp/pull/42
```

### PR一覧の表示

```text
$ gh pr list

Showing 3 of 3 open pull requests in myteam/webapp

#42  ログイン機能の追加       feature/add-login     about 2 hours ago
#41  READMEの更新            docs/update-readme     about 1 day ago
#40  テストの追加             test/add-unit-tests    about 3 days ago
```

---

## 良いPRの書き方

### PRテンプレートの例

リポジトリの `.github/PULL_REQUEST_TEMPLATE.md` に配置します。

```markdown
## 概要
<!-- この変更で何をしたか簡潔に -->

## 変更理由
<!-- なぜこの変更が必要か -->

## 変更内容
<!-- 主な変更点をリストで -->
-
-

## テスト方法
<!-- どうやって動作確認したか -->
- [ ] ユニットテスト追加
- [ ] 手動テスト実施

## スクリーンショット
<!-- UI変更がある場合 -->

## 関連Issue
<!-- closes #123 のように記述 -->
```

### マージ戦略の比較

| 戦略 | コマンド | 特徴 |
|------|---------|------|
| マージコミット | `--merge` | 全コミット履歴を保持。マージコミットが作られる |
| スカッシュマージ | `--squash` | 複数コミットを1つにまとめる。履歴がきれい |
| リベースマージ | `--rebase` | コミットを直線的に並べる。マージコミットなし |

---

## ドラフトPR

作業途中でもPRを作成し、チームに進捗を共有できます。

```bash
# ドラフトPRの作成
gh pr create --draft --title "WIP: 決済機能の実装"

# ドラフトを解除して正式なPRにする
gh pr ready 42
```

```text
活用場面：
- 早い段階でフィードバックが欲しい
- 作業の方向性を確認したい
- チームに進捗を見せたい
```

---

## PRとIssueの紐付け

PRの本文やコミットメッセージに特定のキーワードを含めると、マージ時にIssueが自動でクローズされます。

```markdown
## 使えるキーワード
closes #123
fixes #123
resolves #123
```

```text
例：PRの本文に「closes #15」と書くと、
PRがマージされた時点でIssue #15が自動的にクローズされる。
```

---

## よくある間違い

### 1. PRが大きすぎる

```text
悪い例：
  1つのPRに50ファイル、2000行の変更
  → レビューが困難で、問題の見落としが起きやすい

良い例：
  1つのPRは200〜400行程度
  機能ごとに分割して複数のPRにする
```

### 2. 説明がない・不十分

```text
悪い例：
  タイトル「修正」、本文なし

良い例：
  タイトル「ユーザー登録時のバリデーションエラーを修正」
  本文に変更理由、内容、テスト方法を記載
```

### 3. mainブランチから直接PRを作る

```text
悪い例：
  mainブランチで直接作業してPRを作成
  → mainが汚れる、他の人と競合しやすい

良い例：
  featureブランチを切ってから作業する
```

### 4. コンフリクトを放置する

```text
悪い例：
  コンフリクトが発生しているのに放置
  → マージできない、レビュアーが困る

良い例：
  PR作成前にmainをrebaseまたはmergeして解消する
```

---

## 実用例

### 個人開発でもPRを使う

```text
1人で開発していても、PRを使う利点がある：
- 変更の単位が明確になる
- 後から「なぜこの変更をしたか」が分かる
- CIで自動テストを回せる
```

### レビューコメントの書き方

```text
指摘する側：
  「ここはこうした方がいいと思います」（提案型）
  「nit: 変数名は camelCase が良さそうです」（軽微な指摘にはnitをつける）
  「質問：この処理の意図を教えてください」（理解のための質問）

指摘を受ける側：
  「ありがとうございます、修正しました」（感謝 + 対応報告）
  「この実装にした理由は〜です」（設計意図の説明）
```

---

## 実習

### 課題1：PRテンプレートを作成しよう

自分のリポジトリに `.github/PULL_REQUEST_TEMPLATE.md` を作成し、以下の項目を含むテンプレートを作ってみましょう。

- 概要
- 変更理由
- 変更内容（チェックリスト形式）
- テスト方法

### 課題2：PRを作成してマージしよう

1. featureブランチを作成して簡単な変更を行う
2. GitHub上でPRを作成する
3. PRの説明を丁寧に書く
4. セルフレビューを行う（自分でコメントを付ける）
5. PRをスカッシュマージする
6. featureブランチを削除する

### 課題3：マージ戦略の違いを確認しよう

3つのfeatureブランチを作り、それぞれ異なるマージ戦略（merge / squash / rebase）でマージして、`git log --oneline --graph` でコミット履歴の違いを比較してみましょう。
