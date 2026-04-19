# Sinlab Knowledge — 設計ドキュメント (2) コンテンツ構成

このドキュメントは初期コンテンツ (Phase 1〜2) の **詳細目次** と、今後のコンテンツ追加を見据えた **拡張ルール** を定義する。

> **本サイトは「解説サイト」として構成する**。手順を追って手を動かすハンズオン形式は採用せず、**読み物として完結する解説 (lecture型)** と **個別記法・コマンド・概念のリファレンス (reference型)** を主軸に据える。
>
> **テーマは完全に独立管理**: 4つのテーマは互いに依存関係を持たない。推奨閲覧順や対象者の案内も行わず、各テーマは単独で完結する解説領域として扱う。ロードマップページは設けない。

---

## 0. 全体構成サマリ

| # | テーマ | 想定対象 | モジュール数 | ページ数(目安) |
|---|---|---|---|---|
| 01 | **Web基礎** | プログラミング初学者 | 2 | 63 (解説10 + 詳細53) |
| 02 | **Web開発基礎** | Web基礎習得者・HTML/CSS/JS 初学者 | 3 | 22 (解説3 + 詳細19) |
| 03 | **Web開発発展** | Web開発基礎習得者 | 7 | 21 (解説7 + 詳細14) |
| 04 | **AI駆動開発** | 開発実践者・エンジニア | 3 | 19 (解説14 + 詳細5) |
| 合計 | — | — | 15 | 約125 |

各テーマは完全に独立しており、推奨閲覧順は設けない。`/themes` ページで4テーマを並列に提示する。

---

## 01. Web基礎テーマ (`01-web-basics`)

### `_theme.json`

```json
{
  "slug": "01-web-basics",
  "title": "Web基礎",
  "shortTitle": "Web基礎",
  "description": "MarkdownとGit。すべての出発点となる必須スキルを体系的に学ぶ。",
  "icon": "BookOpen",
  "color": "blue",
  "order": 1,
  "difficulty": "beginner",
  "estimatedHours": 8
}
```

### Module 01: Markdown (解説 3本 + 詳細サブページ 29本)

> **移行元**: `lessons/web-skill-lessons/docs/01_markdown/`

Module 02 (Git) と同じ階層方針を採用し、**詳細ページは該当解説のサブページとして配置** する。ただし Markdown の詳細ページは各記法が自己完結したチートシート的性質を持つため、解説本文に散文で「詳細はこちら」を挟む Git 方式ではなく、**解説ページ末尾に全記法の一覧表** を置き、そこから各詳細ページへ遷移させる。一覧表は事実上の記法チートシート兼目次として機能する。モジュール TOC に出すのは解説3本のみ。

**ファイル配置イメージ**:

```
content/themes/01-web-basics/01-markdown/
├── _module.json
└── lessons/
    ├── 01-intro-basics/            # 解説 (基礎編) + 詳細11本
    │   ├── index.md                # 解説本体 + 記法一覧表
    │   ├── 01-headings.md
    │   ├── 02-paragraphs.md
    │   ├── 03-lists.md
    │   ├── 04-emphasis.md
    │   ├── 05-code-blocks.md
    │   ├── 06-links.md
    │   ├── 07-quotes.md
    │   ├── 08-tables.md
    │   ├── 09-horizontal-rules.md
    │   ├── 10-checklists.md
    │   └── 11-images.md
    ├── 02-intro-advanced/          # 解説 (応用編) + 詳細10本
    │   ├── index.md
    │   └── ...
    └── 03-intro-extensions/        # 解説 (拡張編) + 詳細8本
        ├── index.md
        └── ...
```

**URLイメージ**:
- 解説: `/themes/01-web-basics/01-markdown/intro-basics`
- 詳細: `/themes/01-web-basics/01-markdown/intro-basics/headings`

> **解説 index.md 末尾の記法一覧表**: 各解説末尾に配下詳細ページを列挙した表を置く。基礎編であれば「見出し / 段落と改行 / リスト ... / 画像」の11本を `| 記法 | 概要 | 詳細へ |` の3列程度で一覧化し、各行から詳細ページへリンクさせる。Git 方式 (散文に「詳細はこちら」を埋め込み) と異なり、Markdown は **表形式チートシート** として扱うのが本モジュールの特色。

#### 解説記事 (lecture, 3本) — モジュール TOC

| order | スラグ | タイトル | 元ファイル | 詳細本数 |
|---|---|---|---|---|
| 01 | `intro-basics` | 解説記事 (基礎編) | `解説記事（基礎編）.md` | 11 |
| 02 | `intro-advanced` | 解説記事 (応用編) | `解説記事（応用編）.md` | 10 |
| 03 | `intro-extensions` | 解説記事 (拡張編) | `解説記事（拡張編）.md` | 8 |

#### 詳細サブページ (detail, 29本) — 各解説の配下

各記法ページは個別記法の仕様・記述例を提示する自己完結コンテンツ。解説 index.md 末尾の記法一覧表からリンクで到達する。`order` は各解説配下で 01 から連番。

##### `01-intro-basics/` 配下 (11本)
| order | スラグ | タイトル | 元ファイル |
|---|---|---|---|
| 01 | `headings` | 見出し | `samples/01_見出し.md` |
| 02 | `paragraphs` | 段落と改行 | `samples/02_段落と改行.md` |
| 03 | `lists` | リスト | `samples/03_リスト.md` |
| 04 | `emphasis` | 強調 | `samples/04_強調.md` |
| 05 | `code-blocks` | コードブロック | `samples/05_コードブロック.md` |
| 06 | `links` | リンク | `samples/06_リンク.md` |
| 07 | `quotes` | 引用 | `samples/07_引用.md` |
| 08 | `tables` | 表 | `samples/08_表.md` |
| 09 | `horizontal-rules` | 水平線 | `samples/09_水平線.md` |
| 10 | `checklists` | チェックリスト | `samples/10_チェックリスト.md` |
| 11 | `images` | 画像 | `samples/11_画像.md` |

