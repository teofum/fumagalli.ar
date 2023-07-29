import { useEffect, useState } from 'react';
import DemoImageBase, { NULL_PALETTE } from './DemoImageBase';
import useGlRenderer from '~/dither/renderers/useGlRenderer';
import Slider from '~/components/ui/Slider';
import Switch from '~/components/ui/Switch';

const shader = `
precision mediump float;
uniform sampler2D u_image;
uniform float u_threshold_fixed;
varying vec2 v_texCoord;

float luma(vec3 color) {
  return color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
}

void main() {
  vec3 color = texture2D(u_image, v_texCoord).xyz;
  float t = u_threshold_fixed;
  color = luma(color) < t ? vec3(0.0) : vec3(1.0);
  gl_FragColor = vec4(color, 1.0);
}`;

export default function DemoThreshold() {
  const [t, setT] = useState(0.5);
  const [original, setOriginal] = useState(false);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const { render } = useGlRenderer(
    canvas,
    img,
    shader,
    NULL_PALETTE,
    {},
    { u_threshold_fixed: t },
  );
  useEffect(() => {
    if (canvas && img) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;
    }

    render();
  }, [render, canvas, img, t]);

  return (
    <DemoImageBase
      canvasRef={(el) => setCanvas(el)}
      imgRef={(el) => setImg(el)}
      hideCanvas={original}
    >
      <label className="demo-label">
        <span className="w-12">t={t.toFixed(2)}</span>
        <Slider min={0} max={1} step={0.01} value={t} onValueChange={setT} />
      </label>

      <label className="demo-label">
        <span className="mr-2">Show original</span>
        <Switch checked={original} onCheckedChange={setOriginal} />
      </label>
    </DemoImageBase>
  );
}
