---
title: "SSHキーペアの生成（ssh-keygen）"
order: 2
type: detail
difficulty: beginner
tags: [ssh, ssh-keygen, security]
estimatedMinutes: 7
status: published
---
# SSHキーペアの生成（ssh-keygen）

## 解説

SSHの鍵ペア（公開鍵と秘密鍵）は `ssh-keygen` コマンドで作成します。ターミナル（またはGit Bash / WSL）を開いて実行するだけで、必要なファイルが自動的に生成されます。

### 鍵の種類（アルゴリズム）

| アルゴリズム | 特徴 | 推奨度 |
| :--- | :--- | :--- |
| **Ed25519** | 軽量・高速・高セキュリティ。近年の標準 | ◎ 推奨 |
| RSA (4096bit) | 歴史が長く、古い環境との互換性が高い | ○ 互換性重視の場合のみ |
| RSA (2048bit以下) | 鍵長が短くセキュリティ強度が低い | ✕ 非推奨 |

特別な事情がなければ **Ed25519** を選べば問題ありません。RSAは、古いサーバーなどEd25519に対応していない環境と接続する場合の選択肢です。

### 生成時に聞かれる項目

1. **保存場所の指定**：デフォルト（`~/.ssh/id_ed25519` など）のままで問題ありません
2. **パスフレーズの設定**：鍵ファイルにかける追加のパスワードです。設定しなくても接続はできますが、**設定を強く推奨**します（PCが盗難・紛失した場合の保険になります）

---

## コマンドサンプル

```bash
# Ed25519形式で鍵ペアを生成（推奨）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 従来のRSA形式で生成する場合（互換性重視）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 保存先ファイル名を指定して生成（複数の鍵を使い分けたい場合）
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_work -C "work@example.com"

# パスフレーズをコマンド上で指定して非対話で生成する場合
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_ci -N "" -C "ci-bot"

# 生成した鍵の一覧を確認する
ls -la ~/.ssh

# 公開鍵の中身を表示する
cat ~/.ssh/id_ed25519.pub

# 秘密鍵の権限を安全な状態（所有者のみ読み書き可）にする
chmod 600 ~/.ssh/id_ed25519
```

`-C` オプションはコメント（多くの場合メールアドレス）で、GitHub上などで「どの鍵か」を識別しやすくするためのものです。`-N ""` はパスフレーズなしを意味しますが、対話的に鍵を作る通常の作業では極力パスフレーズを設定してください。

---

## 実行結果

```text
$ ssh-keygen -t ed25519 -C "your_email@example.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/taro/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/taro/.ssh/id_ed25519
Your public key has been saved in /Users/taro/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:ab12CD34ef56GH78ij90KL12mn34OP56qr78ST90uv your_email@example.com
The key's randomart image is:
+--[ED25519 256]--+
|      .oo+=BX*O++|
|       .+ =.@.=+o|
|        . o + +. |
|         o . o   |
|        S .   .  |
|         .       |
|                 |
|                 |
|                 |
+----[SHA256]-----+

$ ls -la ~/.ssh
-rw-------  1 taro  staff   411  1 15 10:00 id_ed25519
-rw-r--r--  1 taro  staff    98  1 15 10:00 id_ed25519.pub

$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP1k... your_email@example.com
```

---

## よくある間違い

### 1. すでにある鍵を上書きしてしまう

```bash
# ❌ 既存の鍵と同じ保存先にすると上書きの確認が出て、うっかりEnterすると上書きされる
$ ssh-keygen -t ed25519
Enter file in which to save the key (/Users/taro/.ssh/id_ed25519):
/Users/taro/.ssh/id_ed25519 already exists.
Overwrite (y/n)?

# ✅ 別名（別ファイル）を指定して既存の鍵を守る
$ ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_new
```

### 2. 公開鍵と秘密鍵のファイルを間違えて登録する

```text
❌ GitHubに `id_ed25519`（秘密鍵）を登録しようとする
   → 秘密鍵の中身をそのまま貼り付けてしまうのは絶対にNG

✅ 必ず `.pub` が付いたファイル（公開鍵）の中身を登録する
```

### 3. パスフレーズを忘れてしまう

```text
❌ パスフレーズを設定したのにメモを残さず忘れてしまう
   → 秘密鍵は復元できないため、鍵を作り直すしかなくなる

✅ パスワードマネージャーなどにパスフレーズを保管しておく
```

---

## 実用例

### 用途ごとに鍵を使い分ける

```bash
# 個人アカウント用
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_personal -C "personal@example.com"

# 仕事用アカウント
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_work -C "work@example.com"

# 開発用サーバー接続用
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_dev -C "dev-server"
```

このように用途別に鍵を分けておくと、万が一1つの鍵が漏れても影響範囲を限定できます。使い分けの実際の接続方法は、`~/.ssh/config` の記事で扱います。

### 生成した鍵の指紋（fingerprint）を確認する

```bash
# 公開鍵の指紋を表示（サーバー側に登録済みの鍵と一致するか確認する際に使う）
ssh-keygen -lf ~/.ssh/id_ed25519.pub
```

---

## 実習

### 課題1：練習用の鍵ペアを作成する

1. 既存の鍵を上書きしないよう、`-f` オプションで練習用のファイル名を指定してください
2. パスフレーズを設定して鍵ペアを生成してください

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_practice -C "practice"
```

### 課題2：生成されたファイルを確認する

1. `ls -la ~/.ssh/id_ed25519_practice*` で2つのファイルが作成されたことを確認してください
2. `cat` コマンドで公開鍵（`.pub`）の中身を表示してください
3. `ls -l` で秘密鍵の権限が `600` になっているか確認してください

### 課題3：後片付け

1. 練習が終わったら、課題1で作成した2つのファイルを削除してください

```bash
rm ~/.ssh/id_ed25519_practice ~/.ssh/id_ed25519_practice.pub
```
