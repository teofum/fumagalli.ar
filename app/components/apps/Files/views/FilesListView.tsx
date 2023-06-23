import cn from 'classnames';
import ScrollContainer from '~/components/ui/ScrollContainer';
import type { Directory, FSObject } from '~/content/dir';

interface FilesListViewProps {
  dir: Directory;
  open: (item: FSObject) => void;
  selected: FSObject | null;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}

export default function FilesListView({
  dir,
  open,
  selected,
  select,
}: FilesListViewProps) {
  return (
    <ScrollContainer className="flex-1" onClick={() => select(null)}>
      <ul className="p-1 select-none">
        {dir.items.map((item) => {
          const isSelected = item.name === selected?.name;
          const type = item.class === 'file' ? item.type : item.class;

          return (
            <li key={item.name} className="w-full">
              <button
                className="flex flex-row gap-0.5 py-px items-center cursor-default w-full"
                onDoubleClick={() => open(item)}
                onClick={(ev) => {
                  select(item);
                  ev.stopPropagation();
                }}
              >
                <span className="relative">
                  <img src={`/img/icon/fs/${type}_16.png`} alt={type} />
                  <span
                    className={cn(
                      'absolute inset-0 bg-selection bg-opacity-50',
                      { hidden: !isSelected },
                    )}
                    style={{
                      WebkitMaskImage: `url(/img/icon/fs/${type}_16.png)`,
                    }}
                  />
                </span>
                <span
                  className={cn('px-0.5', {
                    'bg-selection text-selection': isSelected,
                  })}
                >
                  {item.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </ScrollContainer>
  );
}
