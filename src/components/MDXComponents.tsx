/**
 * Custom MDX Components
 *
 * Enhanced components for better MDX rendering with modern styling
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MDXComponentProps {
  children?: ReactNode;
  className?: string;
}

// Custom heading components with better styling
export const H1 = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <h1
    className={cn(
      "text-4xl font-bold tracking-tight text-foreground mb-6 pb-2 border-b border-border",
      className,
    )}
    {...props}
  >
    {children}
  </h1>
);

export const H2 = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <h2
    className={cn(
      "text-3xl font-semibold text-foreground mt-8 mb-4 pb-1 border-b border-border/50",
      className,
    )}
    {...props}
  >
    {children}
  </h2>
);

export const H3 = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <h3
    className={cn(
      "text-2xl font-semibold text-foreground mt-6 mb-3",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
);

export const H4 = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <h4
    className={cn("text-xl font-semibold text-foreground mt-4 mb-2", className)}
    {...props}
  >
    {children}
  </h4>
);

// Enhanced paragraph component
export const P = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <p
    className={cn("text-base leading-7 text-muted-foreground mb-4", className)}
    {...props}
  >
    {children}
  </p>
);

// Enhanced list components
export const UL = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <ul
    className={cn(
      "list-disc list-inside space-y-2 mb-4 text-muted-foreground ml-4",
      className,
    )}
    {...props}
  >
    {children}
  </ul>
);

export const OL = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <ol
    className={cn(
      "list-decimal list-inside space-y-2 mb-4 text-muted-foreground ml-4",
      className,
    )}
    {...props}
  >
    {children}
  </ol>
);

export const LI = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <li className={cn("text-base leading-6", className)} {...props}>
    {children}
  </li>
);

// Enhanced blockquote
export const Blockquote = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <blockquote
    className={cn(
      "border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 rounded-r-lg italic text-muted-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </blockquote>
);

// Enhanced code components
export const Code = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <code
    className={cn(
      "bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </code>
);

export const Pre = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <pre
    className={cn(
      "bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4 border",
      className,
    )}
    {...props}
  >
    {children}
  </pre>
);

// Enhanced link component
export const A = ({
  children,
  className,
  href,
  ...props
}: MDXComponentProps & any) => (
  <a
    href={href}
    className={cn(
      "text-primary hover:text-primary/80 underline underline-offset-4 transition-colors",
      className,
    )}
    {...props}
  >
    {children}
  </a>
);

// Enhanced table components
export const Table = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <div className="overflow-x-auto mb-4">
    <table
      className={cn(
        "w-full border-collapse border border-border rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
    </table>
  </div>
);

export const TH = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <th
    className={cn(
      "border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </th>
);

export const TD = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <td
    className={cn(
      "border border-border px-4 py-2 text-muted-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </td>
);

// Horizontal rule
export const HR = ({ className, ...props }: MDXComponentProps & any) => (
  <hr
    className={cn("border-0 border-t border-border my-8", className)}
    {...props}
  />
);

// Strong and emphasis
export const Strong = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <strong className={cn("font-semibold text-foreground", className)} {...props}>
    {children}
  </strong>
);

export const Em = ({
  children,
  className,
  ...props
}: MDXComponentProps & any) => (
  <em className={cn("italic text-muted-foreground", className)} {...props}>
    {children}
  </em>
);

// Export all components as a single object for MDX
export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
  a: A,
  table: Table,
  th: TH,
  td: TD,
  hr: HR,
  strong: Strong,
  em: Em,
};

export default mdxComponents;
