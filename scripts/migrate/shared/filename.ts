/**
 * Source-to-target filename mappings for the web-skill-lessons migration.
 *
 * Each entry describes one lesson:
 *  - `sourceRel`: path relative to the legacy `docs/0X_*` directory
 *  - `targetFile`: output filename inside the new `lessons/` directory
 *  - `order` / `type` / `category` / `difficulty`: frontmatter values
 *  - `tags`: minimum tags to attach
 *  - `estimatedMinutes`: rough reading time
 *  - `titleOverride`: optional override (otherwise the first `# heading` is used)
 *  - `status`: defaults to "published"
 */

import type { Difficulty, LessonType, Status } from "../../../lib/content/schema";

export interface MigrationEntry {
  sourceRel: string;
  targetFile: string;
  order: number;
  type: LessonType;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes: number;
  titleOverride?: string;
  status?: Status;
}

const MD_BASE_TAGS = ["markdown"];
const GIT_BASE_TAGS = ["git"];

export const MARKDOWN_ENTRIES: MigrationEntry[] = [
  {
    sourceRel: "解説記事（基礎編）.md",
    targetFile: "01-intro-kiso.md",
    order: 1,
    type: "lecture",
    category: "kiso",
    difficulty: "beginner",
    tags: [...MD_BASE_TAGS, "fundamentals", "concept"],
    estimatedMinutes: 15,
    titleOverride: "解説記事 (基礎編)",
  },
  ref("samples/01_見出し.md", "02-headings.md", 2, "kiso"),
  ref("samples/02_段落と改行.md", "03-paragraphs.md", 3, "kiso"),
  ref("samples/03_リスト.md", "04-lists.md", 4, "kiso"),
  ref("samples/04_強調.md", "05-emphasis.md", 5, "kiso"),
  ref("samples/05_コードブロック.md", "06-code-blocks.md", 6, "kiso"),
  ref("samples/06_リンク.md", "07-links.md", 7, "kiso"),
  ref("samples/07_引用.md", "08-quotes.md", 8, "kiso"),
  ref("samples/08_表.md", "09-tables.md", 9, "kiso"),
  ref("samples/09_水平線.md", "10-horizontal-rules.md", 10, "kiso"),
  ref("samples/10_チェックリスト.md", "11-checklists.md", 11, "kiso"),
  ref("samples/11_画像.md", "12-images.md", 12, "kiso"),
  {
    sourceRel: "解説記事（応用編）.md",
    targetFile: "13-intro-ouyou.md",
    order: 13,
    type: "lecture",
    category: "ouyou",
    difficulty: "beginner",
    tags: [...MD_BASE_TAGS, "fundamentals", "concept"],
    estimatedMinutes: 15,
    titleOverride: "解説記事 (応用編)",
  },
  ref("samples/12_折りたたみ.md", "14-details.md", 14, "ouyou"),
  ref("samples/13_脚注.md", "15-footnotes.md", 15, "ouyou"),
  ref("samples/14_アラート.md", "16-alerts.md", 16, "ouyou"),
  ref("samples/15_数式.md", "17-math.md", 17, "ouyou"),
  ref("samples/16_Mermaid.md", "18-mermaid.md", 18, "ouyou"),
  ref("samples/17_絵文字.md", "19-emojis.md", 19, "ouyou"),
  ref("samples/18_コメント.md", "20-comments.md", 20, "ouyou"),
  ref("samples/19_エスケープ.md", "21-escape.md", 21, "ouyou"),
  ref("samples/20_定義リスト.md", "22-definition-lists.md", 22, "ouyou"),
  ref("samples/21_目次リンク.md", "23-toc-links.md", 23, "ouyou"),
  {
    sourceRel: "解説記事（拡張編）.md",
    targetFile: "24-intro-kakucho.md",
    order: 24,
    type: "lecture",
    category: "kakucho",
    difficulty: "beginner",
    tags: [...MD_BASE_TAGS, "fundamentals", "concept"],
    estimatedMinutes: 15,
    titleOverride: "解説記事 (拡張編)",
  },
  ref("samples/22_ハイライト.md", "25-highlight.md", 25, "kakucho"),
  ref("samples/23_上付き下付き.md", "26-superscript-subscript.md", 26, "kakucho"),
  ref("samples/24_diff構文.md", "27-diff.md", 27, "kakucho"),
  ref("samples/25_インラインHTML.md", "28-inline-html.md", 28, "kakucho"),
  ref("samples/26_フロントマター.md", "29-frontmatter.md", 29, "kakucho"),
  ref("samples/27_GitHub固有記法.md", "30-github-syntax.md", 30, "kakucho"),
  ref("samples/28_略語定義.md", "31-abbreviations.md", 31, "kakucho"),
  ref("samples/29_スライド作成.md", "32-slides.md", 32, "kakucho"),
];

function ref(
  sourceRel: string,
  targetFile: string,
  order: number,
  category: string,
): MigrationEntry {
  return {
    sourceRel,
    targetFile,
    order,
    type: "reference",
    category,
    difficulty: "beginner",
    tags: [...MD_BASE_TAGS, "reference"],
    estimatedMinutes: 5,
  };
}

// ---------------------------------------------------------------------------
// Git module
// ---------------------------------------------------------------------------

