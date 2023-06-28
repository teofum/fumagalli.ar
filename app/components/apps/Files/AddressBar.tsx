import { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Command } from 'cmdk';
import fuzzysort from 'fuzzysort';
import cn from 'classnames';

import type { AnyFile, FSObject } from '~/content/types';
import Button from '~/components/ui/Button';
import ArrowDown from '~/components/ui/icons/ArrowDown';
import useDirectory from './useDirectory';
import useFileHandler from '~/hooks/useFileHandler';

function parsePath(path: string) {
  if (path.startsWith('/')) path = path.slice(1); // Remove leading slash
  return path
    .split('/')
    .slice(0, -1)
    .filter((segment) => segment !== '');
}

interface IconProps {
  item: FSObject;
}

function Icon({ item }: IconProps) {
  const type = item.class === 'file' ? item.type : item.class;
  let iconUrl = `/fs/system/Resources/Icons/FileType/${type}_16.png`;
  if (type === 'app') {
    const appName = item.name.split('.')[0];
    iconUrl = `/fs/system/Applications/${appName}/icon_16.png`;
  }

  return (
    <span className="relative">
      <img src={iconUrl} alt={type} />
      <span
        className={cn(
          'absolute inset-0 bg-selection bg-opacity-50',
          'hidden group-aria-selected:inline',
        )}
        style={{
          WebkitMaskImage: `url(${iconUrl})`,
        }}
      />
    </span>
  );
}

interface AddressBarProps {
  path: string[];
  navigate: (path: string, absolute?: boolean) => void;
}

export default function AddressBar({ path, navigate }: AddressBarProps) {
  const fileHandler = useFileHandler();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(`/${path.join('/')}/`);

  /**
   * Reset path on navigation and close
   */
  useEffect(() => setSearch(`/${path.join('/')}/`), [open, path]);

  /**
   * Search functions
   */
  const searchPath = parsePath(search);
  const dir = useDirectory(searchPath);

  const refine = (name: string) => {
    setSearch(`/${[...searchPath, name].join('/')}/`);
  };

  const openFile = (file: AnyFile) => {
    const filePath = `/${[...searchPath, file.name].join('/')}`;
    fileHandler.open(file, filePath);
    setOpen(false);

    setSearch(`/${path.join('/')}/`); // Reset search
  };

  const onSelect = (item: FSObject) => {
    if (item.class === 'dir') refine(item.name);
    else openFile(item);
  };

  const onClick = (item: FSObject) => {
    if (item.class === 'dir') {
      const path = `/${[...searchPath, item.name].join('/')}`;
      navigate(path, true);
      setOpen(false);
    } else {
      openFile(item);
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild onClick={() => setOpen(true)}>
        <div className="flex-1 mr-0.5 bg-default bevel-inset flex flex-row min-w-0 p-0.5">
          <div className="py-0.5 px-1.5 flex flex-row items-center justify-end gap-0.5 whitespace-nowrap overflow-hidden">
            <button
              className="outline-none decoration-1 hover:underline focus-visible:underline"
              onPointerDown={(ev) => ev.preventDefault()}
              onClick={(ev) => {
                ev.stopPropagation();
                navigate('/', true);
              }}
            >
              My Computer
            </button>

            {path.slice(0, -1).map((name, i) => {
              const partialPath = path.slice(0, i + 1).join('/');

              return (
                <div key={`${partialPath}`} className="flex flex-row gap-0.5">
                  <span>/</span>
                  <button
                    className="outline-none decoration-1 hover:underline focus-visible:underline"
                    onPointerDown={(ev) => ev.preventDefault()}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      navigate(partialPath, true);
                    }}
                  >
                    {name}
                  </button>
                </div>
              );
            })}

            <span>/</span>
            <span>{path.at(-1)}</span>
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
          <Command
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
                className="flex-1 outline-none py-0.5 px-1.5"
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
          </Command>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
