import type { Dispatch, ReducerAction, ReducerState } from 'react';
import { useEffect, useReducer, useState } from 'react';
import sudokuReducer from './reducer';
import Menu from '~/components/ui/Menu';
import cn from 'classnames';
import Button from '~/components/ui/Button';
import { useWindow } from '~/components/desktop/Window/context';
import { useFetcher } from '@remix-run/react';
import Markdown from '~/components/ui/Markdown';
import useDesktopStore from '~/stores/desktop';
import Toolbar from '~/components/ui/Toolbar';

interface CellProps {
  index: number;
  value: number;
  fixed: boolean;
  state: ReducerState<typeof sudokuReducer>;
  dispatch: Dispatch<ReducerAction<typeof sudokuReducer>>;
}

function SudokuCell({ index: i, value, fixed, state, dispatch }: CellProps) {
  const x = i % 9;
  const y = Math.floor(i / 9);
  const block = Math.floor(x / 3) + 3 * Math.floor(y / 3);

  const sx = state.selected % 9;
  const sy = Math.floor(state.selected / 9);
  const sblock = Math.floor(sx / 3) + 3 * Math.floor(sy / 3);

  const isSelected = state.selected === i;
  const isNeighborOfSelected =
    !isSelected && (x === sx || y === sy || block === sblock);

  const hasConflict =
    isNeighborOfSelected &&
    value !== 0 &&
    value === state.board?.[state.selected]?.value;

  const select = () => dispatch({ type: 'select', index: i });
  const keyHandler = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Backspace') {
      dispatch({ type: 'set', value: 0 });
    } else if (ev.key.match(/^[0-9]$/)) {
      dispatch({ type: 'set', value: Number(ev.key) });
    } else if (ev.key.includes('Arrow')) {
      let x = state.selected % 9;
      let y = Math.floor(state.selected / 9);

      switch (ev.key) {
        case 'ArrowUp': {
          y = y - (ev.shiftKey ? 3 : 1);
          if (y < 0) y += 9;
          break;
        }
        case 'ArrowDown': {
          y = (y + (ev.shiftKey ? 3 : 1)) % 9;
          break;
        }
        case 'ArrowLeft': {
          x = x - (ev.shiftKey ? 3 : 1);
          if (x < 0) x += 9;
          break;
        }
        case 'ArrowRight': {
          x = (x + (ev.shiftKey ? 3 : 1)) % 9;
          break;
        }
      }

      dispatch({ type: 'select', index: x + 9 * y });
    }
  };

  return (
    <button
      className={cn('w-10 h-10 border-r border-b border-surface-dark button', {
        'border-r-surface-darker': i % 9 === 2 || i % 9 === 5,
        'border-b-surface-darker': ~~(i / 9) % 9 === 2 || ~~(i / 9) % 9 === 5,
        'border-r-transparent': i % 9 === 8,
        'border-b-transparent': ~~(i / 9) % 9 === 8,
      })}
      onClick={select}
      onFocus={select}
      onKeyDown={keyHandler}
    >
      <div
        className={cn('h-full grid place-items-center', {
          'bg-selection text-selection': isSelected,
          'bg-highlight':
            isNeighborOfSelected && state.settings.highlightNeighbors,
          'bg-default': !isSelected,
        })}
      >
        <span
          className={cn('font-display text-2xl select-none', {
            'text-light': fixed,
            'text-[#ff2020]': hasConflict && state.settings.showConflict,
          })}
        >
          {value || ''}
        </span>
      </div>
    </button>
  );
}

