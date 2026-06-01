---
title: "パスの概念（絶対パス・相対パス）"
order: 2
type: detail
difficulty: beginner
tags: [terminal, path, reference]
estimatedMinutes: 7
status: published
---
# パスの概念（絶対パス・相対パス）

## 解説

**パス（path）** とは、ファイルやフォルダの「住所」を表す文字列です。ターミナルでは「どのファイルを？」「どこに移動する？」をすべてパスで指定するため、パスの感覚が身につくと操作が一気に楽になります。

### ファイルシステムはツリー構造

コンピュータの中のファイルとフォルダは、一番上の **ルート（`/`）** を頂点とした、入れ子の**ツリー構造**で管理されています。

```text
/                          ← ルート（すべての出発点）
├── Users
│   └── taro               ← ホームディレクトリ（~ で表せる）
│       ├── Documents
│       │   └── report.md
│       └── projects
│           └── my-app
│               └── index.html
└── Applications
```

`index.html` の住所をルートからたどると `/Users/taro/projects/my-app/index.html` になります。これがそのファイルの**絶対パス**です。

### カレントディレクトリ＝「いまいる場所」

ターミナルには常に「**いまどこにいるか**」という現在地があり、これを**カレントディレクトリ**（作業ディレクトリ）と呼びます。`pwd` コマンドでいつでも確認できます。

パスには、この現在地を基準にするかどうかで2種類があります。

---

## 絶対パスと相対パス

### 絶対パス：ルート（/）から書く

ルート `/` から目的地までを完全に書いたパスです。**現在地がどこであっても同じ場所**を指します。

```text
/Users/taro/projects/my-app/index.html
```

### 相対パス：現在地から書く

いまいる場所（カレントディレクトリ）を基準にしたパスです。短く書ける反面、**現在地が変われば指す場所も変わります**。

カレントディレクトリが `/Users/taro` のとき:

```text
projects/my-app/index.html      ← 上の絶対パスと同じファイルを指す
```

### パスで使う特別な記号

| 記号 | 意味 | 例 |
|------|------|-----|
| `/` | ルート、またはフォルダの区切り | `/Users/taro` |
| `~` | ホームディレクトリ | `~/Documents`（= `/Users/taro/Documents`） |
| `.` | 現在地（カレントディレクトリ） | `./script.sh` |
| `..` | 1つ上のフォルダ（親） | `../images` |

> **補足**：Windows のエクスプローラーではフォルダの区切りに `\`（バックスラッシュ）を使いますが、Git Bash / WSL や本モジュールでは `/`（スラッシュ）を使います。

---

## コマンドサンプル

```bash
# 現在地を確認する
pwd

# 絶対パスで移動（どこにいても同じ場所へ）
cd /Users/taro/projects/my-app

# ホームから相対パスで移動
cd ~
cd projects/my-app           # ~ から見た相対パス

# . と .. を使った移動
cd ..                        # 1つ上のフォルダへ
cd ../../Documents           # 2つ上 → その中の Documents へ
cd ./my-app                  # 現在地の中の my-app へ（./ は省略可）

# ~ を使うと、どこにいてもホーム基準で書ける
cat ~/Documents/report.md
```

---

## 実行結果

```text
$ pwd
/Users/taro

$ cd projects/my-app
$ pwd
/Users/taro/projects/my-app

$ cd ..
$ pwd
/Users/taro/projects

$ cd ~
$ pwd
/Users/taro

$ cd /Applications
$ pwd
/Applications
```

相対パス（`cd projects/my-app`）でも絶対パス（`cd /Applications`）でも、最終的な現在地は `pwd` で確認できます。

---

## よくある間違い

### 1. 相対パスを現在地と無関係に考えてしまう

```text
カレントディレクトリが /Users/taro のとき
  cd projects        → /Users/taro/projects へ移動できる ✅

カレントディレクトリが /Applications のとき
  cd projects        → No such file or directory（projects が無い）❌
```

相対パスは「いまいる場所」が起点です。同じコマンドでも現在地が違えば結果が変わります。迷ったら `pwd` で現在地を確認しましょう。

### 2. 先頭の `/` をつけ忘れる／余計につける

```bash
# 絶対パスのつもりが、先頭の / を忘れて相対パス扱いになる
cd Users/taro        # ❌ 現在地の中の Users を探してしまう
cd /Users/taro       # ✅ ルートからの絶対パス
```

先頭に `/` があるかどうかで、絶対パスか相対パスかが決まります。

### 3. `~` を文字列の途中で使う

```bash
cd ~/Documents       # ✅ ~ はパスの先頭で使う
cd /Users/~/Documents # ❌ 途中の ~ はホームに展開されない
```

---

## 実用例

### プロジェクト間をすばやく行き来する

```bash
# ホームを起点にすれば、どこにいても一発で移動できる
cd ~/projects/my-app

# 作業後、1つ上の projects フォルダに戻って別プロジェクトへ
cd ../another-app
```

### 設定ファイルをホーム基準で開く

```bash
# .zshrc はホーム直下にあるので ~ で確実に指定できる
cat ~/.zshrc
```

---

## 実習

### 課題1：絶対パスと相対パスで同じ場所に行く

1. `pwd` で現在地を確認してください
2. `cd ~` でホームに移動し、相対パスでお好きなフォルダ（例：`Documents`）に入ってください
3. 一度 `cd /` でルートに移動し、今度は**絶対パス**で同じフォルダに入ってください
4. どちらも `pwd` で同じ場所に着いたことを確認してください

### 課題2：`..` で階層を上がる

1. 3階層ほど深いフォルダに `cd` で移動してください
2. `cd ..` を繰り返して、1階層ずつ上がりながら毎回 `pwd` で現在地を確認してください
3. `cd ../..` で2階層まとめて上がれることも試してください

### 課題3：記号の意味を説明する

次のパスがそれぞれ何を指すか、言葉で説明してみましょう。

1. `~/Documents/report.md`
2. `../images/logo.png`
3. `./index.html`
4. `/Applications`
