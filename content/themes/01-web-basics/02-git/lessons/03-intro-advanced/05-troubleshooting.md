---
title: "トラブルシューティング"
order: 5
type: detail
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# トラブルシューティング

## 解説

Git操作で困ったときの対処法を紹介します。初心者がよく遭遇するトラブルとその解決方法を、状況別にまとめました。

### トラブル対応の基本姿勢

```text
1. まず落ち着く（Gitはほとんどの操作を取り消せる）
2. 現在の状態を確認する（git status, git log）
3. 原因を特定する
4. 安全な方法で対処する
5. 対処後に確認する
```

---

## detached HEAD状態

### 症状

```text
$ git checkout abc1234

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.
```

### 解説

```text
detached HEAD = HEAD（現在位置）がブランチではなく
特定のコミットを直接指している状態。

通常：HEAD → main → コミットC
detached：HEAD → コミットA（ブランチなし）

この状態でコミットしても、ブランチに移動すると
新しいコミットが行方不明になる危険がある。
```

### コマンドサンプル

```bash
# 現在の状態を確認
git status
# HEAD detached at abc1234

# 元のブランチに戻る（変更を捨てる場合）
git checkout main

# detached HEAD の状態で作業した内容を保存したい場合
git checkout -b my-new-branch
# 新しいブランチが作られ、コミットが安全に保存される
```

### 実行結果

```text
$ git checkout -b my-new-branch
Switched to a new branch 'my-new-branch'

$ git status
On branch my-new-branch
nothing to commit, working tree clean
```

---

## 間違ったブランチにコミットした

### 症状

```text
mainブランチで作業してコミットしてしまった！
本来はfeatureブランチで作業すべきだった。
```

### コマンドサンプル

```bash
# まだpushしていない場合

# 1. コミットを取り消す（変更は残す）
git reset --soft HEAD~1

# 2. 正しいブランチに切り替える
git checkout -b feature/correct-branch
# または既存のブランチに切り替え
# git checkout feature/correct-branch

# 3. もう一度コミット
git add .
git commit -m "feat: 正しいブランチにコミット"
```

### 複数コミットを移動する場合

```bash
# mainに3つ間違えてコミットした場合

# 1. 現在のコミットハッシュをメモ
git log --oneline -5

# 2. featureブランチを作成（現在の位置から）
git checkout -b feature/my-work

# 3. mainに戻ってコミットを取り消す
git checkout main
git reset --hard HEAD~3

# ⚠️ git reset --hard は変更を完全に消すので注意！
# featureブランチに変更が残っているか確認してから実行すること
```

---

## pushしたコミットを取り消したい

### 解説

```text
pushしたコミットは他の人が取得している可能性がある。
git reset ではなく git revert を使って「取り消しコミット」を作る。

reset  : 歴史を書き換える（pushしたものには使わない）
revert : 取り消す新しいコミットを作る（安全）
```

### コマンドサンプル

```bash
# 直前のコミットを取り消す
git revert HEAD

# 特定のコミットを取り消す
git revert abc1234

# マージコミットを取り消す
git revert -m 1 abc1234

# 複数のコミットを取り消す
git revert HEAD~3..HEAD
```

### 実行結果

```text
$ git revert HEAD

[main def5678] Revert "ログインバリデーションを追加"
 1 file changed, 5 deletions(-)

$ git log --oneline -3
def5678 Revert "ログインバリデーションを追加"
abc1234 ログインバリデーションを追加
9876543 初期コミット
```

---

## 削除したブランチを復元したい

### 解説

```text
git reflog は Git の「行動履歴」。
ブランチを削除しても、コミット自体はしばらく残っている。
reflog からコミットハッシュを見つけて復元できる。
```

### コマンドサンプル

```bash
# reflog で過去の操作を確認
git reflog

# 削除したブランチのコミットを見つけて復元
git checkout -b feature/restored abc1234
```

### 実行結果

