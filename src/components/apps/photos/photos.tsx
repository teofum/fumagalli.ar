import { useRef } from 'react';

import Divider from '@/components/ui/Divider';
import Menu from '@/components/ui/Menu';
import { ToggleGroup, ToggleIconButton } from '@/components/ui/ToggleGroup';
import { Toolbar, ToolbarGroup } from '@/components/ui/Toolbar';
import ZoomControls from '@/components/ui/zoom-controls';
import { useAppSettings } from '@/hooks/use-app-settings';

import CollectionsPanel from './panels/collections-panel';
import PhotosPanel from './panels/photos-panel';
import useZoom from './use-zoom';

export default function Photos() {
  const [settings, set] = useAppSettings('photos');

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const zoom = useZoom(viewportRef, imageRef);

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
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup>
        <Toolbar>
          <ToggleGroup
            type="single"
            value={settings.viewMode}
            onValueChange={(val) =>
              set({ viewMode: val as typeof settings.viewMode })
            }
          >
            <ToggleIconButton
              variant="light"
              value="grid"
              imageUrl="/assets/icons/photos_view_grid.png"
              label={settings.buttons === 'large' ? 'Grid' : null}
            />
            <ToggleIconButton
              variant="light"
              value="loupe"
              imageUrl="/assets/icons/photos_view_loupe.png"
              label={settings.buttons === 'large' ? 'Loupe' : null}
            />
            <ToggleIconButton
              variant="light"
              value="details"
              imageUrl="/assets/icons/photos_view_details.png"
              label={settings.buttons === 'large' ? 'Details' : null}
            />
          </ToggleGroup>

          <Divider orientation="vertical" className="m-0.5" />

          {settings.viewMode === 'loupe' ? <ZoomControls {...zoom} /> : null}
        </Toolbar>
      </ToolbarGroup>

      <div className="flex flex-row items-stretch gap-0.5 grow min-h-0 min-w-0">
        <CollectionsPanel />
        <PhotosPanel
          viewMode={settings.viewMode}
          loupe={() => set({ viewMode: 'loupe' })}
          viewportRef={viewportRef}
          imageRef={imageRef}
        />
        <div className="bevel-inset p-0.5">
          <div className="bevel bg-surface p-1">hello</div>
        </div>
      </div>
    </div>
  );
}
