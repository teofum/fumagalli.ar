import Button from "@/components/ui/Button";
import MinesweeperNumberDisplay from "./MinesweeperNumberDisplay";
import { FlagStatus, MinesweeperState, type MinesweeperBoard } from "./types";
import { getAppResourcesUrl } from "@/content/utils";
import cn from "classnames";

const resources = getAppResourcesUrl("mine");

interface MinesweeperStatusProps {
  board: MinesweeperBoard;
  state: MinesweeperState;
  reset: () => void;
  time: number;
}

export default function MinesweeperStatus({
  board,
  state,
  reset,
  time,
}: MinesweeperStatusProps) {
  const flagCount = board.cells.filter(
    (cell) => cell.flag === FlagStatus.FLAGGED,
  ).length;

  const mineCount = board.cells.filter((cell) => cell.hasMine).length;

  const playing =
    state === MinesweeperState.NEW || state === MinesweeperState.PLAYING;

  return (
    <div className="bg-surface bevel-light-inset flex flex-row p-1 gap-1 items-center">
      <MinesweeperNumberDisplay value={mineCount - (flagCount ?? 0)} />

      <Button onClick={() => reset()} className="mx-auto">
        <img
          src={`${resources}/smiley.png`}
          className={cn("group-active/game:hidden", { hidden: !playing })}
          alt=":)"
        />

        <img
          src={`${resources}/smiley-click.png`}
          className={cn("hidden", { "group-active/game:inline": playing })}
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