##### `02-intro-advanced/` 配下 (10本)
| order | スラグ | タイトル | 元ファイル |
|---|---|---|---|
| 01 | `details` | 折りたたみ | `samples/12_折りたたみ.md` |
| 02 | `footnotes` | 脚注 | `samples/13_脚注.md` |
| 03 | `alerts` | アラート | `samples/14_アラート.md` |
| 04 | `math` | 数式 | `samples/15_数式.md` |
| 05 | `mermaid` | Mermaid | `samples/16_Mermaid.md` |
| 06 | `emojis` | 絵文字 | `samples/17_絵文字.md` |
| 07 | `comments` | コメント | `samples/18_コメント.md` |
| 08 | `escape` | エスケープ | `samples/19_エスケープ.md` |
| 09 | `definition-lists` | 定義リスト | `samples/20_定義リスト.md` |
| 10 | `toc-links` | 目次リンク | `samples/21_目次リンク.md` |

##### `03-intro-extensions/` 配下 (8本)
| order | スラグ | タイトル | 元ファイル |
|---|---|---|---|
| 01 | `highlight` | ハイライト | `samples/22_ハイライト.md` |
| 02 | `superscript-subscript` | 上付き・下付き | `samples/23_上付き下付き.md` |
| 03 | `diff` | diff構文 | `samples/24_diff構文.md` |
| 04 | `inline-html` | インラインHTML | `samples/25_インラインHTML.md` |
| 05 | `frontmatter` | フロントマター | `samples/26_フロントマター.md` |
| 06 | `github-syntax` | GitHub固有記法 | `samples/27_GitHub固有記法.md` |
| 07 | `abbreviations` | 略語定義 | `samples/28_略語定義.md` |
| 08 | `slides` | スライド作成 | `samples/29_スライド作成.md` |

### Module 02: Git (解説 7本 + 詳細サブページ 24本)

> **移行元**: `lessons/web-skill-lessons/docs/02_git/`

Git の個別ページは「見出し」「リスト」のような独立記法を引くリファレンスではなく、**解説記事で触れた操作の詳細深掘り** という性質を持つ。したがって Markdown と異なり、対等な `reference/` 階層は設けず、**詳細ページを該当解説のサブページとして配置** する方針を取る。解説本文中に「詳細はこちら」リンクを置き、そこから詳細ページへ誘導する。モジュール TOC に出すのは解説7本のみで、詳細ページは URL 直リンク・サイト内検索・タグ経由でも到達できるようにする。

**ファイル配置イメージ**:

```
content/themes/01-web-basics/02-git/
├── _module.json
└── lessons/
    ├── 01-intro-basics/            # ディレクトリ型解説: index.md + 詳細サブページ
    │   ├── index.md                # 解説本体 (基礎編)
    │   ├── 01-what-is-git.md       # 詳細ページ (本文から「詳細はこちら」でリンク)
    │   ├── 02-install.md
    │   ├── 03-init-and-clone.md
    │   ├── 04-add-and-commit.md
    │   ├── 05-status-and-log.md
    │   ├── 06-branch-basics.md
    │   ├── 07-merge-basics.md
    │   └── 08-remote-basics.md
    ├── 02-intro-practice/          # 解説 (実践編) + 詳細6本
    │   ├── index.md
    │   └── ...
    ├── 03-intro-advanced/          # 解説 (応用編) + 詳細6本
    │   ├── index.md
    │   └── ...
    ├── 04-intro-team/              # 解説 (チーム開発編) + 詳細4本
    │   ├── index.md
    │   └── ...
    ├── 05-intro-vscode.md          # ファイル型解説 (詳細なし)
    ├── 06-team-workshop.md         # ファイル型解説 (詳細なし)
    └── 07-instructor-notes.md      # ファイル型解説 (詳細なし / `status: draft`)
```

**URLイメージ**:
- 解説: `/themes/01-web-basics/02-git/intro-basics`
- 詳細: `/themes/01-web-basics/02-git/intro-basics/what-is-git`

> **ディレクトリ型とファイル型の使い分け**: 詳細ページを持つ解説は `NN-slug/index.md` のディレクトリ型、詳細を持たない解説は `NN-slug.md` のファイル型。ルーターは両形式を同一URL (`/.../NN-slug`) として扱う。

#### 解説記事 (lecture, 7本) — モジュール TOC

| order | スラグ | タイトル | 元ファイル | 詳細本数 |
|---|---|---|---|---|
| 01 | `intro-basics` | 解説記事 (基礎編) | `解説記事（基礎編）.md` | 8 |
| 02 | `intro-practice` | 解説記事 (実践編) | `解説記事（実践編）.md` | 6 |
| 03 | `intro-advanced` | 解説記事 (応用編) | `解説記事（応用編）.md` | 6 |
| 04 | `intro-team` | 解説記事 (チーム開発編) | `解説記事（チーム開発編）.md` | 4 |
| 05 | `intro-vscode` | 解説記事 (VS Code編) | `解説記事（VS Code編）.md` | 0 |
| 06 | `team-workshop` | チーム開発の進め方 | `ハンズオン（チーム開発編）.md` を解説形式に再編集 | 0 |
| 07 | `instructor-notes` | 講師向けメモ (`status: draft`) | `講師メモ（チーム開発ハンズオン）.md` | 0 |

#### 詳細サブページ (detail, 24本) — 各解説の配下

各詳細ページは個別コマンド・概念の深掘り。対応する解説ページ本文中の該当セクションに「詳細はこちら」リンクを置き、そこから遷移させる。`order` は各解説配下で 01 から連番。

