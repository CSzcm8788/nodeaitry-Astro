import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

// 站点级 llms.txt 索引（llmstxt.org 规范，纯静态）。
// 每篇文章链接指向其纯文本版 /posts/<slug>/llms.txt。
export const GET: APIRoute = async () => {
  const base = config.site.url.replace(/\/+$/, "");
  const posts = getSortedPosts(await getCollection("posts")).filter(
    p => !p.data.draft
  );

  const postUrl = (post: (typeof posts)[number]) =>
    base +
    ("/" + getPostUrl(post.id, post.filePath, config.site.lang).replace(/^\/+|\/+$/g, "") + "/").replace(/\/{2,}/g, "/");

  const lines: string[] = [];
  lines.push(`# ${config.site.title}`);
  lines.push(`\n> ${config.site.description}`);
  lines.push("");
  lines.push(`- [关于](${base}/about/)`);
  lines.push("");
  lines.push("## 文章");
  for (const post of posts) {
    lines.push(`- [${post.data.title}](${postUrl(post)}llms.txt): ${post.data.description}`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
