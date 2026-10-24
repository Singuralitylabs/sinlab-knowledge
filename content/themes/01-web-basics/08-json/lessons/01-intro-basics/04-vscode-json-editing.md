---
title: "VS CodeでJSONを整形・折りたたみする"
order: 4
type: detail
difficulty: beginner
tags: [json, vscode, format, folding]
estimatedMinutes: 6
status: published
---
# VS CodeでJSONを整形・折りたたみする

## 解説

VS Codeには、JSONを扱うための機能が拡張機能なしで標準搭載されています。特に便利なのが **自動整形（フォーマット）** と **コードの折りたたみ（Folding）** です。

### ① 自動整形（フォーマット）

1行に詰まったJSONやインデントが崩れたJSONを、一瞬で読みやすく整列させることができます。

| 方法 | 操作 |
|------|------|
| ショートカットキー（Windows） | `Shift + Alt + F` |
| ショートカットキー（Mac） | `Shift + Option + F` |
| ショートカットキー（Linux） | `Ctrl + Shift + I` |
| コマンドパレット | `Ctrl + Shift + P`（Mac: `Cmd + Shift + P`）➔ `Format Document` を入力して実行 |

### ② コードの折りたたみ（Folding）

階層が深い巨大なJSONを見るときは、オブジェクトや配列単位で折りたたむと全体の構造を把握しやすくなります。

- **行番号の横にある矢印アイコン `v`** をクリックすると、その行から始まるオブジェクトや配列を折りたためます（矢印は行番号付近にマウスを乗せると表示されます）
- 一括で折りたたみ・展開するショートカットもあります

| 操作 | Windows / Linux | Mac |
|------|-----------------|-----|
| すべて折りたたむ | `Ctrl + K` ➔ `Ctrl + 0` | `Cmd + K` ➔ `Cmd + 0` |
| すべて展開する | `Ctrl + K` ➔ `Ctrl + J` | `Cmd + K` ➔ `Cmd + J` |

> 補足：`Ctrl + K` ➔ `Ctrl + 0` は「`Ctrl + K` を押して離したあと、続けて `Ctrl + 0` を押す」という2段階のショートカット（コード）です。その他の編集系ショートカットは [編集のショートカット](/themes/01-web-basics/03-vscode/intro-shortcuts/editing) を参照してください。

---

## サンプル

### 整形前

```json
{"id":101,"username":"suzuki_taro","skills":["HTML","CSS"],"profile":{"age":25,"location":"Tokyo"}}
```

### 整形後（`Shift + Alt + F` を実行）

```json
{
  "id": 101,
  "username": "suzuki_taro",
  "skills": ["HTML", "CSS"],
  "profile": {
    "age": 25,
    "location": "Tokyo"
  }
}
```

---

## よくある間違い

### 1. JSONとして認識されていないファイルで整形できない

```text
❌ .txt ファイルや、言語モードが「プレーンテキスト」のままの新規ファイルに
   貼り付けて整形しようとする
   ➔ JSONとして認識されていないため整形されない

✅ ファイルを .json で保存するか、ステータスバー右下の言語モード
   （「プレーンテキスト」など）をクリックして「JSON」に切り替える
```

### 2. 構文エラーがあるまま整形しようとする

末尾カンマやクォート忘れなどの構文エラーがあると、整形が正しく行われないことがあります。VS Codeはエラー箇所に **赤い波線** を表示するので、先にエラーを解消してから整形しましょう。エラーの一覧は `Ctrl + Shift + M`（Mac: `Cmd + Shift + M`）で開く「問題（Problems）」パネルでも確認できます。

---

## 実用例

### APIレスポンスをVS Codeで読む

DevToolsの `Response` タブからコピーしたJSONは、1行に詰まっていることがよくあります。VS Codeで新規ファイルを作って貼り付け、言語モードを「JSON」にして整形・折りたたみすれば、大きなレスポンスでも構造を落ち着いて読み解けます。

---

## 実習

### 課題1

1. VS Codeで `sample.json` を作成し、上の「整形前」のJSONを貼り付ける
2. `Shift + Alt + F`（Mac: `Shift + Option + F`）で整形する
3. `Ctrl + K` ➔ `Ctrl + 0`（Mac: `Cmd + K` ➔ `Cmd + 0`）ですべて折りたたみ、`Ctrl + K` ➔ `Ctrl + J`（Mac: `Cmd + K` ➔ `Cmd + J`）ですべて展開する
4. `"profile"` の行の矢印アイコンをクリックし、その部分だけが折りたたまれることを確認する

終わったら `sample.json` は削除してかまいません。
