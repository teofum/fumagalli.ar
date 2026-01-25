import type NodeLike from './NodeLike';

class ColorNode implements NodeLike {
  private colors: number[][] = [];
  private pixels: number = 0;

  public get pixelCount(): number {
    return this.pixels;
  }
  public get avgColor(): number[] {
    const sum = [0, 0, 0];
    for (let i = 0; i < this.colors.length; i++)
      for (let j = 0; j < 3; j++) sum[j] += this.colors[i][j];

    return sum.map((v) => v / this.colors.length);
  }

  public addColor(color: number[]): void {
    // If the specific color isn't in the list, add it
    // Either way, increase the pixel count by one
    if (!this.colors.includes(color)) this.colors.push(color);
    this.pixels++;
  }
}

export default ColorNode;
