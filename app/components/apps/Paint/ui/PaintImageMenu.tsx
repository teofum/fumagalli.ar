import { useWindow } from '~/components/desktop/Window/context';
import Menu from '~/components/ui/Menu';
import { paint_imageSize } from '../modals/ImageSize';
import { usePaintContext } from '../context';
import { paint_stretchAndSkew } from '../modals/StretchAndSkew';

export default function PaintImageMenu() {
  const { modal } = useWindow();
  const { state, setState, invert, flip, rotate, stretchAndSkew } =
    usePaintContext();

  const clearImage = () => {
    const ctx = state.canvas?.getContext('2d');
    if (ctx) {
      const [br, bg, bb] = state.bgColor;
      ctx.fillStyle = `rgb(${br} ${bg} ${bb})`;
      ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
    }
  };

  return (
    <Menu.Menu trigger={<Menu.Trigger>Image</Menu.Trigger>}>
      <Menu.Sub label="Flip/Rotate">
        <Menu.Item
          label="Flip Horizontal"
          onSelect={() => flip('horizontal')}
        />
        <Menu.Item label="Flip Vertical" onSelect={() => flip('vertical')} />

        <Menu.Separator />

        <Menu.Item label="Rotate 90°" onSelect={() => rotate('cw')} />
        <Menu.Item label="Rotate 180°" onSelect={() => flip('both')} />
        <Menu.Item label="Rotate 270°" onSelect={() => rotate('ccw')} />
      </Menu.Sub>
      <Menu.Item
        label="Stretch/Skew..."
        onSelect={() =>
          modal(
            paint_stretchAndSkew({
              commit: (...args) => stretchAndSkew(...args),
            }),
          )
        }
      />
      <Menu.Item label="Invert Colors" onSelect={invert} />
      <Menu.Item
        label="Clear Image"
        onSelect={clearImage}
        disabled={state.selection !== null}
      />

      <Menu.Separator />

      <Menu.Item
        label="Canvas size..."
        onSelect={() =>
          modal(
            paint_imageSize({
              width: state.canvasWidth,
              height: state.canvasHeight,
              commit: (w, h) => setState({ canvasWidth: w, canvasHeight: h }),
            }),
          )
        }
      />
    </Menu.Menu>
  );
}
