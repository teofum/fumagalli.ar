import cn from 'classnames';
import { useEffect, useReducer, useRef, useState } from 'react';
import MinesweeperNumberDisplay from './MinesweeperNumberDisplay';
import Button from '~/components/ui/Button';
import Menu from '~/components/ui/Menu';
import { useWindow } from '~/components/desktop/Window/context';
import { getAppResourcesUrl } from '~/content/utils';
import useDesktopStore from '~/components/desktop/Desktop/store';
import { FlagStatus, MinesweeperState } from './types';
import minesweeperReducer from './reducer';
import { difficultyPresets, newBoard } from './game';

const resources = getAppResourcesUrl('mine');

export default function Minesweeper() {
  const { close } = useDesktopStore();
  const { id } = useWindow();

  /**
   * Game state
   */
  const [{ board, settings, state }, dispatch] = useReducer(
    minesweeperReducer,
    {
      board: newBoard(difficultyPresets.beginner),
      settings: difficultyPresets.beginner,
      state: MinesweeperState.NEW,
    },
  );

  /**
   * Timer
   */
  const [time, setTime] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stopTimer = () => {
      if (timer.current) clearInterval(timer.current);
    };

    const resetTimer = () => {
      stopTimer();
      setTime(0);
    };

    const startTimer = () => {
      resetTimer();
      const newTimer = setInterval(() => {
        setTime((time) => Math.min(time + 1, 999));
      }, 1000);
      timer.current = newTimer;
    };

    if (state === MinesweeperState.PLAYING) {
      startTimer();
    } else if (state === MinesweeperState.NEW) {
      resetTimer();
    } else {
      stopTimer();
    }
  }, [state]);

  /**
   * Event handlers
   */
  const onCellClick = (cellIndex: number) => {
    dispatch({ type: 'reveal', cellIndex });
  };

  const onCellRightClick = (ev: React.MouseEvent, cellIndex: number) => {
    ev.preventDefault();
    dispatch({ type: 'cycleFlag', cellIndex });
  };

  const reset = (set = settings) => {
    dispatch({ type: 'newGame', settings: set });
  };

  /**
   * Utils
   */
  const flagCount = board.cells.filter(
    (cell) => cell.flag === FlagStatus.FLAGGED,
  ).length;

  const playing =
    state === MinesweeperState.NEW || state === MinesweeperState.PLAYING;

  return (
    <div className="select-none">
      <div className="flex flex-row gap-1 mb-0.5">
        <Menu.Root trigger={<Menu.Trigger>Game</Menu.Trigger>}>
          <Menu.Item label="New" onSelect={() => reset()} />

          <Menu.Separator />

          <Menu.CheckboxItem
            label="Beginner"
            checked={settings.name === 'beginner'}
            onSelect={() => reset(difficultyPresets.beginner)}
          />
          <Menu.CheckboxItem
            label="Intermediate"
            checked={settings.name === 'intermediate'}
            onSelect={() => reset(difficultyPresets.intermediate)}
          />
          <Menu.CheckboxItem
            label="Expert"
            checked={settings.name === 'expert'}
            onSelect={() => reset(difficultyPresets.expert)}
          />

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={() => close(id)} />
        </Menu.Root>
      </div>

      <div className="bg-surface bevel flex flex-col p-2 gap-2 m-0.5 group/game">
        <div className="bg-surface bevel-light-inset flex flex-row p-1 gap-1 items-center">
          <MinesweeperNumberDisplay value={settings.mines - (flagCount ?? 0)} />

          <Button onClick={() => reset(settings)} className="mx-auto">
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

        <div
          className={cn(
            'bg-surface bevel-content p-0.5 grid auto-rows-auto justify-start',
            {
              'pointer-events-none': !playing,
            },
          )}
          style={{ gridTemplateColumns: `repeat(${board?.width}, auto)` }}
        >
          {board?.cells.map((cell, i) => (
            <button
              key={i}
              className="relative w-4 h-4 group border-r border-b border-light"
              onClick={() => onCellClick(i)}
              onContextMenu={(ev) => onCellRightClick(ev, i)}
            >
              <div
                className={cn(
                  'w-full h-full grid place-items-center',
                  'font-minesweeper text-xl',
                  {
                    'bg-[red]': cell.exploded,
                    'group-active:hidden':
                      !cell.revealed && cell.flag !== FlagStatus.FLAGGED,
                    'text-[#0000ff]': cell.nearMines === 1,
                    'text-[#008000]': cell.nearMines === 2,
                    'text-[#ff0000]': cell.nearMines === 3,
                    'text-[#000080]': cell.nearMines === 4,
                    'text-[#800000]': cell.nearMines === 5,
                    'text-[#008080]': cell.nearMines === 6,
                    'text-[#800080]': cell.nearMines === 7,
                    'text-[#505050]': cell.nearMines === 8,
                  },
                )}
              >
                {cell.hasMine ? (
                  <img src={`${resources}/mine.png`} alt="mine" />
                ) : cell.flag === FlagStatus.FLAGGED ? (
                  <img src={`${resources}/wrong.png`} alt="mine" />
                ) : (
                  cell.nearMines || ''
                )}
              </div>

              <div
                className={cn(
                  'absolute top-0 left-0 w-4 h-4 bg-surface bevel',
                  {
                    hidden: cell.revealed,
                    'group-active:hidden': cell.flag !== FlagStatus.FLAGGED,
                  },
                )}
              >
                <img
                  src={`${resources}/flag.png`}
                  className={cn({ hidden: cell.flag !== FlagStatus.FLAGGED })}
                  alt="F"
                />

                <img
                  src={`${resources}/flag-question.png`}
                  className={cn({
                    hidden: cell.flag !== FlagStatus.QUESTION_MARK,
                  })}
                  alt="?"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
