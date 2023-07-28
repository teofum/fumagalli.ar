import { useAppState, useWindow } from '~/components/desktop/Window/context';
import Button from '~/components/ui/Button';

export default function MessageBox() {
  const { close } = useWindow();
  const [state] = useAppState('messageBox');

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex flex-row items-start gap-4">
        <img
          className="min-w-8"
          src={`/fs/System Files/Icons/${state.type}.png`}
          alt={state.type}
        />

        <p className="flex-1">{state.message}</p>
      </div>

      <div className="flex flex-row gap-1 justify-end">
        <Button className="py-1 px-2 w-20" onClick={close}>
          OK
        </Button>
      </div>
    </div>
  );
}
