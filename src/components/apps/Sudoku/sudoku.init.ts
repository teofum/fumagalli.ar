import type { WindowInit } from "@/components/desktop/Window";
import { WindowSizingMode } from "@/components/desktop/Window/WindowSizingMode";

export const sudoku: WindowInit<"sudoku"> = {
  appType: "sudoku",
  appState: undefined,

  title: "Sudoku",

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
