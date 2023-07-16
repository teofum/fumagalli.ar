import { useCallback, useEffect, useRef, useState } from 'react';

import { useWindow } from '~/components/desktop/Window/context';
import Menu from '~/components/ui/Menu';
import ScrollContainer from '~/components/ui/ScrollContainer';
import type { PaintBrush, PaintEvent } from './types';
import { pencil } from './brushes/pencil';
import useDrag from '~/hooks/useDrag';

export default function Paint() {
  const { close } = useWindow();

  const [brush, setBrush] = useState<PaintBrush>(pencil);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = (el: HTMLCanvasElement | null) => {
    setCanvas(el);
  };
  useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
    }
  }, [canvas]);

  const onPointerDown = (ev: PointerEvent) => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const canvasRect = canvas.getBoundingClientRect();
      const x = ev.clientX - canvasRect.x;
      const y = ev.clientY - canvasRect.y;

      const fromX = lastPos.current.x;
      const fromY = lastPos.current.y;

      lastPos.current = { x, y };

      const event: PaintEvent = {
        pointerEvent: ev,
        canvas,
        ctx,

        x,
        y,
        fromX,
        fromY,

        fg: 'black',
        bg: 'white',
      };

      brush.onPointerDown(event);
    }
  };

  const onPointerMove = (ev: PointerEvent) => {
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const canvasRect = canvas.getBoundingClientRect();
      const x = ev.clientX - canvasRect.x;
      const y = ev.clientY - canvasRect.y;

      const fromX = lastPos.current.x;
      const fromY = lastPos.current.y;

      lastPos.current = { x, y };

      const event: PaintEvent = {
        pointerEvent: ev,
        canvas,
        ctx,

        x,
        y,
        fromX,
        fromY,

        fg: 'black',
        bg: 'white',
      };

      brush.onPointerMove(event);
    }
  };

  const test = useDrag({
    onDragStart: onPointerDown,
    onDragMove: onPointerMove,
  });

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">
        <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Root>
      </div>

      <div className="flex-1 flex flex-row gap-0.5 min-h-0">
        toolbar
        <ScrollContainer className="flex-1 bg-[#808080]">
          <canvas
            ref={canvasRef}
            className="m-1 [image-rendering:pixelated] touch-none"
            style={{ width: 600, height: 400 }}
            onPointerDown={test}
            // onContextMenu={(ev) => ev.preventDefault()}
          />
        </ScrollContainer>
      </div>

      <div className="flex">Colors</div>
    </div>
  );
}
