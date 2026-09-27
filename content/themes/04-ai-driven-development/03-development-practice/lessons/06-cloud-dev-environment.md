---
title: "AI駆動開発はクラウド環境で行う"
description: "AIコーディングエージェントを自分のPCではなくクラウドの隔離VMで動かす「クラウド開発環境」について、安全性・並列性・再現性・端末非依存の4つの利点、Claude Codeクラウドセッションでの設定手順（ネットワーク・環境変数・セットアップスクリプト・SessionStartフック）、Codex / Copilot / Cursor / Julesとの対応、ローカルとの使い分けを解説。"
order: 6
type: lecture
difficulty: intermediate
tags: [ai-coding, cloud, sandbox, claude-code, codex, copilot, security, best-practices]
estimatedMinutes: 22
status: published
---

# AI駆動開発はクラウド環境で行う

AI に任せる時間が長くなるほど、「AI がどこで動いているか」が問題になります。ローカルで動かす限り、作業中は PC を閉じられず、秘密情報は AI の読める場所に置かれ、一度に走らせられるのは基本的に 1 つのタスクだけです。本ページでは、AI 駆動開発の既定の作業場所を**クラウドの隔離環境**に移す考え方と、その具体的な設定方法を解説します。

> [!NOTE]
> 本ページの内容は **2026 年 9 月時点** のものです。手順・プラン条件・上限・UI 名称は変更される可能性があります。実際に設定する際はページ末尾の「参考リソース」にある各公式ドキュメントで最新情報を確認してください。
>
> また、本ページでは **Claude Code のクラウドセッション**を例に解説しますが、OpenAI Codex・GitHub Copilot・Cursor・Google Jules も基本構造は同じです。各ツールの対応物は「他ツールでの対応物」にまとめています。コマンド例は macOS / Linux のシェルを前提とします。

## このページで学べること

- クラウド開発環境の定義と構成要素（隔離 VM・環境定義・資格情報プロキシ・GitHub 連携）
- ローカルではなくクラウドを選ぶ **4 つの利点**（安全性・並列性・再現性・端末非依存）
- それでもローカルが向く場面と「クラウドを既定、ローカルを例外」の判断基準
- Claude Code でクラウドセッションを始める手順と 5 つの起点
- クラウド環境の 4 要素（ネットワーク・環境変数・API credentials・セットアップスクリプト）の設定
- リポジトリ側の準備（SessionStart フック）とセッション中の隔離の実際
- ローカルとクラウドの往復（`--cloud`・追送・`--teleport`）と他ツールの対応表

## クラウド開発環境とは何か

**クラウド開発環境**とは、エージェントが GitHub リポジトリをクローンした**隔離された VM（仮想マシン）の中で作業し、結果を PR として返す**仕組みです。ポイントは「エディタがクラウドにある」ことではなく、「エージェントの作業場所そのものが、自分の PC から切り離された隔離環境にある」ことです。

構成要素は 4 つです。

| 要素 | 役割 |
| --- | --- |
| 隔離 VM | エージェントの作業場所。セッションごとに用意され、自分の PC のファイル・秘密情報とは分離される |
| 環境定義 | VM の中身をコードとして定義したもの（ネットワーク範囲・環境変数・セットアップスクリプト）。チームで共有できる |
| 資格情報プロキシ | GitHub トークンや API キーを VM に入れず、サーバ側で付与する仕組み |
| GitHub 連携 | リポジトリの取得と、ブランチ・PR としての結果の返却 |

ローカルとクラウドの違いを図にすると、次のようになります。

![ローカルとクラウドの比較。ローカルではエージェント・作業ファイル・.env や秘密鍵が同じ PC に同居し、エージェントが秘密情報を読める。クラウドでは隔離 VM に秘密情報を置かず、外部への通信はすべてプロキシを経由して許可リストで制限され、トークンや API キーはサーバ側に保管した資格情報からプロキシが付与する。許可外のホストへの通信は 403 で拒否される](/content-assets/04-ai-driven-development/03-development-practice/images/cloud-dev-environment/local-vs-cloud.svg)

