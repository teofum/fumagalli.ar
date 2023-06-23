import { useState } from 'react';
import root, { type FSObject } from '~/content/dir';
import useDirectory from './useDirectory';
import Button from '~/components/ui/Button';
import { useDesktop } from '~/components/desktop/Desktop/context';
import { preview } from '../Preview';
import FilesListView from './views/FilesListView';

export default function Files() {
  const { launch } = useDesktop();

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

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">
        <Button
          variant="light"
          className="p-1"
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
        <FilesListView
          dir={dir}
          open={open}
          selected={selected}
          select={setSelected}
        />
      ) : null}

      <div className="flex flex-row gap-0.5">
        <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
          {dir?.items.length || 'No'} object{dir?.items.length === 1 ? '' : 's'}
        </div>

        <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1"></div>
      </div>
    </div>
  );
}
