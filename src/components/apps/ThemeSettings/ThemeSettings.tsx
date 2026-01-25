import useSystemStore from "@/stores/system";
import { themes } from "./types";
import { Select, SelectItem } from "@/components/ui/Select";
import { useWindow } from "@/components/desktop/Window/context";
import Button from "@/components/ui/Button";
import ColorPicker from "@/components/ui/ColorPicker";
import parseCSSColor from "parse-css-color";
import { useState } from "react";
import GroupBox from "@/components/ui/GroupBox";
import Monitor from "./Monitor";

const DEFAULT_BACKGROUNDS = [
  "Black Thatch",
  "Blue Rivets",
  "Carved Stone",
  "Chess",
  "Clouds",
  "Houndstooth",
  "Metal Links",
  "Red Blocks",
].map((item) => ({
  name: item,
  url: `/assets/backgrounds/${item}.png`,
}));

export default function ThemeSettings() {
  const { theme, updateTheme, themeCustomizations, updateThemeCustomizations } =
    useSystemStore();
  const { close } = useWindow();

  const { backgroundColor, backgroundUrl, backgroundImageMode } =
    themeCustomizations;

  const [bg, setBg] = useState<number[] | undefined>(() => {
    const bg = backgroundColor;
    if (!bg) return;

    return parseCSSColor(bg)?.values;
  });

  const selectTheme = (value: string) => {
    const newTheme = themes.find((t) => t.cssClass === value);
    if (newTheme) updateTheme(newTheme);
  };

  const updateBackground = (value?: number[]) => {
    setBg(value);

    if (value) {
      const [r, g, b] = value;
      updateThemeCustomizations({ backgroundColor: `rgb(${r} ${g} ${b})` });
    } else updateThemeCustomizations({ backgroundColor: null });
  };

  return (
    <div className="flex flex-col gap-1.5 p-2 min-w-96">
      <div className="w-auto mx-auto relative">
        <Monitor />
        <div
          className="absolute bg-desktop top-[17px] left-[16px] w-[1216px] h-[896px] scale-[0.125] origin-top-left"
          style={{
            backgroundColor: backgroundColor ?? undefined,
            backgroundImage: `url('${backgroundUrl}')`,
            backgroundRepeat:
              backgroundImageMode === "tile" ? "repeat" : "no-repeat",
            backgroundPosition:
              backgroundImageMode === "tile" ? "top left" : "center center",
            backgroundSize:
              backgroundImageMode === "fill"
                ? "cover"
                : backgroundImageMode === "stretch"
                  ? "100% 100%"
                  : "auto auto",
          }}
        />
      </div>
      {/* <ThemePreview /> */}

      <GroupBox title="Color Scheme">
        <Select
          value={theme.cssClass}
          onValueChange={selectTheme}
          triggerProps={{ className: "w-full" }}
        >
          {themes.map((t) => (
            <SelectItem key={t.cssClass} value={t.cssClass}>
              {t.name}
            </SelectItem>
          ))}
        </Select>
      </GroupBox>

      <GroupBox title="Desktop Background">
        <div className="flex flex-row items-center gap-2 mb-2">
          <span className="w-20">Color</span>

          <ColorPicker
            className="flex-1"
            value={bg}
            onValueCommit={updateBackground}
          />

          <Button
            className="px-2 py-1 w-16"
            disabled={!backgroundColor}
            onClick={() => updateBackground(undefined)}
          >
            <span>Reset</span>
          </Button>
        </div>

        <div className="flex flex-row items-center gap-2">
          <span className="w-20">Picture</span>

          <Select
            triggerProps={{ className: "flex-1" }}
            value={backgroundUrl ?? ""}
            onValueChange={(value) =>
              updateThemeCustomizations({ backgroundUrl: value })
            }
          >
            <SelectItem value="">None</SelectItem>

            {DEFAULT_BACKGROUNDS.map((image) => (
              <SelectItem key={image.name} value={image.url}>
                {image.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            triggerProps={{ className: "flex-1" }}
            value={backgroundImageMode}
            onValueChange={(value) =>
              updateThemeCustomizations({ backgroundImageMode: value as any })
            }
          >
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="tile">Tile</SelectItem>
            <SelectItem value="stretch">Stretch</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
          </Select>
        </div>
      </GroupBox>

      <Button
        className="px-2 py-1 mt-2 w-16 text-center self-end"
        onClick={close}
      >
        <span>Done</span>
      </Button>
    </div>
  );
}
