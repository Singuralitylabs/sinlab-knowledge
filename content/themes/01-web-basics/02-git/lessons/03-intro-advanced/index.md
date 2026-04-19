---
title: "解説記事 (応用編)"
order: 3
type: lecture
difficulty: intermediate
tags: [git, intermediate, concept]
estimatedMinutes: 15
status: published
---
# Git入門 応用編

## はじめに

基礎編・実践編では、Gitの基本操作とブランチ・リモートリポジトリの連携を学びました。応用編では、**コミット履歴の操作**、**タグ付け**、**リベース**、**スタッシュ**といった、より高度なGitの機能を学びます。

これらの機能を使いこなすことで、履歴の管理や作業の効率が大幅に向上します。

---

## コミット履歴の操作

### 1. コミット履歴の表示（git log）

```bash
git log --oneline          # 1行表示
git log --oneline --graph  # グラフ表示
git log -5                 # 直近5件
git log --author="名前"    # 特定の作者で絞り込み
```

### 2. コミットの取り消し（git reset）

```bash
git reset --soft HEAD~1    # コミットのみ取り消し（変更は残る）
git reset --mixed HEAD~1   # コミットとステージングを取り消し
git reset --hard HEAD~1    # すべて取り消し（注意！）
```

| オプション | コミット | ステージング | 作業ディレクトリ |
|------------|:--------:|:------------:|:----------------:|
| --soft | 取り消す | 残る | 残る |
| --mixed | 取り消す | 取り消す | 残る |
| --hard | 取り消す | 取り消す | 取り消す |

### 3. コミットの打ち消し（git revert）

`reset` がコミットを消すのに対し、`revert` は打ち消すための新しいコミットを作成します。

```bash
git revert HEAD    # 直前のコミットを打ち消す
```

共有リポジトリでは `git revert` を使うのが安全です。

---

## タグ付け

### タグの基本（git tag）

特定のコミットにバージョン番号などのラベルを付けます。

```bash
git tag -a v1.0.0 -m "バージョン1.0.0リリース"   # 注釈付きタグ
git tag v1.0.0-beta                              # 軽量タグ
git tag                                          # タグ一覧
git show v1.0.0                                  # タグの詳細
git tag -d v1.0.0                                # タグの削除
```

### セマンティックバージョニング

`v1.0.0` = メジャー.マイナー.パッチ の形式が一般的です。

| 種類 | 変更内容 | 例 |
|------|----------|-----|
| メジャー | 後方互換性のない変更 | v1.0.0 → v2.0.0 |
| マイナー | 後方互換性のある機能追加 | v1.0.0 → v1.1.0 |
| パッチ | バグ修正 | v1.0.0 → v1.0.1 |

### リモートへのタグ操作

```bash
git push origin v1.0.0     # 特定のタグをプッシュ
git push origin --tags      # すべてのタグをプッシュ
```

---

## リベース

### リベースの基本（git rebase）

ブランチの起点を変更して履歴を整理する操作です。

```text
Before:                    After rebase:
main ──●──●──●             main ──●──●──●
             \                          \
              ●──● feature               ●──● feature
```

```bash
git switch feature
git rebase main
```

### インタラクティブリベース

コミット履歴を編集・整理できます。

```bash
git rebase -i HEAD~3
```

```text
pick a1b2c3d ログイン画面を作成
squash e4f5g6h バリデーションを追加    # 前のコミットと統合
squash i7j8k9l タイポを修正            # 前のコミットと統合
```

**注意**：リベースは履歴を書き換えるため、**すでにプッシュしたコミットには使用しない**のが原則です。

### merge と rebase の使い分け

| 項目 | merge | rebase |
|------|-------|--------|
| 履歴 | 分岐が残る | 一直線になる |
| 安全性 | 高い | 注意が必要 |
| 適した場面 | 共有ブランチ | 個人の作業ブランチ |

迷ったら `merge` を使いましょう。

---

## スタッシュ

### スタッシュの基本（git stash）

作業中の変更を一時的に退避する機能です。ブランチを切り替えたいが、まだコミットしたくない場合に便利です。

```bash
git stash                           # 変更を退避
git stash save "作業中の内容"        # メッセージ付きで退避
git stash list                      # 退避の一覧
git stash pop                       # 最新を復元して削除
git stash apply                     # 最新を復元（削除しない）
git stash drop stash@{0}            # 退避を削除
git stash clear                     # すべての退避を削除
```

### スタッシュの活用例

**ブランチの切り替え時**

```bash
# 作業中だがブランチを切り替えたい
git stash
git switch main
# 作業を終えたら戻る
git switch feature
git stash pop
```

**未追跡ファイルも含めて退避**

```bash
git stash -u    # 未追跡ファイルも退避
```

---

## コマンドまとめ

| コマンド | 説明 | 使用例 |
|----------|------|--------|
| `git log` | コミット履歴を表示 | `git log --oneline` |
| `git reset` | コミットを取り消す | `git reset --soft HEAD~1` |
| `git revert` | コミットを打ち消す | `git revert HEAD` |
| `git tag` | タグを作成 | `git tag -a v1.0.0 -m "説明"` |
| `git rebase` | ブランチの起点を変更 | `git rebase main` |
| `git rebase -i` | インタラクティブリベース | `git rebase -i HEAD~3` |
| `git stash` | 変更を一時退避 | `git stash save "作業中"` |
| `git stash pop` | 退避した変更を復元 | `git stash pop` |

---

## まとめ

応用編では、コミット履歴の操作、タグ付け、リベース、スタッシュという4つの高度な機能を学びました。

これらの機能は日常的に使うものではありませんが、いざというときに知っていると作業効率が大幅に向上します。特に `git stash` は頻繁に活用する場面があるでしょう。

### 次のステップ

- チーム開発編でプルリクエストやコードレビューの方法を学びましょう
- 実際のプロジェクトでリベースやスタッシュを試してみましょう

### 参考リソース

- [Pro Git - リベースの章](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E6%A9%9F%E8%83%BD-%E3%83%AA%E3%83%99%E3%83%BC%E3%82%B9)：リベースの詳細な解説
- [Git公式ドキュメント - git stash](https://git-scm.com/docs/git-stash)：スタッシュの公式リファレンス

---

お疲れさまでした！応用編の内容をマスターしたら、チーム開発編に進みましょう。
