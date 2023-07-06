import { useAppState } from '~/components/desktop/Window/context';
import Collapsible from '~/components/ui/Collapsible';
import Input from '~/components/ui/Input';
import { Select, SelectItem } from '~/components/ui/Select';

export default function DitherLabResizeOptions() {
  const [state, setState] = useAppState('dither');

  const updateWidth = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const width = Number(ev.target.value);
    if (!isNaN(width) && width > 0) setState({ width });
  };

  const updateHeight = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const height = Number(ev.target.value);
    if (!isNaN(height) && height > 0) setState({ height });
  };

  return (
    <Collapsible defaultOpen title="Resize">
      <div className="flex flex-col gap-2">
        <Select
          value={state.resizeMode}
          onValueChange={(value) => setState({ resizeMode: value as any })}
        >
          <SelectItem value="none">Keep original size</SelectItem>
          <SelectItem value="fit">Resize to fit</SelectItem>
          <SelectItem value="stretch">Resize (stretch)</SelectItem>
        </Select>

        <div className="flex flex-row gap-1.5 items-baseline">
          <Input
            className="grow"
            defaultValue={state.width}
            onChange={updateWidth}
            disabled={state.resizeMode === 'none'}
          />
          <span>x</span>
          <Input
            className="grow"
            defaultValue={state.height}
            onChange={updateHeight}
            disabled={state.resizeMode === 'none'}
          />
        </div>
      </div>
    </Collapsible>
  );
}
