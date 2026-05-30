---
title: "クラス構文"
description: "class によるオブジェクトの設計図の書き方、コンストラクタ・メソッド・継承の基本を学ぶ。"
order: 9
type: lecture
difficulty: beginner
tags: [javascript, es6]
estimatedMinutes: 9
status: published
---
# クラス構文

## 解説

`class` キーワードを使うと、データ（プロパティ）とそれを操作する関数（メソッド）をひとまとめにした「設計図」を定義できます。設計図からは `new` で実体（インスタンス）を作ります。

```js
class User {
  // インスタンス生成時に呼ばれる初期化メソッド
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // メソッド
  greet() {
    return `${this.name}（${this.age}歳）です。`;
  }
}

const taro = new User("田中", 25);
console.log(taro.name); // "田中"
console.log(taro.greet()); // "田中（25歳）です。"
```

**ポイント**: `constructor` は `new` したときに 1 回だけ呼ばれ、`this` に初期値を設定します。`this` はそのインスタンス自身を指します。

---

## 従来の書き方との比較

ES6 より前は、関数とプロトタイプを使って同じことを実現していました。クラス構文は、それを読みやすく書き直したものです。

```js
// 従来（プロトタイプベース）
function User(name) {
  this.name = name;
}
User.prototype.greet = function () {
  return `${this.name}です。`;
};

// ES6 クラス（同じ動作をより読みやすく）
class User2 {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `${this.name}です。`;
  }
}
```

---

## 継承（extends）

`extends` を使うと、既存のクラスの機能を引き継いだ新しいクラスを作れます。親の `constructor` を呼ぶには `super()` を使います。

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name}が鳴いた`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 親の constructor を呼ぶ
    this.breed = breed;
  }

  // メソッドの上書き（オーバーライド）
  speak() {
    return `${this.name}（${this.breed}）がワンと鳴いた`;
  }
}

const pochi = new Dog("ポチ", "柴犬");
console.log(pochi.speak()); // "ポチ（柴犬）がワンと鳴いた"
console.log(pochi.name); // "ポチ"（親から継承したプロパティ）
```

---

## ゲッターと静的メソッド

`get` を付けると、メソッドをプロパティのように参照できます。`static` を付けると、インスタンスではなくクラス自体に属するメソッドになります。

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  // ゲッター: () なしで参照できる
  get area() {
    return this.width * this.height;
  }

  // 静的メソッド: クラスから直接呼ぶ
  static fromSquare(size) {
    return new Rectangle(size, size);
  }
}

const rect = new Rectangle(4, 3);
console.log(rect.area); // 12（() を付けない）

const square = Rectangle.fromSquare(5); // インスタンス不要で呼べる
console.log(square.area); // 25
```

> [!NOTE]
> クラス構文は新しい書き方ですが、内部では従来のプロトタイプの仕組みで動いています。あくまで「読みやすくするための表記」だと理解しておくとよいでしょう。

---

## まとめ

| 要素 | 役割 |
|------|------|
| `constructor` | インスタンス生成時の初期化 |
| メソッド | インスタンスが持つ機能 |
| `extends` / `super` | 継承と親の呼び出し |
| `get` | プロパティのように参照するメソッド |
| `static` | クラス自身に属するメソッド |