##### `01-intro-basics/` 配下 (8本)
| order | スラグ | 元ファイル |
|---|---|---|
| 01 | `what-is-git` | `samples/01_*.md` |
| 02 | `install` | `samples/02_*.md` |
| 03 | `init-and-clone` | `samples/03_*.md` |
| 04 | `add-and-commit` | `samples/04_*.md` |
| 05 | `status-and-log` | `samples/05_*.md` |
| 06 | `branch-basics` | `samples/06_*.md` |
| 07 | `merge-basics` | `samples/07_*.md` |
| 08 | `remote-basics` | `samples/08_*.md` |

##### `02-intro-practice/` 配下 (6本)
| order | スラグ | 元ファイル |
|---|---|---|
| 01 | `push-and-pull` | `samples/09_*.md` |
| 02 | `pull-request` | `samples/10_*.md` |
| 03 | `code-review` | `samples/11_*.md` |
| 04 | `merge-conflict` | `samples/12_*.md` |
| 05 | `rebase` | `samples/13_*.md` |
| 06 | `cherry-pick` | `samples/14_*.md` |

##### `03-intro-advanced/` 配下 (6本)
| order | スラグ | 元ファイル |
|---|---|---|
| 01 | `stash` | `samples/15_*.md` |
| 02 | `tag` | `samples/16_*.md` |
| 03 | `revert-and-reset` | `samples/17_*.md` |
| 04 | `gitignore` | `samples/18_*.md` |
| 05 | `troubleshooting` | `samples/23_*.md` |
| 06 | `git-config-and-alias` | `samples/24_*.md` |

##### `04-intro-team/` 配下 (4本)
| order | スラグ | 元ファイル |
|---|---|---|
| 01 | `gitflow` | `samples/19_*.md` |
| 02 | `issue-management` | `samples/20_*.md` |
| 03 | `ci-cd` | `samples/21_*.md` |
| 04 | `github-actions` | `samples/22_*.md` |

> 上記スラグ・詳細ページの解説への割当は仮案。移行時に元ファイル `samples/01〜24_*.md` の内容と解説本文を照合し、どの詳細をどの解説に紐付けるかを確定する。元ファイル番号も暫定のため実ファイルで再確認。

---

## 02. Web開発基礎テーマ (`02-web-development-basics`)

> **新設メモ**: Web開発発展テーマ (React / Next.js) に進む前に必要な HTML / CSS / JavaScript の土台を扱うテーマとして新設。Web基礎テーマ (Markdown / Git) の次に位置付けられる中間層。

### `_theme.json`

```json
{
  "slug": "02-web-development-basics",
  "title": "Web開発基礎",
  "shortTitle": "Web開発基礎",
  "description": "HTML / CSS / JavaScript。ブラウザで動く Web ページの土台を体系的に学ぶ。",
  "icon": "Globe",
  "color": "orange",
  "order": 2,
  "difficulty": "beginner",
  "estimatedHours": 20
}
```

### モジュール構成 (3モジュール)

> **移行元**: なし (全て新規執筆)。将来的に既存の社内教材 / 外部リファレンスへのリンクで補完する余地あり。

Git / Markdown / Web開発発展 と同じ階層方針を採用する。各モジュールに `intro` 解説を置き、既存の個別トピックは `01-intro/` 配下の詳細サブページとして配置する。導線は Git 方式 (本文中に「詳細はこちら」を散文で挟む) を既定とし、タグ・辞書的引き機能のための一覧表方式 (Markdown 方式) への切替もモジュール単位で許容。

**ファイル配置イメージ**:

```
content/themes/02-web-development-basics/
├── _theme.json
├── 01-html/
│   ├── _module.json
│   └── lessons/
│       └── 01-intro/               # ディレクトリ型解説 + 詳細6本
│           ├── index.md            # 解説: HTML とは / 文書構造 / セマンティクスの考え方
│           ├── 01-document-structure.md
│           ├── 02-semantic-tags.md
│           ├── 03-text-and-lists.md
│           ├── 04-links-and-images.md
│           ├── 05-forms.md
│           └── 06-accessibility.md
├── 02-css/
│   └── lessons/
│       └── 01-intro/               # + 詳細6本
│           ├── index.md            # 解説: CSS の動作原理 (カスケード / 特定性) とレイアウトの考え方
│           ├── 01-selectors.md
│           ├── 02-box-model.md
│           ├── 03-flexbox.md
│           ├── 04-grid.md
│           ├── 05-responsive.md
│           └── 06-typography-and-colors.md
└── 03-javascript/
    └── lessons/
        └── 01-intro/               # + 詳細7本
            ├── index.md            # 解説: JavaScript とは / ブラウザでの実行モデル
            ├── 01-variables-and-types.md
            ├── 02-control-flow.md
            ├── 03-functions.md
            ├── 04-arrays-and-objects.md
            ├── 05-dom-manipulation.md
            ├── 06-events.md
            └── 07-async.md
```

**URLイメージ**:
- 解説: `/themes/02-web-development-basics/01-html/intro`
- 詳細: `/themes/02-web-development-basics/01-html/intro/semantic-tags`

#### Module 01: HTML (`01-html`)

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | HTML の全体像 (文書構造 / セマンティクス / アクセシビリティの位置付け) | 新規執筆 |

