---
title: "GitHubでの基本操作"
order: 17
type: reference
category: jissen
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# GitHubでの基本操作

## 解説

GitHubには、Gitコマンドだけでは行えない**Web上の便利な機能**が多数あります。ここでは、日常的に使うGitHubの基本操作を学びます。

### GitHubでの主要な操作

| 操作 | 説明 |
|------|------|
| Fork | 他の人のリポジトリを自分のアカウントにコピーする |
| Clone | リモートリポジトリをローカルにコピーする |
| Push | ローカルの変更をリモートに送信する |
| Pull | リモートの変更をローカルに取り込む |
| Web Editor | ブラウザ上で直接ファイルを編集する |

### Fork と Clone の違い

```text
【Fork】
  元のリポジトリ(GitHub)    自分のリポジトリ(GitHub)    ローカル
  ┌──────────────┐         ┌──────────────┐
  │  user-A/repo │  Fork→  │  自分/repo    │
  └──────────────┘         └──────────────┘

  ・GitHub上でリポジトリをコピーする操作
  ・自分のアカウントに独立したコピーができる
  ・元のリポジトリに影響を与えない

【Clone】
  リモートリポジトリ(GitHub)        ローカル(自分のPC)
  ┌──────────────┐                ┌──────────────┐
  │  自分/repo    │  Clone→       │  repo/        │
  └──────────────┘                └──────────────┘

  ・リモートリポジトリをローカルPCにコピーする操作
  ・リモートとの接続（origin）が自動設定される
```

---

## コマンドサンプル

### Fork したリポジトリをクローンして作業する

```bash
# 1. Fork したリポジトリをクローン
git clone https://github.com/自分のユーザー名/forked-repo.git
cd forked-repo

# 2. 元のリポジトリを upstream として登録
git remote add upstream https://github.com/元のユーザー名/original-repo.git

# 3. リモートの確認
git remote -v
```

### Fork 元の最新変更を取り込む

```bash
# 1. upstream から最新を取得
git fetch upstream

# 2. main ブランチを最新に更新
git switch main
git merge upstream/main

# 3. 自分のリモートにも反映
git push origin main
```

### クローンからプッシュまでの基本フロー

```bash
# 1. リポジトリをクローン
git clone https://github.com/username/my-project.git
cd my-project

# 2. ブランチを作成して作業
git switch -c feature/update-readme

# 3. ファイルを編集
echo "新しい内容を追加" >> README.md

# 4. 変更をコミット
git add README.md
git commit -m "READMEに説明を追加"

# 5. リモートにプッシュ
git push -u origin feature/update-readme
```

### リモートの変更をプルする

```bash
# 最新の変更を取得
git pull origin main

# リベースで取り込む（履歴を一直線にしたい場合）
git pull --rebase origin main
```

---

## 実行結果

### `git remote -v`（Fork 後）の出力例

```text
$ git remote -v
origin    https://github.com/自分/forked-repo.git (fetch)
origin    https://github.com/自分/forked-repo.git (push)
upstream  https://github.com/元の著者/original-repo.git (fetch)
upstream  https://github.com/元の著者/original-repo.git (push)
```

### `git push` の出力例

```text
$ git push -u origin feature/update-readme
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 350 bytes | 350.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
remote:
remote: Create a pull request for 'feature/update-readme' on GitHub by visiting:
remote:   https://github.com/username/my-project/pull/new/feature/update-readme
remote:
To https://github.com/username/my-project.git
 * [new branch]      feature/update-readme -> feature/update-readme
branch 'feature/update-readme' set up to track 'origin/feature/update-readme'.
```

プッシュ後に「Pull Requestを作成するためのURL」が表示されます。

### `git pull` の出力例

```text
$ git pull origin main
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Total 3 (delta 1), reused 3 (delta 1), pack-reused 0
Unpacking objects: 100% (3/3), done.
From https://github.com/username/my-project
 * branch            main       -> FETCH_HEAD
   a1b2c3d..e4f5g6h  main       -> origin/main
Updating a1b2c3d..e4f5g6h
Fast-forward
 index.html | 3 +++
 1 file changed, 3 insertions(+)
```

---

## よくある間違い

### 1. Fork と Clone を混同する

```text
NG: 「他の人のリポジトリをクローンして変更をプッシュしよう」
→ 他の人のリポジトリには直接プッシュする権限がない

OK: 「Fork してから自分のリポジトリとしてクローンし、プッシュする」
→ Fork した自分のコピーにはプッシュできる
```

### 2. upstream を設定し忘れる

Fork したリポジトリで作業していると、元のリポジトリの更新を取り込めなくなります。

```bash
# upstream が設定されていない
$ git remote -v
origin  https://github.com/自分/repo.git (fetch)
origin  https://github.com/自分/repo.git (push)

# upstream を追加する
$ git remote add upstream https://github.com/元の著者/repo.git
```

### 3. Web上の編集とローカルの変更が衝突する

GitHubのWebエディタで直接ファイルを編集した後、ローカルからプッシュするとエラーになることがあります。

```bash
# NG: Web上で編集した後にローカルからプッシュ
$ git push origin main
! [rejected]        main -> main (fetch first)

# OK: まずプルしてからプッシュ
$ git pull origin main
$ git push origin main
```

