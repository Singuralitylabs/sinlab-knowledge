---
title: "パイプ（|）でコマンドをつなぐ"
order: 2
type: detail
difficulty: intermediate
tags: [terminal, pipe, reference]
estimatedMinutes: 6
status: published
---
# パイプ（|）でコマンドをつなぐ

## 解説

**パイプ**（`|`、縦棒）は、あるコマンドの**出力**を、次のコマンドの**入力**として渡す仕組みです。リダイレクト（`>`）が「出力をファイルへ流す」のに対し、パイプは「出力を別のコマンドへ流す」と考えると分かりやすいです。

```text
コマンドA の出力  →  | （パイプ）  →  コマンドB の入力
```

パイプを使うと、小さなコマンドを数珠つなぎにして、複雑な処理を1行で組み立てられます。これは「1つのコマンドは1つのことをうまくやる」という UNIX の思想を体現した、ターミナルの醍醐味です。

> **`|` の入力方法**：縦棒 `|` は、日本語キーボードでは多くの場合 `Shift +￥`（または `Shift + \`）で入力できます。

---

## コマンドサンプル

### 長い出力をスクロール表示する

```bash
ls -la | less            # 長い一覧を less でスクロール表示
history | less           # 履歴を1画面ずつ見る
```

### 検索する（grep と組み合わせる）

```bash
ls | grep .md            # 一覧の中から .md を含むものだけ表示
history | grep git       # 履歴の中から git を含むコマンドだけ表示
ps aux | grep node       # 実行中プロセスから node を含むものを探す
```

### 件数を数える（wc と組み合わせる）

```bash
ls | wc -l               # ファイル・フォルダの数を数える
ls *.md | wc -l          # .md ファイルの数を数える
```

`wc -l` は行数を数えるコマンドです。一覧をパイプで渡せば「個数」が分かります。

### 並べ替え・重複除去

```bash
cat names.txt | sort             # 中身を並べ替えて表示
cat names.txt | sort | uniq      # 並べ替えてから重複を取り除く
```

### 複数つなげる

```bash
# 履歴から git コマンドを探し、先頭5件だけ表示
history | grep git | head -n 5
```

パイプは何段でもつなげられます。「絞り込んで → 並べて → 先頭だけ」のように、処理を組み立てていきます。

---

## 実行結果

```text
$ ls
CHANGELOG.md  README.md  index.html  notes.md  style.css

$ ls | grep .md
CHANGELOG.md
README.md
notes.md

$ ls | wc -l
       5

$ ls *.md | wc -l
       3

$ history | grep git | head -n 3
  201  git status
  205  git add .
  206  git commit -m "初回コミット"
```

---

## よくある間違い

### 1. パイプとリダイレクトを混同する

```bash
# ❌ grep にファイルではなく「文字列」を渡そうとしている
ls > grep .md            # grep という名前のファイルに ls の結果を保存してしまう

# ✅ コマンドにつなぐならパイプ
ls | grep .md
```

`>` の右はファイル名、`|` の右はコマンド。ここを取り違えると意図しない動作になります。

### 2. パイプの左に「出力しないコマンド」を置く

```bash
# ❌ cd は画面に何も出力しないので、パイプに渡すものがない
cd projects | grep app

# ✅ パイプは「出力するコマンド」同士をつなぐ
ls projects | grep app
```

パイプは「左のコマンドの出力」を流すものなので、左側は何かを出力するコマンドである必要があります。

### 3. grep のパターンにスペースや記号を含めてクォートし忘れる

```bash
# ❌ スペースを含むパターンは正しく渡らない
history | grep git commit

# ✅ スペースを含むならクォートで囲む
history | grep "git commit"
```

---

## 実用例

### 実行中のプロセスを探して止める

```bash
ps aux | grep node       # node のプロセスを探す（PID を確認）
# 表示された PID を使って kill する
```

### ファイル数や行数をサッと把握する

```bash
ls src | wc -l                   # src 内のファイル数
cat access.log | wc -l           # ログの行数（≒アクセス数）
```

### Git のログを絞り込む（基礎・応用の合わせ技）

```bash
git log --oneline | grep "修正"  # コミット履歴から「修正」を含むものを抽出
git log --oneline | head -n 10   # 直近10件のコミットだけ表示
```

---

## 実習

### 課題1：パイプで検索する

1. 適当なフォルダで `ls` を実行し、一覧を確認してください
2. `ls | grep 文字` の形で、特定の文字を含むものだけ表示してみてください
3. `history | grep ls` で、これまで打った `ls` 関連のコマンドを抽出してください

### 課題2：件数を数える

1. `ls | wc -l` でカレントディレクトリのファイル・フォルダ数を数えてください
2. `ls *.md | wc -l` のように、拡張子を絞って数えてみてください

### 課題3：パイプを連結する

1. `history | grep cd | head -n 5` を実行してください
2. このコマンドが「履歴 → cd を含むものに絞る → 先頭5件」の順に処理していることを、結果と照らして確認してください
3. `head -n 5` を `tail -n 5` に変えると、どう変わるか試してください
