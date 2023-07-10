import { useLayoutEffect, useRef } from 'react';
import ScrollContainer from '~/components/ui/ScrollContainer';
import useResizeObserver from '../utils/useResizeObserver';
import FilesListItem from './FilesListItem';
import type FilesViewProps from './FilesViewProps';
import { useAppState } from '~/components/desktop/Window/context';
import filterByType from '../utils/filterByType';

export default function FilesListView({ dir, open, select }: FilesViewProps) {
  const [state] = useAppState('files');

  const contentRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const onViewportResize = () => {
    if (contentRef.current && viewportRef.current) {
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
    <ScrollContainer className="flex-1">
      <div className="h-[var(--scroll-viewport-height)]" ref={viewportRef}>
        <div
          className="p-1 select-none grid grid-flow-col auto-cols-max"
          ref={contentRef}
        >
          {filterByType(dir.items, state.typeFilter).map((item) => (
            <FilesListItem
              key={item.name}
              item={item}
              open={open}
              select={select}
              className="mr-0.5 w-full"
            />
          ))}
        </div>
      </div>
    </ScrollContainer>
  );
}
