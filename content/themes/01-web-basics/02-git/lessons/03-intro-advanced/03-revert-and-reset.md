---
title: "コミット履歴の操作"
order: 3
type: detail
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# コミット履歴の操作

## 解説

Gitでは、過去のコミット履歴を検索・閲覧するだけでなく、変更の取り消しや修正を行うこともできます。ただし、履歴の書き換えにはリスクが伴うため、各コマンドの影響範囲を正確に理解することが重要です。

### HEAD とは

`HEAD` は「現在チェックアウトしているコミット」を指すポインタです。通常はブランチの先頭を指しています。

```text
HEAD → main → コミットC

コミットA ← コミットB ← コミットC (HEAD, main)
                          ↑
                      今ここにいる
```

### HEAD からの相対参照

| 表記 | 意味 |
|------|------|
| `HEAD` | 現在のコミット |
| `HEAD~1` または `HEAD~` | 1つ前のコミット |
| `HEAD~2` | 2つ前のコミット |
| `HEAD~3` | 3つ前のコミット |
| `HEAD^` | 1つ前の親コミット（マージの場合に使い分ける） |

### reset と revert の違い

これはGit初学者が最も混乱しやすいポイントの1つです。

```text
【git reset】履歴を巻き戻す（履歴そのものを変更する）

コミットA ← コミットB ← コミットC (HEAD)
                ↑
          git reset --hard HEAD~1 で
          ここまで巻き戻る（コミットCは消える）

コミットA ← コミットB (HEAD)


【git revert】打ち消すコミットを新しく作る（履歴は残る）

コミットA ← コミットB ← コミットC ← コミットD (HEAD)
                                      ↑
                              コミットCを打ち消す
                              新しいコミットが追加される
```

| 項目 | git reset | git revert |
|------|-----------|------------|
| 履歴 | 書き換わる（コミットが消える） | 残る（新しいコミットが追加） |
| 安全性 | 危険（共有済みの履歴を壊す可能性） | 安全（既存の履歴を変更しない） |
| 用途 | ローカルの作業を戻したいとき | 公開済みの変更を取り消したいとき |
| チームワーク | プッシュ前のみ使用 | プッシュ後でも安全に使用可能 |

---

## コマンドサンプル

### git log の高度な検索

```bash
# 特定の著者のコミットを検索
git log --author="Taro"

# 日付で絞り込み
git log --since="2024-01-01"
git log --since="2 weeks ago"
git log --after="2024-01-01" --before="2024-03-31"

# コミットメッセージで検索
git log --grep="バグ修正"
git log --grep="fix" -i  # 大文字小文字を区別しない

# 変更内容に特定の文字列を含むコミットを検索
git log -S "function login"

# 変更のパッチ（差分）を表示
git log -p -2  # 最新2件の差分を表示

# 特定のファイルの変更履歴
git log -- src/app.js
git log --follow -- src/app.js  # リネームも追跡
```

### git reset — コミットの巻き戻し

```bash
# --soft: コミットだけ取り消し（変更はステージングに残る）
git reset --soft HEAD~1

# --mixed（デフォルト）: コミットとステージングを取り消し（変更は作業ディレクトリに残る）
git reset HEAD~1
git reset --mixed HEAD~1

# --hard: コミット・ステージング・作業ディレクトリの変更をすべて破棄
git reset --hard HEAD~1

# 特定のコミットまで戻る
git reset --soft abc1234

# ステージングだけ取り消す（コミットは変更しない）
git reset HEAD file.txt
```

### git reset の3モード比較

```bash
# 現在の状態：
# コミット履歴: A → B → C (HEAD)
# ファイルに変更あり

# --soft: コミットCを取り消し、変更はステージングに残る
git reset --soft HEAD~1
# 結果: A → B (HEAD), ステージングにCの変更が残っている

# --mixed: コミットCを取り消し、変更は作業ディレクトリに残る
git reset HEAD~1
# 結果: A → B (HEAD), 作業ディレクトリにCの変更が残っている

# --hard: コミットCを取り消し、変更もすべて破棄
git reset --hard HEAD~1
# 結果: A → B (HEAD), すべてクリーン（Cの変更は完全に消える）
```

### git revert — 安全な取り消し

```bash
# 直前のコミットを打ち消す
git revert HEAD

# 特定のコミットを打ち消す
git revert abc1234

# コミットメッセージのエディタを開かずに実行
git revert --no-edit HEAD

# revert をステージングだけして、コミットは自分で行う
git revert --no-commit abc1234
```

### git commit --amend — 直前のコミットの修正

```bash
# コミットメッセージだけ修正
git commit --amend -m "正しいコミットメッセージ"

# ファイルを追加し忘れた場合
git add forgotten-file.txt
git commit --amend --no-edit  # メッセージはそのまま
```

---

## 実行結果

### git reset --soft の結果

```text
$ git log --oneline -3
c3d4e5f (HEAD -> main) フッターを追加
b2c3d4e ヘッダーを修正
a1b2c3d 初期コミット

$ git reset --soft HEAD~1

$ git log --oneline -3
b2c3d4e (HEAD -> main) ヘッダーを修正
a1b2c3d 初期コミット

$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   footer.html

# → コミットは消えたが、変更はステージングに残っている
```

### git revert の結果

```text
$ git log --oneline -3
c3d4e5f (HEAD -> main) フッターを追加
b2c3d4e ヘッダーを修正
a1b2c3d 初期コミット

$ git revert --no-edit HEAD
[main d4e5f6a] Revert "フッターを追加"
 1 file changed, 0 insertions(+), 5 deletions(-)
 delete mode 100644 footer.html

$ git log --oneline -4
d4e5f6a (HEAD -> main) Revert "フッターを追加"
c3d4e5f フッターを追加
b2c3d4e ヘッダーを修正
a1b2c3d 初期コミット

# → 元のコミットは残り、打ち消すコミットが新しく追加された
```

