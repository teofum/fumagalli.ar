import { useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  defaultFilesSettings,
  type FilesSettings,
} from '~/components/apps/Files/types';

import type { AnyFile, Directory } from '~/content/types';

const MAX_FILE_HISTORY = 10; // Number of last accessed files to keep
const MAX_DIR_HISTORY = 10; // Number of last accessed directories to keep

export interface FileAccess {
  time: number;
  path: string;
  item: AnyFile;
}

export interface DirectoryAccess {
  time: number;
  path: string;
  item: Directory;
}

interface SystemState {
  appSettings: {
    files: FilesSettings;
  };
  fileHistory: FileAccess[];
  dirHistory: DirectoryAccess[];
}

type AppWithSettings = keyof SystemState['appSettings'];
type AppSettings<T extends AppWithSettings> = SystemState['appSettings'][T];

type UpdateAppSettingsAction = <T extends AppWithSettings>(
  app: T,
  settings: Partial<AppSettings<T>>,
) => void;

interface SystemActions {
  // Application settings
  updateAppSettings: UpdateAppSettingsAction;

  // File and folder history
  saveFileToHistory: (item: FileAccess) => void;
  saveDirToHistory: (item: DirectoryAccess) => void;
}

/**
 * System store handles system-wide "background" persistent state, like
 * application settings, system settings, user preferences, etc.
 */
const useSystemStore = create<SystemState & SystemActions>()(
  persist(
    (set, get) => ({
      /**
       * State
       */
      appSettings: {
        files: defaultFilesSettings,
      },
      fileHistory: [],
      dirHistory: [],

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
              (historyItem) => historyItem.path !== item.path,
            ),
          ].slice(0, MAX_FILE_HISTORY),
        })),
      saveDirToHistory: (item) =>
        set(({ dirHistory }) => ({
          dirHistory: [
            item,
            ...dirHistory.filter(
              (historyItem) => historyItem.path !== item.path,
            ),
          ].slice(0, MAX_DIR_HISTORY),
        })),
    }),
    { name: 'system-storage' },
  ),
);

export default useSystemStore;

/**
 * Helper hook that selects and exposes a single app's settings from the system
 * store. This version caches settings in local state with `useState`, so
 * existing windows aren't affected by setting changes in another window.
 *
 * Independent window state will not be kept on reload, all windows will reset
 * to the globally set config. Because settings are merged, the global state and
 * new windows may have settings different to any existing windows.
 *
 * If you want settings to immediately sync across all open windows, use
 * `useSyncedAppSettings` instead.
 */
export function useAppSettings<T extends AppWithSettings>(app: T) {
  const settings: AppSettings<T> = useSystemStore(
    (store) => store.appSettings[app],
  );
  const [cached, setCached] = useState(settings);

  const { updateAppSettings } = useSystemStore();
  const set = (s: Partial<AppSettings<T>>) => {
    updateAppSettings(app, s);
    setCached({ ...cached, ...s });
  };

  return [cached, set] as const;
}

/**
 * Helper hook that selects and exposes a single app's settings from the system
 * store. This version doesn't cache settings, and will cause changes in
 * settings to immediately sync across all open windows.
 */
export function useSyncedAppSettings<T extends AppWithSettings>(app: T) {
  const settings: AppSettings<T> = useSystemStore(
    (store) => store.appSettings[app],
  );

  const { updateAppSettings } = useSystemStore();
  const set = (s: Partial<AppSettings<T>>) => updateAppSettings(app, s);

  return [settings, set] as const;
}
