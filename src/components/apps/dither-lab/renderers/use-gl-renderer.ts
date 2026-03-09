import { useCallback } from 'react';

import useImage from '@/components/apps/dither-lab/utils/use-image';
import autosizeViewport from '@/utils/gl/autosizeViewport';
import enableAndBindAttrib from '@/utils/gl/enableAndBindAttrib';
import tex2DFromData from '@/utils/gl/tex2DFromData';
import tex2DFromImage from '@/utils/gl/tex2DFromImage';
import useWebGL from '@/utils/gl/use-webgl';

import thresholds from '../dither/thresholdMaps';
import makeRandomThreshold from '../dither/thresholdMaps/makeRandomThreshold';
import usePalette from '../utils/use-palette';
import useWebGLProgram from '../utils/use-program';
import { useAppState } from '@/components/desktop/Window/context';

export interface RenderSettings {
  clistSize?: number;
  threshold?: keyof typeof thresholds | 'random';
}

const POSITIONS = [-1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1];
const TEXCOORDS = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0];

export default function useGlRenderer(
  rt: HTMLCanvasElement | null,
  settings: RenderSettings,
) {
  const [state] = useAppState('dither');
  const { uniforms } = state;

  const gl = useWebGL(rt);
  const image = useImage();
  const palette = usePalette();
  const program = useWebGLProgram(gl, palette, settings);

  const render = useCallback(async () => {
    if (!rt || !image || !gl || !program) return;
    console.log('Rendering...');

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
      settings.threshold === 'random'
        ? makeRandomThreshold(Math.max(rt.width, rt.height))
        : thresholds[settings.threshold ?? 'bayer8'];

    // Load image to texture 0 and threshold matrix to texture 1
    await tex2DFromImage(gl, image);
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
  }, [rt, image, gl, program, settings, uniforms, palette.colors]);

  return { render };
}
