import cn from 'classnames';

import ScrollContainer from '~/components/ui/ScrollContainer';
import Button from '~/components/ui/Button';
import type { Directory, FSObject } from '~/content/types';
import getReadableSize from '../utils/getReadableSize';
import getReadableFileType from '../utils/getReadableFileType';

function formatDate(seconds: number) {
  return new Date(seconds * 1000).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',

    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface FilesDetailsViewProps {
  dir: Directory;
  open: (item: FSObject) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}

interface DetailsItemProps {
  item: FSObject;
  open: (item: FSObject) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}

function DetailsItem({ item, open, select }: DetailsItemProps) {
  const type = item.class === 'file' ? item.type : item.class;

  let iconUrl = `/fs/system/Resources/Icons/FileType/${type}_16.png`;
  if (type === 'app') {
    const appName = item.name.split('.')[0];
    iconUrl = `/fs/system/Applications/${appName}/icon_16.png`;
  }

  return (
    <button
      className="flex flex-row gap-0.5 py-px items-center cursor-default max-w-full group outline-none"
      onDoubleClick={() => open(item)}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter') open(item);
      }}
      onFocus={() => select(item)}
      onBlur={() => select(null)}
    >
      <span className="relative min-w-4">
        <img src={iconUrl} alt={type} />
        <span
          className="absolute inset-0 bg-selection bg-opacity-50 hidden group-focus:inline"
          style={{
            WebkitMaskImage: `url(${iconUrl})`,
          }}
        />
      </span>
      <span
        className={cn(
          'px-0.5 whitespace-nowrap overflow-hidden text-ellipsis',
          'group-focus:bg-selection group-focus:text-selection',
        )}
      >
        {item.name}
      </span>
    </button>
  );
}

export default function FilesDetailsView({
  dir,
  open,
  select,
}: FilesDetailsViewProps) {
  return (
    <ScrollContainer className="flex-1">
      <table className="p-1 select-none min-w-full">
        <thead>
          <tr>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Name</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-right">
                <span>Size</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Type</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Created</span>
              </Button>
            </th>
            <th className="p-0">
              <Button className="w-full py-0 px-2 text-left">
                <span>Modified</span>
              </Button>
            </th>
            <th className="p-0">
              <div className="w-full h-4 bg-surface bevel" />
            </th>
          </tr>
        </thead>
        <tbody>
          {dir.items.map((item) => (
            <tr key={item.name}>
              <td className="min-w-32 w-32 max-w-32 py-0 px-0.5">
                <DetailsItem item={item} open={open} select={select} />
              </td>
              <td className="text-right py-0 px-1 min-w-16 w-16 max-w-16">
                {item.class === 'file' ? getReadableSize(item.size) : null}
              </td>
              <td className="py-0 px-1 min-w-32 w-32 max-w-32">
                {getReadableFileType(item)}
              </td>
              <td className="py-0 px-1 min-w-32 w-32 max-w-32">
                {formatDate(item.created)}
              </td>
              <td className="py-0 px-1 min-w-32 w-32 max-w-32">
                {formatDate(item.modified)}
              </td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollContainer>
  );
}
