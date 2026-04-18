---
title: "ステージングとコミット"
order: 11
type: reference
category: kiso
difficulty: beginner
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# ステージングとコミット

## 解説

Gitの最も基本的で重要な操作が「ステージング」と「コミット」です。この2つの操作を理解することが、Git習得の第一歩です。

### Gitの3つの領域（復習）

```text
┌──────────────────┐   git add   ┌──────────────────┐  git commit  ┌──────────────────┐
│   作業ディレクトリ  │ ────────→  │  ステージングエリア  │ ────────→  │    リポジトリ     │
│  (Working Tree)   │            │  (Staging Area)   │             │  (Repository)    │
│                   │            │  = インデックス     │             │                  │
│  ファイルを編集する  │            │  コミット対象を選ぶ  │             │  履歴として記録    │
└──────────────────┘            └──────────────────┘             └──────────────────┘
```

### なぜステージングエリアがあるのか？

「編集したファイルを直接コミットすればいいのでは？」と思うかもしれません。ステージングエリアが存在する理由は以下の通りです。

1. **コミットの粒度を制御できる** — 複数のファイルを編集しても、関連する変更だけを選んでコミットできる
2. **レビューの機会を得られる** — コミット前に「何をコミットするか」を確認できる
3. **部分的なコミットが可能** — 1つのファイル内でも、一部の変更だけをステージングできる（`git add -p`）

### コミットメッセージの書き方

良いコミットメッセージは、プロジェクトの履歴を理解しやすくします。

```text
【基本ルール】
1. 1行目：変更の要約（50文字以内が推奨）
2. 2行目：空行
3. 3行目以降：詳細な説明（必要な場合）

【推奨される形式】
・命令形で書く（英語の場合）: "Add feature" ○ / "Added feature" △
・日本語の場合は「〜を追加」「〜を修正」のような体言止め
・何を変更したか（What）と、なぜ変更したか（Why）を書く
```

---

## コマンドサンプル

### git add — ステージングに追加

```bash
# 特定のファイルをステージングに追加
git add index.html

# 複数のファイルを指定
git add index.html style.css script.js

# カレントディレクトリ以下のすべての変更をステージング
git add .

# すべての変更をステージング（削除も含む）
git add -A
git add --all

# 特定の拡張子のファイルをまとめてステージング
git add *.html
git add src/*.js

# ディレクトリ単位でステージング
git add src/
```

### git add -p — 部分的なステージング

```bash
# 変更を塊（hunk）ごとに確認しながらステージング
git add -p

# 対話モードでの選択肢：
# y - このhunkをステージング
# n - このhunkをスキップ
# s - このhunkをさらに小さく分割
# q - 終了（残りはすべてスキップ）
# ? - ヘルプを表示
```

### git commit — コミット

```bash
# メッセージ付きでコミット
git commit -m "ログイン画面のレイアウトを修正"

# エディタを開いてメッセージを記述
git commit

# 複数行のメッセージを指定
git commit -m "ログイン機能を追加

- ユーザー名とパスワードによる認証
- セッション管理の実装
- ログインエラー時のメッセージ表示"

# add と commit を同時に行う（追跡済みファイルのみ）
git commit -am "CSSのスタイルを調整"
```

### ステージングの取り消し

```bash
# 特定のファイルをステージングから取り消す
git restore --staged index.html

# すべてのステージングを取り消す
git restore --staged .

# 古いGitでの書き方（非推奨だが動作する）
git reset HEAD index.html
```

---

## 実行結果

```text
$ echo "Hello, Git!" > hello.txt
$ echo "console.log('hello');" > app.js

$ git status
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	app.js
	hello.txt

nothing added to commit but untracked files present (use "git add" to track)

$ git add hello.txt

$ git status
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   hello.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	app.js

$ git add app.js
$ git commit -m "最初のファイルを追加"
[main (root-commit) a1b2c3d] 最初のファイルを追加
 2 files changed, 2 insertions(+)
 create mode 100644 app.js
 create mode 100644 hello.txt

$ git log
commit a1b2c3d4e5f6789012345678901234567890abcd (HEAD -> main)
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 15 10:30:00 2024 +0900

    最初のファイルを追加
```

### git add -p の実行結果

