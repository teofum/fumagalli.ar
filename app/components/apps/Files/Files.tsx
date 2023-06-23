import { useState } from 'react';
import root, { type FSObject } from '~/content/dir';
import useDirectory from './useDirectory';
import Button from '~/components/ui/Button';
import { useDesktop } from '~/components/desktop/Desktop/context';
import { preview } from '../Preview';

export default function Files() {
  const { launch } = useDesktop();

  const [path, setPath] = useState<string[]>([]);

  const pwd = `${root.name}/${path.join('/')}`;
  const dir = useDirectory(path);

  const open = (item: FSObject) => {
    if (item.class === 'dir') {
      setPath([...path, item.name]);
    } else if (item.type === 'md') {
      launch(preview(item));
    } else {
      console.log('open file', item.name);
    }
  };

  return (
    <div className="bg-default bevel-content p-1">
      <div>{pwd}</div>
      <ul>
        {path.length > 0 ? (
          <li>
            <Button
              className="px-2"
              onDoubleClick={() => setPath(path.slice(0, -1))}
            >
              ..
            </Button>
          </li>
        ) : null}
        {dir?.items.map((item) => (
          <li key={item.name}>
            <Button className="px-2" onDoubleClick={() => open(item)}>
              [{item.class}] {item.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
