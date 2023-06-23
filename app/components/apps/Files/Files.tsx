import { useState } from 'react';
import root, { type FSObject } from '~/content/dir';
import useDirectory from './useDirectory';
import Button from '~/components/ui/Button';
import { useDesktop } from '~/components/desktop/Desktop/context';
import { preview } from '../Preview';
import FilesListView from './views/FilesListView';
import FilesGridView from './views/FilesGridView';
import Menu from '~/components/ui/Menu';
import { useWindow } from '~/components/desktop/Window/context';

type FilesViewMode = 'list' | 'grid';

export default function Files() {
  const { launch, dispatch } = useDesktop();
  const { id } = useWindow();

  const [status, setStatus] = useState(true);
  const [view, setView] = useState('grid');
  const [path, setPath] = useState<string[]>([]);
  const [selected, setSelected] = useState<FSObject | null>(null);

  const pwd = `${root.name}/${path.join('/')}`;
  const dir = useDirectory(path);

  const open = (item: FSObject) => {
    if (item.class === 'dir') {
      setPath([...path, item.name]);
      setSelected(null);
    } else if (item.type === 'md') {
      launch(preview(item));
    } else {
      console.log('open file', item.name);
    }
  };

  const close = () => {
    dispatch({ type: 'close', id });
  };

  const ViewComponent = view === 'grid' ? FilesGridView : FilesListView;

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">
        <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Close" onSelect={close} />
        </Menu.Root>

        <Menu.Root trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.CheckboxItem
            label="Status Bar"
            checked={status}
            onCheckedChange={setStatus}
          />

          <Menu.Separator />

          <Menu.RadioGroup value={view} onValueChange={setView}>
            <Menu.RadioItem value="grid" label="Icons" />
            <Menu.RadioItem value="list" label="List" />
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
          <img src="/img/ui/files-up.png" alt="" />
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

          <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1" />
        </div>
      ) : null}
    </div>
  );
}
