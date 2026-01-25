import type { WindowInit } from "@/components/desktop/Window";
import { WindowSizingMode } from "@/components/desktop/Window/WindowSizingMode";

export const minesweeper: WindowInit<"mine"> = {
  appType: "mine",
  appState: undefined,

  title: "Minesweeper",
  icon: "mine",

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
