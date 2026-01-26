import type { WindowInit } from "@/components/desktop/Window";
import { WindowSizingMode } from "@/components/desktop/Window/WindowSizingMode";

export const themeSettings: WindowInit<"theme"> = {
  appType: "theme",
  appState: undefined,

  title: "System Theme",

  sizingX: WindowSizingMode.AUTO,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
