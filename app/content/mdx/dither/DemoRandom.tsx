import { useEffect, useRef, useState } from 'react';
import DemoImageBase, { NULL_PALETTE } from './DemoImageBase';
import useGlRenderer from '~/dither/renderers/useGlRenderer';
import Slider from '~/components/ui/Slider';
import Switch from '~/components/ui/Switch';

const shader = `
precision mediump float;
uniform sampler2D u_image;
uniform float u_threshold_fixed;
uniform float u_amplitude;
varying vec2 v_texCoord;

float luma(vec3 color) {
  return color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
}

float rand(){
  return fract(sin(dot(v_texCoord, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 color = texture2D(u_image, v_texCoord).xyz;
  float noise = u_amplitude * (rand() - 0.5);
  float value = luma(color) + noise;
  color = value < u_threshold_fixed ? vec3(0.0) : vec3(1.0);
  gl_FragColor = vec4(color, 1.0);
}`;

export default function DemoThreshold() {
  const [k, setK] = useState(0.5);
  const [original, setOriginal] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { render } = useGlRenderer(
    canvasRef.current,
    imgRef.current,
    shader,
    NULL_PALETTE,
    {},
    { u_threshold_fixed: 0.5, u_amplitude: k },
  );
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (canvas && img) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;
    }

    render();
  }, [render, k])

  return (
    <DemoImageBase canvasRef={canvasRef} imgRef={imgRef} hideCanvas={original}>
      <label className="demo-label">
        <span className="w-12">k={k.toFixed(2)}</span>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={k}
          onValueChange={setK}
        />
      </label>

      <label className="demo-label">
        <span className="mr-2">Show original</span>
        <Switch
          checked={original}
          onCheckedChange={setOriginal}
        />
        <div className="toggle-slider" />
      </label>
    </DemoImageBase>
  );
};
