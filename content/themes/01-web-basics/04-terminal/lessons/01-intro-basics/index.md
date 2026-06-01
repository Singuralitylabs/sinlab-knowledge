---
title: "ターミナルの基本操作"
order: 1
type: lecture
difficulty: beginner
tags: [terminal, cli, fundamentals, concept]
estimatedMinutes: 15
status: published
---
# ターミナルの基本操作

## はじめに

**ターミナル**は、キーボードから文字（コマンド）を打ち込んでコンピュータを操作するための道具です。マウスでアイコンをクリックして操作する GUI（Graphical User Interface）に対して、文字で操作するこの方式を **CLI（Command Line Interface）** と呼びます。

最初は「黒い画面に文字を打つなんて難しそう」と感じるかもしれません。しかし、ターミナルは Web 開発を学ぶうえで避けて通れない、そして一度慣れれば手放せなくなる強力な道具です。

### なぜターミナルを学ぶのか？

- **速い**：フォルダを何度もクリックして開くより、`cd` と数文字のタブ補完で目的地に一瞬で移動できます
- **自動化できる**：同じ操作をコマンドとして並べれば、まとめて実行できます
- **Git の前提になる**：次のモジュールで学ぶ Git は、ターミナルでの操作が基本です
- **開発ツールの共通言語**：Node.js、npm、ビルドツールなど、開発ツールの多くはターミナルから使います

> [!NOTE]
> **Windows をお使いの方へ**
> このモジュールは macOS / Linux の標準シェル（bash / zsh）を前提に解説します。Windows の場合は、Git をインストールすると付属する **Git Bash**、または **WSL（Windows Subsystem for Linux）** を使ってください。そうすれば `ls`・`cd`・`mkdir`・`rm` といったコマンドが本文と同じように動きます。Windows 標準の PowerShell はコマンド名が異なる（`ls` の本来の名前は `Get-ChildItem` など）ため、本モジュールでは深く扱いません。

::detail{slug="what-is-terminal"}

---

## パスの考え方

ターミナルを使ううえで最初に身につけたいのが「**パス**（path）」の感覚です。パスとは、ファイルやフォルダの「住所」のことです。

コンピュータの中身は、フォルダ（ディレクトリ）が入れ子になった**ツリー構造**になっています。

```text
/                     ← ルート（一番上）
├── Users
│   └── taro
│       ├── Documents
│       │   └── report.md
│       └── projects
│           └── my-app
└── Applications
```

いまどこにいるか（**カレントディレクトリ**）を基準に、「ここから見た住所」で目的地を指定するのが基本です。`/` から書く絶対パスと、現在地から書く相対パス（`.` は現在地、`..` は1つ上、`~` はホーム）を使い分けます。

::detail{slug="paths"}

---

## ディレクトリを移動する

パスが分かったら、実際に移動してみましょう。使うコマンドは3つだけです。

```bash
pwd          # いまどこにいるかを表示（Print Working Directory）
ls           # この場所にあるファイル・フォルダの一覧を表示（List）
cd projects  # projects フォルダへ移動（Change Directory）
```

実行するとこのように表示されます。

```text
$ pwd
/Users/taro

$ ls
Applications  Documents  projects

$ cd projects
$ pwd
/Users/taro/projects
```

「`pwd` で現在地を確認 → `ls` で中身を見る → `cd` で移動する」の繰り返しが、ターミナル操作の基本リズムです。

::detail{slug="navigation"}

---

## ファイルとフォルダを操作する

移動できるようになったら、次はファイルやフォルダを作る・コピーする・消すといった操作です。

```bash
mkdir my-app          # フォルダを作る（Make Directory）
touch index.html      # 空のファイルを作る
cp index.html bak.html # ファイルをコピー（Copy）
mv bak.html backup/   # ファイルを移動（Move）/ 名前変更
rm index.html         # ファイルを削除（Remove）
```

> [!CAUTION]
> `rm` で削除したファイルは**ゴミ箱に入らず、すぐに完全に消えます**。特に `rm -rf フォルダ名` はフォルダの中身ごと一気に消す強力なコマンドで、打ち間違えると取り返しがつきません。削除する前に、必ず `pwd` と `ls` で「いまどこで何を消そうとしているか」を確認する習慣をつけましょう。

