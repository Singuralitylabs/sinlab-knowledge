---
title: "ファイルの管理"
order: 4
type: detail
difficulty: intermediate
tags: [git, reference]
estimatedMinutes: 6
status: published
---
# ファイルの管理

## 解説

Gitでは、ファイルの追加・変更だけでなく、ファイルの削除・リネーム・無視といった管理操作も重要です。特に `.gitignore` の設定は、不要なファイルをリポジトリに含めないための必須知識です。

### ファイルの状態

Gitが管理するファイルは、以下の状態を持ちます。

```text
┌──────────────────────────────────────────────────────┐
│                    リポジトリ内のファイル                │
│                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ 追跡済み  │  │ 変更あり  │  │ ステージ  │  │ コミット │ │
│  │ Tracked  │→│ Modified │→│ Staged  │→│Committed│ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                                                       │
│  ┌─────────┐                                          │
│  │ 未追跡   │  ← .gitignore で無視可能                  │
│  │Untracked│                                          │
│  └─────────┘                                          │
└──────────────────────────────────────────────────────┘
```

### .gitignore のパターン構文

| パターン | 意味 | 例 |
|----------|------|-----|
| `filename` | 特定のファイルを無視 | `secret.key` |
| `*.ext` | 特定の拡張子を無視 | `*.log` |
| `dir/` | ディレクトリ全体を無視 | `node_modules/` |
| `**/pattern` | 任意の階層のパターン | `**/temp` |
| `!pattern` | 除外の否定（無視しない） | `!important.log` |
| `#` | コメント | `# ログファイル` |

---

## コマンドサンプル

### git rm — ファイルの削除

```bash
# ファイルをGitの追跡から外し、ディスクからも削除する
git rm old-file.txt

# 複数ファイルを削除
git rm file1.txt file2.txt

# ディレクトリごと削除
git rm -r old-directory/

# Gitの追跡からのみ外す（ファイル自体はディスクに残す）
git rm --cached secret-config.txt

# ディレクトリをGitの追跡からのみ外す
git rm -r --cached node_modules/

# ワイルドカードで削除
git rm "*.log"
```

### git mv — ファイルのリネーム・移動

```bash
# ファイル名を変更
git mv old-name.txt new-name.txt

# ファイルを別のディレクトリに移動
git mv index.html src/index.html

# ディレクトリごと移動
git mv components/ src/components/
```

### .gitignore の作成と設定

```bash
# .gitignore ファイルを作成
touch .gitignore

# よく使うパターンを追加（Node.jsプロジェクトの例）
cat << 'EOF' > .gitignore
# 依存パッケージ
node_modules/

# ビルド成果物
dist/
build/
.next/

# 環境変数・秘密情報
.env
.env.local
.env.*.local

# ログファイル
*.log
npm-debug.log*

# OS生成ファイル
.DS_Store
Thumbs.db

# エディタ設定
.vscode/settings.json
.idea/

# テストカバレッジ
coverage/
EOF
```

### グローバル .gitignore の設定

```bash
# グローバル .gitignore のファイルを作成
touch ~/.gitignore_global

# Gitに登録
git config --global core.excludesfile ~/.gitignore_global

# OS固有のファイルを全リポジトリで無視
cat << 'EOF' > ~/.gitignore_global
# macOS
.DS_Store
.AppleDouble
.LSOverride
._*

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini

# Linux
*~
.directory

# エディタ
*.swp
*.swo
*~
.idea/
.vscode/
*.sublime-project
*.sublime-workspace
EOF
```

### 無視されているファイルの確認

```bash
# 現在無視されているファイルの一覧
git status --ignored

# 特定のファイルが無視されるか確認
git check-ignore -v filename.txt

# .gitignore のルールをデバッグ
git check-ignore -v *.log
```

---

## 実行結果

### git rm の結果

```text
$ git rm old-file.txt
rm 'old-file.txt'

$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	deleted:    old-file.txt
```

### git rm --cached の結果

```text
$ git rm --cached secret.txt
rm 'secret.txt'

$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	deleted:    secret.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	secret.txt

# ファイルはディスク上に残っているが、Gitの追跡からは外れた
$ ls secret.txt
secret.txt  # ← まだ存在する
```

### git mv の結果

```text
$ git mv app.js src/app.js

$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	renamed:    app.js -> src/app.js
```

### .gitignore の動作確認

```text
$ echo "node_modules/" >> .gitignore
$ mkdir node_modules
$ echo "test" > node_modules/package.js

$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   .gitignore

# node_modules/ は表示されない（無視されている）

$ git check-ignore -v node_modules/package.js
.gitignore:1:node_modules/    node_modules/package.js
```

---

## よくある間違い

