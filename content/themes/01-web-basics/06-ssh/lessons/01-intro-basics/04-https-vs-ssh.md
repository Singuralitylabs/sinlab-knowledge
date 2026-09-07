---
title: "HTTPS接続とSSH接続の違い"
order: 4
type: detail
difficulty: beginner
tags: [ssh, git, github]
estimatedMinutes: 5
status: published
---
# HTTPS接続とSSH接続の違い

## 解説

Gitでリモートリポジトリをクローン・操作する際、URLには**HTTPS**形式と**SSH**形式の2種類があります。どちらもリポジトリの中身は同じですが、認証方法と日常の使い勝手が異なります。

| 比較項目 | HTTPS接続 | SSH接続 |
| :--- | :--- | :--- |
| リポジトリURL例 | `https://github.com/user/repo.git` | `git@github.com:user/repo.git` |
| 認証方式 | Personal Access Token (PAT) / OAuth | 公開鍵・秘密鍵ペア |
| 設定の容易さ | 初回クローンが簡単（鍵設定不要） | 初回に鍵の生成と登録が必要 |
| 日常の使い勝手 | トークン管理や再認証が必要な場合あり | 鍵が配置されていればパスワード入力不要でスムーズ |
| セキュリティ | トークンの有効期限管理が必要 | 秘密鍵を厳重管理していれば強固で安全 |

**結論**：一時的に1回だけクローンしたい場合はHTTPSで十分ですが、日常的にpush/pullを繰り返す開発環境では、SSHに切り替えておくと快適です。

---

## コマンドサンプル

```bash
# 現在のリモートURLを確認する
git remote -v

# HTTPS形式でクローンする
git clone https://github.com/user/repo.git

# SSH形式でクローンする
git clone git@github.com:user/repo.git

# 既存リポジトリのリモートURLをHTTPSからSSHへ変更する
git remote set-url origin git@github.com:user/repo.git

# 逆にSSHからHTTPSへ戻す場合
git remote set-url origin https://github.com/user/repo.git
```

---

## 実行結果

```text
$ git remote -v
origin  https://github.com/user/repo.git (fetch)
origin  https://github.com/user/repo.git (push)

$ git remote set-url origin git@github.com:user/repo.git

$ git remote -v
origin  git@github.com:user/repo.git (fetch)
origin  git@github.com:user/repo.git (push)

$ git push
Everything up-to-date
```

`git remote set-url` の実行直後は何も出力されませんが、`git remote -v` で確認すると、URLが `git@github.com:...` 形式に変わっていることがわかります。

---

## よくある間違い

### 1. URLの書式を混同する

```text
❌ SSH形式のつもりで https://git@github.com/user/repo.git のように書いてしまう

✅ SSH形式は `git@github.com:user/repo.git`（コロン区切り、スキームなし）
   HTTPS形式は `https://github.com/user/repo.git`（スラッシュ区切り）
```

### 2. SSH設定をしていないのにSSH形式のURLでクローンする

```bash
# ❌ 鍵の登録が済んでいない状態でSSH形式を使う
$ git clone git@github.com:user/repo.git
git@github.com: Permission denied (publickey).

# ✅ 事前に ssh-keygen で鍵を作り、GitHubに登録してから使う
$ ssh -T git@github.com   # まず疎通確認
$ git clone git@github.com:user/repo.git
```

### 3. どちらか一方が絶対に正しいと思い込む

```text
❌ 「SSHの方が高機能だからHTTPSは使うべきではない」と決めつける

✅ CI環境やDockerコンテナなど、鍵の管理が難しい場所ではHTTPS+トークンの方が
   都合が良い場合もある。用途に応じて選ぶのが実務では一般的
```

---

## 実用例

### チームのリポジトリをSSHに統一する

```bash
# 複数のリポジトリのURLを一括で確認する（bash/zsh）
for dir in ~/projects/*/; do
  (cd "$dir" && echo "$dir: $(git remote get-url origin 2>/dev/null)")
done
```

こうして現状を確認したうえで、HTTPSのままのリポジトリだけ `git remote set-url` でSSHへ切り替えると、認証周りの管理が統一されます。

### CI/CDではHTTPS + トークンを使うことが多い

```text
GitHub Actions などのCI環境では、秘密鍵を安全に配布する手間を避けるため、
リポジトリに自動発行される GITHUB_TOKEN（HTTPSベースの認証）を使うのが一般的です。
ローカル開発環境ではSSH、CI環境ではHTTPS+トークン、という使い分けも実務ではよく見られます。
```

---

## 実習

### 課題1：URLの形式を見分ける

以下のURLがHTTPS形式かSSH形式か答えてください。

1. `https://github.com/octocat/Hello-World.git`
2. `git@github.com:octocat/Hello-World.git`
3. `ssh://git@github.com/octocat/Hello-World.git`

### 課題2：実際に切り替えてみる

1. 手元の任意のリポジトリで `git remote -v` を実行し、現在の形式を確認してください
2. HTTPSの場合はSSH形式へ、SSHの場合はHTTPS形式へ、`git remote set-url` で切り替えてください
3. 切り替え後に `git fetch` を実行し、正常に通信できることを確認してください
4. 元の形式に戻しておきましょう