### git commit --amend の結果

```text
$ git log --oneline -1
c3d4e5f (HEAD -> main) フッタを追加

# タイポを修正（「フッタ」→「フッター」）
$ git commit --amend -m "フッターを追加"
[main e5f6a7b] フッターを追加
 Date: Mon Jan 15 15:00:00 2024 +0900
 1 file changed, 5 insertions(+)

$ git log --oneline -1
e5f6a7b (HEAD -> main) フッターを追加

# → コミットハッシュが変わっている（新しいコミットに置き換わった）
```

---

## よくある間違い

### 1. git reset --hard を安易に使う

```text
⚠️ 警告：git reset --hard は変更を完全に破棄します

❌ 「とりあえず戻したい」で --hard を使う
   → 作業中のコードが永久に失われる可能性がある

✅ まず --soft または --mixed を試す
   → 変更が作業ディレクトリに残るので安全

✅ 不安な場合は先に git stash で退避する
   git stash
   git reset --hard HEAD~1
   # 問題があれば git stash pop で復元
```

### 2. プッシュ済みのコミットに reset を使う

```bash
# ❌ 共有リポジトリにプッシュ済みのコミットを reset
git reset --hard HEAD~3
git push --force  # チームメンバーの作業が壊れる！

# ✅ プッシュ済みのコミットは revert を使う
git revert HEAD~2..HEAD  # 最新3つのコミットを打ち消す
git push                 # 安全にプッシュできる
```

### 3. git commit --amend をプッシュ後に使う

```text
❌ プッシュ済みのコミットを amend する
   → コミットハッシュが変わるため、他の人の履歴と矛盾する

✅ amend はプッシュ前のローカルコミットにのみ使う
✅ プッシュ後にメッセージを修正したい場合は、新しいコミットで説明を追加する
```

### 4. HEAD~1 と HEAD^1 の違いを知らない

```text
通常のコミットでは HEAD~ と HEAD^ は同じ結果になります。
違いが出るのはマージコミットの場合です。

HEAD~1 → 最初の親（メインライン）を1つ遡る
HEAD^1 → 最初の親を参照
HEAD^2 → 2番目の親（マージされたブランチ側）を参照

初心者のうちは HEAD~N を使えば十分です。
```

---

## 実用例

### コミットメッセージの修正

```bash
# 直前のコミットメッセージにタイポがあった
git log --oneline -1
# a1b2c3d ログインン機能を追加

git commit --amend -m "ログイン機能を追加"
# → メッセージが修正される（プッシュ前のみ！）
```

### ファイルの追加漏れを修正

```bash
# コミットした後に、ファイルを追加し忘れたことに気づいた
git add forgotten-file.js
git commit --amend --no-edit
# → 直前のコミットにファイルが追加される（プッシュ前のみ！）
```

### 直前のコミットを取り消して作り直す

```bash
# コミットの内容を見直したい場合
git reset --soft HEAD~1
# → 変更がステージングに戻る

# 内容を修正してから再コミット
git diff --staged  # 変更内容を確認
# （必要に応じて修正）
git commit -m "修正後のコミットメッセージ"
```

### 特定のコミットで導入されたバグを取り消す

```bash
# どのコミットがバグを導入したか特定
git log --oneline
# d4e5f6a バグのあるコミット
# c3d4e5f 正常なコミット

# そのコミットを revert
git revert d4e5f6a
# → バグが取り消される（履歴も残る）
```

### 間違って reset --hard してしまった場合の復旧

```bash
# reflog でコミットを探す（Gitの操作履歴）
git reflog
# e5f6a7b HEAD@{0}: reset: moving to HEAD~1
# c3d4e5f HEAD@{1}: commit: フッターを追加
# b2c3d4e HEAD@{2}: commit: ヘッダーを修正

# 失われたコミットを復元
git reset --hard c3d4e5f
# → コミットが復元される！

# ※ reflog は通常90日間保持される
```

---

## 実習

### 課題1：git reset の3モードを体験する

以下の手順で3つのモードの違いを確認してください。

```bash
# 準備：3つのコミットを作る
echo "ファイル1" > file1.txt && git add . && git commit -m "コミット1"
echo "ファイル2" > file2.txt && git add . && git commit -m "コミット2"
echo "ファイル3" > file3.txt && git add . && git commit -m "コミット3"
git log --oneline
```

1. `git reset --soft HEAD~1` を実行し、`git status` と `git log --oneline` を確認
2. コミットし直してから `git reset --mixed HEAD~1` を実行し、同様に確認
3. コミットし直してから `git reset --hard HEAD~1` を実行し、同様に確認
4. 3つのモードの違いを自分の言葉で説明してみましょう

### 課題2：git revert を使う

1. 3つのコミットを作成してください
2. 2番目のコミットを `git revert` で打ち消してください
3. `git log --oneline` で履歴を確認してください
4. revert コミットが追加されていることを確認してください

### 課題3：git commit --amend を使う

1. 意図的にタイポ入りのメッセージでコミットしてください
2. `git commit --amend` でメッセージを修正してください
3. ファイルを1つ追加し忘れた状態をシミュレートし、`--amend` で追加してください

### 課題4：git log の高度な検索を試す

以下のコマンドをそれぞれ試してみてください。

```bash
git log --author="あなたの名前"
git log --since="1 week ago"
git log --grep="追加"
git log -p -1
git log --oneline --graph --all
```

各コマンドの出力の違いを確認し、どんな場面で使うか考えてみましょう。
