import { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// import { Command } from 'cmdk';
// import fuzzysort from 'fuzzysort';
// import cn from 'classnames';

import type { AnyFile, Directory, FSObject } from '~/content/types';
import Button from '~/components/ui/Button';
import ArrowDown from '~/components/ui/icons/ArrowDown';
// import useFileHandler from '~/hooks/useFileHandler';

// function parsePath(path: string) {
//   if (path.startsWith('/')) path = path.slice(1); // Remove leading slash
//   return path
//     .split('/')
//     .slice(0, -1)
//     .filter((segment) => segment !== '');
// }

// interface IconProps {
//   item: FSObject;
// }

// function Icon({ item }: IconProps) {
//   const type = item._type === 'folder' ? 'dir' : item._type;
//   let iconUrl = `/fs/System Files/Icons/FileType/${type}_16.png`;
//   if (type === 'app') {
//     const appName = item.name.split('.')[0];
//     iconUrl = `/fs/Applications/${appName}/icon_16.png`;
//   }

//   return (
//     <span className="relative">
//       <img src={iconUrl} alt={type} />
//       <span
//         className={cn(
//           'absolute inset-0 bg-selection bg-opacity-50',
//           'hidden group-aria-selected:inline',
//         )}
//         style={{
//           WebkitMaskImage: `url('${iconUrl}')`,
//         }}
//       />
//     </span>
//   );
// }

interface AddressBarProps {
  dir?: Directory;
  navigate: (to: string) => void;
}

export default function AddressBar({ dir, navigate }: AddressBarProps) {
  // const fileHandler = useFileHandler();

  const [open, setOpen] = useState(false);
  // const [search, setSearch] = useState(`/${path.join('/')}/`);

  /**
   * Reset path on navigation and close
   */
  // useEffect(() => setSearch(`/${path.join('/')}/`), [open, path]);

  /**
   * Search functions
   */
  // const searchPath = parsePath(search);

  // const refine = (name: string) => {
  //   setSearch(`/${[...searchPath, name].join('/')}/`);
  // };

  // const openFile = (file: AnyFile) => {
  //   fileHandler.open(file);
  //   setOpen(false);

  //   setSearch(`/${path.join('/')}/`); // Reset search
  // };

  // const onSelect = (item: FSObject) => {
  //   if (item.class === 'dir') refine(item.name);
  //   else openFile(item);
  // };

  // const onClick = (item: FSObject) => {
  //   if (item.class === 'dir') {
  //     const path = `/${[...searchPath, item.name].join('/')}`;
  //     navigate(path, true);
  //     setOpen(false);
  //   } else {
  //     openFile(item);
  //   }
  // };

  const path: Directory[] = [];
  if (dir?.parent) path.unshift(dir.parent);
  if (dir?.parent?.parent) path.unshift(dir.parent.parent);
  if (dir?.parent?.parent?.parent) path.unshift(dir.parent.parent.parent);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild onClick={() => setOpen(true)}>
        <div className="flex-1 m-0.5 bg-default bevel-inset flex flex-row min-w-0 p-0.5">
          <div className="py-0.5 px-1.5 flex flex-row items-center justify-end gap-0.5 whitespace-nowrap overflow-hidden">
            <button
              className="outline-none decoration-1 hover:underline focus-visible:underline"
              onPointerDown={(ev) => ev.preventDefault()}
              onClick={(ev) => {
                ev.stopPropagation();
                navigate('root');
              }}
            >
              My Computer
            </button>

            {path.length === 3 ? (
              <>
                <span>/</span>
                <span>...</span>
              </>
            ) : null}

            {path.slice(-2).map((item, i) => {
              return (
                <div key={item._id} className="flex flex-row gap-0.5">
                  <span>/</span>
                  <button
                    className="outline-none decoration-1 hover:underline focus-visible:underline"
                    onPointerDown={(ev) => ev.preventDefault()}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      navigate(item._id);
                    }}
                  >
                    {item.name}
                  </button>
                </div>
              );
            })}

            {dir?._id !== 'root' ? (
              <>
                <span>/</span>
                <span>{dir?.name}</span>
              </>
            ) : null}
          </div>

          <Button className="ml-auto">
            <ArrowDown />
          </Button>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          sideOffset={-24}
          className="
            bg-default z-1000
            w-[var(--radix-dropdown-menu-trigger-width)]
          "
        >
          {/* <Command
            className="w-full flex flex-col select-none"
            filter={(value, path) => {
              const search = path.split('/').at(-1);
              if (!search) return 1;

              return (fuzzysort.single(search, value)?.score ?? -9999) + 1000;
            }}
          >
            <div className="flex flex-row bevel-inset p-0.5">
              <Command.Input
                autoFocus
                value={search}
                onValueChange={setSearch}
                className="flex-1 outline-none py-0.5 px-1.5 bg-transparent"
              />

              <Button className="ml-auto" onClick={() => setOpen(false)}>
                <ArrowDown className="rotate-180" />
              </Button>
            </div>

            <Command.List className="border border-black">
              {dir?.items.map((item) => (
                <Command.Item
                  key={`/${searchPath.join('/')}/${item.name}`}
                  value={item.name}
                  className="group"
                  onSelect={() => onSelect(item)}
                >
                  <div
                    className="py-0.5 px-2 flex flex-row gap-1"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onClick(item);
                    }}
                  >
                    <Icon item={item} />
                    <span
                      className="
                        px-0.5
                        group-aria-selected:bg-selection
                        group-aria-selected:text-selection
                      "
                    >
                      {item.name}
                    </span>
                  </div>
                </Command.Item>
              ))}
            </Command.List>
          </Command> */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
