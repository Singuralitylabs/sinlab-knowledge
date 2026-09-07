---
title: "~/.ssh/config による接続管理"
order: 5
type: detail
difficulty: beginner
tags: [ssh, config, git, github]
estimatedMinutes: 6
status: published
---
# ~/.ssh/config による接続管理

## 解説

複数のGitHubアカウントを使い分けたり、複数のリモートサーバーに接続したりする場合、毎回長いコマンドを打つのは大変です。`~/.ssh/config` というファイルにホストごとの接続情報をまとめておくと、エイリアス（別名）だけで接続できるようになります。

```text
【configがない場合】
$ ssh -i ~/.ssh/id_ed25519_dev -p 22 ubuntu@192.168.11.50

【configがある場合】
$ ssh dev-server
```

`~/.ssh/config` に書く主な設定項目は次のとおりです。

| 項目 | 意味 |
| :--- | :--- |
| `Host` | エイリアス名（自分で決める好きな名前） |
| `HostName` | 実際の接続先（ドメイン名やIPアドレス） |
| `User` | 接続するユーザー名 |
| `Port` | 接続ポート（省略時は22） |
| `IdentityFile` | 使用する秘密鍵のパス |
| `IdentitiesOnly` | `yes` にすると `IdentityFile` で指定した鍵だけを使う（`ssh-agent` 上の他の鍵を試さない） |

---

## コマンドサンプル

```bash
# ~/.ssh/config を作成・編集する（存在しない場合は新規作成される）
nano ~/.ssh/config

# ファイルが存在しない場合、先に作成して権限を設定してもよい
touch ~/.ssh/config
chmod 600 ~/.ssh/config
```

設定例：

```text
# GitHub（個人用アカウント）
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal
    IdentitiesOnly yes

# GitHub（仕事用アカウント）
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes

# 開発用Webサーバー
Host dev-server
    HostName 192.168.11.50
    User ubuntu
    Port 22
    IdentityFile ~/.ssh/id_ed25519_dev
```

エイリアスを使った接続・クローンのコマンドは以下のとおりです。

```bash
# エイリアスで直接SSH接続する
ssh dev-server

# エイリアスを使ってリポジトリをクローンする（ホスト部分をエイリアスに置き換える）
git clone git@github-work:company/project.git

# 設定内容を確認する
cat ~/.ssh/config
```

---

## 実行結果

```text
$ cat ~/.ssh/config
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal
    IdentitiesOnly yes

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes

$ ssh -T github-work
Hi username-work! You've successfully authenticated, but GitHub does not provide shell access.

$ git clone git@github-work:company/project.git
Cloning into 'project'...
remote: Enumerating objects: 120, done.
Receiving objects: 100% (120/120), done.
```

---

## よくある間違い

### 1. インデント（字下げ）を忘れる

```text
❌ Host行以下のオプションを字下げせずに書く（動作しないことがある）
Host dev-server
HostName 192.168.11.50

✅ 各オプションは半角スペースまたはタブでインデントする
Host dev-server
    HostName 192.168.11.50
```

### 2. 同じ `Host` エイリアスを複数定義してしまう

```text
❌ 同名の Host ブロックを2つ書いてしまい、意図しない方の設定が使われる
Host github-work
    IdentityFile ~/.ssh/id_ed25519_work
...
Host github-work
    IdentityFile ~/.ssh/id_ed25519_old

✅ エイリアス名は一意にする。使い分けたい場合は github-work-a のように区別する
```

### 3. `~/.ssh/config` 自体の権限が緩い

```bash
# ❌ 権限が緩いとSSHが警告を出したり、設定が無視されたりすることがある
$ chmod 644 ~/.ssh/config

# ✅ 所有者のみ読み書き可能にしておく
$ chmod 600 ~/.ssh/config
```

### 4. `HostName` に本来の意味を勘違いする

```text
❌ HostName にエイリアス名（github-work など）を書いてしまう

✅ HostName には実際の接続先ドメイン・IP（github.com など）を書く
   Host にはエイリアス名（自分で決める好きな名前）を書く
```

### 5. 複数アカウントで `IdentitiesOnly yes` を付け忘れる

```text
❌ IdentityFile だけ指定して IdentitiesOnly を付けない
   → ssh-agent に他アカウントの鍵が読み込まれていると、そちらが先に試され
     意図しないアカウントで認証されてしまうことがある

✅ 複数の鍵・複数アカウントを扱う Host ブロックには IdentitiesOnly yes を付ける
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes
```

---

## 実用例

### 個人アカウントと仕事用アカウントを併用する

```text
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal
    IdentitiesOnly yes

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes
```

```bash
# 個人アカウントのリポジトリ
git clone git@github-personal:taro/my-project.git

# 仕事用アカウントのリポジトリ
git clone git@github-work:company/project.git
```

同じ `github.com` でも、エイリアスを変えるだけで異なる鍵（＝異なるアカウント）を使い分けられます。ただし `IdentitiesOnly yes` を付けないと、`ssh-agent` に他アカウントの鍵が先に読み込まれている場合、OpenSSH は `IdentityFile` より先に agent 側の鍵を試してしまい、意図しないアカウントで認証されることがあります。複数の鍵・複数アカウントを扱う `Host` ブロックには必ず `IdentitiesOnly yes` を付けてください。

### 踏み台サーバー経由で内部サーバーに接続する

```text
Host bastion
    HostName bastion.example.com
    User taro
    IdentityFile ~/.ssh/id_ed25519_bastion

Host internal-server
    HostName 10.0.1.20
    User taro
    IdentityFile ~/.ssh/id_ed25519_internal
    ProxyJump bastion
```

`ProxyJump` を使うと、`ssh internal-server` の1コマンドで踏み台サーバー経由の接続を自動化できます。

---

## 実習

### 課題1：設定ファイルを作成する

1. `~/.ssh/config` が存在するか確認し、なければ `touch` で作成してください
2. 権限を `600` に設定してください

### 課題2：練習用のホストを追加する

1. 本文の「開発用Webサーバー」の設定例を参考に、架空のホスト（例: `Host practice-server`）を追記してください
2. `cat ~/.ssh/config` で内容を確認してください

### 課題3：後片付け

1. `nano ~/.ssh/config`（または任意のエディタ）で、課題2で追加したブロックを削除してください
2. 削除後、`cat ~/.ssh/config` で元の状態に戻ったことを確認してください
