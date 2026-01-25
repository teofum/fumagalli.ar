'use client';

import { useEffect, useState } from 'react';
import useGlRenderer from '@/dither/renderers/useGlRenderer';
import DemoImageBase from '../dither/DemoImageBase';
import { ToggleGroup, ToggleButton } from '@/components/ui/ToggleGroup';
import Switch from '@/components/ui/Switch';
import Slider from '@/components/ui/Slider';
import NicePalette from '@/dither/palettes/NicePalette';

const shader = `
precision mediump float;

#define PALETTE_SIZE $ // $ is replaced in JS before compiling

uniform vec3 u_palette[PALETTE_SIZE];
uniform vec2 u_texSize;
uniform float u_gamma;
uniform sampler2D u_image;
uniform sampler2D u_threshold;
uniform float u_thres_size;
uniform float u_variance;
uniform float u_enableMixPenalty;
uniform float u_enableRMH;

varying vec2 v_texCoord;

struct ColorMix {
  vec3 color1;
  vec3 color2;
  float ratio;
};

float mixError(vec3 target, vec3 cmix, float compDist, float rmh) {
  return length(target - cmix)
    + compDist * (abs(rmh) + 0.5) * float(PALETTE_SIZE) / (10.0 * pow(2.0, u_variance));
}

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

void main() {
  vec2 thresholdCoord = fract(v_texCoord * u_texSize / u_thres_size);
  float threshold = texture2D(u_threshold, thresholdCoord).x;

  vec3 color = texture2D(u_image, v_texCoord).xyz;

  vec3 cmix = vec3(0.0);
  vec3 c1 = vec3(0.0);
  vec3 c2 = vec3(0.0);
  vec3 g1 = vec3(0.0);
  vec3 g2 = vec3(0.0);
  ColorMix bestMix = ColorMix(vec3(0.0), vec3(0.0), 0.33);
  float minError = 999999999.0; // absurdly large number

  for(int i1 = 0; i1 < PALETTE_SIZE; i1++) {
    for(int i2 = 0; i2 < PALETTE_SIZE; i2++) {
      if(i2 < i1)
        continue;

      c1 = u_palette[i1];
      c2 = u_palette[i2];

      g1 = gamma(c1);
      g2 = gamma(c2);

      for(int ratio = 0; ratio < 64; ratio++) {
        if(i1 == i2 && ratio > 0)
          break;
        float r64 = float(ratio) / 64.0;
        cmix = g1 + r64 * (g2 - g1);

        float cdist = length(c2 - c1) * u_enableMixPenalty;
        float rmh = u_enableRMH == 1.0 ? r64 - 0.5 : 0.5;
        float error = mixError(color, ungamma(cmix), cdist, rmh);
        if(error < minError) {
          minError = error;
          bestMix = ColorMix(c1, c2, r64);
        }
      }
    }
  }

  color = threshold < bestMix.ratio ? bestMix.color2 : bestMix.color1;

  gl_FragColor = vec4(color, 1.0);
}`;

interface DemoOrderedProps {
  type: 'bayer' | 'blueNoise' | 'halftone';
  sizes?: { name: string; value: string }[];
  initial?: string;
  gammaSlider?: boolean;
  useVariance?: boolean;
  useRatio?: boolean;
  imageUrl?: string;
}

const DemoOrdered = ({
  type,
  sizes,
  initial,
  gammaSlider = false,
  useVariance = false,
  useRatio = false,
  imageUrl,
}: DemoOrderedProps) => {
  const [size, setSize] = useState(initial ?? '8');
  const [original, setOriginal] = useState(false);
  const [gamma, setGamma] = useState(2.2);
  const [variance, setVariance] = useState(3);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const { render } = useGlRenderer(
    canvas,
    img,
    shader,
    NicePalette,
    { threshold: `${type}${size}` as any },
    {
      u_gamma: gamma,
      u_variance: variance,
      u_enableMixPenalty: useVariance ? 1 : 0,
      u_enableRMH: useRatio ? 1 : 0,
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

      {useVariance && (
        <label className="demo-label">
          <span className="w-16">var={variance.toFixed(2)}</span>
          <Slider
            min={0}
            max={10}
            step={0.05}
            value={variance}
            onValueChange={setVariance}
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
