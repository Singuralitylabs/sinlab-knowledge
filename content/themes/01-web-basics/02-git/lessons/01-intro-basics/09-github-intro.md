---
title: "GitHub入門"
order: 9
type: detail
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# GitHub入門

## 解説

GitHubは、Gitリポジトリを**ホスティングするWebサービス**です。Gitはバージョン管理の仕組みそのもの、GitHubはそれをチームで共有し、協力するためのプラットフォームです。

### GitとGitHubの違い

| 項目 | Git | GitHub |
|------|-----|--------|
| 種類 | バージョン管理ツール | Webサービス |
| 動作場所 | ローカルPC | インターネット上 |
| 開発者 | Linus Torvalds | GitHub社（Microsoft傘下） |
| 料金 | 無料（OSS） | 無料プランあり（有料プランもあり） |
| 主な機能 | コミット、ブランチ、マージ | Pull Request、Issues、Actions |

### GitHubでできること

- **コードの共有**: チームメンバーや世界中の人とコードを共有する
- **Pull Request**: コードレビューの仕組み
- **Issues**: バグ報告やタスク管理
- **GitHub Actions**: 自動テスト・自動デプロイ（CI/CD）
- **GitHub Pages**: 静的Webサイトの無料ホスティング
- **Wiki**: プロジェクトのドキュメント管理
- **オープンソース**: 世界中のプロジェクトに貢献できる

---

## コマンドサンプル

### GitHubアカウントの初期設定

```bash
# Gitにユーザー名とメールアドレスを設定
git config --global user.name "あなたの名前"
git config --global user.email "your-email@example.com"
```

### 新しいリポジトリをGitHubに作成して接続する

```bash
# 1. ローカルでプロジェクトを作成
mkdir my-first-repo && cd my-first-repo
git init

# 2. README.md を作成
echo "# My First Repository" > README.md
echo "" >> README.md
echo "GitHubの練習用リポジトリです。" >> README.md

# 3. 最初のコミット
git add README.md
git commit -m "最初のコミット: README.mdを追加"

# 4. GitHubで作成したリポジトリと接続
git remote add origin https://github.com/username/my-first-repo.git

# 5. メインブランチの名前を main に設定
git branch -M main

# 6. GitHubにプッシュ
git push -u origin main
```

### 既存のGitHubリポジトリをクローンする

```bash
# HTTPS でクローン
git clone https://github.com/username/repository-name.git

# SSH でクローン
git clone git@github.com:username/repository-name.git

# 特定のディレクトリ名でクローン
git clone https://github.com/username/repository-name.git my-local-name
```

### GitHubの認証設定

```bash
# HTTPS の場合: 個人アクセストークン（PAT）を使用
# GitHubの Settings → Developer settings → Personal access tokens で生成

# SSH の場合: SSHキーを生成して登録
ssh-keygen -t ed25519 -C "your-email@example.com"
# 生成された公開鍵（~/.ssh/id_ed25519.pub）をGitHubに登録

# SSH接続のテスト
ssh -T git@github.com
```

---

## 実行結果

### `git clone` の出力例

```text
$ git clone https://github.com/username/my-project.git
Cloning into 'my-project'...
remote: Enumerating objects: 42, done.
remote: Counting objects: 100% (42/42), done.
remote: Compressing objects: 100% (28/28), done.
remote: Total 42 (delta 12), reused 42 (delta 12), pack-reused 0
Receiving objects: 100% (42/42), 8.50 KiB | 8.50 MiB/s, done.
Resolving deltas: 100% (12/12), done.
```

### SSH接続テストの出力例

```text
$ ssh -T git@github.com
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## よくある間違い

### 1. GitとGitHubを混同する

```text
NG: 「GitHub をインストールする」
OK: 「Git をインストールし、GitHub のアカウントを作成する」

NG: 「GitHub でコミットする」
OK: 「Git でコミットし、GitHub にプッシュする」
```

GitはPC上で動くツール、GitHubはWebサービスです。

### 2. パスワード認証が使えなくなっている

2021年8月以降、GitHubではパスワードによるHTTPS認証が廃止されました。

```bash
# NG: パスワードで認証しようとする
$ git push origin main
Username: your-username
Password: your-password
remote: Support for password authentication was removed on August 13, 2021.
```

**対処法**: 個人アクセストークン（PAT）または SSH キーを使用する。

### 3. README.md を作らない

README.md がないリポジトリは、何のプロジェクトか分かりません。必ず作成しましょう。

```markdown
# プロジェクト名

## 概要
このプロジェクトが何をするものかを簡潔に説明。

