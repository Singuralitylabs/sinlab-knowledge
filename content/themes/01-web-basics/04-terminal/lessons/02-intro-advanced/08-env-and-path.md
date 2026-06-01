---
title: "環境変数とPATH"
order: 8
type: detail
difficulty: intermediate
tags: [terminal, environment, path, reference]
estimatedMinutes: 7
status: published
---
# 環境変数とPATH

## 解説

**環境変数**は、シェルやプログラムが共通で参照する「設定値の入れ物」です。たとえば「いまのユーザーのホームはどこか」「コマンドをどこから探すか」といった情報が、環境変数として保持されています。

中でも特に重要なのが **`PATH`** です。`PATH` を理解すると、「**なぜ `git` や `node` というコマンドが、どのフォルダにいても打てるのか**」という、ターミナルの根本的な仕組みが分かります。

---

## 環境変数の基本

環境変数は `名前=値` の形で、参照するときは先頭に `$` をつけます。

```bash
echo $HOME          # ホームディレクトリのパス
echo $USER          # ログイン中のユーザー名
echo $SHELL         # 使用中のシェル
echo $PATH          # コマンドの探索先（後述）
printenv            # すべての環境変数を一覧表示
```

### 環境変数を設定する（export）

```bash
export NODE_ENV=production    # 環境変数を設定
echo $NODE_ENV                # production と表示される

export GREETING="Hello"       # 値にスペースを含むならクォート
```

> **補足**：`export` で設定した環境変数は、**そのターミナルを閉じると消えます**。次回も使いたい設定は、シェルの設定ファイル（`.zshrc` / `.bashrc`）に書いておきます（次の記事で解説します）。

---

## PATH の仕組み

`git` や `ls` といったコマンドの正体は、どこかのフォルダに置かれた**プログラム（実行ファイル）**です。シェルは、コマンドが打たれると `PATH` に登録されたフォルダを**順番に探して**、最初に見つかった実行ファイルを動かします。

```text
$PATH = /usr/local/bin : /usr/bin : /bin : ...
              ↑ コロン区切りで、探索するフォルダが並んでいる

$ git というコマンドを打つと…
  /usr/local/bin/git ある？ → あった！これを実行
```

つまり、「コマンドが見つからない（command not found）」エラーは、**そのコマンドの実行ファイルが `PATH` の中に見つからない**ことを意味します。

### コマンドの場所を調べる（which）

```bash
which git           # git の実行ファイルがどこにあるか表示
which node
which -a python     # 同名コマンドが複数あれば全部表示
```

```text
$ which git
/usr/local/bin/git
```

---

## コマンドサンプル

```bash
# PATH を見やすく改行して表示する（: を改行に置き換え）
echo $PATH | tr ':' '\n'

# PATH に新しいフォルダを追加する（先頭に足す例）
export PATH="$HOME/bin:$PATH"

# 自作スクリプトを置いたフォルダを PATH に通す例
mkdir ~/bin
export PATH="$HOME/bin:$PATH"
which my-script     # ~/bin/my-script が見つかるようになる
```

`export PATH="$HOME/bin:$PATH"` は「既存の `PATH` の**先頭**に `~/bin` を足す」という意味です。`$PATH` を末尾に残すことで、もともとの探索先を消さずに追加できます。

---

## 実行結果

```text
$ echo $HOME
/Users/taro

$ echo $PATH | tr ':' '\n'
/usr/local/bin
/usr/bin
/bin
/usr/sbin
/sbin

$ which node
/usr/local/bin/node

$ export NODE_ENV=production
$ echo $NODE_ENV
production
```

---

## よくある間違い

### 1. `=` の周りにスペースを入れる

```bash
# ❌ = の前後にスペースを入れると、コマンドとして解釈されてエラー
export NODE_ENV = production
# → command not found など

# ✅ = の前後にスペースは入れない
export NODE_ENV=production
```

### 2. PATH を上書きして既存の設定を消す

```bash
# ❌ $PATH を残さず代入すると、これまでの探索先が全部消える
export PATH="$HOME/bin"
# → ls すら command not found になり大変なことに

# ✅ 必ず $PATH を末尾（または先頭）に残して「追加」する
export PATH="$HOME/bin:$PATH"
```

うっかり上書きしてしまっても、ターミナルを開き直せば元に戻ります（その場の設定は消えるため）。慌てないでください。

### 3. 参照するとき `$` を忘れる

```bash
echo HOME       # ❌ ただの文字列 "HOME" が表示される
echo $HOME      # ✅ 変数の中身（パス）が表示される
```

設定するときは `$` なし（`export HOME=...`）、参照するときは `$` あり（`echo $HOME`）です。

---

## 実用例

### コマンドが見つからない原因を調べる

```bash
# "node: command not found" と言われたら…
which node              # 場所が表示されない → PATH に無い
echo $PATH | tr ':' '\n'  # node の置き場所が PATH に含まれているか確認
```

### ツールのインストール後に PATH を通す

Node.js のバージョン管理ツールや言語処理系をインストールすると、「`PATH` に追加してください」と案内されることがあります。これは、そのツールの実行ファイル置き場を `PATH` に登録して、コマンドとして使えるようにするための操作です。

```bash
export PATH="$HOME/.local/bin:$PATH"
which その-ツール       # 場所が表示されれば PATH 通過に成功
```

---

## 実習

### 課題1：主要な環境変数を確認する

1. `echo $HOME`・`echo $USER`・`echo $SHELL` をそれぞれ実行し、値を確認してください
2. `printenv` ですべての環境変数を一覧表示してみてください

### 課題2：PATH を観察する

1. `echo $PATH | tr ':' '\n'` を実行し、探索先フォルダを1行ずつ確認してください
2. `which ls`・`which git`・`which node` を実行し、それぞれの実行ファイルが PATH 内のどこにあるか確認してください

### 課題3：一時的な環境変数を設定する

1. `export MY_NAME="あなたの名前"` を実行してください
2. `echo $MY_NAME` で値が取り出せることを確認してください
3. 新しいターミナルを開いて `echo $MY_NAME` を実行し、**何も表示されない**（その場限りの設定だった）ことを確認してください