```text
$ git add -p
diff --git a/app.js b/app.js
index abc1234..def5678 100644
--- a/app.js
+++ b/app.js
@@ -1,3 +1,5 @@
 console.log('hello');
+console.log('world');
+
+const greeting = 'Hello, World!';
(1/1) Stage this hunk [y,n,q,a,d,s,e,?]? s
Split into 2 hunks.
@@ -1,3 +1,4 @@
 console.log('hello');
+console.log('world');
(1/2) Stage this hunk [y,n,q,a,d,j,J,g,/,e,?]? y
@@ -1,3 +2,4 @@
+
+const greeting = 'Hello, World!';
(2/2) Stage this hunk [y,n,q,a,d,K,g,/,e,?]? n
```

---

## よくある間違い

### 1. git add を忘れてコミットする

```bash
# ❌ ファイルを編集したが add していない
$ echo "新しい内容" > new-file.txt
$ git commit -m "新しいファイルを追加"
# → 何もコミットされない！

# ✅ まず add してからコミット
$ git add new-file.txt
$ git commit -m "新しいファイルを追加"
```

### 2. git add . と git add -A の違いを理解していない

```text
git add .    → カレントディレクトリ以下の新規・変更ファイルを追加
               ※ 上位ディレクトリの変更は含まない

git add -A   → リポジトリ全体の新規・変更・削除をすべて追加
               ※ どのディレクトリにいても全体が対象

【推奨】プロジェクトルートで git add . を使うのが一般的
```

### 3. コミットメッセージが不適切

```bash
# ❌ 悪いコミットメッセージの例
git commit -m "修正"
git commit -m "update"
git commit -m "fix"
git commit -m "aaa"
git commit -m "作業中"

# ✅ 良いコミットメッセージの例
git commit -m "ログインフォームのバリデーションを追加"
git commit -m "ヘッダーのレスポンシブ対応を修正"
git commit -m "パスワードリセット機能を実装"
```

### 4. git commit -am で新規ファイルが含まれると思う

```bash
# ❌ -am は「追跡済みファイル」の変更のみ
$ echo "新規ファイル" > new.txt
$ git commit -am "すべて追加"
# → new.txt は追跡されていないので含まれない！

# ✅ 新規ファイルは必ず git add が必要
$ git add new.txt
$ git commit -m "新規ファイルを追加"
```

---

## 実用例

### 関連する変更だけをまとめてコミットする

```bash
# 複数のファイルを編集した後、機能ごとにコミットを分ける

# ログイン機能に関するファイルだけコミット
git add src/login.js src/auth.js tests/login.test.js
git commit -m "ログイン機能を実装"

# スタイルの変更は別のコミットにする
git add src/styles/login.css src/styles/common.css
git commit -m "ログイン画面のスタイルを調整"
```

### コミット前に変更内容を確認する

```bash
# ステージング前に変更を確認
git diff

# ステージング後にコミット対象を確認
git diff --staged

# ステータスで全体像を把握
git status

# 問題なければコミット
git commit -m "確認済みの変更をコミット"
```

### 複数行のコミットメッセージを書く

```bash
# 方法1：エディタを使う（推奨）
git commit
# → エディタが開くので、詳細なメッセージを記述

# 方法2：-m オプションで改行を含める
git commit -m "ユーザー認証機能を追加

- JWTトークンによる認証を実装
- リフレッシュトークンの自動更新
- ログアウト時のトークン無効化
- 認証エラー時のリダイレクト処理

Closes #42"
```

---

## 実習

### 課題1：基本的なステージングとコミット

1. 練習用リポジトリで3つのファイルを作成してください
2. 1つずつ `git add` して、それぞれの段階で `git status` を確認してください
3. すべてステージングしたら `git commit` してください

```bash
echo "# 自己紹介" > profile.md
echo "好きなもの：プログラミング" > likes.txt
echo "console.log('hello');" > app.js

# ここから git add と git status を繰り返す
```

### 課題2：部分的なコミットを試す

1. 既存のファイルに複数の変更を加えてください
2. `git add -p` を使って、一部の変更だけをステージングしてみてください
3. `git diff --staged` でステージングされた変更を確認してください
4. コミットしてください

### 課題3：良いコミットメッセージを書く

以下の状況に合ったコミットメッセージを考えてみましょう。

1. トップページにナビゲーションバーを追加した
2. ログイン画面でメールアドレスの形式チェックが動いていなかったのを修正した
3. データベースの接続先を環境変数から読み込むようにリファクタリングした

### 課題4：ステージングの取り消し

1. ファイルを変更して `git add` してください
2. `git status` でステージングされていることを確認してください
3. `git restore --staged ファイル名` でステージングを取り消してください
4. `git status` で元に戻ったことを確認してください
