// Flood fill
// Based on https://stackoverflow.com/a/56221940

interface PixelData {
  width: number;
  height: number;
  data: Uint32Array;
}

type Dir = -1 | 0 | 1;

interface Span {
  left: number;
  right: number;
  y: number;
  direction: Dir;
}

function getPixel({ data, width, height }: PixelData, x: number, y: number) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return -1; // impossible color
  } else {
    return data[y * width + x];
  }
}

export default function floodFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number,
) {
  // read the pixels in the canvas
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  // make a Uint32Array view on the pixels so we can manipulate pixels
  // one 32bit value at a time instead of as 4 bytes per pixel
  const pixelData = {
    width: imageData.width,
    height: imageData.height,
    data: new Uint32Array(imageData.data.buffer),
  };

  // get the color we're filling
  const targetColor = getPixel(pixelData, x, y);

  // check we are actually filling a different color
  if (targetColor !== color) {
    const spansToCheck: Span[] = [];

    function addSpan(left: number, right: number, y: number, direction: Dir) {
      spansToCheck.push({ left, right, y, direction });
    }

    // Check a span and add to the list the part of it that corresponds to the target color
    function checkSpan(left: number, right: number, y: number, direction: Dir) {
      let inSpan = false;
      let start = left;
      let x;

      for (x = left; x < right; ++x) {
        const color = getPixel(pixelData, x, y);
        if (color === targetColor) {
          if (!inSpan) {
            inSpan = true;
            start = x;
          }
        } else {
          if (inSpan) {
            inSpan = false;
            addSpan(start, x - 1, y, direction);
          }
        }
      }

      if (inSpan) {
        inSpan = false;
        addSpan(start, x - 1, y, direction);
      }
    }

    // Add the first span
    addSpan(x, x, y, 0);

    while (spansToCheck.length > 0) {
      const { left, right, y, direction } = spansToCheck.pop() as Span;

      // Expand left until there's something different to the target color
      let l = left;
      for (;;) {
        --l;
        const color = getPixel(pixelData, l, y);
        if (color !== targetColor) {
          break;
        }
      }
      ++l;

      // Expand right until there's something different to the target color
      let r = right;
      for (;;) {
        ++r;
        const color = getPixel(pixelData, r, y);
        if (color !== targetColor) {
          break;
        }
      }

      // Fill the span with color
      const lineOffset = y * pixelData.width;
      pixelData.data.fill(color, lineOffset + l, lineOffset + r);

      // In the same direction we are coming from: check the span from expanded
      // left to expanded right
      // In the opposite direction: check the spans between original and expanded
      // x-coords of this span (fills "overhangs", this lets us fill concave shapes)
      if (direction <= 0) {
        checkSpan(l, r, y - 1, -1);
      } else {
        checkSpan(l, left, y - 1, -1);
        checkSpan(right, r, y - 1, -1);
      }

      if (direction >= 0) {
        checkSpan(l, r, y + 1, 1);
      } else {
        checkSpan(l, left, y + 1, 1);
        checkSpan(right, r, y + 1, 1);
      }
    }

    // Put the data back
    ctx.putImageData(imageData, 0, 0);
  }
}
