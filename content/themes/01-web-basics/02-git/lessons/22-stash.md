---
title: "スタッシュ"
order: 22
type: reference
category: ouyou
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# スタッシュ

## 解説

スタッシュ（stash）とは、作業中の変更を**一時的に退避させる機能**です。「棚に一時的にしまう」イメージで、現在の作業を中断して別の作業をしたいときに使います。

### どんなときに使うのか

- **緊急のバグ修正**: 機能開発中に緊急対応が必要になった
- **ブランチの切り替え**: 未コミットの変更があるが、別のブランチに移りたい
- **一時的な退避**: コミットするほどではないが、変更を残しておきたい
- **コードレビュー**: レビュー用にクリーンな状態にしたい

### スタッシュの仕組み

スタッシュはスタック構造（後入れ先出し）で管理されます。

```text
stash@{0}: 最新のスタッシュ（最後に保存したもの）
stash@{1}: 1つ前のスタッシュ
stash@{2}: 2つ前のスタッシュ
  ...
```

スタッシュはブランチに依存しません。ブランチAでスタッシュした内容を、ブランチBで復元することも可能です。

---

## コマンドサンプル

### 変更をスタッシュに保存する

```bash
# 現在の変更をスタッシュに保存
git stash

# メッセージ付きでスタッシュ（推奨）
git stash -m "ログインフォームの途中"

# 未追跡ファイル（新規ファイル）も含めてスタッシュ
git stash -u

# .gitignore で無視されているファイルも含めてスタッシュ
git stash -a
```

### スタッシュの一覧を表示する

```bash
# スタッシュの一覧
git stash list
```

### スタッシュを復元する

```bash
# 最新のスタッシュを復元して削除（pop）
git stash pop

# 最新のスタッシュを復元するが削除しない（apply）
git stash apply

# 特定のスタッシュを復元
git stash apply stash@{2}
```

### スタッシュを削除する

```bash
# 特定のスタッシュを削除
git stash drop stash@{0}

# すべてのスタッシュを削除
git stash clear
```

### スタッシュの内容を確認する

```bash
# 最新のスタッシュの差分を表示
git stash show

# 詳細な差分を表示
git stash show -p

# 特定のスタッシュの差分を表示
git stash show -p stash@{1}
```

### スタッシュからブランチを作成する

```bash
# スタッシュの内容で新しいブランチを作成
git stash branch feature/from-stash
```

---

## 実行結果

### `git stash` の出力例

```text
$ git stash -m "ログインフォームの途中"
Saved working directory and index state On main: ログインフォームの途中
```

### `git stash list` の出力例

```text
$ git stash list
stash@{0}: On main: ログインフォームの途中
stash@{1}: On feature/signup: バリデーション作業中
stash@{2}: On main: WIP on main: 7b6a5c4 初期セットアップ
```

### `git stash pop` の出力例

```text
$ git stash pop
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   login.html
        modified:   style.css

Dropped refs/stash@{0} (a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0)
```

### `git stash show` の出力例

```text
$ git stash show
 login.html | 15 +++++++++++++++
 style.css  |  8 ++++++++
 2 files changed, 23 insertions(+)

$ git stash show -p
diff --git a/login.html b/login.html
index 1234567..abcdefg 100644
--- a/login.html
+++ b/login.html
@@ -1,3 +1,18 @@
 <html>
+<body>
+  <form id="login">
+    <input type="text" name="username">
+    <input type="password" name="password">
+    <button type="submit">ログイン</button>
+  </form>
+</body>
 </html>
```

### `git stash branch` の出力例

```text
$ git stash branch feature/from-stash
Switched to a new branch 'feature/from-stash'
On branch feature/from-stash
Changes not staged for commit:
        modified:   login.html
        modified:   style.css

Dropped refs/stash@{0} (a1b2c3d4...)
```

---

## よくある間違い

### 1. `pop` と `apply` の違いを理解していない

```bash
# pop: 復元 + スタッシュから削除
git stash pop
# → スタッシュリストから消える

# apply: 復元のみ（スタッシュは残る）
git stash apply
# → スタッシュリストに残ったまま
```

**使い分け**: 通常は `pop` を使います。同じ変更を複数のブランチに適用したい場合は `apply` を使います。

### 2. スタッシュが溜まりすぎる

