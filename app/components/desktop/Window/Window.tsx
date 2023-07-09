import { memo, useRef } from 'react';
import useMoveWindow from './useMoveWindow';
import useResizeWindow from './useResizeWindow';
import cn from 'classnames';
import Button from '~/components/ui/Button';
import AppOutlet, { type AppState } from '~/components/apps/renderApp';
import { WindowProvider } from './context';
import useDesktopStore from '~/stores/desktop';
import Restore from '~/components/ui/icons/Restore';
import Max from '~/components/ui/icons/Max';
import Close from '~/components/ui/icons/Close';

export enum WindowSizingMode {
  RESIZABLE = 'standard',
  FIXED = 'fixed',
  AUTO = 'auto',
  MIN_CONTENT = 'min-content',
  MAX_CONTENT = 'max-content',
}

export interface WindowProps<AppType extends string> {
  id: string;
  appType: AppType;
  appState: AppState<AppType>;

  children: AnyWindowProps[];
  parentId?: string;

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

export type WindowInit<AppType extends string> = Omit<
  Partial<WindowProps<AppType>>,
  'id' | 'focused' | 'order' | 'parentId' | 'children'
> &
  Pick<WindowProps<AppType>, 'appType' | 'appState'>;

export type AnyWindowProps = WindowProps<string>;

function getSizeValue(mode: WindowSizingMode, value: number) {
  if (mode === WindowSizingMode.AUTO) return 'auto';
  if (mode === WindowSizingMode.MIN_CONTENT) return 'min-content';
  if (mode === WindowSizingMode.MAX_CONTENT) return 'max-content';
  return `${value}px`;
}

function getWindowStyleProps<AppType extends string>({
  top,
  left,
  width,
  height,
  sizingX,
  sizingY,
  maximized,
  order,
}: WindowProps<AppType>) {
  if (maximized)
    return {
      top: '0',
      left: '0',
      width: '100%',
      height: 'calc(100% - 30px)',
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

const MemoizedOutlet = memo(AppOutlet);

export default function Window<T extends string>(props: WindowProps<T>) {
  const { id, appType, title, maximized, parentId, children } = props;
  const { windows, focus, close, toggleMaximized } = useDesktopStore();

  const parent = windows.find((window) => window.id === parentId);
  const icon = parent ? parent.appType : appType;

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

  // Window will appear inactive if it has any modals
  const active = props.focused && props.children.length === 0;

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

  const titlebarSpacerClass = cn('flex-1 h-1.5 border-t border-b', {
    'border-light': active,
    'border-disabled drop-shadow-disabled': !active,
  });

  /**
   * Component markup
   */
  return (
    <div
      ref={windowRef}
      className="
        touch-none fixed
        grid grid-cols-[0.25rem_calc(100%-0.5rem)_0.25rem] grid-rows-[0.25rem_calc(100%-0.5rem)_0.25rem]
        bg-surface bevel-window
      "
      style={getWindowStyleProps(props)}
      onPointerDown={() => focus(id)}
      data-state={active ? 'active' : 'inactive'}
    >
      <div className="col-start-2 row-start-2 grid grid-rows-[1.125rem_calc(100%-1.125rem)]">
        <div
          className="select-none flex flex-row items-center gap-2 px-0.5 py-px mb-0.5"
          onPointerDown={maximized ? undefined : moveHandler}
          onDoubleClick={() => toggleMaximized(id, parentId)}
        >
          <img src={`/fs/system/Applications/${icon}/icon_16.png`} alt="" />

          <div className={titlebarSpacerClass} />

          <span
            className={cn('text-title bold', {
              'text-disabled': !active,
            })}
          >
            {title}
          </span>

          <div className={titlebarSpacerClass} />

          <div className="flex flex-row">
            {props.maximizable ? (
              <Button onClick={() => toggleMaximized(id, parentId)}>
                {maximized ? <Restore /> : <Max />}
              </Button>
            ) : null}
            <Button onClick={() => close(id, parentId)}>
              <Close />
            </Button>
          </div>
        </div>

        <WindowProvider window={props} parent={parent}>
          <MemoizedOutlet type={appType} />
        </WindowProvider>
      </div>

      {!maximized ? resizeHandles : null}

      {/* Block interaction with window if it has modals */}
      {children.length > 0 ? <div className="absolute inset-0" /> : null}

      {children.map((window) => (
        <Window key={window.id} {...window} />
      ))}
    </div>
  );
}
