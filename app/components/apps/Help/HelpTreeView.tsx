import ScrollContainer from '~/components/ui/ScrollContainer';
import type { AnyFile, Directory, FSObject } from '~/content/types';
import { useState } from 'react';
import TreeLess from '~/components/ui/icons/TreeLess';
import TreeMore from '~/components/ui/icons/TreeMore';
import resolvePath from '~/utils/resolvePath';
import cn from 'classnames';
import { useAppState } from '~/components/desktop/Window/context';

const HELP_ROOT = resolvePath(['Applications', 'help', 'content']) as Directory;

interface HelpItemProps {
  item: FSObject;
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
    item.class === 'file'
      ? 'help_page'
      : expanded
      ? 'help_book_open'
      : 'help_book_closed';

  const iconUrl = `/fs/Applications/help/resources/${type}.png`;
  const name = item.name.split('.')[1];

  return (
    <button
      className={cn(
        'flex flex-row gap-0.5 py-px items-center cursor-default',
        'max-w-full group outline-none',
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
          className="absolute inset-0 bg-selection bg-opacity-50 hidden group-focus:inline"
          style={{
            WebkitMaskImage: `url(${iconUrl})`,
          }}
        />
      </span>
      <span
        className={cn(
          'px-0.5 whitespace-nowrap overflow-hidden text-ellipsis',
          'group-focus:bg-selection group-focus:text-selection',
        )}
      >
        {name}
      </span>
    </button>
  );
}

interface BranchProps {
  item: Directory;
  path: string;
  root?: boolean;
  open: (path: string) => void;
}

function Branch({ item, path, root = false, open }: BranchProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative group tree-branch">
      {!root ? (
        <div className="absolute left-[7px] -top-[3px] h-[11px] border-l border-dotted border-light tree-branch-decoration-top" />
      ) : null}
      {!root ? (
        <div className="absolute left-[7px] bottom-0 top-[3px] border-l border-dotted border-light tree-branch-decoration-bottom" />
      ) : null}
      <div className="flex flex-row items-start relative z-[1]">
        <button
          className="button bg-default p-px m-px mt-0.5"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <TreeLess /> : <TreeMore />}
        </button>

        <div className="mt-2 w-[5px] border-t border-dotted border-light -ml-px mr-px" />

        <div className="flex flex-col w-full">
          <HelpListItem
            item={item}
            expanded={expanded}
            open={() => setExpanded(!expanded)}
            className="relative z-[1]"
          />
          {expanded ? (
            <div className="">
              {item.items
                .filter((child) => child.class === 'file')
                .map((child) => (
                  <Leaf
                    key={child.name}
                    item={child as AnyFile}
                    open={() => open(`${path}/${child.name}`)}
                  />
                ))}
              {item.items
                .filter((child) => child.class === 'dir')
                .map((child) => (
                  <Branch
                    key={child.name}
                    item={child as Directory}
                    path={`${path}/${child.name}`}
                    open={open}
                  />
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
        <div className="absolute left-[7px] -top-[3px] h-[11px] border-l border-dotted border-light tree-branch-decoration-top" />
      ) : null}
      {!root ? (
        <div className="absolute left-[7px] bottom-0 top-[3px] border-l border-dotted border-light tree-branch-decoration-bottom" />
      ) : null}
      <div className="flex flex-row items-start relative z-[1]">
        {!root ? (
          <div className="mt-[9px] w-[13px] border-t border-dotted border-light ml-[7px] -mr-[2px]" />
        ) : null}

        <HelpListItem item={item} open={open} className="relative z-[1]" />
      </div>
    </div>
  );
}

export default function HelpTreeView() {
  const [, setState] = useAppState('help');

  const open = (path: string) => {
    setState({ path });
  };

  return (
    <ScrollContainer className="flex-1">
      {HELP_ROOT.items
        .filter((child) => child.class === 'file')
        .map((child) => (
          <Leaf
            key={child.name}
            item={child as AnyFile}
            open={() => open(`/${child.name}`)}
            root
          />
        ))}
      {HELP_ROOT.items
        .filter((child) => child.class === 'dir')
        .map((child) => (
          <Branch
            key={child.name}
            item={child as Directory}
            path={`/${child.name}`}
            open={open}
            root
          />
        ))}
    </ScrollContainer>
  );
}
