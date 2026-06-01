---
title: "テキスト処理（sed・awk）"
order: 5
type: detail
difficulty: intermediate
tags: [terminal, sed, awk, text-processing, reference]
estimatedMinutes: 8
status: published
---
# テキスト処理（sed・awk）

## 解説

`grep` が「条件に合う行を**探す**」コマンドだとすれば、**sed** と **awk** は見つけた行を**加工する**ためのコマンドです。ファイルを開いて手で書き換えなくても、置換・抽出・集計といった処理をコマンド一発で行えます。

| コマンド | 得意なこと | ざっくり言うと |
|----------|------------|----------------|
| `sed` | 文字列の置換・削除・抽出 | 一括置換（検索＆置換）の自動版 |
| `awk` | 列（フィールド）単位の抽出・集計 | 表形式テキストの処理ツール |

どちらも奥が深いコマンドですが、入門段階では「**sed で置換、awk で列を取り出す**」という代表的な使い方を押さえれば十分です。パイプ（`|`）と組み合わせて使うことが多いコマンドです。

---

## sed — 置換・抽出

`sed` の最頻出パターンは `s/置換前/置換後/` による置換です。

```bash
# ファイルの中の "cat" を "dog" に置換して表示（各行の最初の1個）
sed 's/cat/dog/' animals.txt

# 行内のすべての "cat" を置換（g = global）
sed 's/cat/dog/g' animals.txt

# 大文字小文字を無視して置換（I フラグ）
sed 's/error/OK/gI' log.txt

# 区切り文字は / 以外も使える（パスの置換で便利）
sed 's#/usr/local#/opt#g' paths.txt

# 特定の行だけ表示（-n + p）。3〜5行目を表示
sed -n '3,5p' file.txt

# パターンを含む行を削除
sed '/^#/d' config.txt        # # で始まる行（コメント）を削除
```

> [!CAUTION]
> `sed` は標準では**結果を画面に出すだけ**で、ファイル自体は変更しません。ファイルを直接書き換えるには `-i`（in-place）を使いますが、**元に戻せません**。心配なときは `-i.bak` のように指定するとバックアップ（`file.txt.bak`）が残ります。
>
> ```bash
> sed -i.bak 's/cat/dog/g' animals.txt   # 書き換え + .bak を残す
> ```

---

## awk — 列の抽出・集計

`awk` は、空白区切りのテキストを「列（フィールド）」として扱えます。各列は `$1`、`$2`… で参照し、`$0` は行全体を指します。

```bash
# 1列目だけを取り出す
awk '{ print $1 }' data.txt

# 1列目と3列目を取り出す
awk '{ print $1, $3 }' data.txt

# 区切り文字を指定する（-F）。CSV なら , 区切り
awk -F',' '{ print $2 }' data.csv

# 条件で絞る（3列目が100より大きい行の1列目）
awk '$3 > 100 { print $1 }' scores.txt

# 行番号をつけて表示（NR = 行番号）
awk '{ print NR, $0 }' file.txt

# 合計を計算する（2列目の合計）
awk '{ sum += $2 } END { print sum }' sales.txt
```

`{ ... }` の中が各行で実行され、`END { ... }` は全行を読み終えた後に1回だけ実行されます。

---

## 実行結果

```text
$ cat animals.txt
cat dog cat
bird cat

$ sed 's/cat/dog/g' animals.txt
dog dog dog
bird dog

$ cat scores.txt
alice 80 95
bob 60 70
carol 90 88

$ awk '{ print $1, $3 }' scores.txt
alice 95
bob 70
carol 88

$ awk '{ sum += $2 } END { print "合計:", sum }' scores.txt
合計: 230
```

---

## よくある間違い

### 1. sed の結果が保存されると思い込む

```bash
# ❌ 画面には置換結果が出るが、ファイルは変わっていない
sed 's/cat/dog/g' animals.txt
cat animals.txt           # → 元のまま

# ✅ ファイルを書き換えるなら -i（バックアップ推奨）
sed -i.bak 's/cat/dog/g' animals.txt
```

### 2. awk のプログラムをクォートで囲まない

```bash
# ❌ { } や $ がシェルに解釈されて誤動作する
awk { print $1 } data.txt

# ✅ シングルクォートで全体を囲む
awk '{ print $1 }' data.txt
```

`awk` のプログラムは必ずシングルクォート `'...'` で囲みます。`$1` などがシェルの変数展開と衝突するのを防げます。

### 3. 区切り文字の指定を忘れる

```bash
# CSV を空白区切りのつもりで処理してしまう
awk '{ print $2 }' data.csv      # ❌ カンマ区切りが効かず1列扱い

awk -F',' '{ print $2 }' data.csv # ✅ -F でカンマを区切りに指定
```

---

## 実用例

### ログから必要な情報だけ抜き出す

```bash
# アクセスログの1列目（IP アドレス）を集計して多い順に表示
awk '{ print $1 }' access.log | sort | uniq -c | sort -rn | head
```

これは「IP を取り出す（awk）→ 並べる（sort）→ 重複を数える（uniq -c）→ 件数で降順（sort -rn）→ 上位（head）」を組み合わせた定番パターンです。

### 設定ファイルの一括書き換え

```bash
# ポート番号 3000 を 8080 にまとめて変更（バックアップ付き）
sed -i.bak 's/3000/8080/g' config.txt
```

### コメントと空行を除いて中身だけ見る

```bash
sed '/^#/d; /^$/d' config.conf    # # で始まる行と空行を削除して表示
```

---

## 実習

### 課題1：sed で置換する

1. `printf "apple\nbanana\napple pie\n" > fruits.txt` でファイルを作ってください
2. `sed 's/apple/orange/' fruits.txt` を実行し、各行の最初の `apple` だけ置換されることを確認してください
3. `sed 's/apple/orange/g' fruits.txt` との違い（`apple pie` の扱い）を比べてください

### 課題2：awk で列を取り出す

1. `printf "alice 80\nbob 60\ncarol 90\n" > scores.txt` でファイルを作ってください
2. `awk '{ print $1 }' scores.txt` で名前だけ、`awk '{ print $2 }'` で点数だけを取り出してください
3. `awk '{ sum += $2 } END { print sum }' scores.txt` で点数の合計を計算してください

### 課題3：パイプと組み合わせる

1. `ls -l` の結果を `awk '{ print $9 }'` に渡し、ファイル名の列だけを取り出してみてください
2. `history | awk '{ print $2 }' | sort | uniq -c | sort -rn | head` を実行し、よく使っているコマンドの集計に挑戦してみてください
