---
title: "シェルスクリプト入門"
order: 1
type: detail
difficulty: intermediate
tags: [terminal, shell-script, bash, automation, reference]
estimatedMinutes: 10
status: published
---
# シェルスクリプト入門

## 解説

**シェルスクリプト**とは、ターミナルで打つコマンドを**ファイルにまとめて、順番に実行**できるようにしたものです。毎回手で打っていた一連の操作を、ファイル1つで再現できます。

たとえば「フォルダを作る → 依存をインストールする → ビルドする」を毎回手作業でやる代わりに、それをスクリプトに書いておけば、`./setup.sh` の一発で済みます。プロジェクトのセットアップ・バックアップ・デプロイなど、**繰り返す作業の自動化**がシェルスクリプトの主な用途です。

### スクリプトの基本形

```bash
#!/bin/bash
# 上の行は「シバン」。このスクリプトを bash で動かすという宣言

echo "Hello, Shell Script!"
```

- 1行目の `#!/bin/bash` は **シバン（shebang）** と呼ばれ、「どのプログラムで実行するか」を指定します。
- `#` から始まる行は**コメント**（実行されないメモ）です。

### 作成から実行までの流れ

```bash
# 1. ファイルを作る（拡張子は .sh が慣習）
touch hello.sh

# 2. 内容を書く（エディタや echo で）
# 3. 実行権限を付ける（応用編の chmod を参照）
chmod +x hello.sh

# 4. 実行する
./hello.sh
```

> [!NOTE]
> スクリプトを実行するには**実行権限**が必要です。`permission denied` になったら `chmod +x ファイル名` を実行してください（応用編「ファイルの権限と chmod」参照）。`bash hello.sh` のように bash に直接渡せば、実行権限なしでも動かせます。

---

## 変数

値を変数に入れて使い回せます。代入時は `=` の前後にスペースを入れず、参照時は `$` をつけます。

```bash
#!/bin/bash
name="Taro"
greeting="Hello"

echo "$greeting, $name!"        # Hello, Taro!
echo "今日のフォルダ: $(pwd)"     # $(...) でコマンドの結果を埋め込む
```

- `"$name"` のように **ダブルクォートで囲む**のが安全（スペースを含む値でも壊れない）。
- `$(コマンド)` は**コマンド置換**で、コマンドの実行結果を文字列として埋め込みます。

### 引数を受け取る

スクリプトに渡した引数は `$1`・`$2`… で参照できます（`$0` はスクリプト名）。

```bash
#!/bin/bash
echo "1番目の引数: $1"
echo "2番目の引数: $2"
```

```bash
./greet.sh Alice Bob   # $1=Alice, $2=Bob
```

---

## 条件分岐（if）

```bash
#!/bin/bash
if [ -f "config.txt" ]; then
  echo "設定ファイルがあります"
else
  echo "設定ファイルがありません"
fi
```

`[ ... ]` の中が条件です。よく使う判定:

| 条件 | 意味 |
|------|------|
| `[ -f ファイル ]` | ファイルが存在する |
| `[ -d フォルダ ]` | フォルダが存在する |
| `[ -z "$x" ]` | 変数が空 |
| `[ "$a" = "$b" ]` | 文字列が等しい |
| `[ "$n" -gt 10 ]` | 数値が10より大きい（`-gt`/`-lt`/`-eq`） |

---

## 繰り返し（for）

```bash
#!/bin/bash
# リストを順に処理
for name in Alice Bob Carol; do
  echo "Hello, $name"
done

# ファイルを順に処理
for file in *.txt; do
  echo "処理中: $file"
done
```

---

## 実行結果

```text
$ cat backup.sh
#!/bin/bash
target="$1"
if [ -d "$target" ]; then
  cp -r "$target" "${target}-backup"
  echo "$target をバックアップしました"
else
  echo "フォルダが見つかりません: $target"
fi

$ chmod +x backup.sh
$ ./backup.sh my-project
my-project をバックアップしました

$ ./backup.sh notfound
フォルダが見つかりません: notfound
```

---

## よくある間違い

### 1. `=` の前後にスペースを入れる

```bash
# ❌ スペースがあると代入と認識されずエラー
name = "Taro"

# ✅ スペースなし
name="Taro"
```

ただし `if [ ... ]` の比較では、逆に `[` や `]` の前後・演算子の前後にスペースが**必要**です（`[ "$a" = "$b" ]`）。

### 2. 変数をクォートせずスペースで壊れる

```bash
file="my file.txt"
rm $file        # ❌ "my" と "file.txt" の2つとして扱われる
rm "$file"      # ✅ クォートで1つの引数として渡る
```

### 3. 実行権限を付け忘れる

```bash
./deploy.sh
# → permission denied
chmod +x deploy.sh   # ✅ 実行権限を付ける
```

### 4. Windows の改行コードで動かない

Windows で作ったスクリプトは改行コードが `CRLF` になり、`bad interpreter` 等のエラーが出ることがあります。エディタ（VS Code 右下）で改行コードを **LF** に変えると解決します。

---

## 実用例

### プロジェクトのセットアップを自動化する

```bash
#!/bin/bash
# setup.sh — 開発環境を一発で用意する
set -e   # エラーが出たら途中で止める（安全策）

echo "📦 セットアップを開始します"
mkdir -p src dist logs
npm install
echo "✅ 完了しました"
```

`set -e` は「途中でコマンドが失敗したら、それ以降を実行せず止める」指定で、安全なスクリプトの定番です。

### 複数ファイルを一括リネームする

```bash
#!/bin/bash
# .txt を .md にまとめて変える
for file in *.txt; do
  mv "$file" "${file%.txt}.md"
done
```

`${file%.txt}` は「末尾の `.txt` を取り除く」という変数操作です。

---

## 実習

### 課題1：はじめてのスクリプト

1. `hello.sh` を作り、1行目に `#!/bin/bash`、2行目に `echo "Hello!"` を書いてください
2. `chmod +x hello.sh` で実行権限を付けてください
3. `./hello.sh` で実行し、`Hello!` と表示されることを確認してください

### 課題2：引数と変数を使う

1. 引数で受け取った名前にあいさつするスクリプト `greet.sh` を作ってください（`echo "Hello, $1!"`）
2. `./greet.sh あなたの名前` を実行し、結果を確認してください

### 課題3：条件分岐と繰り返し

1. カレントディレクトリの `.txt` ファイルを `for` で1つずつ表示するスクリプトを書いてください
2. `if [ -f "README.md" ]` を使い、README があるかどうかでメッセージを出し分けるスクリプトを書いてください
3. `set -e` を先頭付近に入れると挙動がどう変わるか調べてみましょう
