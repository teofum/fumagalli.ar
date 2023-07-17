import { useAppState } from '~/components/desktop/Window/context';
import Divider from '~/components/ui/Divider';
import { ToggleButton, ToggleGroup } from '~/components/ui/ToggleGroup';
import { brushes } from '../brushes';
import BrushIcons from '../icons/Brush';
import { ZOOM_STOPS } from '../brushes/zoom';

const resources = '/fs/system/Applications/paint/resources';

export default function PaintToolbox() {
  const [state, setState] = useAppState('paint');

  const setBrush = (brush: keyof typeof brushes) => {
    setState({ brush, brushVariant: 0 });
  };

  return (
    <div className="flex flex-col gap-1">
      <Divider />
      <ToggleGroup
        type="single"
        value={state.brush}
        onValueChange={(value) => setBrush(value as any)}
        className="mx-1 w-12 flex-wrap"
      >
        {Object.keys(brushes).map((brush) => (
          <ToggleButton key={brush} className="w-6 h-6 !p-0.5" value={brush}>
            <img src={`${resources}/brush_${brush}.png`} alt={brush} />
          </ToggleButton>
        ))}
      </ToggleGroup>

      {state.brush === 'brush' ? (
        <div className="mx-1 bevel-light-inset self-center p-1">
          <ToggleGroup
            type="single"
            value={state.brushVariant.toString()}
            onValueChange={(value) => setState({ brushVariant: Number(value) })}
            className="w-10 flex-wrap gap-0.5"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((variant) => {
              const Icon = BrushIcons[variant];

              return (
                <ToggleButton
                  key={variant}
                  className="w-3 h-3 p-0 !shadow-none !bg-none data-[state=on]:bg-selection data-[state=on]:text-selection"
                  noInset
                  value={variant.toString()}
                >
                  <Icon />
                </ToggleButton>
              );
            })}
          </ToggleGroup>
        </div>
      ) : null}

      {state.brush === 'eraser' ? (
        <div className="mx-1 bevel-light-inset self-center p-1">
          <ToggleGroup
            type="single"
            orientation="vertical"
            value={state.brushVariant.toString()}
            onValueChange={(value) => setState({ brushVariant: Number(value) })}
            className="w-10 gap-0.5"
          >
            {[0, 1, 2, 3].map((variant) => (
              <ToggleButton
                key={variant}
                className="w-full h-3 p-0 flex flex-col items-center justify-center !shadow-none !bg-none data-[state=on]:bg-selection data-[state=on]:text-selection"
                noInset
                value={variant.toString()}
              >
                <div
                  className="bg-current"
                  style={{
                    width: `${4 + variant * 2}px`,
                    height: `${4 + variant * 2}px`,
                  }}
                />
              </ToggleButton>
            ))}
          </ToggleGroup>
        </div>
      ) : null}

      {state.brush === 'zoom' ? (
        <div className="mx-1 bevel-light-inset self-center p-1">
          <ToggleGroup
            type="single"
            orientation="vertical"
            value={state.brushVariant.toString()}
            onValueChange={(value) => setState({ brushVariant: Number(value) })}
            className="w-10 gap-0.5"
          >
            {ZOOM_STOPS.map((zoom, i) => (
              <ToggleButton
                key={zoom}
                className="w-full leading-3 text-center p-0 justify-center !shadow-none !bg-none data-[state=on]:bg-selection data-[state=on]:text-selection"
                noInset
                value={i.toString()}
              >
                {zoom}x
              </ToggleButton>
            ))}
          </ToggleGroup>
        </div>
      ) : null}

      {state.brush === 'line' ? (
        <div className="mx-1 bevel-light-inset self-center p-1">
          <ToggleGroup
            type="single"
            orientation="vertical"
            value={state.brushVariant.toString()}
            onValueChange={(value) => setState({ brushVariant: Number(value) })}
            className="w-10 gap-0.5"
          >
            {[0, 1, 2, 3, 4].map((variant) => (
              <ToggleButton
                key={variant}
                className="w-full h-3 leading-3 px-1 flex flex-row items-center !shadow-none !bg-none data-[state=on]:bg-selection data-[state=on]:text-selection"
                noInset
                value={variant.toString()}
              >
                <div
                  className="bg-current w-full"
                  style={{ height: `${variant + 1}px` }}
                />
              </ToggleButton>
            ))}
          </ToggleGroup>
        </div>
      ) : null}
      <Divider className="mt-auto" />
    </div>
  );
}
