---
title: "リダイレクト（標準入出力と >・>>・2>）"
order: 1
type: detail
difficulty: intermediate
tags: [terminal, redirect, reference]
estimatedMinutes: 7
status: published
---
# リダイレクト（標準入出力と >・>>・2>）

## 解説

コマンドの実行結果は、ふだん画面（ターミナル）に表示されます。この**出力の行き先を変える**のが「**リダイレクト**」です。結果をファイルに保存したり、ログとして書き足したりできます。

### 標準入出力という考え方

リダイレクトを理解するには、コマンドが持つ3つの「流れ」を知っておくと役立ちます。

| 名前 | 略称 | 番号 | 役割 |
|------|------|------|------|
| 標準入力 | stdin | 0 | コマンドへの入力（通常はキーボード） |
| 標準出力 | stdout | 1 | コマンドの実行結果（通常は画面） |
| 標準エラー出力 | stderr | 2 | エラーメッセージ（通常は画面） |

ポイントは、**実行結果（stdout）とエラー（stderr）は別の流れ**だということです。だからこそ、「結果はファイルに、エラーは画面に」といった振り分けができます。

---

## コマンドサンプル

### > — ファイルへ出力（上書き）

```bash
ls > files.txt           # ls の結果を files.txt に書き出す（既存内容は上書き）
echo "Hello" > hello.txt # 文字列をファイルに書き込む
date > timestamp.txt     # 現在時刻をファイルに保存
```

> [!CAUTION]
> `>` は対象ファイルの中身を**まるごと上書き**します。既存のファイルに `>` すると、それまでの内容は消えます。中身を残したまま書き足したいときは、次の `>>` を使ってください。

### >> — ファイルへ追記

```bash
echo "1行目" > log.txt    # 新規作成（または上書き）
echo "2行目" >> log.txt   # 末尾に追記
echo "3行目" >> log.txt   # さらに追記
```

### 2> — エラー出力をリダイレクト

```bash
ls /not-exist 2> error.txt    # エラーメッセージだけをファイルへ
ls /not-exist 2> /dev/null    # エラーを捨てる（/dev/null は「何もない場所」）
```

### まとめてリダイレクト

```bash
command > out.txt 2> err.txt  # 結果は out.txt、エラーは err.txt へ
command > all.txt 2>&1        # 結果もエラーも all.txt へまとめる
command &> all.txt            # 上と同じ（bash の短縮形）
```

`2>&1` は「stderr（2）を stdout（1）と同じ場所へ流す」という意味の定番表現です。

---

## 実行結果

```text
$ ls
index.html  style.css

$ ls > files.txt
$ cat files.txt
index.html
style.css

$ echo "追記する行" >> files.txt
$ cat files.txt
index.html
style.css
追記する行

$ ls /not-exist 2> error.txt
$ cat error.txt
ls: /not-exist: No such file or directory
```

---

## よくある間違い

### 1. `>` で大事なファイルを上書きしてしまう

```bash
# ❌ 既存の設定ファイルに > すると、元の中身が消える
echo "新しい行" > config.txt   # config.txt の中身がこの1行だけになる

# ✅ 追記したいなら >>
echo "新しい行" >> config.txt
```

`>` は上書き、`>>` は追記。1文字違いで結果が大きく変わるので注意しましょう。

### 2. リダイレクトしたのに画面にエラーが残る

```bash
# > は標準出力（結果）だけをリダイレクトする。エラーは画面に残る
ls /not-exist > out.txt
# → エラーメッセージは画面に表示されたまま

# エラーも捕まえたいなら 2> や 2>&1
ls /not-exist > out.txt 2>&1
```

「結果」と「エラー」は別の流れ、という標準入出力の考え方を思い出してください。

### 3. リダイレクト先のファイルを同時に入力にも使う

```bash
# ❌ 同じファイルを入力と出力に同時指定すると、中身が壊れることがある
sort data.txt > data.txt

# ✅ 別名のファイルに出してから差し替える
sort data.txt > data-sorted.txt
mv data-sorted.txt data.txt
```

---

## 実用例

### コマンドの結果をログに残す

```bash
# 実行日時つきでログを蓄積していく
echo "=== $(date) ===" >> deploy.log
npm run build >> deploy.log 2>&1
```

### 出力をファイルにして、あとでエディタや別コマンドで使う

```bash
# インストール済みパッケージの一覧をファイルに保存
npm list > packages.txt

# プロジェクト内のファイル一覧を保存して共有
ls -la > file-list.txt
```

### エラーだけを別ファイルに分けて調べる

```bash
npm run test > result.txt 2> errors.txt
cat errors.txt    # 失敗の原因だけを集中して確認できる
```

---

## 実習

### 課題1：> と >> の違いを確かめる

1. `echo "1回目" > test.txt` を実行し、`cat test.txt` で中身を確認してください
2. もう一度 `echo "2回目" > test.txt` を実行し、`cat` で中身がどうなったか確認してください（上書きされる）
3. 次に `echo "3回目" >> test.txt` を実行し、`cat` で中身がどう変わったか確認してください（追記される）

### 課題2：エラー出力をリダイレクトする

1. `ls /存在しないパス` を実行し、画面にエラーが出ることを確認してください
2. `ls /存在しないパス 2> err.txt` を実行し、画面にはエラーが出ず、`cat err.txt` でファイルに記録されていることを確認してください

### 課題3：結果とエラーをまとめる

1. `ls . /not-exist` を実行し、結果（カレントの一覧）とエラー（not-exist）が両方出ることを確認してください
2. `ls . /not-exist > all.txt 2>&1` を実行し、`cat all.txt` で両方がファイルに入っていることを確認してください