export default function Sudoku() {
  const { close } = useDesktopStore();
  const { id } = useWindow();

  /**
   * Fetch help MD
   */
  const [helpContent, setHelpContent] = useState('');
  useEffect(() => {
    const fetchMarkdown = async () => {
      const res = await fetch(
        '/fs/system/Applications/sudoku/resources/help.md',
      );
      if (res.ok) {
        setHelpContent(await res.text());
      }
    };

    fetchMarkdown();
  }, []);

  /**
   * Game state
   */
  const [state, dispatch] = useReducer(sudokuReducer, {
    board: null,
    selected: -1,
    settings: {
      highlightNeighbors: false,
      showConflict: true,
      difficulty: 'easy',
    },
    won: false,
  });

  /**
   * Timer
   */
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (state.won && timer) clearInterval(timer);
  }, [state.won, timer]);

  const stopTimer = () => {
    if (timer) clearInterval(timer);
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
    setTimer(newTimer);
  };

  /**
   * New game logic
   */
  const { load, data } = useFetcher<number[]>();
  const newGame = (difficulty: string = state.settings.difficulty) => {
    load(`/api/sudoku?difficulty=${difficulty}`);
    dispatch({
      type: 'settings',
      settings: { difficulty: difficulty as typeof state.settings.difficulty },
    });
    startTimer();
  };

  useEffect(() => {
    if (!data) return;

    const board = data.map((value) => ({ value, fixed: value !== 0 }));
    dispatch({ type: 'newGame', board });
  }, [data]);

  /**
   * Component UI
   */
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-row">
        <Menu.Root trigger={<Menu.Trigger>Game</Menu.Trigger>}>
          <Menu.Item label="New" onSelect={() => newGame()} />

          <Menu.Separator />

          <Menu.RadioGroup
            value={state.settings.difficulty}
            onValueChange={(value) => newGame(value)}
          >
            <Menu.RadioItem label="Easy" value="easy" />
            <Menu.RadioItem label="Medium" value="medium" />
            <Menu.RadioItem label="Hard" value="hard" />
          </Menu.RadioGroup>

          <Menu.Separator />

          <Menu.CheckboxItem
            label="Highlight adjacent"
            checked={state.settings.highlightNeighbors}
            onCheckedChange={(checked) =>
              dispatch({
                type: 'settings',
                settings: { highlightNeighbors: checked },
              })
            }
          />
          <Menu.CheckboxItem
            label="Show conflicts"
            checked={state.settings.showConflict}
            onCheckedChange={(checked) =>
              dispatch({
                type: 'settings',
                settings: { showConflict: checked },
              })
            }
          />

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={() => close(id)} />
        </Menu.Root>
      </div>

      <Toolbar>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
          <Button
            key={value}
            variant="light"
            className="w-8 h-8 text-center"
            disabled={state.selected < 0}
            onClick={() => dispatch({ type: 'set', value })}
          >
            <span className="font-display text-2xl leading-7">{value}</span>
          </Button>
        ))}

        <Button
          variant="light"
          className="py-2 px-4"
          disabled={state.selected < 0}
          onClick={() => dispatch({ type: 'set', value: 0 })}
        >
          <span>Clear</span>
        </Button>
      </Toolbar>

      <div className="bg-default bevel-content p-0.5">
        <div className="grid grid-cols-9 relative">
          {state.board?.map((cell, i) => {
            return (
              <SudokuCell
                key={i}
                index={i}
                state={state}
                {...cell}
                dispatch={dispatch}
              />
            );
          })}

          {state.board === null ? (
            <div className="col-span-9 w-[360px] h-[360px] p-4">
              <Markdown>{helpContent}</Markdown>

              <Button className="py-1 px-4 mt-6" onClick={() => newGame()}>
                Start game
              </Button>
            </div>
          ) : null}

          {state.won ? (
            <div className="absolute inset-0 bg-checkered-dark grid place-items-center">
              <div className="bg-surface bevel-window p-4">
                Puzzle solved. Congratulations!
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-row gap-0.5">
        <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
          Time: {Math.floor(time / 60)}:
          {(time % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
          Difficulty: {state.settings.difficulty.toUpperCase()}
        </div>
        <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
          {state.won ? 'Solved!' : ''}
        </div>
      </div>
    </div>
  );
}
