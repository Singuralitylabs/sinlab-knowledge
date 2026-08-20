# Sinlab Knowledge — 設計ドキュメント (1) アーキテクチャ

本ドキュメントは、コードから読み取れない「設計思想・規約」のみを記録する。ディレクトリ構成・スキーマ定義・API・依存パッケージ・ビルド設定などの実装詳細は、コード自体（`lib/content/schema.ts`、`package.json` ほか）と `CLAUDE.md` を真実のソースとし、本ドキュメントでは二重管理しない。

## 1. 設計の核となる方針

> **新コンテンツ追加 = `content/` に Markdown ファイルを置くだけ**
>
> コードを変更せず、ファイルシステムの規約とフロントマターだけで完結する設計とする。

旧 `web-skill-lessons` の設計（`lib/lessons.ts` に配列ハードコード）では、レッスン 1 本追加するたびに型・配列・ファイル名の 3 か所を同期させる必要があった。これを**ファイルシステム駆動 + フロントマター**に切り替えることで、執筆者がエンジニアリング知識なしでもコンテンツを追加できる構造にしている。

### 用語と階層

```
Site
└── Theme           (例: 01-web-basics)        ★ 独立した知識領域
    └── Module      (例: 01-markdown)
        └── Lesson  (Markdown ファイル 1 本)    ★ 解説も詳細もすべて "lesson"
```

- **Theme（テーマ）**: 独立した知識領域。「コース」のような順序学習を強制しない、各テーマ単独で完結する解説群
- **Module（モジュール）**: テーマ内の章立て
- **Lesson（レッスン）**: 解説記事（lecture 型）も詳細サブページ（detail 型）もすべて "lesson" として扱う。解説か詳細かは**ファイル配置**で決まる（規約 3）。frontmatter の `type` は配置と一致させて書くメタデータ（zod 検証の対象）であり、ローダーの種別判定には使われない

> **本サイトは解説サイトとして構成する**。手順を追って手を動かすハンズオン形式は採用しない。

## 2. 規約

1. **テーマ・モジュールは番号プレフィックスでソート**: `01-web-basics`、`02-web-development-basics`、…
2. **メタファイルは `_` プレフィックス**: `_site.json`、`_theme.json`、`_module.json`（Markdown 走査の対象外）
3. **レッスンは 2 階層モデル**: トップレベルの解説（lecture）はファイル型（`lessons/NN-slug.md`）またはディレクトリ型（`lessons/NN-slug/index.md`）。ディレクトリ型の配下に置いた兄弟ファイル `NN-*.md` が詳細サブページ（detail）になる。ディレクトリ型で `index.md` が無い場合は検証エラー
4. **フロントマターのみで挙動制御**: レッスン・モジュール・テーマのリストをコードに配列ハードコードすることは禁止
5. **テーマは独立管理**: テーマ間の必須依存は持たせない。前後レッスンのナビゲーションもスコープ化されており（解説は解説同士、詳細は兄弟詳細のみ）、モジュール・テーマの境界を越えない
6. **新テーマ追加 = ディレクトリ追加のみ**（コードは一切触らない）

メタ JSON / frontmatter の正確なフィールド定義は `lib/content/schema.ts` の zod スキーマが唯一の真実のソース。同じスキーマがビルド時（`lib/content/loader.ts`）と `bun run check:content` の両方で検証に使われる。

## 3. ステータス制御

| status | 挙動 |
|---|---|
| `draft` | 開発環境のみ表示（本番ビルドで除外） |
| `published` | 通常表示 |
| `deprecated` | 表示するがバナーで「内容が古い可能性あり」を明示 |

`process.env.NODE_ENV === "production"` の場合のみ `draft` を除外する判定を loader 側で実装している。テーマ・モジュール・レッスンのすべての階層で有効。

## 4. ルーティング / URL 設計

| URL | 意味 | アクセス |
|---|---|---|
| `/` | トップページ | 公開 |
| `/about` | About（`content/pages/about.md`） | 公開 |
| `/login` `/pending` `/rejected` `/callback` | 認証フロー（`app/(auth)/`） | 公開 |
| `/themes` | テーマ一覧 | 会員のみ |
| `/themes/<theme>` | テーマトップ | 会員のみ |
| `/themes/<theme>/<module>` | モジュールトップ | 会員のみ |
| `/themes/<theme>/<module>/<lesson>` | 解説（lecture） | 会員のみ |
| `/themes/<theme>/<module>/<lesson>/<detail>` | 詳細（detail） | 会員のみ |
| `/content-assets/[...path]` | コンテンツ内画像等の配信 | 公開 |

- テーマ・モジュールの URL セグメントは `NN-` プレフィックスを**含む**。レッスン（解説・詳細）のセグメントは `NN-` を**除去**して表示する（`lib/content/slug.ts`）。例: `/themes/01-web-basics/01-markdown/intro-basics/headings`
- レッスン URL は `app/(protected)/themes/[themeSlug]/[...slug]/page.tsx` の catch-all で受ける。slug の深さがレッスン形式（解説 / 詳細）によって異なっても対応できる。

### 認証ゲート（`/themes/**`）

`/themes/**` は**シンラボ会員専用**であり、両方必須の二層で保護する:

1. **`proxy.ts`**（Next.js 16 で `middleware.ts` から改名）: 楽観的な `supabase.auth.getUser()` チェック。未認証ユーザーを `/login?returnTo=<path>` にリダイレクトする
2. **`app/(protected)/layout.tsx`**: サーバサイドの厳格チェック。Supabase のアローリスト（`users` テーブル）で `status: "active"` のユーザーのみ通過させ、`"rejected"` は `/rejected` へ、それ以外は `/pending` へ誘導する

保護レイアウトがクッキーを参照するため、`/themes/**` は動的レンダリングになる（全ページ静的生成の初期方針は認証導入に伴い撤回済み）。認証フローの実装詳細（クッキーによる returnTo ラウンドトリップ等）は `CLAUDE.md` と `lib/auth/` を参照。

本サービスの Supabase プロジェクトはポータル（singularity-lab-portal）と共有している。OAuth の `redirectTo` が Redirect URLs の許可リストに無い場合、Supabase Auth はこれを破棄して Site URL（＝ポータル）へフォールバックする。新しいドメインを追加する際は、Redirect URLs に `https://<domain>/callback` を追加すること。

## 5. 拡張シナリオの検証

設計方針が守られていれば、以下はすべて**コード変更なし**で成立する。具体的な追加手順・テンプレートは [02-content-structure.md](./02-content-structure.md) を参照。

### シナリオ A: モジュールを既存テーマに追加

`content/themes/<theme>/NN-module/` に `_module.json` と `lessons/` を作成するだけで、モジュールトップと配下レッスンの URL がビルド時に自動生成される。

### シナリオ B: テーマを新規追加

`content/themes/NN-theme/` に `_theme.json` とモジュール群を作成すれば、テーマ一覧に自動的に登場する。テーマ間依存は持たないため、独立した解説領域として公開できる。

### シナリオ C: 既存レッスンの「下書き化」

frontmatter を `status: draft` に変更すると、本番ビルドから自動除外される（開発環境では表示され続ける）。

### シナリオ D: 既存レッスンの「廃止」

`status: deprecated` に変更すると、ページ上部に廃止バナーが自動表示される。
