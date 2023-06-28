import ScrollContainer from '~/components/ui/ScrollContainer';
import type { AnyFile, Directory, FSObject } from '~/content/types';
import FilesListItem from './FilesListItem';
import { useState } from 'react';
import TreeLess from '~/components/ui/icons/TreeLess';
import TreeMore from '~/components/ui/icons/TreeMore';
import type FilesViewProps from './FilesViewProps';

interface BranchProps {
  item: Directory;
  path: string;
  root?: boolean;
  open: (item: FSObject, path?: string) => void;
  navigate: (path: string, absolute?: boolean) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}

function Branch({
  item,
  path,
  root = false,
  open,
  navigate,
  select,
}: BranchProps) {
  const [expanded, setExpanded] = useState(root);

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
          <FilesListItem
            item={item}
            open={() => navigate(path, true)}
            select={select}
            className="relative z-[1]"
          />
          {expanded ? (
            <div className="">
              {item.items.map((child) =>
                child.class === 'dir' ? (
                  <Branch
                    key={child.name}
                    item={child}
                    path={`${path}/${child.name}`}
                    open={open}
                    navigate={navigate}
                    select={select}
                  />
                ) : (
                  <Leaf
                    key={child.name}
                    item={child}
                    open={(item) => open(item, path)}
                    select={select}
                  />
                ),
              )}
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
  open: (item: FSObject) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}

function Leaf({ item, root = false, open, select }: LeafProps) {
  return (
    <div className="relative group tree-branch">
      {!root ? (
        <div className="absolute left-[7px] -top-[3px] h-[11px] border-l border-dotted border-light tree-branch-decoration-top" />
      ) : null}
      {!root ? (
        <div className="absolute left-[7px] bottom-0 top-[3px] border-l border-dotted border-light tree-branch-decoration-bottom" />
      ) : null}
      <div className="flex flex-row items-start relative z-[1]">
        <div className="mt-[9px] w-[13px] border-t border-dotted border-light ml-[7px] -mr-[2px]" />

        <FilesListItem
          item={item}
          open={open}
          select={select}
          className="relative z-[1]"
        />
      </div>
    </div>
  );
}

export default function FilesTreeView({
  dir,
  path,
  open,
  navigate,
  select,
}: FilesViewProps) {
  return (
    <ScrollContainer className="flex-1">
      <Branch
        path={path}
        item={dir}
        open={open}
        navigate={navigate}
        select={select}
        root
      />
    </ScrollContainer>
  );
}
