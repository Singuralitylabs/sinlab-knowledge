---
title: "GitHubへの公開鍵の登録"
order: 3
type: detail
difficulty: beginner
tags: [ssh, github, git]
estimatedMinutes: 6
status: published
---
# GitHubへの公開鍵の登録

## 解説

生成した**公開鍵**をGitHubアカウントに登録すると、それ以降はパスワードやトークンを入力せずに `git push` / `git pull` ができるようになります。手順は大きく分けて「公開鍵をコピーする」「GitHubの設定画面で登録する」「接続テストする」の3ステップです。

```text
[ ローカルPC ]                              [ GitHub ]
  cat ~/.ssh/id_ed25519.pub  ───(コピー)───>  Settings > SSH and GPG keys > New SSH key
```

登録が完了すると、GitHub側は「この公開鍵に対応する秘密鍵を持っている人」からのアクセスを、あなたのアカウントとして認識するようになります。

---

## コマンドサンプル

```bash
# 1. 公開鍵の中身をターミナルに表示する
cat ~/.ssh/id_ed25519.pub

# macOS の場合、クリップボードに直接コピーすることもできる
pbcopy < ~/.ssh/id_ed25519.pub

# Linux (xclipがある場合)
xclip -sel clip < ~/.ssh/id_ed25519.pub

# 2. 登録後、接続テストを行う
ssh -T git@github.com

# 3. どの鍵が使われているか詳しく確認したい場合（デバッグ用）
ssh -vT git@github.com
```

GitHubの設定画面では、以下の項目を入力します。

1. GitHubにログインし、右上のプロフィールアイコンから **Settings** を選択
2. 左メニューの **SSH and GPG keys** をクリック
3. **New SSH key** ボタンをクリック
4. **Title**（鍵識別用の名前。例: `MacBook Pro 2026`）と **Key**（コピーした公開鍵の文字列）を入力
5. **Add SSH key** を押して完了

---

## 実行結果

```text
$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP1k... your_email@example.com

$ ssh -T git@github.com
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

「Hi username! ...」というメッセージが表示されれば、公開鍵の登録と接続設定は成功です。`git clone` や `git push` を試す前に、まずこのコマンドで疎通確認をする習慣をつけましょう。

---

## よくある間違い

### 1. 公開鍵の文字列を一部だけコピーしてしまう

```text
❌ 改行や末尾のコメント部分（メールアドレス）を欠落させてコピーする
   → GitHub側が「不正な形式のキーです」というエラーを返す

✅ `ssh-ed25519` から始まり、末尾のコメントまで、1行全体をコピーする
```

### 2. 秘密鍵を登録しようとする

```text
❌ 誤って `id_ed25519`（拡張子なし・秘密鍵）の中身を貼り付ける

✅ 必ず `id_ed25519.pub`（拡張子 .pub・公開鍵）を貼り付ける
```

### 3. 接続テストをせずにいきなり push する

```bash
# ❌ 設定した直後にいきなり本番のpushを試して原因切り分けが難しくなる
$ git push origin main
Permission denied (publickey).

# ✅ まず ssh -T で疎通確認してから、Git操作を行う
$ ssh -T git@github.com
$ git push origin main
```

### 4. `Permission denied (publickey)` が出て焦る

```text
【よくある原因】
1. 公開鍵の登録がまだ完了していない、または反映に時間がかかっている
2. 複数の鍵がある環境で、意図した秘密鍵が使われていない
3. 秘密鍵ファイルの権限が正しくない（600 であるべき）

【切り分け方法】
$ ssh -vT git@github.com
# ログの "Offering public key" 部分で、どの鍵が使われようとしているか確認する
```

---

## 実用例

### クローン時にHTTPSではなくSSHのURLを使う

GitHubのリポジトリページで **Code** ボタンを押すと、HTTPSとSSHのURLを切り替えられます。SSH設定が完了していれば、以降はこちらを使うと認証の手間がなくなります。

```bash
# SSH形式のURLでクローン（設定済みなら認証を求められない）
git clone git@github.com:user/repo.git
```

### 既存リポジトリのリモートURLをSSHに切り替える

```bash
# 現在のリモートURLを確認
git remote -v

# HTTPSからSSHへ切り替える
git remote set-url origin git@github.com:user/repo.git

# 切り替え後に確認
git remote -v
```

---

## 実習

### 課題1：公開鍵をコピーして登録する

1. `cat ~/.ssh/id_ed25519.pub` で公開鍵の中身を表示してください
2. GitHubの **Settings > SSH and GPG keys > New SSH key** から登録してください（Titleには自分のPC名などをつけましょう）

### 課題2：接続テストを行う

1. `ssh -T git@github.com` を実行し、ウェルカムメッセージが表示されることを確認してください
2. うまくいかない場合は `ssh -vT git@github.com` を実行し、ログのどこで失敗しているか確認してください

### 課題3：リモートURLをSSHに切り替える

1. 手元にある任意のGitリポジトリで `git remote -v` を実行し、現在のURLがHTTPSかSSHか確認してください
2. HTTPSだった場合、`git remote set-url origin git@github.com:<user>/<repo>.git` でSSH形式に切り替えてください
3. 切り替え後、`git fetch` を実行してパスワード入力なしで通信できることを確認してください
