import { useEffect, useMemo, useState } from 'react';

import type { FSObject } from '~/content/types';
import { getAppResourcesUrl } from '~/content/utils';

import Button from '~/components/ui/Button';
import Menu from '~/components/ui/Menu';
import { useWindow } from '~/components/desktop/Window/context';
import useFileHandler from '~/hooks/useFileHandler';
import useDesktopStore from '~/stores/desktop';
import useSystemStore, { useAppSettings } from '~/stores/system';

import type { FilesView } from './types';
import FilesGridView from './views/FilesGridView';
import FilesListView from './views/FilesListView';
import FilesDetailsView from './views/FilesDetailsView';
import getReadableSize from './utils/getReadableSize';
import useDirectory from './useDirectory';
import AddressBar from './AddressBar';
import Toolbar from '~/components/ui/Toolbar';
import FilesTreeView from './views/FilesTreeView';
import FS_ROOT from '~/content/dir';

const resources = getAppResourcesUrl('files');

function parsePath(path: string) {
  if (path.startsWith('/')) path = path.slice(1); // Remove leading slash
  return path.split('/').filter((segment) => segment !== '');
}

export interface FilesProps {
  initialView?: FilesView;
  initialPath?: string;
}

export default function Files({
  initialView = 'grid',
  initialPath = '/',
}: FilesProps) {
  const { id } = useWindow();
  const { setWindowProps, close } = useDesktopStore();
  const { dirHistory, saveDirToHistory } = useSystemStore();

  const [settings, set] = useAppSettings('files');
  const fileHandler = useFileHandler();

  /**
   * Navigation state
   */
  const [path, setPath] = useState<string[]>(parsePath(initialPath));
  const [selected, setSelected] = useState<FSObject | null>(null);

  const pwd = useMemo(() => `/${path.join('/')}`, [path]);
  const dir = useDirectory(path);

  /**
   * Set window title on dir change
   */
  useEffect(() => {
    if (dir) setWindowProps(id, { title: dir.name });
  }, [setWindowProps, dir, id]);

  /**
   * Add dir to history on path change, if not already in history
   */
  useEffect(() => {
    if (dir && dirHistory[0].path !== pwd) {
      saveDirToHistory({ time: Date.now(), item: dir, path: pwd });
      console.log('saved');
    }
    // Calling this effect on global state update causes a render loop if there
    // are multiple windows, and because we're dealing with global state there's
    // no risk of getting stale state, anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dir, pwd]);

  /**
   * File/directory open handler
   */
  const navigate = (to: string, absolute = false) => {
    setSelected(null);

    if (to === '..') setPath(path.slice(0, -1));
    else if (absolute) setPath(parsePath(to));
    else setPath([...path, to]);
  };

  const open = (item: FSObject, path = pwd) => {
    if (item.class === 'dir') {
      navigate(item.name);
    } else {
      if (!fileHandler.open(item, `${path}/${item.name}`))
        console.log('Unhandled file, possibly unknown type');
    }
  };

  let ViewComponent = FilesGridView;
  if (settings.view === 'list') ViewComponent = FilesListView;
  else if (settings.view === 'details') ViewComponent = FilesDetailsView;
  else if (settings.view === 'tree') ViewComponent = FilesTreeView;

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">
        <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Sub label="Recent">
            {dirHistory.map(({ time, item, path }) => (
              <Menu.Item
                key={`${time}_${item.name}`}
                label={item.name}
                icon="/fs/system/Resources/Icons/FileType/dir_16.png"
                onSelect={() => navigate(path, true)}
              />
            ))}
          </Menu.Sub>

          <Menu.Separator />

          <Menu.Item label="Close" onSelect={() => close(id)} />
        </Menu.Root>

        <Menu.Root trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.CheckboxItem
            label="Status Bar"
            checked={settings.statusBar}
            onCheckedChange={(checked) => set({ statusBar: checked })}
          />
          <Menu.CheckboxItem
            label="Side Bar"
            checked={settings.sideBar === 'tree'}
            onCheckedChange={(checked) =>
              set({ sideBar: checked ? 'tree' : 'none' })
            }
          />

          <Menu.Separator />

          <Menu.RadioGroup
            value={settings.view}
            onValueChange={(value) => set({ view: value as FilesView })}
          >
            <Menu.RadioItem value="grid" label="Icons" />
            <Menu.RadioItem value="list" label="List" />
            <Menu.RadioItem value="details" label="Details" />
            <Menu.RadioItem value="tree" label="Tree" />
          </Menu.RadioGroup>
        </Menu.Root>
      </div>

      <Toolbar>
        <Button
          variant="light"
          className="p-0.5 min-w-7"
          onClick={() => navigate('..')}
          disabled={path.length === 0}
        >
          <img src={`${resources}/go-up.png`} alt="" />
        </Button>

        <AddressBar path={path} navigate={navigate} />
      </Toolbar>

      <div className="flex-1 min-h-0 flex flex-row gap-0.5">
        {settings.sideBar ? (
          <div className="w-40 min-w-40 flex flex-col">
            <FilesTreeView
              dir={FS_ROOT}
              path="/"
              open={open}
              navigate={navigate}
              select={setSelected}
            />
          </div>
        ) : null}
        {dir ? (
          <div className="flex-1 min-w-0 flex flex-col">
            <ViewComponent
              dir={dir}
              path={pwd}
              open={open}
              navigate={navigate}
              select={setSelected}
            />
          </div>
        ) : null}
      </div>

      {settings.statusBar ? (
        <div className="flex flex-row gap-0.5">
          <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
            {dir?.items.length || 'No'} object
            {dir?.items.length === 1 ? '' : 's'}
          </div>

          <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
            {selected ? (
              <span>
                {selected.name}:{' '}
                {selected.class === 'file'
                  ? `File (${getReadableSize(selected.size)})`
                  : `Folder (${selected.items.length} objects)`}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
