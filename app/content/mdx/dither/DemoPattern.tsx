import { useEffect, useState } from 'react';
import Slider from '~/components/ui/Slider';

const thresholdMap = [0, 12, 3, 15, 8, 4, 11, 7, 2, 14, 1, 13, 10, 6, 9, 5];

interface DemoPatternProps {
  showZoom?: boolean;
  showRatio?: string;
  initialRatio?: number;
  showPattern?: boolean;
}

export default function DemoPattern({
  showZoom,
  showRatio,
  initialRatio,
  showPattern,
}: DemoPatternProps) {
  const [zoom, setZoom] = useState(1);
  const [ratio, setRatio] = useState(
    initialRatio === undefined ? 8 : initialRatio,
  );

  let canvas: HTMLCanvasElement | null = null;

  useEffect(() => {
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

    const minSize = canvas.width / 64;
    const maxSize = canvas.width / 4;

    const size = Math.round(minSize + zoom * (maxSize - minSize));
    patternCanvas.width = size * 4;
    patternCanvas.height = size * 4;

    // Draw grid
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const threshold = thresholdMap[(x % 4) + 4 * (y % 4)];

        const bright = threshold / 16;
        const color = showPattern ? `hsl(0, 0%, ${bright * 100}%)` : 'white';

        ctxPattern.fillStyle = threshold < ratio ? color : 'black';
        ctxPattern.fillRect(x * size, y * size, size, size);
      }
    }

    // Repeat grid
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [canvas, showPattern, zoom, ratio]);

  return (
    <div className="demo">
      <div className="bevel-content p-0.5">
        <canvas className="w-48 h-48" ref={(el) => (canvas = el)} />
      </div>

      <div className="demo-controls">
        {showZoom && (
          <label className="demo-label">
            <span className="w-16">Zoom</span>
            <Slider
              min={0}
              max={1}
              step={0.005}
              value={zoom}
              onValueChange={setZoom}
            />
          </label>
        )}
        {showRatio && (
          <label className="demo-label">
            <span className="w-16">{showRatio}</span>
            <Slider
              min={0}
              max={16}
              step={1}
              value={ratio}
              onValueChange={setRatio}
            />
          </label>
        )}
      </div>
    </div>
  );
}
