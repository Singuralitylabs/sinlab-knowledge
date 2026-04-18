---
title: "絵文字ショートコード サンプル"
order: 19
type: reference
category: ouyou
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# 絵文字ショートコード サンプル

## 解説

絵文字をテキストのショートコードで入力できます。
`:name:` の形式で記述します。

**対応環境**: GitHub、Slack、Discord

---

## 基本的な使い方

### 記法

```markdown
:smile: :thumbsup: :rocket: :warning: :white_check_mark:
```

### 表示結果（GitHub上）

:smile: :thumbsup: :rocket: :warning: :white_check_mark:

---

## よく使う絵文字一覧

### 表情

| ショートコード | 表示 | 意味 |
|----------------|:----:|------|
| `:smile:` | 😄 | 笑顔 |
| `:laughing:` | 😆 | 大笑い |
| `:blush:` | 😊 | 照れ笑い |
| `:thinking:` | 🤔 | 考え中 |
| `:sunglasses:` | 😎 | クール |
| `:cry:` | 😢 | 泣き顔 |
| `:sweat_smile:` | 😅 | 苦笑い |

---

### ジェスチャー

| ショートコード | 表示 | 意味 |
|----------------|:----:|------|
| `:thumbsup:` / `:+1:` | 👍 | いいね |
| `:thumbsdown:` / `:-1:` | 👎 | ダメ |
| `:clap:` | 👏 | 拍手 |
| `:wave:` | 👋 | 手を振る |
| `:raised_hands:` | 🙌 | 万歳 |
| `:pray:` | 🙏 | お願い/感謝 |
| `:muscle:` | 💪 | 筋肉/頑張る |

---

### 状態・ステータス

| ショートコード | 表示 | 意味 |
|----------------|:----:|------|
| `:white_check_mark:` | ✅ | 完了 |
| `:x:` | ❌ | 失敗/NG |
| `:warning:` | ⚠️ | 警告 |
| `:question:` | ❓ | 疑問 |
| `:exclamation:` | ❗ | 注意 |
| `:construction:` | 🚧 | 工事中 |
| `:rotating_light:` | 🚨 | 緊急 |

---

### 開発関連

| ショートコード | 表示 | 意味 |
|----------------|:----:|------|
| `:rocket:` | 🚀 | リリース |
| `:bug:` | 🐛 | バグ |
| `:wrench:` | 🔧 | 修正 |
| `:hammer:` | 🔨 | 作業中 |
| `:gear:` | ⚙️ | 設定 |
| `:bulb:` | 💡 | アイデア |
| `:memo:` | 📝 | メモ/ドキュメント |
| `:fire:` | 🔥 | 削除/ホット |
| `:sparkles:` | ✨ | 新機能 |
| `:art:` | 🎨 | デザイン/UI |
| `:zap:` | ⚡ | パフォーマンス |
| `:lock:` | 🔒 | セキュリティ |

---

### その他

| ショートコード | 表示 | 意味 |
|----------------|:----:|------|
| `:star:` | ⭐ | 星 |
| `:heart:` | ❤️ | ハート |
| `:tada:` | 🎉 | お祝い |
| `:trophy:` | 🏆 | トロフィー |
| `:coffee:` | ☕ | コーヒー |
| `:book:` | 📖 | 本 |
| `:link:` | 🔗 | リンク |
| `:eyes:` | 👀 | 注目 |

---

## 実用例

### コミットメッセージ

```markdown
:sparkles: 新機能：ユーザー認証を追加
:bug: バグ修正：ログインエラーを解消
:memo: ドキュメント：READMEを更新
:art: UI改善：ボタンのデザインを変更
:zap: パフォーマンス：クエリを最適化
:lock: セキュリティ：XSS対策を実装
:fire: 削除：未使用コードを削除
:wrench: 設定：ESLint設定を更新
```

---

### プルリクエスト

```markdown
## :rocket: 概要

ユーザー登録機能を実装しました。

## :memo: 変更内容

- :sparkles: 新規登録フォームを追加
- :white_check_mark: バリデーション処理を実装
- :art: フォームのスタイリング

## :warning: 注意点

- データベースのマイグレーションが必要です

## :eyes: レビューポイント

- バリデーションのロジック
- エラーハンドリング
```

---

### Issue

```markdown
## :bug: バグ報告

### :computer: 環境
- OS: macOS 14.0
- ブラウザ: Chrome 120

### :footprints: 再現手順
1. ログインページにアクセス
2. メールアドレスを入力
3. :x: エラーが発生

### :bulb: 期待する動作
:white_check_mark: 正常にログインできる

### :camera: スクリーンショット
（画像を添付）
```

---

### タスクリスト

```markdown
## :clipboard: 今週のタスク

- :white_check_mark: ~~企画書の作成~~
- :white_check_mark: ~~レビュー依頼~~
- :construction: 修正対応中
- :hourglass: 最終提出待ち
```

---

### リリースノート

```markdown
# :tada: v2.0.0 リリース

## :sparkles: 新機能
- ダークモード対応
- 多言語サポート

## :bug: バグ修正
- ログイン時のエラーを解消
- 画像アップロードの不具合を修正

## :zap: パフォーマンス改善
- ページ読み込み速度を50%改善

## :warning: 破壊的変更
- Node.js 16のサポートを終了
```

---

## 注意点

1. **環境依存**: VS Codeなど一部の環境では`:smile:`がそのまま表示される
2. **代替入力**: 対応していない環境では直接絵文字を入力（😄）
3. **検索方法**: GitHubでは `:` を入力すると候補が表示される

---

## 絵文字検索

- [GitHub絵文字チートシート](https://github.com/ikatyang/emoji-cheat-sheet)
- [Emojipedia](https://emojipedia.org/)

---

## 実習

以下のテンプレートを使って、コミットメッセージを書いてみましょう。

```markdown
:sparkles: 新機能を追加
:bug: バグを修正
:memo: ドキュメントを更新
:art: デザインを改善
:zap: パフォーマンスを向上
```
