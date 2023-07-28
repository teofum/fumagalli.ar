import cn from 'classnames';
import ScrollContainer from '~/components/ui/ScrollContainer';
import type FilesViewProps from './FilesViewProps';
import filterByType from '../utils/filterByType';
import { useAppState } from '~/components/desktop/Window/context';

export default function FilesGridView({ dir, open, select }: FilesViewProps) {
  const [state] = useAppState('files');

  return (
    <ScrollContainer className="flex-1">
      <div className="p-1 select-none grid grid-cols-[repeat(auto-fill,4rem)] gap-2">
        {filterByType(dir.items, state.typeFilter).map((item) => {
          const type = item.class === 'file' ? item.type : item.class;

          let iconUrl = `/fs/System Files/Icons/FileType/${type}_32.png`;
          if (type === 'app') {
            const appName = item.name.split('.')[0];
            iconUrl = `/fs/Applications/${appName}/icon_32.png`;
          }

          return (
            <button
              key={item.name}
              className="flex flex-col gap-1 w-16 items-center cursor-default group outline-none"
              onDoubleClick={() => open(item)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') open(item);
              }}
              onFocus={() => select(item)}
              onBlur={() => select(null)}
            >
              <span className="relative">
                <img width={32} height={32} src={iconUrl} alt={type} />
                <span
                  className={cn(
                    'absolute inset-0 bg-selection bg-opacity-50',
                    'hidden group-focus:inline',
                  )}
                  style={{
                    WebkitMaskImage: `url('${iconUrl}')`,
                  }}
                />
              </span>
              <div className="max-h-8 z-[1]">
                <div
                  className={cn(
                    'px-0.5 text-ellipsis',
                    'group-focus:bg-selection group-focus:text-selection',
                    'line-clamp-2 group-focus:line-clamp-none',
                  )}
                >
                  {item.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollContainer>
  );
}
