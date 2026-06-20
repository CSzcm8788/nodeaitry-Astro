import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

// 复刻 Hugo 的 /llms.txt：站点页面索引（llmstxt.org 规范，纯静态，非实时 AI）
export const GET: APIRoute = async () => {
  const base = config.site.url.replace(/\/+$/, "");
  const posts = getSortedPosts(await getCollection("posts")).filter(
    p => !p.data.draft
  );

  const lines: string[] = [];
  lines.push(`# ${config.site.title}`);
  lines.push(`- [关于](${base}/about/)`);
  lines.push("");
  lines.push("## 文章");
  for (const post of posts) {
    const url =
      base +
      ("/" + getPostUrl(post.id, post.filePath, config.site.lang).replace(/^\/+|\/+$/g, "") + "/").replace(/\/{2,}/g, "/");
    lines.push(`- [${post.data.title}](${url})`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
