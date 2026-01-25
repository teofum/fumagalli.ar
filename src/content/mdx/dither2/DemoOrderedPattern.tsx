'use client';

import { useEffect, useState } from 'react';
import useGlRenderer from '@/dither/renderers/useGlRenderer';
import DemoImageBase from '../dither/DemoImageBase';
import { ToggleGroup, ToggleButton } from '@/components/ui/ToggleGroup';
import Switch from '@/components/ui/Switch';
import Slider from '@/components/ui/Slider';
import NicePalette from '@/dither/palettes/NicePalette';
import { mapFns } from '@/components/apps/DitherLab/process';

const shader = `
precision mediump float;

#define PALETTE_SIZE $ // $ is replaced in JS before compiling
#define CLIST_SIZE % // Candidate list size, higher is better quality but slower

uniform vec3 u_palette[PALETTE_SIZE];
uniform vec2 u_texSize;
uniform float u_gamma;
uniform float u_useGamma;
uniform sampler2D u_image;
uniform sampler2D u_threshold;
uniform float u_thres_size;
uniform float u_err_mult;

varying vec2 v_texCoord;

vec3 gamma(vec3 color) {
  return vec3(
    pow(color.x, u_gamma),
    pow(color.y, u_gamma),
    pow(color.z, u_gamma)
  );
}

vec3 ungamma(vec3 color) {
  float ungamma = 1.0 / u_gamma;
  return vec3(
    pow(color.x, ungamma),
    pow(color.y, ungamma),
    pow(color.z, ungamma)
  );
}

float compare(vec3 c1, vec3 c2) {
  return length(c1 - c2);
}

float luma(vec3 color) {
  return color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
}

void main() {
  vec2 thresholdCoord = fract(v_texCoord * u_texSize / u_thres_size);
  float threshold = texture2D(u_threshold, thresholdCoord).x;

  vec3 color = texture2D(u_image, v_texCoord).xyz;
  if (u_useGamma > 0.0) color = gamma(color);

  vec3 error = vec3(0.0);
  vec3 clist[CLIST_SIZE];
  for (int i = 0; i < CLIST_SIZE; i++) {
    vec3 target = color + error * u_err_mult;
    vec3 candidate = vec3(0.0);
    float dMin = 999999999.0; // Absurdly large number

    for (int j = 0; j < PALETTE_SIZE; j++) {
      vec3 test = u_palette[j];
      if (u_useGamma > 0.0) test = gamma(test);
      float d = compare(target, test);
      if (d < dMin) {
        dMin = d;
        candidate = test;
      }
    }

    clist[i] = candidate;
    error += color - candidate;
  }

  for (int i = 1; i < CLIST_SIZE; i++) {
    for (int j = CLIST_SIZE; j > 0; j--) {
      if (j > i) continue;
      if (luma(clist[j-1]) <= luma(clist[j])) break;
      vec3 temp = clist[j-1];
      clist[j-1] = clist[j];
      clist[j] = temp;
    }
  }

  int index = int(threshold * float(CLIST_SIZE));
  if (threshold == 1.0) index = CLIST_SIZE - 1;

  for (int i = 0; i < CLIST_SIZE; i++) {
    if (i == index) color = clist[i];
  }

  if (u_useGamma > 0.0) color = ungamma(color);

  gl_FragColor = vec4(color, 1.0);
}`;

interface DemoOrderedProps {
  type: 'bayer' | 'blueNoise' | 'halftone';
  sizes?: { name: string; value: string }[];
  initial?: string;
  imageUrl?: string;
  gamma?: boolean;
  errorSlider?: boolean;
}

const DemoOrdered = ({
  type,
  sizes,
  initial,
  imageUrl,
  gamma = false,
  errorSlider = false,
}: DemoOrderedProps) => {
  const [size, setSize] = useState(initial ?? '8');
  const [original, setOriginal] = useState(false);
  const [errorCoeff, setErrorCoeff] = useState(5);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const { render } = useGlRenderer(
    canvas,
    img,
    shader,
    NicePalette,
    { threshold: `${type}${size}` as any },
    {
      u_gamma: 2.2,
      u_useGamma: gamma ? 1 : 0,
      u_err_mult: mapFns.dither(errorCoeff),
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
      hideCanvas={original}
      imageUrl={imageUrl}
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

      {errorSlider && (
        <label className="demo-label">
          <span className="w-16">
            ec={mapFns.dither(errorCoeff).toFixed(2)}
          </span>
          <Slider
            min={0}
            max={9}
            step={1}
            value={errorCoeff}
            onValueChange={setErrorCoeff}
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