**詳細 (detail, 6本)** — `01-intro/` 配下
| order | スラグ | タイトル | 内容の主旨 |
|---|---|---|---|
| 01 | `document-structure` | 文書の基本構造 | `<!DOCTYPE>` / `html` / `head` / `body` / `meta` の役割 |
| 02 | `semantic-tags` | セマンティクスタグ | `header` / `nav` / `main` / `section` / `article` / `aside` / `footer` |
| 03 | `text-and-lists` | 見出し・段落・リスト | `h1`〜`h6` / `p` / `ul` / `ol` / `dl` / 引用・強調 |
| 04 | `links-and-images` | リンクと画像 | `a` / `img` / `figure` / 相対・絶対パス |
| 05 | `forms` | フォーム要素 | `form` / `input` / `select` / `textarea` / `button` / `label` |
| 06 | `accessibility` | アクセシビリティ基礎 | `alt` / `aria-*` / ランドマークロール / キーボード操作 |

> **拡張余地**: マルチメディア (`audio`/`video`/`iframe`)、テーブル、メタタグ・SEO、Web Components などを詳細として追加可能。

#### Module 02: CSS (`02-css`)

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | CSS の全体像 (カスケード / 特定性 / レイアウトモデル) | 新規執筆 |

**詳細 (detail, 6本)** — `01-intro/` 配下
| order | スラグ | タイトル | 内容の主旨 |
|---|---|---|---|
| 01 | `selectors` | セレクタ | 基本セレクタ / 擬似クラス / 擬似要素 / 結合子 |
| 02 | `box-model` | ボックスモデル | `padding` / `margin` / `border` / `box-sizing` |
| 03 | `flexbox` | Flexbox | 1次元レイアウト / 主軸・交差軸 / 配置プロパティ |
| 04 | `grid` | Grid | 2次元レイアウト / トラック / テンプレート |
| 05 | `responsive` | レスポンシブ設計 | メディアクエリ / 単位 (`rem`/`em`/`%`/`vw`) / モバイルファースト |
| 06 | `typography-and-colors` | タイポグラフィと色 | `font-*` / `color` / `background` / 変数 (`--custom`) |

> **拡張余地**: アニメーション (`transition`/`animation`)、トランスフォーム、モダン CSS (`container queries`/`:has()`) などを詳細として追加可能。

#### Module 03: JavaScript (`03-javascript`)

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | JavaScript の全体像 (ブラウザでの実行モデル / 言語の特徴) | 新規執筆 |

**詳細 (detail, 7本)** — `01-intro/` 配下
| order | スラグ | タイトル | 内容の主旨 |
|---|---|---|---|
| 01 | `variables-and-types` | 変数と型 | `let` / `const` / プリミティブ型 / オブジェクト |
| 02 | `control-flow` | 制御構文 | `if` / `switch` / `for` / `while` / `for-of` / `for-in` |
| 03 | `functions` | 関数 | 宣言式 / 式 / アロー関数 / クロージャ / `this` |
| 04 | `arrays-and-objects` | 配列とオブジェクト | 配列メソッド (`map`/`filter`/`reduce`) / 分割代入 / スプレッド |
| 05 | `dom-manipulation` | DOM 操作 | `document.querySelector` / 要素の生成・取得・変更 |
| 06 | `events` | イベント | `addEventListener` / バブリング / イベント委譲 |
| 07 | `async` | 非同期処理 | `Promise` / `async-await` / `fetch` API |

> **拡張余地**: モジュール (`import`/`export`)、エラーハンドリング、ストレージ (`localStorage`/`sessionStorage`)、Web API (Storage / History / Geolocation) などを詳細として追加可能。Web開発発展テーマの React 入門前にはここまでで十分。

---

## 03. Web開発発展テーマ (`03-web-development-advanced`)

> **改名メモ**: 旧「02. 開発実践」を改名・繰り下げ。HTML/CSS/JS の前提知識を扱う「Web開発基礎」テーマ (新 02) を前に挟んだため、相対的に本テーマは「発展」として位置付ける。

### `_theme.json`

```json
{
  "slug": "03-web-development-advanced",
  "title": "Web開発発展",
  "shortTitle": "Web開発発展",
  "description": "React・Next.js、スタイリング、データ取得、データベース連携、フォーム、本番デプロイまで。モダンフレームワーク前提の Web アプリ開発を体系化。",
  "icon": "Code",
  "color": "green",
  "order": 3,
  "difficulty": "intermediate",
  "estimatedHours": 35
}
```

### モジュール構成 (7モジュール)

> **移行元**: `lessons/team-lessons/step01〜10/` + `lessons/deploy_lessons/`
>
> 各 step の README.md を本文骨子とし、主要コンポーネント (30〜80行) を抜粋、実コードへのGitHubリンクを末尾に統一フォーマットで掲載する解説形式。
>
> **スコープ変更**:
> 1. 旧「Module 05: チーム開発 (`step11_git`)」は Web基礎テーマの Git モジュールと内容が重複するため本テーマから除外。デプロイ時に必要な範囲 (push-to-deploy 連携、ブランチ毎プレビュー等) は Module 07 の `intro` 内で軽く言及する
> 2. Next.js モジュールにあった「スタイリング (Tailwind CSS)」は Next.js 固有機能ではないため、独立モジュール Module 03 (`03-styling`) に切り出し

Git / Markdown と同じ階層方針を採用し、**各モジュールに `intro` 解説を置き、既存の個別トピックを `intro/` 配下の詳細サブページとして配置** する。`intro` はモジュール全体の骨子 (扱う範囲、技術同士の繋がり) を示し、個別技術の深掘りは詳細ページに任せる。全モジュールの `intro` は新規執筆 (7本)。詳細への導線は Git 方式 (本文中に「詳細はこちら」を散文で挟む) を既定とし、モジュールごとに必要なら一覧表方式 (Markdown 方式) に切り替えてよい。

**ファイル配置イメージ**:

```
content/themes/02-web-development/
├── _theme.json
├── 01-react-basics/
│   ├── _module.json
│   └── lessons/
│       └── 01-intro/               # ディレクトリ型解説 + 詳細3本
│           ├── index.md            # 解説: Reactの基礎 (components/props/hooks の関係)
│           ├── 01-components.md
│           ├── 02-props.md
│           └── 03-hooks.md
├── 02-nextjs/
│   └── lessons/
│       └── 01-intro/               # + 詳細2本 (旧 styling は 03-styling へ分離)
│           ├── index.md
│           ├── 01-create-project.md
│           └── 02-app-router.md
├── 03-styling/                     # 新設: Next.js から独立
│   └── lessons/
│       └── 01-intro/               # + 詳細1本
│           ├── index.md
│           └── 01-tailwindcss.md
├── 04-data-fetching/
│   └── lessons/
│       └── 01-intro/               # + 詳細2本
│           ├── index.md
│           ├── 01-fetch-api.md
│           └── 02-server-components.md
├── 05-database/                    # 旧 04-backend を改名
│   └── lessons/
│       └── 01-intro/               # + 詳細1本
│           ├── index.md
│           └── 01-supabase.md
├── 06-forms/                       # フォーム独立モジュール
│   └── lessons/
│       └── 01-intro/               # + 詳細1本
│           ├── index.md
│           └── 01-forms.md
└── 07-deployment/
    └── lessons/
        └── 01-intro/               # + 詳細4本
            ├── index.md            # 解説: プラットフォーム比較・選び方 + push-to-deploy 運用
            ├── 01-vercel.md
            ├── 02-cloudflare.md
            ├── 03-github-pages.md
            └── 04-netlify.md
```

**URLイメージ**:
- 解説: `/themes/02-web-development/01-react-basics/intro`
- 詳細: `/themes/02-web-development/01-react-basics/intro/components`

#### Module 01: React基礎 (`01-react-basics`)

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | React基礎の全体像 (components / props / hooks の関係) | 新規執筆 |

**詳細 (detail, 3本)** — `01-intro/` 配下
| order | スラグ | タイトル | 元step |
|---|---|---|---|
| 01 | `components` | コンポーネント設計 | step01_react1 |
| 02 | `props` | Propsによるデータ受け渡し | step02_react2 |
| 03 | `hooks` | useState / useEffect / useMemo / useCallback | step03_hooks |

#### Module 02: Next.js (`02-nextjs`)

> **スコープ調整**: 旧 `styling` (Tailwind CSS) は Next.js 固有機能ではないため Module 03 (`03-styling`) に移動。本モジュールはプロジェクト初期化と App Router に集中。

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | Next.js全体像 (プロジェクト構成と App Router の関係) | 新規執筆 |

**詳細 (detail, 2本)** — `01-intro/` 配下
| order | スラグ | タイトル | 元step |
|---|---|---|---|
| 01 | `create-project` | Next.jsプロジェクト初期化 | step04_create_nextjs |
| 02 | `app-router` | App Router / レイアウト設計 | step05_nextjs_app |

#### Module 03: スタイリング (`03-styling`)

> **新設メモ**: スタイリングは特定フレームワーク固有ではなく Web アプリ全般の関心事のため、Module 02 (Next.js) から独立させた。現状は Tailwind CSS を扱うが、将来的に CSS Modules / CSS-in-JS / デザインシステムなどの詳細を並列に追加可能。

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | スタイリング手法の全体像 (ユーティリティ CSS / CSS Modules / CSS-in-JS の位置付け) | 新規執筆 |

**詳細 (detail, 1本)** — `01-intro/` 配下
| order | スラグ | タイトル | 元step |
|---|---|---|---|
| 01 | `tailwindcss` | Tailwind CSS による実装 | step06_styling |

#### Module 04: データ取得 (`04-data-fetching`)

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | データ取得戦略 (REST / Server Components の使い分け) | 新規執筆 |

**詳細 (detail, 2本)** — `01-intro/` 配下
| order | スラグ | タイトル | 元step |
|---|---|---|---|
| 01 | `fetch-api` | REST API連携・非同期処理 | step07_fetch_data |
| 02 | `server-components` | React Server Components | step08_rsc |

#### Module 05: データベース連携 (`05-database`)

> **改名メモ**: 旧 `04-backend` / 「バックエンド連携」から改名。実コンテンツ (Supabase) の中心は DB 機能なので、より実態に即した名称に調整。Supabase は認証・Realtime・Storage も提供するため、将来的にそれらの解説を追加する場合はモジュール名の再検討も視野に入れる。

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | Supabaseで始めるデータベース連携 (認証・DB・Realtime の概観) | 新規執筆 |

**詳細 (detail, 1本)** — `01-intro/` 配下
| order | スラグ | タイトル | 元step |
|---|---|---|---|
| 01 | `supabase` | Supabaseで認証・DB・Realtime | step09_supabase |

> Module 05 は詳細1本のみ。将来的に「スキーマ設計」「RLS (Row Level Security)」「Storage」などを詳細として追加できる。

#### Module 06: フォーム (`06-forms`)

> **新設メモ**: フォーム制御はバックエンドではなく UI/UX 層の関心事のため、旧 Module 04 (バックエンド連携) から独立させた。

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | Web アプリにおけるフォーム設計 (制御/非制御、バリデーション、UX) | 新規執筆 |

**詳細 (detail, 1本)** — `01-intro/` 配下
| order | スラグ | タイトル | 元step |
|---|---|---|---|
| 01 | `forms` | フォーム制御・バリデーション | step10_input_form |

> Module 06 は詳細1本のみ。将来的に「React Hook Form / Zod」「アクセシビリティ」「マルチステップフォーム」などの詳細を追加可能。

#### Module 07: デプロイ (`07-deployment`) ★旧「デプロイ」独立テーマから統合

> **移行元**: `lessons/deploy_lessons/`

**解説 (lecture, 1本)**
| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `intro` | デプロイプラットフォーム比較・選び方 + push-to-deploy 運用 | 新規執筆 |