::detail{slug="file-operations"}

ファイルを作ったり編集したりしたら、その中身をターミナル上で確認したくなります。エディタを開かずにサッと中身を見るコマンドも覚えておきましょう。

::detail{slug="view-files"}

---

## 効率的に操作する

ここまでで「操作」はできるようになりました。最後に、ターミナルを**速く・楽に**使うためのスキルを身につけましょう。これこそがターミナルに慣れた人と初心者の差が一番出るところです。

- **タブ補完**：途中まで打って `Tab` キーを押すと、残りを自動入力してくれます
- **コマンド履歴**：`↑` キーで過去に打ったコマンドを呼び出せます。同じコマンドを打ち直す必要はありません

::detail{slug="completion-history"}

分からないコマンドに出会ったときに、自分で調べる方法も知っておくと安心です。

::detail{slug="help-and-tips"}

---

## 基本コマンドまとめ

| コマンド | 説明 | 使用例 |
|----------|------|--------|
| `pwd` | 現在地（カレントディレクトリ）を表示 | `pwd` |
| `ls` | ファイル・フォルダの一覧を表示 | `ls -la` |
| `cd` | ディレクトリを移動 | `cd projects` |
| `mkdir` | フォルダを作成 | `mkdir my-app` |
| `touch` | 空ファイルを作成 | `touch index.html` |
| `cp` | ファイルをコピー | `cp a.txt b.txt` |
| `mv` | 移動・名前変更 | `mv old.txt new.txt` |
| `rm` | ファイルを削除 | `rm temp.txt` |
| `cat` | ファイルの中身を表示 | `cat README.md` |
| `history` | コマンド履歴を表示 | `history` |

---

## 実践演習：最初のフォルダ操作

ターミナルを開いて、次の流れを一通り実行してみましょう。コメント（`#` 以降）は打たなくて構いません。

```bash
# 1. ホームに移動して、練習用フォルダを作る
cd ~
mkdir terminal-practice
cd terminal-practice

# 2. 現在地を確認する
pwd

# 3. ファイルを作って一覧を見る
touch hello.txt memo.txt
ls

# 4. ファイルに文字を書き込んで、中身を見る
echo "はじめてのターミナル" > hello.txt
cat hello.txt

# 5. ファイルをコピー・改名する
cp hello.txt hello-backup.txt
mv memo.txt notes.txt
ls

# 6. いらないファイルを消す
rm hello-backup.txt
ls

# 7. ↑ キーを何度か押して、さっき打ったコマンドが出てくることを確認する
```

最後に、`cd ~` でホームに戻り、`rm -r terminal-practice` で練習用フォルダごと片付ければ完了です（消す前に `pwd` と `ls` で確認！）。

---

## まとめ

本記事では、ターミナルの基本操作を解説しました。

ターミナル操作の核となるのは「**`pwd` で現在地を確認 → `ls` で中身を見る → `cd` で移動する**」のリズムです。そこにファイル操作（`mkdir`・`touch`・`cp`・`mv`・`rm`）と、タブ補完・履歴という効率化スキルが加われば、日常的な操作はほぼカバーできます。まずはこの一連の流れを、手を動かして体に覚えさせましょう。

### 次のステップ

- **応用編** に進み、リダイレクト（`>`）やパイプ（`|`）、`grep` での検索など、コマンドを組み合わせる技を学びましょう
- **Git モジュール** では、ここで学んだターミナル操作が前提になります。`cd` でリポジトリに移動し、`git` コマンドを打つ、という流れに自然に入っていけます

### 参考リソース

- [Visual Studio Code — 統合ターミナル](https://code.visualstudio.com/docs/terminal/basics)：VS Code 内でターミナルを使う方法（本テーマの VS Code モジュールでも解説しています）
- [The Linux Command Line（日本語訳）](https://linuxcommand.org/tlcl.php)：コマンドラインを基礎から学べる定番の無料書籍

---

お疲れさまでした！基礎編をマスターしたら、応用編でさらに便利な使い方を学びましょう。
