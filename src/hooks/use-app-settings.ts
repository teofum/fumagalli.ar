import useSystemStore, { AppSettings, AppWithSettings } from '@/stores/system';
import { useState } from 'react';

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
