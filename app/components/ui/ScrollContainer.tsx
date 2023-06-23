import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '@radix-ui/react-scroll-area';
import cn from 'classnames';
import { useRef } from 'react';

type ScrollContainerProps = React.ComponentProps<typeof ScrollArea>;

export default function ScrollContainer({
  children,
  className,
  type = 'auto',
  ...props
}: ScrollContainerProps) {
  const verticalScrollbarRef = useRef<HTMLDivElement>(null);
  const horizontalScrollbarRef = useRef<HTMLDivElement>(null);

  const verticalVisible =
    verticalScrollbarRef.current?.dataset.state === 'visible';

  const horizontalVisible =
    horizontalScrollbarRef.current?.dataset.state === 'visible';

  return (
    <ScrollArea
      type={type}
      className={cn(
        'overflow-hidden bg-default bevel-content-outside m-0.5',
        {
          'pr-4': verticalVisible,
          'pb-4': horizontalVisible,
        },
        className,
      )}
      {...props}
    >
      <ScrollAreaViewport className="w-full h-full">
        {children}
      </ScrollAreaViewport>

      <ScrollAreaScrollbar
        ref={verticalScrollbarRef}
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

      <ScrollAreaScrollbar
        ref={horizontalScrollbarRef}
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

      <ScrollAreaCorner className="bg-surface bevel" />
    </ScrollArea>
  );
}
