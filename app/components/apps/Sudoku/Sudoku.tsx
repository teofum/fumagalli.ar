import type { Dispatch, ReducerAction, ReducerState } from 'react';
import { useEffect, useReducer, useRef, useState } from 'react';
import sudokuReducer from './reducer';
import Menu from '~/components/ui/Menu';
import cn from 'classnames';
import Button, { IconButton } from '~/components/ui/Button';
import { useWindow } from '~/components/desktop/Window/context';
import { useFetcher } from '@remix-run/react';
import Markdown from '~/components/ui/Markdown';
import { Toolbar, ToolbarGroup } from '~/components/ui/Toolbar';
import { useAppSettings } from '~/stores/system';
import type { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import type { SudokuPuzzle } from '~/routes/api.sudoku';
import type { SudokuSettings } from './types';
import { ToggleIconButton } from '~/components/ui/ToggleButton';

export const sudokuComponents = {
  h1: (props) => <h1 className="font-display text-2xl text-h1" {...props} />,
  h2: (props) => <h2 className="bold text-h2 mt-4" {...props} />,
  em: (props) => <span className="not-italic text-accent" {...props} />,
} satisfies ReactMarkdownOptions['components'];

const resources = '/fs/Applications/sudoku/resources';

interface CellProps {
  index: number;
  value: number;
  fixed: boolean;
  annotations: Set<number>;
  game: ReducerState<typeof sudokuReducer>;
  dispatch: Dispatch<ReducerAction<typeof sudokuReducer>>;
  settings: SudokuSettings;
  boardRef: React.RefObject<HTMLDivElement>;
  annotate: boolean;
}

function SudokuCell({
  index: i,
  value,
  fixed,
  annotations,
  game,
  dispatch,
  settings,
  boardRef,
  annotate,
}: CellProps) {
  const { id } = useWindow();

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

  const allPlaced = (number: number) => {
    if (!game.board) return false;
    return game.board.filter((cell) => cell.value === number).length === 9;
  };

  const select = () => dispatch({ type: 'select', index: i });
  const keyHandler = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Backspace') {
      dispatch({ type: 'set', value: 0 });
      dispatch({ type: 'clearAnnotation' });
    } else if (ev.code.match(/^Digit[0-9]$/)) {
      const value = Number(ev.code.substring(5));
      const annotation = ev.altKey ? !annotate : annotate;
      if (!allPlaced(value)) {
        const type = annotation
          ? annotations.has(value)
            ? 'resetAnnotation'
            : 'setAnnotation'
          : 'set';
        dispatch({ type, value });
      }
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

      const next = boardRef.current?.querySelector(`#${id}_cell_${x + 9 * y}`);
      (next as HTMLElement | null)?.focus();
    }
  };

  return (
    <div
      id={`${id}_cell_${i}`}
      className={cn('w-10 h-10 border-r border-b border-surface-dark button', {
        'border-r-surface-darker': i % 9 === 2 || i % 9 === 5,
        'border-b-surface-darker': ~~(i / 9) % 9 === 2 || ~~(i / 9) % 9 === 5,
        'border-r-transparent': i % 9 === 8,
        'border-b-transparent': ~~(i / 9) % 9 === 8,
      })}
      tabIndex={0}
      onFocus={select}
      onKeyDown={keyHandler}
    >
      <div
        className={cn('h-full grid place-items-center relative select-none', {
          'bg-selection text-selection': isSelected,
          'bg-default': !isSelected,
          'bg-highlight': isNeighborOfSelected && settings.highlightNeighbors,
        })}
      >
        <span
          className={cn('font-display text-2xl', {
            'text-[#ff2020]': hasConflict && settings.showConflict,
            'text-light': fixed && !hasConflict,
          })}
        >
          {value || ''}
        </span>

        <div
          className={cn('absolute inset-0 grid grid-cols-3 text-light', {
            hidden: value !== 0,
          })}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              className="text-center leading-[13px] w-[13px] h-[13px]"
            >
              {annotations.has(n) ? n : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Sudoku() {
  const { close } = useWindow();
  const [settings, set] = useAppSettings('sudoku');

  const boardRef = useRef<HTMLDivElement>(null);
  const [annotate, setAnnotate] = useState(false);

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
    history: [],
    undoCount: 0,
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
      setTime((time) => time + 1);
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
   * History
   */
  const canUndo = game.history.length > game.undoCount + 1;
  const undo = () => dispatch({ type: 'undo' });

  const canRedo = game.undoCount > 0;
  const redo = () => dispatch({ type: 'redo' });

  /**
   * Helpers
   */
  const allPlaced = (number: number) => {
    if (!game.board) return false;
    return game.board.filter((cell) => cell.value === number).length === 9;
  };

  const onNumberClick = (value: number) => {
    if (!game.board) return;

    const cell = game.board[game.selected];
    const type = annotate
      ? cell.annotations.has(value)
        ? 'resetAnnotation'
        : 'setAnnotation'
      : 'set';
    dispatch({ type, value });
  };

  const onResetClick = () => {
    dispatch({ type: 'set', value: 0 });
    dispatch({ type: 'clearAnnotation' });
  };

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

          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.Sub label="Toolbar">
            <Menu.RadioGroup
              value={settings.toolbarPosition}
              onValueChange={(value) => set({ toolbarPosition: value as any })}
            >
              <Menu.RadioItem label="Top" value="top" />
              <Menu.RadioItem label="Bottom" value="bottom" />
            </Menu.RadioGroup>
          </Menu.Sub>

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
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>Move</Menu.Trigger>}>
          <Menu.Item label="Undo" disabled={!canUndo} onSelect={undo} />
          <Menu.Item label="Redo" disabled={!canRedo} onSelect={redo} />
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup
        className={cn({ 'order-2': settings.toolbarPosition === 'bottom' })}
      >
        <Toolbar>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
            <Button
              key={value}
              variant="light"
              className="w-8 h-8 text-center"
              disabled={game.selected < 0 || allPlaced(value)}
              onClick={() => onNumberClick(value)}
            >
              <span className="font-display text-2xl leading-7">{value}</span>
            </Button>
          ))}

          <IconButton
            variant="light"
            className="w-8 h-8"
            imageUrl={`${resources}/clear.png`}
            disabled={game.selected < 0}
            onClick={onResetClick}
          />

          <ToggleIconButton
            variant="light"
            className="w-8 h-8"
            imageUrl={`${resources}/pencil.png`}
            disabled={game.selected < 0}
            pressed={annotate}
            onPressedChange={setAnnotate}
          />
        </Toolbar>
      </ToolbarGroup>

      <div className="bg-default bevel-content p-0.5 order-1">
        <div className="grid grid-cols-9 relative" ref={boardRef}>
          {game.board?.map((cell, i) => {
            return (
              <SudokuCell
                key={i}
                index={i}
                game={game}
                {...cell}
                dispatch={dispatch}
                settings={settings}
                boardRef={boardRef}
                annotate={annotate}
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

      <div className="flex flex-row gap-0.5 order-3">
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
