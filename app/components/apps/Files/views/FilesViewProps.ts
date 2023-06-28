import type { Directory, FSObject } from '~/content/types';

export default interface FilesViewProps {
  dir: Directory;
  path: string;
  open: (item: FSObject, path?: string) => void;
  navigate: (to: string, absolute?: boolean) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}
