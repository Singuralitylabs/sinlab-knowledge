---
title: "Console：JavaScript実行とログ出力コマンド"
order: 3
type: detail
difficulty: beginner
tags: [devtools, console, javascript, debugging]
estimatedMinutes: 8
status: published
---
# Console：JavaScript実行とログ出力コマンド

## 解説

Consoleパネルは、そのページ上でJavaScriptを直接実行できる対話環境（REPL）です。コードを1行ずつ試したいとき、ページ上の要素をその場で操作したいときに使います。

また、コード内に仕込んだログ出力を確認する場としても使われます。`console.log()`以外にも、用途に応じたメソッドが複数用意されています。

| メソッド | 用途 |
|----------|------|
| `console.log()` / `console.info()` | 通常のメッセージ出力 |
| `console.warn()` | 警告メッセージ（黄色で強調表示） |
| `console.error()` | エラーメッセージ（赤色＋スタックトレース付き） |
| `console.table()` | 配列やオブジェクトを表形式で表示 |
| `console.group()` / `console.groupEnd()` | ログをグループ化して折りたたみ表示 |

---

## コマンドサンプル

```javascript
// 画面上の全h2要素を取得する
document.querySelectorAll("h2");

// 現在のページタイトルを確認する
document.title;

// 変数に代入して後から参照する
const users = [
  { id: 1, name: "田中", role: "Admin" },
  { id: 2, name: "佐藤", role: "User" },
];

// 配列・オブジェクトを表形式で見やすく出力する
console.table(users);

// エラーメッセージを試しに出力する（スタックトレース付き）
console.error("接続に失敗しました");

// 関連するログをグループ化する
console.group("ログイン処理");
console.log("リクエスト送信");
console.log("レスポンス受信");
console.groupEnd();
```

---

## 実行結果

```text
> document.querySelectorAll("h2")
NodeList(3) [h2, h2, h2]

> console.table(users)
┌─────────┬────┬──────┬───────┐
│ (index) │ id │ name │ role  │
├─────────┼────┼──────┼───────┤
│    0    │ 1  │ "田中" │ "Admin" │
│    1    │ 2  │ "佐藤" │ "User"  │
└─────────┴────┴──────┴───────┘

> console.error("接続に失敗しました")
接続に失敗しました
  at <anonymous>:1:9
```

---

## よくある間違い

### 1. 実行結果と`console.log`の出力を混同する

```text
❌ 式を評価しただけの結果（青字ではない通常表示）と、
   console.log()で明示的に出力したログを見分けられず混乱する

✅ プロンプト直後に何も付かず表示される行は「式の評価結果」、
   ログメッセージは自分で仕込んだconsole.log()の出力だと意識する
```

### 2. エラーの赤字だけ見てスタックトレースを読まない

```text
❌ 赤い1行目だけ見て「よく分からないエラーが出た」で終わる

✅ エラーメッセージの下に続くスタックトレース（at ...の行）をたどり、
   どのファイルの何行目から呼ばれたエラーかを特定する
```

---

## 実用例

### 本番相当の環境で挙動を確認する

コードを修正・再デプロイせずに、Consoleから直接関数を呼び出して挙動を確認できます。フロントエンドのグローバル関数やライブラリが`window`オブジェクトに公開されていれば、`window.関数名()`のように呼び出せます。

### 大量データのログを`console.table`で見やすくする

APIレスポンスの配列を`console.log()`でそのまま出力すると折りたたまれて読みにくいことがあります。`console.table()`に渡せば、列ごとに整列された表として確認でき、特定のレコードの異常値にも気づきやすくなります。

---

## 実習

### 課題1：ページ上の要素を取得して操作する

1. 任意のWebページを開き、Consoleパネルで`document.querySelectorAll("a")`を実行して、リンク要素の一覧を取得してください
2. `document.querySelectorAll("a").length`で、そのページのリンク数を確認してください

### 課題2：ログ出力メソッドを使い分ける

1. `console.log("通常メッセージ")`を実行し、通常の表示を確認してください
2. `console.warn("警告メッセージ")`を実行し、黄色の表示になることを確認してください
3. `console.error("エラーメッセージ")`を実行し、赤色＋スタックトレースが表示されることを確認してください

### 課題3：`console.table`で配列を表示する

1. `const items = [{name: "A", price: 100}, {name: "B", price: 200}]`を実行してください
2. `console.table(items)`を実行し、表形式で表示されることを確認してください
