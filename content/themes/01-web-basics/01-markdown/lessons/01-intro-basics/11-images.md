---
title: "画像（Images）の詳細"
order: 11
type: detail
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# 画像（Images）

## 解説

リンクの記法の先頭に `!` を付けると画像になります。

```
リンク：[テキスト](URL)
画像： ![代替テキスト](画像URL)
```

---

## 基本的な画像表示

### 記法

```markdown
![サンプル画像](https://sinlab.future-tech-association.org/wp-content/uploads/top_20220804-1000x520.jpg)
```

### 表示結果

![サンプル画像](https://sinlab.future-tech-association.org/wp-content/uploads/top_20220804-1000x520.jpg)

---

## 代替テキスト（Alt Text）

代替テキストは以下の場合に表示・使用されます。

- 画像が読み込めないとき
- スクリーンリーダー（読み上げソフト）使用時
- SEO（検索エンジン最適化）

### 記法

```markdown
![東京タワーの夜景写真](https://example.com/tokyo-tower.jpg)
![会社ロゴ](https://example.com/logo.png)
![グラフ：2024年売上推移](https://example.com/chart.png)
```

**ポイント**：代替テキストは画像の内容を説明する文にしましょう。

---

## タイトル付き画像

マウスを乗せると表示されるタイトルを追加できます。

### 記法

```markdown
![サンプル画像](https://via.placeholder.com/200x150 "これはサンプル画像です")
```

### 表示結果

![サンプル画像](http://sinlab.future-tech-association.org/wp-content/uploads/hcs_contents_img2.png "これはサンプル画像です")

---

## リンク付き画像

画像をクリックするとリンク先に移動します。

### 記法

```markdown
[![クリックできる画像](https://via.placeholder.com/200x100)](https://www.google.com)
```

### 表示結果

[![クリックできる画像](https://via.placeholder.com/200x100)](https://www.google.com)

### 構造

```
[![代替テキスト](画像URL)](リンクURL)
  ^-- 画像部分 --^   ^-- リンク部分 --^
```

---

## 相対パスでの画像指定

プロジェクト内の画像を参照する場合。

### 記法

```markdown
![ロゴ](./images/logo.png)
![スクリーンショット](../docs/screenshots/home.png)
![アイコン](/assets/icons/icon.svg)
```

---

## 画像の配置例

### 記法

```markdown
<!-- 中央寄せ（HTMLを使用） -->
<p align="center">
  <img src="https://via.placeholder.com/200x100" alt="中央寄せ画像">
</p>

<!-- サイズ指定（HTMLを使用） -->
<img src="https://via.placeholder.com/400x200" alt="サイズ指定" width="200">
```

### 表示結果

<p align="center">
  <img src="https://sinlab.future-tech-association.org/wp-content/uploads/top_20220804-1000x520.jpg" alt="中央寄せ画像">
</p>

<img src="https://sinlab.future-tech-association.org/wp-content/uploads/tech-for-future.png" alt="サイズ指定" width="200">

---

## 実用例

### READMEでの使用

```markdown
# プロジェクト名

![プロジェクトロゴ](./assets/logo.png)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://example.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## スクリーンショット

![ホーム画面](./docs/screenshots/home.png)

![ダッシュボード](./docs/screenshots/dashboard.png)
```

---

### ドキュメントでの使用

```markdown
## 操作手順

1. 設定画面を開きます

   ![設定画面](./images/settings.png)

2. 「保存」ボタンをクリックします

   ![保存ボタン](./images/save-button.png)

3. 完了メッセージが表示されます

   ![完了メッセージ](./images/complete.png)
```

---

### バッジの表示

GitHubなどでよく見るバッジも画像です。

```markdown
![GitHub stars](https://img.shields.io/github/stars/username/repo)
![npm version](https://img.shields.io/npm/v/package-name)
![License](https://img.shields.io/badge/license-MIT-green)
```

バッジ作成サービス：[Shields.io](https://shields.io/)

---

## 画像が表示されない場合

### よくある原因

1. **URLが間違っている**
   - パスのスペルミス
   - 相対パスの指定ミス

2. **画像が存在しない**
   - ファイルが削除された
   - アップロードされていない

3. **アクセス権限**
   - プライベートリポジトリの画像
   - 認証が必要な画像

### 確認方法

```markdown
<!-- 画像URLを直接ブラウザで開いて確認 -->
https://example.com/image.png
```

---

## ポイント

- **代替テキストは必須**：アクセシビリティとSEOのため
- **ファイルサイズに注意**：大きすぎると読み込みが遅くなる
- **相対パスを推奨**：プロジェクト内の画像は相対パスで
- **説明的な代替テキスト**：「画像」ではなく内容を説明

---

## 実習

以下のテンプレートを使って、画像付きのドキュメントを作成してみましょう。

```markdown
# プロジェクト名

![プロジェクトのロゴ](画像URL)

## 概要

このプロジェクトは...

## スクリーンショット

![メイン画面](画像URL)

## 使い方

1. インストール
2. 設定
3. 実行

![操作手順の図解](画像URL)
```
