'use client';

import { useEffect, useState } from 'react';
import useGlRenderer from '@/dither/renderers/useGlRenderer';
import { NULL_PALETTE } from '../dither/DemoImageBase';
import Slider from '@/components/ui/Slider';

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
  color = luma(color) < (t + 1.0 / (u_thres_size * u_thres_size * 2.0)) ? vec3(0.0) : vec3(1.0);
  gl_FragColor = vec4(color, 1.0);
}`;

const DemoOrdered = () => {
  const [gamma, setGamma] = useState(1);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const { render } = useGlRenderer(
    canvas,
    img,
    shader,
    NULL_PALETTE,
    { threshold: 'bayer8' },
    { u_gamma: gamma },
  );
  useEffect(() => {
    if (canvas && img) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;
    }

    render();
  }, [render, canvas, img]);

  return (
    <div className="demo">
      <div className="bevel-content p-0.5">
        <div>
          <img
            src="/fs/Documents/Articles/assets/dither2/gamma-gradient.svg"
            alt="Original"
            className="block w-80"
            ref={(el) => setImg(el)}
          />
          <canvas className="w-80" ref={(el) => setCanvas(el)} />
        </div>
      </div>

      <div className="demo-controls">
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
      </div>
    </div>
  );
};

export default DemoOrdered;
