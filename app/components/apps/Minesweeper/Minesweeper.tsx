import cn from 'classnames';
import { useEffect, useState } from 'react';
import MinesweeperNumberDisplay from './MinesweeperNumberDisplay';
import Button from '~/components/ui/Button';
import Menu from '~/components/ui/Menu';
import { useDesktop } from '~/components/desktop/Desktop/context';
import { useWindow } from '~/components/desktop/Window/context';

enum GameState {
  NEW = 'new',
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}

enum FlagStatus {
  NONE,
  FLAGGED,
  QUESTION_MARK,
}

interface MinesweeperCell {
  hasMine: boolean;
  nearMines: number;
  flag: FlagStatus;
  revealed: boolean;
  exploded: boolean;
}

interface MinesweeperBoard {
  cells: MinesweeperCell[];
  width: number;
  height: number;
}

interface MinesweeperSettings {
  name: string;
  width: number;
  height: number;
  mines: number;
}

const difficultyPresets = {
  beginner: { name: 'beginner', width: 8, height: 8, mines: 10 },
  intermediate: { name: 'intermediate', width: 16, height: 16, mines: 40 },
  expert: { name: 'expert', width: 30, height: 16, mines: 99 },
};

function emptyCell(): MinesweeperCell {
  return {
    hasMine: false,
    nearMines: 0,
    flag: FlagStatus.NONE,
    revealed: false,
    exploded: false,
  };
}

function emptyBoard(w: number, h: number): MinesweeperBoard {
  return {
    cells: Array.from(Array(w * h), emptyCell),
    width: w,
    height: h,
  };
}

function neighbors(x0: number, y0: number, board: MinesweeperBoard) {
  const n: MinesweeperCell[] = [];
  for (let y = y0 - 1; y <= y0 + 1; y++)
    for (let x = x0 - 1; x <= x0 + 1; x++)
      if (x >= 0 && x < board.width && y >= 0 && y < board.height)
        n.push(board.cells[x + board.width * y]);

  return n;
}

function newBoard(settings: MinesweeperSettings) {
  const { width, height, mines } = settings;
  const board = emptyBoard(width, height);
  const size = width * height;

  // Place mines
  let placed = 0;
  while (placed < mines) {
    const index = Math.floor(Math.random() * size);
    const cell = board.cells[index];
    if (!cell.hasMine) {
      cell.hasMine = true;
      placed++;
    }
  }

  // Calculate # of nearby mines for each cell
  for (let y = 0; y < board.height; y++)
    for (let x = 0; x < board.width; x++) {
      const cell = board.cells[x + board.width * y];

      cell.nearMines = neighbors(x, y, board).filter((nb) => nb.hasMine).length;
    }

  return board;
}

