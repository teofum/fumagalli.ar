import ScrollContainer from "@/components/ui/ScrollContainer";
import type { Folder, ItemStub } from "@/schemas/folder";
import FilesListItem from "./FilesListItem";
import { useEffect, useState } from "react";
import TreeLess from "@/components/ui/icons/TreeLess";
import TreeMore from "@/components/ui/icons/TreeMore";
import type FilesViewProps from "./FilesViewProps";
import filterByType from "../utils/filterByType";
import { useAppState } from "@/components/desktop/Window/context";
import useFolder from "../utils/useFolder";

interface BranchProps {
  item: Folder | ItemStub;
  root?: boolean;
  open: (item: ItemStub, path?: string) => void;
  navigate: (path: string, absolute?: boolean) => void;
  select: React.Dispatch<React.SetStateAction<ItemStub | null>>;
}

function Branch({
  item: itemProp,
  root = false,
  open,
  navigate,
  select,
}: BranchProps) {
  const [expanded, setExpanded] = useState(root);
  const [state] = useAppState("files");

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
      setItem(dir);
      setExpanded(true);
    }
  }, [dir]);

  const filteredItems = filterByType(
    (item as Folder).items ?? [],
    state.typeFilter,
  );

  return (
    <div className="relative group tree-branch">
      {!root ? (
        <div className="absolute left-[7px] -top-[3px] h-[11px] border-l border-dotted border-light tree-branch-decoration-top" />
      ) : null}
      {!root ? (
        <div className="absolute left-[7px] bottom-0 top-[3px] border-l border-dotted border-light tree-branch-decoration-bottom" />
      ) : null}
      <div className="flex flex-row items-start relative z-1">
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
            className="relative z-1"
          />
          {expanded ? (
            <div className="">
              {filteredItems.map((child) =>
                child._type === "folder" ? (
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
  item: ItemStub;
  root?: boolean;
  open: (item: ItemStub) => void;
  select: React.Dispatch<React.SetStateAction<ItemStub | null>>;
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
      <div className="flex flex-row items-start relative z-1">
        <div className="mt-[9px] w-[13px] border-t border-dotted border-light ml-[7px] -mr-[2px]" />

        <FilesListItem
          item={item}
          open={open}
          select={select}
          className="relative z-1"
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
