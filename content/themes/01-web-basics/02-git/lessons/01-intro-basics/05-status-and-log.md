---
title: "変更の確認"
order: 5
type: detail
difficulty: beginner
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# 変更の確認

## 解説

Gitで効率的に作業するためには、「今どんな状態か」「何が変わったか」「これまで何をしたか」を正確に把握することが重要です。Gitには変更を確認するための複数のコマンドが用意されています。

### 確認コマンドの使い分け

| コマンド | 表示内容 | 使う場面 |
|----------|----------|----------|
| `git status` | ファイルの状態（変更・追加・削除） | 今の全体像を把握したいとき |
| `git diff` | 変更の具体的な内容（差分） | 何をどう変えたか確認したいとき |
| `git log` | コミット履歴 | 過去の変更を振り返りたいとき |
| `git show` | 特定のコミットの詳細 | 特定のコミットの内容を見たいとき |

### git diff が比較する対象

```text
                    git diff           git diff --staged
作業ディレクトリ ──────────→ ステージング ──────────────→ 最後のコミット
       │                                                    │
       └────────────── git diff HEAD ──────────────────────┘
```

| コマンド | 比較対象 |
|----------|----------|
| `git diff` | 作業ディレクトリ vs ステージングエリア |
| `git diff --staged` | ステージングエリア vs 最後のコミット |
| `git diff HEAD` | 作業ディレクトリ vs 最後のコミット |

---

## コマンドサンプル

### git status — 状態の確認

```bash
# 基本的な使い方
git status

# 短い形式で表示（コンパクト）
git status -s
git status --short

# ブランチ情報も含めた短い形式
git status -sb
```

### git diff — 差分の確認

```bash
# 作業ディレクトリの変更を表示（ステージング前の変更）
git diff

# 特定のファイルの差分だけ表示
git diff index.html

# ステージング済みの変更を表示（次のコミットに含まれる変更）
git diff --staged
git diff --cached  # --staged と同じ

# 作業ディレクトリ vs 最後のコミット（すべての変更）
git diff HEAD

# 特定のコミット間の差分
git diff abc1234 def5678

# 変更されたファイル名だけ表示
git diff --name-only

# 変更の統計情報を表示
git diff --stat

# 単語単位で差分を表示（行単位より見やすい場合がある）
git diff --word-diff
```

### git log — 履歴の確認

```bash
# 基本的なログ表示
git log

# 1行表示（コンパクト）
git log --oneline

# グラフ表示（ブランチの分岐・マージを視覚化）
git log --graph

# グラフ + 1行 + 全ブランチ（最もよく使う組み合わせ）
git log --oneline --graph --all

# 最新のN件だけ表示
git log -5
git log -n 5

# 変更内容（差分）も表示
git log -p

# 変更の統計情報を表示
git log --stat

# フォーマットをカスタマイズ
git log --pretty=format:"%h %an %ar %s"
```

### git show — コミットの詳細

```bash
# 最新のコミットの詳細を表示
git show

# 特定のコミットの詳細を表示
git show abc1234

# 特定のコミットの特定ファイルの内容を表示
git show abc1234:index.html

# コミットの情報だけ（差分なし）
git show --stat abc1234
```

---

## 実行結果

### git status の出力

```text
$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   index.html

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   style.css

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	new-feature.js

$ git status -sb
## main
M  index.html
 M style.css
?? new-feature.js
```

`git status -s` の記号の意味：

```text
記号の位置：[ステージング][作業ディレクトリ] ファイル名

M  index.html    → ステージング済みの変更あり
 M style.css     → 作業ディレクトリに未ステージングの変更あり
MM app.js        → ステージング済み + さらに未ステージングの変更あり
A  new.txt       → 新規追加（ステージング済み）
?? unknown.txt   → 未追跡ファイル
D  deleted.txt   → 削除済み（ステージング済み）
```

### git diff の出力

```text
$ git diff style.css
diff --git a/style.css b/style.css
index abc1234..def5678 100644
--- a/style.css
+++ b/style.css
@@ -1,6 +1,8 @@
 body {
-  background-color: white;
-  color: black;
+  background-color: #f5f5f5;
+  color: #333;
+  font-family: 'Noto Sans JP', sans-serif;
+  line-height: 1.8;
 }

$ git diff --stat
 style.css | 6 ++++--
 1 file changed, 4 insertions(+), 2 deletions(-)
```

### git log の出力

