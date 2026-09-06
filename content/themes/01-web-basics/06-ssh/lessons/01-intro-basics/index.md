---
title: "SSH認証 基礎編"
order: 1
type: lecture
difficulty: beginner
tags: [ssh, security, git, github]
estimatedMinutes: 16
status: published
---
# SSH認証 基礎編

## はじめに

> [!NOTE]
> Windows をお使いの場合は、**Git Bash** または **WSL** のターミナルで操作してください。`ssh` コマンドや `~/.ssh` というパスの書き方は、この2つの環境であればそのまま通ります。

### SSH認証とは？

**SSH（Secure Shell）認証**は、GitHubをはじめとするリモートサーバーへ安全に接続するための仕組みです。パスワードの代わりに「鍵」を使って本人確認を行うため、Gitでのリモートリポジトリ操作やサーバー管理で日常的に使われています。

### なぜSSH認証を学ぶのか？

- **パスワード入力が不要になる**：一度設定すれば `git push` や `git pull` のたびに認証情報を入力する必要がなくなります
- **セキュリティが向上する**：秘密鍵はネットワーク上を一切流れないため、パスワード漏洩のリスクがありません
- **複数アカウント・複数サーバーの運用が楽になる**：`~/.ssh/config` を使えば、エイリアスだけで接続先を切り替えられます
- **業務でのサーバー運用に直結する**：開発用サーバーやcrontabの実行環境など、SSH接続は現場で頻出します

この記事では、公開鍵暗号方式の基礎から `ssh-keygen` による鍵ペアの作成、GitHubへの登録、HTTPS接続との違い、`~/.ssh/config` を用いた接続管理までを一通り学びます。

---

## 公開鍵暗号方式による認証の仕組み

SSH認証では、**「公開鍵（Public Key）」**と**「秘密鍵（Private Key）」**という2つでペアになった鍵を使います。

```text
[ 自分のPC (Client) ]                       [ GitHub / Remote Server ]
  ├── 秘密鍵 (id_ed25519)  ──(非公開)
  └── 公開鍵 (id_ed25519.pub) ───────────────>  ~/.ssh/authorized_keys
                                                    (またはGitHubアカウントのSSH Key)
```

- **公開鍵**：サーバー側（GitHubなど）に登録する鍵。公開しても安全です。
- **秘密鍵**：自分のPCに安全に保管する鍵。**絶対に他人に渡してはいけません**。

接続時には「チャレンジ・レスポンス方式」と呼ばれる手順で、秘密鍵を持っている本人であることを証明します。重要なのは、**秘密鍵そのものはネットワーク上を一切流れない**という点です。

::detail{slug="public-key-cryptography"}

---

## SSHキーペアの生成（ssh-keygen）

鍵ペアは `ssh-keygen` コマンドで作成します。現在推奨されているアルゴリズムは **Ed25519** です（従来のRSAよりも軽量かつ高セキュリティ）。

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

保存場所を聞かれたらデフォルトのまま `Enter`、パスフレーズはセキュリティ向上のため設定することを推奨します。生成後は `~/.ssh` の中に `id_ed25519`（秘密鍵）と `id_ed25519.pub`（公開鍵）の2つのファイルができます。

::detail{slug="ssh-keygen"}

---

## GitHubへの公開鍵の登録

生成した公開鍵の中身をコピーし、GitHubの **Settings → SSH and GPG keys** から登録します。

```bash
cat ~/.ssh/id_ed25519.pub
```

登録後は、以下のコマンドで接続テストができます。

```bash
ssh -T git@github.com
```

正しく設定できていれば、`Hi username! You've successfully authenticated...` というウェルカムメッセージが表示されます。

::detail{slug="github-registration"}

---

## HTTPS接続とSSH接続の違い

Gitでリポジトリを操作する際、**HTTPS** と **SSH** の2つのURLスタイルがあります。

| 比較項目 | HTTPS接続 | SSH接続 |
| :--- | :--- | :--- |
| リポジトリURL例 | `https://github.com/user/repo.git` | `git@github.com:user/repo.git` |
| 認証方式 | Personal Access Token / OAuth | 公開鍵・秘密鍵ペア |
| 設定の容易さ | 初回クローンが簡単 | 初回に鍵の生成と登録が必要 |
| 日常の使い勝手 | トークン管理が必要な場合あり | 鍵を配置すればパスワード入力不要 |