> `intro` 本文では、除外された旧チーム開発モジュールで扱っていた Git のチーム運用トピック (ブランチ戦略、PR プレビュー、main への自動デプロイ連携など) のうち、デプロイ文脈で必要な範囲を軽く扱う。本格的な Git 操作は Web基礎テーマ Git モジュールへ誘導する。

**詳細 (detail, 4本)** — `01-intro/` 配下
| order | スラグ | タイトル | 元 |
|---|---|---|---|
| 01 | `vercel` | Vercelへのデプロイ (本サイト自体がVercelデプロイ) | 新規執筆 |
| 02 | `cloudflare` | Cloudflare Pagesへのデプロイ | deploy_by_cloudflare |
| 03 | `github-pages` | GitHub Pagesへのデプロイ | deploy_by_github_pages |
| 04 | `netlify` | Netlifyへのデプロイ | deploy_by_netlify |

> **拡張余地**: テスト、状態管理 (Zustand/Redux)、認証応用、決済、デザインシステム、AWS Amplify、Render、Fly.io などを Module 08+ として追加可能。各モジュールも `intro` に加えて追加の解説 (例: React基礎 に「設計パターン」解説、スタイリングに「デザインシステム構築」解説) を並列に置ける構造になっている。

---

## 04. AI駆動開発テーマ (`04-ai-driven-development`)

### `_theme.json`

```json
{
  "slug": "04-ai-driven-development",
  "title": "AI駆動開発",
  "shortTitle": "AI駆動開発",
  "description": "AIコーディングツールの全体像を捉え、Claude Codeを軸にAI駆動開発を実践する。",
  "icon": "Sparkles",
  "color": "purple",
  "order": 4,
  "difficulty": "intermediate",
  "estimatedHours": 12
}
```

### モジュール構成 (3モジュール)

> **移行元**: `lessons/ai-coding-lessons/` + `website/claude-code-website/`
>
> ユーザー要望に基づき、**「概論 → ツール比較 → Claude Code 解説」** の流れで構成。**Claude Code の解説をメインコンテンツ** とする。

他テーマと同じ階層方針を採用する。解説はモジュール直下の `lessons/` に配置し、技術的な個別項目 (各ツール、Claude Code の機能群) はディレクトリ型解説の配下に詳細サブページとして配置する。詳細導線は Git 方式 (本文中「詳細はこちら」) を既定とする。

**ファイル配置イメージ**:

```
content/themes/04-ai-driven-development/
├── _theme.json
├── 01-overview/
│   ├── _module.json
│   └── lessons/                    # 解説3本 (全てファイル型、詳細なし)
│       ├── 01-introduction.md
│       ├── 02-history.md
│       └── 03-workflow-changes.md
├── 02-tool-comparison/
│   └── lessons/
│       ├── 01-overview/            # ディレクトリ型解説 + 各ツール詳細5本
│       │   ├── index.md            # 解説: 主要ツールの全体像と選び方
│       │   ├── 01-github-copilot.md
│       │   ├── 02-cursor.md
│       │   ├── 03-codex.md
│       │   ├── 04-gemini-cli.md
│       │   └── 05-claude-code-overview.md
│       └── 02-comparison-matrix.md # ファイル型解説 (詳細なし)
└── 03-claude-code/                 # ★メインコンテンツ
    └── lessons/                    # 解説9本 (全てファイル型、詳細なし)
        ├── 01-basics.md            # Claude Code の概観・他ツールとの違い
        ├── 02-getting-started.md   # インストールから初回起動まで
        ├── 03-commands.md          # コマンド & ショートカット
        ├── 04-memory.md            # メモリ & コンテキスト
        ├── 05-skills.md            # Skills
        ├── 06-agents.md            # サブエージェント / Agent Teams
        ├── 07-mcp.md               # MCP (外部連携)
        ├── 08-hooks-plugins.md     # Hooks & Plugins
        └── 09-advanced.md          # 高度な機能
```

**URLイメージ**:
- 解説: `/themes/04-ai-driven-development/03-claude-code/skills`
- モジュール TOC: `/themes/04-ai-driven-development/03-claude-code` で9機能のカードが並ぶ

#### Module 01: 概論 (`01-overview`)

> 3本とも概論レベルの読み物で、相互に「詳細/親」の関係にはならないため、全てファイル型の並列解説として配置する。

**解説 (lecture, 3本) — モジュール TOC**

| order | スラグ | タイトル | ステータス |
|---|---|---|---|
| 01 | `introduction` | AIコーディング/AI駆動開発とは何か | 新規執筆 |
| 02 | `history` | 主要ツールの登場と発展の系譜 | 新規執筆 |
| 03 | `workflow-changes` | 開発ワークフローはどう変わるか | 新規執筆 |

#### Module 02: ツール比較 (`02-tool-comparison`)

> `overview` をディレクトリ型解説とし、5ツールの個別解説を詳細サブページに配置。`comparison-matrix` は個別ツールを読んだ上での総括ページとしてファイル型で並列に置く。

**解説 (lecture, 2本) — モジュール TOC**

| order | スラグ | タイトル | ステータス | 詳細本数 |
|---|---|---|---|---|
| 01 | `overview` | 主要ツールの全体像と選び方 | 新規執筆 | 5 |
| 02 | `comparison-matrix` | 機能・価格・得意領域の比較マトリクス | 新規執筆 | 0 |

**詳細 (detail, 5本) — `01-overview/` 配下**

| order | スラグ | タイトル | 元 |
|---|---|---|---|
| 01 | `github-copilot` | GitHub Copilot — 補完中心の老舗 | `ai-coding-lessons/step01` + note記事から再編集 |
| 02 | `cursor` | Cursor — IDE統合型エージェント | `ai-coding-lessons/step02` + note記事 |
| 03 | `codex` | OpenAI Codex CLI | 同上 |
| 04 | `gemini-cli` | Gemini CLI | 同上 |
| 05 | `claude-code-overview` | Claude Code 概観 (詳細は Module 03 へ誘導) | 新規執筆 |

