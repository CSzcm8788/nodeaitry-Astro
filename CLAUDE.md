# NODEAI TRY — Astro 站点（从 Hugo 迁移）

Hugo + PaperMod 前端已迁移到 **Astro + AstroPaper**。后端完全不变：
Cloudflare Pages（部署）+ Workers + D1（评论）+ R2（图床）+ Telegram（审核）。

## 技术栈
- Astro 6.4.2 + AstroPaper v6.1（与 missuo.me 同款）
- 搜索：Pagefind（构建时生成）
- 包管理：**pnpm**（必须用 pnpm + 锁文件，npm 会装到不兼容的版本导致构建崩溃）
- Node ≥ 22.12

## 常用命令（本地安全）
- `pnpm install` —— 安装依赖
- `pnpm dev` —— 本地预览（评论自动指向 http://localhost:8787 的本地 Worker）
- `pnpm build` —— 构建（含 astro check + pagefind）。构建需联网下载 Google 字体。

## ⚠️ 通向生产的命令（开发时勿误触）
- `git push`（触发 Cloudflare Pages 自动部署）
- 评论 Worker 的 `wrangler deploy` / `db:migrate:remote`（在原 Hugo 仓库的 worker/ 里，动的是线上 D1）

## 内容
- 文章：`src/content/posts/*.md`（frontmatter 用 `pubDatetime`，支持自定义 `aiSummary` / `aiSummaryBy`）
- 关于页：`src/content/pages/about.md`
- 站点配置：`astro-paper.config.ts`；UI 中文文案：`src/i18n/lang/zh.ts`

## 评论系统（关键）
- 组件：`src/components/Comments.astro`，对接同一个 Worker（`/v1/comments`）。
- `pageKey` 必须等于线上 Hugo 的 RelPermalink（带尾斜杠，如 `/posts/hello-nodeaitry/`），
  否则老文章评论会对不上。迁移时务必保持文章 slug 不变。

## 迁移到生产（最后一步，由你决定）
线上由 Cloudflare Pages 从 Hugo 构建切换到 Astro 构建时，需要改 Pages 项目的构建设置：
- Build command: `pnpm build`（原来是 `hugo --gc --minify`）
- Build output directory: `dist`（原来是 `public`）
- 环境变量可删掉 HUGO_VERSION（保留 HUGO_ENV 无影响）
在此之前，线上保持现状不受影响。
