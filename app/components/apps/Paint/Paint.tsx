import { useAppState, useWindow } from '~/components/desktop/Window/context';
import Menu from '~/components/ui/Menu';
import ScrollContainer from '~/components/ui/ScrollContainer';
import usePaintCanvas from './usePaintCanvas';
import getPaletteColors from '~/dither/utils/paletteColors';
import PaintColors from '~/dither/palettes/Paint';

const PAINT_COLORS = getPaletteColors(PaintColors);

export default function Paint() {
  const { close } = useWindow();

  const [state, setState] = useAppState('paint');
  const canvasProps = usePaintCanvas();

  const [fr, fg, fb] = state.fgColor;
  const [br, bg, bb] = state.bgColor;

  return (
    <div className="flex flex-col gap-0.5 min-w-0 select-none">
      <div className="flex flex-row gap-1">
        <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Root>
      </div>

      <div className="flex-1 flex flex-row gap-0.5 min-h-0">
        toolbar
        <ScrollContainer className="flex-1 bg-[#808080]">
          <canvas
            className="m-1 [image-rendering:pixelated] touch-none"
            style={{ width: 600, height: 400 }}
            {...canvasProps}
          />
        </ScrollContainer>
      </div>

      <div className="flex flex-row py-3">
        <button
          className="button bg-checkered bevel-content w-8 h-8 relative"
          onClick={() =>
            setState({ fgColor: state.bgColor, bgColor: state.fgColor })
          }
        >
          <div className="absolute bottom-1 right-1 bg-surface bevel-light p-0.5">
            <div
              className="w-3 h-3"
              style={{ backgroundColor: `rgb(${br} ${bg} ${bb})` }}
            />
          </div>
          <div className="absolute top-1 left-1 bg-surface bevel-light p-0.5">
            <div
              className="w-3 h-3"
              style={{ backgroundColor: `rgb(${fr} ${fg} ${fb})` }}
            />
          </div>
        </button>

        <div className="grid grid-rows-2 grid-flow-col">
          {PAINT_COLORS.map(([r, g, b]) => (
            <button
              className="button bevel-content w-4 h-4"
              style={{ backgroundColor: `rgb(${r} ${g} ${b})` }}
              key={`${r}-${g}-${b}`}
              onClick={() => setState({ fgColor: [r, g, b] })}
              onContextMenu={(ev) => {
                ev.preventDefault();
                setState({ bgColor: [r, g, b] });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
