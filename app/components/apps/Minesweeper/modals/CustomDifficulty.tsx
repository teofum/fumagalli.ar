import { type WindowInit, WindowSizingMode } from '~/components/desktop/Window';
import type { MinesweeperSettings } from '../types';
import { useAppState, useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';
import Input from '~/components/ui/Input';
import clamp from '~/utils/clamp';

export interface MinesweeperCustomDifficultyState {
  width: number;
  height: number;
  mines: number;

  commit: (settings: MinesweeperSettings) => void;
}

export const defaultMinesweeperCustomDifficultyState = {
  width: 8,
  height: 8,
  mines: 10,

  commit: () => {},
};

export default function MinesweeperCustomDifficulty() {
  const { close } = useWindow();

  const [state, setState] = useAppState('mine_difficulty');

  const commit = () => {
    const width = clamp(state.width, 8, 30);
    const height = clamp(state.height, 8, 24);

    // No more than 90% of cells can be mines
    const maxMines = width * height * 0.9;
    const mines = clamp(state.mines, 1, maxMines);

    state.commit({ width, height, mines, name: 'custom' });
    close();
  };

  return (
    <div className="flex flex-row gap-2 p-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-12">Height:</div>
          <Input
            className="w-16"
            numeric="integer"
            value={state.height}
            onChange={(ev) =>
              setState({ ...state, height: Number(ev.target.value) })
            }
          />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-12">Width:</div>
          <Input
            className="w-16"
            numeric="integer"
            value={state.width}
            onChange={(ev) =>
              setState({ ...state, width: Number(ev.target.value) })
            }
          />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-12">Mines:</div>
          <Input
            className="w-16"
            numeric="integer"
            value={state.mines}
            onChange={(ev) =>
              setState({ ...state, mines: Number(ev.target.value) })
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button className="py-1 px-2 w-20" onClick={commit}>
          OK
        </Button>
        <Button className="py-1 px-2 w-20" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export const mine_difficulty = (
  initialState?: MinesweeperCustomDifficultyState,
): WindowInit<'mine_difficulty'> => ({
  appType: 'mine_difficulty',
  appState: initialState ?? defaultMinesweeperCustomDifficultyState,

  title: 'Custom Difficulty',

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
});
