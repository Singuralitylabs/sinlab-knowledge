---
title: "Issue管理とプロジェクトボード"
order: 27
type: reference
category: team
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# Issue管理とプロジェクトボード

## 解説

**Issue（イシュー）** とは、GitHubリポジトリにおける「課題」や「タスク」を管理する仕組みです。バグ報告、機能要望、タスク管理など幅広い用途に使えます。

### Issueの主な用途

| 用途 | 説明 | 例 |
|------|------|-----|
| バグ報告 | 不具合の報告と追跡 | 「ログインボタンが反応しない」 |
| 機能要望 | 新機能のリクエスト | 「ダークモードに対応してほしい」 |
| タスク管理 | やるべき作業の記録 | 「READMEを更新する」 |
| 議論 | 設計や方針の相談 | 「APIの認証方式をどうするか」 |

### Issueの構成要素

```text
Issue #42: ログイン機能のバリデーション追加
├── タイトル       ← 何をするか一目で分かるように
├── 本文（説明）    ← 詳細な説明、再現手順など
├── ラベル         ← bug, enhancement, documentation など
├── 担当者         ← 誰が対応するか
├── マイルストーン   ← どのリリースで対応するか
└── プロジェクト    ← どのボードで管理するか
```

---

## コマンドサンプル

### GitHub CLIでIssueを操作する

```bash
# Issueの一覧を表示
gh issue list

# 特定のラベルでフィルタ
gh issue list --label "bug"

# Issueの作成
gh issue create --title "ログインページのバグ" --body "パスワードが空でも送信できてしまう"

# ラベルと担当者を指定して作成
gh issue create \
  --title "バリデーション追加" \
  --body "入力フォームにバリデーションを追加する" \
  --label "enhancement" \
  --assignee "@me"

# Issueの詳細を表示
gh issue view 42

# Issueをブラウザで開く
gh issue view 42 --web

# Issueをクローズ
gh issue close 42

# Issueを再オープン
gh issue reopen 42
```

---

## 実行結果

### Issue一覧の表示

```text
$ gh issue list

Showing 5 of 5 open issues in myteam/webapp

#45  ダークモードの実装       enhancement  about 1 hour ago
#44  APIレスポンスが遅い       bug          about 3 hours ago
#43  テストカバレッジの向上     testing      about 1 day ago
#42  ログインバリデーション     bug          about 2 days ago
#41  READMEの更新             documentation about 3 days ago
```

### Issue作成時の出力

```text
$ gh issue create --title "ログインページのバグ" --body "パスワードが空でも送信できる"

Creating issue in myteam/webapp

https://github.com/myteam/webapp/issues/46
```

---

## Issueテンプレート

リポジトリの `.github/ISSUE_TEMPLATE/` ディレクトリにテンプレートを配置できます。

### バグ報告テンプレート（bug_report.md）

```markdown
---
name: バグ報告
about: 不具合の報告
title: "[BUG] "
labels: bug
assignees: ''
---

## バグの概要
<!-- 何が起きているか -->

## 再現手順
1.
2.
3.

## 期待される動作
<!-- 本来どうなるべきか -->

## 実際の動作
<!-- 実際に何が起きたか -->

## 環境
- OS:
- ブラウザ:
- バージョン:

## スクリーンショット
<!-- あれば添付 -->
```

### 機能要望テンプレート（feature_request.md）

```markdown
---
name: 機能要望
about: 新しい機能の提案
title: "[FEATURE] "
labels: enhancement
assignees: ''
---

## 解決したい課題
<!-- どんな問題を解決したいか -->

## 提案する解決策
<!-- どう解決したいか -->

## 代替案
<!-- 他に考えた方法があれば -->

## 補足情報
<!-- 参考になるリンクや資料 -->
```

---

## ラベルとマイルストーン

### よく使うラベル

| ラベル | 色 | 用途 |
|--------|-----|------|
| `bug` | 赤 | バグ報告 |
| `enhancement` | 青 | 機能追加・改善 |
| `documentation` | 緑 | ドキュメント関連 |
| `good first issue` | 紫 | 初心者向けのタスク |
| `help wanted` | 黄 | 助けが必要なタスク |
| `wontfix` | 灰 | 対応しないと判断 |
| `duplicate` | 灰 | 重複したIssue |
| `priority: high` | 赤 | 優先度：高 |
| `priority: low` | 緑 | 優先度：低 |

### マイルストーンの活用

