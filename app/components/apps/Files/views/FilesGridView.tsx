import cn from 'classnames';
import ScrollContainer from '~/components/ui/ScrollContainer';
import type { Directory, FSObject } from '~/content/dir';

interface FilesGridViewProps {
  dir: Directory;
  open: (item: FSObject) => void;
  selected: FSObject | null;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}

export default function FilesGridView({
  dir,
  open,
  selected,
  select,
}: FilesGridViewProps) {
  return (
    <ScrollContainer className="flex-1" onClick={() => select(null)}>
      <ul className="p-1 select-none grid grid-cols-[repeat(auto-fill,4rem)] gap-2">
        {dir.items.map((item) => {
          const isSelected = item.name === selected?.name;
          const type = item.class === 'file' ? item.type : item.class;

          return (
            <li key={item.name}>
              <button
                className="flex flex-col gap-1 w-16 items-center cursor-default"
                onDoubleClick={() => open(item)}
                onClick={(ev) => {
                  select(item);
                  ev.stopPropagation();
                }}
              >
                <span className="relative">
                  <img src={`/img/icon/fs/${type}_32.png`} alt={type} />
                  <span
                    className={cn(
                      'absolute inset-0 bg-selection bg-opacity-50',
                      { hidden: !isSelected },
                    )}
                    style={{
                      WebkitMaskImage: `url(/img/icon/fs/${type}_32.png)`,
                    }}
                  />
                </span>
                <div className="max-h-8 z-[1]">
                  <div
                    className={cn('px-0.5', {
                      'bg-selection text-selection': isSelected,
                      'line-clamp-2': !isSelected,
                    })}
                  >
                    {item.name}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </ScrollContainer>
  );
}