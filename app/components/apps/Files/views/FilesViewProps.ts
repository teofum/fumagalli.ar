import type { Folder, FSObject } from '~/content/types';

export default interface FilesViewProps {
  dir: Folder;
  open: (item: FSObject, path?: string) => void;
  navigate: (to: string) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}
