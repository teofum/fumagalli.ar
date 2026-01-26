import type { WindowInit } from "@/components/desktop/Window";
import { WindowSizingMode } from "@/components/desktop/Window/WindowSizingMode";
import { useAppState, useWindow } from "@/components/desktop/Window/context";
import Button from "@/components/ui/Button";
import GroupBox from "@/components/ui/GroupBox";
import Input from "@/components/ui/Input";

const resources = "/fs/Applications/paint/resources";

export interface PaintStretchAndSkewState {
  width: number;
  height: number;
  stretchMode: "percent" | "pixels";
  skewX: number;
  skewY: number;

  commit: (
    width: number,
    height: number,
    stretchMode: "percent" | "pixels",
    skewX: number,
    skewY: number,
  ) => void;
}

export const defaultPaintStretchAndSkewState: PaintStretchAndSkewState = {
  width: 100,
  height: 100,
  stretchMode: "percent",
  skewX: 0,
  skewY: 0,

  commit: () => {},
};

export default function PaintStretchAndSkew() {
  const { close } = useWindow();
  const [state, setState] = useAppState("paint_stretchAndSkew");

  const commit = () => {
    state.commit(
      state.width,
      state.height,
      state.stretchMode,
      state.skewX,
      state.skewY,
    );
    close();
  };

  return (
    <div className="flex flex-row items-start gap-3 p-3">
      <div className="flex flex-col gap-2">
        <GroupBox title="Stretch">
          <div className="flex flex-col p-1 gap-3">
            <div className="flex flex-row items-center gap-2">
              <img className="mr-3" src={`${resources}/stretch_h.png`} alt="" />
              <div className="w-20">Horizontal:</div>
              <Input
                className="w-12"
                numeric="integer"
                value={state.width}
                onChange={(ev) => setState({ width: Number(ev.target.value) })}
              />
              <div>%</div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <img className="mr-3" src={`${resources}/stretch_v.png`} alt="" />
              <div className="w-20">Vertical:</div>
              <Input
                className="w-12"
                numeric="integer"
                value={state.height}
                onChange={(ev) => setState({ height: Number(ev.target.value) })}
              />
              <div>%</div>
            </div>
          </div>
        </GroupBox>

        <GroupBox title="Skew">
          <div className="flex flex-col p-1 gap-3">
            <div className="flex flex-row items-center gap-2">
              <img className="mr-3" src={`${resources}/skew_h.png`} alt="" />
              <div className="w-20">Horizontal:</div>
              <Input
                className="w-12"
                numeric="integer"
                value={state.skewX}
                onChange={(ev) => setState({ skewX: Number(ev.target.value) })}
              />
              <div>Degrees</div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <img className="mr-3" src={`${resources}/skew_v.png`} alt="" />
              <div className="w-20">Vertical:</div>
              <Input
                className="w-12"
                numeric="integer"
                value={state.skewY}
                onChange={(ev) => setState({ skewY: Number(ev.target.value) })}
              />
              <div>Degrees</div>
            </div>
          </div>
        </GroupBox>
      </div>

      <div className="flex flex-col gap-1">
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

export const paint_stretchAndSkew = (
  initialState?: Partial<PaintStretchAndSkewState>,
): WindowInit<"paint_stretchAndSkew"> => ({
  appType: "paint_stretchAndSkew",
  appState: { ...defaultPaintStretchAndSkewState, ...initialState },

  title: "Stretch and Skew",

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
});
