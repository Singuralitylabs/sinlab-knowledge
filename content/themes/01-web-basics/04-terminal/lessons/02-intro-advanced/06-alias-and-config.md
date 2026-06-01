---
title: "エイリアスとシェル設定ファイル"
order: 6
type: detail
difficulty: intermediate
tags: [terminal, alias, config, reference]
estimatedMinutes: 6
status: published
---
# エイリアスとシェル設定ファイル

## 解説

毎回同じ長いコマンドを打つのは面倒です。**エイリアス**（alias＝別名）を使うと、よく打つコマンドに短い名前をつけられます。そして、その設定を**シェルの設定ファイル**に書いておけば、ターミナルを開くたびに自動で有効になります。

これがターミナルを「自分専用の道具」に育てる第一歩です。

---

## エイリアス

### その場でエイリアスを定義する

```bash
alias ll="ls -la"            # ll と打つだけで ls -la が動く
alias gs="git status"        # gs で git status
alias gl="git log --oneline" # gl で1行ログ

# 定義したエイリアスを使う
ll
gs
```

```bash
alias                # 定義済みのエイリアス一覧を表示
unalias ll           # エイリアスを解除する
```

> **補足**：`alias` でその場で定義したものは、`export` と同じく**ターミナルを閉じると消えます**。次回も使いたいなら、後述の設定ファイルに書きます。

---

## シェルの設定ファイル

ターミナルを開いたときに自動で読み込まれる設定ファイルがあります。ここにエイリアスや環境変数を書いておけば、毎回自動で有効になります。使っているシェルによってファイル名が違います。

| シェル | 設定ファイル | 確認方法 |
|--------|--------------|----------|
| zsh（macOS の標準） | `~/.zshrc` | `echo $SHELL` が `/bin/zsh` |
| bash（Linux / Git Bash） | `~/.bashrc` | `echo $SHELL` が `/bin/bash` |

> **zsh と bash の違い**：どちらも基本的なコマンドや `alias`・`export` の書き方は共通です。設定ファイル名（`.zshrc` か `.bashrc` か）と、プロンプトの記号（`%` か `$` か）が主な違い、という程度に捉えておけば、入門段階では十分です。

### 設定ファイルに書く例

`~/.zshrc`（zsh の場合）に、次のような行を追記します。

```bash
# よく使うエイリアス
alias ll="ls -la"
alias gs="git status"
alias ..="cd .."

# 環境変数
export EDITOR="code"
export PATH="$HOME/bin:$PATH"
```

### 変更を反映する（source）

設定ファイルを編集しても、すでに開いているターミナルには自動では反映されません。`source` コマンドで読み込み直すか、ターミナルを開き直します。

```bash
source ~/.zshrc      # 設定ファイルを今すぐ読み込み直す
# または、ターミナルを一度閉じて開き直す
```

---

## コマンドサンプル

```bash
# 設定ファイルの中身を確認する
cat ~/.zshrc

# 設定ファイルにエイリアスを追記する（>> で追記）
echo 'alias ll="ls -la"' >> ~/.zshrc

# 反映する
source ~/.zshrc

# 反映されたか確認
alias ll
ll
```

> [!CAUTION]
> 設定ファイルを編集するときは `>>`（追記）を使い、`>`（上書き）は使わないでください。`>` を使うと、これまでの設定がすべて消えてしまいます。心配なら、編集前に `cp ~/.zshrc ~/.zshrc.bak` でバックアップを取っておくと安心です。

---

## 実行結果

```text
$ alias ll="ls -la"
$ ll
total 8
drwxr-xr-x  5 taro  staff  160  6  1 10:00 .
drwxr-xr-x  3 taro  staff   96  5 20 09:00 ..
-rw-r--r--  1 taro  staff  220  6  1 09:30 README.md

$ echo 'alias gs="git status"' >> ~/.zshrc
$ source ~/.zshrc
$ gs
On branch main
nothing to commit, working tree clean
```

---

## よくある間違い

### 1. 設定ファイルを編集したのに反映されない

```bash
# .zshrc を編集したが、ll がまだ使えない
# → 開いているターミナルには自動反映されない

source ~/.zshrc      # ✅ 読み込み直すか、ターミナルを開き直す
```

### 2. `>` で設定ファイルを上書きしてしまう

```bash
# ❌ これまでの設定がすべて消える
echo 'alias ll="ls -la"' > ~/.zshrc

# ✅ 追記は >>
echo 'alias ll="ls -la"' >> ~/.zshrc
```

### 3. 自分のシェルと違う設定ファイルを編集する

```bash
# zsh を使っているのに .bashrc を編集しても反映されない
echo $SHELL          # まず自分のシェルを確認
# /bin/zsh なら ~/.zshrc を、 /bin/bash なら ~/.bashrc を編集する
```

### 4. エイリアス名を既存コマンドと同じにして混乱する

```bash
# ls を別の意味に上書きすると、後で自分が混乱する
alias ls="ls -la"    # 動くが、ls の素の挙動を忘れがち。別名（ll など）にするのが無難
```

---

## 実用例

### よく使う操作をまとめて短縮する

`~/.zshrc` に書いておくと便利なエイリアスの例:

```bash
alias ll="ls -la"            # 詳細一覧
alias ..="cd .."             # 1つ上へ
alias ...="cd ../.."         # 2つ上へ
alias gs="git status"        # Git の状態確認
alias gl="git log --oneline --graph"
alias serve="npm run dev"    # 開発サーバ起動
```

### 既定のエディタを設定する

```bash
# git commit などでエディタが開くとき、VS Code を使う
export EDITOR="code --wait"
```

---

## 実習

### 課題1：その場でエイリアスを作る

1. `alias ll="ls -la"` を定義してください
2. `ll` を実行し、`ls -la` と同じ結果になることを確認してください
3. `alias` で一覧を表示し、`ll` が登録されていることを確認してください

### 課題2：設定ファイルに永続化する

1. `cat ~/.zshrc`（bash なら `~/.bashrc`）で現在の中身を確認してください
2. `echo 'alias ll="ls -la"' >> ~/.zshrc` で追記してください（`>>` を使うこと！）
3. `source ~/.zshrc` で反映し、新しいターミナルでも `ll` が使えることを確認してください

### 課題3：自分の環境を調べる

1. `echo $SHELL` で自分のシェルを確認してください
2. 自分のシェルに対応する設定ファイル（`.zshrc` or `.bashrc`）がどれか答えてください
3. そのファイルに、自分がよく使いそうなエイリアスを1つ追加してみてください
