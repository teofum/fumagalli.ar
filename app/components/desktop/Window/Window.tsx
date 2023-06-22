import { useRef } from 'react';
import useMoveWindow from './useMoveWindow';
import useResizeWindow from './useResizeWindow';
import { useDesktop } from '../Desktop/context';
import cn from 'classnames';

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
        touch-none fixed bg-white
        grid grid-cols-[0.25rem_1fr_0.25rem] grid-rows-[0.25rem_1fr_0.25rem]
      "
      style={defaultStyle}
      onPointerDown={() => desktop.dispatch({ type: 'focus', id })}
    >
      <div className="col-start-2 row-start-2 grid grid-rows-[auto_1fr]">
        <div
          className={cn('select-none flex flex-row items-center', {
            'bg-blue-400': active,
            'bg-gray-400': !active,
          })}
          onPointerDown={moveHandler}
        >
          <span>Hi! I'm {id}</span>

          <button
            className="px-1 bg-red-500 text-white ml-auto"
            onClick={() => desktop.dispatch({ type: 'close', id })}
          >
            x
          </button>
        </div>
      </div>

      {resizeHandles}
    </div>
  );
}
