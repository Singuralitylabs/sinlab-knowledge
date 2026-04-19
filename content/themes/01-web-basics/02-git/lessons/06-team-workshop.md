---
title: "チーム開発の進め方"
order: 6
type: lecture
difficulty: intermediate
tags: [git, github, intermediate, tutorial]
estimatedMinutes: 30
status: published
---
# GitHubチーム開発 ハンズオン手順書

## 今日の目標

GitHub Flowに沿ったチーム開発の基本フロー（ブランチ → コミット → push → PR → マージ）をひと通り体験します。

```text
【GitHub Flow】

main ──●──────────────────────────●── 常にデプロイ可能
          \                      /
add/名前   ●──●──●  push → PR → レビュー → マージ
```

---

## 事前準備

### 1. 練習用リポジトリをforkする

1. 講師から共有されたリポジトリURL（`github-team-practice`）をブラウザで開く
2. 画面右上の **Fork** ボタンをクリック
3. 自分のアカウントにforkする（設定はデフォルトのままでOK）
4. **Create fork** をクリック

### 2. ローカルにcloneする

forkしたリポジトリのURLをコピーして、以下のコマンドを実行します。

```bash
# 自分のアカウントのリポジトリをclone
git clone https://github.com/あなたのアカウント名/github-team-practice.git

# ディレクトリに移動
cd github-team-practice
```

### 3. 現在の状態を確認する

```bash
git log --oneline
git branch
ls contributors/
```

```text
実行結果の例：
$ git log --oneline
a1b2c3d Initial commit

$ git branch
* main

$ ls contributors/
example.md
```

---

## Step 1：ローカルでマージを体験する

ブランチを作って変更し、ローカルのmainにマージするまでを体験します。

### ブランチを作成して変更する

```bash
# 練習用ブランチを作成して切り替え
git switch -c test/merge-practice

# README.md に1行追加（エディタで編集してもOK）
echo "# マージ練習中" >> practice.md

# 変更をステージングしてコミット
git add practice.md
git commit -m "マージ練習用ファイルを追加"
```

### コミット履歴を確認する

```bash
git log --oneline
```

```text
実行結果の例：
$ git log --oneline
9f3e1a2 マージ練習用ファイルを追加
a1b2c3d Initial commit
```

### mainにマージする

```bash
# mainに切り替え
git switch main

# 現在mainにはコミットがない → ファーストフォワードマージになる
git merge test/merge-practice
```

```text
実行結果の例：
$ git merge test/merge-practice
Updating a1b2c3d..9f3e1a2
Fast-forward
 practice.md | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 practice.md
```

### マージ後の状態を確認する

```bash
git log --oneline
ls
```

> **ポイント**: `test/merge-practice` の変更が `main` に取り込まれました。  
> これがマージの基本です。GitHubのPRも、最終的にはこの操作をGitHub上で行う仕組みです。

### 練習用ブランチを削除する

```bash
git branch -d test/merge-practice
```

---

## Step 2：プロフィールを追加してPRを作成する

今度はGitHubにpushしてプルリクエストを作成します。

### 作業ブランチを作成する

```bash
# mainを最新にしてからブランチを切る
git switch main

# ブランチ名は「add/自分の名前」にする
git switch -c add/yourname
```

> **ルール**: ブランチ名は用途がわかる名前にします。  
> 今回は `add/yamada` のように自分の名前を使いましょう。

### プロフィールファイルを作成する

`contributors/` ディレクトリに、自分の名前のMarkdownファイルを作成します。

ファイル名の例：`contributors/yamada.md`

```markdown
# 山田 太郎

- GitHub: [@yamada-taro](https://github.com/yamada-taro)
- 一言: GitHubチーム開発を学び中です！
```

### 変更をコミットする

```bash
# 追加したファイルをステージング
git add contributors/yamada.md

# コミット（「追加」「更新」「修正」など変更内容がわかるメッセージを書く）
git commit -m "山田のプロフィールを追加"
```

```text
実行結果の例：
$ git commit -m "山田のプロフィールを追加"
[add/yamada 3c8a2f1] 山田のプロフィールを追加
 1 file changed, 5 insertions(+)
 create mode 100644 contributors/yamada.md
```

### ブランチをGitHubにpushする

```bash
git push -u origin add/yourname
```

```text
実行結果の例：
$ git push -u origin add/yamada
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
...
To https://github.com/yamada-taro/github-team-practice.git
 * [new branch]      add/yamada -> add/yamada
Branch 'add/yamada' set up to track remote branch 'add/yamada' from 'origin'.
```

### GitHubでプルリクエストを作成する

1. ブラウザで自分のforkしたリポジトリを開く  
   (`https://github.com/あなたのアカウント名/github-team-practice`)
2. 黄色いバナー **「Compare & pull request」** をクリック  
   （表示されない場合は **Pull requests** タブ → **New pull request**）
3. PRの内容を記入する：

| 項目 | 内容 |
|------|------|
| タイトル | `山田のプロフィールを追加` のように具体的に |
| 本文 | テンプレートに沿って記入（次の例を参考に） |

**本文の記入例：**

