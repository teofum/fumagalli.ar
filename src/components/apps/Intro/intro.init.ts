import type { WindowInit } from "@/components/desktop/Window";
import { WindowSizingMode } from "@/components/desktop/Window/WindowSizingMode";

export const intro: WindowInit<"intro"> = {
  appType: "intro",
  appState: undefined,

  title: "About me",
  icon: "man-with-hat",

  width: 640,

  sizingX: WindowSizingMode.FIXED,
  sizingY: WindowSizingMode.AUTO,

  maximizable: false,
};
