import { useEffect, useReducer, useRef, useState } from "react";
import cn from "classnames";

import { useWindow } from "@/components/desktop/Window/context";
import Menu from "@/components/ui/Menu";

import { useAppSettings } from "@/stores/system";

import { difficultyPresets, newBoard } from "./game";
import { MinesweeperState } from "./types";
import minesweeperReducer from "./reducer";
import MinesweeperStatus from "./MinesweeperStatus";
import MinesweeperCell from "./MinesweeperCell";
import {
  type MinesweeperCustomDifficultyState,
  mine_difficulty,
} from "./modals/CustomDifficulty";

export default function Minesweeper() {
  const { close, modal } = useWindow();

  const [settings, set] = useAppSettings("minesweeper");

  /**
   * Game state
   */
  const [{ board, state }, dispatch] = useReducer(minesweeperReducer, {
    board: newBoard(settings),
    state: MinesweeperState.NEW,
  });

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
    dispatch({ type: "reveal", cellIndex });
  };

  const onCellRightClick = (ev: React.MouseEvent, cellIndex: number) => {
    ev.preventDefault();
    dispatch({ type: "cycleFlag", cellIndex });
  };

  const reset = (s = settings) => {
    dispatch({ type: "newGame", settings: s });
    set(s);
  };

  /**
   * Utils
   */
  const playing =
    state === MinesweeperState.NEW || state === MinesweeperState.PLAYING;

  const dialogInitialState = {
    ...settings,
    commit: (settings) => reset(settings),
  } satisfies MinesweeperCustomDifficultyState;

  /**
   * Comopnent UI
   */
  return (
    <div className="select-none">
      <Menu.Bar className="mb-0.5">
        <Menu.Menu trigger={<Menu.Trigger>Game</Menu.Trigger>}>
          <Menu.Item label="New" onSelect={() => reset()} />

          <Menu.Separator />

          <Menu.CheckboxItem
            label="Beginner"
            checked={settings.name === "beginner"}
            onSelect={() => reset(difficultyPresets.beginner)}
          />
          <Menu.CheckboxItem
            label="Intermediate"
            checked={settings.name === "intermediate"}
            onSelect={() => reset(difficultyPresets.intermediate)}
          />
          <Menu.CheckboxItem
            label="Expert"
            checked={settings.name === "expert"}
            onSelect={() => reset(difficultyPresets.expert)}
          />
          <Menu.CheckboxItem
            label="Custom..."
            checked={settings.name === "custom"}
            onSelect={() => modal(mine_difficulty(dialogInitialState))}
          />

          <Menu.Separator />

          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Menu>
      </Menu.Bar>

      <div className="bg-surface bevel flex flex-col p-2 gap-2 m-0.5 group/game">
        <MinesweeperStatus
          board={board}
          state={state}
          time={time}
          reset={reset}
        />

        <div
          className={cn(
            "bg-surface bevel-content p-0.5 grid auto-rows-auto justify-start",
            { "pointer-events-none": !playing },
          )}
          style={{ gridTemplateColumns: `repeat(${board?.width}, auto)` }}
        >
          {board?.cells.map((cell, i) => (
            <MinesweeperCell
              key={i}
              cell={cell}
              onClick={() => onCellClick(i)}
              onContextMenu={(ev) => onCellRightClick(ev, i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
