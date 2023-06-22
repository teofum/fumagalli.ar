import { useRef } from 'react';
import useMoveWindow from './useMoveWindow';
import useResizeWindow from './useResizeWindow';
import { useDesktop } from '../Desktop/context';
import cn from 'classnames';
import Button from '~/components/ui/Button';

export enum WindowSizingMode {
  RESIZABLE = 'standard',
  FIXED = 'fixed',
  AUTO = 'auto',
  MIN_CONTENT = 'min-content',
  MAX_CONTENT = 'max-content',
}

export interface WindowProps {
  id: string;

  // Decoration
  title: string;
  icon?: string;

  // Size and position
  top: number;
  left: number;
  width: number;
  height: number;

  // Constraints
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;

  // Sizing mode
  sizingX: WindowSizingMode;
  sizingY: WindowSizingMode;
}

function getSizeValue(mode: WindowSizingMode, value: number) {
  if (mode === WindowSizingMode.AUTO) return 'auto';
  if (mode === WindowSizingMode.MIN_CONTENT) return 'min-content';
  if (mode === WindowSizingMode.MAX_CONTENT) return 'max-content';
  return `${value}px`;
}

function getWindowStyleProps({
  top,
  left,
  width,
  height,
  sizingX,
  sizingY,
}: WindowProps) {
  return {
    top: `${top}px`,
    left: `${left}px`,
    width: getSizeValue(sizingX, width),
    height: getSizeValue(sizingY, height),
  };
}

export default function Window(props: WindowProps) {
  const { id, title, icon = 'app', sizingX, sizingY } = props;
  const desktop = useDesktop();

  /**
   * Derived window props
   */
  const active = desktop.state.windows.at(-1)?.id === id;

  /**
   * Move/resize handling
   */
  const windowRef = useRef<HTMLDivElement>(null);

  const moveHandler = useMoveWindow(id, windowRef);
  const resizeHandlerNW = useResizeWindow(props, windowRef, 'nw');
  const resizeHandlerN = useResizeWindow(props, windowRef, 'n');
  const resizeHandlerNE = useResizeWindow(props, windowRef, 'ne');
  const resizeHandlerE = useResizeWindow(props, windowRef, 'e');
  const resizeHandlerSE = useResizeWindow(props, windowRef, 'se');
  const resizeHandlerS = useResizeWindow(props, windowRef, 's');
  const resizeHandlerSW = useResizeWindow(props, windowRef, 'sw');
  const resizeHandlerW = useResizeWindow(props, windowRef, 'w');

  const canResizeEW = sizingX === WindowSizingMode.RESIZABLE;
  const canResizeNS = sizingY === WindowSizingMode.RESIZABLE;
  const canResizeNSEW = canResizeEW && canResizeNS;

  const resizeHandles = [
    <div
      key="handle-nw"
      className={cn(
        'cursor-nwse-resize row-start-1 col-start-1',
        'origin-top-left scale-[2]',
        { hidden: !canResizeNSEW },
      )}
      onPointerDown={resizeHandlerNW}
    />,
    <div
      key="handle-n"
      className={cn('cursor-ns-resize row-start-1 col-start-2', {
        hidden: !canResizeNS,
      })}
      onPointerDown={resizeHandlerN}
    />,
    <div
      key="handle-ne"
      className={cn(
        'cursor-nesw-resize row-start-1 col-start-3',
        'origin-top-right scale-[2]',
        { hidden: !canResizeNSEW },
      )}
      onPointerDown={resizeHandlerNE}
    />,
    <div
      key="handle-w"
      className={cn('cursor-ew-resize row-start-2 col-start-1', {
        hidden: !canResizeEW,
      })}
      onPointerDown={resizeHandlerW}
    />,
    <div
      key="handle-e"
      className={cn('cursor-ew-resize row-start-2 col-start-3', {
        hidden: !canResizeEW,
      })}
      onPointerDown={resizeHandlerE}
    />,
    <div
      key="handle-sw"
      className={cn(
        'cursor-nesw-resize row-start-3 col-start-1',
        'origin-bottom-left scale-[2]',
        { hidden: !canResizeNSEW },
      )}
      onPointerDown={resizeHandlerSW}
    />,
    <div
      key="handle-s"
      className={cn('cursor-ns-resize row-start-3 col-start-2', {
        hidden: !canResizeNS,
      })}
      onPointerDown={resizeHandlerS}
    />,
    <div
      key="handle-se"
      className={cn(
        'cursor-nwse-resize row-start-3 col-start-3',
        'origin-bottom-right scale-[2]',
        { hidden: !canResizeNSEW },
      )}
      onPointerDown={resizeHandlerSE}
    />,
  ];

  const titlebarSpacerClass = cn(
    'flex-1 h-1.5 border-t border-b border-light',
    {
      'border-disabled drop-shadow-disabled': !active,
    },
  );

  /**
   * Component markup
   */
  return (
    <div
      ref={windowRef}
      className="
        touch-none fixed
        grid grid-cols-[0.25rem_1fr_0.25rem] grid-rows-[0.25rem_1fr_0.25rem]
        bg-surface bevel-window
      "
      style={getWindowStyleProps(props)}
      onPointerDown={() => desktop.dispatch({ type: 'focus', id })}
    >
      <div className="col-start-2 row-start-2 grid grid-rows-[auto_1fr]">
        <div
          className="select-none flex flex-row items-center gap-2 px-0.5 py-px mb-0.5"
          onPointerDown={moveHandler}
        >
          <img src={`/img/icon/${icon}_16.png`} alt="" />

          <div className={titlebarSpacerClass} />

          <span
            className={cn('font-title text-lg', {
              'text-disabled': !active,
            })}
          >
            {title}
          </span>

          <div className={titlebarSpacerClass} />

          <Button onClick={() => desktop.dispatch({ type: 'close', id })}>
            <img src="/img/ui/close.png" alt="Close" />
          </Button>
        </div>

        <div className="bg-default bevel-content">
          <div className="w-full h-full p-4">Hi! I'm window {id}</div>
        </div>
      </div>

      {resizeHandles}
    </div>
  );
}
