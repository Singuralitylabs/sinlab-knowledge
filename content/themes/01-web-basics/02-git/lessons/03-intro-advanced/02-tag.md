---
title: "タグ付け"
order: 2
type: detail
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# タグ付け

## 解説

タグ（Tag）は、リポジトリの特定のコミットに名前を付ける機能です。主にソフトウェアのリリースバージョン（v1.0、v2.1.3 など）を記録するために使われます。

### タグの種類

Gitには2種類のタグがあります。

| 種類 | 特徴 | 用途 |
|------|------|------|
| **軽量タグ（Lightweight）** | コミットへのポインタのみ | 一時的なマーク、個人的な目印 |
| **注釈付きタグ（Annotated）** | 作成者・日時・メッセージを含む完全なオブジェクト | 正式なリリース、チームでの共有 |

```text
【軽量タグ】
コミットA ← コミットB ← コミットC
                          ↑
                        v1.0（ただのポインタ）

【注釈付きタグ】
コミットA ← コミットB ← コミットC
                          ↑
                        v1.0（タグオブジェクト）
                         ├ 作成者: Taro Yamada
                         ├ 日時: 2024-01-15
                         └ メッセージ: "初回リリース"
```

> **推奨**：チームで共有するリリースタグには**注釈付きタグ**を使いましょう。軽量タグは個人的な目印として使い分けるのが一般的です。

### セマンティックバージョニング

タグ名には**セマンティックバージョニング（SemVer）** の形式を使うのが標準的です。

```text
v MAJOR . MINOR . PATCH
  │        │       │
  │        │       └── バグ修正（後方互換性あり）
  │        └────────── 機能追加（後方互換性あり）
  └─────────────────── 破壊的変更（後方互換性なし）
```

| バージョン変更 | いつ上げるか | 例 |
|---------------|-------------|-----|
| **MAJOR**（メジャー） | APIの破壊的変更 | v1.0.0 → v2.0.0 |
| **MINOR**（マイナー） | 後方互換性のある機能追加 | v1.0.0 → v1.1.0 |
| **PATCH**（パッチ） | 後方互換性のあるバグ修正 | v1.0.0 → v1.0.1 |

#### バージョン番号の例

```text
v0.1.0   → 開発初期（正式リリース前）
v1.0.0   → 最初の正式リリース
v1.1.0   → 新機能追加（検索機能を追加）
v1.1.1   → バグ修正（検索の不具合を修正）
v1.2.0   → 新機能追加（フィルター機能を追加）
v2.0.0   → 破壊的変更（APIの仕様変更）

プレリリース版：
v2.0.0-alpha.1  → アルファ版（開発中）
v2.0.0-beta.1   → ベータ版（テスト中）
v2.0.0-rc.1     → リリース候補
```

---

## コマンドサンプル

### 軽量タグの作成

```bash
# 現在のコミットに軽量タグを付ける
git tag v1.0

# 特定のコミットに軽量タグを付ける
git tag v0.9 abc1234
```

### 注釈付きタグの作成

```bash
# 注釈付きタグを作成（-a オプション）
git tag -a v1.0.0 -m "初回正式リリース"

# 特定のコミットに注釈付きタグを付ける
git tag -a v0.9.0 -m "ベータリリース" abc1234

# エディタを開いてメッセージを書く
git tag -a v1.0.0
```

### タグの一覧表示

```bash
# すべてのタグを表示
git tag

# パターンで絞り込み
git tag -l "v1.*"
git tag -l "v2.0.*"

# タグを作成日順にソート
git tag --sort=-creatordate

# タグの数を確認
git tag | wc -l
```

### タグの詳細表示

```bash
# タグの詳細を表示
git show v1.0.0

# タグのコミット情報だけ表示（差分なし）
git show --stat v1.0.0

# 軽量タグの情報を表示
git show v1.0
```

### タグのリモートへの送信

```bash
# 特定のタグをリモートに送信
git push origin v1.0.0

# すべてのタグをリモートに送信
git push origin --tags

# 注釈付きタグだけをリモートに送信
git push origin --follow-tags
```

### タグの削除

```bash
# ローカルのタグを削除
git tag -d v1.0.0

# リモートのタグを削除
git push origin --delete v1.0.0

# リモートのタグを削除（別の書き方）
git push origin :refs/tags/v1.0.0
```

