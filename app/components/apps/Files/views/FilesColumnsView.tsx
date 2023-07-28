import ScrollContainer from '~/components/ui/ScrollContainer';
import FilesListItem from './FilesListItem';
import type FilesViewProps from './FilesViewProps';
import { useAppState } from '~/components/desktop/Window/context';
import filterByType from '../utils/filterByType';
import parsePath from '../utils/parsePath';
import resolvePath from '~/utils/resolvePath';
import { Fragment, useLayoutEffect, useRef } from 'react';
import cn from 'classnames';

export default function FilesColumnsView({
  path,
  open,
  navigate,
  select,
}: FilesViewProps) {
  const [state] = useAppState('files');
  const segments = parsePath(path);
  const paths = [[], ...segments.map((_, i) => segments.slice(0, i + 1))];
  const dirs = paths.map(resolvePath);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollToEnd = () => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const viewport = container.querySelector(
      '[data-radix-scroll-area-viewport',
    ) as HTMLElement | null;
    if (!viewport) return;

    const maxScroll = content.offsetWidth - viewport.offsetWidth;
    console.log(maxScroll);
    viewport.scrollTo({ left: maxScroll, behavior: 'instant' });
  };

  // Scroll to end on navigation
  useLayoutEffect(scrollToEnd, [path]);

  return (
    <ScrollContainer className="flex-1" hide="y" ref={containerRef}>
      <div
        ref={contentRef}
        className="h-[var(--scroll-viewport-height)] flex flex-row justify-end"
      >
        {dirs.map((dir, i) =>
          dir !== null ? (
            <Fragment key={dir?.name}>
              {i !== 0 ? <div className="w-1 bg-surface bevel" /> : null}
              <ScrollContainer
                className={cn('min-w-48 !shadow-none !m-0', {
                  grow: i === dirs.length - 1,
                })}
                hide="x"
              >
                <div className="p-1 select-none">
                  {filterByType(dir.items, state.typeFilter).map((item) => {
                    const path = `/${segments.slice(0, i).join('/')}/`;
                    const goto = () =>
                      navigate(`${path}${item.name}`, true, true);

                    return (
                      <FilesListItem
                        key={item.name}
                        item={item}
                        open={item.class === 'file' ? open : goto}
                        onClick={item.class === 'dir' ? goto : undefined}
                        select={select}
                        className="mr-0.5 w-full"
                      />
                    );
                  })}
                </div>
              </ScrollContainer>
            </Fragment>
          ) : null,
        )}
      </div>
    </ScrollContainer>
  );
}
