---
title: "インストールと初期設定"
order: 2
type: detail
difficulty: beginner
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# インストールと初期設定

## 解説

Gitを使い始めるには、まずお使いのOSにGitをインストールし、ユーザー情報などの初期設定を行う必要があります。初期設定は最初に一度だけ行えば、以降のすべてのリポジトリに適用されます。

Gitの設定には3つのレベルがあります。

| レベル | 対象範囲 | 設定ファイルの場所 | オプション |
|--------|----------|-------------------|-----------|
| **system** | すべてのユーザー | `/etc/gitconfig` | `--system` |
| **global** | 現在のユーザー | `~/.gitconfig` | `--global` |
| **local** | 現在のリポジトリ | `.git/config` | `--local` |

優先順位は `local > global > system` です。リポジトリごとに異なる設定を使いたい場合は `--local` で上書きできます。

---

## コマンドサンプル

### Gitのインストール

#### macOS

```bash
# Homebrewを使ったインストール（推奨）
brew install git

# Xcode Command Line Toolsに含まれるGitを使う場合
xcode-select --install
```

#### Windows

```bash
# wingetを使ったインストール
winget install --id Git.Git -e --source winget

# または Git for Windows を公式サイトからダウンロード
# https://gitforwindows.org/
```

#### Linux（Ubuntu / Debian）

```bash
# aptを使ったインストール
sudo apt update
sudo apt install git
```

#### Linux（CentOS / Fedora）

```bash
# dnfを使ったインストール
sudo dnf install git

# yumを使ったインストール（古いバージョン）
sudo yum install git
```

### インストールの確認

```bash
# バージョン確認
git --version
```

### ユーザー情報の設定

```bash
# ユーザー名の設定（コミットに記録される名前）
git config --global user.name "Taro Yamada"

# メールアドレスの設定（コミットに記録されるメール）
git config --global user.email "taro@example.com"
```

### エディタとデフォルトブランチの設定

```bash
# デフォルトエディタの設定（VS Code）
git config --global core.editor "code --wait"

# デフォルトエディタの設定（Vim）
git config --global core.editor "vim"

# デフォルトエディタの設定（nano）
git config --global core.editor "nano"

# デフォルトブランチ名の設定（main を推奨）
git config --global init.defaultBranch main
```

### その他の便利な設定

```bash
# 日本語ファイル名の文字化け防止
git config --global core.quotepath false

# 改行コードの自動変換（macOS / Linux）
git config --global core.autocrlf input

# 改行コードの自動変換（Windows）
git config --global core.autocrlf true

# カラー出力の有効化
git config --global color.ui auto
```

### 設定の確認

```bash
# すべての設定を一覧表示
git config --list

# 特定の設定値を確認
git config user.name
git config user.email

# 設定がどのファイルで定義されているか確認
git config --list --show-origin
```

### SSH鍵の設定

```bash
# SSH鍵の生成（Ed25519 推奨）
ssh-keygen -t ed25519 -C "taro@example.com"

# 鍵が生成されたか確認
ls ~/.ssh/

# 公開鍵の内容を表示（GitHubに登録する）
cat ~/.ssh/id_ed25519.pub

# SSH接続のテスト（GitHub）
ssh -T git@github.com
```

---

## 実行結果

```text
$ git --version
git version 2.43.0

$ git config --global user.name "Taro Yamada"
$ git config --global user.email "taro@example.com"
$ git config --global init.defaultBranch main

$ git config --list
user.name=Taro Yamada
user.email=taro@example.com
init.defaultbranch=main
core.editor=code --wait
core.quotepath=false
color.ui=auto

$ git config --list --show-origin
file:/Users/taro/.gitconfig     user.name=Taro Yamada
file:/Users/taro/.gitconfig     user.email=taro@example.com
file:/Users/taro/.gitconfig     init.defaultbranch=main
file:/Users/taro/.gitconfig     core.editor=code --wait

$ ssh-keygen -t ed25519 -C "taro@example.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/taro/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/taro/.ssh/id_ed25519
Your public key has been saved in /Users/taro/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX taro@example.com

$ ssh -T git@github.com
Hi taro-yamada! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## よくある間違い

### 1. ユーザー情報を設定し忘れる

```text
$ git commit -m "最初のコミット"
Author identity unknown

*** Please tell me who you are.

Run
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

❌ ユーザー名とメールアドレスを設定していないとコミットできない
✅ 最初に git config --global で設定しておく
```

### 2. --global を付け忘れる

```bash
# ❌ --global なしだと、そのリポジトリだけに設定される
git config user.name "Taro Yamada"

# ✅ --global を付けると、すべてのリポジトリに適用される
git config --global user.name "Taro Yamada"
```

### 3. メールアドレスをGitHubと一致させない

```text
❌ Gitのメールアドレスが GitHub のアカウントと異なると、
   コミットがGitHub上であなたのアカウントに紐づかない

✅ GitHubの Settings > Emails で確認できるアドレスを使う
   プライバシー保護用のnoreplyアドレスも利用可能：
   git config --global user.email "12345678+taro@users.noreply.github.com"
```

### 4. SSH鍵のパーミッションが正しくない

```bash
# ❌ パーミッションが緩すぎるとSSH接続が拒否される
# Permissions 0644 for '/Users/taro/.ssh/id_ed25519' are too open.

# ✅ 秘密鍵のパーミッションを正しく設定
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

---

## 実用例

### 仕事用と個人用で設定を分ける

```bash
# グローバル設定（個人プロジェクト用）
git config --global user.name "Taro Yamada"
git config --global user.email "taro@personal.com"

# 仕事用リポジトリでローカル設定を上書き
cd ~/work/company-project
git config --local user.name "Taro Yamada"
git config --local user.email "taro.yamada@company.co.jp"
```

### .gitconfig の直接編集

`~/.gitconfig` ファイルを直接編集することもできます。

```ini
[user]
    name = Taro Yamada
    email = taro@example.com
[core]
    editor = code --wait
    quotepath = false
    autocrlf = input
[init]
    defaultBranch = main
[color]
    ui = auto
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --all
```

### エイリアス（ショートカット）の設定

```bash
# よく使うコマンドを短縮形で登録
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"

# 使用例
git st      # git status と同じ
git co main # git checkout main と同じ
git lg      # 見やすいログ表示
```

---

## 実習

### 課題1：Gitをインストールして確認する

1. お使いのOSに合った方法でGitをインストールしてください
2. `git --version` でバージョンが表示されることを確認してください

### 課題2：ユーザー情報を設定する

以下のコマンドで自分の情報を設定しましょう。

```bash
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"
git config --global init.defaultBranch main
git config --global core.quotepath false
```

設定後、`git config --list` で正しく設定されたか確認してください。

### 課題3：SSH鍵を生成してGitHubに登録する

1. `ssh-keygen -t ed25519 -C "あなたのメールアドレス"` で鍵を生成
2. `cat ~/.ssh/id_ed25519.pub` で公開鍵を表示
3. GitHubの Settings > SSH and GPG keys > New SSH key で登録
4. `ssh -T git@github.com` で接続テスト

### 課題4：エイリアスを設定する

よく使うコマンドのエイリアスを2つ以上設定してみましょう。設定後、実際にエイリアスを使ってコマンドを実行してみてください。
