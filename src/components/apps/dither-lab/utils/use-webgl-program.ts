import { useMemo } from 'react';

import createShader from '@/utils/gl/createShader';
import linkProgram from '@/utils/gl/linkProgram';

import shaders from '../dither/shaders';
import { PaletteData } from './use-palette';
import { RenderSettings } from './use-render-settings';

export default function useWebGLProgram(
  gl: WebGL2RenderingContext | null,
  palette: PaletteData,
  settings: RenderSettings,
  shader: string,
) {
  const program = useMemo(() => {
    if (!gl) return null;

    console.log('Compiling shaders...');

    // Shader preprocessing
    const fragSource = shader
      .replace(/\$/g, palette.size.toString()) // Replace '$' symbol in source with palette size
      .replace(/%/g, (settings.clistSize || 64).toString()); // Replace '%' symbol in source with clist size

    const vert = createShader(gl, gl.VERTEX_SHADER, shaders.imageVert);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    return linkProgram(gl, vert, frag);
  }, [gl, shader, settings.clistSize, palette.size]);

  return program;
}