```text
$ git log --oneline
d4e5f6a (HEAD -> main) ナビゲーションバーを追加
b2c3d4e フッターのリンクを修正
a1b2c3d 初期コミット

$ git log --oneline --graph --all
* f7g8h9i (feature/login) ログイン画面を作成
* e6f7g8h ログインAPIを実装
| * d4e5f6a (HEAD -> main) ナビゲーションバーを追加
|/
* b2c3d4e フッターのリンクを修正
* a1b2c3d 初期コミット

$ git log --pretty=format:"%h %an %ar %s" -3
d4e5f6a Taro Yamada 2 hours ago ナビゲーションバーを追加
b2c3d4e Taro Yamada 1 day ago フッターのリンクを修正
a1b2c3d Taro Yamada 3 days ago 初期コミット
```

### git show の出力

```text
$ git show --stat d4e5f6a
commit d4e5f6a789012345678901234567890abcdef01
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 15 14:30:00 2024 +0900

    ナビゲーションバーを追加

 index.html | 15 +++++++++++++++
 style.css  |  8 ++++++++
 2 files changed, 23 insertions(+)
```

---

## よくある間違い

### 1. git diff と git diff --staged を混同する

```bash
# ❌ git add した後に git diff で確認しようとする
$ git add index.html
$ git diff          # ← 何も表示されない！

# ✅ ステージング済みの変更は --staged をつける
$ git diff --staged  # ← ステージング済みの差分が表示される
```

### 2. git log の出力が長すぎてターミナルが止まる

```text
❌ git log を実行したら大量のログが表示されてスクロールできない

✅ 対処法：
  - q キーで終了できる（lessコマンドのページャー）
  - git log -5 のように件数を制限する
  - git log --oneline でコンパクトに表示する
```

### 3. ファイルを変更したのに git diff に表示されない

```bash
# ❌ 新規ファイルは git diff に表示されない
$ echo "新しいファイル" > new.txt
$ git diff
# → 何も表示されない（未追跡ファイルは diff の対象外）

# ✅ 未追跡ファイルは git status で確認
$ git status
Untracked files:
  new.txt

# ✅ 新規ファイルの diff を見るには add してから --staged
$ git add new.txt
$ git diff --staged
```

### 4. コミットハッシュを全部入力する

```bash
# ❌ ハッシュ全体を入力する必要はない
$ git show a1b2c3d4e5f6789012345678901234567890abcd

# ✅ 先頭の数文字（通常7文字）で一意に特定できる
$ git show a1b2c3d
```

---

## 実用例

### コミット前の確認ルーティン

```bash
# 1. 全体像を把握
git status

# 2. 変更内容を確認
git diff

# 3. 問題なければステージング
git add -A

# 4. ステージング内容を最終確認
git diff --staged

# 5. コミット
git commit -m "変更内容の説明"
```

### 便利な git log のエイリアス

```bash
# 見やすいログ表示をエイリアスとして登録
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.ll "log --pretty=format:'%C(yellow)%h%C(reset) %C(green)%an%C(reset) %C(blue)%ar%C(reset) %s' -20"

# 使用例
git lg    # グラフ付きログ
git ll    # 最新20件を見やすく表示
```

### 特定の条件でログを絞り込む

```bash
# 特定の著者のコミットだけ表示
git log --author="Taro"

# 特定の期間のコミット
git log --since="2024-01-01" --until="2024-01-31"

# コミットメッセージで検索
git log --grep="バグ修正"

# 特定のファイルの変更履歴
git log -- index.html

# 特定の文字列を含む変更を検索
git log -S "function login"
```

---

## 実習

### 課題1：git status の各状態を確認する

以下の操作を行い、各段階で `git status` と `git status -s` の出力を比較してください。

```bash
# 1. 新しいファイルを作成（未追跡状態）
echo "test" > test.txt

# 2. git add（ステージング済み状態）
git add test.txt

# 3. コミット後にファイルを変更（変更あり状態）
git commit -m "テストファイルを追加"
echo "追加内容" >> test.txt
```

### 課題2：3種類の git diff を使い分ける

1. ファイルを変更して `git diff` を実行してください
2. `git add` してから `git diff --staged` を実行してください
3. さらにファイルを変更して `git diff HEAD` を実行してください
4. 3つの出力の違いを説明してみましょう

### 課題3：git log をカスタマイズする

1. `git log --oneline` と `git log` の違いを確認してください
2. `git log --graph --oneline --all` を試してください
3. `git log --pretty=format:"%h %s (%an, %ar)"` を試してください
4. 自分が見やすいと思うフォーマットのエイリアスを作成してください

### 課題4：git show でコミットを調べる

1. `git log --oneline` でコミットハッシュを確認してください
2. `git show ハッシュ` で特定のコミットの内容を確認してください
3. `git show ハッシュ:ファイル名` でそのコミット時点のファイル内容を表示してください
