import type { Dispatch, ReducerAction, ReducerState } from 'react';
import { useEffect, useReducer, useRef, useState } from 'react';
import sudokuReducer from './reducer';
import Menu from '~/components/ui/Menu';
import cn from 'classnames';
import Button from '~/components/ui/Button';
import { useWindow } from '~/components/desktop/Window/context';
import { useFetcher } from '@remix-run/react';
import Markdown from '~/components/ui/Markdown';
import { Toolbar, ToolbarGroup } from '~/components/ui/Toolbar';
import { useAppSettings } from '~/stores/system';
import type { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import type { SudokuPuzzle } from '~/routes/api.sudoku';

export const sudokuComponents = {
  h1: (props) => <h1 className="font-display text-2xl text-h1" {...props} />,
  h2: (props) => <h2 className="bold text-h2 mt-4" {...props} />,
  em: (props) => <span className="not-italic text-accent" {...props} />,
} satisfies ReactMarkdownOptions['components'];

interface CellProps {
  index: number;
  value: number;
  fixed: boolean;
  game: ReducerState<typeof sudokuReducer>;
  dispatch: Dispatch<ReducerAction<typeof sudokuReducer>>;
}

function SudokuCell({ index: i, value, fixed, game, dispatch }: CellProps) {
  const [settings] = useAppSettings('sudoku');

  const x = i % 9;
  const y = Math.floor(i / 9);
  const block = Math.floor(x / 3) + 3 * Math.floor(y / 3);

  const sx = game.selected % 9;
  const sy = Math.floor(game.selected / 9);
  const sblock = Math.floor(sx / 3) + 3 * Math.floor(sy / 3);

  const isSelected = game.selected === i;
  const isNeighborOfSelected =
    !isSelected && (x === sx || y === sy || block === sblock);

  const hasConflict =
    isNeighborOfSelected &&
    value !== 0 &&
    value === game.board?.[game.selected]?.value;

  const select = () => dispatch({ type: 'select', index: i });
  const keyHandler = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Backspace') {
      dispatch({ type: 'set', value: 0 });
    } else if (ev.key.match(/^[0-9]$/)) {
      dispatch({ type: 'set', value: Number(ev.key) });
    } else if (ev.key.includes('Arrow')) {
      let x = game.selected % 9;
      let y = Math.floor(game.selected / 9);

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
          'bg-default': !isSelected,
          'bg-highlight': isNeighborOfSelected && settings.highlightNeighbors,
        })}
      >
        <span
          className={cn('font-display text-2xl select-none', {
            'text-[#ff2020]': hasConflict && settings.showConflict,
            'text-light': fixed && !hasConflict,
          })}
        >
          {value || ''}
        </span>
      </div>
    </button>
  );
}

export default function Sudoku() {
  const { close } = useWindow();

  const [settings, set] = useAppSettings('sudoku');

  /**
   * Fetch help MD
   */
  const [helpContent, setHelpContent] = useState('');
  useEffect(() => {
    const fetchMarkdown = async () => {
      const res = await fetch('/fs/Applications/sudoku/resources/help.md');
      if (res.ok) {
        setHelpContent(await res.text());
      }
    };

    fetchMarkdown();
  }, []);

  /**
   * Game state
   */
  const [game, dispatch] = useReducer(sudokuReducer, {
    board: null,
    difficulty: 'easy',
    puzzleNumber: -1,
    selected: -1,
    won: false,
  });

  /**
   * Timer
   */
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const lastStateRef = useRef(game.won);
  useEffect(() => {
    if (!lastStateRef.current && game.won && timer) clearInterval(timer);
    lastStateRef.current = game.won;
  }, [game.won, timer]);

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
  const { load, data } = useFetcher<SudokuPuzzle>();
  const newGame = (difficulty = settings.difficulty) => {
    load(`/api/sudoku?difficulty=${difficulty}`);
    startTimer();

    if (difficulty !== settings.difficulty) set({ difficulty });
  };

  useEffect(() => {
    if (!data) return;

    dispatch({ type: 'newGame', puzzle: data });
  }, [data]);

  /**
   * Component UI
   */
  return (
    <div className="flex flex-col gap-0.5">
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>Game</Menu.Trigger>}>
          <Menu.Item label="New" onSelect={() => newGame()} />

          <Menu.Separator />

          <Menu.RadioGroup
            value={settings.difficulty}
            onValueChange={(value) => newGame(value as any)}
          >
            <Menu.RadioItem label="Easy" value="easy" />
            <Menu.RadioItem label="Medium" value="medium" />
            <Menu.RadioItem label="Hard" value="hard" />
          </Menu.RadioGroup>

          <Menu.Separator />

          <Menu.CheckboxItem
            label="Highlight adjacent"
            checked={settings.highlightNeighbors}
            onCheckedChange={(checked) => set({ highlightNeighbors: checked })}
          />
          <Menu.CheckboxItem
            label="Show conflicts"
            checked={settings.showConflict}
            onCheckedChange={(checked) => set({ showConflict: checked })}
          />

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup>
        <Toolbar>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
            <Button
              key={value}
              variant="light"
              className="w-8 h-8 text-center"
              disabled={game.selected < 0}
              onClick={() => dispatch({ type: 'set', value })}
            >
              <span className="font-display text-2xl leading-7">{value}</span>
            </Button>
          ))}

          <Button
            variant="light"
            className="py-2 px-4"
            disabled={game.selected < 0}
            onClick={() => dispatch({ type: 'set', value: 0 })}
          >
            <span>Clear</span>
          </Button>
        </Toolbar>
      </ToolbarGroup>

      <div className="bg-default bevel-content p-0.5">
        <div className="grid grid-cols-9 relative">
          {game.board?.map((cell, i) => {
            return (
              <SudokuCell
                key={i}
                index={i}
                game={game}
                {...cell}
                dispatch={dispatch}
              />
            );
          })}

          {game.board === null ? (
            <div className="col-span-9 w-[360px] h-[360px] p-4">
              <Markdown components={sudokuComponents}>{helpContent}</Markdown>

              <Button className="py-1 px-4 mt-6" onClick={() => newGame()}>
                Start game
              </Button>
            </div>
          ) : null}

          {game.won ? (
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
        {game.puzzleNumber > 0 ? (
          <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1 capitalize">
            {game.difficulty} #{game.puzzleNumber}
          </div>
        ) : (
          <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1 capitalize">
            Difficulty: {settings.difficulty}
          </div>
        )}
        <div className="flex-1 bg-surface bevel-light-inset py-0.5 px-1">
          {game.won ? 'Solved!' : ''}
        </div>
      </div>
    </div>
  );
}
