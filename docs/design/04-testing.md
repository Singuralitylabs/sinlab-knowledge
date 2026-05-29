# Sinlab Knowledge — 設計ドキュメント (4) テスト・CI 設計

## 0. このドキュメントの位置づけ

本プロジェクトに GitHub Actions ベースの自動テストを導入するにあたっての、テスト方針・対象・CI 構成を定める。

設計の核は [01-architecture.md](./01-architecture.md) の方針 ——「**新コンテンツ追加 = `content/` に Markdown を置くだけ**」—— に従う。したがって本プロジェクトのテストの最重要関心事は、**コンテンツの整合性が壊れていないこと**である。

技術構成（Bun + Biome + コンテンツ駆動）に合わせ、次の前提に立つ。

- テストランナーは **`bun test`**（Bun 標準・追加依存ゼロ・Jest 互換 API）。
- lint / format / デバッグ出力検知は **Biome** が担う（`tsconfig` 以外に ESLint / Prettier は導入しない）。
- DB 型生成の整合チェックは、生成型ファイルが無く DB 接点も `users` テーブルの読み取りのみと最小のため**対象外**とする（将来 DB 利用が増えた時点で再検討）。

## 1. テスト方針

### 1.1 テストピラミッド

```text
        E2E（認証フロー / 手動・将来）        ← 少数
   コンテンツ整合性 + ビルド（統合ゲート）    ← 中核
純粋ロジック Unit（slug / 隣接 / schema / mdx） ← 多数
```

- 統合層に相当するのが、本プロジェクトでは **`check:content`（frontmatter / メタ JSON 検証）と `build`** である。
- コンテンツ追加だけで機能が増える設計のため、「コンテンツが壊れていないこと」がリグレッションに対する最大の防御線になる。
- 優先度は **変更頻度・影響範囲・障害時コスト**で決める。本プロジェクトでは順に「コンテンツ整合性 > ルーティング基盤（slug / 隣接）> MDX レンダリング > 認証ステータス判定」となる。

### 1.2 実行タイミング（PR / リリース前）