Claude Code の場合、Anthropic 管理の VM は Ubuntu 24.04（おおむね 4 vCPU / 16 GB / 30 GB 程度。公式ドキュメントの Resource limits に記載の目安であり、変更される可能性があります）で、リポジトリをクローンした状態から始まります。Node.js・Python・Docker・PostgreSQL・Redis・`gh` などがあらかじめ入っており、足りないものはセットアップスクリプトで追加します。

### 似て非なるものとの違い

名前が似ているだけで、中身が違うものを整理します。

| もの | 何か | クラウド開発環境との違い |
| --- | --- | --- |
| **Remote Control** | 自分の PC で動くセッションをスマホ・ブラウザから操作する機能 | 実行場所は自分の PC のまま。クラウドではない |
| **GitHub Codespaces** | ブラウザで使えるクラウド上の開発コンテナ | 人間が手を動かす場所。エージェントが自律的に作業して PR を返す仕組みではない |
| **devcontainer** | コンテナ定義をコードで共有する仕組み | 環境定義の考え方は近いが、あくまでローカル／Codespaces 用の定義。エージェント実行基盤ではない |

なお、[Claude Cowork](/themes/04-ai-driven-development/02-claude-code/cowork) もクラウドで実行されますが、開発以外の業務向けの独立したプロダクトであり、本ページで扱う開発用のクラウドセッションとは別物です。

## なぜローカルではなくクラウドか — 4つの利点

推奨の根拠は「便利だから」ではなく、次の 4 点です。

### (1) 安全性 — 構造で secrets を見せない

[AI駆動開発のセキュリティとsecrets管理](/themes/04-ai-driven-development/03-development-practice/ai-security-secrets)で学んだ lethal trifecta（機密データへのアクセス・信頼できない入力・外部への通信）を思い出してください。クラウド環境は、この 3 点のうち 2 つを**構造で**弱めます。

- 隔離された VM で動くため、自分の PC にある秘密情報にそもそも手が届かない
- ネットワーク許可リストで外部通信の範囲を絞れる
- GitHub トークンや API キーは VM に入れず、プロキシがサーバ側で付与する

「AI が読める場所に secrets が無い」を、運用の心がけではなく環境の構造で実現できるのが最大の利点です。

### (2) 並列性 — PC を閉じても続く、複数同時

セッションが PC から独立しているため、PC を閉じても処理が続き、複数のタスクを同時に走らせられます。スマホから進捗を確認して次を指示する使い方もできます。

### (3) 再現性 — 環境をコードとして定義する

ネットワーク範囲・環境変数・セットアップ手順を環境定義として保存し、キャッシュから毎回同じ環境を再現できます。「自分の PC でだけ動く」問題が起きにくくなります。

### (4) 端末非依存 — どこからでも同じセッションへ

ブラウザ・モバイル・デスクトップ・CLI のどこからでも同じセッションを開けます。出先ではスマホで確認し、戻ったらデスクトップでレビューできます。

4 つの利点を対比表にまとめます。

| 利点 | ローカルでは | クラウドでは |
| --- | --- | --- |
| 安全性 | `.env` がディスク上にあり AI が読める。通信範囲も PC まかせ | 隔離 VM＋許可リスト＋資格情報プロキシで構造的に分離 |
| 並列性 | PC を開いたまま 1 つずつ。閉じると止まる | PC を閉じても継続。複数タスクを同時実行 |
| 再現性 | 「自分の PC でだけ動く」が起きる | 環境定義＋キャッシュで誰でも同じ環境 |
| 端末非依存 | 作業中の PC が必要 | ブラウザ・モバイル・CLI から同じセッションへ |

## それでもローカルが向く場面

| 場面 | 理由 | 選び方 |
| --- | --- | --- |
| ローカルにしかないツール・実機・GUI を使う | VM にはそのデバイスもライセンスも無い | ローカルで動かす |
| 大規模ビルド・メモリを大量に使う処理 | VM のリソース上限（おおむね 4 vCPU / 16 GB 程度）を超える | 自分のマシンかセルフホスト環境で動かす |
| 対話的な設計・探索 | 計画モードで細かく往復する段階ではローカルの応答性が勝つ | 計画はローカルで、実行はクラウドで |
| GitHub 以外のホスティング | クラウドは GitHub 前提。`CCR_FORCE_BUNDLE=1` でバンドル送信はできるが、結果をそのリモートに push できない | ローカルで動かす |
| レート制限の消費 | クラウドもローカルも同じ上限を共有する | 並列に投げるほど同じ枠を比例して消費することに注意する |

