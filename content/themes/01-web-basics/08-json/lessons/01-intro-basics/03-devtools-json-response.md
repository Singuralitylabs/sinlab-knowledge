---
title: "DevToolsでAPIのJSONレスポンスを確認する"
order: 3
type: detail
difficulty: beginner
tags: [json, devtools, network, api]
estimatedMinutes: 6
status: published
---
# DevToolsでAPIのJSONレスポンスを確認する

## 解説

WebサイトやアプリがサーバーとどのようなJSONデータをやり取りしているかは、ブラウザの **Chrome DevTools（デベロッパーツール）** の **Network（ネットワーク）パネル** で確認できます。

> [!NOTE]
> 本記事の操作手順はGoogle Chromeを基準にしています。Networkパネル自体の使い方は [Network：リクエストの絞り込みとレスポンス確認](/themes/01-web-basics/07-devtools/intro-basics/network-inspect) で詳しく解説しています。

### 手順

1. **DevToolsを開く**
   - Windows / Linux: `F12` または `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`
2. **「Network」タブを選択**
3. フィルターで **「Fetch/XHR」** を選択（API通信だけに絞り込む）
4. ページを更新する（またはボタン操作などでAPIを呼び出す）
5. 一覧から確認したいリクエストをクリックし、**「Response」** や **「Preview」** タブを開く

### Response と Preview の違い

| タブ | 表示形式 | 向いている用途 |
|------|----------|----------------|
| `Response` | サーバーから返された生のテキスト | 実際の文字列をそのまま確認・コピーしたいとき |
| `Preview` | JSONをツリー形式に整形した表示 | 階層構造を折りたたみながら中身を確認したいとき |

> [!TIP]
> `Preview` タブではオブジェクトや配列の左にある ▶ をクリックすると階層を開閉できます。大きなレスポンスでも、必要な部分だけを展開して確認できるので便利です。

---

## サンプル

`Preview` タブでは、たとえば次のようなレスポンスがツリー形式で表示されます。

```text
▼ {id: 101, username: "suzuki_taro", skills: [...], ...}
    id: 101
    username: "suzuki_taro"
  ▶ skills: ["HTML", "CSS", "JavaScript"]
  ▶ profile: {age: 25, location: "Tokyo"}
    note: null
```

---

## よくある間違い

### 1. Fetch/XHR に絞ってもリクエストが見つからない

```text
❌ Networkパネルを開く前に発生した通信を探している

✅ Networkパネルを開いた状態でページをリロード（Ctrl/Cmd + R）するか、
   APIを呼び出す操作をもう一度行う
```

### 2. Preview タブにJSONのツリーが表示されない

レスポンスがJSONではなくHTMLやエラーページの場合、`Preview` はツリー表示になりません。`Headers` タブでステータスコード（`200` / `404` / `500` など）とレスポンスヘッダーの `Content-Type`（JSONなら `application/json`）を確認しましょう。

---

## 実用例

### 画面表示とAPIのデータを照らし合わせる

画面に表示されている値がおかしいとき、`Preview` タブでAPIが返しているJSONの値を確認します。

- JSONの値が **正しい** ➔ フロントエンド側の表示処理に問題がある
- JSONの値が **間違っている** ➔ バックエンド側（API）に問題がある

このように、JSONを確認するだけで問題の切り分けができます。

---

## 実習

### 課題1

普段使っているWebサービス（ニュースサイト・天気予報サイトなど）を開き、次を試してください。

1. DevToolsの Network パネルで `Fetch/XHR` に絞り込み、ページをリロードする
2. 一覧からリクエストを1つ選び、`Preview` タブでJSONの階層を開閉してみる
3. 同じリクエストの `Response` タブも開き、表示の違いを確認する
