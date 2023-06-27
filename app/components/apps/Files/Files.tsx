import { useEffect, useState } from 'react';
import type { AnyFile, FSObject } from '~/content/types';
import useDirectory from './useDirectory';
import Button from '~/components/ui/Button';
import { preview } from '../Preview';
import FilesListView from './views/FilesListView';
import FilesGridView from './views/FilesGridView';
import Menu from '~/components/ui/Menu';
import { useWindow } from '~/components/desktop/Window/context';
import type { PreviewSupportedFile } from '../Preview/context';
import { previewSupportedFileTypes } from '../Preview/context';
import { getAppResourcesUrl } from '~/content/utils';
import { getApp } from '../renderApp';
import getReadableSize from './utils/getReadableSize';
import FilesDetailsView from './views/FilesDetailsView';
import useDesktopStore from '~/stores/desktop';

const resources = getAppResourcesUrl('files');

function parsePath(path: string) {
  if (path.startsWith('/')) path = path.slice(1); // Remove leading slash
  return path.split('/');
}

function isPreviewable(file: AnyFile): file is PreviewSupportedFile {
  return previewSupportedFileTypes.includes(file.type);
}

type FilesViewMode = 'list' | 'grid' | 'details';

export interface FilesProps {
  initialView?: FilesViewMode;
  initialPath?: string;
}

export default function Files({
  initialView = 'grid',
  initialPath = '/',
}: FilesProps) {
  const { launch, setWindowProps, close } = useDesktopStore();
  const { id } = useWindow();

  const [status, setStatus] = useState(true);
  const [view, setView] = useState<FilesViewMode>(initialView ?? 'grid');
  const [path, setPath] = useState<string[]>(parsePath(initialPath));
  const [selected, setSelected] = useState<FSObject | null>(null);

  const pwd = `/${path.join('/')}`;
  const dir = useDirectory(path);

  useEffect(() => {
    if (dir) setWindowProps(id, { title: dir.name });
  }, [setWindowProps, dir, id]);

  const open = (item: FSObject) => {
    if (item.class === 'dir') {
      setPath([...path, item.name]);
      setSelected(null);
    } else if (isPreviewable(item)) {
      launch(preview({ file: item, filePath: `${pwd}/${item.name}` }));
    } else if (item.type === 'app') {
      const app = getApp(item.name.split('.')[0]);
      if (app) launch(app);
    } else {
      // Unhandled file type
      console.log('open unknown file');
    }
  };

  let ViewComponent = FilesGridView;
  if (view === 'list') ViewComponent = FilesListView;
  else if (view === 'details') ViewComponent = FilesDetailsView;

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">
        <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Close" onSelect={() => close(id)} />
        </Menu.Root>

        <Menu.Root trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.CheckboxItem
            label="Status Bar"
            checked={status}
            onCheckedChange={setStatus}
          />

          <Menu.Separator />

          <Menu.RadioGroup
            value={view}
            onValueChange={(value) => setView(value as FilesViewMode)}
          >
            <Menu.RadioItem value="grid" label="Icons" />
            <Menu.RadioItem value="list" label="List" />
            <Menu.RadioItem value="details" label="Details" />
          </Menu.RadioGroup>
        </Menu.Root>
      </div>

      <div className="flex flex-row gap-1">
        <Button
          variant="light"
          className="p-0.5"
          onClick={() => setPath(path.slice(0, -1))}
          disabled={path.length === 0}
        >
          <img src={`${resources}/go-up.png`} alt="" />
        </Button>

        <div className="flex-1 bg-default bevel-inset p-1 flex flex-row items-center">
          <span>{pwd}</span>
        </div>
      </div>

      {dir ? (
        <ViewComponent
          dir={dir}
          open={open}
          selected={selected}
          select={setSelected}
        />
      ) : null}

      {status ? (
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
