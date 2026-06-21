import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://nodeaitry.com/",
    title: "NODEAI TRY",
    description: "记录、分享与归档 AI、工程实践与产品思考。",
    author: "nodeaitry",
    profile: "https://nodeaitry.com/",
    ogImage: "default-og.jpg",
    lang: "zh",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/CSzcm8788" },
    { name: "x",        url: "https://x.com/yukabiubiu" },
    { name: "telegram", url: "https://t.me/yukabiubiu" },
    { name: "mail",     url: "mailto:muziwen.logo@gmail.com" },
  ],
  shareLinks: [
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
