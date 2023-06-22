import { useRef } from 'react';
import useMoveWindow from './useMoveWindow';
import useResizeWindow from './useResizeWindow';
import { useDesktop } from '../Desktop/context';
import cn from 'classnames';
import Button from '~/components/ui/Button';

const defaultStyle = {
  top: 0,
  left: 0,
  width: 600,
  height: 400,
};

export interface WindowProps {
  id: string;
}

export default function Window({ id }: WindowProps) {
  const desktop = useDesktop();

  /**
   * Derived window props
   */
  const active = desktop.state.windows.at(-1)?.id === id;

  /**
   * Move/resize handling
   */
  const windowRef = useRef<HTMLDivElement>(null);

  const moveHandler = useMoveWindow(windowRef);
  const resizeHandlerNW = useResizeWindow(windowRef, 'nw');
  const resizeHandlerN = useResizeWindow(windowRef, 'n');
  const resizeHandlerNE = useResizeWindow(windowRef, 'ne');
  const resizeHandlerE = useResizeWindow(windowRef, 'e');
  const resizeHandlerSE = useResizeWindow(windowRef, 'se');
  const resizeHandlerS = useResizeWindow(windowRef, 's');
  const resizeHandlerSW = useResizeWindow(windowRef, 'sw');
  const resizeHandlerW = useResizeWindow(windowRef, 'w');

  const resizeHandles = [
    <div
      key="handle-nw"
      className="cursor-nwse-resize origin-top-left scale-[2]"
      onPointerDown={resizeHandlerNW}
    />,
    <div
      key="handle-n"
      className="cursor-ns-resize"
      onPointerDown={resizeHandlerN}
    />,
    <div
      key="handle-ne"
      className="cursor-nesw-resize origin-top-right scale-[2]"
      onPointerDown={resizeHandlerNE}
    />,
    <div
      key="handle-w"
      className="cursor-ew-resize"
      onPointerDown={resizeHandlerW}
    />,
    <div
      key="handle-e"
      className="cursor-ew-resize"
      onPointerDown={resizeHandlerE}
    />,
    <div
      key="handle-sw"
      className="cursor-nesw-resize origin-bottom-left scale-[2]"
      onPointerDown={resizeHandlerSW}
    />,
    <div
      key="handle-s"
      className="cursor-ns-resize"
      onPointerDown={resizeHandlerS}
    />,
    <div
      key="handle-se"
      className="cursor-nwse-resize origin-bottom-right scale-[2]"
      onPointerDown={resizeHandlerSE}
    />,
  ];

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
      style={defaultStyle}
      onPointerDown={() => desktop.dispatch({ type: 'focus', id })}
    >
      <div className="col-start-2 row-start-2 grid grid-rows-[auto_1fr]">
        <div
          className="select-none flex flex-row items-center gap-2 px-0.5 py-px mb-0.5"
          onPointerDown={moveHandler}
        >
          <div
            className={cn('flex-1 h-1.5 border-t border-b border-light', {
              'border-disabled drop-shadow-disabled': !active,
            })}
          />

          <span className={cn('bold', { 'text-disabled': !active })}>
            Window title
          </span>

          <div
            className={cn('flex-1 h-1.5 border-t border-b border-light', {
              'border-disabled drop-shadow-disabled': !active,
            })}
          />

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
