---
title: フォーム要素
description: 入力フォームの基本要素を学ぶ。
order: 6
type: lecture
difficulty: beginner
tags: [html]
estimatedMinutes: 10
status: published
---

# フォーム要素

## 解説

問い合わせ・ログイン・検索・アンケートなど、**ユーザーからの入力**を受け取る部分はフォームで作ります。
フォーム全体を `<form>` で囲み、その中に入力欄やボタンを配置します。

```html
<form action="/submit" method="post">
  <label for="name">お名前</label>
  <input type="text" id="name" name="name" />
  <button type="submit">送信</button>
</form>
```

| 属性 | 役割 |
|------|------|
| `action` | 入力内容の送信先 URL |
| `method` | 送信方法（`get` または `post`） |

---

## テキスト入力（`<input>`）

`<input>` は、`type` 属性によってさまざまな入力欄になる万能な要素です。閉じタグは持ちません。

```html
<input type="text" name="username" placeholder="ユーザー名を入力" />
<input type="email" name="email" placeholder="example@mail.com" />
<input type="password" name="password" />
<input type="number" name="age" />
<input type="date" name="birthday" />
```

### よく使う `type` の種類

| `type` | 用途 | 特徴 |
|--------|------|------|
| `text` | 一般的な文字入力 | 標準の1行入力 |
| `email` | メールアドレス | 形式チェックが効く |
| `password` | パスワード | 入力文字が伏せ字になる |
| `number` | 数値 | 数値以外を弾く |
| `date` | 日付 | 日付ピッカーが表示される |
| `checkbox` | 複数選択 | オン/オフを選べる |
| `radio` | 単一選択 | 複数から1つ選ぶ |

> [!TIP]
> `placeholder` は入力欄に薄く表示されるヒントです。何を入力すればよいか分かりやすくなりますが、ラベルの代わりにはなりません。後述の `<label>` と併用しましょう。

---

## ラベルとの紐付け（`<label>`）

`<label>` は入力欄の説明文です。入力欄と正しく紐付けると、ラベルをクリックしただけで入力欄にカーソルが移るようになります。

紐付けには2つの方法があります。

```html
<!-- 方法1: for と id を一致させる -->
<label for="email">メールアドレス</label>
<input type="email" id="email" name="email" />

<!-- 方法2: label で input を囲む -->
<label>
  メールアドレス
  <input type="email" name="email" />
</label>
```

> [!IMPORTANT]
> ラベルと入力欄の紐付けは、アクセシビリティの基本です。スクリーンリーダーが「この入力欄は何を入力する欄か」を読み上げられるようになります。すべての入力欄にラベルを付けましょう。

---

## チェックボックスとラジオボタン

複数の選択肢を提示するときに使います。

```html
<!-- チェックボックス: 複数選べる -->
<label><input type="checkbox" name="hobby" value="reading" /> 読書</label>
<label><input type="checkbox" name="hobby" value="sports" /> スポーツ</label>

<!-- ラジオボタン: 1つだけ選べる -->
<label><input type="radio" name="plan" value="free" /> 無料プラン</label>
<label><input type="radio" name="plan" value="pro" /> 有料プラン</label>
```

**ポイント**

- ラジオボタンは、同じ `name` を付けたものが「1つのグループ」になり、その中から1つだけ選べます。
- チェックボックスは、それぞれ独立してオン/オフを切り替えられます。

---

## 複数行の入力（`<textarea>`）

問い合わせ内容など、長い文章を入力する欄には `<textarea>` を使います。

```html
<label for="message">お問い合わせ内容</label>
<textarea id="message" name="message" rows="5" cols="40"></textarea>
```

`rows` で表示行数、`cols` でおおよその表示幅を指定します。

---

## 選択メニュー（`<select>`）

ドロップダウンで選ばせるときは `<select>` と `<option>` を使います。

```html
<label for="pref">都道府県</label>
<select id="pref" name="pref">
  <option value="">選択してください</option>
  <option value="tokyo">東京都</option>
  <option value="osaka">大阪府</option>
  <option value="aichi">愛知県</option>
</select>
```

各選択肢が `<option>`、画面に表示される文字はタグの内側、サーバーに送られる値は `value` 属性です。

---

## ボタン（`<button>`）

`<button>` は、`type` 属性で役割が変わります。

```html
<button type="submit">送信する</button>
<button type="reset">入力をリセット</button>
<button type="button">クリックで動作（JavaScript 用）</button>
```

| `type` | 動作 |
|--------|------|
| `submit` | フォームを送信する |
| `reset` | 入力内容を初期状態に戻す |
| `button` | 標準の動作なし（JavaScript で処理を割り当てる） |

> [!NOTE]
> `<form>` の中で `type` を省略した `<button>` は、自動的に `submit`（送信）として扱われます。送信を意図しないボタンには `type="button"` を明示しましょう。

---

## 入力チェック（バリデーション）

HTML には、JavaScript を書かなくても使える基本的な入力チェック機能があります。

```html
<form>
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <input type="number" name="age" min="0" max="120" />
  <input type="text" name="zip" maxlength="7" pattern="[0-9]{7}" />
  <button type="submit">送信</button>
</form>
```

| 属性 | 役割 |
|------|------|
| `required` | 入力が必須。空のまま送信できない |
| `min` / `max` | 数値や日付の最小・最大 |
| `maxlength` | 入力できる最大文字数 |
| `pattern` | 入力形式を正規表現で指定 |

`required` を付けた欄を空のまま送信しようとすると、ブラウザが自動でエラーメッセージを表示して送信を止めます。

> [!WARNING]
> HTML のバリデーションは「入力ミスを防ぐ補助」です。ユーザーが手元のブラウザで簡単に回避できるため、これだけに頼らず、最終的な検証はサーバー側でも必ず行う必要があります（後のレッスンで扱います）。

---

## まとめ

- フォーム全体は `<form>` で囲み、`action`・`method` で送信先と方法を指定する。
- `<input>` は `type` で多様な入力欄になる（`text`・`email`・`password`・`checkbox`・`radio` など）。
- すべての入力欄に `<label>` を紐付ける（`for` と `id`、または囲む方法）。
- 長文は `<textarea>`、選択肢は `<select>`/`<option>`。
- `required` などの属性で基本的な入力チェックができるが、最終検証はサーバー側でも行う。
