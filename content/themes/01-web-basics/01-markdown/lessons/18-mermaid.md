---
title: "図表（Mermaid）サンプル"
order: 18
type: reference
category: ouyou
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# 図表（Mermaid）サンプル

## 解説

Mermaid（マーメイド）は、テキストで図を描画できる記法です。
コードブロックで `mermaid` を指定して使用します。

**対応環境**: GitHub、Notion、Obsidian

---

## フローチャート

### 記法

````markdown
```mermaid
graph TD
    A[開始] --> B{条件分岐}
    B -->|Yes| C[処理1]
    B -->|No| D[処理2]
    C --> E[終了]
    D --> E
```
````

### 表示結果

```mermaid
graph TD
    A[開始] --> B{条件分岐}
    B -->|Yes| C[処理1]
    B -->|No| D[処理2]
    C --> E[終了]
    D --> E
```

### 方向の指定

| 記法 | 方向 |
|------|------|
| `graph TD` | 上から下（Top to Down） |
| `graph LR` | 左から右（Left to Right） |
| `graph BT` | 下から上（Bottom to Top） |
| `graph RL` | 右から左（Right to Left） |

---

## ノードの形状

### 記法

````markdown
```mermaid
graph LR
    A[四角形]
    B(角丸四角形)
    C{ひし形}
    D((円形))
    E([スタジアム形])
    F[[サブルーチン]]
    G[(データベース)]
```
````

### 表示結果

```mermaid
graph LR
    A[四角形]
    B(角丸四角形)
    C{ひし形}
    D((円形))
    E([スタジアム形])
    F[[サブルーチン]]
    G[(データベース)]
```

---

## 矢印のスタイル

### 記法

````markdown
```mermaid
graph LR
    A --> B
    C --- D
    E -.-> F
    G ==> H
    I --テキスト付き--> J
```
````

### 表示結果

```mermaid
graph LR
    A -->|通常の矢印| B
    C ---|線のみ| D
    E -.->|点線矢印| F
    G ==>|太い矢印| H
```

---

## シーケンス図

### 記法

````markdown
```mermaid
sequenceDiagram
    participant U as ユーザー
    participant S as サーバー
    participant D as データベース

    U->>S: リクエスト送信
    S->>D: データ取得
    D-->>S: データ返却
    S-->>U: レスポンス返却
```
````

### 表示結果

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant S as サーバー
    participant D as データベース

    U->>S: リクエスト送信
    S->>D: データ取得
    D-->>S: データ返却
    S-->>U: レスポンス返却
```

---

## クラス図

### 記法

````markdown
```mermaid
classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    class Admin {
        +manageUsers()
    }
    User <|-- Admin
```
````

### 表示結果

```mermaid
classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    class Admin {
        +manageUsers()
    }
    User <|-- Admin
```

---

## ガントチャート

### 記法

````markdown
```mermaid
gantt
    title プロジェクトスケジュール
    dateFormat  YYYY-MM-DD
    section 企画
    要件定義     :a1, 2025-01-01, 7d
    設計         :a2, after a1, 5d
    section 開発
    実装         :b1, after a2, 14d
    テスト       :b2, after b1, 7d
    section リリース
    デプロイ     :c1, after b2, 2d
```
````

### 表示結果

```mermaid
gantt
    title プロジェクトスケジュール
    dateFormat  YYYY-MM-DD
    section 企画
    要件定義     :a1, 2025-01-01, 7d
    設計         :a2, after a1, 5d
    section 開発
    実装         :b1, after a2, 14d
    テスト       :b2, after b1, 7d
    section リリース
    デプロイ     :c1, after b2, 2d
```

---

## 円グラフ

### 記法

````markdown
```mermaid
pie title 言語別使用率
    "JavaScript" : 40
    "Python" : 30
    "TypeScript" : 20
    "その他" : 10
```
````

### 表示結果

```mermaid
pie title 言語別使用率
    "JavaScript" : 40
    "Python" : 30
    "TypeScript" : 20
    "その他" : 10
```

---

## 実用例

### ユーザー登録フロー

````markdown
```mermaid
graph TD
    A[フォーム入力] --> B{入力チェック}
    B -->|OK| C[確認画面]
    B -->|NG| A
    C --> D{確認}
    D -->|確定| E[登録処理]
    D -->|戻る| A
    E --> F[完了画面]
    E --> G[メール送信]
```
````

```mermaid
graph TD
    A[フォーム入力] --> B{入力チェック}
    B -->|OK| C[確認画面]
    B -->|NG| A
    C --> D{確認}
    D -->|確定| E[登録処理]
    D -->|戻る| A
    E --> F[完了画面]
    E --> G[メール送信]
```

---

### API通信フロー

````markdown
```mermaid
sequenceDiagram
    participant C as クライアント
    participant A as APIサーバー
    participant Auth as 認証サーバー

    C->>A: APIリクエスト
    A->>Auth: トークン検証
    Auth-->>A: 検証結果
    alt 認証成功
        A-->>C: データ返却
    else 認証失敗
        A-->>C: 401 Unauthorized
    end
```
````

```mermaid
sequenceDiagram
    participant C as クライアント
    participant A as APIサーバー
    participant Auth as 認証サーバー

    C->>A: APIリクエスト
    A->>Auth: トークン検証
    Auth-->>A: 検証結果
    alt 認証成功
        A-->>C: データ返却
    else 認証失敗
        A-->>C: 401 Unauthorized
    end
```

---

## 主な図の種類

| 種類 | キーワード | 用途 |
|------|------------|------|
| フローチャート | `graph` | 処理の流れ |
| シーケンス図 | `sequenceDiagram` | 通信の流れ |
| クラス図 | `classDiagram` | クラス構造 |
| ガントチャート | `gantt` | スケジュール |
| 円グラフ | `pie` | 割合の表示 |
| ER図 | `erDiagram` | DB設計 |
| 状態遷移図 | `stateDiagram-v2` | 状態変化 |

---

## 参考リンク

- [Mermaid公式ドキュメント](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/)（オンラインで試せる）

---

## 実習

以下のフローチャートを作成してみましょう。

1. 朝起きてから家を出るまでの流れ
2. ログイン処理のフロー
