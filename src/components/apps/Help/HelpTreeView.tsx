import { useEffect, useState } from 'react';
import cn from 'classnames';

import type { Folder, ItemStub } from '@/schemas/folder';
import type { AnyFile } from '@/schemas/file';

import ScrollContainer from '@/components/ui/ScrollContainer';
import TreeLess from '@/components/ui/icons/TreeLess';
import TreeMore from '@/components/ui/icons/TreeMore';
import useFolder from '../Files/utils/useFolder';

const HELP_ROOT = '2de4d52e-d1ca-4c9a-b9a4-7937e06c9bcf';

interface HelpItemProps {
  item: ItemStub;
  expanded?: boolean;
  open: () => void;
  className?: string;
}

function HelpListItem({
  item,
  expanded = false,
  open,
  className,
}: HelpItemProps) {
  const type =
    item._type !== 'folder'
      ? 'help_page'
      : expanded
        ? 'help_book_open'
        : 'help_book_closed';

  const iconUrl = `/fs/Applications/help/resources/${type}.png`;
  const name = item.name.split('.')[0];

  return (
    <button
      className={cn(
        'flex flex-row gap-0.5 py-px items-center cursor-default',
        'max-w-full group outline-hidden',
        className,
      )}
      onClick={() => open()}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter') open();
      }}
    >
      <span className="relative min-w-4">
        <img src={iconUrl} alt={type} />
        <span
          className="absolute inset-0 bg-selection/50 hidden group-focus:inline"
          style={{
            WebkitMaskImage: `url('${iconUrl}')`,
          }}
        />
      </span>
      <span
        className={cn(
          'px-0.5 whitespace-nowrap overflow-hidden text-ellipsis',
          'group-focus:bg-selection group-focus:text-selection',
          // { 'outline-dotted outline-current outline-1': path === openPath },
        )}
      >
        {name}
      </span>
    </button>
  );
}

interface BranchProps {
  item: Folder | ItemStub;
  root?: boolean;
  open: (path: string) => void;
}

function Branch({ item: itemProp, root = false, open }: BranchProps) {
  const [expanded, setExpanded] = useState(false);

  const [item, setItem] = useState(itemProp);

  const { load, dir } = useFolder();
  const toggleExpanded = () => {
    if (expanded || dir) {
      setExpanded(!expanded);
    } else {
      // Before expanding, fetch the folder's contents and replace the item
      load(item._id);
    }
  };

  useEffect(() => {
    if (dir) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItem(dir);
      setExpanded(true);
    }
  }, [dir]);

  const children = (item as Folder).items ?? [];

  return (
    <div className="relative group tree-branch">
      {!root ? (
        <div className="absolute left-1.75 -top-0.75 h-2.75 border-l border-dotted border-light tree-branch-decoration-top" />
      ) : null}
      {!root ? (
        <div className="absolute left-1.75 bottom-0 top-0.75 border-l border-dotted border-light tree-branch-decoration-bottom" />
      ) : null}
      <div className="flex flex-row items-start relative z-1">
        <button
          className="button bg-default p-px m-px mt-0.5"
          onClick={toggleExpanded}
        >
          {expanded ? <TreeLess /> : <TreeMore />}
        </button>

        <div className="mt-2 w-1.25 border-t border-dotted border-light -ml-px mr-px" />

        <div className="flex flex-col w-full">
          <HelpListItem
            item={item}
            expanded={expanded}
            open={toggleExpanded}
            className="relative z-1"
          />
          {expanded ? (
            <div className="">
              {children
                .filter((child) => child._type !== 'folder')
                .map((child) => (
                  <Leaf
                    key={child.name}
                    item={child as AnyFile}
                    open={() => open(child._id)}
                  />
                ))}
              {children
                .filter((child) => child._type === 'folder')
                .map((child) => (
                  <Branch key={child.name} item={child as Folder} open={open} />
                ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface LeafProps {
  item: AnyFile;
  root?: boolean;
  open: () => void;
}

function Leaf({ item, root = false, open }: LeafProps) {
  return (
    <div className="relative group tree-branch">
      {!root ? (
        <div className="absolute left-1.75 -top-0.75 h-2.75 border-l border-dotted border-light tree-branch-decoration-top" />
      ) : null}
      {!root ? (
        <div className="absolute left-1.75 bottom-0 top-0.75 border-l border-dotted border-light tree-branch-decoration-bottom" />
      ) : null}
      <div className="flex flex-row items-start relative z-1">
        {!root ? (
          <div className="mt-2.25 w-3.25 border-t border-dotted border-light ml-1.75 -mr-0.5" />
        ) : null}

        <HelpListItem item={item} open={open} className="relative z-1" />
      </div>
    </div>
  );
}

interface HelpTreeViewProps {
  setId: (id: string) => void;
}

export default function HelpTreeView({ setId }: HelpTreeViewProps) {
  const { load, dir: help } = useFolder();
  useEffect(() => {
    load(HELP_ROOT);
  }, [load]);

  if (!help) return null;
  return (
    <ScrollContainer className="flex-1">
      {help.items
        ?.filter((child) => child._type !== 'folder')
        .map((child) => (
          <Leaf
            key={child.name}
            item={child as AnyFile}
            open={() => setId(child._id)}
            root
          />
        ))}
      {help.items
        ?.filter((child) => child._type === 'folder')
        .map((child) => (
          <Branch key={child.name} item={child as Folder} open={setId} root />
        ))}
    </ScrollContainer>
  );
}
