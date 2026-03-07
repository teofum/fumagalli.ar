import type { WindowInit } from "@/components/desktop/Window";
import { type HelpState, defaultHelpState } from "./types";

export const help = (
  initialState?: Partial<HelpState>,
): WindowInit<"help"> => ({
  appType: "help",
  appState: {
    ...defaultHelpState,
    ...initialState,
    history: [initialState?.openId ?? defaultHelpState.openId],
  },

  title: "Help",

  minWidth: 480,
  minHeight: 400,

  width: 480,
  height: 600,
});