```bash
$ git stash list
stash@{0}: WIP on main: ...
stash@{1}: WIP on main: ...
stash@{2}: WIP on main: ...
stash@{3}: WIP on main: ...
# → メッセージなしだと何の変更か分からなくなる
```

**対処法**: 必ず `-m` でメッセージをつける。不要なスタッシュはこまめに削除する。

```bash
# 良い例
git stash -m "ヘッダーのレスポンシブ対応作業中"
git stash -m "API認証のエラーハンドリング途中"
```

### 3. 新規ファイルがスタッシュされない

```bash
# NG: 新規ファイル（未追跡）はデフォルトではスタッシュされない
$ echo "new content" > newfile.txt
$ git stash
# → newfile.txt はスタッシュされず残ってしまう

# OK: -u オプションで未追跡ファイルも含める
$ git stash -u
```

### 4. スタッシュの復元時にコンフリクトが発生する

スタッシュした後にファイルが変更されていると、復元時にコンフリクトが起きることがあります。

```bash
$ git stash pop
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
# → コンフリクトマーカーを解決する（マージと同じ手順）
# → この場合、pop してもスタッシュは自動削除されない
```

---

## 実用例

### 緊急バグ修正のシナリオ

```bash
# 1. 機能開発中...
# （login.html を編集中）

# 2. 「本番でバグが発生！至急修正して」と連絡が来る

# 3. 作業中の変更をスタッシュ
git stash -m "ログイン機能開発中 - 途中"

# 4. main に切り替えて hotfix ブランチを作成
git switch main
git pull origin main
git switch -c hotfix/critical-bug

# 5. バグを修正してコミット・マージ
# （バグ修正作業）
git add .
git commit -m "本番のクラッシュバグを修正"
git switch main
git merge hotfix/critical-bug
git push origin main
git branch -d hotfix/critical-bug

# 6. 元の作業に戻る
git switch feature/login
git stash pop
# → 中断前の状態に戻って作業再開！
```

### 複数の変更を試すシナリオ

```bash
# パターンAを試す
# （コードを編集）
git stash -m "パターンA: CSSグリッド版"

# パターンBを試す
# （コードを編集）
git stash -m "パターンB: Flexbox版"

# パターンAを復元して比較
git stash apply stash@{1}
# （確認後、リセット）
git restore .

# パターンBを復元して比較
git stash apply stash@{0}
# （こちらが良ければ採用）
git add .
git commit -m "Flexbox版レイアウトを採用"

# 不要なスタッシュを削除
git stash clear
```

### スタッシュからブランチを作成するシナリオ

```bash
# 作業中の変更が思ったより大きくなった場合
git stash -m "大規模な変更 - ブランチにすべき"

# スタッシュの内容を新しいブランチで展開
git stash branch feature/large-refactor
# → 新しいブランチが作成され、スタッシュの内容が復元される
```

---

## 実習

### 課題1: 基本的なスタッシュ操作

1. リポジトリを作成し、最初のコミットを行う
2. ファイルを編集する（コミットしない）
3. `git stash -m "テスト"` で退避する
4. `git status` でクリーンな状態を確認する
5. `git stash list` でスタッシュを確認する
6. `git stash pop` で復元する
7. 変更が戻ったことを確認する

```bash
mkdir stash-practice && cd stash-practice
git init
echo "初期内容" > memo.txt
git add memo.txt
git commit -m "最初のコミット"

# ファイルを編集
echo "追加の内容" >> memo.txt

# ここからスタッシュ操作を試してみましょう！
```

### 課題2: 緊急バグ修正シナリオを再現する

1. `feature/new-page` ブランチで `page.html` を編集中にする
2. 変更をスタッシュして `main` に切り替える
3. `hotfix/typo` ブランチを作成して修正・コミット・マージする
4. `feature/new-page` に戻ってスタッシュを復元する
5. 作業を続けてコミットする

### 課題3: 複数のスタッシュを管理する

1. 3つの異なる変更をそれぞれメッセージ付きでスタッシュする
2. `git stash list` で一覧を確認する
3. 2番目のスタッシュ（`stash@{1}`）の内容を `git stash show -p stash@{1}` で確認する
4. 2番目のスタッシュだけを復元する
5. 残りのスタッシュを `git stash clear` で削除する
