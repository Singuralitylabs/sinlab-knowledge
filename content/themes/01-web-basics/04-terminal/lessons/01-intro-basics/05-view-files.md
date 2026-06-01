---
title: "ファイルの中身を見る（cat・less・head・tail）"
order: 5
type: detail
difficulty: beginner
tags: [terminal, file-operations, reference]
estimatedMinutes: 5
status: published
---
# ファイルの中身を見る（cat・less・head・tail）

## 解説

ファイルを作ったり編集したりしたら、その中身を確認したくなります。わざわざエディタを開かなくても、ターミナル上でサッと中身を表示するコマンドがあります。状況に応じて使い分けましょう。

| コマンド | 役割 | 向いている場面 |
|----------|------|----------------|
| `cat` | 中身を全部まとめて表示 | 短いファイル |
| `less` | スクロールしながら閲覧 | 長いファイル |
| `head` | 先頭の数行だけ表示 | ファイルの冒頭を確認 |
| `tail` | 末尾の数行だけ表示 | ログの最新部分を確認 |

---

## コマンドサンプル

### cat — まとめて表示

```bash
cat README.md            # 中身を全部表示
cat a.txt b.txt          # 複数ファイルを連結して表示
cat -n script.js         # 行番号つきで表示
```

`cat` は **conc<b>at</b>enate（連結）** が由来で、本来は複数ファイルをつなげるコマンドですが、中身をサッと見る用途で一番よく使われます。

### less — スクロール表示

```bash
less long-file.log       # 1画面ずつスクロールしながら閲覧
```

`less` を開いたあとの操作:

| キー | 動作 |
|------|------|
| `Space` / `f` | 次のページへ |
| `b` | 前のページへ |
| `↑` / `↓` | 1行ずつスクロール |
| `/keyword` | キーワードを検索 |
| `q` | 終了して元のプロンプトに戻る |

> **`q` で抜ける**：`less` は専用の画面に切り替わります。閲覧が終わったら **`q` キー**を押せば元のターミナルに戻れます。「画面が固まった」と焦らず、まず `q` を試してください。

### head / tail — 先頭・末尾だけ

```bash
head index.html          # 先頭10行を表示
head -n 5 index.html     # 先頭5行を表示
tail access.log          # 末尾10行を表示
tail -n 20 access.log    # 末尾20行を表示
tail -f access.log       # 末尾を表示し続ける（追記をリアルタイム監視。Ctrl+C で終了）
```

`tail -f` はログをリアルタイムで眺めたいときに便利です。

---

## 実行結果

```text
$ cat hello.txt
こんにちは
ターミナルの世界へようこそ

$ cat -n hello.txt
     1	こんにちは
     2	ターミナルの世界へようこそ

$ head -n 3 numbers.txt
1
2
3

$ tail -n 2 numbers.txt
99
100
```

---

## よくある間違い

### 1. 巨大なファイルを `cat` してしまう

```bash
# ❌ 何万行もあるログを cat すると、画面が一気に流れて読めない
cat huge.log

# ✅ 長いファイルは less で開く
less huge.log
```

数行〜数十行なら `cat`、それ以上のファイルは `less` で開くのが基本です。

### 2. `less` から抜けられなくなる

```text
# less を開いたあと、画面が切り替わって戻れない…
→ q キーを押せば終了して元のプロンプトに戻れます
```

「ターミナルが反応しない」と感じたら、まず `q` を押してみましょう。多くの閲覧系コマンドは `q` で抜けられます。

### 3. フォルダを `cat` しようとする

```bash
# ❌ cat はファイル専用。フォルダには使えない
cat my-folder
# → cat: my-folder: Is a directory

# ✅ フォルダの中身は ls で見る
ls my-folder
```

---

## 実用例

### 設定ファイルの中身をサッと確認する

```bash
cat package.json         # プロジェクトの設定を確認
cat ~/.gitconfig         # Git の設定を確認
```

### ログの最新部分だけチェックする

```bash
tail -n 30 error.log     # 直近30行のエラーだけ見る
tail -f server.log       # サーバを動かしながらログを監視（Ctrl+C で停止）
```

### ファイルの行数や中身を素早く把握する

```bash
head index.html          # まず冒頭を見て、どんなファイルか当たりをつける
cat -n index.html        # 行番号つきで全体を確認
```

---

## 実習

### 課題1：cat で中身を見る

1. `echo "1行目" > sample.txt` でファイルを作ってください
2. `echo "2行目" >> sample.txt` で2行目を追記してください（`>>` は追記。応用編で詳しく学びます）
3. `cat sample.txt` と `cat -n sample.txt` で中身を確認し、違いを比べてください

### 課題2：head と tail を使い分ける

1. 行数の多いファイル（例：`cat ~/.zshrc` などで中身があるもの）を用意してください
2. `head -n 5` で先頭5行、`tail -n 5` で末尾5行だけを表示してください
3. それぞれが何を表示しているか確認してください

### 課題3：less に慣れる

1. 長めのファイルを `less` で開いてください（例：`less ~/.zshrc`）
2. `Space` で次のページ、`b` で前のページに移動してみてください
3. `/` でキーワードを検索し、`q` で終了してください
