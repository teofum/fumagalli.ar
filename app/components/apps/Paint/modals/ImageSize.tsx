import { useState } from 'react';
import { type WindowInit, WindowSizingMode } from '~/components/desktop/Window';
import { useParentState, useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Input from '~/components/ui/Input';

export default function PaintImageSize() {
  const { close } = useWindow();
  const [state, setState] = useParentState('paint');

  const [width, setWidth] = useState(state.canvasWidth);
  const [height, setHeight] = useState(state.canvasHeight);
  const commit = () => {
    setState({
      canvasWidth: width,
      canvasHeight: height,
    });
    close();
  };

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex flex-row items-center justify-end gap-2">
        <div className="w-12">Width</div>
        <Input
          className="w-20"
          numeric="integer"
          value={width}
          onChange={(ev) => setWidth(Number(ev.target.value))}
        />
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
        <div className="w-12">Height</div>
        <Input
          className="w-20"
          numeric="integer"
          value={height}
          onChange={(ev) => setHeight(Number(ev.target.value))}
        />
      </div>

      <div className="flex flex-row justify-end gap-1">
        <Button className="py-1 px-2 w-20" onClick={commit}>
          OK
        </Button>
        <Button className="py-1 px-2 w-20" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export const paint_imageSize: WindowInit<'paint_imageSize'> = {
  appType: 'paint_imageSize',
  appState: undefined,

  title: 'Canvas Size',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
