import { useAppState } from '@/components/desktop/Window/context';
import { useMemo } from 'react';
import { gpuProcess } from '../process';

export default function useShader() {
  const [state] = useAppState('dither');

  const shader = useMemo(
    () => gpuProcess[state.process].shader,
    [state.process],
  );

  return shader;
}
