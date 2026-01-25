import { useEffect, useMemo, useState } from "react";
import useGlRenderer from "@/dither/renderers/useGlRenderer";
import DemoImageBase from "../dither/DemoImageBase";
import {
  type Palette,
  PaletteGroup,
  PaletteType,
} from "@/dither/palettes/types";
import ColorPicker from "@/components/ui/ColorPicker";
import { getPaletteColor } from "@/dither/utils/paletteColors";

const shader = `
precision mediump float;

#define PALETTE_SIZE $ // $ is replaced in JS before compiling

uniform vec2 u_texSize;
uniform vec3 u_palette[PALETTE_SIZE];
uniform sampler2D u_threshold;
uniform float u_thres_size;

varying vec2 v_texCoord;

void main() {
  vec2 thresholdCoord = fract(v_texCoord * u_texSize / u_thres_size);
  float threshold = texture2D(u_threshold, thresholdCoord).x;

  vec3 color = vec3(0.0);
  int index = int(threshold * float(PALETTE_SIZE));
  if (threshold == 1.0) index = PALETTE_SIZE - 1;

  for (int i = 0; i < PALETTE_SIZE; i++) {
    if (i == index) color = u_palette[i];
  }

  gl_FragColor = vec4(color, 1.0);
}`;

const DemoOrdered = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const [paletteData, setPaletteData] = useState<number[]>(Array(48).fill(0));
  const customPalette: Palette = useMemo(
    () => ({
      name: "",
      type: PaletteType.Indexed,
      group: PaletteGroup.Other,
      data: paletteData,
    }),
    [paletteData],
  );

  const changeColor = (i: number, color: number[]) => {
    setPaletteData((data) => [
      ...data.slice(0, i * 3),
      ...color,
      ...data.slice((i + 1) * 3),
    ]);
  };

  const { render } = useGlRenderer(
    canvas,
    img,
    shader,
    customPalette,
    { threshold: "bayer4" },
    {},
  );
  useEffect(() => {
    if (canvas && img) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;
    }

    render();
  }, [render, canvas, img]);

  return (
    <DemoImageBase
      canvasRef={(el) => setCanvas(el)}
      imgRef={(el) => setImg(el)}
    >
      <div className="flex flex-row flex-wrap w-48">
        {Array(16)
          .fill(0)
          .map((_, i) => (
            <ColorPicker
              key={i}
              value={getPaletteColor(customPalette, i)}
              onValueCommit={(value) => changeColor(i, value)}
              className="w-24"
            />
          ))}
      </div>
    </DemoImageBase>
  );
};

export default DemoOrdered;
