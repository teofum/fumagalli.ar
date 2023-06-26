import cn from 'classnames';
import { useLayoutEffect, useRef } from 'react';
import ScrollContainer from '~/components/ui/ScrollContainer';
import type { Directory, FSObject } from '~/content/types';
import useResizeObserver from '../utils/useResizeObserver';

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLUListElement>(null);

  const onViewportResize = () => {
    if (viewportRef.current && contentRef.current) {
      const vh = viewportRef.current.getBoundingClientRect().height;
      const count = Math.floor((vh - 8) / 18);
      contentRef.current.style.setProperty(
        'grid-template-rows',
        `repeat(${count}, 18px)`,
      );
    }
  };
  useResizeObserver(viewportRef.current, onViewportResize);
  useLayoutEffect(onViewportResize, []);

  return (
    <ScrollContainer
      className="flex-1"
      onClick={() => select(null)}
      viewportProps={{ ref: viewportRef }}
    >
      <ul
        className="p-1 select-none grid grid-flow-col auto-cols-max"
        ref={contentRef}
      >
        {dir.items.map((item) => {
          const isSelected = item.name === selected?.name;
          const type = item.class === 'file' ? item.type : item.class;

          let iconUrl = `/fs/system/Resources/Icons/FileType/${type}_16.png`;
          if (type === 'app') {
            const appName = item.name.split('.')[0];
            iconUrl = `/fs/system/Applications/${appName}/icon_16.png`;
          }

          return (
            <li key={item.name} className="min-w-max mr-0.5">
              <button
                className="flex flex-row gap-0.5 py-px items-center cursor-default w-full"
                onDoubleClick={() => open(item)}
                onClick={(ev) => {
                  select(item);
                  ev.stopPropagation();
                }}
              >
                <span className="relative">
                  <img src={iconUrl} alt={type} />
                  <span
                    className={cn(
                      'absolute inset-0 bg-selection bg-opacity-50',
                      { hidden: !isSelected },
                    )}
                    style={{
                      WebkitMaskImage: `url(${iconUrl})`,
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
