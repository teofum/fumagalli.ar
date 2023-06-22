import { useReducer } from 'react';
import Window from '../Window';
import desktopReducer from './reducer';
import { DesktopProvider } from './context';
import Button from '~/components/ui/Button';

export default function Desktop() {
  const [state, dispatch] = useReducer(desktopReducer, { windows: [] });

  return (
    <DesktopProvider state={state} dispatch={dispatch}>
      <div className="w-screen h-screen bg-desktop">
        <Button onClick={() => dispatch({ type: 'create' })}>
          <div className="px-1 py-0.5">New window</div>
        </Button>

        {state.windows.map((window) => (
          <Window key={window.id} {...window} />
        ))}
      </div>
    </DesktopProvider>
  );
}
