---
title: "Git設定とエイリアス"
order: 31
type: reference
category: ouyou
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# Git設定とエイリアス

## 解説

Gitは豊富な設定オプションを持っており、自分の作業スタイルに合わせてカスタマイズできます。特に**エイリアス（ショートカット）**を活用すれば、日常的なGit操作を大幅に効率化できます。

### 設定の3つのレベル

Gitの設定には3つのレベルがあり、より狭い範囲の設定が優先されます。

| レベル | 適用範囲 | ファイルの場所 | コマンドオプション |
|--------|----------|----------------|-------------------|
| system | PC全体の全ユーザー | `/etc/gitconfig` | `--system` |
| global | 現在のユーザーの全リポジトリ | `~/.gitconfig` | `--global` |
| local | 現在のリポジトリのみ | `.git/config` | `--local` |

---

## コマンドサンプル

### 基本設定の確認と変更

```bash
# 現在の設定をすべて表示
git config --list

# 特定の設定値を確認
git config user.name

# グローバル設定ファイルを直接編集
git config --global --edit
```

### よく使う基本設定

```bash
# ユーザー情報
git config --global user.name "あなたの名前"
git config --global user.email "your.email@example.com"

# デフォルトブランチ名
git config --global init.defaultBranch main

# デフォルトエディタ（VSCodeの場合）
git config --global core.editor "code --wait"

# 日本語ファイル名の正しい表示
git config --global core.quotepath false

# カラー表示の有効化
git config --global color.ui auto

# プッシュ時に自動でリモートブランチを追跡
git config --global push.autoSetupRemote true

# 改行コードの自動変換
# macOS / Linux
git config --global core.autocrlf input
# Windows
git config --global core.autocrlf true
```

### エイリアスの設定

```bash
# ステータスの短縮
git config --global alias.st status

# ブランチの短縮
git config --global alias.br branch

# チェックアウトの短縮
git config --global alias.co checkout

# スイッチの短縮
git config --global alias.sw switch

# コミットの短縮
git config --global alias.cm "commit -m"

# 差分の短縮
git config --global alias.df diff

# 見やすいログ表示
git config --global alias.lg "log --oneline --graph --all --decorate"

# 直近のコミット情報を表示
git config --global alias.last "log -1 HEAD"

# ステージングの取り消し
git config --global alias.unstage "reset HEAD --"

# 変更の破棄
git config --global alias.discard "checkout --"
```

---

## 実行結果

### エイリアス使用前後の比較

```text
# エイリアス使用前
$ git log --oneline --graph --all --decorate
* 3a2f1c8 (HEAD -> main) READMEを更新
| * b7e4d2a (feature/login) ログインフォームを追加
|/
* 1e8c3b5 初期コミット

# エイリアス使用後（同じ結果）
$ git lg
* 3a2f1c8 (HEAD -> main) READMEを更新
| * b7e4d2a (feature/login) ログインフォームを追加
|/
* 1e8c3b5 初期コミット
```

### .gitconfig ファイルの内容例

```text
$ cat ~/.gitconfig
[user]
    name = あなたの名前
    email = your.email@example.com
[core]
    editor = code --wait
    quotepath = false
    autocrlf = input
[init]
    defaultBranch = main
[color]
    ui = auto
[push]
    autoSetupRemote = true
[alias]
    st = status
    br = branch
    co = checkout
    sw = switch
    cm = commit -m
    df = diff
    lg = log --oneline --graph --all --decorate
    last = log -1 HEAD
    unstage = reset HEAD --
```

---

## よくある間違い

### 1. エイリアスの定義にgitを含めてしまう

```bash
# 間違い: "git" を含めてしまう
git config --global alias.st "git status"

# 正しい: "git" は不要
git config --global alias.st status
```

エイリアスは `git` コマンドの後ろの部分を置き換えるものなので、定義に `git` は不要です。

### 2. ローカル設定とグローバル設定の混同

```bash
# グローバル設定を確認したつもりがローカルを見ている
git config user.name          # ローカルが優先される

# 明示的にレベルを指定して確認
git config --global user.name  # グローバル設定を確認
git config --local user.name   # ローカル設定を確認
```

### 3. 設定の削除方法を知らない

```bash
# 設定を削除する
git config --global --unset alias.st

# セクションごと削除する
git config --global --remove-section alias
```

---

## 実用例

### Git Hooks（フック）の活用

Git Hooksは、特定のGit操作の前後に自動でスクリプトを実行する仕組みです。

```bash
# pre-commit フックの例（コミット前にリンターを実行）
#!/bin/sh
npm run lint
if [ $? -ne 0 ]; then
  echo "リンターエラーがあります。修正してからコミットしてください。"
  exit 1
fi
```

主なフックの種類:

| フック名 | 実行タイミング | 用途 |
|----------|--------------|------|
| `pre-commit` | コミット前 | リント、フォーマットチェック |
| `commit-msg` | コミットメッセージ入力後 | メッセージ形式の検証 |
| `pre-push` | プッシュ前 | テストの実行 |
| `post-merge` | マージ後 | 依存パッケージの更新 |

### 便利なGitツール

| ツール | 説明 |
|--------|------|
| `tig` | ターミナルベースのGitビューア |
| `lazygit` | ターミナルのGit GUI |
| `git-extras` | 便利なGitサブコマンド集 |
| `gh` | GitHub公式CLIツール |

```bash
# tig のインストールと使用
brew install tig
tig

# lazygit のインストールと使用
brew install lazygit
lazygit

# GitHub CLI のインストール
brew install gh
gh auth login
```

---

## 実習

以下の練習問題に取り組んでみましょう。

### 課題1: エイリアスを設定しよう

以下のエイリアスを設定し、実際に使ってみましょう。

1. `git st` → `git status`
2. `git cm "メッセージ"` → `git commit -m "メッセージ"`
3. `git lg` → `git log --oneline --graph --all`

### 課題2: .gitconfig を確認しよう

1. `git config --global --edit` でグローバル設定ファイルを開きましょう
2. 設定されている内容を確認しましょう
3. `git config --list --show-origin` で各設定がどのファイルから来ているか確認しましょう

### 課題3: Git Hookを試そう

1. 適当なリポジトリで `pre-commit` フックを作成しましょう
2. コミット前に `echo "コミット前チェック実行中..."` と表示されるようにしましょう
3. 実際にコミットして、フックが実行されることを確認しましょう

```bash
# ヒント
echo '#!/bin/sh
echo "コミット前チェック実行中..."' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```