判断の型は **「クラウドを既定、ローカルを例外」** です。まずクラウドでできるかを考え、上の表のいずれかに当てはまるときだけローカルを選びます。

## Claude Codeで始める — クラウドセッションの起点

### 前提

クラウドセッションは Pro / Max / Team プラン、およびプレミアムシートまたは Chat + Claude Code シートを持つ Enterprise で利用できます。GitHub との接続が必須です（GitHub Enterprise Server は Team / Enterprise）。接続方法は 2 つあります。

| 方法 | 内容 | 向く場面 |
| --- | --- | --- |
| **Claude GitHub App** | Web の案内に従って GitHub App を認可する | ブラウザから始める人、Auto-fix を使いたいチーム |
| **`/web-setup`** | ターミナルで `/web-setup` を実行し、手元の `gh` のトークンを送る | すでに `gh` を使っている個人開発者 |

App を入れたリポジトリでは、PR の Auto-fix（CI 失敗・レビュー指摘への自動対応）が有効になります。

### 5つの起点

どこから始めても、同じクラウド環境を使います。

| 起点 | 使い方 |
| --- | --- |
| ブラウザ（claude.ai/code） | プロンプト欄から環境を選んで開始 |
| モバイル（Claude アプリの Code タブ） | 出先からの確認・指示に |
| デスクトップアプリ | セッション開始時に **Cloud** を選ぶ（**Local** は自分の PC で動く） |
| CLI（`claude --cloud "..."`） | ターミナルから新規クラウドセッションを作成 |
| Routines | スケジュール・API・GitHub イベントをきっかけに自動起動（→ [Routines](/themes/04-ai-driven-development/02-claude-code/routines)） |

初めての場合は **Default** 環境（**Trusted** ネットワーク）が用意されます（プランにより自動作成される場合と、作成フォームへの入力を求められる場合があります）。まずは Default で小さなタスクを 1 件動かしてみてください。

### 「ローカルで計画、クラウドで実行」

複雑なタスクでは、いきなりクラウドに投げるのではなく、計画と実行を分けます。

```bash
# 1. ローカルで計画モードに入り、方針を固める（ファイルは書き換えない）
claude --permission-mode plan

# 2. 計画をリポジトリに保存して push する（クラウドはリモートをクローンするため）
git add docs/migration-plan.md && git commit -m "Add migration plan" && git push

# 3. クラウドで実行する（並列に投げられる）
claude --cloud "Execute the migration plan in docs/migration-plan.md"
```

```bash
# 並列起動の例 — それぞれ独立したセッションで動く
claude --cloud "Fix the flaky test in auth.spec.ts"
claude --cloud "Update the API documentation"
```

クラウドは通常リモートのブランチをクローンするため、投げる前に push してください。ただし git リモートが無い場合や、Claude GitHub App を入れていない github.com リポジトリの場合は、ローカルのリポジトリがバンドルとして送られます（全ブランチの履歴＋追跡済みファイルの未コミット変更を含みます。未追跡ファイルは含まれないため `git add` してから扱います。なお macOS / Linux / WSL では `.env`・`*.tfvars`・秘密鍵らしいファイルの未コミット変更は送られず、コミット済みの版かファイル無しで始まります。「秘密を見せない」仕様として覚えておくとよいでしょう）。

## クラウド環境を設定する

環境ダイアログ（claude.ai/code の雲アイコン、またはデスクトップアプリのプロンプト欄）から設定します。要素は 4 つです。

### ① ネットワークアクセス

環境ごとに 1 つのレベルを選びます。

| レベル | 動作 |
| --- | --- |
| **None** | セッションのネットワーク経由の外部通信なし |
| **Trusted** | 既定の許可リストのみ（パッケージレジストリ・GitHub・主要クラウド SDK 等）。**Default 環境の既定値** |
| **Full** | 任意のドメインへ通信可 |
| **Custom** | 自分の許可リスト。必要なら「既定リストも含める」にチェック |

許可外のホストへのリクエストは `403` エラー（`x-deny-reason: host_not_allowed`）で失敗します。自社 API など既定外のドメインが必要な場合のみ、**Custom** にして 1 行 1 ドメインで追加します（`*.internal.example.com` のように `*.` でサブドメイン全体を指定できます）。

