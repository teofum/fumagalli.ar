import getPaletteColors from "@/dither/utils/paletteColors";
import PaintColors from "@/dither/palettes/Paint";

import { usePaintContext } from "../context";
import cn from "classnames";

const PAINT_COLORS = getPaletteColors(PaintColors);

export default function PaintColor() {
  const { state, setState, settings } = usePaintContext();

  const [fr, fg, fb] = state.fgColor;
  const [br, bg, bb] = state.bgColor;

  return (
    <div className={cn("flex flex-row py-3", { hidden: !settings.colorBox })}>
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
  );
}
