import cn from 'classnames';

import { useDesktop } from './Desktop/context';
import Button from '~/components/ui/Button';
import StartMenu from './StartMenu';

export default function Taskbar() {
  const { state, dispatch } = useDesktop();

  return (
    <div className="bg-surface bevel-top absolute bottom-0 left-0 w-full pt-0.5 px-1 z-1000">
      <div className="flex flex-row gap-1 py-0.5">
        <StartMenu />

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
              <img src={`/img/icon/${window.icon}_16.png`} alt="" />
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
    </div>
  );
}