```text
$ git reflog

abc1234 HEAD@{0}: checkout: moving from feature/login to main
def5678 HEAD@{1}: commit: ログインフォームを追加
ghi9012 HEAD@{2}: commit: バリデーションを実装
jkl3456 HEAD@{3}: checkout: moving from main to feature/login

# feature/loginの最新コミット def5678 からブランチを復元
$ git checkout -b feature/login-restored def5678
Switched to a new branch 'feature/login-restored'
```

---

## マージコンフリクトが難しい

### 解説

```text
コンフリクトが複雑すぎるとき、いくつかの戦略がある：

1. マージを中止してやり直す
2. 片方の変更を全採用する
3. ファイル単位で解決する
4. ツールを使って視覚的に解決する
```

### コマンドサンプル

```bash
# マージを中止する
git merge --abort

# リベースを中止する
git rebase --abort

# 相手の変更を全て採用する
git checkout --theirs conflicted-file.txt
git add conflicted-file.txt

# 自分の変更を全て採用する
git checkout --ours conflicted-file.txt
git add conflicted-file.txt

# マージツールを使う
git mergetool
```

### コンフリクトの読み方

```text
<<<<<<< HEAD
自分のブランチの変更内容
=======
マージしようとしている相手のブランチの変更内容
>>>>>>> feature/other-branch

解決方法：
1. 上記の3つのマーカー（<<<, ===, >>>）を全て削除する
2. 残したいコードだけを残す
3. git add で解決済みにする
4. git commit でマージを完了する
```

---

## 大きなファイルの問題

### 症状

```text
$ git push origin main

remote: error: File large-data.csv is 150.00 MB;
this exceeds GitHub's file size limit of 100.00 MB
```

### コマンドサンプル

```bash
# すでにコミットした大きなファイルを履歴から削除
git rm --cached large-data.csv
echo "large-data.csv" >> .gitignore
git commit -m "大きなファイルを除外"

# Git LFS（Large File Storage）を使う場合
git lfs install
git lfs track "*.csv"
git lfs track "*.zip"
git add .gitattributes
git commit -m "Git LFS の設定を追加"
```

### .gitignoreの活用

```text
# 大きなファイルを事前に除外する
# .gitignore に以下を追加

*.csv
*.zip
*.tar.gz
data/
*.mp4
*.psd
```

---

## SSH鍵の権限エラー

### 症状

```text
$ git push origin main

Permission denied (publickey).
fatal: Could not read from remote repository.
```

### コマンドサンプル

```bash
# SSH鍵の存在を確認
ls -la ~/.ssh/

# SSH鍵を新規作成
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSHエージェントに鍵を追加
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 公開鍵を表示（GitHubに登録する）
cat ~/.ssh/id_ed25519.pub

# SSH接続をテスト
ssh -T git@github.com
```

### 実行結果

```text
$ ssh -T git@github.com

Hi username! You've successfully authenticated, but GitHub
does not provide shell access.
```

---

## 不要なファイルの削除（git clean）

### 解説

```text
git clean はワーキングディレクトリから
追跡されていないファイル（untracked files）を削除する。
ビルド成果物や一時ファイルの掃除に便利。
```

### コマンドサンプル

```bash
# 削除されるファイルを確認（ドライラン）
git clean -n

# 追跡されていないファイルを削除
git clean -f

# ディレクトリも含めて削除
git clean -fd

# .gitignore で除外されているファイルも含めて削除
git clean -fdx

# 対話モードで選択して削除
git clean -i
```

### 実行結果

```text
$ git clean -n
Would remove temp.txt
Would remove build/
Would remove debug.log

$ git clean -fd
Removing temp.txt
Removing build/
Removing debug.log
```

---

## バグを導入したコミットを特定する（git bisect）

### 解説

```text
git bisect は二分探索でバグの原因コミットを特定する。
「このコミットは正常」「このコミットはバグあり」を繰り返すと、
Gitが自動的に原因コミットを絞り込んでくれる。
```

### コマンドサンプル

