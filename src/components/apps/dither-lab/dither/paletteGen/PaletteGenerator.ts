import { type Palette, PaletteGroup, PaletteType } from '../palettes/types';
import ColorNode from './ColorNode';
import type NodeLike from './NodeLike';

// Sample every n pixels in the x and y axes (1/n^2 pixels total)
const SUBSAMPLING = 2;

interface AutoPaletteOptions {
  size: number;
  reservedLevel: number;
  levels: number;
  thresholdCoeff: number;
}

interface CTE {
  index: number;
  level: number;
  node: NodeLike;
}

function makeTree(levels: number): ColorNode[] {
  return Array.from({ length: Math.pow(8, levels) }, () => new ColorNode());
}

// Octree-based color quantizer
class PaletteGenerator {
  // Flattened tree
  private levels: number;
  private reservedLevel: number;
  private nColors: number;
  private k: number;
  private tree: ColorNode[];
  private ctes: CTE[];
  private generated: boolean = false;

  constructor(opts: AutoPaletteOptions) {
    this.levels = opts.levels;
    this.tree = makeTree(opts.levels);
    this.ctes = [];

    this.reservedLevel = opts.reservedLevel;
    this.nColors = opts.size;
    this.k = opts.thresholdCoeff || 1;
  }

  // Add a color to the appropriate leaf node (octcube)
  // Returns the index of the leaf node the color was added to
  public addColor(color: number[]): number {
    if (this.generated)
      throw new Error('Attempting to modify a generated palette');

    const i = this.index(color);
    this.tree[i].addColor(color);
    return i;
  }

  public getPalette(): number[][] {
    if (!this.generated) this.generate();

    const colors: number[][] = [];

    this.ctes.forEach((cte) => {
      const index = cte.index;

      const color = [0, 0, 0];
      for (let n = 0; n < cte.level; n++) {
        for (let i = 2; i >= 0; i--) {
          const bit = (cte.level - 1 - n) * 3 + i;
          const mask = (0x1 << (cte.level * 3 - 1)) >> (n * 3 + (2 - i));
          color[2 - i] = (color[2 - i] << 1) | ((index & mask) >> bit);
        }
      }
      for (let n = cte.level; n < 8; n++)
        for (let i = 0; i < 3; i++)
          color[i] = (color[i] << 1) | (n === cte.level ? 0x1 : 0x0);

      colors.push(color);
      //colors.push(cte.node.avgColor);
    });

    console.log(`Built palette with ${colors.length} colors`);
    return colors;
  }

  // Returns an index for the virtual octree at level (N)
  // By design the octcube (i) at level (n - 1) contains the
  // octcubes (8i + j; j in 0-7) at level (n)
  //
  // In other words, shifting the index at level (n) three
  // bits to the right yields the index of the color at level (n - 1)
  private index(color: number[]): number {
    let index = 0;
    for (let n = 0; n < this.levels; n++) {
      const bit = 7 - n;
      let iLevel = 0;
      for (let i = 0; i < 3; i++) {
        // For each channel, get the nth bit starting from the MSB
        // and combine them in a number in range 1-8
        // This is our index for the level n (relative to level n-1)
        const mask = 0x80 >> n;
        iLevel = (iLevel << 1) | ((color[i] & mask) >> bit);
      }

      // Shift the 'global' index by 3 bits and add the new level index
      // The result is the 'absolute' index of the lowest level octcube
      // the color fits in
      index = (index << 3) | iLevel;
    }

    return index;
  }

  // Returns the properties for any given node
  // Only leaf nodes are actually stored; for any other node,
  // a 'fake' node with its properties calculated on the fly
  // is returned
  private getNode(index: number, level: number): NodeLike {
    if (level === this.levels) return this.tree[index];

    const children: NodeLike[] = [];
    for (let j = 0; j < 8; j++)
      if (!this.isCTE(8 * index + j, level + 1))
        children.push(this.getNode(8 * index + j, level + 1));

    const fakeNode = children
      .filter((node) => node.pixelCount > 0)
      .reduce(
        (acc, node) => ({
          //avgColor: acc.avgColor.map((ch, i) => ch + node.avgColor[i]),
          pixelCount: acc.pixelCount + node.pixelCount,
        }),
        { /*avgColor: [0, 0, 0],*/ pixelCount: 0 },
      );

    // Produce average from the sum of the eight child nodes
    //fakeNode.avgColor = fakeNode.avgColor.map(ch => ch / 8);
    //if (fakeNode.avgColor.some(ch => isNaN(ch)))
    //  console.warn(`broken color @${index}, level ${level}`);
    return fakeNode;
  }

  private isCTE(index: number, level: number): boolean {
    return this.ctes.some((cte) => cte.index === index && cte.level === level);
  }