### タグを使ったチェックアウト

```bash
# タグのコミットに移動（detached HEAD 状態になる）
git checkout v1.0.0

# タグからブランチを作成（推奨）
git checkout -b hotfix/v1.0.1 v1.0.0
```

---

## 実行結果

### タグの作成と確認

```text
$ git tag -a v1.0.0 -m "初回正式リリース"

$ git tag
v1.0.0

$ git show v1.0.0
tag v1.0.0
Tagger: Taro Yamada <taro@example.com>
Date:   Mon Jan 15 16:00:00 2024 +0900

初回正式リリース

commit c3d4e5f6a7b8901234567890abcdef1234567890 (HEAD -> main, tag: v1.0.0)
Author: Taro Yamada <taro@example.com>
Date:   Mon Jan 15 15:30:00 2024 +0900

    ドキュメントを更新

diff --git a/README.md b/README.md
...
```

### 軽量タグと注釈付きタグの表示の違い

```text
# 軽量タグの場合（タグ情報がない）
$ git show v0.9
commit b2c3d4e5f6a7890123456789...
Author: Taro Yamada <taro@example.com>
Date:   Sun Jan 14 12:00:00 2024 +0900

    機能Aを実装

# 注釈付きタグの場合（タグ情報が含まれる）
$ git show v1.0.0
tag v1.0.0
Tagger: Taro Yamada <taro@example.com>
Date:   Mon Jan 15 16:00:00 2024 +0900

初回正式リリース

commit c3d4e5f6a7b890123456789...
Author: Taro Yamada <taro@example.com>
...
```

### タグの一覧とフィルタリング

```text
$ git tag
v0.1.0
v0.2.0
v1.0.0
v1.0.1
v1.1.0
v2.0.0-beta.1

$ git tag -l "v1.*"
v1.0.0
v1.0.1
v1.1.0

$ git tag -l "v*beta*"
v2.0.0-beta.1
```

### タグのプッシュ

```text
$ git push origin v1.0.0
Enumerating objects: 1, done.
Counting objects: 100% (1/1), done.
Writing objects: 100% (1/1), 175 bytes | 175.00 KiB/s, done.
Total 1 (delta 0), reused 0 (delta 0)
To github.com:user/project.git
 * [new tag]         v1.0.0 -> v1.0.0

$ git push origin --tags
Total 0 (delta 0), reused 0 (delta 0)
To github.com:user/project.git
 * [new tag]         v0.1.0 -> v0.1.0
 * [new tag]         v0.2.0 -> v0.2.0
 * [new tag]         v1.0.1 -> v1.0.1
 * [new tag]         v1.1.0 -> v1.1.0
```

### タグの削除

```text
# ローカルのタグを削除
$ git tag -d v0.1.0
Deleted tag 'v0.1.0' (was a1b2c3d)

# リモートのタグを削除
$ git push origin --delete v0.1.0
To github.com:user/project.git
 - [deleted]         v0.1.0
```

---

## よくある間違い

### 1. タグをプッシュし忘れる

```bash
# ❌ タグを作っても、デフォルトでは push されない
git tag -a v1.0.0 -m "リリース"
git push
# → タグはリモートに送信されない！

# ✅ タグは明示的に push する必要がある
git push origin v1.0.0
# または
git push origin --tags
```

### 2. 軽量タグと注釈付きタグを混同する

```bash
# ❌ 重要なリリースに軽量タグを使う
git tag v1.0.0  # 作成者情報もメッセージもない

# ✅ リリースタグには注釈付きタグを使う
git tag -a v1.0.0 -m "初回正式リリース"
# 作成者・日時・メッセージが記録される
```

### 3. タグを付けた後にコミットを変更する

```text
❌ タグを付けた後に amend や rebase でコミットを変更すると、
   タグが古いコミットを指したままになる

✅ タグを付け直す場合は、-f オプションで強制上書き
   git tag -f -a v1.0.0 -m "修正後のリリース"
   git push origin -f v1.0.0  # リモートも強制更新

   ※ チームで共有済みのタグの強制更新は避けるべき
```

### 4. セマンティックバージョニングのルールを無視する

