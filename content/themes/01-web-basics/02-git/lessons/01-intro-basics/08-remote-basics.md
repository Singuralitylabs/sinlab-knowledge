---
title: "リモートリポジトリ"
order: 8
type: detail
difficulty: beginner
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# リモートリポジトリ

## 解説

リモートリポジトリとは、ネットワーク上（インターネットや社内サーバー）に置かれた**共有のGitリポジトリ**です。チーム開発やバックアップのために使用します。

### ローカルとリモートの関係

```text
  ローカルリポジトリ          リモートリポジトリ
  （自分のPC上）              （GitHub等のサーバー上）
  ┌──────────────┐           ┌──────────────┐
  │  作業ディレクトリ │           │              │
  │  ステージング    │  push →  │   共有の      │
  │  ローカル履歴    │  ← pull  │   コミット履歴 │
  └──────────────┘           └──────────────┘
```

- **push**: ローカルの変更をリモートに送信する
- **pull**: リモートの変更をローカルに取り込む
- **fetch**: リモートの情報をダウンロードする（ローカルには反映しない）
- **clone**: リモートリポジトリをローカルにコピーする

### 主なリモートリポジトリサービス

| サービス | 特徴 |
|----------|------|
| GitHub | 最大手、OSS の中心、無料プランあり |
| GitLab | CI/CD が充実、セルフホスト可能 |
| Bitbucket | Atlassian 製、Jira との連携が強い |

---

## コマンドサンプル

### リモートリポジトリの登録

```bash
# リモートリポジトリを追加（origin は慣習的な名前）
git remote add origin https://github.com/username/my-project.git

# SSH の場合
git remote add origin git@github.com:username/my-project.git
```

### リモートリポジトリの確認

```bash
# 登録されているリモートの一覧
git remote

# URL も含めて表示
git remote -v

# リモートの詳細情報
git remote show origin
```

### ローカルの変更をリモートに送信（push）

```bash
# 初回プッシュ（-u で上流ブランチを設定）
git push -u origin main

# 2回目以降（上流ブランチが設定されていれば省略可）
git push

# 特定のブランチをプッシュ
git push origin feature/login
```

### リモートの変更をローカルに取り込む（pull）

```bash
# リモートの変更を取得してマージ（fetch + merge）
git pull origin main

# 上流ブランチが設定されていれば省略可
git pull
```

### リモートの情報だけをダウンロードする（fetch）

```bash
# すべてのリモートブランチの情報を取得
git fetch origin

# 省略形
git fetch
```

### リモートブランチの操作

```bash
# リモートブランチの一覧
git branch -r

# ローカルとリモートの全ブランチ
git branch -a

# リモートブランチを削除
git push origin --delete feature/old-branch
```

### リモートの設定変更

```bash
# リモートの URL を変更
git remote set-url origin https://github.com/username/new-repo.git

# リモートの名前を変更
git remote rename origin upstream

# リモートを削除
git remote remove origin
```

---

## 実行結果

### `git remote -v` の出力例

```text
$ git remote -v
origin  https://github.com/username/my-project.git (fetch)
origin  https://github.com/username/my-project.git (push)
```

### `git push -u origin main` の出力例

```text
$ git push -u origin main
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
Delta compression using up to 8 threads
Compressing objects: 100% (10/10), done.
Writing objects: 100% (15/15), 2.50 KiB | 2.50 MiB/s, done.
Total 15 (delta 3), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (3/3), done.
To https://github.com/username/my-project.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

### `git pull` の出力例

```text
$ git pull
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Total 3 (delta 1), reused 3 (delta 1), pack-reused 0
Unpacking objects: 100% (3/3), 312 bytes | 312.00 KiB/s, done.
From https://github.com/username/my-project
   7b6a5c4..a1b2c3d  main       -> origin/main
Updating 7b6a5c4..a1b2c3d
Fast-forward
 README.md | 5 +++++
 1 file changed, 5 insertions(+)
```

### `git fetch` の出力例

```text
$ git fetch
remote: Enumerating objects: 8, done.
remote: Counting objects: 100% (8/8), done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 6 (delta 2), reused 6 (delta 2), pack-reused 0
Unpacking objects: 100% (6/6), done.
From https://github.com/username/my-project
   a1b2c3d..e4f5g6h  main       -> origin/main
 * [new branch]      feature/api -> origin/feature/api
