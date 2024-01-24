import ScrollContainer from '~/components/ui/ScrollContainer';
import FilesListItem from './FilesListItem';
import type FilesViewProps from './FilesViewProps';
import { useAppState } from '~/components/desktop/Window/context';
import filterByType from '../utils/filterByType';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';
import type { Directory } from '~/content/types';

export default function FilesColumnsView({
  dir,
  open,
  navigate,
  select,
}: FilesViewProps) {
  const [state] = useAppState('files');
  const [stack, setStack] = useState<Directory[]>([]);

  const lastNavigation = useRef('');
  useEffect(() => {
    if (dir._id === lastNavigation.current) return;
    lastNavigation.current = dir._id;

    // First, check the stack...
    for (let i = 0; i < stack.length; i++) {
      const stackDir = stack[i];

      // Case 1: navigating back to a dir in the stack
      if (dir._id === stackDir._id) {
        // Simply "cut" the stack
        setStack(stack.slice(0, i + 1));
        return;
      }

      // Case 2: navigating to a child of a current dir
      if (dir.parent?._id === stackDir._id) {
        // Cut the stack and add the new dir on top
        setStack([...stack.slice(0, i + 1), dir]);
        return;
      }
    }

    console.log(stack.map(s => s._id), dir);

    // Case 3: no match, navigation to an entirely different dir tree
    // We'll treat the directory as the new root of the stack
    setStack([dir]);
  }, [dir, stack]);

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
    viewport.scrollTo({ left: maxScroll, behavior: 'instant' });
  };

  // Scroll to end on navigation
  useLayoutEffect(scrollToEnd, [dir]);

  return (
    <ScrollContainer className="flex-1" hide="y" ref={containerRef}>
      <div
        ref={contentRef}
        className="h-[var(--scroll-viewport-height)] flex flex-row justify-end"
      >
        {stack.map((dir, i) =>
          dir !== null ? (
            <Fragment key={dir?.name}>
              {i !== 0 ? <div className="w-1 bg-surface bevel" /> : null}
              <ScrollContainer
                className={cn('min-w-48 !shadow-none !m-0', {
                  grow: i === stack.length - 1,
                })}
                hide="x"
              >
                <div className="p-1 select-none">
                  {filterByType(dir.items ?? [], state.typeFilter).map(
                    (item) => {
                      const goto = () => navigate(item._id);

                      return (
                        <FilesListItem
                          key={item.name}
                          item={item}
                          open={item._type !== 'folder' ? open : goto}
                          onClick={item._type === 'folder' ? goto : undefined}
                          select={select}
                          className="mr-0.5 w-full"
                        />
                      );
                    },
                  )}
                </div>
              </ScrollContainer>
            </Fragment>
          ) : null,
        )}
      </div>
    </ScrollContainer>
  );
}
