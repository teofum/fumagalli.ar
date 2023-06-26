import Button from '~/components/ui/Button';
import MinesweeperNumberDisplay from './MinesweeperNumberDisplay';
import {
  FlagStatus,
  MinesweeperState,
  type MinesweeperBoard,
  type MinesweeperSettings,
} from './types';
import { getAppResourcesUrl } from '~/content/utils';
import cn from 'classnames';

const resources = getAppResourcesUrl('mine');

interface MinesweeperStatusProps {
  board: MinesweeperBoard;
  state: MinesweeperState;
  settings: MinesweeperSettings;
  reset: () => void;
  time: number;
}

export default function MinesweeperStatus({
  board,
  state,
  settings,
  reset,
  time,
}: MinesweeperStatusProps) {
  const flagCount = board.cells.filter(
    (cell) => cell.flag === FlagStatus.FLAGGED,
  ).length;

  const playing =
    state === MinesweeperState.NEW || state === MinesweeperState.PLAYING;

  return (
    <div className="bg-surface bevel-light-inset flex flex-row p-1 gap-1 items-center">
      <MinesweeperNumberDisplay value={settings.mines - (flagCount ?? 0)} />

      <Button onClick={() => reset()} className="mx-auto">
        <img
          src={`${resources}/smiley.png`}
          className={cn('group-active/game:hidden', { hidden: !playing })}
          alt=":)"
        />

        <img
          src={`${resources}/smiley-click.png`}
          className={cn('hidden', { 'group-active/game:inline': playing })}
          alt=":o"
        />

        <img
          src={`${resources}/smiley-dead.png`}
          className={cn({ hidden: state !== MinesweeperState.LOST })}
          alt="X("
        />

        <img
          src={`${resources}/smiley-win.png`}
          className={cn({ hidden: state !== MinesweeperState.WON })}
          alt="B)"
        />
      </Button>

      <MinesweeperNumberDisplay value={time} />
    </div>
  );
}
