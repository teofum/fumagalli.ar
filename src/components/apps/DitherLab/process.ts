import { THREADS_AVAILABLE } from "@/dither/renderers/useSoftwareRenderer";
import shaders from "@/dither/shaders";

export interface DitherProcessOptionBase {
  name: string;
  displayName: string;
}

export type DitherProcessRangeOption = {
  type: "range";

  min: number;
  max: number;
  step: number;
  map?: string;
} & DitherProcessOptionBase;

export type DitherProcessSelectOption = {
  type: "select";

  options: { name: string; value: string }[];
} & DitherProcessOptionBase;

export type DitherProcessOption =
  | DitherProcessRangeOption
  | DitherProcessSelectOption;

export interface DitherGlProcess {
  name: string;
  shader: string;

  settings: DitherProcessOption[];
  uniforms: DitherProcessRangeOption[];
}

export interface DitherSoftwareProcess {
  name: string;
  process: string;

  settings: DitherProcessOption[];
}

export const mapFns: { [key: string]: (n: number) => number } = {
  dither: (n) => [0, 0.01, 0.02, 0.05, 0.1, 0.2, 0.35, 0.5, 0.8, 1][n],
};

export const reverseMapFns: { [key: string]: (n: number) => number } = {
  dither: (n) => [0, 0.01, 0.02, 0.05, 0.1, 0.2, 0.35, 0.5, 0.8, 1].indexOf(n),
};

const thresholdSetting = {
  type: "select",
  name: "threshold",
  displayName: "Matrix",
  options: [
    { name: "8x8 Bayer Matrix", value: "bayer8" },
    { name: "4x4 Bayer Matrix", value: "bayer4" },
    { name: "64x64 Blue Noise", value: "blueNoise64" },
    { name: "16x16 Blue Noise", value: "blueNoise16" },
    { name: "8x8 Halftone", value: "halftone8" },
    { name: "6x6 Halftone", value: "halftone6" },
    { name: "4x4 Halftone", value: "halftone4" },
    { name: "Random (white noise)", value: "random" },
  ],
} satisfies DitherProcessSelectOption;

export const gpuProcess: { [key: string]: DitherGlProcess } = {
  pattern: {
    name: "Pattern Dithering",
    shader: shaders.patternFrag,

    settings: [
      thresholdSetting,
      {
        type: "select",
        name: "quality",
        displayName: "Quality",
        options: [
          { name: "High (64 level)", value: "high" },
          { name: "Medium (16 level)", value: "medium" },
          { name: "Low (4 level)", value: "low" },
        ],
      },
    ],
    uniforms: [
      {
        type: "range",
        name: "u_err_mult",
        displayName: "Dither",
        min: 0,
        max: 9,
        step: 1,
        map: "dither",
      },
      {
        type: "range",
        name: "u_gamma",
        displayName: "Gamma",
        min: 1,
        max: 8,
        step: 0.2,
      },
    ],
  },
  colorPair: {
    name: "Color Pair Ordered",
    shader: shaders.bayerFrag,

    settings: [thresholdSetting],
    uniforms: [
      {
        type: "range",
        name: "u_variance",
        displayName: "Variance",
        min: 0,
        max: 8,
        step: 0.2,
      },
      {
        type: "range",
        name: "u_gamma",
        displayName: "Gamma",
        min: 1,
        max: 8,
        step: 0.2,
      },
    ],
  },
};

export const softwareProcess: { [key: string]: DitherSoftwareProcess } = {
  errorDiffusion: {
    name: "Error Diffusion",
    process: "errorDiffusion",

    settings: [
      {
        type: "select",
        name: "matrix",
        displayName: "Matrix",
        options: [
          { name: "Floyd-Steinberg", value: "floydSteinberg" },
          { name: "JJ&N", value: "minAverageError" },
          { name: "Stucki", value: "stucki" },
          { name: "Sierra", value: "sierra" },
          { name: "Simple 2x2", value: "simple" },
        ],
      },
      {
        type: "range",
        name: "error_mult",
        displayName: "Diffuse",
        min: 0.5,
        max: 1,
        step: 0.05,
      },
      {
        type: "range",
        name: "gamma",
        displayName: "Gamma",
        min: 1,
        max: 8,
        step: 0.2,
      },
    ],
  },
  pattern: {
    name: "Pattern Dithering",
    process: "pattern",

    settings: [
      {
        type: "range",
        name: "threads",
        displayName: "Threads",
        min: 0,
        max: THREADS_AVAILABLE,
        step: 1,
      },
      thresholdSetting,
      {
        type: "select",
        name: "quality",
        displayName: "Quality",
        options: [
          { name: "High (64 level)", value: "high" },
          { name: "Medium (16 level)", value: "medium" },
          { name: "Low (4 level)", value: "low" },
        ],
      },
      {
        type: "range",
        name: "err_mult",
        displayName: "Dither",
        min: 0,
        max: 9,
        step: 1,
        map: "dither",
      },
      {
        type: "range",
        name: "gamma",
        displayName: "Gamma",
        min: 1,
        max: 8,
        step: 0.2,
      },
    ],
  },
};
