---
title: "ブランチの基本"
order: 6
type: detail
difficulty: beginner
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# ブランチの基本

## 解説

ブランチ（branch）とは、開発の流れを**分岐させる機能**です。「枝」を意味する名前の通り、メインの開発ラインから枝分かれして、独立した作業空間を作ることができます。

### なぜブランチを使うのか

- **並行開発**：複数の機能を同時に開発できる
- **安全な実験**：メインのコードを壊さずに新しいアイデアを試せる
- **チーム開発**：メンバーごとに独立した作業スペースを持てる
- **リリース管理**：本番用・開発用・修正用を分けて管理できる

### ブランチの仕組み

Gitのブランチは、特定のコミットを指す「ポインタ」にすぎません。そのため、ブランチの作成・切り替えは非常に高速です。

```text
          feature
            |
    A---B---C
   /
D---E---F---G  ← main
```

上の図では、`main` ブランチから `feature` ブランチが分岐しています。それぞれ独立してコミットを積み重ねることができます。

---

## コマンドサンプル

### ブランチの一覧を表示する

```bash
# ローカルブランチの一覧
git branch

# リモートブランチも含めた一覧
git branch -a

# 各ブランチの最新コミットも表示
git branch -v
```

### ブランチを作成する

```bash
# 新しいブランチを作成（切り替えはしない）
git branch feature/login

# ブランチを作成して切り替える（推奨）
git switch -c feature/login

# 従来の方法（checkout を使う場合）
git checkout -b feature/login
```

### ブランチを切り替える

```bash
# ブランチの切り替え（推奨：Git 2.23以降）
git switch feature/login

# 従来の方法
git checkout feature/login
```

### ブランチを削除する

```bash
# マージ済みのブランチを削除
git branch -d feature/login

# マージしていないブランチを強制削除
git branch -D feature/login
```

### ブランチの履歴をグラフで表示する

```bash
# ブランチの分岐をグラフで確認
git log --graph --oneline --all
```

---

## 実行結果

### `git branch` の出力例

```text
$ git branch
  feature/login
  feature/signup
* main
```

`*` がついているのが、現在チェックアウトしているブランチです。

### `git switch -c` の出力例

```text
$ git switch -c feature/login
Switched to a new branch 'feature/login'
```

### `git log --graph --oneline --all` の出力例

```text
$ git log --graph --oneline --all
* 3f2a1b0 (feature/login) ログインフォームを追加
* a1b2c3d ユーザーモデルを作成
| * 9e8d7c6 (feature/signup) 登録ページのデザイン
| * 5f4e3d2 バリデーション追加
|/
* 7b6a5c4 (HEAD -> main) 初期セットアップ
* 1a2b3c4 プロジェクト作成
```

### `git branch -d` の出力例

```text
$ git branch -d feature/login
Deleted branch feature/login (was 3f2a1b0).
```

---

## よくある間違い

### 1. 変更を保存せずにブランチを切り替える

```bash
# NG: 未コミットの変更があるのに切り替えようとする
$ git switch feature/login
error: Your local changes to the following files would be overwritten by checkout:
        index.html
Please commit your changes or stash them before you switch branches.
```

**対処法**: 切り替え前に `git stash` で一時退避するか、`git commit` で保存する。

### 2. 削除できないブランチ

```bash
# NG: 現在いるブランチは削除できない
$ git branch -d main
error: Cannot delete branch 'main' checked out at '/path/to/repo'
```

**対処法**: 別のブランチに切り替えてから削除する。

### 3. ブランチ名にスペースを使う

```bash
# NG: スペースを含むブランチ名
git branch my new branch

# OK: ハイフンやスラッシュで区切る
git branch feature/my-new-branch
```

### 4. `git checkout` と `git switch` の混同

`git checkout` はブランチ切り替え以外にもファイル復元などに使えるため、意図しない操作をしてしまうことがあります。Git 2.23以降では、ブランチ操作には `git switch` を使いましょう。

---

## 実用例

### ブランチの命名規則

チーム開発では、ブランチ名に規則を設けるのが一般的です。

```text
feature/   ← 新機能の開発
  feature/user-authentication
  feature/shopping-cart

bugfix/    ← バグ修正
  bugfix/login-error
  bugfix/header-layout

hotfix/    ← 緊急修正（本番環境）
  hotfix/security-patch
  hotfix/crash-fix

release/   ← リリース準備
  release/v1.0.0
  release/v2.1.0
```

### 一般的な開発フロー

```bash
# 1. main ブランチを最新にする
git switch main
git pull origin main

# 2. 新しい機能用のブランチを作成
git switch -c feature/user-profile

# 3. 開発作業を行い、コミットする
# （ファイルを編集）
git add .
git commit -m "ユーザープロフィール画面を追加"

# 4. さらに開発を続ける
# （ファイルを編集）
git add .
git commit -m "プロフィール画像のアップロード機能を追加"

# 5. 完成したら main にマージするために切り替え
git switch main
git merge feature/user-profile

# 6. 不要になったブランチを削除
git branch -d feature/user-profile
```

---

## 実習

### 課題1: ブランチの作成と切り替え

以下の手順を実行してみましょう。

1. 新しいリポジトリを作成し、最初のコミットを行う
2. `feature/hello` ブランチを作成して切り替える
3. `hello.txt` ファイルを作成してコミットする
4. `main` ブランチに戻る
5. `hello.txt` が存在しないことを確認する
6. `feature/hello` に再度切り替えて、ファイルが戻ることを確認する

```bash
# リポジトリの作成
mkdir branch-practice && cd branch-practice
git init
echo "# ブランチ練習" > README.md
git add README.md
git commit -m "最初のコミット"

# ここから自分で試してみましょう！
# ヒント: git switch -c, echo, git add, git commit, git switch
```

### 課題2: ブランチの一覧と削除

1. `feature/a`、`feature/b`、`feature/c` の3つのブランチを作成する
2. `git branch` で一覧を確認する
3. `feature/b` を削除する
4. 再度 `git branch` で一覧を確認し、削除されたことを確認する

### 課題3: グラフでブランチを可視化

1. `main` ブランチで2つコミットする
2. `feature/x` ブランチを作成してコミットする
3. `main` に戻ってもう1つコミットする
4. `git log --graph --oneline --all` で分岐を確認する
