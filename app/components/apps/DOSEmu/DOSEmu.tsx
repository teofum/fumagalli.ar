import { useState } from 'react';
import type { DosPlayer as Instance } from 'js-dos';

import { useAppState } from '~/components/desktop/Window/context';
import DosPlayer from './DosPlayer';

export default function DOSEmu() {
  const [state] = useAppState('dos');
  const [dos, setDos] = useState<Instance | null>(null);

  return (
    <div className="bevel-content p-0.5 overflow-hidden">
      <DosPlayer bundleUrl={state.bundleUrl} dos={dos} setDos={setDos} />
    </div>
  );
}