```text
マイルストーン: v1.0リリース
├── Issue #10: ログイン機能     ✅ 完了
├── Issue #11: ユーザー登録     ✅ 完了
├── Issue #12: プロフィール編集  🔄 進行中
└── Issue #13: パスワードリセット 📋 未着手

進捗: 50% (2/4)
期限: 2026-03-01
```

---

## GitHub Projects（プロジェクトボード）

### カンバン方式のワークフロー

```text
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   To Do     │  │ In Progress │  │    Done     │
│             │  │             │  │             │
│ #45 ダーク  │  │ #42 バリデ  │  │ #41 README  │
│     モード  │  │     ーション │  │     更新    │
│             │  │             │  │             │
│ #43 テスト  │  │ #44 API     │  │ #40 初期    │
│     カバレッジ│ │    レスポンス│  │     設定    │
└─────────────┘  └─────────────┘  └─────────────┘
```

### プロジェクトの設定（GitHub Web UI）

```text
1. リポジトリの「Projects」タブを開く
2. 「New project」をクリック
3. テンプレートを選択（Board推奨）
4. カラムを設定：
   - To Do（未着手）
   - In Progress（進行中）
   - In Review（レビュー中）
   - Done（完了）
5. IssueやPRをカードとして追加
```

---

## コミットメッセージでIssueを操作する

### 自動クローズのキーワード

```bash
# コミットメッセージにキーワードを含める
git commit -m "ログインバリデーションを追加 fixes #42"
git commit -m "バグ修正 closes #44"
git commit -m "API最適化を実施 resolves #44"
```

```text
使えるキーワード：
  close, closes, closed
  fix, fixes, fixed
  resolve, resolves, resolved

※ デフォルトブランチ（main）にマージされた時点で自動クローズされる
```

### PRからIssueを参照する

```markdown
## PR本文の例

ログインフォームにバリデーションを追加しました。

- メールアドレスの形式チェック
- パスワードの最低文字数チェック

closes #42
ref #43
```

```text
closes #42 → マージ時にIssue #42を自動クローズ
ref #43    → Issue #43へのリンクのみ（クローズしない）
```

---

## よくある間違い

### 1. タイトルが曖昧

```text
悪い例：「エラーが出る」「直してほしい」「バグ」
良い例：「ログインページでメールアドレス未入力時に500エラーが発生する」
```

### 2. 再現手順が書かれていない

```text
悪い例：「ログインできない」
良い例：
  1. /login にアクセス
  2. メールアドレスに「test@example.com」を入力
  3. パスワードを空欄のまま「ログイン」を押す
  4. → 500エラーが表示される（期待：バリデーションメッセージ）
```

### 3. ラベルを使わない

```text
悪い例：全てのIssueがラベルなしで一覧が見づらい
良い例：bug / enhancement / documentation などで分類
```

### 4. Issueを閉じずに放置

```text
悪い例：対応済みのIssueが大量にオープンのまま
良い例：完了したら必ずクローズ。コミットメッセージで自動クローズを活用
```

---

## 実用例

### チーム開発でのIssue運用フロー

```text
1. 企画・要件定義
   → Issueとしてタスクを起票
   → ラベルとマイルストーンを設定

2. スプリント計画
   → プロジェクトボードで優先順位を整理
   → 担当者をアサイン

3. 開発
   → Issueに対応するブランチを作成（feature/#42-login-validation）
   → 作業完了後にPRを作成（closes #42）

4. レビュー・マージ
   → PRをレビュー・マージ
   → Issueが自動クローズ
   → プロジェクトボードで「Done」に移動

5. 振り返り
   → クローズしたIssueを確認
   → マイルストーンの進捗を確認
```

### ブランチ名にIssue番号を含める

```bash
# Issue #42 に対応するブランチ
git checkout -b feature/#42-login-validation

# Issue #45 に対応するブランチ
git checkout -b feature/#45-dark-mode
```

---

## 実習

### 課題1：Issueを作成しよう

自分のリポジトリで以下の3つのIssueを作成してみましょう。

1. バグ報告のIssue（ラベル：`bug`）
2. 機能追加のIssue（ラベル：`enhancement`）
3. ドキュメント更新のIssue（ラベル：`documentation`）

それぞれに適切なタイトル、説明、ラベルを設定してください。

### 課題2：Issueテンプレートを設定しよう

`.github/ISSUE_TEMPLATE/` にバグ報告用と機能要望用のテンプレートを作成してみましょう。

### 課題3：IssueとPRを連携させよう

1. Issueを1つ作成する
2. そのIssueに対応するfeatureブランチを作成する
3. 簡単な変更を行いPRを作成する（本文に `closes #番号` を含める）
4. PRをマージしてIssueが自動クローズされることを確認する