#### Module 03: Claude Code (`03-claude-code`) ★メインコンテンツ

> **移行元**: `website/claude-code-website/app/features/` 全カテゴリ。ページ内のTS配列 (`commandCategories` 等) を移行スクリプトでMD + フロントマターに変換。
>
> 参考サイト (claude-code-website) は 8 カテゴリのフィーチャーカードを並べる構成だが、各カテゴリが十分に独立した読み物になるため、**全カテゴリをモジュール直下の解説 (lecture) として並列配置** する。モジュールページではカードグリッドに 9 枚のボタンが並ぶ形になる。
>
> 現時点では各解説をファイル型 (`NN-slug.md`) で始め、執筆量が増えてサブトピックを切り出したくなった解説のみディレクトリ型 (`NN-slug/index.md` + 配下に詳細) に昇格する方針。これにより「まず横並びで書き、必要になったら掘り下げる」運用が可能。
>
> モジュール TOC の視認性確保のため、`_module.json` の `categories` で以下のようにグルーピングする (フロントマターの `category` キーで紐付け):
> - `overview`: 概観 — `basics`, `getting-started`
> - `core`: コア機能 — `commands`, `memory`
> - `extension`: 拡張機能 — `skills`, `agents`, `mcp`
> - `automation`: 自動化 — `hooks-plugins`
> - `advanced`: 高度な機能 — `advanced`

**解説 (lecture, 9本) — モジュール TOC**

| order | スラグ | タイトル | カテゴリ | 元 (claude-code-website) |
|---|---|---|---|---|
| 01 | `basics` | Claude Code の概観・他ツールとの違い | overview | features/basics |
| 02 | `getting-started` | インストールから初回起動まで | overview | 新規執筆 |
| 03 | `commands` | コマンド & ショートカット (`/help`, `/init`, `/memory` 等) | core | features/commands |
| 04 | `memory` | メモリ & コンテキスト (CLAUDE.md / セッション管理) | core | features/memory |
| 05 | `skills` | Skills (再利用可能なワークフロー定義) | extension | features/skills |
| 06 | `agents` | サブエージェント / Agent Teams | extension | features/agents |
| 07 | `mcp` | MCP (外部サービス連携プロトコル) | extension | features/mcp |
| 08 | `hooks-plugins` | Hooks & Plugins (イベント駆動の自動化と再配布) | automation | features/hooks-plugins |
| 09 | `advanced` | 権限モード / Extended Thinking / Managed Agents 等 | advanced | features/advanced |

> **拡張余地**:
> - 各解説が肥大化した場合はディレクトリ型に昇格し、サブトピック (例: `skills/01-skill-creator.md`, `agents/01-agent-teams.md`) を詳細として切り出す
> - Module 04: AI駆動開発のベストプラクティス (新規) — レビュー、テスト、セキュリティ
> - Module 05: 各ツールの深掘り (Cursor単独、Codex単独 等)
> - Claude Code の更新に追従する形で本モジュールを継続的に拡充

---

## 4. テーマ一覧ページ (`/themes`)

ロードマップページは設けない。代わりに `/themes` ページで4テーマを並列に提示する。

```
[ Web基礎 (blue) ]   [ Web開発基礎 (orange) ]   [ Web開発発展 (green) ]   [ AI駆動開発 (purple) ]
  Markdown / Git       HTML / CSS / JS            React〜デプロイ           概論〜比較〜Claude Code
  63ページ              22ページ                    21ページ                   19ページ
```

各テーマカードは `_theme.json` から自動生成される (タイトル / 短説明 / アイコン / 色 / ページ数)。
推奨順序や対象者の案内は記載しない。トップページ (`/`) も同様にテーマカードを並列に並べる。

---

## 5. タグ体系

### 5.1 推奨タグ語彙

タグはフロントマターで自由に追加できるが、以下の **標準語彙** を推奨し、ブレを抑える:

**トピック系**
`markdown`, `git`, `github`, `html`, `css`, `javascript`, `dom`, `accessibility`, `responsive`, `flexbox`, `grid`, `react`, `nextjs`, `typescript`, `tailwindcss`, `supabase`, `forms`, `rsc`, `ai-coding`, `copilot`, `cursor`, `codex`, `gemini`, `claude-code`, `mcp`, `agents`, `skills`, `memory`, `hooks`, `deployment`, `vercel`, `cloudflare`, `netlify`, `github-pages`

**スキル系**
`fundamentals`, `intermediate`, `advanced`, `troubleshooting`, `best-practices`

**形式系**
`tutorial`, `concept`, `reference`, `comparison`, `cheatsheet`

### 5.2 タグの管理

- 標準語彙は `lib/content/tags.ts` に定義 (新タグ追加時に `check:content` で警告するための辞書)
- 警告のみで強制エラーにはしない (柔軟な追加を許可)
- タグページ `/tags/[tag]` は Phase 2 で実装

---

## 6. 拡張ルール (執筆者向けサマリ)

> 詳細は `docs/AUTHORING.md` (Phase 1終盤に作成) に集約予定。

### 階層方針 (前提)

全テーマで次の2階層を採用する:

- **解説 (`type: lecture`)** — モジュール TOC に並ぶメインコンテンツ。ファイル型 (`NN-slug.md`) または **ディレクトリ型** (`NN-slug/index.md` + 配下に詳細ファイル群)
- **詳細 (`type: detail`)** — ディレクトリ型解説の配下に置く深掘りページ (`NN-slug.md`)

