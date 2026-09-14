---
title: "clasp 3.x セットアップと基本操作"
description: "clasp 3.x のインストール、認証設定、プロジェクト作成・クローン、プッシュと監視、設定ファイル、および 2.x からのコマンド名変更とTypeScript運用の変化を解説。"
order: 2
type: lecture
difficulty: beginner
tags: [gas, google-apps-script, clasp]
status: published
---

# clasp 3.x セットアップと基本操作

Google 公式の CLI ツール **`clasp`（Command Line Apps Script Projects）** を使うと、クラウド上にある Google Apps Script のコードをローカルマシンにダウンロードし、使い慣れたエディタや Git、生成 AI ツールと連携させることができます。

現在主流の **clasp 3.x 系** では、従来の 2.x 系から一部のコマンド体系が刷新され、TypeScript のトランスパイル方針にも重要な変更が加えられました。本ページでは、clasp 3.x のセットアップ手順、基本コマンド、主要な設定ファイル、そして 2.x からの移行差分を網羅して解説します。

## このページで学べること

- clasp のインストールと Google アカウントでの認証（`clasp login`）
- Apps Script API の有効化手順
- 新規プロジェクト作成（`create-script`）と既存プロジェクト取得（`clone-script`）
- ローカルとクラウドの同期（`push`、`pull`、`push --watch`）
- `.clasp.json` と `.claspignore` の役割
- **clasp 2.x から 3.x へのコマンド名変更と変更理由**
- clasp 3.x における TypeScript 運用の注意点（バンドラの必須化）

## 事前準備：Google Apps Script API の有効化

clasp を使ってローカルからスクリプトを操作するには、Google アカウント側で API の利用を許可しておく必要があります。

