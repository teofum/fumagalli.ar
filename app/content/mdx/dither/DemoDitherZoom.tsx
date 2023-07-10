import { useEffect, useRef, useState } from 'react';
import Slider from '~/components/ui/Slider';

const thresholdMap = [0, 12, 3, 15, 8, 4, 11, 7, 2, 14, 1, 13, 10, 6, 9, 5];

interface DemoDitherZoomProps {
  showZoom?: boolean;
  showRatio?: string;
  initialRatio?: number;
  color1: string;
  color2: string;
}

export default function DemoDitherZoom({
  showZoom,
  showRatio,
  initialRatio,
  color1 = 'white',
  color2 = 'black',
}: DemoDitherZoomProps) {
  const [zoom, setZoom] = useState(1);
  const [ratio, setRatio] = useState(
    initialRatio === undefined ? 8 : initialRatio,
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

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

    // Draw grid
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const threshold = thresholdMap[(x % 4) + 4 * (y % 4)];

        ctxPattern.fillStyle = threshold < ratio ? color1 : color2;
        ctxPattern.fillRect(x * size, y * size, size, size);
      }
    }

    // Repeat grid
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [zoom, ratio, color1, color2]);

  return (
    <div className="demo">
      <div className="bevel-content p-0.5">
        <canvas className="w-48 h-48" ref={canvasRef} />
      </div>

      <div className="demo-controls">
        {showZoom ? (
          <label className="demo-label">
            <div className="w-16">Zoom</div>
            <Slider
              min={0}
              max={1}
              step={0.005}
              value={zoom}
              onValueChange={setZoom}
            />
          </label>
        ) : null}
        {showRatio ? (
          <label className="demo-label">
            <div className="w-16">{showRatio}</div>
            <Slider
              min={0}
              max={16}
              step={1}
              value={ratio}
              onValueChange={setRatio}
            />
          </label>
        ) : null}
      </div>
    </div>
  );
};
