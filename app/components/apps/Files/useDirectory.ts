import { useMemo } from 'react';
import resolvePath from '~/utils/resolvePath';

export default function useDirectory(path: string[]) {
  return useMemo(() => resolvePath(path), [path]);
}
