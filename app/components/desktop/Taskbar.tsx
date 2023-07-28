import cn from 'classnames';

import useDesktopStore from '~/stores/desktop';
import Button from '~/components/ui/Button';
import StartMenu from './StartMenu';
import Divider from '../ui/Divider';
import Clock from './Clock';

export default function Taskbar() {
  const { windows, focus } = useDesktopStore();

  return (
    <div className="bg-surface bevel-top pt-0.5 px-1 relative z-1000">
      <div className="flex flex-row gap-1 py-0.5">
        <StartMenu />

        <Divider orientation="vertical" />

        <div className="flex flex-row gap-1 min-w-0 flex-1 overflow-auto">
          {windows.map((window, i) => (
            <Button
              key={window.id}
              className={cn('p-1 pr-2 basis-40 flex-shrink min-w-12', {
                'bevel-semilight': !window.focused,
                'bevel-inset bg-checkered': window.focused,
              })}
              data-active={window.focused ? true : undefined}
              onClick={() => focus(window.id)}
              style={{ gridColumn: `${i + 1}` }}
            >
              <div className="flex flex-row gap-1.5">
                <img
                  src={`/fs/Applications/${window.appType}/icon_16.png`}
                  alt=""
                />
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
        </div>

        <Divider orientation="vertical" />

        <div className="bevel-light-inset py-1 px-2 ml-auto text-right w-16">
          <Clock />
        </div>
      </div>
    </div>
  );
}