  private markCTE(index: number, level: number, node: NodeLike): void {
    this.ctes.push({ index, level, node });
  }

  private testNode(
    nCols: number,
    nRes: number,
    nPix: number,
    node: NodeLike,
  ): boolean {
    // Get the number of colors yet to be assigned
    const unassignedColors = nCols - nRes - this.ctes.length;

    // Get the total number of pixels sampled and the number
    // of pixels assigned to some CTE, and subtract to get
    // the number of pixels left to assign
    const unassignedPixels =
      nPix -
      this.ctes
        .map((cte) => cte.node.pixelCount)
        .reduce((acc, v) => acc + v, 0);

    const threshold = (unassignedPixels / unassignedColors) * this.k;

    // If the node has more pixels than the number of pixels left
    // to assign divided by the number of available colors, then
    // it should get a color in the palette
    return node.pixelCount > threshold;
  }

  private get nonReservedCTEs(): number {
    return this.ctes.filter((cte) => cte.level !== this.reservedLevel).length;
  }

  private generate(): void {
    if (this.generated)
      throw new Error('This palette has already been generated');
    this.generated = true;

    const reserved =
      this.reservedLevel < 0 ? 0 : Math.pow(8, this.reservedLevel);
    const sampled = this.getNode(0, 0).pixelCount;
    let level: number;
    let lastIterationCTEs: number = 0;
    let stuckCounter: number = 0;

    // Repeat until the palette is full!
    while (this.nColors - reserved - this.nonReservedCTEs > 0) {
      level = this.levels; // Start at leaf node level

      // Prune up until the specified level
      // All colors in that level are then reserved
      while (level > this.reservedLevel && level > 0) {
        const nodes = Math.pow(8, level);

        // Iterate through all nodes in the level
        for (let i = 0; i < nodes; i++) {
          const node = this.getNode(i, level);

          // If the node is not yet a CTE, and has enough pixels to be
          // one, make it a CTE
          if (
            !this.isCTE(i, level) &&
            this.testNode(this.nColors, reserved, sampled, node)
          )
            this.markCTE(i, level, node);

          // Every 8th node, check the last 8 nodes
          // If any nodes are a CTE, make the parent a CTE UNLESS all 8 nodes are CTEs
          if (i % 8 === 7) {
            let ctes = 0;
            for (let j = i - 7; j <= i; j++) if (this.isCTE(j, level)) ctes++;

            if (ctes > 0 && ctes < 8) {
              const iParent = i >> 3;
              if (!this.isCTE(iParent, level - 1))
                this.markCTE(
                  iParent,
                  level - 1,
                  this.getNode(iParent, level - 1),
                );
            }
          }

          // Stop if the palette is full
          if (this.nColors - reserved - this.nonReservedCTEs <= 0) {
            //console.warn(`Ran out of colors! At node ${i}, level ${level}`);
            break;
          }
        }

        // Stop if the palette is full
        if (this.nColors - reserved - this.nonReservedCTEs <= 0) {
          //console.warn(`Ran out of colors! At level ${level}`);
          break;
        }
        level--;
      }

      //console.log(`${this.ctes.length} CTEs, ${this.ctes.length - this.nonReservedCTEs} reserved`);
      if (this.ctes.length === lastIterationCTEs) {
        this.k = this.k / 2;
        stuckCounter++;

        if (stuckCounter >= 5) break;
      }
      lastIterationCTEs = this.ctes.length;
    }

    // Finally, handle reserved colors
    if (this.reservedLevel >= 0) {
      level = this.reservedLevel;
      const nodes = Math.pow(8, level);

      for (let i = 0; i < nodes; i++) {
        const node = this.getNode(i, level);

        // If the node is not yet a CTE, make it one
        if (!this.isCTE(i, level)) this.markCTE(i, level, node);
      }
    }
  }
}

export function generatePalette(
  opts: AutoPaletteOptions,
  img: ImageData,
): Palette {
  const octree = new PaletteGenerator(opts);

  const size = img.width * img.height * 4;
  for (let i = 0; i < size; i += 4) {
    const y = ~~(i / 4 / img.width);
    const x = ~~((i / 4) % img.width);

    if (x % SUBSAMPLING === 0 && y % SUBSAMPLING === 0) {
      const color = Array.from(img.data.slice(i, i + 4));
      octree.addColor(color);
    }
  }

  const colors = octree.getPalette();
  return {
    name: `AUTO_${opts.size}L${opts.levels}R${opts.reservedLevel}`,
    type: PaletteType.Indexed,
    group: PaletteGroup.Generated,
    data: colors.reduce((flat, color) => flat.concat(color)),
  };
}
