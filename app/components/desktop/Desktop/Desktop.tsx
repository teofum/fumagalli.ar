import { useReducer } from 'react';
import Window from '../Window';
import desktopReducer from './reducer';
import { DesktopProvider } from './context';

export default function Desktop() {
  const [state, dispatch] = useReducer(desktopReducer, { windows: [] });

  return (
    <DesktopProvider state={state} dispatch={dispatch}>
      <div className="w-screen h-screen bg-teal-600">
        <button
          className="bg-white hover:bg-gray-200 p-2"
          onClick={() => dispatch({ type: 'create' })}
        >
          New window
        </button>

        {state.windows.map((window) => (
          <Window key={window.id} {...window} />
        ))}
      </div>
    </DesktopProvider>
  );
}
