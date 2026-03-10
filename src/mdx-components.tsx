import type { MDXComponents } from 'mdx/types';

import { markdownComponents } from './utils/markdownComponents';

export function useMDXComponents(): MDXComponents {
  return markdownComponents;
}
