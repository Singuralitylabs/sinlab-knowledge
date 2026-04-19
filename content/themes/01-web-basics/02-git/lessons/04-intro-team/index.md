---
title: "解説記事 (チーム開発編)"
order: 4
type: lecture
difficulty: intermediate
tags: [git, github, intermediate, concept]
estimatedMinutes: 20
status: published
---
# Git入門 チーム開発編

## はじめに

基礎編・実践編では、Gitの基本操作とブランチ・リモートリポジトリの使い方を学びました。チーム開発編では、**プルリクエスト、コードレビュー、ブランチ戦略、CI/CD**など、実際のチーム開発で必要となるスキルを学びます。

---

## プルリクエスト

### 1. プルリクエストとは

プルリクエスト（Pull Request、略してPR）は、自分のブランチの変更を別のブランチに統合してもらうための「提案」です。

- **コードレビューの場**：チームメンバーがコードを確認し、改善点を指摘できる
- **議論の場**：実装方針について話し合える
- **品質管理の仕組み**：レビューを通過しないとマージできないルールを設定できる
- **記録としての役割**：なぜその変更を行ったかの履歴が残る

### 2. プルリクエストの作成

```bash
# 作業ブランチで開発してプッシュ
git switch -c feature-user-profile
git add .
git commit -m "ユーザープロフィール画面を追加"
git push -u origin feature-user-profile
```

GitHub上でPRを作成する際に記載する内容の例：

```text
## 概要
ユーザープロフィール画面を新規追加しました。

## 変更内容
- プロフィール表示ページを追加
- ユーザー情報の編集フォームを実装

## 確認方法
1. /profile にアクセス
2. 「編集」ボタンをクリック
3. 各項目を変更して「保存」をクリック

## 関連Issue
Closes #42
```

| 項目 | 良い例 | 悪い例 |
|------|--------|--------|
| タイトル | ユーザープロフィール画面を追加 | 修正 |
| 変更規模 | 1つの機能に集中（200行以内） | 複数機能を一度に |
| 説明 | 概要・変更内容・確認方法を記載 | 説明なし |

### 3. マージの種類（GitHub上）

| 方法 | 説明 |
|------|------|
| Create a merge commit | マージコミットを作成（履歴がすべて残る） |
| Squash and merge | コミットを1つにまとめてマージ |
| Rebase and merge | リベースして一直線の履歴にする |

---

## Issue管理とプロジェクトボード

### 4. Issue管理

Issue（イシュー）は、バグ報告、機能要望、タスク管理などに使うGitHubの機能です。

**ラベルの活用**

| ラベル | 用途 |
|--------|------|
| `bug` | バグ報告 |
| `enhancement` | 機能改善・追加 |
| `documentation` | ドキュメント関連 |
| `good first issue` | 初心者向けのタスク |
| `priority: high` | 優先度が高いタスク |

PRの説明に `Closes #42` と書くと、マージ時にIssueが自動クローズされます。

### 5. プロジェクトボード

GitHubのProjectsでタスクの進捗をカンバンボード形式で管理できます。

```text
┌──────────────┬──────────────┬──────────────┐
│   Todo       │  In Progress │    Done      │
├──────────────┼──────────────┼──────────────┤
│ #45 検索機能  │ #42 プロフ   │ #38 ログイン  │
│ #46 通知機能  │ #43 設定画面  │ #39 登録画面  │
└──────────────┴──────────────┴──────────────┘
```

---

## ブランチ戦略

### 6. Git Flow

大規模開発やリリースサイクルが明確なプロジェクト向けの戦略です。

| ブランチ | 目的 | 作成元 | マージ先 |
|----------|------|--------|----------|
| `main` | 本番環境のコード | - | - |
| `develop` | 開発の統合 | `main` | `main` |
| `feature/*` | 新機能の開発 | `develop` | `develop` |
| `release/*` | リリース準備 | `develop` | `main`, `develop` |
| `hotfix/*` | 緊急バグ修正 | `main` | `main`, `develop` |

### 7. GitHub Flow

シンプルで継続的デプロイに適した戦略です。小〜中規模のプロジェクトに向いています。

```text
main ──●──●──●──●──●──●──●──●──● 常にデプロイ可能
          \     /  \        /
feature    ●──●     ●──●──●      PRでレビュー後マージ
```

**GitHub Flowのルール**

1. `main` は常にデプロイ可能な状態を保つ
2. 作業は必ずブランチを切って行う
3. PRを作成してレビューを受ける
4. レビュー承認後にマージ → デプロイ

| 項目 | Git Flow | GitHub Flow |
|------|----------|-------------|
| 複雑さ | 高い | 低い |
| 向いている規模 | 大規模 | 小〜中規模 |
| リリースサイクル | 定期リリース | 継続的デプロイ |
| 学習コスト | 高い | 低い |

初心者にはGitHub Flowがおすすめです。

---

## コードレビュー

### 8. コードレビューのベストプラクティス

**レビュアーが確認すべきポイント**

