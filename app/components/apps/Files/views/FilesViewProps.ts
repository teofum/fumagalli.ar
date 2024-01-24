import type { Folder, ItemStub } from '~/schemas/folder';

export default interface FilesViewProps {
  dir: Folder;
  open: (item: ItemStub, path?: string) => void;
  navigate: (to: string) => void;
  select: React.Dispatch<React.SetStateAction<ItemStub | null>>;
}
