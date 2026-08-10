# Sinlab Knowledge — 設計ドキュメント (3) テスト設計

## 0. このドキュメントの位置づけ

本プロジェクトのテスト方針・対象・規約を記録する。CI の具体的な構成（ワークフロー定義・実行内容）は `.github/workflows/` 配下の各ファイルが真実のソースであり、本ドキュメントでは扱わない。

設計の核は [01-architecture.md](./01-architecture.md) の方針 ——「**新コンテンツ追加 = `content/` に Markdown を置くだけ**」—— に従う。したがって本プロジェクトのテストの最重要関心事は、**コンテンツの整合性が壊れていないこと**である。

技術構成（Bun + Biome + コンテンツ駆動）に合わせ、次の前提に立つ。

- テストランナーは **`bun test`**（Bun 標準・追加依存ゼロ・Jest 互換 API）。
- lint / format / デバッグ出力検知は **Biome** が担う（`noConsole` ルールで `console.log` 混入を CI エラーにする。`console.error` / `console.warn` は許可）。
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

### 1.2 実行タイミング

- **PR（原則）**: lint・コンテンツ検証・型チェック・ユニットテスト・ビルドを `.github/workflows/` の各ワークフローが自動実行し、失敗した場合は PR をブロックする。
- **リリース前**: 認証フローなど影響範囲が大きい変更に対し、主要フローの手動確認（または最小限の E2E）を追加する（[2.4](#24-e2e-テスト未実装リリース前のみ)）。

### 1.3 テストデータ方針

- **原則**: ユニットテストはモック / スタブまたはインメモリの固定データで独立性を確保し、外部依存（Supabase・実ファイルシステム）は直接叩かない。
- **コンテンツ依存ロジック**: 隣接ナビゲーション等の純粋コア（`lib/themes.ts` の `resolveAdjacentLessons` / `collect*` 系）は実ファイル走査から切り出されて export されており、`tests/helpers/fixtures.ts` のインメモリファクトリで組み立てた固定ツリーに対してテストする。

### 1.4 ユニットテストの要否判断

「認証・認可ロジック / 複数箇所から呼ばれる共通ユーティリティ / エラーハンドリング」を**書くべきもの**とする。該当しないもの（UI の見た目、`page.tsx` のデータ受け渡し、Supabase クライアント生成ラッパー、定数・型定義、`loader.ts` のファイル走査）は、Lint・型チェック・`check:content`・ビルド・レビューでカバーできるため**原則不要**とする。

## 2. テスト対象と観点

### 2.1 コンテンツ整合性テスト（本プロジェクトの要）

`check:content` により、全 `_site.json` / `_theme.json` / `_module.json` / レッスン frontmatter を zod 検証する。

- **観点**: 必須フィールド欠落・型不正・enum 外の値（`status` / `difficulty` / `type`）を検知して失敗させる。
- ディレクトリ型レクチャーの `index.md` 欠落など、構造上の不整合も検知対象。

### 2.2 純粋ロジックのユニットテスト

| 対象 | テストファイル | 理由 | 観点例 |
|---|---|---|---|
| スラグ変換（`lib/content/slug.ts`） | `tests/content/slug.test.ts` | 全ルーティングの基盤・多数箇所から利用 | `01-headings.md → headings`、プレフィックス無し、`.md` 除去、`extractOrderPrefix` の null |
| レッスン隣接ナビ・抽出（`lib/themes.ts`） | `tests/themes/themes.test.ts` | スコープ規則（レクチャーは detail をスキップ / detail は兄弟内のみ / モジュール・テーマ境界を越えない）が複雑で壊れやすい | 先頭 / 末尾での prev/next、detail スコープ、`collectLessonsByTag`、`collectAllLessonPaths` |
| frontmatter 検証（`lib/content/frontmatter.ts` + `schema.ts`） | `tests/content/frontmatter.test.ts` | 不正コンテンツを確実に弾く・default 値の適用挙動 | 正常 → 通過、必須欠落 → throw、`status` 等 default の付与 |
| MDX レンダリング（`lib/content/mdx.ts:renderMarkdown`） | `tests/content/mdx.test.ts` | TOC id 重複排除（GithubSlugger ↔ rehype-slug 同期）、`::detail` ディレクティブ、外部リンク属性付与など不変条件が繊細 | 重複見出しへの `-1` / `-2` 付与、未知 slug のエラー表示、外部リンク `target=_blank` + `rel`、相対リンクは同一タブ |
| 認証ステータス判定（`lib/auth/server-auth.ts`） | `tests/auth/server-auth.test.ts` | 認証ロジックは最優先。未知 status → null（≒ pending）扱い | 認証エラー時 `{ user: null, status: null }`、status 別応答、未知値の弾き |

### 2.3 型・ビルド・コード品質

- **型安全性**: `bun run typecheck`（`tsc --noEmit`）と Biome の静的解析により型不整合を早期検知する。
- **ビルド**: `bun run build` で本番相当ビルドの完走と、`bun install --frozen-lockfile` による lockfile どおりの依存解決を検証する。
- **コード品質**: Biome `lint/suspicious/noConsole` で `console.log` / `console.info` の混入を失敗させる（`debugger` 文は recommended の `suspicious/noDebugger` が検知）。`biome check` がフォーマット崩れを検知する。

### 2.4 E2E テスト（未実装・リリース前のみ）

実ユーザー視点の主要ジャーニーを少数のケースで確認する（全網羅はしない）。当面は手動。

- **対象フロー例**:
  - ログイン → テーマ / レッスン閲覧 → ログアウト
  - 未認証ユーザーが `/themes/**` へアクセス → `/login?returnTo=...` へ誘導
  - pending / rejected ユーザーが保護ページへアクセス → `/pending` / `/rejected` へ誘導
- **実行タイミング**: リリース前、または認証 / 認可・ルーティングに影響する変更時のみ。

## 3. テスト規約

### 3.1 配置

- テストコードは `tests/` 配下に置き、対象コード（`lib/` 配下）の構造をミラーする。
  - 例: `tests/content/slug.test.ts`、`tests/themes/themes.test.ts`、`tests/content/frontmatter.test.ts`、`tests/content/mdx.test.ts`、`tests/auth/server-auth.test.ts`
- フィクスチャは実ファイルツリーではなく、`tests/helpers/fixtures.ts` のインメモリファクトリ（Lesson / Module / Theme のビルダー関数）で組み立てる。

### 3.2 命名

- ファイル名は `*.test.ts` に統一する。
- 「対象 + 期待する振る舞い」が想像できる名前にする。

### 3.3 検証対象

- **検証する**: 関数の入力に対する返り値、副作用の結果（状態変化）、エラー時の振る舞い。
- **検証しない**: 内部実装の呼び出し手順（モックをどの引数で呼んだか等）。
- モックは外部依存を切り離すために使うが、モック呼び出し引数の逐次検証は原則行わない。
