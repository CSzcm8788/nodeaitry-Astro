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

## 写文章与发布（详细）

### 1. 文章放哪
新文章是一个 Markdown 文件，放在 `src/content/posts/` 下，例如 `src/content/posts/my-first-note.md`。
**文件名即网址**：`my-first-note.md` → `https://nodeaitry.com/posts/my-first-note/`。
（迁移自 Hugo 的老文章必须保持原文件名/slug 不变，否则评论会对不上。）

### 2. Frontmatter 模板（复制即用）
```markdown
---
title: "文章标题"
pubDatetime: 2026-06-22T10:00:00+08:00
description: "一句话简介，会显示在列表和分享卡片上"
tags: ["AI", "工程实践"]
draft: false
# 以下为可选：
# modDatetime: 2026-06-23T09:00:00+08:00   # 更新时间
# featured: true                            # 设为精选，置顶在首页“精选”区
# aiSummary: "这篇文章的 AI 摘要文字"
# aiSummaryBy: "nodeaitry"
# ogImage: "/images/cover.png"              # 自定义分享图，不写则自动生成
---

正文从这里开始，用普通 Markdown 写。
```

### 3. 四个关键要点（务必注意）
1. **是 `pubDatetime`，不是 `date`**。这是 AstroPaper 的字段名，写成 Hugo 的 `date` 会报错。
   建议带时区：`2026-06-22T10:00:00+08:00`（东八区）。
2. **`description` 必填**。缺了 `astro check` / 构建会直接失败，导致 Cloudflare 部署红灯。
3. **`draft: true` = 草稿，不会出现在线上**。本地 `pnpm dev` 能看到草稿，但 `pnpm build`（生产）会自动排除。
   写好准备发布时改成 `draft: false`（或删掉该行）。
4. **图片**：不要把大图塞进仓库正文目录，放这两处之一，再在正文用链接引用：
   - **public/**：把图片放 `public/images/`，正文写 `![说明](/images/图片名.png)`（路径以 `/` 开头）。
     适合站点自身的少量图（图标、封面）。
   - **R2 图床**：上传到 Cloudflare R2，用其公开访问 URL 引用，例如
     `![说明](https://你的R2域名/图片名.png)`。文章配图建议都走 R2，避免仓库变大。

### 4. 发布流程
```sh
cd ~/Documents/nodeaitry-hugo/nodeaitry-astro
pnpm dev        # 可选：本地预览 http://localhost:4321，确认无误
git add .
git commit -m "新文章：标题"
git push        # 推送后 Cloudflare Pages 自动构建部署，约 1–2 分钟上线
```

### 5. 出问题怎么办
- 构建红灯：99% 是漏了 `description` 或用了 `date`。本地先跑 `pnpm build` 能提前发现。
- 想临时下线某篇：把它的 `draft` 改成 `true`，提交推送即可。
- 整体回滚：Cloudflare → Pages → Deployments → 选上一个成功部署 → Rollback（最快）。

## 写文章与发布（小白版 · 手把手）

> 完全不懂代码也能照做。你只需要：一个文本编辑器（推荐免费的 VS Code）和“终端”。

### 第 0 步：准备（只需做一次）
- 安装 VS Code（编辑文字用），安装好后用它“打开文件夹” `~/Documents/nodeaitry-hugo/nodeaitry-astro`。
- “终端”就是 Mac 自带的“终端”App（在 启动台 → 其他 里）。后面凡是看到代码块，就是把那几行**复制粘贴进终端，按回车**。

### 第 1 步：新建一篇文章
1. 在 VS Code 左侧找到文件夹 `src` → `content` → `posts`。
2. 右键 `posts` → New File（新建文件），命名为 `wo-de-diyi-pian.md`（**全小写、用英文/数字/连字符，别用空格和中文**）。
   - 这个文件名就是网址：`wo-de-diyi-pian.md` → `nodeaitry.com/posts/wo-de-diyi-pian/`。

### 第 2 步：粘贴模板，改成你的内容
把下面整段复制进去，然后只改引号里的文字：
```markdown
---
title: "我的第一篇文章"
pubDatetime: 2026-06-22T10:00:00+08:00
description: "用一句话说清这篇文章讲什么"
tags: ["随笔"]
draft: false
---

这里开始写正文。空一行就是分段。

## 这是一个小标题

正文里 `## 两个井号 + 空格` 就是小标题，会自动出现在右侧目录里。
```
- `title`：文章标题。
- `pubDatetime`：发布时间，照着格式改数字即可（`2026-06-22T10:00:00+08:00`，最后的 `+08:00` 是北京时间别动）。
- `description`：一句话简介。
- `tags`：标签，可写多个：`["AI", "生活"]`。
- 改完按 `Cmd+S` 保存。

### 第 3 步：插入图片（可选）
- **简单办法**：把图片放进 `public/images/` 文件夹，正文里写：
  `![图片说明](/images/你的图片名.png)`（注意开头那个 `/`）。
- **推荐办法（图多时）**：上传到 Cloudflare R2 图床，复制它给的公开网址，正文里写：
  `![图片说明](https://你的R2网址/图片名.png)`。
- 区别：仓库里别塞大图，否则越来越大；日常配图建议都走 R2。

### 第 4 步：发布上线（复制三行进终端）
```sh
cd ~/Documents/nodeaitry-hugo/nodeaitry-astro
git add .
git commit -m "新文章：我的第一篇文章"
git push
```
- `git add .`：把你的改动“登记”起来。
- `git commit -m "..."`：把这次改动“存档”，引号里随便写说明。
- `git push`：上传到 GitHub。网站（Cloudflare）会自动开始构建，**约 1–2 分钟后** `nodeaitry.com` 就更新了。
- 如果 push 时让你登录：用户名 `CSzcm8788`，密码处粘贴你的 GitHub Token（不是账号密码）。

### 第 5 步：确认上线
等 1–2 分钟，刷新 `https://nodeaitry.com/posts/你的文件名/` 就能看到。

### 常见情况
- **网站没更新 / 部署红灯**：99% 是漏了 `description`，或把 `pubDatetime` 写成了 `date`。补上/改对，再做一次第 4 步。
- **想先存草稿、暂不公开**：把 `draft: false` 改成 `draft: true`，它就不会出现在线上（你本地能看）。想发布时再改回 `false`。
- **写错想撤回**：最快是去 Cloudflare → Pages → Deployments → 选上一个成功版本 → Rollback（一键回到上个版本）。
