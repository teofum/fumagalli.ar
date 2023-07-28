import cn from 'classnames';
import type { FSObject } from '~/content/types';
import getIconUrl from '../utils/getIconUrl';

interface DetailsItemProps {
  item: FSObject;
  open: (item: FSObject) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
  className?: string;
}

export default function FilesListItem({
  item,
  open,
  select,
  className,
}: DetailsItemProps) {
  const iconUrl = getIconUrl(item, 16);

  return (
    <button
      className={cn(
        'flex flex-row gap-0.5 py-px items-center cursor-default',
        'max-w-full group outline-none',
        className,
      )}
      onDoubleClick={() => open(item)}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter') open(item);
      }}
      onFocus={() => select(item)}
      onBlur={() => select(null)}
    >
      <span className="relative min-w-4">
        <img src={iconUrl} alt="" />
        <span
          className="absolute inset-0 bg-selection bg-opacity-50 hidden group-focus:inline"
          style={{
            WebkitMaskImage: `url('${iconUrl}')`,
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
