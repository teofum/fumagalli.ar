import { useEffect, useState } from "react";
import DemoImageBase, { NULL_PALETTE } from "./DemoImageBase";
import useGlRenderer from "@/dither/renderers/useGlRenderer";
import { ToggleButton, ToggleGroup } from "@/components/ui/ToggleGroup";
import Switch from "@/components/ui/Switch";

const shader = `
precision mediump float;
uniform sampler2D u_image;
uniform sampler2D u_threshold;
uniform float u_thres_size;
uniform float u_useThreshold;
uniform float u_tileSize;
uniform float u_gamma;
uniform vec2 u_texSize;
varying vec2 v_texCoord;

float luma(vec3 color) {
  return color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
}

vec3 gamma(vec3 color) {
  return vec3(
    pow(color.x, 2.2),
    pow(color.y, 2.2),
    pow(color.z, 2.2)
  );
}

void main() {
  vec2 thresholdCoord = fract(v_texCoord * u_texSize / u_thres_size);
  vec2 coord = floor(v_texCoord * u_texSize / u_tileSize) * u_tileSize / u_texSize;
  vec3 color = texture2D(u_image, coord).xyz;
  color = vec3(floor(color.x * 16.0 + 0.5) / 16.0);

  if (u_useThreshold > 0.0) {
    if (u_gamma > 0.0) color = gamma(color);
    float t = texture2D(u_threshold, thresholdCoord).x;
    color = luma(color) < (t + 1.0 / (u_thres_size * u_thres_size * 2.0)) ? vec3(0.0) : vec3(1.0);
  }
  gl_FragColor = vec4(color, 1.0);
}`;

interface DemoPatternImageProps {
  showSizeRadio?: boolean;
  gamma?: boolean;
}

export default function DemoPatternImage({
  showSizeRadio,
  gamma,
}: DemoPatternImageProps) {
  const [size, setSize] = useState("4");
  const [pattern, setPattern] = useState(false);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const { render } = useGlRenderer(
    canvas,
    img,
    shader,
    NULL_PALETTE,
    {},
    {
      u_tileSize: Number(size),
      u_useThreshold: pattern ? 1 : 0,
      u_gamma: gamma ? 1 : 0,
    },
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
      {showSizeRadio ? (
        <label className="demo-label">
          <span className="w-16">Tile size</span>
          <ToggleGroup
            type="single"
            value={size}
            onValueChange={setSize}
            className="grow"
          >
            <ToggleButton className="py-1 px-2 flex-1" value="4">
              4×4
            </ToggleButton>
            <ToggleButton className="py-1 px-2 flex-1" value="2">
              2×2
            </ToggleButton>
            <ToggleButton className="py-1 px-2 flex-1" value="1">
              1×1
            </ToggleButton>
          </ToggleGroup>
        </label>
      ) : null}

      <label className="demo-label">
        <span className="w-16">Use pattern</span>
        <Switch checked={pattern} onCheckedChange={setPattern} />
      </label>
    </DemoImageBase>
  );
}