- **PR（原則）**: lint・コンテンツ検証・型チェック・ユニットテスト・ビルドを CI が自動実行する（[2 章](#2-ci--ツール構成)）。
- **リリース前**: 認証フローなど影響範囲が大きい変更に対し、主要フローの手動確認（または最小限の E2E）を追加する（[3.6](#36-e2e-テスト未実装リリース前のみ)）。

### 1.3 テストデータ方針

- **原則**: ユニットテストはモック / スタブまたはインメモリの固定データで独立性を確保し、外部依存（Supabase・実ファイルシステム）は直接叩かない。
- **コンテンツ依存ロジック**: `loadContentTree()` 経由で実ファイルを走査する関数は、`tests/fixtures/content/` の小さな固定ツリー、または純粋コアの切り出し（[3.2 の注記](#32-対象と観点)）でテストする。

### 1.4 可観測性

- 確認観点ごとに CI ジョブを分離し、ジョブ名から目的が読み取れる命名にする。
- デバッグ出力（`console.log` 等）の混入は CI で検知してエラーにする。本プロジェクトでは **Biome の `lint/suspicious/noConsole` ルール**で実現する（「lint / format は Biome が所有」という規約に従う）。`console.error` / `console.warn` は許可する。

### 1.5 ユニットテストの要否判断

「認証・認可ロジック / 複数箇所から呼ばれる共通ユーティリティ / エラーハンドリング」を**書くべきもの**とする。該当しないもの（UI の見た目、`page.tsx` のデータ受け渡し、Supabase クライアント生成ラッパー、定数・型定義、`loader.ts` のファイル走査）は、Lint・型チェック・`check:content`・ビルド・レビューでカバーできるため**原則不要**とする。

## 2. CI / ツール構成

### 2.1 GitHub Actions ワークフロー

`.github/` は未整備のため新規作成する。本リポジトリは小規模なため、**`ci.yml` 1 ファイルに並列ジョブをまとめる**構成とする（失敗箇所はジョブ名で識別でき、可観測性を保ちつつファイルの乱立を避ける）。全ジョブ Bun ベースで統一する。

| ジョブ | 目的 | 主な実行内容 | パスフィルタの目安 |
|---|---|---|---|
| `lint` | Lint / Format / デバッグ出力検知 | `biome check .` | 全体 |
| `content` | frontmatter / メタ JSON の整合性（本プロジェクトの要） | `bun run check:content` | `content/**`, `lib/content/**`, `scripts/**` |
| `typecheck` | 型安全性 | `tsc --noEmit`（**要: スクリプト追加**） | `**/*.ts(x)` |
| `test` | 純粋ロジックのユニットテスト | `bun test` | `lib/**`, `tests/**` |
| `build` | 本番相当ビルドの成立 | `bun run build` | `app/**`, `content/**`, `lib/**` |

- 共通セットアップ: `oven-sh/setup-bun@v2` + `bun install --frozen-lockfile`。
- トリガー: `pull_request` / `push`（`main`）/ `workflow_dispatch`。
- 各ジョブは独立に並列実行し、いずれかが失敗したら PR をブロックする。

### 2.2 導入ツール

- **bun test**: ユニットテスト実行基盤（Bun 標準・追加依存ゼロ・Jest 互換 API）。
- **Biome**: lint / format / デバッグ出力検知（`noConsole`）。
- **TypeScript**: 型チェック（`tsc --noEmit`）。
- **`scripts/check-content.ts`**: frontmatter / メタ JSON の zod 検証（既存）。

### 2.3 実行環境

- **Bun 1.x**: CI 実行環境（ローカルと統一）。
- **Next.js 16**: 本番ビルド互換の検証。

### 2.4 CI 固有の前提設定

- **ビルド用環境変数**: `lib/supabase/env.ts:resolveSupabaseEnv()` は `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` のいずれかが欠けると起動時に例外を投げる。`build` ジョブにはダミー値（または GitHub Secrets / Variables）の注入が必須。
- **`tsc --noEmit` スクリプトの追加**: 現状 `package.json` に型チェック単体のスクリプトがない。`"typecheck": "tsc --noEmit"` を追加する。
- **`tests/` ディレクトリの新設**: 現状テストコードは存在しない。

## 3. テスト対象と観点

### 3.1 コンテンツ整合性テスト（本プロジェクトの要）

`check:content` により、全 `_site.json` / `_theme.json` / `_module.json` / レッスン frontmatter を zod 検証する（既存実装）。CI の `content` ジョブで必須化する。

- **観点**: 必須フィールド欠落・型不正・enum 外の値（`status` / `difficulty` / `type`）を検知して失敗させる。
- ディレクトリ型レクチャーの `index.md` 欠落など、構造上の不整合も検知対象。

### 3.2 純粋ロジックのユニットテスト

#### 対象と観点

| 対象 | ファイル | 理由 | 観点例 |
|---|---|---|---|
| スラグ変換 | `lib/content/slug.ts` | 全ルーティングの基盤・多数箇所から利用 | `01-headings.md → headings`、プレフィックス無し、`.md` 除去、`extractOrderPrefix` の null |
| レッスン隣接ナビ・抽出 | `lib/themes.ts` | スコープ規則（レクチャーは detail をスキップ / detail は兄弟内のみ / モジュール・テーマ境界を越えない）が複雑で壊れやすい | 先頭 / 末尾での prev/next、detail スコープ、`getLessonsByTag`、`getAllLessonPaths` |
| frontmatter 検証 | `lib/content/frontmatter.ts` + `schema.ts` | 不正コンテンツを確実に弾く・default 値の適用挙動 | 正常 → 通過、必須欠落 → throw、`status` 等 default の付与 |
| MDX レンダリング | `lib/content/mdx.ts:renderMarkdown` | TOC id 重複排除（GithubSlugger ↔ rehype-slug 同期）、`::detail` ディレクティブ、外部リンク属性付与など不変条件が繊細 | 重複見出しへの `-1` / `-2` 付与、未知 slug のエラー表示、外部リンク `target=_blank` + `rel`、相対リンクは同一タブ |
| 認証ステータス判定 | `lib/auth/server-auth.ts` | 認証ロジックは最優先。未知 status → null（≒ pending）扱い | 認証エラー時 `{ user: null, status: null }`、status 別応答、未知値の弾き |

#### 原則不要

`loader.ts` のファイル走査（→ `check:content` と `build` でカバー）、UI コンポーネントの見た目、`page.tsx` のデータ受け渡し、Supabase クライアント生成ラッパー、定数・型定義。

> **注記（テスト容易性）**: `lib/themes.ts` の `getAdjacentLessonsInModule` 等は内部で `loadContentTree()`（実ファイル走査）を呼ぶ。きれいに単体テストするには次のいずれかが必要:
> - (a) `tests/fixtures/content/` に小さな固定ツリーを用意し、それに対してテストする。
> - (b) 兄弟探索のコア（現在 private な `siblingLessons` 相当）を純粋関数として切り出し export する軽微なリファクタを行う。
>
> **(b) を推奨**する（依存ゼロで決定的なテストが書け、副作用が小さい）。

### 3.3 型安全性テスト

`tsc --noEmit` と Biome の静的解析により型不整合を早期検知する。DB 型生成チェックは [0 章](#0-このドキュメントの位置づけ)の通り対象外。

### 3.4 ビルドテスト

`bun run build` で本番相当ビルドの完走と、`bun install --frozen-lockfile` による lockfile どおりの依存解決を検証する。

### 3.5 コード品質テスト

- **デバッグ出力**: Biome `lint/suspicious/noConsole` で `console.log` / `console.info` / `debugger` 混入を失敗させる（`console.error` / `console.warn` は許可）。
- **コード整形**: `biome check` がフォーマット崩れを検知する。

### 3.6 E2E テスト（未実装・リリース前のみ）

実ユーザー視点の主要ジャーニーを少数のケースで確認する（全網羅はしない）。当面は手動。

- **対象フロー例**:
  - ログイン → テーマ / レッスン閲覧 → ログアウト
  - 未認証ユーザーが `/themes/**` へアクセス → `/login?returnTo=...` へ誘導
  - pending / rejected ユーザーが保護ページへアクセス → `/pending` / `/rejected` へ誘導
- **実行タイミング**: リリース前、または認証 / 認可・ルーティングに影響する変更時のみ。

## 4. テスト規約

### 4.1 配置

- テストコードは `tests/` 配下に置き、対象コード（`lib/` 配下）の構造をミラーする。
  - 例: `tests/content/slug.test.ts`, `tests/themes/adjacent.test.ts`, `tests/content/frontmatter.test.ts`, `tests/content/mdx.test.ts`, `tests/auth/server-auth.test.ts`
- フィクスチャは `tests/fixtures/` に置く。

### 4.2 命名

- ファイル名は `*.test.ts` に統一する。
- 「対象 + 期待する振る舞い」が想像できる名前にする。

### 4.3 検証対象

- **検証する**: 関数の入力に対する返り値、副作用の結果（状態変化）、エラー時の振る舞い。
- **検証しない**: 内部実装の呼び出し手順（モックをどの引数で呼んだか等）。
- モックは外部依存を切り離すために使うが、モック呼び出し引数の逐次検証は原則行わない。

## 5. 導入ステップ（実装計画）

1. `package.json` に `"typecheck": "tsc --noEmit"` を追加。
2. `biome.json` の linter に `suspicious.noConsole`（`console.error` / `console.warn` 許可）を追加。
3. `tests/` ディレクトリと初期テストを作成（優先順: `slug` → `frontmatter`/`schema` → `themes`（必要なら 3.2 (b) のリファクタ）→ `mdx` → `server-auth`）。
4. `.github/workflows/ci.yml` を作成（`lint` / `content` / `typecheck` / `test` / `build` の並列ジョブ）。
5. `build` ジョブ用のダミー環境変数（または Secrets）を GitHub 側に設定。
6. PR の必須チェックに各ジョブを登録（ブランチ保護ルール）。
