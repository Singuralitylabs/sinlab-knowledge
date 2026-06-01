---
title: "grep でテキストを検索する"
order: 3
type: detail
difficulty: intermediate
tags: [terminal, grep, search, reference]
estimatedMinutes: 7
status: published
---
# grep でテキストを検索する

## 解説

**grep**（グレップ）は、ファイルの**中身**から、指定した文字列を含む行を探し出すコマンドです。「あの設定はどのファイルに書いてある？」「TODO コメントはどこに残っている？」といった場面で大活躍します。

GUI のエディタにも検索機能はありますが、`grep` は**複数のファイルやフォルダ全体を一気に**横断検索できるのが強みです。コードを読むエンジニアが最もよく使うコマンドの一つです。

> **名前の由来**：`grep` は「**g**lobally search for a **r**egular **e**xpression and **p**rint」の頭文字。正規表現で検索して表示する、という意味です。

---

## コマンドサンプル

### 基本の検索

```bash
grep "TODO" app.js          # app.js から TODO を含む行を探す
grep "import" *.js          # すべての .js ファイルから import を含む行を探す
```

### よく使うオプション

```bash
grep -i "error" log.txt     # 大文字小文字を区別しない（Error も ERROR もヒット）
grep -n "TODO" app.js       # 行番号つきで表示
grep -r "useState" src/     # フォルダ以下を再帰的に検索（recursive）
grep -rn "TODO" src/        # 再帰 + 行番号（よく使う組み合わせ）
grep -l "API_KEY" *.js      # ヒットした「ファイル名」だけを表示
grep -c "console.log" app.js # ヒットした行数を数える
grep -v "test" list.txt     # 指定文字列を含ま「ない」行を表示（反転）
```

### パイプと組み合わせる

```bash
ls -la | grep ".md"         # 一覧から .md を含む行だけ
history | grep git          # 履歴から git コマンドだけ
ps aux | grep node          # プロセスから node 関連だけ
```

### 簡単な正規表現

`grep` は正規表現（パターンで文字を表す書き方）が使えます。最初は次の3つを知っておけば十分です。

```bash
grep "^import" app.js       # ^ … 行の先頭が import で始まる行
grep ";$" app.js            # $ … 行の末尾が ; で終わる行
grep -E "cat|dog" pets.txt  # | … cat または dog（-E が必要）
```

---

## 実行結果

```text
$ grep -n "TODO" app.js
12:  // TODO: バリデーションを追加する
45:  // TODO: エラーハンドリングを実装

$ grep -rn "useState" src/
src/App.jsx:3:import { useState } from "react";
src/components/Counter.jsx:5:  const [count, setCount] = useState(0);

$ grep -i "error" log.txt
ERROR: connection failed
error: timeout
Fatal Error occurred

$ ls | grep ".md"
README.md
notes.md
```

---

## よくある間違い

### 1. フォルダを指定したのに `-r` をつけ忘れる

```bash
# ❌ grep はデフォルトではファイル向け。フォルダを渡すと警告
grep "TODO" src
# → grep: src: Is a directory

# ✅ フォルダ以下を検索するなら -r
grep -r "TODO" src
```

### 2. スペースや記号を含むパターンをクォートしない

```bash
# ❌ スペースで区切られて、2つ目以降がファイル名扱いになる
grep git commit history.txt

# ✅ パターンはクォートで囲む
grep "git commit" history.txt
```

検索したい文字列は、習慣として常にクォート（`"..."`）で囲むと安全です。

### 3. 大文字小文字の違いでヒットしない

```bash
# "Error" を探したいのに、ファイルには "ERROR" や "error" もある
grep "Error" log.txt        # Error しかヒットしない

# 大文字小文字を無視して全部拾う
grep -i "error" log.txt
```

---

## 実用例

### コードベースから特定の関数や変数を探す

```bash
# プロジェクト全体から、ある関数がどこで使われているか調べる
grep -rn "getUserData" src/

# どのファイルに API キーが書かれているか（漏洩チェック）
grep -rl "API_KEY" .
```

### ログからエラーだけ抜き出す

```bash
grep -i "error" server.log          # エラー行だけ表示
grep -i "error" server.log | wc -l  # エラーの件数を数える
```

### 設定ファイルから特定の項目を探す

```bash
grep "port" config.json     # ポート設定がどう書かれているか確認
cat .env | grep -v "^#"     # コメント行（# で始まる行）以外を表示
```

---

## 実習

### 課題1：ファイルから検索する

1. 数行のテキストファイルを作ってください（例：`printf "apple\nbanana\napricot\n" > fruits.txt`）
2. `grep "ap" fruits.txt` で `ap` を含む行を探してください
3. `grep -n "ap" fruits.txt` で行番号つきにし、表示の違いを確認してください

### 課題2：オプションを使い分ける

1. `grep -i` で大文字小文字を無視した検索を試してください（`Apple` でも `apple` がヒットすることを確認）
2. `grep -v "banana" fruits.txt` で、banana を含ま「ない」行が表示されることを確認してください
3. `grep -c "a" fruits.txt` で、ヒットした行数が数えられることを確認してください

### 課題3：パイプと組み合わせる

1. `history | grep cd` で、過去の `cd` コマンドを抽出してください
2. `ls -la | grep "^d"` を試し、`^d`（先頭が d ＝フォルダ）の行だけが出ることを確認してください
3. `grep -rn "TODO" .` を、TODO コメントのあるプロジェクトで試してみてください
