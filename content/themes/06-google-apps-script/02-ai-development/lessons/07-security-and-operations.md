---
title: "セキュリティと運用（シークレット管理・Git・CI/CD）"
description: "PropertiesService による API キーの安全な管理、最小権限スコープの徹底、Git 管理における注意点、および GitHub Actions からの clasp push 自動化を解説。"
order: 7
type: lecture
difficulty: intermediate
tags: [gas, google-apps-script, security, secrets, git, ci-cd]
status: draft
---

# セキュリティと運用（シークレット管理・Git・CI/CD）

ローカル環境にコードを落とし、Git や生成 AI を使って開発を進めるようになると、**「セキュリティと運用管理」** の重要性が一気に跳ね上がります。

[AI駆動開発のセキュリティとsecrets管理](/themes/04-ai-driven-development/03-development-practice/ai-security-secrets) で学んだ通り、API キーやトークンをコード中に平文で書いてしまったり、Git リポジトリに誤って push してしまう事故は絶対に避けなければなりません。また、AI エージェントに必要以上の広範な権限を与えないためのスコープ設計も不可欠です。

本ページでは、GAS アプリケーションを本番運用に耐えうる水準にするための **シークレット管理（PropertiesService）**、**Git 運用のベストプラクティス**、そして **GitHub Actions を使った CI/CD パイプライン** を解説します。

## このページで学べること

- コードに秘密情報を書かない `PropertiesService` の正しい使い方
- `appsscript.json` における OAuth スコープの最小化（最小権限の原則）
- Git 管理で絶対にコミットしてはいけないファイル（`.gitignore` / `.claspignore`）
- GitHub Actions を用いた `clasp push` による継続的デプロイ（CI/CD）

## 1. シークレット管理：PropertiesService の活用

外部 API（Slack、OpenAI、Notion、Stripe など）と連携する際、API キーや Webhook URL などの秘密情報をコード内に直接ハードコードしてはいけません。コードを Git に上げた瞬間に漏洩事故につながります。

GAS では、秘密情報は **`PropertiesService`（スクリプトのプロパティ）** に保存するのが鉄則です。

```javascript
// ❌ 絶対にやってはいけない例（コードに平文ハードコード）
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/T00/B00/XXXXX";

// ✅ 正しい例（PropertiesService から安全に取得）
function postToSlack(message) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const webhookUrl = scriptProperties.getProperty("SLACK_WEBHOOK_URL");

  if (!webhookUrl) {
    throw new Error("スクリプトプロパティ 'SLACK_WEBHOOK_URL' が設定されていません。");
  }

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ text: message }),
  });
}
```

### スクリプトプロパティの設定方法

1. ブラウザで Apps Script エディタを開きます。
2. 左サイドバーの歯車アイコン（**プロジェクトの設定**）をクリックします。
3. ページ下部にある「**スクリプト プロパティ**」セクションで「**スクリプト プロパティを追加**」をクリックします。
4. プロパティ名（例: `SLACK_WEBHOOK_URL`）と値（実際の URL）を入力して保存します。

> [!NOTE]
> スクリプトプロパティに保存された値は、プロジェクトのコードファイル（`.gs`）には含まれません。そのため、`clasp pull` でローカルにコードを落としても、秘密情報が平文ファイルとして手元の PC に保存される心配がありません。

## 2. 最小権限スコープの徹底

GAS は、コード中で `DriveApp` や `GmailApp` を呼び出すと、デフォルトでそのサービスの最も強力な全体権限（例: Google ドライブ内の全ファイルへのフルアクセス）を要求します。

万が一スクリプトに脆弱性があったり、AI が意図しないコードを生成した際の被害を最小限に抑えるため、`appsscript.json` でスコープを明示的に絞り込みます。

### スコープを絞り込む例

たとえば、ドライブ全体へのアクセス（`https://www.googleapis.com/auth/drive`）のような広すぎる権限を避け、スクリプトが作成したファイルのみにアクセスできる `drive.file` や、開いているスプレッドシートのみに限定する `spreadsheets.currentonly`、外部 API リクエスト用の `script.external_request` に限定して定義します。

```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

## 3. Git 運用のベストプラクティス

ローカルで Git 管理を行う際は、**「どのファイルを Git に含め、どのファイルを clasp に送信するか」** の境界を厳密に分けます。

### リポジトリの推奨ディレクトリ構成

```text
my-gas-project/
├── .git/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD パイプライン
├── .gitignore              # Git 管理から除外する設定
├── .claspignore            # clasp push から除外する設定
├── .clasp.json             # clasp 設定（scriptId）
├── package.json
├── CLAUDE.md               # AI への指示書
└── src/                    # GAS に push するコード
    ├── appsscript.json
    └── Code.js
```

### `.gitignore` の設定例

```text
# 依存関係
node_modules/

# clasp のローカル認証情報（※絶対にコミットしてはいけない！）
.clasprc.json

# ビルド成果物・一時ファイル
dist/
.DS_Store
```

> [!CAUTION]
> ホームディレクトリではなくプロジェクトディレクトリに `.clasprc.json`（Google アカウントの認可トークン）が生成された場合、これを Git にコミットすると、あなたの Google アカウントのフルアクセス権が外部に流出します。`.gitignore` には必ず `.clasprc.json` を含めてください。

## 4. GitHub Actions によるデプロイ自動化（CI/CD）

チーム開発や本番運用では、個人の PC から手動で `clasp push` するのではなく、GitHub の `main` ブランチにマージされたタイミングで GitHub Actions が自動的に push する仕組み（CI/CD）を構築すると安全です。

### ワークフローの構成例（`.github/workflows/deploy.yml`）

```yaml
name: Deploy to Apps Script

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install clasp
        run: npm install -g @google/clasp

      - name: Setup clasp credentials
        run: |
          echo '${{ secrets.CLASPRC_JSON }}' > ~/.clasprc.json

      - name: Push to Apps Script
        run: clasp push --force
```

### 設定のポイント

1. 手元の PC で `cat ~/.clasprc.json` を実行し、その中身（JSON 文字列）をコピーします。
2. GitHub リポジトリの「Settings」>「Secrets and variables」>「Actions」を開きます。
3. `CLASPRC_JSON` という名前でシークレットを登録します。

これにより、プルリクエストでコードレビューを通過し、テストが成功した信頼できるコードだけが、自動的に Google Apps Script 上へ反映されるようになります。

## まとめ

- **シークレット管理**: API キーや Webhook URL はコードに書かず、`PropertiesService`（スクリプトプロパティ）に保管する。
- **最小権限**: `appsscript.json` で `oauthScopes` を明示し、`.currentonly` や `.file` など必要最小限のアクセス権に絞る。
- **Git の安全策**: `.clasprc.json` などの資格情報を絶対にコミットしないよう `.gitignore` を設定する。
- **CI/CD 自動化**: GitHub Actions と clasp を連携させ、レビュー済みの安全なコードだけを自動 push する体制を作る。
