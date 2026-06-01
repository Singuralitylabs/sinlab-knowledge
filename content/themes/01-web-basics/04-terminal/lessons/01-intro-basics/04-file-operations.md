---
title: "ファイル・フォルダ操作（mkdir・touch・cp・mv・rm）"
order: 4
type: detail
difficulty: beginner
tags: [terminal, file-operations, reference]
estimatedMinutes: 8
status: published
---
# ファイル・フォルダ操作（mkdir・touch・cp・mv・rm）

## 解説

ディレクトリを移動できるようになったら、次は**ファイルやフォルダを作る・コピーする・移動する・消す**操作です。これらは GUI でいう「右クリック → 新規作成 / コピー / 名前変更 / ゴミ箱へ」に相当しますが、ターミナルなら一瞬で、しかも複数まとめて実行できます。

| コマンド | 由来 | 役割 |
|----------|------|------|
| `mkdir` | **m**a**k**e **dir**ectory | フォルダを作る |
| `touch` | （ファイルに触れる） | 空のファイルを作る |
| `cp` | **c**o**p**y | ファイル・フォルダをコピーする |
| `mv` | **m**o**v**e | 移動する／名前を変更する |
| `rm` | **r**e**m**ove | 削除する |

---

## コマンドサンプル

### mkdir — フォルダを作る

```bash
mkdir my-app                 # my-app フォルダを作成
mkdir css js images          # 複数のフォルダを一度に作成
mkdir -p src/components/ui   # 途中のフォルダもまとめて作成（-p）
```

`-p` をつけると、`src` や `components` が無くても、間のフォルダを自動で作ってくれます。

### touch — 空ファイルを作る

```bash
touch index.html             # 空の index.html を作成
touch a.txt b.txt c.txt      # 複数ファイルを一度に作成
```

### cp — コピーする

```bash
cp index.html backup.html        # ファイルをコピー
cp index.html ../backup/         # 別フォルダへコピー
cp -r src src-backup             # フォルダごとコピー（-r が必須）
```

フォルダをコピーするときは `-r`（recursive＝中身も再帰的に）が必要です。

### mv — 移動・名前変更

```bash
mv old.txt new.txt           # 名前を変更（同じ場所での移動 ＝ リネーム）
mv index.html src/           # src フォルダの中へ移動
mv a.txt b.txt archive/      # 複数ファイルをまとめて移動
```

`mv` は「移動」と「名前変更」の両方を兼ねます。移動先がフォルダなら移動、ファイル名なら名前変更になります。

### rm — 削除する

```bash
rm temp.txt                  # ファイルを削除
rm a.txt b.txt               # 複数ファイルを削除
rm -r old-folder             # フォルダごと削除（-r が必須）
rm -i important.txt          # 削除前に確認を求める（-i）
```

---

## 実行結果

```text
$ mkdir my-app
$ cd my-app
$ touch index.html style.css
$ ls
index.html  style.css

$ mkdir -p src/components
$ ls
index.html  src  style.css

$ cp index.html index-backup.html
$ ls
index-backup.html  index.html  src  style.css

$ mv style.css src/
$ ls
index-backup.html  index.html  src
$ ls src
components  style.css

$ rm index-backup.html
$ ls
index.html  src
```

---

## よくある間違い

### 1. フォルダを `-r` なしでコピー・削除しようとする

```bash
# ❌ フォルダには -r が必要
cp src dest
# → cp: src is a directory (not copied)
rm old-folder
# → rm: old-folder: is a directory

# ✅ -r をつける
cp -r src dest
rm -r old-folder
```

### 2. `rm` で消したファイルは戻らない

> [!CAUTION]
> `rm` で削除したファイルは**ゴミ箱に入りません。すぐに完全に消えます**。GUI のように「ゴミ箱から戻す」ことはできません。特に次のコマンドは要注意です。
>
> ```bash
> rm -rf folder    # folder とその中身を、確認なしで一気に削除
> ```
>
> `-f`（force）は確認を一切スキップするオプションです。`-rf` を使うときは、**実行前に必ず `pwd` で現在地、`ls` で対象を確認**してください。`rm -rf /` のようなパスは、システム全体を破壊しかねない非常に危険なコマンドです。絶対に興味本位で実行しないでください。

不安なときは `-i`（確認つき）で消す習慣にすると安全です。

```bash
rm -i *.txt      # 1ファイルずつ「消しますか？」と確認される
```

### 3. `mv`・`cp` で既存ファイルを上書きしてしまう

```bash
# ❌ コピー先に同名ファイルがあると、警告なしで上書きされる
cp new.txt important.txt   # important.txt の中身が消える！

# ✅ 上書き前に確認する（-i）
cp -i new.txt important.txt
```

`mv` も同様に、移動先に同名ファイルがあると上書きします。大事なファイルを扱うときは `-i` をつけましょう。

### 4. スペースを含む名前をそのまま打つ

```bash
# ❌ スペースで区切られて、2つの引数とみなされる
mkdir my project

# ✅ クォートで囲むか、スペースをエスケープする
mkdir "my project"
mkdir my\ project
```

そもそも、ファイル名・フォルダ名にスペースは使わない（`my-project` のようにハイフンやアンダースコアを使う）のが無難です。

---

## 実用例

### プロジェクトの雛形を一気に作る

```bash
mkdir -p my-site/{css,js,images}   # 親 + 3つの子フォルダを一度に作成
cd my-site
touch index.html css/style.css js/main.js
ls -R                               # 階層も含めて一覧表示
```

> **補足**：`{css,js,images}` のような波括弧展開は bash / zsh の機能です。Git Bash でも使えます。

### 作業前にバックアップを取る

```bash
# 設定ファイルをいじる前に、コピーして保険をかけておく
cp config.json config.json.bak
# 失敗したら元に戻す
mv config.json.bak config.json
```

---

## 実習

### 課題1：フォルダとファイルを作る

1. ホームに `cd ~` で移動し、`practice-files` フォルダを作って中に入ってください
2. `mkdir -p` で `docs/2025` というフォルダを一度に作ってください
3. `touch` で `readme.txt` と `docs/2025/note.txt` を作ってください
4. `ls -R` で全体の構造を確認してください

### 課題2：コピー・移動・改名を試す

1. `readme.txt` を `readme-backup.txt` という名前でコピーしてください
2. `readme.txt` を `index.txt` に改名（`mv`）してください
3. `readme-backup.txt` を `docs/` フォルダへ移動してください
4. それぞれの操作後に `ls` で結果を確認してください

### 課題3：安全に削除する

1. `rm -i` を使って `index.txt` を削除し、確認プロンプトに `y` で答えてください
2. `docs` フォルダを `rm -r` で中身ごと削除してください（削除前に `pwd` と `ls` で確認！）
3. 最後に `cd ~` で戻り、`practice-files` ごと片付けてください