### 1. rm と git rm を混同する

```bash
# ❌ OS の rm コマンドで削除しただけ
$ rm old-file.txt
$ git status
Changes not staged for commit:
	deleted:    old-file.txt
# → まだ git add しないとコミットに反映されない

# ✅ git rm を使えば削除とステージングが同時に行われる
$ git rm old-file.txt
# → 自動的にステージングされる

# ✅ または rm した後に git add で記録
$ rm old-file.txt
$ git add old-file.txt  # 削除を記録
```

### 2. すでに追跡されているファイルを .gitignore に追加しても無視されない

```bash
# ❌ すでにコミット済みのファイルは .gitignore に書いても無視されない
$ echo "config.json" >> .gitignore
$ git status
# → config.json の変更はまだ追跡される

# ✅ まず追跡を外してから .gitignore に追加する
$ git rm --cached config.json
$ echo "config.json" >> .gitignore
$ git add .gitignore
$ git commit -m "config.jsonをGit管理から除外"
```

### 3. .env ファイルをコミットしてしまう

```text
❌ .env（環境変数ファイル）には秘密情報が含まれることが多い
   一度コミットすると、履歴から完全に消すのは困難

✅ プロジェクト開始時に .gitignore を設定する
   .env.example（秘密情報なしのテンプレート）はコミットする
```

```bash
# .env.example を作成して共有する
cat << 'EOF' > .env.example
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=your-api-key-here
SECRET_KEY=your-secret-key-here
EOF

git add .env.example
git commit -m ".envのテンプレートを追加"
```

### 4. .gitignore のパターンが意図通りに動かない

```bash
# ❌ ディレクトリを無視したいのにスラッシュを忘れる
logs        # ← 「logs」という名前のファイルもディレクトリも無視

# ✅ ディレクトリを明示する
logs/       # ← 「logs」ディレクトリだけを無視

# ❌ 否定パターンの順序が間違っている
!important.log
*.log
# ↑ 最後の *.log が優先されて important.log も無視される

# ✅ 否定パターンは後に書く
*.log
!important.log
# ↑ まず *.log で全部無視し、important.log だけ除外
```

---

## 実用例

### プロジェクト言語ごとの .gitignore テンプレート

#### Node.js プロジェクト

```text
node_modules/
dist/
build/
.next/
.env
.env.local
*.log
npm-debug.log*
coverage/
.DS_Store
```

#### Python プロジェクト

```text
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
.env
*.egg-info/
dist/
build/
.pytest_cache/
.coverage
htmlcov/
.DS_Store
```

#### Java プロジェクト

```text
*.class
*.jar
*.war
*.ear
target/
.gradle/
build/
.idea/
*.iml
.DS_Store
```

### 誤ってコミットしたファイルをGit管理から外す

```bash
# 1. .gitignore にパターンを追加
echo "secrets/" >> .gitignore

# 2. Gitの追跡から外す（ファイルは残す）
git rm -r --cached secrets/

# 3. 変更をコミット
git add .gitignore
git commit -m "secretsディレクトリをGit管理から除外"
```

### ファイルのリネームを正しく行う

```bash
# git mv を使うと、リネームとして履歴が保持される
git mv components/Button.jsx components/Button.tsx

# 確認
git status
# renamed: components/Button.jsx -> components/Button.tsx

git commit -m "ButtonコンポーネントをTypeScriptに変換"
```

---

## 実習

### 課題1：git rm と git rm --cached の違いを体験する

1. テスト用のファイルを2つ作成してコミットしてください
2. 1つ目のファイルに `git rm` を実行してください（ファイルが消えることを確認）
3. 2つ目のファイルに `git rm --cached` を実行してください（ファイルは残ることを確認）
4. `git status` で両方の違いを確認してください

### 課題2：.gitignore を作成する

1. 新しいリポジトリで .gitignore ファイルを作成してください
2. 以下のパターンを追加してください：
   - `*.log` （ログファイル）
   - `temp/` （一時ディレクトリ）
   - `.env` （環境変数ファイル）
3. これらのファイル・ディレクトリを実際に作成して、`git status` で無視されることを確認してください

### 課題3：否定パターンを試す

1. `*.log` を .gitignore に追加してください
2. `important.log` と `debug.log` を作成してください
3. `!important.log` を .gitignore に追加してください
4. `git status` で `important.log` だけが表示されることを確認してください

### 課題4：git mv でファイルを整理する

1. プロジェクトルートにいくつかのファイルを作成してコミットしてください
2. `src/` ディレクトリを作成してください
3. `git mv` を使ってファイルを `src/` に移動してください
4. `git status` で `renamed` と表示されることを確認してください
5. コミットしてください
