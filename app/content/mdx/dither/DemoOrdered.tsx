import { useEffect, useState } from 'react';
import useGlRenderer from '~/dither/renderers/useGlRenderer';
import DemoImageBase, { NULL_PALETTE } from './DemoImageBase';
import { ToggleGroup, ToggleButton } from '~/components/ui/ToggleGroup';
import Switch from '~/components/ui/Switch';
import Slider from '~/components/ui/Slider';

const shader = `
precision mediump float;
uniform sampler2D u_image;
uniform sampler2D u_threshold;
uniform float u_thres_size;
uniform float u_gamma;
uniform vec2 u_texSize;
varying vec2 v_texCoord;

float luma(vec3 color) {
  return color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
}

vec3 gamma(vec3 color) {
  return vec3(
    pow(color.x, u_gamma),
    pow(color.y, u_gamma),
    pow(color.z, u_gamma)
  );
}

void main() {
  vec2 thresholdCoord = fract(v_texCoord * u_texSize / u_thres_size);
  vec3 color = texture2D(u_image, v_texCoord).xyz;
  color = gamma(color);

  float t = texture2D(u_threshold, thresholdCoord).x;
  color = luma(color) < t ? vec3(0.0) : vec3(1.0);
  gl_FragColor = vec4(color, 1.0);
}`;

interface DemoOrderedProps {
  type: 'bayer' | 'blueNoise' | 'halftone';
  sizes?: { name: string; value: string }[];
  initial?: string;
  gammaSlider?: boolean;
}

const DemoOrdered = ({
  type,
  sizes,
  initial,
  gammaSlider,
}: DemoOrderedProps) => {
  const [size, setSize] = useState(initial ?? '8');
  const [original, setOriginal] = useState(false);
  const [gamma, setGamma] = useState(2.2);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const { render } = useGlRenderer(
    canvas,
    img,
    shader,
    NULL_PALETTE,
    { threshold: `${type}${size}` as any },
    { u_gamma: gamma },
  );
  useEffect(() => {
    if (canvas && img) {
      canvas.width = img.offsetWidth / window.devicePixelRatio;
      canvas.height = img.offsetHeight / window.devicePixelRatio;
    }

    render();
  }, [render, canvas, img]);

  return (
    <DemoImageBase
      canvasRef={(el) => setCanvas(el)}
      imgRef={(el) => setImg(el)}
      hideCanvas={original}
    >
      {sizes && (
        <label className="demo-label">
          <span className="w-16">Map size</span>
          <ToggleGroup
            type="single"
            value={size}
            onValueChange={setSize}
            className="grow"
          >
            {sizes.map((size) => (
              <ToggleButton
                key={size.value}
                className="py-1 px-2 flex-1"
                value={size.value}
              >
                {size.name}
              </ToggleButton>
            ))}
          </ToggleGroup>
        </label>
      )}

      {gammaSlider && (
        <label className="demo-label">
          <span className="w-16">gamma={gamma.toFixed(2)}</span>
          <Slider
            min={1}
            max={4.5}
            step={0.05}
            value={gamma}
            onValueChange={setGamma}
          />
        </label>
      )}

      <label className="demo-label">
        <span className="mr-2">Show original</span>
        <Switch checked={original} onCheckedChange={setOriginal} />
      </label>
    </DemoImageBase>
  );
};

export default DemoOrdered;