```text
## 概要
contributors/ に自分のプロフィールを追加しました。

## 変更内容
- [x] contributors/yamada.md を追加

## 確認事項
- [x] ファイル名は contributors/自分の名前.md にした
- [x] 必要な項目（名前、一言）が記入されている
```

4. **Create pull request** をクリック

---

## Step 3：PRをレビューしてマージする

### PRの内容を確認する

1. 作成したPRのページを開く
2. **Files changed** タブをクリック
3. 追加した内容（緑色の行）を確認する

### レビューコメントを付ける

実際のチーム開発では他のメンバーがコメントを付けますが、今回はセルフレビューを体験します。

1. **Files changed** タブで、コメントしたい行にカーソルを合わせる
2. 行番号の左に表示される **「＋」** ボタンをクリック
3. コメントを入力して **Add single comment** をクリック

**コメント例：**

```text
[praise] プロフィールのフォーマットがわかりやすいです！
```

> **参考：レビューコメントのプレフィックス**
>
> | プレフィックス | 意味 |
> |---------------|------|
> | `[must]` | 必ず修正が必要 |
> | `[suggest]` | 修正を提案（任意） |
> | `[question]` | 質問・確認 |
> | `[praise]` | 良い点を称賛 |

### PRをマージする

1. PRページ下部の **Merge pull request** ボタンをクリック
2. **Confirm merge** をクリック
3. マージ後、**Delete branch** をクリックしてブランチを削除する

```text
✅ Purple Merged とメッセージが表示されればマージ成功です！
```

### ローカルにマージ結果を反映する

```bash
# mainに切り替え
git switch main

# リモートの変更を取得して反映
git pull

# ファイルが追加されているか確認
ls contributors/
```

```text
実行結果の例：
$ git pull
Updating a1b2c3d..7e2f3c1
Fast-forward
 contributors/yamada.md | 5 +++
 1 file changed, 5 insertions(+)

$ ls contributors/
example.md   yamada.md
```

> **おめでとうございます！** GitHub Flowの一連の流れを体験しました。  
> ブランチ → コミット → push → PR → レビュー → マージ → pull の流れです。

---

## チャレンジ課題（時間に余裕があれば）

### コンフリクトを体験してみよう

コンフリクト（競合）は、同じファイルの同じ箇所を2つのブランチで変更した場合に発生します。

```bash
# ブランチAを作成して変更する
git switch -c challenge/branch-a
echo "チームAのコメント" >> contributors/yourname.md
git add contributors/yourname.md
git commit -m "チームAの変更"

# mainに戻って別のブランチBを作成
git switch main
git switch -c challenge/branch-b
echo "チームBのコメント" >> contributors/yourname.md
git add contributors/yourname.md
git commit -m "チームBの変更"

# mainにブランチAをマージ
git switch main
git merge challenge/branch-a

# 続いてブランチBをマージ → コンフリクト発生！
git merge challenge/branch-b
```

```text
実行結果：
Auto-merging contributors/yourname.md
CONFLICT (content): Merge conflict in contributors/yourname.md
Automatic merge failed; fix conflicts and then commit the result.
```

### コンフリクトを解決する

エディタでファイルを開くと、コンフリクト箇所が次のように表示されます：

```text
<<<<<<< HEAD
チームAのコメント
=======
チームBのコメント
>>>>>>> challenge/branch-b
```

`<<<<<<<`、`=======`、`>>>>>>>` の行を削除して、残したい内容に書き直します：

```text
チームAのコメント
チームBのコメント
```

解決後にコミットします：

```bash
git add contributors/yourname.md
git commit -m "コンフリクトを解決"
```

---

## よくあるミスと対処法

### push時に「rejected」エラーが出る

```text
! [rejected]  add/yamada -> add/yamada (fetch first)
```

**原因**: リモートに新しいコミットがあり、ローカルが古い状態になっている  
**対処**: `git pull` してから再度 `git push`

---

### 「Your branch is ahead of 'origin/main'」と表示される

**原因**: ローカルのmainがリモートより進んでいる  
**対処**: `git push` でリモートに反映する（今回はPR経由でマージするので通常は気にしなくてOK）

---

### PRを作成しようとしても「There isn't anything to compare」と表示される

**原因**: forkしたリポジトリとbaseリポジトリのブランチが同じ状態になっている  
**対処**: 作業ブランチにコミットがあるか `git log --oneline` で確認する

---

### 間違えてmainに直接コミットしてしまった

```bash
# コミットを取り消してブランチに移動する
git reset --soft HEAD~1
git switch -c add/yourname
git commit -m "プロフィールを追加"
```

---

## 今日のまとめ

| ステップ | コマンド・操作 |
|---------|--------------|
| ブランチ作成 | `git switch -c ブランチ名` |
| コミット | `git add` → `git commit -m "メッセージ"` |
| マージ（ローカル） | `git merge ブランチ名` |
| push | `git push -u origin ブランチ名` |
| PR作成 | GitHubでボタン操作 |
| マージ（GitHub） | PR画面の「Merge pull request」 |
| ローカルに反映 | `git switch main` → `git pull` |

**次のステップ**

- Issue管理でタスクを整理してみましょう
- GitHub Actionsで自動テストを設定してみましょう
- オープンソースプロジェクトにPRを送ってみましょう
