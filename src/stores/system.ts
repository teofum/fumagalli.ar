import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { merge } from 'ts-deepmerge';

import type { AnyFile } from '@/schemas/file';
import type { Folder } from '@/schemas/folder';

import {
  defaultTheme,
  type ThemeCustomization,
  type SystemTheme,
} from '@/components/apps/ThemeSettings/types';

import {
  defaultFilesSettings,
  type FilesSettings,
} from '@/components/apps/Files/types';
import {
  defaultMinesweeperSettings,
  type MinesweeperSettings,
} from '@/components/apps/Minesweeper/types';
import {
  defaultSolitaireSettings,
  type SolitaireSettings,
} from '@/components/apps/Solitaire/types';
import {
  defaultSudokuSettings,
  type SudokuSettings,
} from '@/components/apps/Sudoku/types';
import {
  defaultDitherLabSettings,
  type DitherLabSettings,
} from '@/components/apps/DitherLab/types';
import {
  defaultPaintSettings,
  type PaintSettings,
} from '@/components/apps/Paint/types';
import {
  defaultHelpSettings,
  type HelpSettings,
} from '@/components/apps/Help/types';
import {
  defaultSystemSettings,
  type SystemSettings,
} from '@/components/apps/SystemSettings/types';

const MAX_FILE_HISTORY = 10; // Number of last accessed files to keep
const MAX_DIR_HISTORY = 10; // Number of last accessed directories to keep

// Schema version, ensures incompatible data isn't loaded
// CHANGING THIS WILL WIPE ALL DATA FOR EVERYONE.
// Update ONLY for breaking changes to the schema.
const SCHEMA_VERSION = 2;

// V2: Switched to Sanity for content

export interface FileAccess {
  time: number;
  item: AnyFile;
}

export interface DirectoryAccess {
  time: number;
  item: Folder;
}

interface SystemState {
  appSettings: {
    files: FilesSettings;
    solitaire: SolitaireSettings;
    sudoku: SudokuSettings;
    minesweeper: MinesweeperSettings;
    dither: DitherLabSettings;
    paint: PaintSettings;
    help: HelpSettings;
  };
  fileHistory: FileAccess[];
  dirHistory: DirectoryAccess[];
  theme: SystemTheme;
  themeCustomizations: ThemeCustomization;
  settings: SystemSettings;

  _schema: number;
}

export type AppWithSettings = keyof SystemState['appSettings'];
export type AppSettings<T extends AppWithSettings> =
  SystemState['appSettings'][T];

export type UpdateAppSettingsAction = <T extends AppWithSettings>(
  app: T,
  settings: Partial<AppSettings<T>>,
) => void;

interface SystemActions {
  // Application settings
  updateAppSettings: UpdateAppSettingsAction;

  // File and folder history
  saveFileToHistory: (item: FileAccess) => void;
  saveDirToHistory: (item: DirectoryAccess) => void;

  // System theme and settings
  updateTheme: (theme: SystemTheme) => void;
  updateThemeCustomizations: (theme: Partial<ThemeCustomization>) => void;
  updateSettings: (settings: SystemSettings) => void;
}

/**
 * System store handles system-wide "background" persistent state, like
 * application settings, system settings, user preferences, etc.
 */
const useSystemStore = create<SystemState & SystemActions>()(
  persist(
    (set) => ({
      /**
       * State
       */
      appSettings: {
        files: defaultFilesSettings,
        solitaire: defaultSolitaireSettings,
        sudoku: defaultSudokuSettings,
        minesweeper: defaultMinesweeperSettings,
        dither: defaultDitherLabSettings,
        paint: defaultPaintSettings,
        help: defaultHelpSettings,
      },
      fileHistory: [],
      dirHistory: [],
      theme: defaultTheme,
      themeCustomizations: {
        backgroundImageMode: 'fill',
        backgroundColor: 'rgb(0 0 0)',
        backgroundUrl: '/assets/backgrounds/Chess.png',
      },
      settings: defaultSystemSettings,

      _schema: SCHEMA_VERSION,

      /**
       * Actions
       */
      updateAppSettings: (app, settings) =>
        set(({ appSettings }) => ({
          appSettings: {
            ...appSettings,
            [app]: { ...appSettings[app], ...settings },
          },
        })),

      saveFileToHistory: (item) =>
        set(({ fileHistory }) => ({
          fileHistory: [
            item,
            ...fileHistory.filter(
              (historyItem) => historyItem.item._id !== item.item._id,
            ),
          ].slice(0, MAX_FILE_HISTORY),
        })),
      saveDirToHistory: (item) =>
        set(({ dirHistory }) => ({
          dirHistory: [
            item,
            ...dirHistory.filter(
              (historyItem) => historyItem.item._id !== item.item._id,
            ),
          ].slice(0, MAX_DIR_HISTORY),
        })),

      updateTheme: (theme) => set(() => ({ theme })),
      updateThemeCustomizations: (theme) =>
        set(({ themeCustomizations }) => ({
          themeCustomizations: { ...themeCustomizations, ...theme },
        })),
      updateSettings: (settings) => set(() => ({ settings })),
    }),
    {
      name: 'system-storage',
      merge: (persisted, current) => {
        // Ugly hack so I don't have to change the schema version and wipe data
        // Reset desktop background because its location changed
        // TODO remove this after a while (let's say, 2024?)
        if (
          (
            persisted as typeof current
          ).themeCustomizations.backgroundUrl?.includes('/system/')
        )
          (persisted as typeof current).themeCustomizations.backgroundUrl =
            '/assets/backgrounds/Chess.png';

        // Wipe persisted state on schema version change
        // This will allow me to safely introduce breaking schema changes
        // without causing the app to crash for existing users
        if ((persisted as typeof current)._schema !== current._schema)
          return current;

        // We'll assume the persisted state is valid and hasn't been tampered
        // with, otherwise making this type-safe is a nightmare
        return merge.withOptions(
          { mergeArrays: false },
          current,
          persisted as typeof current,
        );
      },
    },
  ),
);

export default useSystemStore;
