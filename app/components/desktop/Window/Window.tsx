import { useRef } from 'react';
import useMoveWindow from './useMoveWindow';
import useResizeWindow from './useResizeWindow';

const defaultStyle = {
  top: 0,
  left: 0,
  width: 600,
  height: 400,
};

export default function Window() {
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

  return (
    <div
      ref={windowRef}
      className="
        touch-none fixed bg-white
        grid grid-cols-[0.25rem_1fr_0.25rem] grid-rows-[0.25rem_1fr_0.25rem]
      "
      style={defaultStyle}
    >
      <div className="col-start-2 row-start-2">
        <div
          className="w-full bg-blue-300 border-b border-black p-1 select-none"
          onPointerDown={moveHandler}
        >
          <span>Hi</span>
        </div>
      </div>

      {resizeHandles}
    </div>
  );
}
