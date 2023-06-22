import { useReducer } from 'react';
import Window from '../Window';
import desktopReducer, { createWindow } from './reducer';
import { DesktopProvider } from './context';
import { about } from '~/components/apps/About';
import { intro } from '~/components/apps/Intro';
import Taskbar from '../Taskbar';

export default function Desktop() {
  const [state, dispatch] = useReducer(desktopReducer, {
    windows: [
      { ...createWindow(about), order: 0, focused: false },
      { ...createWindow(intro), order: 1, focused: true },
    ],
  });

  return (
    <DesktopProvider state={state} dispatch={dispatch}>
      <div className="w-screen h-screen bg-desktop">
        <Taskbar />

        {state.windows.map((window) => (
          <Window key={window.id} {...window} />
        ))}
      </div>
    </DesktopProvider>
  );
}
