import { useMemo } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import createShader from '@/utils/gl/createShader';
import linkProgram from '@/utils/gl/linkProgram';

import { gpuProcess } from '../process';
import { PaletteData } from './use-palette';
import { RenderSettings } from '../renderers/use-gl-renderer';
import shaders from '../dither/shaders';

export default function useWebGLProgram(
  gl: WebGL2RenderingContext | null,
  palette: PaletteData,
  settings: RenderSettings,
) {
  const [state] = useAppState('dither');

  const shader = useMemo(
    () => gpuProcess[state.process].shader,
    [state.process],
  );

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