```bash
# bisect を開始
git bisect start

# 現在（バグあり）を bad に指定
git bisect bad

# 正常だったコミットを good に指定
git bisect good v1.0.0

# Gitが中間のコミットをチェックアウトする
# テストしてgood/badを判定
git bisect good  # このコミットは正常
# または
git bisect bad   # このコミットにはバグあり

# 原因コミットが特定されたら
git bisect reset  # 元のブランチに戻る
```

### 実行結果

```text
$ git bisect start
$ git bisect bad
$ git bisect good v1.0.0

Bisecting: 5 revisions left to test after this (roughly 3 steps)
[abc1234] ユーザー認証を追加

$ git bisect good

Bisecting: 2 revisions left to test after this (roughly 2 steps)
[def5678] APIエンドポイントを変更

$ git bisect bad

Bisecting: 0 revisions left to test after this (roughly 1 step)
[ghi9012] レスポンス形式を変更

$ git bisect bad

ghi9012 is the first bad commit
commit ghi9012
Author: tanaka <tanaka@example.com>
Date:   Mon Jan 15 10:30:00 2026

    レスポンス形式を変更
```

---

## よくあるエラーメッセージと対処法

| エラーメッセージ | 原因 | 対処法 |
|----------------|------|--------|
| `fatal: not a git repository` | Gitリポジトリでない場所でコマンド実行 | `git init` するか正しいディレクトリに移動 |
| `error: failed to push some refs` | リモートに新しいコミットがある | `git pull --rebase` してから `git push` |
| `CONFLICT (content)` | 同じ箇所を複数人が変更 | コンフリクトマーカーを手動で解消 |
| `fatal: refusing to merge unrelated histories` | 異なるリポジトリの履歴をマージ | `git pull origin main --allow-unrelated-histories` |
| `error: Your local changes would be overwritten` | 未コミットの変更がある | `git stash` で退避してから操作 |

---

## よくある間違い

### 1. パニックで `git reset --hard` を使う

```text
悪い例：
  焦って git reset --hard を実行
  → 未コミットの変更が完全に消える

良い例：
  まず git stash で変更を退避
  git reflog で復元できるか確認
  安全な方法（revert, reset --soft）を選ぶ
```

### 2. force pushを安易に使う

```text
悪い例：
  git push --force でリモートを上書き
  → チームメンバーの作業が消える可能性

良い例：
  git push --force-with-lease を使う
  （他の人のpushがあった場合は失敗してくれる）
  チームに事前に相談する
```

### 3. エラーメッセージを読まない

```text
悪い例：
  エラーが出たら適当にコマンドを試す
  → 状況が悪化する

良い例：
  エラーメッセージを最後まで読む
  Gitは多くの場合、対処法も表示してくれる
```

---

## 実用例

### トラブル対応の手順書

```text
何か問題が起きたら：

1. git status で現在の状態を確認
2. git log --oneline -10 で最近の履歴を確認
3. git reflog で操作履歴を確認
4. 上記の情報を元に対処法を選ぶ
5. 不安なら git stash で変更を退避してから対処
6. 対処後に git status と git log で確認
```

---

## 実習

### 課題1：detached HEADを体験しよう

1. いくつかコミットを作成する
2. `git checkout <古いコミットハッシュ>` でdetached HEAD状態にする
3. `git status` で状態を確認する
4. 新しいブランチを作って脱出する

### 課題2：git revertを試そう

1. 3つのコミットを作成する
2. 2番目のコミットを `git revert` で取り消す
3. `git log` で取り消しコミットが追加されていることを確認する

### 課題3：git bisectでバグを特定しよう

1. 10個のコミットを作成する（途中でわざとバグを入れる）
2. `git bisect` を使ってバグのあるコミットを特定する
3. 何回の判定で特定できたか確認する

### 課題4：reflogでブランチを復元しよう

1. featureブランチを作成してコミットを追加する
2. mainに戻ってfeatureブランチを削除する
3. `git reflog` からコミットハッシュを見つける
4. ブランチを復元する
