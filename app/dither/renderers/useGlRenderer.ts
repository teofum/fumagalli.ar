import autosizeViewport from '~/utils/gl/autosizeViewport';
import createShader from '~/utils/gl/createShader';
import enableAndBindAttrib from '~/utils/gl/enableAndBindAttrib';
import linkProgram from '~/utils/gl/linkProgram';
import tex2DFromData from '~/utils/gl/tex2DFromData';
import tex2DFromImage from '~/utils/gl/tex2DFromImage';

import shaders from '../shaders';
import thresholds from '../thresholdMaps';
import makeRandomThreshold from '../thresholdMaps/makeRandomThreshold';
import { useCallback, useMemo } from 'react';

export interface RenderSettings {
  clistSize: number;
  threshold: number;
}

const POSITIONS = [-1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1];
const TEXCOORDS = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0];

const palette = [0, 0, 0, 1, 1, 1];
const paletteSize = ~~(palette.length / 3);

export default function useGlRenderer(
  rt: HTMLCanvasElement | null,
  img: HTMLImageElement | null,
  shader: string,
  settings: RenderSettings,
  uniforms: { [key: string]: number },
) {
  const gl = useMemo(() => {
    if (!rt) return null;

    const gl = rt.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) throw new Error('useGlRenderer: WebGL is unavailable');
    return gl;
  }, [rt]);

  const program = useMemo(() => {
    if (!gl) return null;

    console.log('Compiling shaders...');

    const fragSource = shader
      .replace(/\$/g, paletteSize.toString()) // Replace '$' symbol in source with palette size
      .replace(/%/g, (settings.clistSize || 64).toString()); // Replace '%' symbol in source with clist size

    const vert = createShader(gl, gl.VERTEX_SHADER, shaders.imageVert);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    return linkProgram(gl, vert, frag);
  }, [gl, shader, settings.clistSize]);

  const render = useCallback(() => {
    if (!rt || !img || !gl || !program) return;

    autosizeViewport(gl);

    // Get attribute locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    // Get uniform locations
    const u_palette = gl.getUniformLocation(program, 'u_palette');
    const u_texSize = gl.getUniformLocation(program, 'u_texSize');
    const u_image = gl.getUniformLocation(program, 'u_image');
    const u_threshold = gl.getUniformLocation(program, 'u_threshold');
    const u_thres_size = gl.getUniformLocation(program, 'u_thres_size');

    // Custom uniforms, shader-dependent
    const uniformLocations: { [key: string]: WebGLUniformLocation | null } = {};
    Object.keys(uniforms).forEach((key) => {
      uniformLocations[key] = gl.getUniformLocation(program, key);
    });

    // Populate positions buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(POSITIONS), gl.STATIC_DRAW);

    // Populate texCoord buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TEXCOORDS), gl.STATIC_DRAW);

    const threshold =
      settings.threshold === -1
        ? makeRandomThreshold(Math.max(rt.width, rt.height))
        : thresholds[settings.threshold || 0];

    // Load image to texture 0 and threshold matrix to texture 1
    tex2DFromImage(gl, img);
    tex2DFromData(
      gl,
      threshold.size,
      threshold.size,
      threshold.data,
      {
        format: gl.LUMINANCE,
        internalFormat: gl.LUMINANCE,
        type: gl.UNSIGNED_BYTE,
      },
      gl.TEXTURE1,
    );

    // Clear framebuffer
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set program
    gl.useProgram(program);

    // Set uniforms
    gl.uniform3fv(u_palette, palette);
    gl.uniform2f(u_texSize, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(u_image, 0);
    gl.uniform1i(u_threshold, 1);
    gl.uniform1f(u_thres_size, threshold.size);

    Object.keys(uniforms).forEach((key) => {
      gl.uniform1f(uniformLocations[key], uniforms[key]);
    });

    // Bind attributes
    enableAndBindAttrib(gl, positionLocation, positionBuffer, {
      size: 2,
      type: gl.FLOAT,
    });
    enableAndBindAttrib(gl, texCoordLocation, texCoordBuffer, {
      size: 2,
      type: gl.FLOAT,
    });

    // Execute program
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [rt, img, gl, program, settings, uniforms]);

  return { render };
}

// const def = (ev?: number, def?: number) => {
//   return ev !== undefined ? ev : def;
// };

// const mapAmount = (amt: number) => {
//   return [0, 0.01, 0.02, 0.05, 0.1, 0.2, 0.35, 0.5, 0.8, 1][amt];
// };

// let programCache: WebGLProgram | null = null;
// let lastContext: WebGLRenderingContext | null = null;
// let lastPaletteSize: number | null = null;
// let lastSettings: RenderSettings | null = null;

// const runPatternDither = async (
//   rt: HTMLCanvasElement,
//   img: HTMLImageElement,
//   shader: string,
//   settings: RenderSettings,
// ) => {
//   const gl = rt.getContext('webgl', { preserveDrawingBuffer: true });
//   if (!gl) throw new Error('runPatternDither: WebGL is unavailable');
//   autosizeViewport(gl);

//   // Invalidate cache
//   if (
//     paletteSize !== lastPaletteSize || // New palette requires shader recompile
//     settings.clistSize !== lastSettings?.clistSize || // Can't be controlled by a uniform, needs shader rebuild
//     gl !== lastContext
//   )
//     // Context changed
//     programCache = null;

//   lastPaletteSize = paletteSize;
//   lastSettings = settings;
//   lastContext = gl;

//   // Use cached program if possible
//   let program = programCache;
//   if (!program) {
//     console.log('Compiling shaders...');

//     const fragSource = shader
//       .replace(/\$/g, paletteSize.toString()) // Replace '$' symbol in source with palette size
//       .replace(/%/g, (settings.clistSize || 64).toString()); // Replace '%' symbol in source with clist size

//     const vert = createShader(gl, gl.VERTEX_SHADER, shaders.imageVert);
//     const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

//     program = linkProgram(gl, vert, frag);
//     programCache = program;
//   }

//   // Get attribute locations
//   const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
//   const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

//   // Get uniform locations
//   const u_palette = gl.getUniformLocation(program, 'u_palette');
//   const u_texSize = gl.getUniformLocation(program, 'u_texSize');
//   const u_image = gl.getUniformLocation(program, 'u_image');
//   const u_threshold = gl.getUniformLocation(program, 'u_threshold');
//   const u_thres_size = gl.getUniformLocation(program, 'u_thres_size');
//   const u_err_mult = gl.getUniformLocation(program, 'u_err_mult');
//   const u_gamma = gl.getUniformLocation(program, 'u_gamma');

//   // Populate positions buffer
//   const positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(POSITIONS), gl.STATIC_DRAW);

//   // Populate texCoord buffer
//   const texCoordBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TEXCOORDS), gl.STATIC_DRAW);

//   const threshold =
//     settings.threshold === -1
//       ? makeRandomThreshold(Math.max(rt.width, rt.height))
//       : thresholds[settings.threshold || 0];

//   // Load image to texture 0 and threshold matrix to texture 1
//   tex2DFromImage(gl, img);
//   tex2DFromData(
//     gl,
//     threshold.size,
//     threshold.size,
//     threshold.data,
//     {
//       format: gl.LUMINANCE,
//       internalFormat: gl.LUMINANCE,
//       type: gl.UNSIGNED_BYTE,
//     },
//     gl.TEXTURE1,
//   );

//   // Clear framebuffer
//   gl.clearColor(0, 0, 0, 1);
//   gl.clear(gl.COLOR_BUFFER_BIT);

//   // Set program
//   gl.useProgram(program);

//   // Set uniforms
//   gl.uniform3fv(u_palette, palette);
//   gl.uniform2f(u_texSize, gl.canvas.width, gl.canvas.height);
//   gl.uniform1i(u_image, 0);
//   gl.uniform1i(u_threshold, 1);
//   gl.uniform1f(u_thres_size, threshold.size);
//   gl.uniform1f(
//     u_err_mult,
//     mapAmount(def(settings.amount, patternDither.settings.amount.default) || 0),
//   );
//   gl.uniform1f(
//     u_gamma,
//     def(settings.gamma, patternDither.settings.gamma.default) || 0,
//   );

//   // Bind attributes
//   enableAndBindAttrib(gl, positionAttribLocation, positionBuffer, {
//     size: 2,
//     type: gl.FLOAT,
//   });
//   enableAndBindAttrib(gl, texCoordLocation, texCoordBuffer, {
//     size: 2,
//     type: gl.FLOAT,
//   });

//   // Execute program
//   gl.drawArrays(gl.TRIANGLES, 0, 6);
// };

// const patternDither: DitherLabProgram = {
//   device: DitherLabDevice.GL,
//   name: 'Pattern Dithering',
//   settings: {
//     threshold: {
//       name: 'Matrix',
//       type: DitherLabProgramSettingType.Combo,
//       options: [
//         { name: '8x8 Bayer Matrix', value: 0 },
//         { name: '4x4 Bayer Matrix', value: 1 },
//         { name: '64x64 Blue Noise', value: 2 },
//         { name: '16x16 Blue Noise', value: 3 },
//         { name: '8x8 Halftone', value: 4 },
//         { name: '6x6 Halftone', value: 5 },
//         { name: '4x4 Halftone', value: 6 },
//         { name: 'Random (white noise)', value: -1 },
//       ],
//     },
//     clistSize: {
//       name: 'Mix',
//       type: DitherLabProgramSettingType.Combo,
//       options: [
//         { name: '64 level', value: 64 },
//         { name: '16 level', value: 16 },
//         { name: '4 level', value: 4 },
//       ],
//     },
//     amount: {
//       name: 'Dither',
//       type: DitherLabProgramSettingType.Range,
//       max: 9,
//       step: 1,
//       default: 5,
//       showValue: (val) => mapAmount(val).toFixed(2),
//     },
//     gamma: {
//       name: 'Gamma',
//       type: DitherLabProgramSettingType.Range,
//       min: 1,
//       max: 8,
//       step: 0.2,
//       default: 2.2,
//       showValue: (val) => val.toFixed(1),
//     },
//   },
//   run: runPatternDither,
// };

// export default patternDither;
