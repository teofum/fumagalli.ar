import ScrollContainer from '~/components/ui/ScrollContainer';
import type { AnyFile, Directory, FSObject } from '~/content/types';
import { useLayoutEffect, useState } from 'react';
import TreeLess from '~/components/ui/icons/TreeLess';
import TreeMore from '~/components/ui/icons/TreeMore';
import resolvePath from '~/utils/resolvePath';
import cn from 'classnames';
import { useAppState } from '~/components/desktop/Window/context';

const HELP_ROOT = resolvePath(['Applications', 'help', 'content']) as Directory;

function parsePath(path: string) {
  if (path.startsWith('/')) path = path.slice(1); // Remove leading slash
  return path.split('/').filter((segment) => segment !== '');
}

interface HelpItemProps {
  item: FSObject;
  path: string;
  expanded?: boolean;
  open: () => void;
  className?: string;
  openPath?: string;
}

function HelpListItem({
  item,
  expanded = false,
  path,
  open,
  className,
  openPath,
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
            WebkitMaskImage: `url('${iconUrl}')`,
          }}
        />
      </span>
      <span
        className={cn(
          'px-0.5 whitespace-nowrap overflow-hidden text-ellipsis',
          'group-focus:bg-selection group-focus:text-selection',
          { 'outline-dotted outline-current outline-1': path === openPath }
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
  openPath?: string;
}

function Branch({ item, path, root = false, open, openPath }: BranchProps) {
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    if (!openPath) return;

    const segments = parsePath(path);
    const openSegments = parsePath(openPath);
    if (segments.every((segment, i) => segment === openSegments.at(i)))
      setExpanded(true);
  }, [path, openPath]);

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
            path={path}
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
                    path={`${path}/${child.name}`}
                    open={() => open(`${path}/${child.name}`)}
                    openPath={openPath}
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
                    openPath={openPath}
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
  path: string;
  root?: boolean;
  open: () => void;
  openPath?: string;
}

function Leaf({ item, path, root = false, open, openPath }: LeafProps) {
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

        <HelpListItem
          item={item}
          open={open}
          path={path}
          className="relative z-[1]"
          openPath={openPath}
        />
      </div>
    </div>
  );
}

interface HelpTreeViewProps {
  setPath: (path: string) => void;
}

export default function HelpTreeView({ setPath }: HelpTreeViewProps) {
  const [state] = useAppState('help');

  return (
    <ScrollContainer className="flex-1">
      {HELP_ROOT.items
        .filter((child) => child.class === 'file')
        .map((child) => (
          <Leaf
            key={child.name}
            item={child as AnyFile}
            path={`/${child.name}`}
            open={() => setPath(`/${child.name}`)}
            openPath={state.path}
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
            open={setPath}
            openPath={state.path}
            root
          />
        ))}
    </ScrollContainer>
  );
}
