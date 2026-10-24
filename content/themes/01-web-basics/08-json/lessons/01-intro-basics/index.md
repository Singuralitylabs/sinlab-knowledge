---
title: "JSON入門 基礎編"
order: 1
type: lecture
difficulty: beginner
tags: [json, data-format, api, devtools, vscode]
estimatedMinutes: 15
status: published
---
# JSON入門 基礎編

## はじめに

### JSONとは？

**JSON**（JavaScript Object Notation、読み方は「ジェイソン」）は、軽量なデータ交換フォーマットです。人間にとって読み書きしやすく、プログラムにとっても解析（**パース**）しやすいため、Web APIのレスポンスや設定ファイルなどで広く使われています。

名前に「JavaScript」と付いていますが、JavaScript専用ではありません。Python・Ruby・Go・PHPなど、ほぼすべての主要なプログラミング言語でJSONを読み書きする仕組みが用意されています。

### なぜJSONを学ぶのか？

- **Web APIの標準フォーマット**：フロントエンドとバックエンドのデータのやり取りは、ほとんどがJSONで行われます
- **設定ファイルでも頻出**：`package.json`（npm）、`tsconfig.json`（TypeScript）、`settings.json`（VS Code）など、開発中に毎日のように目にします
- **デバッグに必須**：APIのレスポンスが正しいかを確認するには、JSONの構造を読み解く力が欠かせません

この記事では、JSONの基本構造とデータ型を押さえたうえで、**Chrome DevTools** と **VS Code** を使った実践的な扱い方を解説します。

---

## JSONの基本構造

JSONは基本的に **「キー（Key）と値（Value）のペア」** の集まりで構成されます。全体を `{}` で囲み、`"キー": 値` の組をカンマ `,` で区切って並べます。

```json
{
  "id": 101,
  "username": "suzuki_taro",
  "isStudent": false,
  "skills": ["HTML", "CSS", "JavaScript"],
  "profile": {
    "age": 25,
    "location": "Tokyo"
  },
  "note": null
}
```

書き方のルールは厳格で、JavaScriptのオブジェクトでは許される書き方でもJSONではエラーになるものがあります。

| ルール | 内容 |
|--------|------|
| キーはダブルクォート | キーは必ず `"` で囲む（シングルクォート `'` や囲まない書き方は不可） |
| 文字列もダブルクォート | 文字列の値も `"` で囲む |
| 末尾カンマ禁止 | 最後の要素の後ろにカンマ（Trailing Comma）を付けない |
| コメント不可 | `//` や `/* */` のコメントは書けない |

::detail{slug="syntax-rules"}

---

## 利用できる6つのデータ型

JSONの値として使えるのは、次の6種類だけです。

| データ型 | 解説 | 例 |
|----------|------|----|
| **文字列 (String)** | ダブルクォートで囲まれたテキスト | `"Hello"` |
| **数値 (Number)** | 整数または浮動小数点数（引用符なし） | `42`, `3.14` |
| **真偽値 (Boolean)** | 小文字の `true` または `false` | `true`, `false` |
| **配列 (Array)** | `[` と `]` で囲まれた値の順序付きリスト | `["apple", "banana"]` |
| **オブジェクト (Object)** | `{}` で囲まれたキーと値のペアの集まり | `{"key": "value"}` |
| **null** | 値が存在しないことを示す | `null` |

配列やオブジェクトの中にさらに配列やオブジェクトを入れる（**ネスト**する）ことで、複雑なデータも表現できます。

::detail{slug="data-types"}

---

## DevToolsでWeb APIのJSONレスポンスを確認する

WebサイトやアプリがどのようなJSONデータをやり取りしているかは、ブラウザの **Chrome DevTools** の **Network パネル** で確認できます。`Fetch/XHR` フィルターでAPI通信だけに絞り込み、`Preview` タブを開くと、JSONがツリー形式で表示されて階層を折りたたみながら中身を確認できます。

