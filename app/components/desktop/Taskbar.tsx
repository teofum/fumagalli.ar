import cn from 'classnames';

import { useDesktop } from './Desktop/context';
import Button from '~/components/ui/Button';
import StartMenu from './StartMenu';
import Divider from '../ui/Divider';
import Clock from './Clock';

export default function Taskbar() {
  const { state, dispatch } = useDesktop();

  return (
    <div className="bg-surface bevel-top pt-0.5 px-1 relative z-1000">
      <div className="flex flex-row gap-1 py-0.5">
        <StartMenu />

        <Divider orientation="vertical" />

        {state.windows.map((window) => (
          <Button
            key={window.id}
            className={cn('p-1 pr-2 w-40', {
              'bevel-semilight': !window.focused,
              'bevel-inset bg-checkered': window.focused,
            })}
            data-active={window.focused ? true : undefined}
            onClick={() => dispatch({ type: 'focus', id: window.id })}
          >
            <div className="flex flex-row gap-1.5">
              <img src={`/fs/system/Applications/${window.appType}/icon_16.png`} alt="" />
              <span
                className={cn(
                  'whitespace-nowrap overflow-hidden text-ellipsis',
                  { bold: window.focused },
                )}
              >
                {window.title}
              </span>
            </div>
          </Button>
        ))}

        <div className="bevel-light-inset py-1 px-2 ml-auto text-right w-16">
          <Clock />
        </div>
      </div>
    </div>
  );
}
