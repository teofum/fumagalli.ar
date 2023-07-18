import { useWindow } from '~/components/desktop/Window/context';
import Menu from '~/components/ui/Menu';
import { paint_imageSize } from '../modals/ImageSize';
import { usePaintState } from '../context';

export default function PaintImageMenu() {
  const { modal } = useWindow();
  const [state, setState] = usePaintState();

  return (
    <Menu.Root trigger={<Menu.Trigger>Image</Menu.Trigger>}>
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
    </Menu.Root>
  );
}
