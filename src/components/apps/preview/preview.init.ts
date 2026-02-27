import type { WindowInit } from "@/components/desktop/Window";
import { type PreviewState, previewDefaultState } from "./types";

export const preview = (
  initialState?: PreviewState,
): WindowInit<"preview"> => ({
  appType: "preview",
  appState: initialState ?? previewDefaultState,

  title: "Preview",
  icon: "preview",

  minWidth: 320,
  width: 720,
});
