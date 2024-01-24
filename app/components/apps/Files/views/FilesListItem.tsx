import cn from 'classnames';
import getIconUrl from '../utils/getIconUrl';
import type { ItemStub } from '~/schemas/folder';

interface DetailsItemProps {
  item: ItemStub;
  open: (item: ItemStub) => void;
  select: React.Dispatch<React.SetStateAction<ItemStub | null>>;
  onClick?: (ev: React.MouseEvent) => void;
  className?: string;
}

export default function FilesListItem({
  item,
  open,
  select,
  onClick,
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
      onClick={onClick}
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
