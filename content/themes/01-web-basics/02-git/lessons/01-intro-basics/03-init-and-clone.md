---
title: "リポジトリの作成"
order: 3
type: detail
difficulty: beginner
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# リポジトリの作成

## 解説

リポジトリ（Repository）は、プロジェクトのファイルとその変更履歴を管理する「保管庫」です。Gitでは、リポジトリを新規作成する方法と、既存のリポジトリをコピー（クローン）する方法の2通りがあります。

### リポジトリの種類

| 種類 | 説明 | 用途 |
|------|------|------|
| **通常のリポジトリ** | 作業ディレクトリ + `.git` ディレクトリ | 日常の開発作業 |
| **ベアリポジトリ** | `.git` ディレクトリの中身のみ（作業ファイルなし） | サーバー上の共有リポジトリ |

### .git ディレクトリの構成

`git init` を実行すると、プロジェクトフォルダ内に `.git` ディレクトリが作成されます。このディレクトリにGitの全データが格納されています。

```text
.git/
├── HEAD            # 現在チェックアウトしているブランチへの参照
├── config          # このリポジトリのローカル設定
├── description     # リポジトリの説明（GitWebで使用）
├── hooks/          # フック（コミット前後に実行するスクリプト）
├── info/           # 追加情報（excludeファイルなど）
├── objects/        # すべてのデータ（コミット、ツリー、ブロブ）
└── refs/           # ブランチやタグの参照ポインタ
    ├── heads/      # ローカルブランチ
    └── tags/       # タグ
```

> **注意**：`.git` ディレクトリを削除すると、すべての変更履歴が失われます。このディレクトリは決して手動で編集しないでください。

---

## コマンドサンプル

### 新しいリポジトリを作成する（git init）

```bash
# 新しいプロジェクトディレクトリを作成して移動
mkdir my-project
cd my-project

# Gitリポジトリを初期化
git init

# 現在のディレクトリで直接初期化する場合
git init .

# ディレクトリ名を指定して作成と初期化を同時に行う
git init my-new-project
```

### 既存のリポジトリをクローンする（git clone）

```bash
# HTTPS経由でクローン
git clone https://github.com/user/repository.git

# SSH経由でクローン（SSH鍵の設定が必要）
git clone git@github.com:user/repository.git

# 別のディレクトリ名でクローン
git clone https://github.com/user/repository.git my-local-name

# 特定のブランチだけをクローン
git clone -b develop https://github.com/user/repository.git

# 履歴を浅くクローン（最新のコミットだけ取得）
git clone --depth 1 https://github.com/user/repository.git
```

### ベアリポジトリの作成

```bash
# ベアリポジトリを作成（サーバー用）
git init --bare my-project.git

# 既存のリポジトリからベアリポジトリを作成
git clone --bare https://github.com/user/repository.git
```

### リポジトリの状態確認

```bash
# リポジトリの状態を確認
git status

# .gitディレクトリの中身を確認
ls -la .git/

# リモートリポジトリの情報を確認
git remote -v
```

---

## 実行結果

```text
$ mkdir my-project
$ cd my-project

$ git init
Initialized empty Git repository in /Users/taro/my-project/.git/

$ ls -la
total 0
drwxr-xr-x   3 taro  staff    96  1 15 10:00 .
drwxr-xr-x  10 taro  staff   320  1 15 10:00 ..
drwxr-xr-x   9 taro  staff   288  1 15 10:00 .git

$ ls -la .git/
total 24
drwxr-xr-x   9 taro  staff   288  1 15 10:00 .
drwxr-xr-x   3 taro  staff    96  1 15 10:00 ..
-rw-r--r--   1 taro  staff    23  1 15 10:00 HEAD
-rw-r--r--   1 taro  staff   137  1 15 10:00 config
-rw-r--r--   1 taro  staff    73  1 15 10:00 description
drwxr-xr-x  15 taro  staff   480  1 15 10:00 hooks
drwxr-xr-x   3 taro  staff    96  1 15 10:00 info
drwxr-xr-x   4 taro  staff   128  1 15 10:00 objects
drwxr-xr-x   4 taro  staff   128  1 15 10:00 refs

$ git status
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

```text
$ git clone https://github.com/user/sample-project.git
Cloning into 'sample-project'...
remote: Enumerating objects: 156, done.
remote: Counting objects: 100% (156/156), done.
remote: Compressing objects: 100% (89/89), done.
remote: Total 156 (delta 67), reused 142 (delta 58)
Receiving objects: 100% (156/156), 45.23 KiB | 1.20 MiB/s, done.
Resolving deltas: 100% (67/67), done.

