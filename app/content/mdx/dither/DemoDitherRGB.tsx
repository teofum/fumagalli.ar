import { useEffect, useRef, useState } from 'react';
import Slider from '~/components/ui/Slider';

const thresholdMap = [0, 12, 3, 15, 8, 4, 11, 7, 2, 14, 1, 13, 10, 6, 9, 5];

const distance = (a: number[], b: number[]) =>
  (a[0] - b[0]) * (a[0] - b[0]) +
  (a[1] - b[1]) * (a[1] - b[1]) +
  (a[2] - b[2]) * (a[2] - b[2]);

const luma = (rgb: number[]) =>
  rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;

interface DemoDitherRGBProps {
  useWhite?: boolean;
}

export default function DemoDitherRGB({ useWhite }: DemoDitherRGBProps) {
  const [zoom, setZoom] = useState(0);
  const [red, setRed] = useState(0.5);
  const [green, setGreen] = useState(0.5);
  const [blue, setBlue] = useState(0.5);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const preview = previewRef.current;

    const ctx = canvas?.getContext('2d');
    const patternCanvas = document.createElement('canvas');
    const ctxPattern = patternCanvas.getContext('2d');
    if (!canvas || !ctx || !ctxPattern) {
      console.warn('Canvas unavailable');
      return;
    }

    ctx.imageSmoothingEnabled = false;

    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;

    const minSize = 1;
    const maxSize = canvas.width / 4;

    const size = Math.round(minSize + zoom * (maxSize - minSize));
    patternCanvas.width = size * 4;
    patternCanvas.height = size * 4;

    // Quick and dirty solid-color pattern dither implementation
    const color = [red, green, blue].map((x) => Math.pow(x, 2.2)); // Gamma correction
    const primaries = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    if (useWhite) primaries.push([1, 1, 1]);

    const error = [0, 0, 0];
    const target = [0, 0, 0];
    const candidates = [];
    for (let i = 0; i < 16; i++) {
      for (let k = 0; k < 3; k++) target[k] = color[k] + error[k];

      let candidate = [0, 0, 0];
      let dMin = Number.MAX_VALUE;

      for (let j = 0; j < primaries.length; j++) {
        const d = distance(target, primaries[j]);
        if (d < dMin) {
          dMin = d;
          candidate = primaries[j];
        }
      }

      candidates.push(candidate);

      for (let k = 0; k < 3; k++) error[k] = error[k] + color[k] - candidate[k];
    }

    candidates.sort((a, b) => luma(a) - luma(b));

    // Draw grid
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const threshold = thresholdMap[(x % 4) + 4 * (y % 4)];

        ctxPattern.fillStyle = `rgb(${candidates[threshold]
          .map((n) => n * 255)
          .join(',')})`;
        ctxPattern.fillRect(x * size, y * size, size, size);
      }
    }

    // Repeat grid
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (preview)
      preview.style.background = `rgb(${[red, green, blue]
        .map((n) => n * 255)
        .join(',')})`;
  }, [zoom, red, green, blue, useWhite]);

  return (
    <div className="demo">
      <div className="flex flex-col gap-0.5">
        <div className="bevel-content h-12" ref={previewRef} />

        <div className="bevel-content p-0.5">
          <canvas className="w-48 h-32" ref={canvasRef} />
        </div>
      </div>

      <div className="demo-controls">
        <label className="demo-label">
          <div className="w-12">Zoom</div>
          <Slider
            min={0}
            max={1}
            step={0.005}
            value={zoom}
            onValueChange={setZoom}
          />
        </label>
        <label className="demo-label">
          <div className="w-12">Red</div>
          <Slider
            min={0}
            max={1}
            step={1 / 256}
            style={{ '--progress-color': `rgb(${red * 255},0,0)` } as any}
            value={red}
            onValueChange={setRed}
          />
        </label>
        <label className="demo-label">
          <div className="w-12">Green</div>
          <Slider
            min={0}
            max={1}
            step={1 / 256}
            style={{ '--progress-color': `rgb(0,${green * 255},0)` } as any}
            value={green}
            onValueChange={setGreen}
          />
        </label>
        <label className="demo-label">
          <div className="w-12">Blue</div>
          <Slider
            min={0}
            max={1}
            step={1 / 256}
            style={{ '--progress-color': `rgb(0,0,${blue * 255})` } as any}
            value={blue}
            onValueChange={setBlue}
          />
        </label>
      </div>
    </div>
  );
};