```bash
git remote set-url origin git@github.com:user/repo.git
```

::detail{slug="https-vs-ssh"}

---

## `~/.ssh/config` による接続管理

複数アカウントや複数サーバーを扱う場合は、`~/.ssh/config` を使うと接続がシンプルになります。

```text
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

こう書いておけば、`ssh github-work` や `git clone git@github-work:company/project.git` のようにエイリアスで接続できます。

::detail{slug="ssh-config"}

---

## 基本コマンドまとめ

| コマンド | 説明 | 使用例 |
|----------|------|--------|
| `ssh-keygen` | 鍵ペアを生成 | `ssh-keygen -t ed25519 -C "you@example.com"` |
| `cat` | 公開鍵の中身を表示 | `cat ~/.ssh/id_ed25519.pub` |
| `ssh -T` | 接続テスト | `ssh -T git@github.com` |
| `chmod` | 鍵ファイルの権限を設定 | `chmod 600 ~/.ssh/id_ed25519` |
| `git remote -v` | リモートURLを確認 | `git remote -v` |
| `git remote set-url` | リモートURLを変更 | `git remote set-url origin git@github.com:user/repo.git` |
| `ssh <alias>` | config のエイリアスで接続 | `ssh dev-server` |

---

## 実践演習：練習用の鍵を作って config に登録する

既存の鍵を上書きしないよう、練習専用の名前で鍵ペアを作成します。

> [!CAUTION]
> `ssh-keygen` の保存先に既存の鍵と同じパス（デフォルトの `~/.ssh/id_ed25519` など）を指定すると上書きされてしまいます。必ず `-f` で練習用の別名を指定してください。

```bash
# 1. 練習用の鍵ペアを作成（パスフレーズなし、練習用ファイル名）
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_practice -C "practice-key" -N ""

# 2. 生成されたファイルを確認
ls -la ~/.ssh/id_ed25519_practice*

# 3. 公開鍵の中身を表示
cat ~/.ssh/id_ed25519_practice.pub

# 4. ~/.ssh/config に練習用ホストを追記
cat << 'EOF' >> ~/.ssh/config

Host practice-host
    HostName example.com
    User practice
    IdentityFile ~/.ssh/id_ed25519_practice
EOF

# 5. config の内容を確認
cat ~/.ssh/config

# 6. 後片付け：練習用の鍵と config の追記を削除
rm ~/.ssh/id_ed25519_practice ~/.ssh/id_ed25519_practice.pub
```

`practice-host` は実在のサーバーではないため `ssh practice-host` は接続エラーになりますが、`~/.ssh/config` の書き方と `IdentityFile` の指定方法を体験できます。

---

## まとめ

- **SSH認証**は公開鍵と秘密鍵を使い、秘密鍵を転送せずに安全に認証を行う仕組みです
- **`ssh-keygen`** では現代的で安全な **Ed25519** 方式が推奨されます
- **HTTPSからSSHへの移行**により、毎回の認証負担が減り、作業効率とセキュリティが向上します
- **`~/.ssh/config`** を活用すると、複数アカウントやサーバーへの接続管理が劇的に楽になります

### 次のステップ

- [Git](/themes/01-web-basics/02-git) のリモート操作（`git clone` / `git push` / `git pull`）を、SSH接続で試してみましょう
- 複数のGitHubアカウントを使い分けている場合は、`~/.ssh/config` でアカウントごとに鍵を分離してみましょう

### 参考リソース

- [GitHub Docs: SSH での接続](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh)：公式のSSH設定ガイド
- [OpenSSH公式サイト](https://www.openssh.com/)：`ssh` / `ssh-keygen` の詳細な仕様
- [ssh_config(5) マニュアル](https://man.openbsd.org/ssh_config)：`~/.ssh/config` の全オプション一覧

---

お疲れさまでした！SSH認証を使いこなせるようになると、日々のGit操作がぐっとスムーズになります。
