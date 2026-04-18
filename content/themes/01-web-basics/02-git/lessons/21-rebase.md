---
title: "リベース"
order: 21
type: reference
category: jissen
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# リベース

## 解説

リベース（rebase）とは、あるブランチのコミットを**別のブランチの先端に付け替える操作**です。マージと同じく変更を統合する手段ですが、**履歴を一直線にできる**のが特徴です。

### マージとリベースの違い

#### マージの場合

```text
【マージ前】
main:     A---B---E
               \
feature:        C---D

【マージ後】
main:     A---B---E---M  ← マージコミット
               \       /
feature:        C---D
```

マージは分岐の履歴を保持し、マージコミットを作成します。

#### リベースの場合

```text
【リベース前】
main:     A---B---E
               \
feature:        C---D

【リベース後】
main:     A---B---E
                   \
feature:            C'---D'  ← コミットが付け替えられる
```

リベースは feature ブランチのコミットを main の先端に「付け替え」ます。`C'` と `D'` は内容は同じですが、新しいコミットとして作り直されます。

### リベースのメリット

- **きれいな履歴**: コミット履歴が一直線になり読みやすい
- **不要なマージコミットがない**: 分岐・統合の痕跡がなくなる
- **git log が見やすい**: 変更の流れを追いやすくなる

### リベースの注意点

- **コミットのハッシュが変わる**: 既存のコミットが新しいコミットに作り直される
- **共有ブランチでは使わない**: 他の人が同じブランチを使っている場合は禁止

---

## コマンドサンプル

### 基本的なリベース

```bash
# 1. feature ブランチに切り替え
git switch feature/login

# 2. main ブランチの最新をベースにリベース
git rebase main
```

### リベース後のマージ（Fast-forward になる）

```bash
# リベース後に main に切り替えてマージ
git switch main
git merge feature/login
# → Fast-forward マージになる
```

### インタラクティブリベース

```bash
# 直近3つのコミットを編集する
git rebase -i HEAD~3
```

インタラクティブリベースでは、エディタが開き以下のような内容が表示されます。

```text
pick a1b2c3d ログインフォーム作成
pick e4f5g6h バリデーション追加
pick i7j8k9l スタイル修正

# コマンド:
# p, pick   = そのまま使う
# r, reword = コミットメッセージを変更
# e, edit   = コミットを編集
# s, squash = 前のコミットに統合（メッセージも統合）
# f, fixup  = 前のコミットに統合（メッセージは破棄）
# d, drop   = コミットを削除
```

### リベースの中止と継続

```bash
# リベース中にコンフリクトが発生した場合

# コンフリクトを解決して続行
git add <解決したファイル>
git rebase --continue

# リベースを中止（元の状態に戻る）
git rebase --abort

# 現在のコミットをスキップ
git rebase --skip
```

---

## 実行結果

### 基本的なリベースの出力

```text
$ git switch feature/login
Switched to branch 'feature/login'

$ git rebase main
Successfully rebased and updated refs/heads/feature/login.
```

### コンフリクトが発生した場合の出力

```text
$ git rebase main
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
error: could not apply a1b2c3d... ログインフォーム作成
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
hint: You can instead skip this commit: "git rebase --skip".
hint: To abort and get back to the state before "git rebase", run "git rebase --abort".
Could not apply a1b2c3d... ログインフォーム作成
```

### インタラクティブリベースでの squash 例

3つのコミットを1つにまとめる場合：

```text
# エディタでの編集
pick a1b2c3d ログインフォーム作成
squash e4f5g6h バリデーション追加
squash i7j8k9l スタイル修正
```

保存すると、コミットメッセージ編集画面が表示されます。

```text
$ git rebase -i HEAD~3
[detached HEAD 1a2b3c4] ログイン機能の実装
 Date: Mon Jan 15 10:00:00 2024 +0900
 3 files changed, 120 insertions(+)
Successfully rebased and updated refs/heads/feature/login.
```

### リベース後のログ

```text
$ git log --oneline --graph --all
* 1a2b3c4 (HEAD -> feature/login) ログイン機能の実装
* 9f8e7d6 (main) 初期セットアップ完了
* 5a4b3c2 プロジェクト作成
```

履歴が一直線になっています。

---

## よくある間違い

### 1. 共有ブランチをリベースする（最も危険）

