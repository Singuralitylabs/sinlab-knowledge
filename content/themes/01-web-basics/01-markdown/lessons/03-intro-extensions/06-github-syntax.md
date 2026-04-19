---
title: "GitHub固有記法（GitHub-specific Syntax）サンプル"
order: 6
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# GitHub固有記法（GitHub-specific Syntax）サンプル

## 解説

GitHub上でのみ使える特殊な自動リンク機能です。Issue管理、コードレビュー、チーム開発で活用されます。

| 記法 | 機能 | 例 |
|------|------|-----|
| `@username` | ユーザーメンション | @octocat |
| `#123` | Issue/PR参照 | #42 |
| `SHA` | コミット参照 | a1b2c3d |
| `owner/repo#123` | 他リポジトリ参照 | rails/rails#123 |

**注意**：これらの記法はGitHub専用です。他の環境では通常のテキストとして表示されます。

---

## ユーザーメンション

`@` に続けてユーザー名を書くと、そのユーザーへのリンクと通知が生成されます。

### 記法

```markdown
@octocat さん、このPRのレビューをお願いします。

CC: @frontend-team @backend-team

実装について @senior-dev に確認してください。
```

### 用途

- **レビュー依頼**：特定のメンバーにレビューを依頼
- **質問・相談**：担当者への問い合わせ
- **チーム通知**：チーム全体への連絡

### 注意点

- メンションされたユーザーには通知が届く
- チームメンション（`@org/team-name`）も可能
- 存在しないユーザー名はリンクにならない

---

## Issue / Pull Request 参照

`#` に続けて番号を書くと、同一リポジトリのIssue/PRにリンクします。

### 記法

```markdown
#123 で報告されたバグを修正しました。

関連Issue: #45, #67, #89

詳細は #100 を参照してください。
```

### 表示

GitHubでは `#123` が自動的にリンクになり、ホバーするとタイトルがプレビュー表示されます。

### 用途

- **バグ修正の関連付け**：どのIssueを解決したか明示
- **関連タスクの参照**：関係するIssueをまとめる
- **議論の参照**：過去の議論へのリンク

---

## 他リポジトリへの参照

`owner/repo#123` 形式で他のリポジトリのIssue/PRを参照できます。

### 記法

```markdown
この実装は facebook/react#1234 を参考にしました。

関連: microsoft/vscode#5678

上流の問題: kubernetes/kubernetes#9012
```

### 用途

- **依存ライブラリの問題追跡**
- **他プロジェクトの参考実装への言及**
- **クロスリポジトリの連携**

---

## コミット参照

7文字以上のコミットSHAは自動的にコミットへのリンクになります。

### 記法

```markdown
コミット a1b2c3d4e5f でこの問題は解決されています。

この変更は abc1234 で導入されました。

完全なSHA: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

### フルSHAと短縮SHA

- **短縮SHA（7文字以上）**：`a1b2c3d` → リンクになる
- **フルSHA（40文字）**：完全な参照、表示は短縮される

---

## 自動Issue/PRクローズ

コミットメッセージやPRの説明に特定のキーワードを含めると、マージ時にIssueが自動的にクローズされます。

### クローズキーワード

```markdown
# 以下のキーワードが使えます：

Fixes #123
Fixed #123
Fix #123

Closes #123
Closed #123
Close #123

Resolves #123
Resolved #123
Resolve #123
```

### 複数Issueのクローズ

```markdown
Fixes #123, fixes #456, closes #789

This PR fixes #100 and resolves #200.
```

### コミットメッセージの例

```markdown
Add user authentication feature

- Implement login/logout functionality
- Add session management
- Create user model

Fixes #42
Closes #15
```

---

## URLの自動リンク

URLはそのまま書くだけで自動的にリンクになります。

### 記法

```markdown
公式ドキュメント: https://docs.github.com

参考記事: https://example.com/article
```

---

## 実用例

### Issue のテンプレート

```markdown
## バグ報告

### 概要
ログイン画面でエラーが発生します。

### 関連Issue
- #45 で同様の報告あり
- #67 の修正後に発生

### 担当者
@frontend-team 確認お願いします。

### 参考
facebook/react#12345 が関連している可能性があります。
```

### Pull Request の説明

```markdown
## 概要
ユーザー認証機能を実装しました。

## 変更内容
- ログイン/ログアウト機能の実装
- セッション管理の追加
- ユーザーモデルの作成

## 関連Issue
Fixes #42
Closes #15

## レビュアー
@security-team セキュリティレビューをお願いします。
@frontend-team UIの確認をお願いします。

## テスト
- [x] 単体テスト追加
- [x] E2Eテスト追加
- [ ] パフォーマンステスト

## 参考コミット
認証ロジックは a1b2c3d を基に実装しました。
```

### リリースノート

```markdown
## v2.0.0 リリースノート

### 新機能
- ユーザー認証 (#42, #43)
- ダークモード対応 (#50)

### バグ修正
- ログイン画面のエラー修正 (#45) by @developer1
- パフォーマンス改善 (#60) by @developer2

### 破壊的変更
- API v1 のサポート終了 (#70)

### 貢献者
@contributor1, @contributor2, @contributor3 ありがとうございました！
```

---

## 対応環境

| 記法 | GitHub | GitLab | Bitbucket | Azure DevOps |
|------|:------:|:------:|:---------:|:------------:|
| @メンション | ✅ | ✅ | ✅ | ✅ |
| #Issue参照 | ✅ | ✅ | ✅ | ✅ |
| コミットSHA | ✅ | ✅ | ✅ | ✅ |
| クローズキーワード | ✅ | ✅ | ✅ | ✅ |

**注意**：構文は似ていますが、プラットフォームごとに微妙な違いがあります。

---

## 実習

以下のPull Request説明を完成させてみましょう。

```markdown
## 概要
検索機能を追加しました。

## 関連Issue
<!-- #番号 を使って関連Issueを参照 -->

## レビュアー
<!-- @ユーザー名 でメンションを追加 -->

## クローズするIssue
<!-- Fixes #番号 形式で書く -->
```
