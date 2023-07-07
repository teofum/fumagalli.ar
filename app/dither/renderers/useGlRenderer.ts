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
import type { Palette } from '../palettes/types';
import getPaletteColors, { getPaletteSize } from '../utils/paletteColors';

export interface RenderSettings {
  clistSize: number;
  threshold: keyof typeof thresholds | 'random';
}

const POSITIONS = [-1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1];
const TEXCOORDS = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0];

export default function useGlRenderer(
  rt: HTMLCanvasElement | null,
  img: HTMLImageElement | null,
  shader: string,
  palette: Palette,
  settings: RenderSettings,
  uniforms: { [key: string]: number },
) {
  const gl = useMemo(() => {
    if (!rt) return null;

    const gl = rt.getContext('webgl2', { preserveDrawingBuffer: true });
    if (!gl) return;
    return gl;
  }, [rt]);

  const colors = useMemo(
    () =>
      getPaletteColors(palette)
        .flat()
        .map((n) => n / 255),
    [palette],
  );
  const paletteSize = useMemo(() => getPaletteSize(palette), [palette]);

  const program = useMemo(() => {
    if (!gl) return null;

    console.log('Compiling shaders...');

    const fragSource = shader
      .replace(/\$/g, paletteSize.toString()) // Replace '$' symbol in source with palette size
      .replace(/%/g, (settings.clistSize || 64).toString()); // Replace '%' symbol in source with clist size

    const vert = createShader(gl, gl.VERTEX_SHADER, shaders.imageVert);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    return linkProgram(gl, vert, frag);
  }, [gl, shader, settings.clistSize, paletteSize]);

  const render = useCallback(() => {
    if (!rt || !img || !gl || !program) return;
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
        : thresholds[settings.threshold];

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
    gl.uniform3fv(u_palette, colors);
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
  }, [rt, img, gl, program, settings, uniforms, colors]);

  return { render };
}
