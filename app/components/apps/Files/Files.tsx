import { useEffect, useMemo, useState } from 'react';

import type { FSObject } from '~/content/types';
import { getAppResourcesUrl } from '~/content/utils';

import Button from '~/components/ui/Button';
import Menu from '~/components/ui/Menu';
import { useAppState, useWindow } from '~/components/desktop/Window/context';
import useFileHandler from '~/hooks/useFileHandler';
import useSystemStore, { useAppSettings } from '~/stores/system';

import type { FilesView } from './types';
import FilesGridView from './views/FilesGridView';
import FilesListView from './views/FilesListView';
import FilesDetailsView from './views/FilesDetailsView';
import getReadableSize from './utils/getReadableSize';
import useDirectory from './useDirectory';
import AddressBar from './AddressBar';
import { Toolbar, ToolbarGroup } from '~/components/ui/Toolbar';
import FilesTreeView from './views/FilesTreeView';
import FS_ROOT from '~/content/dir';
import useDesktopStore from '~/stores/desktop';
import resolvePath from '~/utils/resolvePath';
import cn from 'classnames';

const resources = getAppResourcesUrl('files');

function parsePath(path: string) {
  if (path.startsWith('/')) path = path.slice(1); // Remove leading slash
  return path.split('/').filter((segment) => segment !== '');
}

export default function Files() {
  const { id, parentId, close } = useWindow();
  const { setTitle } = useDesktopStore();
  const { dirHistory, saveDirToHistory } = useSystemStore();

  const [state, setState] = useAppState('files');
  const [settings, set] = useAppSettings('files');
  const [selected, setSelected] = useState<FSObject | null>(null);

  const path = useMemo(() => parsePath(state.path), [state.path]);
  const setPath = (path: string[]) =>
    setState({ ...state, path: `/${path.join('/')}` });

  const pwd = useMemo(() => `/${path.join('/')}`, [path]);
  const dir = useDirectory(path);
  const fileHandler = useFileHandler();

  const isModal = state.modalCallback !== undefined;

  /**
   * Set window title on dir change
   */
  useEffect(() => {
    if (parentId) setTitle(id, 'Open File', parentId);
    else if (dir) setTitle(id, dir.name);
  }, [setTitle, id, parentId, dir]);

  /**
   * File/directory open handler
   */
  const navigate = (to: string, absolute = false) => {
    let nextPath = [];
    if (to === '..') nextPath = path.slice(0, -1);
    else if (absolute) nextPath = parsePath(to);
    else nextPath = [...path, to];

    const nextDir = resolvePath(nextPath);
    const nextPwd = `/${nextPath.join('/')}`;
    if (!nextDir) return;

    // Save next folder to recent
    if (dirHistory[0]?.path !== nextPwd) {
      saveDirToHistory({ time: Date.now(), item: nextDir, path: nextPwd });
    }

    // Navigate
    setSelected(null);
    setPath(nextPath);
  };

  const open = (item: FSObject, path = pwd) => {
    if (item.class === 'dir') {
      navigate(item.name);
    } else if (state.modalCallback) {
      // Modal file handling
      state.modalCallback(item, `${path}/${item.name}`);
      close();
    } else {
      // Regular file handling
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
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>File</Menu.Trigger>}>
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

          <Menu.Item label="Close" onSelect={close} />
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
          {!isModal ? (
            <Menu.CheckboxItem
              label="Status Bar"
              checked={settings.statusBar}
              onCheckedChange={(checked) => set({ statusBar: checked })}
            />
          ) : null}
          <Menu.CheckboxItem
            label="Side Bar"
            checked={settings.sideBar === 'tree'}
            onCheckedChange={(checked) =>
              set({ sideBar: checked ? 'tree' : 'none' })
            }
          />

          <Menu.Sub label="Toolbar">
            <Menu.RadioGroup
              value={settings.toolbar}
              onValueChange={(value) => set({ toolbar: value as any })}
            >
              <Menu.RadioItem value="stacked" label="Normal" />
              <Menu.RadioItem value="compact" label="Compact" />
            </Menu.RadioGroup>

            <Menu.Separator />

            <Menu.CheckboxItem
              label="Large Buttons"
              checked={settings.buttons === 'large'}
              onCheckedChange={(checked) =>
                set({ buttons: checked ? 'large' : 'icon' })
              }
            />
          </Menu.Sub>

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
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup
        className={cn({ 'flex flex-row': settings.toolbar === 'compact' })}
      >
        <Toolbar>
          <Button
            variant="light"
            className={cn('p-0.5 min-w-7', {
              'w-14': settings.buttons === 'large',
            })}
            onClick={() => navigate('..')}
            disabled={path.length === 0}
          >
            <img className="mx-auto" src={`${resources}/back.png`} alt="" />
            {settings.buttons === 'large' ? <span>Back</span> : null}
          </Button>

          <Button
            variant="light"
            className={cn('p-0.5 min-w-7', {
              'w-14': settings.buttons === 'large',
            })}
            onClick={() => navigate('..')}
            disabled={path.length === 0}
          >
            <img className="mx-auto" src={`${resources}/forward.png`} alt="" />
            {settings.buttons === 'large' ? <span>Forward</span> : null}
          </Button>

          <Button
            variant="light"
            className={cn('p-0.5 min-w-7', {
              'w-14': settings.buttons === 'large',
            })}
            onClick={() => navigate('..')}
            disabled={path.length === 0}
          >
            <img className="mx-auto" src={`${resources}/go-up.png`} alt="" />
            {settings.buttons === 'large' ? <span>Up</span> : null}
          </Button>
        </Toolbar>

        <Toolbar className="grow">
          <div className="mr-1 ml-1.5">Address</div>
          <AddressBar path={path} navigate={navigate} />
        </Toolbar>
      </ToolbarGroup>

      <div className="flex-1 min-h-0 flex flex-row gap-0.5">
        {settings.sideBar === 'tree' ? (
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

      {settings.statusBar && !isModal ? (
        <div className="flex flex-row gap-0.5">
          <div className="flex-1 bg-surface bevel-light-inset text-ellipsis whitespace-nowrap overflow-hidden py-0.5 px-1">
            {dir?.items.length || 'No'} object
            {dir?.items.length === 1 ? '' : 's'}
          </div>

          <div className="flex-1 bg-surface bevel-light-inset text-ellipsis whitespace-nowrap overflow-hidden py-0.5 px-1">
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

      {isModal ? (
        <div className="flex flex-row gap-1 p-2 items-center">
          <span className="mr-auto">
            {selected?.class === 'file' ? selected.name : 'No file selected'}
          </span>

          <Button
            className="py-1 px-2 w-20"
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => selected && open(selected)}
            disabled={selected?.class !== 'file'}
          >
            <span>Choose file</span>
          </Button>
          <Button className="py-1 px-2 w-20" onClick={close}>
            <span>Cancel</span>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
