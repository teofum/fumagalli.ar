import { useState } from 'react';
import type { DosPlayer as Instance } from 'js-dos';

import { useAppState, useWindow } from '~/components/desktop/Window/context';
import DosPlayer from './DosPlayer';
import Menu from '~/components/ui/Menu';
import { files } from '../Files';

export default function DOSEmu() {
  const { close, modal } = useWindow();

  const [state, setState] = useAppState('dos');
  const [dos, setDos] = useState<Instance | null>(null);

  const open = () => {
    modal(
      files({
        path: '/system/Applications/dos/games',
        typeFilter: ['dos'],
        modalCallback: (file, filePath) => {
          if (file.type === 'dos')
            setState({ bundleUrl: `/fs${filePath}`, title: file.name });
        },
      }),
    );
  };

  return (
    <div className="flex flex-col gap-0.5">
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>Emulation</Menu.Trigger>}>
          <Menu.Item label="Open..." onSelect={open} />

          <Menu.Separator />

          <Menu.CheckboxItem
            label="Lock mouse pointer"
            checked={dos?.autolock}
            onCheckedChange={(value) => dos?.setAutolock(value)}
          />

          <Menu.Separator />

          <Menu.Item label="Quit" onSelect={close} />
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>Sound</Menu.Trigger>}>
          <Menu.CheckboxItem
            label="Mute"
            checked={dos?.volume === 0}
            onCheckedChange={(value) => dos?.setVolume(value ? 0 : 1)}
          />
        </Menu.Menu>
      </Menu.Bar>

      <div className="grow bevel-content p-0.5 overflow-hidden">
        <DosPlayer bundleUrl={state.bundleUrl} dos={dos} setDos={setDos} />
      </div>

      <div className="flex flex-row gap-0.5">
        <div className="grow bg-surface bevel-light-inset py-0.5 px-1">
          {dos?.autolock
            ? 'Pointer lock ON | Press Esc to release'
            : 'Pointer lock OFF'}
        </div>
        <div className="grow bg-surface bevel-light-inset py-0.5 px-1">
          {state.title}
        </div>
      </div>
    </div>
  );
}