1. ブラウザで [script.google.com/home/usersettings](https://script.google.com/home/usersettings) にアクセスします。
2. 「**Google Apps Script API**」のトグルスイッチを探します。
3. 設定を **「オン」** に切り替えます。

> [!CAUTION]
> この設定をオンにしていない状態で clasp のコマンドを実行すると、`User has not enabled the Apps Script API. Enable it by visiting https://script.google.com/home/usersettings then retry.` というエラーが発生します。
> （※なお、Google Cloud プロジェクトを紐付けた後に `Google Apps Script API has not been used in project ... or it is disabled` と出る場合は、GCP 側の API ライブラリで「Google Apps Script API」が無効になっていることが原因です。）

## clasp 3.x のインストールとログイン

Node.js（バージョン 22 以上推奨）がインストールされた環境で、以下のコマンドを実行します。

```bash
# グローバルにインストールする場合
npm install -g @google/clasp

# バージョン確認
clasp --version
```

### Google アカウントでログイン

```bash
clasp login
```

コマンドを実行すると既定のブラウザが起動し、Google アカウントのログイン画面が開きます。
画面の指示に従ってアクセス権限（スクリプトの作成・表示・管理など）を許可すると、ローカルのホームディレクトリ（`~/.clasprc.json`）に認証トークンが保存され、ログインが完了します。

> [!NOTE]
> リモートサーバーや SSH 経由でブラウザが直接開かない環境では、`clasp login --no-localhost` を使用します。表示された URL を手元のブラウザで開き、認可コードをターミナルに貼り付けて認証します。

## 基本操作ワークフロー

clasp によるローカル開発の基本サイクルは、以下の流れになります。

![claspでGASを操作：クラウドとローカルを clasp clone-script / clasp push でつなぐ](/content-assets/06-google-apps-script/02-ai-development/images/clasp-local-workflow.png)

### 1. 新規プロジェクトの作成、または既存のクローン

#### 新規作成する場合

```bash
# スタンドアロンスクリプトを作成する場合
clasp create-script --title "MyGASProject" --type standalone

# スプレッドシートやドキュメントに紐づくコンテナバインドスクリプトを作る場合
clasp create-script --title "SheetAutomation" --type sheets
```

#### 既存のプロジェクトをクローンする場合

ブラウザで Apps Script エディタを開き、URL（`https://script.google.com/d/<SCRIPT_ID>/edit`）から **スクリプト ID（`<SCRIPT_ID>`）** をコピーします。

```bash
clasp clone-script <SCRIPT_ID>
```

実行すると、プロジェクトフォルダ内に以下のファイルが生成されます。
- `appsscript.json`: プロジェクトマニフェスト
- `コード.js`（または `.gs`）: スクリプトファイル本体
- `.clasp.json`: clasp の設定ファイル

### 2. ローカルとクラウドの同期

#### ローカルの変更をクラウドに反映（Push）

```bash
clasp push
```

ローカルで編集した `.js` / `.ts` / `.html` ファイルがクラウド上の Apps Script プロジェクトに一括送信されます。

ファイルを保存するたびに自動で反映させたい場合は、監視モードを使います。

```bash
clasp push --watch
```

#### クラウドの変更をローカルに取り込み（Pull）

ブラウザ側で直接コードを修正した場合は、ローカルに取り込みます。

```bash
clasp pull
```

### 3. ブラウザでエディタを開く

```bash
clasp open-script
```

ターミナルから 1 コマンドで対象の Apps Script エディタをブラウザで開くことができます。

## 設定ファイルの役割

clasp の挙動は、プロジェクトルートにある 2 つの設定ファイルで制御します。

### `.clasp.json`（プロジェクト定義）

clasp がどの Apps Script プロジェクトと同期しているかを記録するファイルです。

```json
{
  "scriptId": "1a2b3c4d5e6f7g8h9i...",
  "rootDir": "./src"
}
```

- **`scriptId`**: 同期先スクリプトの一意な ID。
- **`rootDir`**: 同期対象のソースコードを置くディレクトリ。`./src` を指定すると、`src/` 配下のファイルのみがクラウドに push され、プロジェクトルートの `README.md` や `package.json` は送信されません。
- **マニフェストファイルの配置場所**: `rootDir` を指定した場合、**`appsscript.json` も `src/` 配下に配置する**必要があります（clasp は `rootDir` 内からマニフェストを探すためです）。

### `.claspignore`（除外設定）

`.gitignore` と同様の文法で、クラウドへ push したくないファイルを指定します。

> [!IMPORTANT]
> **`.claspignore` のパスは `rootDir` からの相対パス**として解釈されます。
> `rootDir: "./src"` と設定している場合、対象パスは `src/Code.js` ではなく `Code.js` になります。そのため、除外解除ルール（`!`）に `src/` プレフィックスを付けるとマッチせず、すべてのファイルが除外されてしまうトラブルが頻発します。

```text
**/**
!appsscript.json
!**/*.js
!**/*.ts
!**/*.html
```

> [!TIP]
> `package.json`、`node_modules/`、テストファイル、Git 関連ファイルなどが誤って GAS 上に push されると動作不良の原因になります。`.claspignore` は必ず設定しておきましょう。

## clasp 2.x から 3.x への主な変更点

clasp 3.x では、コマンド名の体系化と一貫性の向上のために、一部のコマンド名が変更されました（旧コマンドにも互換用のエイリアスが残されているものがあります）。

| 2.x のコマンド | 3.x の正式コマンド名 | 説明 |
| --- | --- | --- |
| `clasp open` | `clasp open-script` | ブラウザで Apps Script エディタを開く |
| `clasp open --web` | `clasp open-web-app` | デプロイした Web アプリケーションの URL を開く |
| `clasp open --addon` | `clasp open-container` | 親コンテナ（スプレッドシート等）を開く |
| `clasp create` | `clasp create-script` | 新規 Apps Script プロジェクトを作成する |
| `clasp clone` | `clasp clone-script` | 既存プロジェクトをクローンする |
| `clasp deploy -i <ID>` | `clasp update-deployment <ID>` | 既存デプロイのバージョンを更新する（エイリアス: `redeploy`） |
| `clasp logs --open` | `clasp open-logs` | Google Cloud Console のログ画面を開く |
| `clasp apis enable <api>` | `clasp enable-api <api>` | Google API サービスを有効化する |

また、AI コーディングエージェントとの連携用として、3.x では新たに **`clasp mcp`（`clasp start-mcp-server`）** コマンドが追加されました。

## clasp 3.x における TypeScript 運用の変化

clasp 2.x では、`.ts` ファイルを置くだけで clasp 内部のトランスパイラが簡易的に `.gs` へ変換して push してくれる機能がありました。

しかし、**clasp 3.x ではこの組み込みトランスパイル機能が廃止** されました。

### なぜ廃止されたのか？

clasp 内部のトランスパイラは機能が限定的で、モダンな TypeScript の機能や npm パッケージのバンドル（モジュール解決）に十分対応できていませんでした。

### 3.x での推奨アプローチ

TypeScript やモジュール分割、npm パッケージを使いたい場合は、**Rollup や Vite、Webpack などの標準的なバンドラツールを使って、ローカルで単一の `.js` ファイルにビルドしてから `clasp push` する構成** が標準となりました。

```text
[TypeScript ソース (src/**/*.ts)]
      │
      ▼  Rollup 等のバンドラでビルド
[出力ファイル (dist/Code.js)]
      │
      ▼  clasp push
[クラウドの GAS]
```

Google 公式リポジトリでも、[aside](https://github.com/google/aside) や Rollup テンプレート（`apps-script-typescript-rollup-starter`）の利用が推奨されています。

## まとめ

- **API の有効化**: 最初に [script.google.com/home/usersettings](https://script.google.com/home/usersettings) で API をオンにする。
- **基本サイクル**: `create-script` / `clone-script` → ローカルで編集 → `push`（または `push --watch`）。
- **設定ファイル**: 同期先は `.clasp.json`、除外ファイルは `.claspignore` で管理。
- **3.x の特徴**: `open-script` や `update-deployment` へのコマンド名統一、TypeScript は Rollup 等のバンドラ併用が必須、そして `clasp mcp` の実験的搭載。
