import Menu from '~/components/ui/Menu';
import HelpContent from './HelpContent';
import HelpTreeView from './HelpTreeView';
import { useAppState, useWindow } from '~/components/desktop/Window/context';
import { Toolbar, ToolbarGroup } from '~/components/ui/Toolbar';
import { useAppSettings } from '~/stores/system';
import { IconButton } from '~/components/ui/Button';
import { useCallback } from 'react';
import { defaultHelpState } from './types';

const MAX_HISTORY = 1000;
const resources = '/fs/Applications/help/resources';

export default function Help() {
  const { close } = useWindow();
  const [state, setState] = useAppState('help');
  const [settings, set] = useAppSettings('help');

  const setPath = useCallback(
    (nextPath: string) => {
      const history = [
        nextPath,
        ...state.history.slice(state.backCount), // Drop anything newer than the last undo
      ].slice(0, MAX_HISTORY); // Limit # of history items

      setState({ path: nextPath, history, backCount: 0 });
    },
    [setState, state.backCount, state.history],
  );

  /**
   * History
   */
  const canGoBack = state.history.length > state.backCount + 1;
  const goBack = () => {
    const restored = state.history.at(state.backCount + 1);
    if (canGoBack && restored) {
      setState({ backCount: state.backCount + 1, path: restored });
    }
  };

  const canGoForward = state.backCount > 0;
  const goForward = () => {
    const restored = state.history.at(state.backCount - 1);
    if (canGoForward && restored) {
      setState({ backCount: state.backCount - 1, path: restored });
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Exit" onSelect={close} />
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.CheckboxItem
            label="Show Contents"
            checked={settings.sideBar}
            onCheckedChange={(checked) => set({ sideBar: checked })}
          />

          <Menu.Separator />

          <Menu.CheckboxItem
            label="Large Buttons"
            checked={settings.buttons === 'large'}
            onCheckedChange={(checked) =>
              set({ buttons: checked ? 'large' : 'icon' })
            }
          />
        </Menu.Menu>

        <Menu.Menu trigger={<Menu.Trigger>Go</Menu.Trigger>}>
          <Menu.Item label="Back" onSelect={goBack} disabled={!canGoBack} />
          <Menu.Item
            label="Forward"
            onSelect={goForward}
            disabled={!canGoForward}
          />
          <Menu.Item
            label="Home"
            onSelect={() => setPath(defaultHelpState.path)}
          />
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup>
        <Toolbar>
          <IconButton
            variant="light"
            onClick={() => set({ sideBar: !settings.sideBar })}
            imageUrl={`${resources}/${settings.sideBar ? 'hide' : 'show'}.png`}
            label={
              settings.buttons === 'large'
                ? settings.sideBar
                  ? 'Hide'
                  : 'Show'
                : null
            }
          />

          <IconButton
            variant="light"
            onClick={goBack}
            disabled={!canGoBack}
            imageUrl={`${resources}/back.png`}
            label={settings.buttons === 'large' ? 'Back' : null}
          />

          <IconButton
            variant="light"
            onClick={goForward}
            disabled={!canGoForward}
            imageUrl={`${resources}/forward.png`}
            label={settings.buttons === 'large' ? 'Forward' : null}
          />
        </Toolbar>
      </ToolbarGroup>

      <div className="flex-1 flex flex-row gap-0.5 min-h-0">
        {settings.sideBar ? (
          <div className="w-48 min-w-48 flex flex-col">
            <HelpTreeView setPath={setPath} />
          </div>
        ) : null}

        <div className="flex-1 min-w-0 flex flex-col">
          <HelpContent setPath={setPath} />
        </div>
      </div>
    </div>
  );
}