1. **機能要件**：仕様通りに動作するか
2. **コード品質**：命名は適切か、ロジックはわかりやすいか
3. **安全性**：セキュリティ上の問題はないか
4. **テスト**：テストは書かれているか
5. **一貫性**：プロジェクトの規約に沿っているか

**レビューコメントの書き方**

| レベル | プレフィックス | 例 |
|--------|---------------|-----|
| 必須修正 | `[must]` | `[must] 入力値のサニタイズが必要です` |
| 提案 | `[suggest]` | `[suggest] getUserInfoの方がわかりやすいかもしれません` |
| 質問 | `[question]` | `[question] この条件分岐の意図を教えてください` |
| 称賛 | `[praise]` | `[praise] このリファクタリングで読みやすくなりました` |

---

## CI/CD

### 9. GitHub Actions

GitHub Actionsは、GitHubに組み込まれたCI/CDサービスです。

```text
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│  Push  │ ──→ │ Build  │ ──→ │  Test  │ ──→ │ Deploy │
└────────┘     └────────┘     └────────┘     └────────┘
```

**ワークフローの例**（`.github/workflows/ci.yml`）

```text
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Node.jsのセットアップ
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run lint
    - run: npm test
    - run: npm run build
```

PRを作成するとCIが自動実行され、テスト失敗時はマージがブロックされます。

---

## トラブルシューティング

### 10. よくある問題と解決方法

**間違えてmainに直接コミットした**

```bash
git reset --soft HEAD~1          # コミットを取り消し
git switch -c feature/my-work    # ブランチを作成
git commit -m "機能を追加"        # 改めてコミット
```

**追跡されたくないファイルをコミットしてしまった**

```bash
git rm --cached .env             # Git管理から除外
echo ".env" >> .gitignore
git add .gitignore
git commit -m ".envをGit管理から除外"
```

**直前のコミットにファイルを追加し忘れた**

```bash
git add forgotten-file.txt
git commit --amend --no-edit     # 直前のコミットに追加
```

**古いブランチをmainの最新に追従させたい**

```bash
git fetch origin
git merge origin/main            # マージで取り込む
# または
git rebase origin/main           # リベースで取り込む
```

---

## Git設定とエイリアス

### 11. 便利な設定

**エイリアス（ショートカット）**

```bash
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.br branch
git config --global alias.sw switch
git config --global alias.cm "commit -m"
```

**その他の推奨設定**

```bash
git config --global init.defaultBranch main
git config --global push.autoSetupRemote true
git config --global core.quotepath false      # 日本語ファイル名対応
git config --global color.ui auto
```

---

## ベストプラクティスまとめ

### コミット

| ルール | 説明 |
|--------|------|
| こまめにコミットする | 1つの論理的な変更ごとにコミット |
| わかりやすいメッセージを書く | 何を変更したかが一目でわかるように |
| 動作する状態でコミットする | ビルドエラーの状態でコミットしない |

### ブランチ

| ルール | 説明 |
|--------|------|
| mainに直接コミットしない | 必ずブランチを切って作業する |
| 短命なブランチを心がける | 長期間のブランチはコンフリクトの原因 |
| わかりやすい名前を付ける | `feature/`、`fix/` のプレフィックスを使う |

### プルリクエスト

| ルール | 説明 |
|--------|------|
| 小さなPRを心がける | 200-300行以内が理想 |
| 説明を丁寧に書く | レビュアーの理解を助ける |
| セルフレビューしてから出す | 自分で一度確認してから提出 |

### セキュリティ

| ルール | 説明 |
|--------|------|
| パスワード・APIキーをコミットしない | `.gitignore` と `.env` を活用 |
| `--force-with-lease` を使う | `--force` より安全な強制プッシュ |
| SSH鍵を使用する | HTTPS + トークンよりセキュア |

---

## まとめ

チーム開発編では、プルリクエスト、Issue管理、ブランチ戦略、コードレビュー、CI/CDなど、チーム開発に必要なスキルを学びました。

チーム開発で最も大切なのは**コミュニケーション**です。「わかりやすいコミットメッセージ」「丁寧なPRの説明」「建設的なレビューコメント」といったコミュニケーションスキルが、技術的なスキルと同じくらい重要です。

### 次のステップ

- 実際のチームプロジェクトでGitHub Flowを実践してみましょう
- オープンソースプロジェクトにIssueやPRで貢献してみましょう
- GitHub Actionsで自分のプロジェクトにCI/CDを導入してみましょう

### 参考リソース

- [GitHub Docs - プルリクエスト](https://docs.github.com/ja/pull-requests)：PR作成の公式ガイド
- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)：CI/CDの公式ガイド
- [Conventional Commits](https://www.conventionalcommits.org/ja/)：コミットメッセージの規約

---

お疲れさまでした！基礎編・実践編・チーム開発編を通して、Gitの基本から実践的なチーム開発まで学びました。あとは実際に手を動かして経験を積んでいきましょう。
