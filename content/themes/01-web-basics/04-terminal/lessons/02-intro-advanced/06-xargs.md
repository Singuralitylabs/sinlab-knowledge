---
title: "xargs で出力をコマンドの引数に渡す"
order: 6
type: detail
difficulty: intermediate
tags: [terminal, xargs, pipe, reference]
estimatedMinutes: 6
status: published
---
# xargs で出力をコマンドの引数に渡す

## 解説

パイプ（`|`）は、左のコマンドの出力を右のコマンドの「**標準入力**」に渡します。ところが、`rm` や `mkdir` のように「**引数**」としてファイル名を受け取るコマンドは、標準入力をそのままでは受け取れません。

```text
ls | rm        # ❌ rm は標準入力を読まないので、何も消えない
```

この「出力（標準入力）」を「引数」に変換してくれるのが **xargs** です。

```text
何かの出力  →  | xargs  →  コマンド の引数として渡す
```

`find` や `grep` で見つけたファイル群を、まとめて別のコマンドで処理したいときに活躍します。

---

## コマンドサンプル

```bash
# find で見つけたファイルをまとめて削除
find . -name "*.tmp" | xargs rm

# ファイル一覧を引数にして長さを数える
ls *.txt | xargs wc -l

# grep で対象ファイルを探し、それらをまとめて開く・処理する
grep -rl "TODO" . | xargs ls -l

# echo で動作確認（実際に何が渡るか見える）
echo "a b c" | xargs echo "受け取った引数:"
```

### -I で渡す位置を指定する

引数を「末尾」ではなく特定の位置に差し込みたいときは `-I` を使い、プレースホルダ（慣習的に `{}`）を置きます。

```bash
# 各ファイルを backup/ にコピー（{} に1つずつ入る）
ls *.txt | xargs -I {} cp {} backup/

# 各ファイルを .bak つきでリネーム
ls *.conf | xargs -I {} mv {} {}.bak
```

### 安全に使うためのオプション

```bash
xargs -p rm          # 実行前に確認プロンプトを出す（-p）
xargs -n 1 echo      # 引数を1個ずつ渡す（-n 1）
xargs -t rm          # 実行するコマンドを表示してから実行（-t）
```

> [!CAUTION]
> 空白を含むファイル名があると、`xargs` は区切りを誤認して別ファイルとして扱い、意図しない削除につながることがあります。`find` と組み合わせるときは、両者の「ヌル区切り」オプションを使うのが安全です。
>
> ```bash
> find . -name "*.tmp" -print0 | xargs -0 rm
> ```
>
> `-print0`（find 側）と `-0`（xargs 側）をペアで使うと、空白を含む名前も正しく処理できます。

---

## 実行結果

```text
$ echo "a b c" | xargs echo "args:"
args: a b c

$ ls
note.txt  memo.txt  draft.txt

$ ls *.txt | xargs wc -l
       3 note.txt
       1 memo.txt
       5 draft.txt
       9 total

$ ls *.txt | xargs -I {} echo "処理対象: {}"
処理対象: note.txt
処理対象: memo.txt
処理対象: draft.txt
```

---

## よくある間違い

### 1. パイプだけで引数渡しできると思う

```bash
# ❌ rm は標準入力を読まないので削除されない
find . -name "*.tmp" | rm

# ✅ xargs を挟んで引数に変換する
find . -name "*.tmp" | xargs rm
```

### 2. 空白を含むファイル名で誤動作する

```bash
# "my file.txt" が "my" と "file.txt" に分割されてしまう
ls | xargs rm

# ✅ find と組み合わせてヌル区切りで安全に
find . -maxdepth 1 -type f -print0 | xargs -0 rm
```

### 3. いきなり破壊的コマンドにつなぐ

```bash
# ❌ 何が渡るか確認せずに rm につなぐのは危険
find . -name "*.log" | xargs rm

# ✅ まず echo や ls で「何が渡るか」を確認してから
find . -name "*.log" | xargs ls -l
# 問題なければ rm に変える（できれば -p で確認付き）
find . -name "*.log" -print0 | xargs -0 -p rm
```

---

## 実用例

### 検索結果をまとめて処理する

```bash
# TODO を含むファイルだけをまとめてエディタで開く
grep -rl "TODO" src | xargs code

# 一時ファイルを安全に一括削除
find . -name "*.tmp" -print0 | xargs -0 rm
```

### 一覧から一括コピー・リネーム

```bash
# .txt ファイルをすべて backup/ へコピー
mkdir -p backup
ls *.txt | xargs -I {} cp {} backup/
```

---

## 実習

### 課題1：xargs の基本を体感する

1. `echo "1 2 3 4 5" | xargs echo "受け取り:"` を実行し、引数として渡る様子を確認してください
2. `ls | xargs echo` を実行し、ファイル一覧が1行の引数列に変換されることを確認してください

### 課題2：パイプとの違いを確認する

1. 練習用フォルダで `touch a.tmp b.tmp c.tmp` を実行してください
2. `find . -name "*.tmp" | xargs ls -l` で、見つけたファイルが `ls -l` の引数として渡ることを確認してください
3. `xargs` を外して `find . -name "*.tmp" | ls -l` を実行し、**ファイルが渡らない**ことと比較してください

### 課題3：安全に一括削除する

1. `find . -name "*.tmp" -print0 | xargs -0 -p rm` を実行してください
2. 確認プロンプト（`-p`）に答えて、`.tmp` ファイルが削除されることを確認してください
