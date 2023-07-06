import { useAppState } from '~/components/desktop/Window/context';
import Collapsible from '~/components/ui/Collapsible';
import { Select, SelectItem } from '~/components/ui/Select';
import {
  type DitherProcessRangeOption,
  gpuProcess,
  mapFns,
  reverseMapFns,
} from '../process';
import Divider from '~/components/ui/Divider';
import Slider from '~/components/ui/Slider';

interface RangeOptionProps {
  type: 'settings' | 'uniforms';
  option: DitherProcessRangeOption;
}

function RangeOption({ type, option }: RangeOptionProps) {
  const [state, setState] = useAppState('dither');

  let defaultValue = state[type][option.name] as number;
  if (option.map) defaultValue = reverseMapFns[option.map](defaultValue);

  const onChange = (value: number) => {
    const mapped = option.map ? mapFns[option.map](value) : value;

    setState({
      [type]: { ...state[type], [option.name]: mapped },
    });
  };

  return (
    <div className="flex flex-row gap-1 items-center">
      <div className="w-12">{option.displayName}</div>
      <Slider
        className="grow"
        defaultValue={defaultValue}
        onValueChange={onChange}
        min={option.min}
        max={option.max}
        step={option.step}
      />
      <div className="w-8 text-end">
        {(state[type][option.name] as number).toFixed(2)}
      </div>
    </div>
  );
}

export default function DitherLabRenderOptions() {
  const [state, setState] = useAppState('dither');
  const process = gpuProcess[state.process];

  return (
    <Collapsible defaultOpen title="Render Settings">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1 items-center">
          <div className="w-12">Process</div>
          <Select
            triggerProps={{ className: 'grow' }}
            value={state.process}
            onValueChange={(value) => setState({ process: value })}
          >
            {Object.keys(gpuProcess).map((key) => (
              <SelectItem value={key} key={key}>
                {gpuProcess[key as keyof typeof gpuProcess].name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Divider />

        {process.settings.map((setting) =>
          setting.type === 'select' ? (
            <div
              key={setting.name}
              className="flex flex-row gap-1 items-center"
            >
              <div className="w-12">{setting.displayName}</div>
              <Select
                triggerProps={{ className: 'grow' }}
                value={state.settings[setting.name] as string}
                onValueChange={(value) =>
                  setState({
                    settings: { ...state.settings, [setting.name]: value },
                  })
                }
              >
                {setting.options.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          ) : (
            <RangeOption key={setting.name} option={setting} type="settings" />
          ),
        )}

        {process.uniforms.map((uniform) => (
          <RangeOption key={uniform.name} option={uniform} type="uniforms" />
        ))}
      </div>
    </Collapsible>
  );
}
