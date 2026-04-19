---
title: "解説記事 (実践編)"
order: 2
type: lecture
difficulty: intermediate
tags: [git, intermediate, concept]
estimatedMinutes: 15
status: published
---
# Git入門 実践編

## はじめに

基礎編では、Gitの基本的な概念とローカルでの操作を学びました。実践編では、**ブランチ操作**、**コンフリクトの解消**、**リモートリポジトリとの連携**を中心に、実際の開発現場で使われるGitの操作を学びます。

---

## ブランチ操作

### 1. ブランチの基本（git branch / git switch）

ブランチ（branch）は、開発の流れを分岐させる機能です。メインの開発ラインに影響を与えずに、新機能の開発やバグ修正を行えます。

```text
          feature-login
         /              \
main ──●──●──●──●──●──●──●──●── main
              \        /
               fix-bug
```

```bash
# ブランチの作成と切り替え（推奨）
git switch -c feature-login

# 従来の方法
git checkout -b feature-login

# ブランチ一覧
git branch

# ブランチの削除
git branch -d feature-login
```

**ポイント**
- `git switch` はGit 2.23以降で使えるブランチ切り替え専用コマンドです
- ブランチ名は内容がわかる名前を付けましょう（例：`feature-login`、`fix-header-bug`）

---

### 2. マージの基本（git merge）

ブランチでの作業が完了したら、メインのブランチに統合（マージ）します。

```bash
git switch main
git merge feature-login
```

**Fast-Forward マージ**：mainに新しいコミットがない場合、履歴が一直線に統合されます。

```text
main ──●──●──●──● (fast-forward)
```

**3-Way マージ**：mainにも新しいコミットがある場合、マージコミットが作成されます。

```text
main ──●──●──●──────●（マージコミット）
             \     /
              ●──●
```

`git merge --no-ff feature-login` でFast-Forwardを無効にし、常にマージコミットを作成できます。

---

### 3. コンフリクトの解消

同じファイルの同じ箇所を変更した場合、マージ時にコンフリクト（衝突）が発生します。

**コンフリクトマーカー**

```text
<<<<<<< HEAD
<h1>メインブランチの変更</h1>
=======
<h1>フィーチャーブランチの変更</h1>
>>>>>>> feature-login
```

| マーカー | 説明 |
|----------|------|
| `<<<<<<< HEAD` | 現在のブランチの内容 |
| `=======` | 変更の区切り |
| `>>>>>>> branch` | マージするブランチの内容 |

**解消手順**

```bash
# 1. コンフリクトファイルを確認
git status

# 2. ファイルを編集してマーカーを削除し、正しい内容にする

# 3. 解消したファイルをステージング
git add index.html

# 4. マージコミットを作成
git commit -m "コンフリクトを解消"
```

---

## リモートリポジトリとの連携

### 4. リモートリポジトリの基本

```text
ローカルリポジトリ ←→ リモートリポジトリ（GitHub）
    git push →           ← git pull / git fetch
```

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/username/repo.git
git remote -v          # リモートの確認

# ローカルの変更をリモートに送信
git push -u origin main     # 初回（上流ブランチ設定）
git push                    # 2回目以降

# リモートの変更を取得して統合
git pull origin main

# リモートの変更を取得のみ（マージはしない）
git fetch origin
git merge origin/main       # 確認後にマージ
```

| コマンド | 取得 | マージ | 安全性 |
|----------|:----:|:------:|:------:|
| `git pull` | する | する | やや低い |
| `git fetch` | する | しない | 高い |

---

### 5. GitHub入門

**アカウント作成**：[github.com](https://github.com) でSign upします。

**リポジトリの作成**：右上の「+」 → 「New repository」から作成します。

**SSH認証の設定**

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# 生成された公開鍵をGitHubのSettings > SSH keysで登録

ssh -T git@github.com   # 接続テスト
```

---

### 6. GitHubの基本操作（fork / clone / push）

**git clone** - リモートリポジトリをローカルにコピー

```bash
git clone https://github.com/username/repo.git
git clone git@github.com:username/repo.git     # SSH
```

**Fork** - 他のユーザーのリポジトリを自分のアカウントにコピー（GitHub上で操作）

```bash
# フォーク元をupstreamとして追加
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git merge upstream/main
```

---

## 開発ワークフロー

### 基本的な開発の流れ

```text
┌──────────────────────────────────────────┐
│            開発ワークフロー                 │
├──────────────────────────────────────────┤
│                                          │
│  1. mainを最新にする                       │
│     git switch main && git pull           │
│              │                           │
│              ▼                           │
│  2. 作業ブランチを作成                      │
│     git switch -c feature-xxx            │
│              │                           │
│              ▼                           │
│  3. 機能を開発してコミット                   │
│     git add . → git commit -m "説明"     │
│              │                           │
│              ▼                           │
│  4. リモートにプッシュ                      │
│     git push -u origin feature-xxx       │
│              │                           │
│              ▼                           │
│  5. プルリクエストを作成（GitHub上）          │
│              │                           │
│              ▼                           │
│  6. レビュー → 承認 → マージ               │
│              │                           │
│              ▼                           │
│  7. ローカルのmainを更新                    │
│     git switch main && git pull           │
│              │                           │
│              ▼                           │
│  8. 不要なブランチを削除                     │
│     git branch -d feature-xxx            │
│                                          │
└──────────────────────────────────────────┘
```

---

## 実践コマンドまとめ

| コマンド | 説明 | 使用例 |
|----------|------|--------|
| `git branch` | ブランチの一覧・作成 | `git branch feature-login` |
| `git switch -c` | ブランチの作成と切り替え | `git switch -c feature-login` |
| `git merge` | ブランチを統合 | `git merge feature-login` |
| `git remote` | リモートリポジトリの管理 | `git remote add origin URL` |
| `git push` | リモートに変更を送信 | `git push origin main` |
| `git pull` | リモートの変更を取得・統合 | `git pull origin main` |
| `git fetch` | リモートの変更を取得 | `git fetch origin` |
| `git clone` | リポジトリをコピー | `git clone URL` |

---

## よくある質問

### Q. push が拒否された場合は？

```bash
git pull origin main    # リモートの変更を取り込む
git push origin main    # 再度プッシュ
```

---

## まとめ

実践編では、ブランチ操作、コンフリクトの解消、リモートリポジトリとの連携を学びました。

ブランチを使った開発は「**作成 → 作業 → マージ**」のサイクルです。リモートリポジトリとの連携は「**push（送信） → pull（受信）**」が基本です。

### 次のステップ

- 応用編でリベースやスタッシュなどの高度な操作を学びましょう
- GitHubでオープンソースプロジェクトのコードを読んでみましょう

### 参考リソース

- [Pro Git - ブランチの章](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E6%A9%9F%E8%83%BD-%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%81%A8%E3%81%AF)：ブランチの詳細な解説
- [GitHub Docs](https://docs.github.com/ja)：GitHub公式ドキュメント（日本語）

---

お疲れさまでした！実践編の内容をマスターしたら、応用編に進みましょう。