```text
❌ バグ修正なのにメジャーバージョンを上げる
   v1.0.0 → v2.0.0（ただのバグ修正）

❌ 破壊的変更なのにパッチバージョンしか上げない
   v1.0.0 → v1.0.1（APIの仕様変更）

✅ 変更の種類に応じて適切なバージョンを上げる
   バグ修正:    v1.0.0 → v1.0.1（PATCH）
   機能追加:    v1.0.0 → v1.1.0（MINOR）
   破壊的変更:  v1.0.0 → v2.0.0（MAJOR）
```

---

## 実用例

### リリースワークフロー

```bash
# 1. リリース準備（最終確認）
git log --oneline v0.9.0..HEAD  # 前回リリースからの変更を確認

# 2. バージョンファイルの更新（もしあれば）
echo "1.0.0" > VERSION
git add VERSION
git commit -m "バージョンを1.0.0に更新"

# 3. タグを作成
git tag -a v1.0.0 -m "v1.0.0 初回正式リリース

変更内容:
- ユーザー認証機能を実装
- ダッシュボード画面を追加
- パフォーマンスを改善"

# 4. リモートにプッシュ
git push origin main
git push origin v1.0.0
```

### 過去のリリースのバグ修正（ホットフィックス）

```bash
# 1. リリースタグからホットフィックスブランチを作成
git checkout -b hotfix/v1.0.1 v1.0.0

# 2. バグを修正
# （ファイルを編集）
git add .
git commit -m "ログイン時のエラーハンドリングを修正"

# 3. 修正版のタグを作成
git tag -a v1.0.1 -m "v1.0.1 バグ修正リリース

修正内容:
- ログイン失敗時にアプリがクラッシュする問題を修正"

# 4. リモートにプッシュ
git push origin hotfix/v1.0.1
git push origin v1.0.1

# 5. mainブランチにもマージ
git checkout main
git merge hotfix/v1.0.1
```

### タグ間の変更を確認する

```bash
# 2つのバージョン間の変更を確認
git log --oneline v1.0.0..v1.1.0

# 2つのバージョン間の差分を確認
git diff v1.0.0..v1.1.0

# 変更されたファイルの一覧
git diff --name-only v1.0.0..v1.1.0

# 変更の統計情報
git diff --stat v1.0.0..v1.1.0
```

### GitHubリリースとの連携

```text
GitHubでは、タグを元に「リリース」を作成できます。

1. リポジトリページ → 「Releases」→ 「Create a new release」
2. タグを選択（または新規作成）
3. リリースノートを記入
4. 「Publish release」をクリック

これにより、リリースノート付きのダウンロードページが自動生成されます。
多くのプロジェクトでは、CI/CDパイプラインがタグのプッシュを検知して
自動的にビルド・デプロイを実行します。
```

---

## 実習

### 課題1：タグの基本操作

1. 練習用リポジトリで3つのコミットを作成してください
2. 最初のコミットに軽量タグ `v0.1` を付けてください
3. 最新のコミットに注釈付きタグ `v1.0.0` を付けてください
4. `git tag` で一覧を表示し、`git show` で両方の違いを確認してください

```bash
# ヒント
git tag v0.1 <最初のコミットハッシュ>
git tag -a v1.0.0 -m "最初のリリース"
```

### 課題2：タグの操作

1. タグ `v0.1` を削除してください
2. 注釈付きタグ `v0.1.0` として付け直してください
3. `git tag -l "v0.*"` でフィルタリング表示を確認してください

### 課題3：セマンティックバージョニングを考える

以下の変更に対して、適切なバージョン番号を考えてみましょう。現在のバージョンは `v1.2.3` とします。

1. ボタンの色がおかしかったバグを修正した
2. 新しくダークモード機能を追加した
3. APIのレスポンス形式をJSONからGraphQLに変更した（既存のAPIクライアントは動作しなくなる）
4. セキュリティの脆弱性を修正した
5. 新しい言語（フランス語）のサポートを追加した

### 課題4：タグ間の差分を確認する

1. `v0.1.0`、`v0.2.0`、`v1.0.0` の3つのタグを異なるコミットに付けてください
2. `git log --oneline v0.1.0..v1.0.0` で範囲指定のログを確認してください
3. `git diff --stat v0.1.0..v1.0.0` で変更の統計を確認してください
