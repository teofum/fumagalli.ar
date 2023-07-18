import { type WindowInit, WindowSizingMode } from '~/components/desktop/Window';
import { useAppState, useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Input from '~/components/ui/Input';

export interface PaintImageSizeState {
  width: number;
  height: number;

  commit: (width: number, height: number) => void;
}

export const defaultPaintImageSizeState = {
  width: 8,
  height: 8,

  commit: () => {},
};

export default function PaintImageSize() {
  const { close } = useWindow();
  const [state, setState] = useAppState('paint_imageSize');

  const commit = () => {
    state.commit(state.width, state.height);
    close();
  };

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex flex-row items-center justify-end gap-2">
        <div className="w-12">Width</div>
        <Input
          className="w-20"
          numeric="integer"
          value={state.width}
          onChange={(ev) => setState({ width: Number(ev.target.value) })}
        />
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
        <div className="w-12">Height</div>
        <Input
          className="w-20"
          numeric="integer"
          value={state.height}
          onChange={(ev) => setState({ height: Number(ev.target.value) })}
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

export const paint_imageSize = (
  initialState?: PaintImageSizeState,
): WindowInit<'paint_imageSize'> => ({
  appType: 'paint_imageSize',
  appState: initialState ?? defaultPaintImageSizeState,

  title: 'Canvas Size',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
});