> [!TIP]
> DevToolsの起動方法やNetworkパネルの基本操作は [DevTools](/themes/01-web-basics/07-devtools) モジュールで詳しく解説しています。

::detail{slug="devtools-json-response"}

---

## VS CodeでJSONを効率的に扱う

エディタ **VS Code** には、JSONの閲覧・編集を効率化する機能が標準で備わっています。崩れたJSONを一瞬で整える **自動整形（フォーマット）** と、巨大なJSONの見通しを良くする **コードの折りたたみ（Folding）** の2つを押さえておきましょう。構文エラーがあれば赤い波線で教えてくれるため、手書きのJSONのミスにもすぐ気づけます。

::detail{slug="vscode-json-editing"}

---

## 基本操作まとめ

| 場面 | 操作 | 内容 |
|------|------|------|
| JSONを書く | `"キー": 値` | キーと文字列は必ずダブルクォート、末尾カンマなし |
| APIレスポンスを見る | DevTools ➔ Network ➔ `Fetch/XHR` ➔ `Preview` | JSONをツリー形式で確認 |
| JSONを整形する | `Shift + Alt + F`（Mac: `Shift + Option + F` / Linux: `Ctrl + Shift + I`） | VS Codeでインデントを自動整列 |
| すべて折りたたむ | `Ctrl + K` ➔ `Ctrl + 0`（Mac: `Cmd + K` ➔ `Cmd + 0`） | VS Codeで階層を一括で閉じる |
| すべて展開する | `Ctrl + K` ➔ `Ctrl + J`（Mac: `Cmd + K` ➔ `Cmd + J`） | VS Codeで階層を一括で開く |

---

## 実践演習：JSONを書いて整形してみる

1. VS Codeで新しいファイル `profile.json` を作成し、以下を **そのまま** 貼り付けます（わざと1行に詰めています）

   ```json
   {"name": "your_name", "age": 20, "isStudent": true, "hobbies": ["reading", "music"], "address": {"city": "Tokyo", "zip": "100-0001"}, "nickname": null}
   ```

2. `Shift + Alt + F`（Mac: `Shift + Option + F`）で整形し、インデントされた形に変わることを確認する
3. `name` の値を自分の名前に書き換え、`hobbies` に好きな趣味を1つ追加する
4. `"address"` の行の左にある矢印をクリックして、オブジェクトが折りたためることを確認する
5. わざと最後の要素の後ろにカンマを付けて、赤い波線（エラー）が表示されることを確認し、元に戻す
6. ブラウザで任意のWebサービスを開き、DevToolsの Network ➔ `Fetch/XHR` でJSONを返しているリクエストを1つ探して `Preview` タブで中身を見る

---

## まとめ

- **JSON** は「キー: 値」の形式でデータを表現する軽量フォーマット
- **データ型** は文字列・数値・真偽値・配列・オブジェクト・nullの6種類
- **DevTools** の「Network ➔ Fetch/XHR ➔ Preview」で通信中のJSONを確認できる
- **VS Code** のフォーマット機能や折りたたみ機能を活用して、効率的に読み書きできる

### 次のステップ

- [npm](/themes/01-web-basics/05-npm) モジュールで、JSONで書かれた設定ファイル `package.json` の読み方を学びましょう
- [DevTools](/themes/01-web-basics/07-devtools) の Network パネルで、普段使っているWebサービスがどのようなJSONをやり取りしているか観察してみましょう

### 参考リソース

- [JSON の紹介（json.org 日本語）](https://www.json.org/json-ja.html)：JSONの公式仕様の解説
- [MDN: JSON](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/Scripting/JSON)：JavaScriptでのJSONの扱い方を含む入門解説
- [VS Code: Editing JSON with Visual Studio Code](https://code.visualstudio.com/docs/languages/json)：VS CodeのJSON編集機能の公式ドキュメント
