/**
 * MDX Components Configuration
 *
 * This file is automatically used by Next.js to provide custom components
 * for MDX rendering across the application.
 */

import type { MDXComponents } from "mdx/types";

import { mdxComponents } from "@/components/MDXComponents";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
