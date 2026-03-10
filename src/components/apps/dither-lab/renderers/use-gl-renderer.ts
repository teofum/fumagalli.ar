import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useImage from '@/components/apps/dither-lab/utils/use-image';
import { useAppState } from '@/components/desktop/Window/context';
import autosizeViewport from '@/utils/gl/autosizeViewport';
import enableAndBindAttrib from '@/utils/gl/enableAndBindAttrib';
import tex2DFromImage from '@/utils/gl/tex2DFromImage';
import useWebGL from '@/utils/gl/use-webgl';

import usePalette, { type PaletteData } from '../utils/use-palette';
import useRenderSettings, {
  RenderSettings,
} from '../utils/use-render-settings';
import useThresholdMap from '../utils/use-threshold-map';
import useWebGLProgram from '../utils/use-webgl-program';
import { Palette } from '../dither/palettes/types';
import getPaletteColors from '../dither/utils/palette-colors';
import useShader from '../utils/use-shader';

const POSITIONS = [-1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1];
const TEXCOORDS = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0];

export default function useGlRenderer(rt: HTMLCanvasElement | null) {
  const [state] = useAppState('dither');
  const { uniforms } = state;

  const gl = useWebGL(rt);
  const image = useImage();
  const palette = usePalette();
  const settings = useRenderSettings();
  const shader = useShader();
  const program = useWebGLProgram(gl, palette, settings, shader);
  const threshold = useThresholdMap(gl, rt, settings);

  const render = useCallback(() => {
    if (!rt || !image || !gl || !program) return;
    console.log('Rendering...');

    _render(gl, program, uniforms, palette, threshold!);
  }, [rt, image, gl, program, uniforms, palette, threshold]);

  // Load image to texture 0 and ensure a render happens AFTER texture is loaded
  const [textureIdx, setTextureIdx] = useState(0);
  const lastRenderedTexture = useRef(0);

  useEffect(() => {
    if (!gl || !image) return;

    const loadTexture = async () => {
      console.log('Loading texture...');
      await tex2DFromImage(gl, image);
      setTextureIdx((i) => i + 1);
    };

    loadTexture();
  }, [gl, image]);

  useEffect(() => {
    if (textureIdx > lastRenderedTexture.current) {
      lastRenderedTexture.current = textureIdx;
      render();
    }
  }, [render, textureIdx]);

  return { render };
}

export function useGlDemoRenderer(
  rt: HTMLCanvasElement | null,
  image: HTMLImageElement | null,
  shader: string,
  palette: Palette,
  settings: RenderSettings,
  uniforms: { [key: string]: number },
) {
  const gl = useWebGL(rt);
  const paletteData = useMemo(() => {
    const colors = getPaletteColors(palette)
      .flat()
      .map((n) => n / 255);

    return { colors, size: colors.length };
  }, [palette]);
  const program = useWebGLProgram(gl, paletteData, settings, shader);
  const threshold = useThresholdMap(gl, rt, settings);

  const render = useCallback(() => {
    if (!rt || !image || !gl || !program) return;
    console.log('Rendering...');

    tex2DFromImage(gl, image);
    _render(gl, program, uniforms, paletteData, threshold!);
  }, [rt, image, gl, program, uniforms, paletteData, threshold]);

  return { render };
}

function _render(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniforms: { [key: string]: number },
  palette: PaletteData,
  threshold: { size: number; data: number[] },
) {
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

  // Clear framebuffer
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set program
  gl.useProgram(program);

  // Set uniforms
  if (u_palette) gl.uniform3fv(u_palette, palette.colors);
  if (u_texSize) gl.uniform2f(u_texSize, gl.canvas.width, gl.canvas.height);
  if (u_image) gl.uniform1i(u_image, 0);
  if (u_threshold) gl.uniform1i(u_threshold, 1);
  if (u_thres_size) gl.uniform1f(u_thres_size, threshold.size);

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
}
