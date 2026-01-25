import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import type { Folder, ItemStub } from '@/schemas/folder';
import { getAppResourcesUrl } from '@/content/utils';

import Button, { IconButton } from '@/components/ui/Button';
import Menu from '@/components/ui/Menu';
import { useAppState, useWindow } from '@/components/desktop/Window/context';
import { Toolbar, ToolbarGroup } from '@/components/ui/Toolbar';
import useFileHandler from '@/hooks/useFileHandler';
import { useAppSettings } from '@/hooks/use-app-settings';
import useSystemStore from '@/stores/system';
import useDesktopStore from '@/stores/desktop';

import type { FilesSettings, FilesView } from './types';
import useFolder from './utils/useFolder';
import FilesGridView from './views/FilesGridView';
import FilesListView from './views/FilesListView';
import FilesDetailsView from './views/FilesDetailsView';
import FilesTreeView from './views/FilesTreeView';
import FilesColumnsView from './views/FilesColumnsView';
import AddressBar from './AddressBar';
import useFetch from '@/hooks/use-fetch';

const MAX_HISTORY = 1000;
const resources = getAppResourcesUrl('files');

export default function Files() {
  const { id, parentId, close } = useWindow();
  const { setTitle } = useDesktopStore();
  const { dirHistory, saveDirToHistory } = useSystemStore();

  const [state, setState] = useAppState('files');
  const [settings, set] = useAppSettings('files');
  const [selected, setSelected] = useState<ItemStub | null>(null);

  const { load: loadRoot, data: rootDir } = useFetch<Folder>();
  const { load, dir } = useFolder();

  const fileHandler = useFileHandler();

  const isModal = state.modalCallback !== undefined;

  /**
   * Data fetching
   */
  useEffect(() => {
    load(state.folderId);
  }, [state.folderId, load]);

  useEffect(() => {
    loadRoot(`/api/filesystem?id=root`);
  }, [loadRoot]);

  /**
   * Set window title on dir change
   */
  useEffect(() => {
    if (parentId) setTitle(id, 'Open File', parentId);
    else if (dir) setTitle(id, dir.name);
  }, [setTitle, id, parentId, dir]);

  /**
   * Add visited folder to recents on dir change
   */
  const lastSavedId = useRef('');
  useEffect(() => {
    // Prevents crazy recents-adding loop when two windows are open to
    // different folders
    if (!dir || dir._id === lastSavedId.current) return;
    lastSavedId.current = dir._id;

    // Save next folder to recent
    if (dirHistory[0]?.item._id !== dir._id) {
      saveDirToHistory({ time: Date.now(), item: dir });
    }
  }, [dir, dirHistory, saveDirToHistory]);

  /**
   * History
   */
  const canGoBack = state.history.length > state.backCount + 1;
  const goBack = () => {
    const restored = state.history.at(state.backCount + 1);
    if (canGoBack && restored) {
      setState({ backCount: state.backCount + 1, folderId: restored });
    }
  };

  const canGoForward = state.backCount > 0;
  const goForward = () => {
    const restored = state.history.at(state.backCount - 1);
    if (canGoForward && restored) {
      setState({ backCount: state.backCount - 1, folderId: restored });
    }
  };

  /**
   * File/directory open handler
   */
  const navigate = (to: string) => {
    // Navigate
    const history = [
      to,
      ...state.history.slice(state.backCount), // Drop anything newer than the last undo
    ].slice(0, MAX_HISTORY); // Limit # of history items

    setState({ folderId: to, backCount: 0, history });
    setSelected(null);
  };

  const open = (item: ItemStub) => {
    if (item._type === 'folder') {
      navigate(item._id);
    } else if (state.modalCallback) {
      // Modal file handling
      state.modalCallback(item);
      close();
    } else {
      // Regular file handling
      if (!fileHandler.open(item))
        console.warn('Unhandled file, possibly unknown type');
    }
  };

  let ViewComponent = FilesGridView;
  if (settings.view === 'list') ViewComponent = FilesListView;
  else if (settings.view === 'details') ViewComponent = FilesDetailsView;
  else if (settings.view === 'tree') ViewComponent = FilesTreeView;
  else if (settings.view === 'columns') ViewComponent = FilesColumnsView;

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Sub label="Recent">
            {dirHistory.map(({ time, item }) => (
              <Menu.Item
                key={`${time}_${item.name}`}
                label={item.name}
                icon="/fs/System Files/Icons/FileType/dir_16.png"
                onSelect={() => navigate(item._id)}
              />
            ))}
          </Menu.Sub>

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={close} />
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
              onValueChange={(value) =>
                set({ toolbar: value as FilesSettings['toolbar'] })
              }
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
            <Menu.RadioItem value="columns" label="Columns" />
          </Menu.RadioGroup>
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>Go</Menu.Trigger>}>
          <Menu.Item label="Back" onSelect={goBack} disabled={!canGoBack} />
          <Menu.Item
            label="Forward"
            onSelect={goForward}
            disabled={!canGoForward}
          />
          <Menu.Item
            label="Up one level"
            onSelect={() => navigate(dir?.parent?._id ?? 'root')}
            disabled={!dir?.parent}
          />
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup
        className={cn({ 'flex flex-row': settings.toolbar === 'compact' })}
      >
        <Toolbar>
          <IconButton
            variant="light"
            onClick={goBack}
            disabled={!canGoBack}
            imageUrl={`${resources}/back.png`}
            label={settings.buttons === 'large' ? 'Back' : null}
          />

          <IconButton
            variant="light"
            onClick={goForward}
            disabled={!canGoForward}
            imageUrl={`${resources}/forward.png`}
            label={settings.buttons === 'large' ? 'Forward' : null}
          />

          <IconButton
            variant="light"
            onClick={() => navigate(dir?.parent?._id ?? 'root')}
            disabled={state.folderId === 'root'}
            imageUrl={`${resources}/go-up.png`}
            label={settings.buttons === 'large' ? 'Up' : null}
          />
        </Toolbar>

        <Toolbar className="grow">
          <div className="mr-1 ml-1.5">Address</div>
          <AddressBar dir={dir} navigate={navigate} />
        </Toolbar>
      </ToolbarGroup>

      <div className="flex-1 min-h-0 flex flex-row gap-0.5">
        {settings.sideBar === 'tree' ? (
          <div className="w-40 min-w-40 flex flex-col">
            {rootDir ? (
              <FilesTreeView
                dir={rootDir}
                open={open}
                navigate={navigate}
                select={setSelected}
              />
            ) : null}
          </div>
        ) : null}
        {dir ? (
          <div className="flex-1 min-w-0 flex flex-col">
            <ViewComponent
              dir={dir}
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
            {dir?.items?.length || 'No'} object
            {dir?.items?.length === 1 ? '' : 's'}
          </div>

          <div className="flex-1 bg-surface bevel-light-inset text-ellipsis whitespace-nowrap overflow-hidden py-0.5 px-1">
            {selected ? (
              <span>
                {selected.name}:{' '}
                {selected._type === 'folder' ? `Folder` : `File`}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {isModal ? (
        <div className="flex flex-row gap-1 p-2 items-center">
          <span className="mr-auto">
            {selected && selected._type !== 'folder'
              ? selected.name
              : 'No file selected'}
          </span>

          <Button
            className="py-1 px-2 w-20"
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => selected && open(selected)}
            disabled={!selected || selected._type === 'folder'}
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
