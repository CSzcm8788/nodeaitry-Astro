import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostSlug, getPostUrl } from "@/utils/getPostPaths";
import { getSortedPosts } from "@/utils/getSortedPosts";
import config from "@/config";

// 每篇文章的纯文本输出（复刻 missuo.me 的 /posts/<slug>/llms.txt）
export async function getStaticPaths() {
  const posts = getSortedPosts(await getCollection("posts")).filter(
    p => !p.data.draft
  );
  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: { post },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const post = (props as any).post;
  const base = config.site.url.replace(/\/+$/, "");
  const url =
    base +
    ("/" + getPostUrl(post.id, post.filePath, config.site.lang).replace(/^\/+|\/+$/g, "") + "/").replace(/\/{2,}/g, "/");
  const d = post.data;
  const head = [
    `# ${d.title}`,
    d.description ? `\n> ${d.description}` : "",
    `\nURL: ${url}`,
    `Date: ${new Date(d.pubDatetime).toISOString().slice(0, 10)}`,
    d.tags?.length ? `Tags: ${d.tags.join(", ")}` : "",
    d.aiSummary ? `\nAI Summary: ${d.aiSummary}` : "",
    "\n---\n",
  ]
    .filter(Boolean)
    .join("\n");
  const body = String(post.body ?? "").replace(/^##\s*Table of contents\s*$/im, "").replace(/\n{3,}/g, "\n\n").trim();
  return new Response(head + "\n" + body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