詳細を持つかどうかで解説の形式 (ファイル型 / ディレクトリ型) を選ぶ。詳細への導線は **Git 方式** (本文中に「詳細はこちら」を散文で埋め込む) を既定。Markdown モジュールのように詳細が自己完結したチートシート的性質の場合は **Markdown 方式** (解説末尾に一覧表を置く) に切替可。

### 新レッスン追加 (最頻ケース)

#### A. ファイル型解説を追加 (詳細を持たない)

```bash
touch content/themes/{theme}/{module}/lessons/NN-slug.md
```

#### B. ディレクトリ型解説 + 詳細を新規作成

```bash
mkdir -p content/themes/{theme}/{module}/lessons/NN-slug
touch content/themes/{theme}/{module}/lessons/NN-slug/index.md       # 解説本体
touch content/themes/{theme}/{module}/lessons/NN-slug/01-xxx.md      # 詳細1本目
```

#### C. 既存のディレクトリ型解説に詳細を追加

```bash
touch content/themes/{theme}/{module}/lessons/NN-parent/NN-new-detail.md
```

### フロントマター (共通)

```yaml
---
title: タイトル
order: NN                   # 省略可 (ファイル名の NN- プレフィックスがデフォルト)
type: lecture               # lecture | detail | cheatsheet
difficulty: beginner        # beginner | intermediate | advanced
tags: [topic-tag, ...]
estimatedMinutes: 5
status: draft               # draft | published  (draft は dev 環境のみ表示)
updatedAt: 2026-04-19       # Claude Code 関連ページは必須 (§8 参照)
---
```

### ローカル開発フロー

```bash
pnpm dev                    # draft 含めて表示確認
# status: published に変更 → PR → Vercel Preview 確認 → main マージ → 自動デプロイ
```

### 新モジュール追加

```bash
mkdir -p content/themes/{theme}/NN-module-slug/lessons
# _module.json を作成 (テンプレートを `docs/AUTHORING.md` から流用)
```

### 新テーマ追加

```bash
mkdir -p content/themes/NN-theme-slug
# _theme.json を作成 (既存テーマの JSON を雛形に)
# 配下にモジュールを追加
```

### 命名規約

- ディレクトリ・ファイル: `NN-kebab-case` (例: `01-markdown`, `03-javascript`, `01-intro-basics/`, `02-headings.md`)
- ディレクトリ型解説のメインは `index.md` 固定 (`NN-` プレフィックスは親ディレクトリ側に付ける)
- **英語スラグを推奨**。日本語ローマ字表記は避ける
  - ✅ `basics` / `advanced` / `practice` / `extensions`
  - ❌ `kiso` / `ouyou` / `jissen` / `kakucho`

### URL 構造

- テーマ・モジュールの URL セグメントは `NN-` プレフィックスを含む (`01-web-basics`, `01-markdown`)
- **解説・詳細の URL セグメントは `NN-` を削除**して表示する
- 例:
  - 解説 (ファイル型): `/themes/01-web-basics/02-git/intro-basics` (ファイル `01-intro-basics.md` / `01-intro-basics/index.md` のいずれも同じ URL)
  - 詳細: `/themes/01-web-basics/02-git/intro-basics/what-is-git` (ファイル `01-what-is-git.md`)

### 順序制御

- ディレクトリ・ファイル名の `NN-` プレフィックス → デフォルトソート
- フロントマターの `order` で上書き可能 (優先)

### 型の移行メモ

旧設計の `type: reference` (辞書的参照ページ) は、新階層方針では **ディレクトリ型解説配下の `type: detail`** に吸収されている。独立した `reference/` サブ階層は設けない (詳細はすべて解説の子として配置)。

---

## 7. 既存サイトとのコンテンツ差分

| 領域 | 既存 | 新サイト | 差別化 |
|---|---|---|---|
| Markdown | web-skill-lessons | 同内容を移行、解説と個別記法を `lessons/` に統合 | 統合カリキュラムの一部に |
| Git | web-skill-lessons | 同内容 + チーム開発編を「解説」として再編集 | ハンズオン素材も読み物として整える |
| Claude Code | claude-code-website | 8カテゴリ + 概観 + 入門を移行 | AI駆動開発テーマのメインに位置付け、初心者導線を整備 |
| HTML/CSS/JavaScript | — | 新設「Web開発基礎」テーマとして全編新規執筆 (3モジュール / 詳細19本) | React 学習前の前提知識を明示的に整備 |
| React/Next.js/Supabase/Forms | team-lessons (実コード) | 解説 + 抜粋 + GitHubリンク。「Web開発発展」テーマに再配置 | サイト上は読み物として完結、実コードはGitHub参照 |
| デプロイ | deploy_lessons (実コード) | Web開発発展テーマの Module 07 に統合、+概論とVercel編を新規執筆 | 1テーマ内で「作って → 出す」が完結 |
| AIツール比較 | ai-coding-lessons step02 (未展開) | Module 02 として独立、5ツール × 比較マトリクス | 拡充の起点 |
| **新規領域** | — | AI駆動開発概論、ツール比較マトリクス、Vercel編、Claude Code入門 | 横断的な解説を追加 |

---

## 8. メンテナンス・運用

- **SSOT は新サイト `content/`** (既存サイトとは同期しない)
- 既存 `web-skill-lessons` は当面残し、Phase 3 完了後に301リダイレクトで集約検討
- 既存 `claude-code-website` は当面残し、深掘り版として併存可
- コンテンツ更新フロー: ブランチ → PR → Vercel Preview確認 → main マージ → 自動デプロイ
- Claude Code は更新が早いため、Module 03 のレッスンには `updatedAt` を必ず記載し、月次で「30日以上更新がないレッスン」を洗い出す `scripts/check-stale.ts` を Phase 3 で追加検討