const GIT_LECTURES: MigrationEntry[] = [
  {
    sourceRel: "解説記事（基礎編）.md",
    targetFile: "01-intro-kiso.md",
    order: 1,
    type: "lecture",
    category: "kiso",
    difficulty: "beginner",
    tags: [...GIT_BASE_TAGS, "fundamentals", "concept"],
    estimatedMinutes: 15,
    titleOverride: "解説記事 (基礎編)",
  },
  {
    sourceRel: "解説記事（実践編）.md",
    targetFile: "02-intro-jissen.md",
    order: 2,
    type: "lecture",
    category: "jissen",
    difficulty: "intermediate",
    tags: [...GIT_BASE_TAGS, "intermediate", "concept"],
    estimatedMinutes: 15,
    titleOverride: "解説記事 (実践編)",
  },
  {
    sourceRel: "解説記事（応用編）.md",
    targetFile: "03-intro-ouyou.md",
    order: 3,
    type: "lecture",
    category: "ouyou",
    difficulty: "intermediate",
    tags: [...GIT_BASE_TAGS, "intermediate", "concept"],
    estimatedMinutes: 15,
    titleOverride: "解説記事 (応用編)",
  },
  {
    sourceRel: "解説記事（チーム開発編）.md",
    targetFile: "04-intro-team.md",
    order: 4,
    type: "lecture",
    category: "team",
    difficulty: "intermediate",
    tags: [...GIT_BASE_TAGS, "github", "intermediate", "concept"],
    estimatedMinutes: 20,
    titleOverride: "解説記事 (チーム開発編)",
  },
  {
    sourceRel: "解説記事（VS Code編）.md",
    targetFile: "05-intro-vscode.md",
    order: 5,
    type: "lecture",
    category: "jissen",
    difficulty: "intermediate",
    tags: [...GIT_BASE_TAGS, "vscode", "intermediate", "concept"],
    estimatedMinutes: 15,
    titleOverride: "解説記事 (VS Code編)",
  },
  {
    sourceRel: "ハンズオン（チーム開発編）.md",
    targetFile: "06-team-workshop.md",
    order: 6,
    type: "lecture",
    category: "team",
    difficulty: "intermediate",
    tags: [...GIT_BASE_TAGS, "github", "intermediate", "tutorial"],
    estimatedMinutes: 30,
    titleOverride: "チーム開発の進め方",
  },
  {
    sourceRel: "講師メモ（チーム開発ハンズオン）.md",
    targetFile: "07-instructor-notes.md",
    order: 7,
    type: "lecture",
    category: "team",
    difficulty: "intermediate",
    tags: [...GIT_BASE_TAGS, "instructor", "concept"],
    estimatedMinutes: 10,
    titleOverride: "講師向けメモ (チーム開発ハンズオン)",
    status: "draft",
  },
];

const GIT_REFERENCES: MigrationEntry[] = [
  gref("samples/01_Gitとは.md", "08-what-is-git.md", 8, "kiso"),
  gref("samples/02_インストールと初期設定.md", "09-install.md", 9, "kiso"),
  gref("samples/03_リポジトリの作成.md", "10-init-and-clone.md", 10, "kiso"),
  gref("samples/04_ステージングとコミット.md", "11-add-and-commit.md", 11, "kiso"),
  gref("samples/05_変更の確認.md", "12-status-and-log.md", 12, "kiso"),
  gref("samples/07_ブランチの基本.md", "13-branch-basics.md", 13, "kiso"),
  gref("samples/08_マージの基本.md", "14-merge-basics.md", 14, "kiso"),
  gref("samples/10_リモートリポジトリ.md", "15-remote-basics.md", 15, "kiso"),
  // jissen
  gref("samples/11_GitHub入門.md", "16-github-intro.md", 16, "jissen"),
  gref("samples/12_GitHubでの基本操作.md", "17-push-and-pull.md", 17, "jissen"),
  gref("samples/17_プルリクエスト.md", "18-pull-request.md", 18, "jissen"),
  gref("samples/20_コードレビュー.md", "19-code-review.md", 19, "jissen"),
  gref("samples/09_コンフリクトの解決.md", "20-merge-conflict.md", 20, "jissen"),
  gref("samples/15_リベース.md", "21-rebase.md", 21, "jissen"),
  // ouyou
  gref("samples/16_スタッシュ.md", "22-stash.md", 22, "ouyou"),
  gref("samples/14_タグ付け.md", "23-tag.md", 23, "ouyou"),
  gref("samples/13_コミット履歴の操作.md", "24-revert-and-reset.md", 24, "ouyou"),
  gref("samples/06_ファイルの管理.md", "25-gitignore.md", 25, "ouyou"),
  // team
  gref("samples/19_GitFlow.md", "26-gitflow.md", 26, "team"),
  gref("samples/18_Issue管理.md", "27-issue-management.md", 27, "team"),
  gref("samples/21_CICD基礎.md", "28-ci-cd.md", 28, "team"),
  gref("samples/22_チーム開発ワークフロー.md", "29-team-workflow.md", 29, "team"),
  // back to ouyou
  gref("samples/23_トラブルシューティング.md", "30-troubleshooting.md", 30, "ouyou"),
  gref("samples/24_Git設定とエイリアス.md", "31-git-config-and-alias.md", 31, "ouyou"),
];

export const GIT_ENTRIES: MigrationEntry[] = [...GIT_LECTURES, ...GIT_REFERENCES];

function gref(
  sourceRel: string,
  targetFile: string,
  order: number,
  category: string,
): MigrationEntry {
  const difficulty: Difficulty = category === "kiso" ? "beginner" : "intermediate";
  return {
    sourceRel,
    targetFile,
    order,
    type: "reference",
    category,
    difficulty,
    tags: [...GIT_BASE_TAGS, "reference"],
    estimatedMinutes: 6,
  };
}
