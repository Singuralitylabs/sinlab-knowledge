---
title: "マージの基本"
order: 14
type: reference
category: kiso
difficulty: beginner
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# マージの基本

## 解説

マージ（merge）とは、あるブランチの変更を別のブランチに**統合する操作**です。ブランチで開発した機能が完成したら、マージによって `main` ブランチに取り込みます。

### マージの種類

Gitのマージには主に2つの方式があります。

#### 1. Fast-forward マージ

分岐後に `main` ブランチに新しいコミットがない場合、ポインタを進めるだけでマージが完了します。マージコミットは作られません。

```text
【マージ前】
main:     A---B
                \
feature:         C---D

【Fast-forward マージ後】
main:     A---B---C---D  ← main のポインタが D に移動
```

#### 2. 3-way マージ（再帰マージ）

分岐後に `main` にも新しいコミットがある場合、両方の変更を統合する**マージコミット**が作られます。

```text
【マージ前】
main:     A---B---E---F
                \
feature:         C---D

【3-way マージ後】
main:     A---B---E---F---M  ← マージコミット
                \       /
feature:         C---D
```

マージコミット `M` は、親コミットを2つ持つ特殊なコミットです。

---

## コマンドサンプル

### 基本的なマージ

```bash
# 1. マージ先のブランチに切り替える
git switch main

# 2. マージを実行する
git merge feature/login
```

### Fast-forward マージを強制的にマージコミットにする

```bash
# --no-ff: Fast-forward でもマージコミットを作成する
git merge --no-ff feature/login
```

### マージコミットのメッセージを指定する

```bash
# -m オプションでメッセージを指定
git merge --no-ff -m "feature/login をマージ: ログイン機能の追加" feature/login
```

### マージを中止する

```bash
# コンフリクトが発生した場合などにマージを中止
git merge --abort
```

### マージ済みブランチの確認

```bash
# main にマージ済みのブランチを一覧表示
git branch --merged

# まだマージされていないブランチを一覧表示
git branch --no-merged
```

---

## 実行結果

### Fast-forward マージの出力例

```text
$ git switch main
Switched to branch 'main'

$ git merge feature/login
Updating 7b6a5c4..3f2a1b0
Fast-forward
 login.html | 25 +++++++++++++++++++++++++
 style.css   |  8 ++++++++
 2 files changed, 33 insertions(+)
 create mode 100644 login.html
```

`Fast-forward` と表示されているのがポイントです。マージコミットは作られません。

### 3-way マージの出力例

```text
$ git merge feature/signup
Merge made by the 'ort' strategy.
 signup.html | 30 ++++++++++++++++++++++++++++++
 validate.js |  15 +++++++++++++++
 2 files changed, 45 insertions(+)
 create mode 100644 signup.html
 create mode 100644 validate.js
```

`Merge made by the 'ort' strategy.` と表示されると、マージコミットが作成されています。

### `--no-ff` マージの出力例

```text
$ git merge --no-ff feature/login
Merge made by the 'ort' strategy.
 login.html | 25 +++++++++++++++++++++++++
 1 file changed, 25 insertions(+)
```

### マージ後のログ表示

```text
$ git log --graph --oneline
*   5a4b3c2 (HEAD -> main) Merge branch 'feature/signup'
|\
| * 9e8d7c6 登録バリデーション追加
| * 5f4e3d2 登録ページ作成
|/
* 3f2a1b0 ログインフォームを追加
* 7b6a5c4 初期セットアップ
```

---

## よくある間違い

### 1. マージ先とマージ元を間違える

```bash
# NG: feature ブランチにいる状態で main をマージ
$ git switch feature/login
$ git merge main
# → main の変更が feature に取り込まれてしまう

# OK: main にいる状態で feature をマージ
$ git switch main
$ git merge feature/login
```

**ポイント**: `git merge` は「今いるブランチ」に「指定したブランチ」を取り込む操作です。

### 2. マージ前に変更をコミットし忘れる

```bash
# NG: 未コミットの変更がある状態でマージ
$ git merge feature/login
error: Your local changes would be overwritten by merge.
```

**対処法**: マージ前に `git stash` または `git commit` する。

### 3. Fast-forward と --no-ff の違いを理解していない

Fast-forward マージではブランチの履歴が残りません。チーム開発では `--no-ff` を使って「どのブランチでどの機能を開発したか」が分かるようにすることが推奨されます。

```bash
# Fast-forward: 履歴が一直線になる
* 3f2a1b0 ログインフォームを追加
* 7b6a5c4 初期セットアップ

# --no-ff: ブランチの形がわかる
*   5a4b3c2 Merge branch 'feature/login'
|\
| * 3f2a1b0 ログインフォームを追加
|/
* 7b6a5c4 初期セットアップ
```

### 4. マージ後にブランチを削除し忘れる

マージが完了したブランチはこまめに削除しましょう。不要なブランチが残ると混乱の原因になります。

```bash
git branch --merged       # マージ済みブランチを確認
git branch -d feature/login  # 削除
```

---

## 実用例

### チーム開発での典型的なマージフロー

```bash
# 1. 最新の main を取得
git switch main
git pull origin main

# 2. 機能ブランチで開発
git switch feature/user-settings

# 3. main の最新変更を feature に取り込む（競合を早期発見）
git merge main

# 4. 開発が完了したら main にマージ
git switch main
git merge --no-ff feature/user-settings

# 5. リモートにプッシュ
git push origin main

# 6. ブランチを削除
git branch -d feature/user-settings
```

### Fast-forward と --no-ff の使い分け

| 場面 | 推奨方法 | 理由 |
|------|----------|------|
| 個人開発・小さな修正 | Fast-forward | 履歴をシンプルに保てる |
| チーム開発 | `--no-ff` | 機能単位の履歴が残る |
| リリースブランチ | `--no-ff` | リリース内容が明確になる |
| hotfix | Fast-forward | 迅速に修正を反映できる |

---

## 実習

### 課題1: Fast-forward マージを体験する

1. リポジトリを作成し、`main` で最初のコミットを行う
2. `feature/greeting` ブランチを作成して切り替える
3. `greeting.txt` を作成してコミットする
4. `main` に戻り、`git merge feature/greeting` を実行する
5. `git log --graph --oneline` で履歴を確認する

```bash
mkdir merge-practice && cd merge-practice
git init
echo "# マージ練習" > README.md
git add README.md
git commit -m "最初のコミット"

# ここから自分で試してみましょう！
```

### 課題2: --no-ff マージを体験する

1. 課題1の続きで、`feature/farewell` ブランチを作成する
2. `farewell.txt` を作成してコミットする
3. `main` に戻り、`git merge --no-ff feature/farewell` を実行する
4. `git log --graph --oneline` で課題1との違いを確認する

### 課題3: 3-way マージを体験する

1. `feature/about` ブランチを作成して `about.txt` を追加・コミットする
2. `main` に戻り、`update.txt` を追加・コミットする（main にも新しいコミットを作る）
3. `git merge feature/about` を実行する
4. マージコミットが作られることを確認する
5. `git log --graph --oneline --all` で分岐と統合を視覚的に確認する
