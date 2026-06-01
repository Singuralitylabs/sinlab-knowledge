---
title: "find でファイル・フォルダを探す"
order: 4
type: detail
difficulty: intermediate
tags: [terminal, find, search, reference]
estimatedMinutes: 6
status: published
---
# find でファイル・フォルダを探す

## 解説

**find** は、ファイルやフォルダ**そのもの**を、名前や種類・更新日時などの条件で探すコマンドです。`grep` が「ファイルの**中身**」を探すのに対し、`find` は「**どこに何という名前のファイルがあるか**」を探します。

| コマンド | 探すもの | 例 |
|----------|----------|-----|
| `grep` | ファイルの**中身**（文字列） | 「TODO を含む行」 |
| `find` | ファイル・フォルダ**自体** | 「`config.json` という名前のファイル」 |

深い階層のどこかにあるファイルを探すとき、フォルダを一つずつ `ls` で覗いていくのは大変です。`find` なら一発で見つけられます。

---

## コマンドサンプル

`find` の基本形は `find 検索開始フォルダ 条件` です。

```bash
find . -name "index.html"    # 現在地(.)以下から index.html を探す
find . -name "*.md"          # .md で終わるファイルをすべて探す
find ~ -name "*.log"         # ホーム以下から .log ファイルを探す
```

### 種類で絞る（-type）

```bash
find . -type f               # ファイルだけ（file）
find . -type d               # フォルダだけ（directory）
find . -type d -name "src"   # src という名前のフォルダを探す
```

### 名前の大文字小文字を無視する（-iname）

```bash
find . -iname "readme*"      # README でも readme でもヒット
```

### 見つけたファイルに対して操作する（-delete / -exec）

```bash
find . -name "*.tmp" -delete            # .tmp ファイルをまとめて削除
find . -name "*.log" -exec rm {} \;     # 見つけた各ファイルに rm を実行
```

> [!CAUTION]
> `find ... -delete` や `-exec rm` は、条件に合うファイルを**まとめて削除**します。実行前に、`-delete` を外して `find . -name "*.tmp"` だけを実行し、**何が対象になるかを必ず確認**してから消しましょう。

---

## 実行結果

```text
$ find . -name "*.md"
./README.md
./docs/guide.md
./docs/2025/note.md

$ find . -type d
.
./docs
./docs/2025
./src

$ find . -name "*.md" -type f
./README.md
./docs/guide.md
./docs/2025/note.md

$ find . -iname "readme*"
./README.md
```

---

## よくある間違い

### 1. 名前にワイルドカードを使うときクォートを忘れる

```bash
# ❌ * がシェルに展開されてしまい、意図通り動かないことがある
find . -name *.md

# ✅ パターンはクォートで囲む
find . -name "*.md"
```

`find -name` のパターンは、シェルに展開される前に `find` へ渡すため、`"*.md"` とクォートするのが安全です。

### 2. 検索開始フォルダを書き忘れる

```bash
# ❌ どこから探すか指定していない（環境によってはエラー）
find -name "*.js"

# ✅ 現在地から探すなら . を明示する
find . -name "*.js"
```

### 3. grep と find を取り違える

```bash
# 「TODO という文字を含むファイルを探したい」なら grep
grep -rn "TODO" .

# 「todo.txt という名前のファイルを探したい」なら find
find . -name "todo.txt"
```

「中身を探す」のか「名前で探す」のかで使い分けます。

---

## 実用例

### node_modules を除いて検索する

```bash
# node_modules の中まで検索すると遅いので除外する
find . -path "*/node_modules/*" -prune -o -name "*.js" -print
```

### 大量に散らばった一時ファイルを掃除する

```bash
# まず対象を確認してから
find . -name "*.tmp"
# 問題なければ削除
find . -name "*.tmp" -delete
```

### 特定の名前のフォルダを探す

```bash
find ~ -type d -name "projects"   # ホーム以下の projects フォルダを探す
```

---

## 実習

### 課題1：名前でファイルを探す

1. `mkdir -p find-practice/sub` で練習用フォルダを作ってください
2. `touch find-practice/a.txt find-practice/sub/b.txt find-practice/sub/c.md` でファイルを散らばらせてください
3. `find find-practice -name "*.txt"` で `.txt` ファイルだけを探してください

### 課題2：種類で絞る

1. `find find-practice -type f` でファイルだけを一覧してください
2. `find find-practice -type d` でフォルダだけを一覧してください
3. 表示される結果の違いを確認してください

### 課題3：grep との使い分けを意識する

1. `echo "TODO: あとで直す" > find-practice/sub/b.txt` で b.txt に文字を書き込んでください
2. 「`TODO` を含むファイル」を `grep -rn "TODO" find-practice` で探してください
3. 「`b.txt` という名前のファイル」を `find find-practice -name "b.txt"` で探してください
4. 最後に `rm -r find-practice` で後片付けをしてください（対象を確認してから！）
