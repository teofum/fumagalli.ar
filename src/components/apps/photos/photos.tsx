import { useCallback, useEffect, useRef } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import Divider from '@/components/ui/Divider';
import Menu from '@/components/ui/Menu';
import { ToggleIconButton } from '@/components/ui/ToggleButton';
import {
  ToggleGroup,
  ToggleIconButton as ToggleGroupIconButton,
} from '@/components/ui/ToggleGroup';
import { Toolbar, ToolbarGroup } from '@/components/ui/Toolbar';
import ZoomControls from '@/components/ui/zoom-controls';
import { useAppSettings } from '@/hooks/use-app-settings';
import useZoom from '@/hooks/use-zoom';

import CollectionsPanel from './panels/collections-panel';
import PhotosPanel from './panels/photos-panel';
import PropertiesPanel from './panels/properties-panel';

export default function Photos() {
  const [settings, set] = useAppSettings('photos');
  const [state, update] = useAppState('photos');

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const setZoom = useCallback((zoom: number) => update({ zoom }), [update]);
  const zoom = useZoom(state.zoom ?? 1, setZoom, viewportRef, imageRef);

  useEffect(() => {
    if (!state.zoom) zoom.zoomTo('fit');
  }, [state.zoom, zoom]);

  return (
    <div className="flex flex-col gap-0.5 min-h-0 min-w-0">
      <Menu.Bar>
        <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.Sub label="Mode">
            <Menu.RadioGroup
              value={settings.viewMode}
              onValueChange={(val) =>
                set({ viewMode: val as typeof settings.viewMode })
              }
            >
              <Menu.RadioItem label="Grid" value="grid" />
              <Menu.RadioItem label="Loupe" value="loupe" />
              <Menu.RadioItem label="Details" value="details" />
            </Menu.RadioGroup>
          </Menu.Sub>

          <Menu.CheckboxItem
            label="Film strip"
            checked={settings.filmStrip}
            onCheckedChange={(checked) => set({ filmStrip: checked })}
          />

          <Menu.Separator />

          <Menu.Sub label="Toolbar">
            <Menu.CheckboxItem
              label="Large buttons"
              checked={settings.buttons === 'large'}
              onCheckedChange={(checked) =>
                set({ buttons: checked ? 'large' : 'icon' })
              }
            />
          </Menu.Sub>
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup>
        <Toolbar>
          <ToggleIconButton
            variant="light"
            pressed={settings.leftPanel}
            onPressedChange={(pressed) => set({ leftPanel: pressed })}
            imageUrl="/assets/icons/photos_sidebar_left.png"
            label={settings.buttons === 'large' ? 'Explore' : null}
          />

          <Divider orientation="vertical" className="m-0.5" />

          <ToggleGroup
            type="single"
            value={settings.viewMode}
            onValueChange={(val) =>
              set({ viewMode: val as typeof settings.viewMode })
            }
          >
            <ToggleGroupIconButton
              variant="light"
              value="grid"
              imageUrl="/assets/icons/photos_view_grid.png"
              label={settings.buttons === 'large' ? 'Grid' : null}
            />
            <ToggleGroupIconButton
              variant="light"
              value="loupe"
              imageUrl="/assets/icons/photos_view_loupe.png"
              label={settings.buttons === 'large' ? 'Loupe' : null}
            />
            <ToggleGroupIconButton
              variant="light"
              value="details"
              imageUrl="/assets/icons/photos_view_details.png"
              label={settings.buttons === 'large' ? 'Details' : null}
            />
          </ToggleGroup>

          {settings.viewMode === 'loupe' ? (
            <>
              <Divider orientation="vertical" className="m-0.5" />
              <ZoomControls {...zoom} />
            </>
          ) : null}

          <Divider orientation="vertical" className="m-0.5 ml-auto" />

          <ToggleIconButton
            variant="light"
            pressed={settings.rightPanel}
            onPressedChange={(pressed) => set({ rightPanel: pressed })}
            imageUrl="/assets/icons/photos_sidebar_right.png"
            label={settings.buttons === 'large' ? 'Properties' : null}
          />
        </Toolbar>
      </ToolbarGroup>

      <div className="flex flex-row items-stretch gap-0.5 grow min-h-0 min-w-0">
        {settings.leftPanel ? <CollectionsPanel /> : null}
        <PhotosPanel
          viewMode={settings.viewMode}
          filmStrip={settings.filmStrip}
          loupe={() => set({ viewMode: 'loupe' })}
          viewportRef={viewportRef}
          imageRef={imageRef}
        />
        {settings.rightPanel ? <PropertiesPanel /> : null}
      </div>
    </div>
  );
}
