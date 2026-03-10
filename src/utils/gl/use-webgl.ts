import { useMemo } from 'react';

export default function useWebGL(rt: HTMLCanvasElement | null) {
  const gl = useMemo(() => {
    if (!rt) return null;

    return rt.getContext('webgl2', { preserveDrawingBuffer: true });
  }, [rt]);

  return gl;
}
