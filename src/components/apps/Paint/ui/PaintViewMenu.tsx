import Menu from "@/components/ui/Menu";
import { usePaintContext } from "../context";

export default function PaintViewMenu() {
  const { state, setState, settings, set } = usePaintContext();

  return (
    <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
      <Menu.CheckboxItem
        label="Tool Box"
        checked={settings.toolBar}
        onCheckedChange={(checked) => set({ toolBar: checked })}
      />
      <Menu.CheckboxItem
        label="Color Box"
        checked={settings.colorBox}
        onCheckedChange={(checked) => set({ colorBox: checked })}
      />
      <Menu.CheckboxItem
        label="Status Bar"
        checked={settings.statusBar}
        onCheckedChange={(checked) => set({ statusBar: checked })}
      />

      <Menu.Separator />

      <Menu.Sub label="Zoom">
        <Menu.RadioGroup
          value={state.zoom.toString()}
          onValueChange={(value) => setState({ zoom: Number(value) })}
        >
          <Menu.RadioItem label="100%" value="1" />
          <Menu.RadioItem label="200%" value="2" />
          <Menu.RadioItem label="400%" value="4" />
          <Menu.RadioItem label="600%" value="6" />
          <Menu.RadioItem label="800%" value="8" />
        </Menu.RadioGroup>
      </Menu.Sub>

      <Menu.CheckboxItem
        label="Show Grid"
        checked={settings.grid}
        onCheckedChange={(checked) => set({ grid: checked })}
      />
    </Menu.Menu>
  );
}
