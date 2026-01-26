import { getAppResourcesUrl } from "@/content/utils";
import { FlagStatus, type MinesweeperCell as CellType } from "./types";
import cn from "classnames";

const resources = getAppResourcesUrl("mine");

interface MinesweeperCellProps {
  onClick: (ev: React.MouseEvent) => void;
  onContextMenu: (ev: React.MouseEvent) => void;
  cell: CellType;
}

export default function MinesweeperCell({
  onClick,
  onContextMenu,
  cell,
}: MinesweeperCellProps) {
  return (
    <button
      className="relative w-4 h-4 group border-r border-b border-light"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div
        className={cn(
          "w-full h-full grid place-items-center",
          "font-minesweeper text-xl",
          {
            "bg-[red]": cell.exploded,
            "group-active:hidden":
              !cell.revealed && cell.flag !== FlagStatus.FLAGGED,
            "text-[#0000ff]": cell.nearMines === 1,
            "text-[#008000]": cell.nearMines === 2,
            "text-[#ff0000]": cell.nearMines === 3,
            "text-[#000080]": cell.nearMines === 4,
            "text-[#800000]": cell.nearMines === 5,
            "text-[#008080]": cell.nearMines === 6,
            "text-[#800080]": cell.nearMines === 7,
            "text-[#505050]": cell.nearMines === 8,
          },
        )}
      >
        {cell.hasMine ? (
          <img src={`${resources}/mine.png`} alt="mine" />
        ) : cell.flag === FlagStatus.FLAGGED ? (
          <img src={`${resources}/wrong.png`} alt="mine" />
        ) : (
          cell.nearMines || ""
        )}
      </div>

      <div
        className={cn("absolute top-0 left-0 w-4 h-4 bg-surface bevel", {
          hidden: cell.revealed,
          "group-active:hidden": cell.flag !== FlagStatus.FLAGGED,
        })}
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
  );
}
