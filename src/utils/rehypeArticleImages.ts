interface ImageNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: ImageNode[];
}

/** Let Astro generate dimensions and responsive assets for our R2 images. */
export function rehypeArticleImages() {
  return (tree: ImageNode) => {
    let firstImage = true;
    function visit(node: ImageNode) {
      if (node.tagName === "img" && typeof node.properties?.src === "string") {
        const props = node.properties;
        props.loading = firstImage ? "eager" : "lazy";
        props.decoding = "async";
        if (firstImage) props.fetchpriority = "high";
        firstImage = false;
        if (String(props.src).startsWith("https://images.anvenl.com/")) {
          props["data-original-src"] = props.src;
          props.layout = "constrained";
          props.sizes = "(min-width: 768px) 736px, calc(100vw - 32px)";
          props.quality = 80;
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
