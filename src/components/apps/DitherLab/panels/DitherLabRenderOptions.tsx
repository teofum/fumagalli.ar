import cn from "classnames";

import { useAppState } from "@/components/desktop/Window/context";
import Collapsible from "@/components/ui/Collapsible";
import { Select, SelectItem } from "@/components/ui/Select";
import {
  type DitherProcessRangeOption,
  type DitherGlProcess,
  gpuProcess,
  mapFns,
  reverseMapFns,
  softwareProcess,
} from "../process";
import Divider from "@/components/ui/Divider";
import Slider from "@/components/ui/Slider";
import { DitherLabDevice } from "../types";
import { THREADS_AUTO_MAX } from "@/dither/renderers/useSoftwareRenderer";

interface RangeOptionProps {
  type: "settings" | "uniforms";
  option: DitherProcessRangeOption;
}

function RangeOption({ type, option }: RangeOptionProps) {
  const [state, setState] = useAppState("dither");

  const value = Number(state[type][option.name] ?? option.min);
  let defaultValue = value;
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
      {option.name === "threads" ? (
        <div
          className={cn("w-8 text-end", {
            "text-[#008000]": value === 0,
            "text-[#C00000]": value > THREADS_AUTO_MAX,
          })}
        >
          {value === 0 ? "A" : value.toFixed(0)}
        </div>
      ) : (
        <div className="w-8 text-end">{value.toFixed(2)}</div>
      )}
    </div>
  );
}

export default function DitherLabRenderOptions() {
  const [state, setState] = useAppState("dither");
  const processes =
    state.device === DitherLabDevice.GL ? gpuProcess : softwareProcess;
  const process = processes[state.process];

  const selectDevice = (device: DitherLabDevice) => {
    const defaultProcess =
      device === DitherLabDevice.GL
        ? Object.keys(gpuProcess)[0]
        : Object.keys(softwareProcess)[0];

    setState({ device, process: defaultProcess });
  };

  return (
    <Collapsible defaultOpen title="Render Settings">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1 items-center">
          <div className="w-12">Device</div>
          <Select
            triggerProps={{ className: "grow" }}
            value={state.device}
            onValueChange={(value) => selectDevice(value as DitherLabDevice)}
          >
            {Object.values(DitherLabDevice).map((device) => (
              <SelectItem value={device} key={device}>
                {device}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-row gap-1 items-center">
          <div className="w-12">Process</div>
          <Select
            triggerProps={{ className: "grow" }}
            value={state.process}
            onValueChange={(value) => setState({ process: value })}
          >
            {Object.keys(processes).map((key) => (
              <SelectItem value={key} key={key}>
                {processes[key].name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Divider />

        {process.settings.map((setting) =>
          setting.type === "select" ? (
            <div
              key={setting.name}
              className="flex flex-row gap-1 items-center"
            >
              <div className="w-12">{setting.displayName}</div>
              <Select
                triggerProps={{ className: "grow" }}
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

        {state.device === DitherLabDevice.GL
          ? (process as DitherGlProcess).uniforms.map((uniform) => (
              <RangeOption
                key={uniform.name}
                option={uniform}
                type="uniforms"
              />
            ))
          : null}
      </div>
    </Collapsible>
  );
}
