import ContextMenu from '@/components/ui/ContextMenu';
import { ComponentProps } from 'react';

type DitherLabContextMenuProps = Omit<
  ComponentProps<typeof ContextMenu.Root>,
  'content'
> & {
  save: () => void;
};

export default function DitherLabContextMenu({
  children,
  save,
  ...props
}: DitherLabContextMenuProps) {
  return (
    <ContextMenu.Root
      content={
        <>
          <ContextMenu.Item
            label="Save"
            icon="fs/System Files/UI/save2.png"
            onClick={save}
          />
        </>
      }
      {...props}
    >
      {children}
    </ContextMenu.Root>
  );
}
