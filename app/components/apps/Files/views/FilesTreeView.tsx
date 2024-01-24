import ScrollContainer from '~/components/ui/ScrollContainer';
import type { FSObject } from '~/content/types';
import type { Folder } from '~/schemas/folder';
import type { AnyFile } from '~/schemas/file';
import FilesListItem from './FilesListItem';
import { useEffect, useState } from 'react';
import TreeLess from '~/components/ui/icons/TreeLess';
import TreeMore from '~/components/ui/icons/TreeMore';
import type FilesViewProps from './FilesViewProps';
import filterByType from '../utils/filterByType';
import { useAppState } from '~/components/desktop/Window/context';
import { useFetcher } from '@remix-run/react';

interface BranchProps {
  item: Folder;
  root?: boolean;
  open: (item: FSObject, path?: string) => void;
  navigate: (path: string, absolute?: boolean) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}

function Branch({
  item: itemProp,
  root = false,
  open,
  navigate,
  select,
}: BranchProps) {
  const [expanded, setExpanded] = useState(root);
  const [state] = useAppState('files');

  const [item, setItem] = useState(itemProp);
  // useEffect(() => {
  //   if (expandedItem._id === item._id) return;
  //   setExpandedItem(item);
  // }, [item]);

  // useLayoutEffect(() => {
  //   if (!openId) return;

  //   const segments = parsePath(path);
  //   if (segments.every((segment, i) => segment === openPath.at(i)))
  //     setExpanded(true);
  // }, [path, openPath]);

  const { load, data } = useFetcher();
  const toggleExpanded = () => {
    if (expanded || data) {
      setExpanded(!expanded);
    } else {
      // Before expanding, fetch the folder's contents and replace the item
      load(`/api/filesystem?id=${item._id}`);
    }
  };

  useEffect(() => {
    if (data) {
      setItem(data);
      setExpanded(true);
    }
  }, [data]);

  const filteredItems = filterByType(item.items ?? [], state.typeFilter);

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
          onClick={toggleExpanded}
        >
          {expanded ? <TreeLess /> : <TreeMore />}
        </button>

        <div className="mt-2 w-[5px] border-t border-dotted border-light -ml-px mr-px" />

        <div className="flex flex-col w-full">
          <FilesListItem
            item={item}
            open={() => navigate(item._id)}
            select={select}
            className="relative z-[1]"
          />
          {expanded ? (
            <div className="">
              {filteredItems.map((child) =>
                child._type === 'folder' ? (
                  <Branch
                    key={child.name}
                    item={child}
                    open={open}
                    navigate={navigate}
                    select={select}
                  />
                ) : (
                  <Leaf
                    key={child.name}
                    item={child}
                    open={(item) => open(item)}
                    select={select}
                  />
                ),
              )}
              {filteredItems.length === 0 ? (
                <div className="text-disabled pl-5">[EMPTY]</div>
              ) : null}
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
  open,
  navigate,
  select,
}: FilesViewProps) {
  return (
    <ScrollContainer className="flex-1">
      <Branch
        key={dir._id}
        item={dir}
        open={open}
        navigate={navigate}
        select={select}
        root
      />
    </ScrollContainer>
  );
}