```bash
# NG: 他の人も使っている main ブランチをリベース
git switch main
git rebase feature/login
# → 他のメンバーの履歴と合わなくなり大問題！
```

**黄金ルール**: 他の人と共有しているブランチ（`main`、`develop` など）は**絶対にリベースしない**。リベースするのは自分だけが使っているブランチに限定する。

### 2. リベース後に `git push` が失敗する

```bash
# リベース後はリモートと履歴が異なるため通常の push は失敗する
$ git push origin feature/login
! [rejected]        feature/login -> feature/login (non-fast-forward)
```

**対処法**: 自分専用のブランチであれば `git push --force-with-lease` を使う。ただし、共有ブランチでは絶対に force push しない。

```bash
# 自分専用のブランチでのみ使用
git push --force-with-lease origin feature/login
```

### 3. リベースとマージの使い分けが分からない

| 状況 | 推奨 |
|------|------|
| 自分の feature ブランチを最新の main に追従 | リベース |
| feature ブランチを main に統合 | マージ |
| 共有ブランチの更新 | マージ |
| コミット履歴を整理したい | インタラクティブリベース |

### 4. コンフリクト解決後に `git add` を忘れる

```bash
# NG: add せずに continue する
$ git rebase --continue
error: You must edit all merge conflicts and then mark them as resolved using git add

# OK: add してから continue
$ git add index.html
$ git rebase --continue
```

---

## 実用例

### feature ブランチを最新の main に追従させる

```bash
# 1. main を最新にする
git switch main
git pull origin main

# 2. feature ブランチに切り替え
git switch feature/user-profile

# 3. main の最新変更をベースにリベース
git rebase main

# 4. コンフリクトがあれば解決
# （ファイルを編集）
git add <解決したファイル>
git rebase --continue

# 5. リベース後にリモートを更新（自分専用ブランチの場合のみ）
git push --force-with-lease origin feature/user-profile
```

### インタラクティブリベースでコミットを整理する

開発中に細かく行ったコミットを、意味のある単位にまとめてからマージする手法です。

```bash
# 直近5つのコミットを整理
git rebase -i HEAD~5

# エディタで以下のように編集：
# pick   abc1234 ユーザーモデル作成
# squash def5678 typo修正
# squash ghi9012 テスト追加
# pick   jkl3456 API エンドポイント作成
# squash mno7890 エラーハンドリング追加

# → 5つのコミットが2つのきれいなコミットにまとまる
```

### リベースワークフロー（推奨フロー）

```bash
# 1. main から feature ブランチを作成
git switch main
git pull origin main
git switch -c feature/search

# 2. 開発（こまめにコミット）
git commit -m "検索フォームの UI 作成"
git commit -m "検索ロジック実装"
git commit -m "typo修正"
git commit -m "テスト追加"

# 3. main の最新を取り込み
git rebase main

# 4. コミットを整理
git rebase -i HEAD~4

# 5. main にマージ
git switch main
git merge feature/search

# 6. ブランチ削除
git branch -d feature/search
```

---

## 実習

### 課題1: 基本的なリベース

1. リポジトリを作成し、`main` で2つコミットする
2. `feature/hello` ブランチを作成し、2つコミットする
3. `main` に戻って1つコミットする
4. `feature/hello` に切り替えて `git rebase main` を実行する
5. `git log --graph --oneline --all` で履歴が一直線になることを確認する

```bash
mkdir rebase-practice && cd rebase-practice
git init
echo "v1" > file.txt && git add . && git commit -m "main: 1st commit"
echo "v2" >> file.txt && git add . && git commit -m "main: 2nd commit"

git switch -c feature/hello
echo "hello" > hello.txt && git add . && git commit -m "feature: hello追加"
echo "world" >> hello.txt && git add . && git commit -m "feature: world追加"

git switch main
echo "v3" >> file.txt && git add . && git commit -m "main: 3rd commit"

# ここからリベースを試してみましょう！
```

### 課題2: インタラクティブリベースで squash

1. ブランチ上で4つの細かいコミットを行う
2. `git rebase -i HEAD~4` で2つのコミットにまとめる
3. まとめたコミットのメッセージが適切になっていることを確認する

### 課題3: リベース中のコンフリクト解決

1. `main` と `feature` で同じファイルの同じ行を変更する
2. `git rebase main` でコンフリクトを発生させる
3. コンフリクトを解決し、`git rebase --continue` で完了させる