### 4. 公開リポジトリに機密情報をプッシュする

```bash
# NG: APIキーやパスワードを含むファイルをプッシュ
git add .env
git commit -m "設定ファイル追加"
git push origin main
# → 世界中の誰でもAPIキーを見られてしまう！
```

**対処法**: `.gitignore` でトラッキングを除外する。

```text
# .gitignore
.env
*.pem
credentials.json
config/secrets.yml
```

---

## 実用例

### GitHubのWebエディタを使う

ブラウザだけでファイルを編集できます。小さな修正やドキュメントの更新に便利です。

**方法1: ファイルを直接編集**
1. GitHubでリポジトリページを開く
2. 編集したいファイルをクリック
3. 右上の鉛筆アイコン（Edit this file）をクリック
4. 内容を編集する
5. 「Commit changes」でコミットメッセージを入力してコミット

**方法2: github.dev エディタを使う**
1. リポジトリページで `.` キーを押す（ピリオド）
2. VS Code ライクなエディタが開く
3. 複数ファイルを編集してまとめてコミットできる

```text
# URLを直接書き換えてもOK
https://github.com/username/repo → https://github.dev/username/repo
```

### GitHubでコミット履歴を確認する

1. リポジトリページで **Commits**（コミット数の表示）をクリック
2. コミット一覧が表示される
3. 各コミットをクリックすると差分（diff）が見られる

```text
コミット一覧の表示例:

a1b2c3d  ヘッダーのデザインを更新       yamada  2 hours ago
e4f5g6h  フッターにリンクを追加         tanaka  5 hours ago
i7j8k9l  初期セットアップ              yamada  1 day ago
```

### ブランチの比較

GitHubでは、ブランチ間の差分を簡単に確認できます。

1. リポジトリページで **Branch** ドロップダウンをクリック
2. 比較元と比較先のブランチを選択
3. 「Compare」ボタンで差分を表示

```text
URLで直接指定することもできる:
https://github.com/username/repo/compare/main...feature/login
```

### GitHubでファイルを作成する

1. リポジトリページで **Add file** → **Create new file** をクリック
2. ファイル名を入力（パスも指定可能: `docs/guide.md`）
3. 内容を入力
4. コミットメッセージを入力して保存

### リリースの作成とダウンロード

GitHubではバージョンごとに「リリース」を作成できます。

**リリースの作成手順:**
1. リポジトリページで **Releases** → **Create a new release** をクリック
2. タグバージョンを入力（例: `v1.0.0`）
3. リリースタイトルと説明を入力
4. 必要に応じてバイナリファイルを添付
5. **Publish release** をクリック

**リリースのダウンロード:**
1. リポジトリの **Releases** セクションを開く
2. ダウンロードしたいバージョンの **Assets** を展開
3. **Source code (zip)** または **Source code (tar.gz)** をダウンロード

```bash
# コマンドラインでタグを作成してプッシュ
git tag -a v1.0.0 -m "バージョン1.0.0リリース"
git push origin v1.0.0
```

### Fork からの貢献の流れ（Pull Request の準備）

```bash
# 1. 気になるOSSプロジェクトをFork（GitHub上で）

# 2. Fork したリポジトリをクローン
git clone https://github.com/自分/awesome-project.git
cd awesome-project

# 3. upstream を登録
git remote add upstream https://github.com/元の著者/awesome-project.git

# 4. 作業用ブランチを作成
git switch -c fix/typo-in-readme

# 5. 修正してコミット
# （ファイルを編集）
git add README.md
git commit -m "READMEのtypoを修正"

# 6. 自分のリポジトリにプッシュ
git push -u origin fix/typo-in-readme

# 7. GitHub上で Pull Request を作成
# （次のレッスンで詳しく学びます）
```

---

## 実習

### 課題1: リポジトリをForkしてクローンする

1. 以下のようなパブリックリポジトリを GitHub 上で見つける（練習用に小さなもの）
2. Fork ボタンをクリックして自分のアカウントにコピーする
3. `git clone` でローカルにコピーする
4. `git remote add upstream` で元のリポジトリを登録する
5. `git remote -v` で origin と upstream の両方を確認する

### 課題2: GitHubのWebエディタで編集する

1. 自分のリポジトリをブラウザで開く
2. README.md の鉛筆アイコンをクリックして編集する
3. 内容を変更してコミットする
4. ローカルで `git pull` して変更を取り込む
5. `git log --oneline -5` でWeb上のコミットが反映されていることを確認する

### 課題3: ブランチの作成とプッシュ

1. ローカルで `feature/github-practice` ブランチを作成する
2. 新しいファイル `practice.md` を作成してコミットする
3. `git push -u origin feature/github-practice` でプッシュする
4. GitHubでブランチが表示されていることを確認する
5. GitHub上で `main` ブランチと比較（Compare）して差分を見る
6. 確認後、リモートブランチを削除する

### 課題4: リリースを作成する

1. ローカルでタグを作成する: `git tag -a v0.1.0 -m "初回リリース"`
2. タグをプッシュする: `git push origin v0.1.0`
3. GitHubのリポジトリページで Releases を確認する
4. 「Create a new release」からリリースノートを追加する
5. ソースコードをダウンロードして、中身を確認する
