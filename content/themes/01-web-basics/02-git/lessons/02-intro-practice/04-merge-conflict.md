---
title: "コンフリクトの解決"
order: 4
type: detail
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# コンフリクトの解決

## 解説

コンフリクト（conflict / 競合）とは、マージ時に**同じファイルの同じ箇所**が異なるブランチで変更されていて、Gitが自動的に統合できない状態のことです。

### コンフリクトが発生する条件

コンフリクトは以下のような場合に発生します。

```text
【main ブランチ】
index.html の3行目を「ようこそ」に変更

【feature ブランチ】
index.html の3行目を「Welcome」に変更
```

同じファイルの同じ行を、それぞれのブランチで異なる内容に変更しているため、Gitはどちらを採用すればよいか判断できません。

### コンフリクトが発生しない場合

- 異なるファイルを編集した場合
- 同じファイルでも異なる箇所を編集した場合
- 一方のブランチだけがファイルを変更した場合

### コンフリクトマーカー

コンフリクトが発生すると、Git はファイル内に**コンフリクトマーカー**を挿入します。

```text
<<<<<<< HEAD
ようこそ、私のサイトへ
=======
Welcome to my site
>>>>>>> feature/english
```

| マーカー | 意味 |
|----------|------|
| `<<<<<<< HEAD` | 現在のブランチ（マージ先）の変更の開始 |
| `=======` | 変更の区切り |
| `>>>>>>> feature/english` | マージ元のブランチの変更の終了 |

---

## コマンドサンプル

### コンフリクトの発生からマージ完了まで

```bash
# 1. マージを実行（コンフリクト発生）
git merge feature/english

# 2. コンフリクトの状態を確認
git status

# 3. コンフリクトが発生したファイルを編集して解決
# （エディタでコンフリクトマーカーを削除し、正しい内容にする）

# 4. 解決したファイルをステージング
git add index.html

# 5. マージコミットを作成
git commit -m "feature/english をマージ: 日英対応に変更"
```

### マージを中止する

```bash
# コンフリクトが複雑すぎる場合、マージ前の状態に戻す
git merge --abort
```

### コンフリクト中の差分を確認する

```bash
# コンフリクト箇所の差分を表示
git diff

# マージ元との差分
git diff --ours

# マージ先との差分
git diff --theirs
```

### コンフリクトしているファイルの一覧

```bash
# Unmerged のファイルを表示
git diff --name-only --diff-filter=U
```

---

## 実行結果

### コンフリクト発生時の出力

```text
$ git merge feature/english
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

### `git status` の出力

```text
$ git status
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   index.html

no changes added to commit (use "git add" to track)
```

### コンフリクトファイルの中身

```text
$ cat index.html
<!DOCTYPE html>
<html>
<head>
    <title>My Site</title>
</head>
<body>
<<<<<<< HEAD
    <h1>ようこそ、私のサイトへ</h1>
    <p>このサイトは日本語です。</p>
=======
    <h1>Welcome to my site</h1>
    <p>This site is in English.</p>
>>>>>>> feature/english
</body>
</html>
```

### 解決後のファイル内容（例: 両方の内容を採用）

```text
<!DOCTYPE html>
<html>
<head>
    <title>My Site</title>
</head>
<body>
    <h1>ようこそ / Welcome</h1>
    <p>このサイトは日本語と英語に対応しています。</p>
    <p>This site supports Japanese and English.</p>
</body>
</html>
```

### 解決後のコミット

```text
$ git add index.html
$ git commit -m "コンフリクトを解決: 日英両対応に変更"
[main 8a9b0c1] コンフリクトを解決: 日英両対応に変更
```

---

## よくある間違い

### 1. コンフリクトマーカーを残したままコミットする

```html
<!-- NG: マーカーが残っている -->
<body>
<<<<<<< HEAD
    <h1>ようこそ</h1>
=======
    <h1>Welcome</h1>
>>>>>>> feature/english
</body>
```

**対処法**: コミット前にファイル全体を検索し、`<<<<<<<`、`=======`、`>>>>>>>` が残っていないか確認する。

```bash
# コンフリクトマーカーが残っていないか検索
grep -rn "<<<<<<< \|======= \|>>>>>>> " .
```

### 2. 一方の変更だけを残して、もう一方を無視する

コンフリクトを「片方を消すだけ」で解決すると、もう一方の作業が失われます。必ず**両方の変更内容を確認**してから判断しましょう。

### 3. コンフリクト中にパニックになる

コンフリクトは怖いものではありません。どうしても分からなくなったら `git merge --abort` でいつでもマージ前の状態に戻れます。

### 4. `git add` を忘れてコミットしようとする

```bash
# NG: 解決後に add せずに commit しようとする
$ git commit
error: Committing is not possible because you have unmerged files.
```

**対処法**: 解決したファイルは必ず `git add` でステージングしてからコミットする。

---

## 実用例

### コンフリクト解決の基本フロー

```bash
# 1. マージ実行
git merge feature/new-design

# 2. コンフリクト発生 → 状態確認
git status

# 3. コンフリクトファイルをエディタで開く
code index.html   # VS Code の場合

# 4. コンフリクトマーカーを削除し、正しい内容に編集
# 5. 編集が終わったらステージング
git add index.html

# 6. 他にコンフリクトファイルがないか確認
git status

# 7. 全て解決したらコミット
git commit -m "feature/new-design をマージ: デザインリニューアル"
```

### コンフリクトを予防するためのプラクティス

| プラクティス | 説明 |
|-------------|------|
| こまめにマージする | `main` の変更を定期的に取り込み、差分を小さくする |
| 小さなコミット | 大きな変更を避け、影響範囲を限定する |
| チームでの声掛け | 同じファイルを編集する場合は事前に共有する |
| ファイルの分割 | 1つのファイルに多くの機能を詰め込まない |
| コードフォーマッタ | フォーマットの差異によるコンフリクトを防ぐ |

---

## 実習

### 課題1: コンフリクトを発生させて解決する

以下の手順でコンフリクトを体験してみましょう。

```bash
# 1. リポジトリを作成
mkdir conflict-practice && cd conflict-practice
git init

# 2. 初期ファイルを作成
echo "こんにちは" > message.txt
git add message.txt
git commit -m "初期メッセージ"

# 3. feature ブランチを作成して変更
git switch -c feature/formal
echo "こんにちは。お世話になっております。" > message.txt
git add message.txt
git commit -m "丁寧な挨拶に変更"

# 4. main に戻って別の変更
git switch main
echo "やあ！元気？" > message.txt
git add message.txt
git commit -m "カジュアルな挨拶に変更"

# 5. マージしてコンフリクトを発生させる
git merge feature/formal

# 6. コンフリクトを解決してみましょう！
```

### 課題2: `git merge --abort` を試す

1. 課題1と同様にコンフリクトを発生させる
2. `git merge --abort` でマージを中止する
3. `git status` でクリーンな状態に戻ったことを確認する
4. 再度マージを試み、今度はコンフリクトを解決してコミットする

### 課題3: 複数ファイルのコンフリクト

1. `index.html` と `style.css` の2ファイルを作成してコミットする
2. `feature/redesign` ブランチで両方のファイルを変更する
3. `main` でも両方のファイルを変更する
4. マージしてコンフリクトを解決する（2ファイル分）
5. すべてのコンフリクトマーカーが消えていることを確認する