## インストール方法
プロジェクトのセットアップ手順。

## 使い方
基本的な使い方の説明。

## ライセンス
MIT License
```

### 4. Public と Private を間違える

GitHubでリポジトリを作成するとき、公開範囲を間違えないようにしましょう。

| 種類 | 誰が見られるか | 用途 |
|------|---------------|------|
| Public | 世界中の誰でも | OSS、ポートフォリオ、学習用 |
| Private | 自分と招待した人だけ | 個人プロジェクト、企業の内部開発 |

**注意**: Public リポジトリにパスワードやAPIキーを含むファイルをプッシュしないでください。一度プッシュすると履歴に残ります。

---

## 実用例

### GitHubでの新規リポジトリ作成手順

1. **GitHubにログイン**して右上の `+` ボタンをクリック
2. **New repository** を選択
3. 以下の項目を入力する：

```text
Repository name:  my-project
Description:      練習用プロジェクト（任意）
Public / Private: 目的に応じて選択
Initialize:       Add a README file にチェック（推奨）
.gitignore:       プログラミング言語に合わせて選択
License:          MIT License（OSSの場合）
```

4. **Create repository** ボタンをクリック

### README.md のベストプラクティス

良い README.md の例：

```markdown
# TaskManager

シンプルなタスク管理Webアプリケーション。

## 機能

- タスクの追加・編集・削除
- 期限の設定とリマインダー
- カテゴリ分類
- 検索とフィルタリング

## 技術スタック

- フロントエンド: React + TypeScript
- バックエンド: Node.js + Express
- データベース: PostgreSQL

## セットアップ

### 前提条件
- Node.js v18以上
- PostgreSQL v15以上

### インストール
git clone https://github.com/username/task-manager.git
cd task-manager
npm install
npm run dev

## ライセンス

MIT License
```

### GitHub Pages でWebサイトを公開する

GitHub Pages を使うと、リポジトリ内のHTMLファイルを無料でWebサイトとして公開できます。

```bash
# 1. リポジトリを作成し、HTMLファイルを追加
echo '<!DOCTYPE html>
<html>
<head><title>My Site</title></head>
<body>
<h1>Hello, GitHub Pages!</h1>
<p>GitHubで公開された私のWebサイトです。</p>
</body>
</html>' > index.html

git add index.html
git commit -m "GitHub Pages 用のページを追加"
git push origin main
```

2. GitHubのリポジトリページで **Settings** → **Pages** を開く
3. Source で **main** ブランチを選択し、**Save** をクリック
4. `https://username.github.io/repository-name/` でアクセスできる

### オープンソースプロジェクトを探す

GitHubで興味のあるプロジェクトを探す方法：

1. **GitHub Explore** (`github.com/explore`): トレンドやおすすめ
2. **検索**: `language:JavaScript stars:>1000` などのフィルタ
3. **Topics**: `github.com/topics/react` など技術ごとの一覧
4. **Awesome リスト**: `awesome-react`、`awesome-python` など厳選リンク集

```bash
# 興味のあるプロジェクトをクローンして読んでみる
git clone https://github.com/facebook/react.git
cd react
git log --oneline -20  # 最新20件のコミットを確認
```

---

## 実習

### 課題1: GitHubアカウントを作成する

1. https://github.com にアクセスしてアカウントを作成する
2. プロフィールを設定する（アイコン、名前、自己紹介）
3. Gitのグローバル設定にユーザー名とメールアドレスを登録する

```bash
git config --global user.name "あなたのGitHub ユーザー名"
git config --global user.email "GitHubに登録したメールアドレス"

# 設定を確認
git config --global --list
```

### 課題2: 初めてのリポジトリを作成する

1. GitHubで `hello-github` という名前の Public リポジトリを作成する
2. ローカルでプロジェクトを作成し、`README.md` を書く
3. GitHubにプッシュする
4. ブラウザで GitHubのリポジトリページを確認する
5. `README.md` が表示されていることを確認する

### 課題3: 既存のリポジトリをクローンする

1. GitHub上で興味のあるオープンソースプロジェクトを探す
2. `git clone` でローカルにコピーする
3. ファイル構成を確認する
4. `git log --oneline -10` で最新のコミット履歴を見る
5. README.md を読んで、プロジェクトの概要を理解する

### 課題4: GitHub Pages でページを公開する

1. `my-portfolio` リポジトリを作成する（Public）
2. 簡単な `index.html` を作成してプッシュする
3. Settings → Pages で GitHub Pages を有効にする
4. 公開されたURLにアクセスして表示を確認する