$ cd sample-project
$ git remote -v
origin  https://github.com/user/sample-project.git (fetch)
origin  https://github.com/user/sample-project.git (push)
```

---

## よくある間違い

### 1. 既にGitリポジトリがあるディレクトリで git init する

```bash
# ❌ すでにリポジトリがあるディレクトリで再度 git init
$ cd existing-repo
$ git init
Reinitialized existing Git repository in /Users/taro/existing-repo/.git/

# 既存の履歴は消えないが、意図しない再初期化は混乱の元
# ✅ まず git status で確認してからにする
$ git status
```

### 2. .git ディレクトリを削除してしまう

```text
❌ .gitディレクトリを削除すると、すべてのコミット履歴が消える
   rm -rf .git  ← 絶対にやらないこと！

✅ リポジトリを消したい場合は、ディレクトリごと削除する
   cd ..
   rm -rf my-project
```

### 3. ネストされたGitリポジトリを作る

```bash
# ❌ Gitリポジトリの中にさらに git init してしまう
$ cd my-project        # すでにGitリポジトリ
$ mkdir sub-project
$ cd sub-project
$ git init             # リポジトリのネスト（意図しない場合は問題の原因）

# ✅ 事前に親ディレクトリがGitリポジトリか確認
$ git rev-parse --is-inside-work-tree
true  # ← すでにGitリポジトリ内にいる
```

### 4. クローン時のURLを間違える

```bash
# ❌ HTTPS と SSH を混在させる
git clone git@github.com:user/repo.git   # SSH（鍵が必要）
git clone https://github.com/user/repo   # .git がない

# ✅ 正しい形式を使用
git clone https://github.com/user/repo.git   # HTTPS
git clone git@github.com:user/repo.git       # SSH
```

---

## 実用例

### 新しいプロジェクトを始める典型的な流れ

```bash
# 1. プロジェクトディレクトリを作成
mkdir my-web-app
cd my-web-app

# 2. Gitリポジトリを初期化
git init

# 3. 最初のファイルを作成
echo "# My Web App" > README.md
echo "node_modules/" > .gitignore

# 4. 最初のコミット
git add .
git commit -m "初期コミット"

# 5. GitHubにリモートリポジトリを作成した後、接続
git remote add origin git@github.com:user/my-web-app.git
git push -u origin main
```

### 既存のプロジェクトをGitHubからクローンして開発を始める

```bash
# 1. リポジトリをクローン
git clone git@github.com:team/project.git
cd project

# 2. 依存パッケージのインストール（Node.jsプロジェクトの場合）
npm install

# 3. 開発ブランチを作成
git checkout -b feature/my-feature

# 4. 開発を開始
code .  # VS Codeで開く
```

### 浅いクローンで巨大リポジトリを高速に取得する

```bash
# 最新のコミットだけ取得（CI/CDでよく使う）
git clone --depth 1 https://github.com/large/repository.git

# 必要に応じて追加の履歴を取得
cd repository
git fetch --unshallow  # 完全な履歴を取得
```

---

## 実習

### 課題1：新しいリポジトリを作成する

1. 適当な場所に `git-practice` というディレクトリを作成してください
2. `git init` でリポジトリを初期化してください
3. `git status` でリポジトリの状態を確認してください
4. `.git` ディレクトリの中身を `ls -la .git/` で確認してください

### 課題2：ファイルを作成してコミットする

課題1で作成したリポジトリで以下を行ってください。

```bash
# 1. READMEファイルを作成
echo "# Git練習用リポジトリ" > README.md

# 2. ステージングに追加
git add README.md

# 3. コミット
git commit -m "READMEを追加"

# 4. ログを確認
git log
```

### 課題3：GitHubからクローンする

1. GitHubで公開されている好きなリポジトリを1つ見つけてください
2. `git clone` でローカルにクローンしてください
3. `git log --oneline -5` で最新5件のコミットを確認してください
4. `git remote -v` でリモート情報を確認してください

### 課題4：.git ディレクトリを調べる

`.git` ディレクトリの中の以下のファイルの内容を確認してみましょう。

```bash
cat .git/HEAD       # 何が書かれていますか？
cat .git/config     # どんな設定がありますか？
ls .git/refs/heads/ # どんなブランチがありますか？
```
