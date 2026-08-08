---
title: "node_modulesと.gitignore"
order: 2
type: detail
difficulty: intermediate
tags: [npm, gitignore, node_modules]
estimatedMinutes: 6
status: published
---
# node_modulesと.gitignore

## 解説

`npm install` を実行すると、依存パッケージとその子依存パッケージ（依存の依存）がすべて `node_modules` ディレクトリにダウンロードされます。

```text
node_modules/
  ├─ express/
  │   ├─ node_modules/   （expressが依存するパッケージ）
  │   └─ ...
  ├─ lodash/
  └─ ...（数百〜数千のフォルダになることも）
```

### なぜ node_modules をGitで管理してはいけないのか

1. **ファイル数と容量が膨大** — 数十MB〜数GBになり、Gitリポジトリが極端に重くなります
2. **OS依存コードが含まれる可能性** — 一部のパッケージはC++等でビルドされるため、Mac/Windows/Linuxで実行ファイルが異なる場合があります
3. **再現性は package.json と package-lock.json で十分** — 他の開発者は `git pull` 後に `npm install`（または `npm ci`）を実行すれば同じ環境を再現できます

```text
【Gitで管理するもの】       【Gitで管理しないもの】
package.json          →    node_modules/
package-lock.json      →   （npm install で再生成できるため）
```

---

## コマンドサンプル

```bash
# .gitignore を作成・編集
echo "node_modules" >> .gitignore

# node_modules が .gitignore の対象になっているか確認
git check-ignore -v node_modules

# すでに追跡されてしまっている場合、追跡だけを解除する（ファイルは残す）
git rm -r --cached node_modules

# .gitignore に反映後、変更をコミット
git add .gitignore
git commit -m "fix: node_modulesをGit追跡対象から除外"
```

### 典型的な.gitignoreの内容

```text
# 依存ライブラリの除外
node_modules

# ビルド成果物の除外
dist
build

# 環境変数ファイルの除外（機密情報保護）
.env
.env.local

# ログファイル
*.log
npm-debug.log*
```

---

## 実行結果

```text
$ echo "node_modules" > .gitignore
$ git add .
$ git status
On branch main
Changes to be committed:
  new file:   .gitignore
  new file:   package-lock.json
  new file:   package.json

$ git status
        node_modules が一覧に含まれていないことを確認
```

### 誤ってコミットしてしまった場合の復旧

```text
$ git log --oneline
a1b2c3d (HEAD -> main) 依存パッケージを追加

$ echo "node_modules" >> .gitignore
$ git rm -r --cached node_modules
rm 'node_modules/express/index.js'
rm 'node_modules/express/package.json'
... （大量の削除ログ）

$ git add .gitignore
$ git commit -m "fix: node_modulesをGit追跡対象から削除"
$ git push
```

---

## よくある間違い

### 1. .gitignoreを後から追加しても過去のコミットには効かない

```text
❌ 「.gitignore に node_modules を書いたのに、まだ追跡されている」

理由：.gitignore は「これから追加されるファイル」を無視する設定。
      すでに Git 管理下にあるファイルには効果がない。

✅ git rm -r --cached node_modules で追跡を解除してから
   .gitignore を有効にする
```

### 2. node_modules を直接編集してしまう

```text
❌ node_modules/some-package/index.js を直接書き換えてバグを直そうとする
   → npm install しなおすと変更が消える。チームにも共有されない。

✅ 修正が必要ならパッケージ側にIssueを立てる、
   もしくは自分のコード側で対応する（パッチが必要な場合は patch-package 等を検討）
```

### 3. .gitignoreの記述場所を間違える

```bash
# ❌ サブディレクトリの .gitignore に書いても、意図せず範囲が狭くなることがある
frontend/.gitignore に "node_modules" と書いたつもりが
backend/node_modules がGit管理下に残ってしまう

# ✅ モノレポではプロジェクトルートの .gitignore に
#    node_modules（先頭にスラッシュなし）を書けば、
#    どの階層の node_modules も対象になる
```

---

## 実用例

### 新規プロジェクトのセットアップ時に最初にやること

```bash
npm init -y
echo "node_modules" > .gitignore
git init
git add .
git commit -m "初期セットアップ"
```

### 誤コミットに気づいたときの対応フロー

```bash
# 1. まず .gitignore を直す
echo "node_modules" >> .gitignore

# 2. 追跡だけを解除（ファイル自体は削除しない）
git rm -r --cached node_modules

# 3. コミットしてチームに共有する
git add .gitignore
git commit -m "fix: node_modulesをGit追跡対象から削除"
git push
```

---

## 実習

### 課題1：.gitignoreを正しく作る

1. 練習用プロジェクトで `npm install express` を実行してください
2. `.gitignore` に `node_modules` を追加してください
3. `git add . && git status` で `node_modules` がステージングされていないことを確認してください

### 課題2：誤コミットからの復旧を体験する

1. わざと `.gitignore` を作らずに `git add . && git commit` してみてください
2. その後 `.gitignore` を追加し、`git rm -r --cached node_modules` で追跡を解除してください
3. `git status` で `node_modules` が消えたことを確認してください

### 課題3：他の除外パターンも書いてみる

`.env`・`*.log`・`dist` を除外する `.gitignore` を作成し、実際に該当ファイルを作って `git status` に出てこないことを確認してください。