なお、GitHub（専用プロキシ経由）・有効化した MCP コネクタ・API credentials に登録したホストへの通信は、この許可リストとは別経路のため、追加不要です。

### ② 環境変数

`.env` 形式（1 行 1 項目の `KEY=value`）で定義します。セッション開始時に通常の環境変数としてコピーされます。

```text
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgres://localhost:5432/myapp
```

> [!WARNING]
> 環境を使う全員が値を読めます。**secrets（トークン・API キー）を環境変数に置かないでください。** キーは次の API credentials を使います。

### ③ API credentials（Pro / Max）

API キーを VM に入れず、プロキシがリクエストに付与する仕組みです。キーはセッションの環境変数にもファイルにも現れません。Team / Enterprise ではまだ利用できないため、そちらでは環境変数に置かず、別の安全な経路を検討してください。

### ④ セットアップスクリプト

セッション開始前（Claude 起動前）に root で実行される Bash スクリプトです。Ubuntu 24.04 のため `apt install` や各言語のパッケージマネージャが使えます。

```bash
#!/bin/bash
apt update && apt install -y shellcheck
```

制約は 3 つです。

- 非ゼロ終了でセッション開始自体が失敗する（非クリティカルな処理には `|| true` を付ける）
- **おおむね 5 分以内**に終わること。超えるとキャッシュされない
- インストールにはネットワーク到達性が必要（**None** では失敗する）

5 分以内に完了したセットアップ結果は**おおむね 7 日間キャッシュ**され、次回以降のセッションはそこから始まるため高速です。スクリプトや許可ホストを変更すると再構築されます。キャッシュはファイルシステムのスナップショットであり、起動中のプロセス（DB・`docker compose up` のコンテナ等）は残らないため、起動自体はセッションごとに Claude に頼むかフックで行います。

### 設定例 — Next.js プロジェクトの場合

Next.js プロジェクトでは、VM 側の準備はセットアップスクリプトに、プロジェクト依存の導入は SessionStart フックに分けます。依存導入の具体例（`scripts/install_pkgs.sh`）は次の SessionStart フックの節にまとめています。

> [!WARNING]
> **Bun を使うプロジェクトは注意が必要です。** Anthropic 管理環境では全ての外部通信がセキュリティプロキシを経由するため、`bun install` が失敗することがあります（公式ドキュメント Configure cloud environments の Installed tools に記載の既知の問題です）。Bun プロジェクトでは次の節の例のように npm／pnpm での取得に切り替えるか、セルフホスト環境を検討してください。

## リポジトリ側で用意するもの — SessionStartフック

VM の準備（セットアップスクリプト）と、プロジェクトの準備（SessionStart フック）は別物です。使い分けは次の通りです。

|  | セットアップスクリプト | SessionStart フック |
| --- | --- | --- |
| 設定場所 | 環境ダイアログ（claude.ai/code） | リポジトリの `.claude/settings.json` |
| 実行タイミング | Claude 起動前。キャッシュがあればスキップ | Claude 起動後。開始・再開のたびに毎回 |
| 実行場所 | クラウドのみ | ローカル・クラウドの両方 |
| 向く内容 | ツールチェーン・CLI など VM 自体の準備 | `npm install` のようなプロジェクト依存の導入 |

セッションの流れの中で見ると、両者の位置と「再開時に何が戻るか」は次のようになります。

![クラウドセッションの流れ。1 VM を用意してリポジトリをクローン、2 セットアップスクリプト（Claude 起動前・root で実行、約 5 分以内なら約 7 日キャッシュされ、キャッシュがあればスキップ。設定は環境ダイアログ）、3 SessionStart フック（Claude 起動後、開始・再開のたびに毎回実行。設定はリポジトリ）、4 Claude が作業する、5 commit・push で成果をブランチと PR として残す。アイドルが続くと VM は回収され、claude.ai/code から再開すると新しい VM で 1 からやり直す。再開で戻るのは会話履歴と push 済みの変更で、未 push のファイルや起動中のプロセスは戻らない](/content-assets/04-ai-driven-development/03-development-practice/images/cloud-dev-environment/session-lifecycle.svg)