```

### `git branch -a` の出力例

```text
$ git branch -a
* main
  feature/login
  remotes/origin/main
  remotes/origin/feature/login
  remotes/origin/feature/api
```

---

## よくある間違い

### 1. `pull` と `fetch` の違いが分からない

```bash
# fetch: リモートの情報をダウンロードするだけ
git fetch origin
# → ローカルのファイルは変わらない
# → origin/main が更新される

# pull: fetch + merge を一度に行う
git pull origin main
# → ローカルのファイルが更新される
# → コンフリクトが起きる可能性がある
```

**おすすめ**: まず `git fetch` で確認してから `git merge` する方が安全です。

```bash
# 安全な方法
git fetch origin
git log main..origin/main  # 差分を確認
git merge origin/main       # 問題なければマージ
```

### 2. 上流ブランチを設定し忘れる

```bash
# NG: 上流ブランチ未設定で push
$ git push
fatal: The current branch feature/login has no upstream branch.
To push the current branch and set the remote as upstream, use
    git push --set-upstream origin feature/login

# OK: -u（--set-upstream）で上流ブランチを設定
$ git push -u origin feature/login
```

### 3. リモートに存在しないブランチを pull する

```bash
# NG: リモートにないブランチを指定
$ git pull origin feature/nonexistent
fatal: Couldn't find remote ref feature/nonexistent
```

**対処法**: `git branch -r` でリモートブランチの一覧を確認する。

### 4. push する前に pull し忘れる

```bash
# NG: リモートに新しいコミットがある状態で push
$ git push
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'origin'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally.
```

**対処法**: `git pull` してから `git push` する。

```bash
git pull origin main
# コンフリクトがあれば解決
git push origin main
```

---

## 実用例

### 新規プロジェクトをリモートに公開する

```bash
# 1. ローカルでプロジェクトを作成
mkdir my-project && cd my-project
git init
echo "# My Project" > README.md
git add README.md
git commit -m "最初のコミット"

# 2. GitHub でリポジトリを作成（ブラウザで操作）

# 3. リモートを追加してプッシュ
git remote add origin https://github.com/username/my-project.git
git branch -M main
git push -u origin main
```

### 既存のリモートリポジトリから始める

```bash
# 1. リポジトリをクローン
git clone https://github.com/username/existing-project.git
cd existing-project

# 2. リモートは自動的に設定される
git remote -v
# origin  https://github.com/username/existing-project.git (fetch)
# origin  https://github.com/username/existing-project.git (push)

# 3. 開発開始
git switch -c feature/my-feature
# （開発作業）
git add .
git commit -m "新機能を追加"
git push -u origin feature/my-feature
```

### チーム開発の日常フロー

```bash
# 朝: リモートの最新を取得
git switch main
git pull origin main

# 開発: feature ブランチで作業
git switch -c feature/daily-task
# （開発作業）
git add .
git commit -m "今日のタスクを完了"
git push -u origin feature/daily-task

# 夕方: main の変更を取り込む
git switch main
git pull origin main
git switch feature/daily-task
git merge main
```

### トラッキングブランチの確認と設定

```bash
# 各ブランチのトラッキング状態を確認
git branch -vv

# 出力例:
#   feature/login  3f2a1b0 [origin/feature/login] ログイン追加
# * main           7b6a5c4 [origin/main] 初期セットアップ
#   feature/local  a1b2c3d ローカル専用（トラッキングなし）
```

---

## 実習

### 課題1: リモートリポジトリへの push

1. ローカルリポジトリを作成し、3つのコミットを行う
2. GitHub で新しいリポジトリを作成する（README は追加しない）
3. `git remote add origin` でリモートを登録する
4. `git push -u origin main` でプッシュする
5. GitHub でコミット履歴が反映されていることを確認する

### 課題2: pull と fetch の違いを体験する

1. GitHub のWeb画面で `README.md` を直接編集・コミットする
2. ローカルで `git fetch origin` を実行する
3. `git log main..origin/main` で差分を確認する
4. `git merge origin/main` でローカルに反映する
5. 上記の操作が `git pull` と同じ結果になることを確認する

### 課題3: feature ブランチをリモートにプッシュする

1. ローカルで `feature/practice` ブランチを作成する
2. ファイルを追加してコミットする
3. `git push -u origin feature/practice` でプッシュする
4. GitHub で新しいブランチが表示されていることを確認する
5. `git push origin --delete feature/practice` でリモートブランチを削除する
6. GitHub でブランチが消えていることを確認する
