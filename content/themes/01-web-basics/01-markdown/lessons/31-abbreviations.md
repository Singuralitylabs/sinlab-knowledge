---
title: "略語定義（Abbreviations）サンプル"
order: 31
type: reference
category: kakucho
difficulty: beginner
tags: [markdown, reference]
estimatedMinutes: 5
status: published
---
# 略語定義（Abbreviations）サンプル

## 解説

文書内で使用する略語に説明を付けることができます。対応環境では、略語にマウスを乗せるとツールチップで説明が表示されます。

| 記法 | 説明 |
|------|------|
| `*[略語]: 説明` | 略語の定義 |

**注意**：この記法はPHP Markdown ExtraやPandocなど、一部の環境でのみ対応しています。GitHub、Obsidian、VSCodeでは対応していません。

---

## 基本的な略語定義

### 記法

```markdown
HTML仕様ではセマンティックなマークアップが推奨されています。
CSSでスタイルを適用し、JSで動的な処理を行います。

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets
*[JS]: JavaScript
```

### 動作

対応環境では：
1. 本文中の「HTML」「CSS」「JS」に下線が表示される
2. マウスホバーで定義がツールチップ表示される

---

## 技術用語の定義

### Web技術

```markdown
モダンなWeb開発では、SPAやPWAが一般的になっています。
APIを通じてバックエンドと通信し、JSONでデータをやり取りします。

*[SPA]: Single Page Application（シングルページアプリケーション）
*[PWA]: Progressive Web App（プログレッシブWebアプリ）
*[API]: Application Programming Interface
*[JSON]: JavaScript Object Notation
```

### インフラ・DevOps

```markdown
本番環境へのデプロイはCI/CDパイプラインで自動化されています。
DockerコンテナをK8sで管理し、AWSにホスティングしています。

*[CI/CD]: Continuous Integration / Continuous Deployment
*[K8s]: Kubernetes
*[AWS]: Amazon Web Services
```

### セキュリティ

```markdown
認証にはJWTを使用し、HTTPSで通信を暗号化しています。
XSSやCSRF対策も実装済みです。

*[JWT]: JSON Web Token
*[HTTPS]: HyperText Transfer Protocol Secure
*[XSS]: Cross-Site Scripting
*[CSRF]: Cross-Site Request Forgery
```

---

## 略語定義の配置

### 推奨：文書の末尾にまとめる

```markdown
# APIドキュメント

## 概要

このAPIはRESTfulな設計に基づいています。
リクエストはHTTPSで送信し、レスポンスはJSON形式で返されます。

## 認証

OAuthまたはAPIキーで認証します。
JWTトークンの有効期限は24時間です。

## エンドポイント

（省略）

---

<!-- 略語定義はここにまとめる -->
*[API]: Application Programming Interface
*[REST]: Representational State Transfer
*[HTTPS]: HyperText Transfer Protocol Secure
*[JSON]: JavaScript Object Notation
*[OAuth]: Open Authorization
*[JWT]: JSON Web Token
```

### 注意点

- 定義は文書内のどこに書いても機能する
- 同じ略語の複数定義は最後のものが有効
- 大文字・小文字は区別される（HTML ≠ html）

---

## 対応環境

| 環境 | 対応状況 | 備考 |
|------|:--------:|------|
| PHP Markdown Extra | ✅ | 標準対応 |
| Pandoc | ✅ | `+abbreviations` 拡張 |
| Kramdown | ✅ | Jekyll標準 |
| GitHub | ❌ | 非対応 |
| Obsidian | ❌ | 非対応 |
| VSCode | ❌ | 非対応 |
| Notion | ❌ | 非対応 |

---

## 代替方法

略語定義が使えない環境での代替アプローチです。

### 方法1：脚注を使う

```markdown
HTML[^1]仕様ではセマンティックなマークアップが推奨されています。

[^1]: HyperText Markup Language
```

### 方法2：括弧で補足

```markdown
HTML（HyperText Markup Language）仕様ではセマンティックなマークアップが推奨されています。
```

### 方法3：用語集セクションを作る

```markdown
## 用語集

| 略語 | 正式名称 | 説明 |
|------|----------|------|
| HTML | HyperText Markup Language | Webページの構造を定義 |
| CSS | Cascading Style Sheets | スタイルを定義 |
| JS | JavaScript | 動的な処理を実装 |
```

### 方法4：HTMLのabbr要素

```html
<abbr title="HyperText Markup Language">HTML</abbr>仕様では...
```

---

## Pandocでの使用

Pandocで略語定義を有効にするには：

```bash
pandoc input.md -o output.html --from markdown+abbreviations
```

または YAML フロントマターで：

```yaml
---
from: markdown+abbreviations
---
```

---

## 実用例

### 技術ドキュメントの用語定義

```markdown
# システム設計書

## アーキテクチャ

本システムはMVCパターンを採用しています。
フロントエンドはSPAで実装し、バックエンドはRESTful APIを提供します。

DBにはRDBMSを使用し、キャッシュにはRedisを導入しています。
デプロイはCI/CDパイプラインで自動化されています。

## セキュリティ

認証はOAuth 2.0 + JWTで実装しています。
通信はすべてTLSで暗号化されています。

---

*[MVC]: Model-View-Controller
*[SPA]: Single Page Application
*[REST]: Representational State Transfer
*[API]: Application Programming Interface
*[DB]: Database
*[RDBMS]: Relational Database Management System
*[CI/CD]: Continuous Integration / Continuous Deployment
*[OAuth]: Open Authorization
*[JWT]: JSON Web Token
*[TLS]: Transport Layer Security
```

---

## 実習

以下の文書に略語定義を追加してみましょう。

```markdown
## クラウドインフラ構成

本システムはAWSを使用しています。
EC2インスタンスでアプリケーションを実行し、
S3でファイルを保存しています。
RDSでデータベースを管理し、
CloudFrontでCDNを構成しています。

---

<!-- ここに略語定義を追加 -->
*[AWS]:
*[EC2]:
*[S3]:
*[RDS]:
*[CDN]:
```

**解答例**：

```markdown
*[AWS]: Amazon Web Services
*[EC2]: Elastic Compute Cloud
*[S3]: Simple Storage Service
*[RDS]: Relational Database Service
*[CDN]: Content Delivery Network
```
