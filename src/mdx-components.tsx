import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { Pre } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { PropTable } from "@/components/docs/prop-table";
import { Tab, Tabs } from "@/components/docs/tabs";

/** Heading with a hover anchor; ids come from rehype-slug. */
function heading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as const;
  const sizes = {
    2: "mt-12 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight",
    3: "mt-8 mb-2 scroll-mt-24 text-base font-semibold tracking-tight",
    4: "mt-6 mb-2 scroll-mt-24 text-sm font-semibold",
  } as const;

  return function Heading({ id, children, ...props }: React.ComponentProps<"h2">) {
    return (
      <Tag id={id} className={`group ${sizes[level]} text-fg`} {...props}>
        {children}
        {id && (
          <a
            href={`#${id}`}
            data-heading-anchor
            aria-label="Link to this section"
            className="ml-2 text-fg-faint opacity-0 transition-opacity group-hover:opacity-100"
          >
            #
          </a>
        )}
      </Tag>
    );
  };
}

export const docsComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="mb-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl" {...props} />
  ),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
  p: (props) => <p className="my-4 leading-7 text-fg-muted" {...props} />,
  a: ({ href = "", ...props }) => {
    const external = href.startsWith("http");
    return (
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
        {...props}
      />
    );
  },
  ul: (props) => (
    <ul className="my-4 ml-1 flex list-none flex-col gap-2 text-fg-muted [&>li]:relative [&>li]:pl-5" {...props} />
  ),
  ol: (props) => <ol className="my-4 ml-5 flex list-decimal flex-col gap-2 text-fg-muted" {...props} />,
  li: (props) => (
    <li
      className="leading-7 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-border-strong [ol>&]:before:hidden [ol>&]:pl-0"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  hr: () => <hr className="my-10 border-border" />,
  blockquote: (props) => (
    <blockquote
      className="my-5 border-l-2 border-accent/40 pl-4 italic text-fg-muted"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-5 overflow-x-auto rounded-xl border border-border scrollbar-thin">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => (
    <thead className="bg-bg-subtle text-xs uppercase tracking-wider text-fg-faint" {...props} />
  ),
  th: (props) => <th className="whitespace-nowrap px-4 py-2.5 font-medium" {...props} />,
  td: (props) => (
    <td className="border-t border-border px-4 py-3 align-top leading-relaxed text-fg-muted" {...props} />
  ),
  code: (props) => (
    <code
      className="rounded-md border border-border bg-bg-subtle px-1.5 py-0.5 font-mono text-[0.85em] text-fg [pre_&]:border-0 [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit"
      {...props}
    />
  ),
  pre: Pre,
  figcaption: (props) => (
    <figcaption
      className="border-b border-border bg-bg-subtle px-4 py-2 font-mono text-xs text-fg-muted"
      {...props}
    />
  ),
  Callout,
  PropTable,
  Tabs,
  Tab,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...docsComponents, ...components };
}
