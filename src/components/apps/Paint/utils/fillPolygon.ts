import drawLine from './drawLine';

interface Point {
  x: number;
  y: number;
}

interface SimpleRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export function getBoundingBox(points: Point[]): SimpleRect {
  const bounds: SimpleRect = {
    top: Number.MAX_SAFE_INTEGER,
    left: Number.MAX_SAFE_INTEGER,
    bottom: 0,
    right: 0,
  };

  points.forEach((point: Point) => {
    bounds.top = Math.min(point.y, bounds.top);
    bounds.left = Math.min(point.x, bounds.left);
    bounds.bottom = Math.max(point.y, bounds.bottom);
    bounds.right = Math.max(point.x, bounds.right);
  });

  return bounds;
}

export function getIntersectionPoints(points: Point[], y: number): number[] {
  const intersections: number[] = [];
  let lastPoint = points.at(-1) as Point;

  points.forEach((point: Point) => {
    if (
      !((point.y >= y && lastPoint.y >= y) || (point.y < y && lastPoint.y < y))
    ) {
      const delta = { x: point.x - lastPoint.x, y: point.y - lastPoint.y };

      // Where we need to interpolate x to find the intersection
      const t = (y - point.y) / delta.y;

      const intX = point.x + delta.x * t;
      intersections.push(intX);
    }

    lastPoint = point;
  });

  return intersections;
}

export default function fillPolygon(
  ctx: CanvasRenderingContext2D,
  points: Point[],
) {
  const boundingBox: SimpleRect = getBoundingBox(points);
  for (let y = boundingBox.top + 1; y < boundingBox.bottom; y++) {
    const intersectionPoints = getIntersectionPoints(points, y).sort(
      (a, b) => a - b,
    );
    const pairs: [number, number][] = [];

    while (intersectionPoints.length >= 2) {
      const first = intersectionPoints.shift() || 0;
      const second = intersectionPoints.shift() || 0;
      pairs.push([first, second]);
    }

    pairs
      .filter((pair) => pair[0] < pair[1] - 1)
      .forEach((pair) => drawLine(ctx, pair[0], y, pair[1], y));
  }
}
