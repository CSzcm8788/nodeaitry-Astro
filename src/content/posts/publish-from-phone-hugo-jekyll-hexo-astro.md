---
title: "用手机给 Hugo、Jekyll、Hexo、Astro 博客写文章并发布到 GitHub"
pubDatetime: 2026-10-30T19:01:44+08:00
description: "静态博客的文章就在 GitHub 仓库里，手机上很难直接发。这篇记录用 Reltext 在手机上写 Markdown、预检后发布到自己仓库的完整步骤，以及四种框架各自要求的目录和 front matter。"
author: "Anvenl"
tags: ["Reltext", "Hugo", "Jekyll", "Hexo", "Astro", "GitHub", "教程"]
draft: false
aiSummary: "这篇教程介绍如何用 Reltext 在手机上写 Markdown、连接 GitHub 仓库，并经过预检和确认后发布或更新文章。文中列出了 Hugo、Jekyll、Hexo、Astro 的目录和字段要求，也说明了当前对自定义 AstroPaper 结构的限制，以及同名文件和远端修改的处理方式。"
aiSummaryBy: "Claude"
---

用 Hugo、Jekyll、Hexo、Astro 这类工具搭的静态博客，好处是文章都在自己的 GitHub 仓库里，坏处是发一篇文章基本离不开电脑：建文件、写 front matter、放图片、提交、推送。

这篇记录我现在的做法：在手机上用 Reltext 写，预检通过后直接发布到仓库。下面的步骤以 [Reltext 文档](https://reltext.com/docs) 为准。

## 先确认你的仓库结构

Reltext 目前按下面这套规则写入文件：

| 框架 | 文章写到 | 图片放到 | 会写入的 front matter |
| --- | --- | --- | --- |
| Hugo | `{内容路径}/<slug>.md`（默认 `content/posts`） | `{媒体路径}`（通常在 `static/` 下） | title、slug、summary、date |
| Jekyll | `_posts/YYYY-MM-DD-<slug>.md` | `assets/` | layout、title、date、published、tags、categories |
| Hexo | `source/_posts/<slug>.md` | `source/` | title、date、updated、published、tags、categories；写了摘要时还有 excerpt |
| Astro | `src/content/blog/<slug>.md` | `public/` | title、description、pubDate；如果 schema 里定义了，还有 updatedDate、draft、tags |

Hugo 的内容路径和媒体路径可以按自己仓库的目录填；Jekyll、Hexo、Astro 只支持上表里的默认目录。

Astro 还有两个额外要求：

- 内容集合要叫 `blog`，schema 里必须有 `title`、`description` 和 `pubDate`。用 `npm create astro@latest -- --template blog` 建出来的就是这个结构。
- 草稿的「摘要」会变成文章的 `description`，所以每篇 Astro 文章都要写摘要。

我自己的博客（Anvenl）用的是 AstroPaper 主题：文章放在 `src/content/posts`，日期字段叫 `pubDatetime`，schema 里还有自定义字段。这种改过的目录和字段，Reltext 目前不支持；预检会直接说明原因，不会写错文件。

## 第一步：在网页上连接博客仓库（只做一次）

站点设置要在网页上完成，因为连接 GitHub 得在浏览器里走。手机 App 能看到站点，但不能修改。

1. 打开 [reltext.com/sites](https://reltext.com/sites)，选择 **Add destination**。
2. 填站点名、框架、域名、仓库所有者和名称、分支、内容路径和媒体路径，选择 **Create site**。
3. 在站点页面选择 **Connect GitHub App**。GitHub 会让你安装 **Reltext Publish**，只给它这一个仓库的权限就够了。
4. 选择 **Verify repository**。站点显示 **Publish Ready** 就可以接收文章了。这一步只读取仓库，不会改任何东西。

Reltext 通过这个 GitHub App 写入，不保存长期有效的 GitHub 令牌。

## 第二步：在手机上写

在 App 里点新建，直接开始写 Markdown。键盘上方有一排格式工具：标题、粗体、斜体、链接、列表、引用、图片等。图片可以从相册、相机或文件里加，上传前会去掉位置等元数据。

没网也能写。草稿会先存在手机上，联网后自动上传。发布要连 GitHub，所以得等有网的时候再做。

## 第三步：预检，然后发布

1. 打开草稿，选择 **⋯ → Preflight**。第一次会让你选一个站点。
2. 预检会逐项检查：草稿、站点、GitHub 连接、仓库、分支和路径、图片，以及目标位置有没有同名文件。
3. 全部通过后选择 **Review confirmation**。确认页会显示仓库、分支和目标路径。这个确认 5 分钟内有效。有一项没过，就停在这里，不会写入仓库。
4. 选择 **Publish now**。

发布的是你确认的那一版。每次发布会生成一次提交（提交信息是 `Publish: 标题`），文章和图片都在这个提交里；新文章不会覆盖已有文件，目标位置有同名文件时预检就会停下。之后仓库的自动构建（Cloudflare Pages、Netlify、GitHub Pages 之类）会照常触发。

在网页上也能发：编辑器里选择 **Publish**，预览页会显示目标文件和生成的 Markdown，并跑一遍同样的检查，再选择 **Confirm Publish**。

## 发布之后想改

已经发布的文章可以继续改（Pro 功能）：选择 **Edit post**（网页版在顶部横幅里，手机在「⋯」菜单里），改完选择 **Update post**，它会重新跑一遍预检，然后在一次提交里替换原来那个文件。文章地址和首次发布日期都不变，仓库里也不会多出一个文件。

如果有人在 GitHub 上直接改过这篇文章，Reltext 不会覆盖，会先提示你处理。

## 把流程串起来

对于符合上述目录和字段要求的博客，流程就是：灵感来了在手机上写，回到电脑前打开网页版接着改，满意后在任意一端预检、发布。本站使用的自定义 AstroPaper 结构目前仍需单独提交到仓库。无论哪种方式，仓库都是自己的，Markdown 还是普通的 Markdown，哪天不用 Reltext 了，文章也都还在。

---

*这篇文章在 Reltext 里写成。*