export default function Minesweeper() {
  const { dispatch } = useDesktop();
  const { id } = useWindow();

  /**
   * Game state
   */
  const [settings, setSettings] = useState(difficultyPresets.beginner);
  const [board, setBoard] = useState<MinesweeperBoard>();
  const [gameState, setGameState] = useState(GameState.NEW);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  /**
   * Helpers
   */
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

  const reset = (settings: MinesweeperSettings) => {
    setSettings(settings);
    setBoard(newBoard(settings));
    setGameState(GameState.NEW);
    resetTimer();
  };

  const startGame = () => {
    setGameState(GameState.PLAYING);
    startTimer();
  };

  const winGame = () => {
    setGameState(GameState.WON);
    stopTimer();
  };

  const loseGame = () => {
    setGameState(GameState.LOST);
    stopTimer();
  };

  const exit = () => {
    dispatch({ type: 'close', id });
  }

  // This genuinely only ever needs to run once, on first render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reset(settings), []);

  /**
   * Game actions
   */
  const reveal = (board: MinesweeperBoard, i: number) => {
    const cell = board.cells[i];
    if (cell.revealed) return;

    cell.revealed = true;

    if (cell.nearMines === 0 && !cell.hasMine) {
      const x = i % board.width;
      const y = ~~(i / board.width);

      neighbors(x, y, board).forEach((nb) => {
        if (!nb.revealed && !nb.hasMine && nb.flag !== FlagStatus.FLAGGED) {
          const nbi = board.cells.indexOf(nb);
          reveal(board, nbi);
        }
      });
    }
  };

  const onCellClick = (i: number) => {
    if (!board) return;

    if (gameState === GameState.NEW) startGame();

    const newBoard = {
      ...board,
      cells: board.cells.slice(),
    };
    const cell = newBoard.cells[i];
    if (cell.flag === FlagStatus.FLAGGED) return;

    reveal(newBoard, i);

    if (cell.hasMine) {
      // Kaboom
      loseGame();
      cell.exploded = true;

      // Reveal all mines and wrongly flagged cells
      newBoard.cells.forEach((c, ci) => {
        if (
          (c.hasMine && c.flag !== FlagStatus.FLAGGED) ||
          (!c.hasMine && c.flag === FlagStatus.FLAGGED)
        )
          reveal(board, ci);
      });
    } else {
      // Win state #1: all cells without mines revealed
      const win = newBoard.cells
        .filter((cell) => !cell.revealed)
        .every((cell) => cell.hasMine);

      if (win) winGame();
    }

    setBoard(newBoard);
  };

  const onCellRightClick = (ev: React.MouseEvent, i: number) => {
    ev.preventDefault();
    if (!board) return;

    if (gameState === GameState.NEW) startGame();

    const newBoard = {
      ...board,
      cells: board.cells.slice(),
    };

    const cell = newBoard.cells[i];
    if (cell.revealed) return;

    cell.flag = (cell.flag + 1) % 3;

    // Win state #2: all mines correctly flagged
    const allMinesFlagged = newBoard.cells
      .filter((cell) => cell.hasMine)
      .every((cell) => cell.flag === FlagStatus.FLAGGED);

    const newFlagCount = newBoard.cells.filter(
      (cell) => cell.flag === FlagStatus.FLAGGED,
    ).length;

    if (allMinesFlagged && newFlagCount === settings.mines) winGame();

    setBoard(newBoard);
  };

  const flagCount = board?.cells.filter(
    (cell) => cell.flag === FlagStatus.FLAGGED,
  ).length;
  const playing =
    gameState === GameState.NEW || gameState === GameState.PLAYING;

  return (
    <div className="select-none">
      <div className="flex flex-row gap-1 mb-0.5">
        <Menu.Root trigger={<Menu.Trigger>Game</Menu.Trigger>}>
          <Menu.Item label="New" onSelect={() => reset(settings)} />

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

          <Menu.Item label="Exit" onSelect={exit} />
        </Menu.Root>
      </div>

      <div className="bg-surface bevel flex flex-col p-2 gap-2 m-0.5 group/game">
        <div className="bg-surface bevel-light-inset flex flex-row p-1 gap-1 items-center">
          <MinesweeperNumberDisplay value={settings.mines - (flagCount ?? 0)} />

          <Button onClick={() => reset(settings)} className="mx-auto">
            <img
              src="/img/ui/mine/smiley.png"
              className={cn('group-active/game:hidden', { hidden: !playing })}
              alt=":)"
            />

            <img
              src="/img/ui/mine/smiley-click.png"
              className={cn('hidden', { 'group-active/game:inline': playing })}
              alt=":o"
            />

            <img
              src="/img/ui/mine/smiley-dead.png"
              className={cn({ hidden: gameState !== GameState.LOST })}
              alt="X("
            />

            <img
              src="/img/ui/mine/smiley-win.png"
              className={cn({ hidden: gameState !== GameState.WON })}
              alt="B)"
            />
          </Button>

          <MinesweeperNumberDisplay value={time} />
        </div>

        <div
          className={cn(
            'bg-surface bevel-content p-0.5 grid auto-rows-auto justify-start',
            {
              'pointer-events-none':
                gameState === GameState.WON || gameState === GameState.LOST,
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
                  <img src="/img/ui/mine/mine.png" alt="mine" />
                ) : cell.flag === FlagStatus.FLAGGED ? (
                  <img src="/img/ui/mine/wrong.png" alt="mine" />
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
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
