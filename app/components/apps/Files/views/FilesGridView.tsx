import cn from 'classnames';
import ScrollContainer from '~/components/ui/ScrollContainer';
import type { Directory, FSObject } from '~/content/types';

interface FilesGridViewProps {
  dir: Directory;
  open: (item: FSObject) => void;
  select: React.Dispatch<React.SetStateAction<FSObject | null>>;
}

export default function FilesGridView({
  dir,
  open,
  select,
}: FilesGridViewProps) {
  return (
    <ScrollContainer className="flex-1">
      <ul className="p-1 select-none grid grid-cols-[repeat(auto-fill,4rem)] gap-2">
        {dir.items.map((item) => {
          const type = item.class === 'file' ? item.type : item.class;

          let iconUrl = `/fs/system/Resources/Icons/FileType/${type}_32.png`;
          if (type === 'app') {
            const appName = item.name.split('.')[0];
            iconUrl = `/fs/system/Applications/${appName}/icon_32.png`;
          }

          return (
            <li key={item.name}>
              <button
                className="flex flex-col gap-1 w-16 items-center cursor-default group outline-none"
                onDoubleClick={() => open(item)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') open(item);
                }}
                onFocus={() => select(item)}
                onBlur={() => select(null)}
              >
                <span className="relative">
                  <img src={iconUrl} alt={type} />
                  <span
                    className={cn(
                      'absolute inset-0 bg-selection bg-opacity-50',
                      'hidden group-focus:inline',
                    )}
                    style={{
                      WebkitMaskImage: `url(${iconUrl})`,
                    }}
                  />
                </span>
                <div className="max-h-8 z-[1]">
                  <div
                    className={cn(
                      'px-0.5 [overflow-wrap:anywhere]',
                      'group-focus:bg-selection group-focus:text-selection',
                      'line-clamp-2 group-focus:line-clamp-none',
                    )}
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
