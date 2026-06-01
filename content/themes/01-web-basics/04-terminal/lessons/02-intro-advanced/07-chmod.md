---
title: "ファイルの権限とchmod"
order: 7
type: detail
difficulty: intermediate
tags: [terminal, chmod, permission, reference]
estimatedMinutes: 7
status: published
---
# ファイルの権限とchmod

## 解説

Linux / macOS では、すべてのファイルとフォルダに「**誰が・何をできるか**」という**権限（パーミッション）**が設定されています。スクリプトを実行しようとして `Permission denied`（権限がありません）と言われるのは、この仕組みによるものです。**chmod** は、その権限を変更するコマンドです。

### 3種類の権限と3種類の対象

権限には3つの種類があり、それぞれ3つの対象に対して設定されています。

| 記号 | 権限 | 数値 | 意味 |
|------|------|------|------|
| `r` | read | 4 | 読み取り |
| `w` | write | 2 | 書き込み |
| `x` | execute | 1 | 実行（フォルダの場合は「中に入る」） |

| 対象 | 意味 |
|------|------|
| user（u） | 所有者 |
| group（g） | 所有グループ |
| other（o） | その他の全員 |

### ls -l での読み方

`ls -l` の先頭の10文字が権限を表します。

```text
-rwxr-xr--
│└┬┘└┬┘└┬┘
│ u  g  o
└ 種別（- ファイル / d フォルダ）

u（所有者）   : rwx → 読み・書き・実行すべて可
g（グループ） : r-x → 読みと実行のみ
o（その他）   : r-- → 読みのみ
```

---

## コマンドサンプル

`chmod` の指定方法には「記号モード」と「数値モード」の2通りがあります。

### 記号モード（分かりやすい）

```bash
chmod +x script.sh        # 全員に実行権限を追加（よく使う）
chmod u+x script.sh       # 所有者にだけ実行権限を追加
chmod g-w file.txt        # グループの書き込み権限を削除
chmod o-r secret.txt      # その他の読み取りを禁止
chmod a+r file.txt        # all（全員）に読み取りを許可
```

`+` で追加、`-` で削除、`=` でその権限だけに設定します。

### 数値モード（簡潔）

r=4・w=2・x=1 を足した数字を、u/g/o の順に3桁で指定します。

```bash
chmod 755 script.sh       # rwx r-x r-x（所有者は全部、他は読み+実行）
chmod 644 file.txt        # rw- r-- r--（所有者は読み書き、他は読みのみ）
chmod 600 secret.txt      # rw- --- ---（所有者だけ読み書き、他は何も不可）
chmod 700 ~/.ssh          # 所有者だけアクセス可（鍵の保管フォルダなど）
```

| 数値 | 権限 | よくある用途 |
|------|------|--------------|
| `755` | rwxr-xr-x | スクリプト・実行ファイル・フォルダ |
| `644` | rw-r--r-- | 通常のテキスト・設定ファイル |
| `600` | rw------- | 秘密情報（鍵・パスワード等） |

### フォルダ以下をまとめて変更

```bash
chmod -R 755 scripts/     # フォルダ内を再帰的に変更（-R）
```

> [!CAUTION]
> `chmod -R` を広い範囲やシステムの重要フォルダに対して実行すると、システムが動かなくなることがあります。対象フォルダを `pwd` / `ls` で確認してから実行してください。また、`chmod 777`（全員に全権限）はセキュリティ上の理由から原則避けます。「とりあえず 777」は危険な習慣です。

---

## 実行結果

```text
$ ls -l script.sh
-rw-r--r--  1 taro  staff  120  6  1 10:00 script.sh

$ ./script.sh
zsh: permission denied: ./script.sh

$ chmod +x script.sh
$ ls -l script.sh
-rwxr-xr-x  1 taro  staff  120  6  1 10:00 script.sh

$ ./script.sh
Hello from script!
```

---

## よくある間違い

### 1. 実行権限がなくてスクリプトが動かない

```bash
# ❌ 作ったばかりのスクリプトは実行権限がない
./deploy.sh
# → permission denied

# ✅ 実行権限を付ける
chmod +x deploy.sh
./deploy.sh
```

「`permission denied` と言われたら `chmod +x`」は、最初に覚えておきたい対処法です。

### 2. 数値の意味を取り違える

```bash
# 644 と 755 の違い（x がつくかどうか）
chmod 644 script.sh    # 実行権限なし → ./script.sh は動かない
chmod 755 script.sh    # 実行権限あり → 動く
```

スクリプトやフォルダには「実行（x）」が必要、という点を押さえましょう。

### 3. 安易に 777 を使う

```bash
# ❌ 全員に書き込み・実行を許可してしまう（危険）
chmod 777 file.txt

# ✅ 必要最小限に。通常ファイルは 644、スクリプトは 755
chmod 644 file.txt
```

---

## 実用例

### シェルスクリプトを実行可能にする

```bash
# スクリプトを作って実行できるようにする一連の流れ
echo '#!/bin/bash' > hello.sh
echo 'echo "Hello!"' >> hello.sh
chmod +x hello.sh
./hello.sh
```

### SSH 鍵など秘密情報を保護する

```bash
chmod 700 ~/.ssh             # フォルダは所有者のみ
chmod 600 ~/.ssh/id_ed25519  # 秘密鍵は所有者の読み書きのみ
```

権限が緩いと SSH がセキュリティ上の理由で鍵を使用しないことがあります。`600` / `700` が定番です。

---

## 実習

### 課題1：権限を確認する

1. `touch test.sh` でファイルを作り、`ls -l test.sh` で初期の権限を確認してください
2. 先頭10文字の `r`・`w`・`x` が、u / g / o のどこに付いているか読み取ってください

### 課題2：実行権限を付ける

1. `echo 'echo "動いた！"' > test.sh` でファイルに中身を書いてください
2. `./test.sh` を実行し、`permission denied` になることを確認してください
3. `chmod +x test.sh` を実行してから、もう一度 `./test.sh` を実行してください

### 課題3：数値モードを使い分ける

1. `chmod 644 test.sh` を実行し、`ls -l` で実行権限（x）が消えたことを確認してください
2. `chmod 755 test.sh` を実行し、x が戻ることを確認してください
3. `644` と `755` がそれぞれどんな権限か、`rwx` の記号で説明してみましょう