クラウドでのみ依存を入れたい場合の例です。ロックファイルの種類でコマンドを切り替え、失敗は終了コードで返します。

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          { "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR\"/scripts/install_pkgs.sh" }
        ]
      }
    ]
  }
}
```

```bash
#!/bin/bash
# scripts/install_pkgs.sh — クラウドでのみ実行し、ロックファイルに合わせて依存を導入する
set -euo pipefail
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

if [ -f pnpm-lock.yaml ]; then
  pnpm install --frozen-lockfile
elif [ -f package-lock.json ]; then
  npm ci
else
  # bun.lock のみのプロジェクトなど。ロックファイルを使わずに取得する
  npm install
fi
```

`CLAUDE_CODE_REMOTE` が `true` のときだけクラウドと判定して実行するのが定番の分岐です。注意点は 4 つあります。

- 複数リポジトリのセッション（Projects のスレッド等）では、リポジトリのフックは走りません。その場合はセットアップスクリプト側で用意します
- **None** ネットワークではインストール系のフックは失敗します
- **Bun はプロキシ非互換**のため、前節の通り別手段を用意します
- `CLAUDE.md` はクローンに含まれるため、クラウドでも読まれます。「エージェントへの環境説明書」として整えておくと、どのセッションでも同じ前提で動けます

## セッション中に起きること — 隔離と資格情報の実際

- **GitHub proxy**: トークンは VM に入りません。`GH_TOKEN` は `proxy-injected` として見え、プロキシがサーバ側で付け替えます。`gh` はそのまま使え、push は作業ブランチ・API は紐づいたリポジトリに限定されます
- **セキュリティプロキシ**: 外部への HTTP/HTTPS はすべてここを経由します
- **Docker / PostgreSQL / Redis**: プリインストール済みですが起動はしていません。プロンプトで起動を頼みます（イメージ取得は環境のネットワークレベルに従います）。VM 上のツール構成は Claude に `check-tools` の実行を頼んで確認します（公式ドキュメント Configure cloud environments の Installed tools に記載の方法です）
- **環境失効**: 一定時間アイドルになると VM は回収されます。再開時は新しい VM に会話履歴だけが復元され、未 push のファイルや起動中のプロセスは戻りません。作業はこまめに commit & push して守ります

## ローカルとクラウドを往復する

CLI からの往復は 3 つの操作に整理できます。[Claude Code の高度な機能](/themes/04-ai-driven-development/02-claude-code/advanced)のセッション移動節は `--resume`・`/desktop` を含む概要の一覧です。ここではクラウドとの往復を詳しく見ていきます。

| 操作 | 方向 | 内容 |
| --- | --- | --- |
| `claude --cloud "..."` | CLI → クラウド（新規） | 現在のリモート・ブランチから新規クラウドセッションを作成（旧 `--remote` は非推奨の別名） |
| `claude -p "..." --cloud <id>` | CLI → クラウド（追送） | 実行中のセッションにメッセージを 1 件送る（待たずに終了） |
| `claude --teleport [id]` | クラウド → CLI（引き戻し） | クラウドのブランチと会話履歴をローカルに取り込む。以降の作業はローカルに残る |

![ローカルとクラウドの往復。ターミナルから claude --cloud でリモートをクローンした新しいクラウドセッションを作成し、claude -p と --cloud で実行中のセッションにメッセージを 1 件追送する。claude --teleport で実行中のセッションのブランチと会話履歴をターミナルに引き戻す。CLI からは一方通行で、実行中のローカルセッションをそのままクラウドへ移すことはできない](/content-assets/04-ai-driven-development/03-development-practice/images/cloud-dev-environment/local-cloud-roundtrip.svg)

`--teleport` と `--resume` は別物です。`--resume` はこのマシンの履歴を開き直すだけで、クラウドの一覧には触れません。なお CLI の `claude --teleport` とセッション内の `/teleport` は、クラウドを引き戻すという同じ機能への別々の入口です。`--teleport` は作業ディレクトリが clean（未コミット変更なし）である必要があります。

PR ができたら、Auto-fix に引き継ぐ流れが定番です。CI 失敗やレビュー指摘への一次対応をクラウドに任せ、人間は方針と最終判断に集中します。Auto-fix の有効化には対象リポジトリへの Claude GitHub App のインストールが必要です。詳しい手順は[公式ドキュメントの Auto-fix pull requests](https://code.claude.com/docs/en/claude-code-on-the-web#auto-fix-pull-requests)を参照してください。

## 他ツールでの対応物

クラウド開発環境の構造自体は各社共通です。違いは「環境を何で定義するか」「資格情報をどう隠すか」「ネットワーク既定が何か」です（数値・プランは変わりやすいため、2026 年 9 月時点の要点のみ表に閉じ込めます）。

|  | 実行場所 | 起点 | 環境定義 | 資格情報 | ネットワーク既定 |
| --- | --- | --- | --- | --- | --- |
| **Claude Code** | Anthropic 管理の隔離 VM（Ubuntu 24.04）。セルフホストも可 | claude.ai/code・モバイル・デスクトップ・`claude --cloud`・Routines | クラウド環境（ネットワーク・環境変数・API credentials・セットアップスクリプト）＋ `.claude/settings.json` の SessionStart フック | GitHub proxy・API credentials がサーバ側で付与 | **Trusted**（許可リスト） |
| **Codex** | OpenAI 管理コンテナ（`universal` イメージ） | ChatGPT の Codex タブ・IDE・CLI | 環境設定（セットアップ／メンテナンススクリプト・環境変数・secrets・インターネット設定） | secrets はセットアップ段階のみでエージェント段階前に削除 | エージェント段階はオフが既定 |
| **Copilot** | GitHub Actions ランナー（標準／大型／セルフホスト） | Issue のアサイン・Agents パネル・IDE | `.github/workflows/copilot-setup-steps.yml`＋`copilot` 環境の secrets＋ファイアウォール許可リスト | `copilot` 環境の secrets のみ露出 | 許可リスト付きファイアウォール |
| **Cursor** | Cursor 管理の隔離 VM（デスクトップ・ブラウザ付き） | IDE・Web・モバイル・Slack | `.cursor/environment.json`（スナップショットまたは Dockerfile、install／start コマンド）＋ secrets | secret 管理（リポに置かない） | 設定に依存 |
| **Jules** | Google Cloud VM | jules.google・Jules Tools CLI | Environment のセットアップスクリプト＋環境変数＋スナップショット | リポ単位の環境変数 | 設定に依存 |

各社の設定ファイル・設定場所は 1 行ずつ押さえておけば十分です。詳細は公式ドキュメントを参照してください。

- Codex: 環境設定画面（セットアップ／メンテナンススクリプト・バージョン固定）。Copilot: `.github/workflows/copilot-setup-steps.yml`（実行時間の上限や単一リポジトリ・単一ブランチ・単一 PR といった制約あり。公式ドキュメントの Limitations に記載。詳細は公式ドキュメント参照）
- Cursor: `.cursor/environment.json`（Build のスナップショットで事前ウォーム）。Jules: Configuration → Environment（セットアップスクリプト＋スナップショット）

## チームで導入するときの型

- **組織共有環境**: Owner が共有環境を作り、全員が同じ設定で動けるようにします。個人環境の作り直しをやめ、標準を 1 か所に寄せます
- **セルフホスト環境＋Custom 許可リスト**: リソース上限・独自ネットワークが必要な場合は自組織ランナーで動かし、許可ドメインは共有環境に持たせて野良の Full 環境を増やしません
- **ポリシーと置き場所の規律**: `allow_remote_sessions` の許可を Owner が決め、環境変数に secrets を置かないことをレビュー項目にします。`CLAUDE.md`・`.claude/settings.json` をリポジトリに置き、誰のセッションでも同じ前提で動くようにします

## よくある落とし穴

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `403 host_not_allowed` で外部 API に届かない | 環境の許可リスト外への通信 | Custom にして該当ドメインを追加する。MCP 経由・GitHub・API credentials 登録済みホストは対象外のため切り分ける |
| `bun install` が失敗する | Bun のプロキシ非互換（既知の問題） | npm／pnpm での取得に切り替えるか、セルフホスト環境を検討する |
| セットアップスクリプトが毎回走る | 5 分超でキャッシュされていない | 並列化（`&`＋`wait`）で 5 分以内に収めるか、不要なインストールを削る |
| ローカルのコミットがクラウドに見えない | 通常はリモートをクローンするため。ただし git リモートが無い場合や App 未導入の github.com リポジトリはバンドル送信される | 投げる前に push する。未追跡ファイルは `git add` してから扱う |
| セッションが止まって見える | 環境失効（アイドルで VM 回収） | claude.ai/code から再開する（新しい VM に会話履歴だけが復元される）。作業は commit & push で守る |
| 組織 IP 許可リストで認証エラーになる | クラウド VM の出口 IP が許可されていない | Anthropic サポートに連絡して Anthropic 管理サービスを許可リストの対象外にしてもらう（正規の対処）。代替としてセルフホスト環境も検討できる |
| 環境変数に置いたトークンが全員に見えている | 環境変数は共有環境の全員が読める仕様 | すぐにローテーションし、API credentials（Pro／Max）等の安全な経路に移す |

## まとめ

- クラウド開発環境は、エージェントが**隔離 VM で作業し PR として返す**仕組み。構成要素は隔離 VM・環境定義・資格情報プロキシ・GitHub 連携
- 選ぶ理由は 4 つ。**安全性**（隔離・許可リスト・資格情報を VM に入れない）・**並列性**（PC を閉じても継続・複数同時）・**再現性**（環境をコード化・キャッシュ）・**端末非依存**（どこからでも同じセッション）
- 合言葉は **「クラウドを既定、ローカルを例外」**。実機・GUI・大規模ビルド・対話的探索・非 GitHub はローカルに残す
- Claude Code では Default（Trusted）から始め、ネットワーク・環境変数・API credentials・セットアップスクリプトの順に設定する。環境変数に secrets は置かない
- VM の準備はセットアップスクリプト、プロジェクトの準備は SessionStart フック（`CLAUDE_CODE_REMOTE` で分岐）。`CLAUDE.md` を整えて前提を揃える
- 往復は `--cloud`（新規）・`-p --cloud`（追送）・`--teleport`（引き戻し）の 3 つ。`--resume`・`/desktop` を含む一覧は高度な機能、自動化は Routines へ

## 関連ページ

- [AI駆動開発のセキュリティとsecrets管理](/themes/04-ai-driven-development/03-development-practice/ai-security-secrets) — 多層防御と secrets 管理の原則（本ページは第 3 層「サンドボックス実行」の具体化）
- [AI開発の基本ループ](/themes/04-ai-driven-development/03-development-practice/ai-development-loop) — 計画・実装・レビューの全体像
- [Claude Code の高度な機能](/themes/04-ai-driven-development/02-claude-code/advanced) — セッション移動（`--resume`・`/desktop` を含む）の一覧
- [Routines とスケジュール実行](/themes/04-ai-driven-development/02-claude-code/routines) — クラウド環境の「利用者」としての自動実行
- [開発ワークフローはどう変わるか](/themes/04-ai-driven-development/01-overview/workflow-changes) — 作業場所の変化という観点
- [ハーネスエンジニアリング](/themes/04-ai-driven-development/01-overview/harness-engineering) — ツールを足しすぎない環境設計

## 参考リソース

- [Use Claude Code in the cloud](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Configure cloud environments](https://code.claude.com/docs/en/cloud-environments)
- [Get started with cloud sessions](https://code.claude.com/docs/en/web-quickstart)
- [Self-hosted environments](https://code.claude.com/docs/en/self-hosted-environments)
- [Remote Control](https://code.claude.com/docs/en/remote-control)
- [Hooks（SessionStart）](https://code.claude.com/docs/en/hooks)
- [Codex cloud](https://developers.openai.com/codex/cloud)
- [Cloud environments（Codex）](https://developers.openai.com/codex/cloud/environments)
- [Agent approvals & security（Codex）](https://developers.openai.com/codex/agent-approvals-security)
- [About GitHub Copilot cloud agent](https://docs.github.com/copilot/concepts/agents/coding-agent/about-coding-agent)
- [Configure the development environment（copilot-setup-steps.yml）](https://docs.github.com/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)
- [Cloud Agents（Cursor）](https://cursor.com/docs/cloud-agent)
- [Cloud Environment Setup（Cursor）](https://cursor.com/docs/cloud-agent/setup)
- [Environment setup（Jules）](https://jules.google/docs/environment/)
