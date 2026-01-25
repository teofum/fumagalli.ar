import { useEffect, useState } from "react";
import Slider from "@/components/ui/Slider";

export default function DemoThreshold() {
  const [gamma, setGamma] = useState(1);

  let canvas: HTMLCanvasElement | null = null;

  useEffect(() => {
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      console.warn("Canvas unavailable");
      return;
    }

    const scaling = window.devicePixelRatio;
    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width * scaling;
    canvas.height = canvasRect.height * scaling;

    const [w, h] = [canvas.width, canvas.height];

    const textColor = "#ffffff";
    const drawColor = "#d00000";
    ctx.lineWidth = 1 * scaling;

    const points = Array.from(Array(64), (_, i) => Math.pow(i / 63, gamma));

    const x = (i: number) => (i / (points.length - 1)) * w;
    const y = (i: number) => (1 - points[i]) * h;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    points.forEach((point, i) => {
      const l = Math.pow(i / (points.length - 1), gamma / 2.2) * 100;
      gradient.addColorStop(i / (points.length - 1), `hsl(0, 0%, ${l}%)`);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Draw diagonal line
    ctx.strokeStyle = textColor;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w, 0);
    ctx.stroke();

    // Draw gamma line
    ctx.strokeStyle = drawColor;
    ctx.beginPath();
    ctx.moveTo(0, y(0));
    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(x(i), y(i));
    }
    ctx.stroke();
  }, [canvas, gamma]);

  return (
    <div className="demo font-sans text-base">
      <div className="flex flex-col gap-0.5">
        <div className="bevel-content p-0.5">
          <canvas className="w-64 h-40" ref={(el) => (canvas = el)} />
        </div>
      </div>

      <div className="demo-controls">
        <label className="demo-label">
          <span className="w-16">gamma={gamma.toFixed(2)}</span>
          <Slider
            min={0.1}
            max={10}
            step={0.05}
            value={gamma}
            onValueChange={setGamma}
          />
        </label>
      </div>
    </div>
  );
}
