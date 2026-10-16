import { Callout, Embed, Video, YouTube } from "@/components/blog/media"
import { cn } from "@/lib/utils"
import fs from "node:fs"
import path from "node:path"
import { imageSize } from "image-size"
import { MDXRemote } from "next-mdx-remote/rsc"
import Image from "next/image"
import Link from "next/link"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeUnwrapImages from "rehype-unwrap-images"
import remarkGfm from "remark-gfm"

type ElementProps<T extends keyof React.JSX.IntrinsicElements> =
  React.ComponentPropsWithoutRef<T> & Record<string, unknown>

/** Reads the intrinsic size of an image in `public/` so it renders without layout shift. */
function localImageSize(src: string): { width: number; height: number } | null {
  try {
    const file = path.join(process.cwd(), "public", decodeURIComponent(src))
    const { width, height } = imageSize(fs.readFileSync(file))
    return width && height ? { width, height } : null
  } catch {
    return null
  }
}

/**
 * Markdown images. `![alt](/blog/post/shot.png "A caption")` becomes a figure;
 * the optional title becomes the caption. Local images go through next/image.
 */
function PostImage({ src, alt, title }: ElementProps<"img">) {
  if (typeof src !== "string" || src === "") return null

  const frame = "w-full h-auto rounded-xl border border-stroke bg-surface-elevated"
  const remote = /^https?:\/\//.test(src)
  const size = remote ? null : localImageSize(src)

  return (
    <figure className="my-10">
      {size ? (
        <Image
          src={src}
          alt={typeof alt === "string" ? alt : ""}
          width={size.width}
          height={size.height}
          className={frame}
          sizes="(min-width: 1024px) 720px, 100vw"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={typeof alt === "string" ? alt : ""}
          loading="lazy"
          decoding="async"
          className={frame}
        />
      )}
      {title && (
        <figcaption className="accent-rule mt-4 pl-4 text-sm leading-relaxed text-muted-foreground text-pretty">
          {title}
        </figcaption>
      )}
    </figure>
  )
}

function PostLink({ href, children, ...props }: ElementProps<"a">) {
  const target = typeof href === "string" ? href : ""
  const linkClass =
    "text-foreground underline decoration-brand/50 underline-offset-4 transition-colors hover:decoration-brand"

  // Heading anchors added by rehype-autolink-headings, and in-page jumps.
  if (target.startsWith("#")) {
    return (
      <a href={target} {...props}>
        {children}
      </a>
    )
  }

  if (/^https?:\/\//.test(target) || target.startsWith("mailto:")) {
    return (
      <a href={target} target="_blank" rel="noopener" className={linkClass} {...props}>
        {children}
      </a>
    )
  }

  // Site-internal links are written locale-free (`/faq`); next/link keeps the
  // reader's locale prefix because posts render inside the [locale] segment.
  return (
    <Link href={target} className={linkClass} {...props}>
      {children}
    </Link>
  )
}

const components = {
  h1: (props: ElementProps<"h1">) => (
    <h1 className="mt-16 mb-6 text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl" {...props} />
  ),
  h2: (props: ElementProps<"h2">) => (
    <h2 className="mt-16 mb-6 border-t border-hairline pt-10 text-3xl leading-[1.1] tracking-[-0.03em] text-foreground text-balance sm:text-[2.25rem]" {...props} />
  ),
  h3: (props: ElementProps<"h3">) => (
    <h3 className="mt-12 mb-4 text-2xl leading-tight tracking-[-0.02em] text-foreground" {...props} />
  ),
  h4: (props: ElementProps<"h4">) => (
    <h4 className="mt-10 mb-3 text-xl leading-tight tracking-[-0.015em] text-foreground" {...props} />
  ),
  p: (props: ElementProps<"p">) => (
    <p className="my-6 text-lg leading-[1.75] text-muted-foreground text-pretty" {...props} />
  ),
  a: PostLink,
  img: PostImage,
  ul: (props: ElementProps<"ul">) => (
    <ul className="my-6 ml-5 list-disc space-y-2.5 text-lg text-muted-foreground marker:text-brand" {...props} />
  ),
  ol: (props: ElementProps<"ol">) => (
    <ol className="my-6 ml-5 list-decimal space-y-2 text-lg text-muted-foreground marker:text-brand" {...props} />
  ),
  li: (props: ElementProps<"li">) => <li className="leading-relaxed pl-1" {...props} />,
  blockquote: (props: ElementProps<"blockquote">) => (
    <blockquote
      className="accent-rule my-12 py-1 pl-6 text-2xl font-light leading-[1.35] tracking-[-0.02em] text-foreground sm:pl-8 sm:text-[1.75rem] [&>p]:my-4 [&>p]:text-[length:inherit] [&>p]:leading-[inherit] [&>p]:text-foreground [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
      {...props}
    />
  ),
  hr: (props: ElementProps<"hr">) => (
    <hr className="my-16 h-px border-0 bg-hairline" {...props} />
  ),
  strong: (props: ElementProps<"strong">) => (
    <strong className="font-medium text-foreground" {...props} />
  ),
  code: ({ className, ...props }: ElementProps<"code">) => {
    // Code inside a fenced block is already styled by rehype-pretty-code.
    if (props["data-language"] || props["data-theme"]) {
      return <code className={className} {...props} />
    }
    return (
      <code
        className={cn(
          "rounded-md border border-hairline bg-foreground/[0.05] px-1.5 py-0.5 font-mono text-[0.85em] text-foreground [overflow-wrap:anywhere]",
          className,
        )}
        {...props}
      />
    )
  },
  table: (props: ElementProps<"table">) => (
    <div className="my-10 overflow-x-auto rounded-xl border border-stroke bg-card">
      <table className="w-full border-collapse text-left text-sm [&_tbody_tr:last-child>td]:border-b-0" {...props} />
    </div>
  ),
  th: (props: ElementProps<"th">) => (
    <th
      className="border-b border-hairline px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.14em] whitespace-nowrap text-muted-foreground"
      {...props}
    />
  ),
  td: (props: ElementProps<"td">) => (
    <td className="border-b border-hairline px-4 py-3 align-top leading-relaxed text-muted-foreground" {...props} />
  ),
  // Components authors can use directly in a post.
  Video,
  YouTube,
  Embed,
  Callout,
}

const prettyCodeOptions = {
  // Both site themes are rendered at build time; blog.css picks one per mode.
  theme: { light: "github-light", dark: "github-dark-default" },
  keepBackground: false,
  defaultLang: "text",
}

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="post-body">
      <MDXRemote
        source={source}
        components={components}
        options={{
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeUnwrapImages,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: "heading-anchor" } }],
              [rehypePrettyCode, prettyCodeOptions],
            ],
          },
        }}
      />
    </div>
  )
}
