import type { WindowInit } from "@/components/desktop/Window";

export const solitaire: WindowInit<"solitaire"> = {
  appType: "solitaire",
  appState: undefined,

  title: "Solitaire",

  minWidth: 640,
  minHeight: 480,
};
