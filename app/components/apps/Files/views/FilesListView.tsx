import { useLayoutEffect, useRef } from 'react';
import ScrollContainer from '~/components/ui/ScrollContainer';
import useResizeObserver from '../utils/useResizeObserver';
import FilesListItem from './FilesListItem';
import type FilesViewProps from './FilesViewProps';

export default function FilesListView({ dir, open, select }: FilesViewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
    <ScrollContainer className="flex-1" viewportProps={{ ref: viewportRef }}>
      <div
        className="p-1 select-none grid grid-flow-col auto-cols-max"
        ref={contentRef}
      >
        {dir.items.map((item) => (
          <FilesListItem
            key={item.name}
            item={item}
            open={open}
            select={select}
            className="mr-0.5 w-full"
          />
        ))}
      </div>
    </ScrollContainer>
  );
}
