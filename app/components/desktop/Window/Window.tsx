import { useRef } from 'react';
import useMoveWindow from './useMoveWindow';
import useResizeWindow from './useResizeWindow';
import { useDesktop } from '../Desktop/context';
import cn from 'classnames';
import Button from '~/components/ui/Button';
import type { ApplicationType } from '~/components/apps/renderApp';
import AppOutlet from '~/components/apps/renderApp';
import { WindowProvider } from './context';

export enum WindowSizingMode {
  RESIZABLE = 'standard',
  FIXED = 'fixed',
  AUTO = 'auto',
  MIN_CONTENT = 'min-content',
  MAX_CONTENT = 'max-content',
}

export interface WindowProps {
  id: string;
  appType: ApplicationType;

  // Decoration
  title: string;
  icon: string;

  // Size and position
  top: number;
  left: number;
  width: number;
  height: number;

  // State
  maximized: boolean;
  focused: boolean;
  order: number;

  // Constraints
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;

  // Sizing mode
  sizingX: WindowSizingMode;
  sizingY: WindowSizingMode;

  // Features
  maximizable: boolean;
}

export type WindowInit = Omit<
  Partial<WindowProps>,
  'id' | 'focused' | 'order' | 'appType'
> &
  Pick<WindowProps, 'appType'>;

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
  maximized,
  order,
}: WindowProps) {
  if (maximized)
    return {
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: order,
    };

  return {
    top: `${top}px`,
    left: `${left}px`,
    width: getSizeValue(sizingX, width),
    height: getSizeValue(sizingY, height),
    zIndex: order,
  };
}

export default function Window(props: WindowProps) {
  const { id, appType, title, icon, maximized, focused } = props;
  const desktop = useDesktop();

  /**
   * Move/resize handling
   */
  const windowRef = useRef<HTMLDivElement>(null);

  const moveHandler = useMoveWindow(props, windowRef);
  const resizeHandlerNW = useResizeWindow(props, windowRef, 'nw');
  const resizeHandlerN = useResizeWindow(props, windowRef, 'n');
  const resizeHandlerNE = useResizeWindow(props, windowRef, 'ne');
  const resizeHandlerE = useResizeWindow(props, windowRef, 'e');
  const resizeHandlerSE = useResizeWindow(props, windowRef, 'se');
  const resizeHandlerS = useResizeWindow(props, windowRef, 's');
  const resizeHandlerSW = useResizeWindow(props, windowRef, 'sw');
  const resizeHandlerW = useResizeWindow(props, windowRef, 'w');

  const canResizeEW = props.sizingX === WindowSizingMode.RESIZABLE;
  const canResizeNS = props.sizingY === WindowSizingMode.RESIZABLE;
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
      'border-disabled drop-shadow-disabled': !focused,
    },
  );

  /**
   * Helper functions
   */
  const toggleMaximized = () => {
    if (!props.maximizable) return;
    desktop.dispatch({ type: 'toggleMaximized', id });
  };

  const close = () => {
    desktop.dispatch({ type: 'close', id });
  };

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
          onPointerDown={maximized ? undefined : moveHandler}
          onDoubleClick={toggleMaximized}
        >
          <img src={`/img/icon/${icon}_16.png`} alt="" />

          {/* <div className={titlebarSpacerClass} /> */}

          <span
            className={cn('font-title bold', {
              'text-disabled': !focused,
            })}
          >
            {title}
          </span>

          <div className={titlebarSpacerClass} />

          <div className="flex flex-row">
            {props.maximizable ? (
              <Button onClick={toggleMaximized}>
                {maximized ? (
                  <img src="/img/ui/restore.png" alt="Restore" />
                ) : (
                  <img src="/img/ui/max.png" alt="Maximize" />
                )}
              </Button>
            ) : null}
            <Button onClick={close}>
              <img src="/img/ui/close.png" alt="Close" />
            </Button>
          </div>
        </div>

        <WindowProvider value={props}>
          <AppOutlet type={appType} />
        </WindowProvider>
      </div>

      {!maximized ? resizeHandles : null}
    </div>
  );
}
