---
title: "Git入門 基礎編"
order: 1
type: lecture
difficulty: beginner
tags: [git, fundamentals, concept]
estimatedMinutes: 15
status: published
---
# Git入門 基礎編

## はじめに

### Gitとは？

Git（ギット）は、ファイルの変更履歴を記録・管理するための**分散型バージョン管理システム**です。

2005年にLinuxカーネルの開発者であるリーナス・トーバルズによって開発され、現在では世界中のソフトウェア開発で標準的に使用されています。

### なぜGitを学ぶのか？

- **変更履歴の管理**：誰が、いつ、何を変更したかを記録し、いつでも過去の状態に戻せます
- **チーム開発の基盤**：複数人での同時開発を安全かつ効率的に行えます
- **業界標準のスキル**：エンジニア採用においてGitの知識は必須とされています
- **GitHubとの連携**：世界最大のコード共有プラットフォームを活用できます

### バージョン管理の考え方

バージョン管理がない場合、ファイルの管理は次のようになりがちです。

```text
レポート_最終版.docx
レポート_最終版_修正.docx
レポート_本当の最終版.docx
```

Gitを使えば、1つのファイルで変更履歴をすべて管理できます。

::detail{slug="what-is-git"}

---

## 環境準備

### Gitのインストール

**macOS**

```bash
brew install git
```

**Windows**：[Git公式サイト](https://git-scm.com/)からインストーラをダウンロードして実行します。

**Linux（Ubuntu/Debian）**

```bash
sudo apt update && sudo apt install git
```

インストール確認：

```bash
git --version
```

### 初期設定（git config）

Gitを使い始める前に、ユーザー名とメールアドレスを設定します。

```bash
git config --global user.name "あなたの名前"
git config --global user.email "your.email@example.com"
git config --list   # 設定の確認
```

`--global` を付けると、そのPCのすべてのリポジトリに適用されます。

::detail{slug="install"}

---

## 基本操作

### 1. リポジトリの作成（git init）

リポジトリ（repository）は、Gitが変更履歴を管理するための保管場所です。

```bash
mkdir my-project && cd my-project
git init
```

```text
Initialized empty Git repository in /home/user/my-project/.git/
```

`.git` という隠しフォルダが作成され、ここにすべての変更履歴が保存されます。

::detail{slug="init-and-clone"}

---

### 2. ステージングとコミット（git add / git commit）

Gitでの変更記録は、2段階のステップで行います。

```text
作業ディレクトリ → ステージングエリア → リポジトリ
  （編集する）     （git add で登録）   （git commit で記録）
```

```bash
# ファイルをステージングに追加
git add index.html
git add .              # すべての変更を追加

# コミット（変更履歴として記録）
git commit -m "初期ページを作成"
```

**良いコミットメッセージの例**：`ログイン機能を追加`、`ヘッダーのレイアウトを修正`

**悪いコミットメッセージの例**：`修正`、`update`、`あああ`

::detail{slug="add-and-commit"}

---

### 3. 状態と差分の確認（git status / git diff）

```bash
git status          # 現在の状態を確認
git diff            # 変更内容の差分を確認
git diff --staged   # ステージング済みの差分を確認
```

ファイルの状態は以下の4種類があります。

| 状態 | 説明 |
|------|------|
| Untracked | Gitで追跡されていない新規ファイル |
| Modified | 追跡中のファイルが変更された状態 |
| Staged | `git add` でステージングされた状態 |
| Committed | `git commit` でリポジトリに記録された状態 |

::detail{slug="status-and-log"}

---

### 4. ファイル管理（git rm / git mv / .gitignore）

```bash
git rm old-file.txt           # ファイルを削除してステージング
git rm --cached secret.txt    # Git管理から外す（ファイルは残す）
git mv old.txt new.txt        # ファイル名を変更
```

**.gitignore** - 追跡除外ファイルの設定

```text
# .gitignore の例
.DS_Store
node_modules/
dist/
.env
*.log
```

パスワードやAPIキーが含まれるファイルは必ず `.gitignore` に追加しましょう。

::detail{slug="branch-basics"}

::detail{slug="merge-basics"}

::detail{slug="remote-basics"}

::detail{slug="github-intro"}

---

## 基本コマンドまとめ

| コマンド | 説明 | 使用例 |
|----------|------|--------|
| `git init` | リポジトリを初期化 | `git init` |
| `git add` | ステージングに追加 | `git add .` |
| `git commit` | 変更をコミット | `git commit -m "メッセージ"` |
| `git status` | 現在の状態を確認 | `git status` |
| `git diff` | 変更差分を表示 | `git diff` |
| `git log` | コミット履歴を表示 | `git log --oneline` |
| `git rm` | ファイルを削除 | `git rm file.txt` |
| `git mv` | ファイルを移動・名前変更 | `git mv old.txt new.txt` |
| `git config` | Gitの設定を変更 | `git config --global user.name "名前"` |

---

## 実践演習：最初のリポジトリ

```bash
# 1. プロジェクトを作成して初期化
mkdir git-practice && cd git-practice
git init

# 2. ファイルを作成
echo "# Git練習プロジェクト" > README.md
echo ".DS_Store" > .gitignore

# 3. 最初のコミット
git add .
git commit -m "プロジェクトを初期化"

# 4. ファイルを編集して差分を確認
echo "Gitの基本操作を練習するためのリポジトリです。" >> README.md
git diff

# 5. 変更をコミットして履歴を確認
git add README.md
git commit -m "READMEに説明を追加"
git log --oneline
```

---

## まとめ

本記事では、Gitの基礎的な概念と基本操作を解説しました。

Gitの基本操作は「**add（追加） → commit（記録） → status（確認）**」の3つのサイクルです。日常的に使うのは `git add`、`git commit`、`git status`、`git diff` の4つが中心です。まずはこの4つを確実に使えるようになりましょう。

### 次のステップ

- 実践編でブランチ操作やリモートリポジトリとの連携を学びましょう
- GitHubアカウントを作成し、リモートリポジトリにプッシュしてみましょう

### 参考リソース

- [Git公式ドキュメント](https://git-scm.com/doc)：Gitの公式リファレンス
- [Pro Git（日本語版）](https://git-scm.com/book/ja/v2)：無料で読めるGitの解説書
- [GitHub Skills](https://skills.github.com/)：GitHubが提供するインタラクティブな学習コース

---

お疲れさまでした！基礎編の内容をマスターしたら、実践編に進みましょう。
