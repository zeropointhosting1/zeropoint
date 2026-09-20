import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import { MdxPre } from "./mdx-pre"
import { Callout } from "./callout"

type MdxComponents = NonNullable<MDXRemoteProps["components"]>

export const mdxComponents: MdxComponents = {
  h2: ({ children, ...props }) => (
    <h2 className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-relaxed text-text-secondary" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-text-secondary" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-text-secondary" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  a: ({ children, ...props }) => (
    <a className="text-primary underline-offset-4 hover:underline" {...props}>
      {children}
    </a>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="my-6 border-l-2 border-primary/40 pl-4 text-text-secondary italic" {...props}>
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="my-10 border-border" {...props} />,
  // Deliberately no `code` override — that tag means two different things
  // (an inline snippet vs. a token inside a highlighted block from
  // rehype-pretty-code), and there's no reliable prop to tell them apart
  // here. Inline code is styled in globals.css via a selector that
  // excludes anything inside <pre>, instead.
  pre: MdxPre,
  Callout,
}
