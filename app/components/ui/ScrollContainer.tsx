import React from 'react';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '@radix-ui/react-scroll-area';
import cn from 'classnames';

type ScrollContainerProps = {
  viewportProps?: React.ComponentProps<typeof ScrollAreaViewport>;
  hide?: 'x' | 'y';
} & React.ComponentProps<typeof ScrollArea>;

const ScrollContainer = React.forwardRef<HTMLDivElement, ScrollContainerProps>(
  function ScrollContainer(
    { children, className, type = 'always', viewportProps, hide, ...props },
    ref,
  ) {
    const setViewportSizeVars = (el: HTMLDivElement | null) => {
      if (!el) return;

      const { width, height } = el.getBoundingClientRect();

      el.style.setProperty('--scroll-viewport-width', `${width}px`);
      el.style.setProperty('--scroll-viewport-height', `${height}px`);
    };

    return (
      <ScrollArea
        type={type}
        className={cn(
          'overflow-hidden bg-default bevel-content-outside m-0.5',
          { 'pr-4': hide !== 'y', 'pb-4': hide !== 'x' },
          className,
        )}
        ref={ref}
        {...props}
      >
        <ScrollAreaViewport
          className="w-full h-full"
          {...viewportProps}
          ref={setViewportSizeVars}
        >
          {children}
        </ScrollAreaViewport>

        {hide === 'y' ? null : (
          <ScrollAreaScrollbar
            orientation="vertical"
            className="flex flex-row w-4 bg-surface bg-checkered select-none touch-none"
          >
            <ScrollAreaThumb className="relative flex-1 bg-surface bevel">
              <div
                className="
              absolute left-1 right-1 top-1/2 -translate-y-1/2
              flex flex-col gap-0.5
              pointer-events-none
            "
              >
                <div className="h-0.5 bevel-light-inset" />
                <div className="h-0.5 bevel-light-inset" />
                <div className="h-0.5 bevel-light-inset" />
              </div>
            </ScrollAreaThumb>
          </ScrollAreaScrollbar>
        )}

        {hide === 'x' ? null : (
          <ScrollAreaScrollbar
            orientation="horizontal"
            className="flex flex-col h-4 bg-surface bg-checkered select-none touch-none"
          >
            <ScrollAreaThumb className="relative flex-1 bg-surface bevel">
              <div
                className="
              absolute top-1 bottom-1 left-1/2 -translate-x-1/2
              flex flex-row gap-0.5
              pointer-events-none
            "
              >
                <div className="w-0.5 bevel-light-inset" />
                <div className="w-0.5 bevel-light-inset" />
                <div className="w-0.5 bevel-light-inset" />
              </div>
            </ScrollAreaThumb>
          </ScrollAreaScrollbar>
        )}

        <ScrollAreaCorner className="bg-surface bevel" />
      </ScrollArea>
    );
  },
);

export default ScrollContainer;
