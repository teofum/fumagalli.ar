import { useEffect, useRef } from 'react';

import { useAppState, useWindow } from '@/components/desktop/Window/context';
import Menu from '@/components/ui/Menu';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { Toolbar, ToolbarGroup } from '@/components/ui/Toolbar';
import ZoomControls from '@/components/ui/zoom-controls';
import useZoom from '@/hooks/use-zoom';
import type { ImageFile } from '@/schemas/file';
import useDesktopStore from '@/stores/desktop';
import { useImageSize, useImageUrl } from '@/utils/sanity.image';

import { MAX_INITIAL_SIZE, UI_SIZE } from '../constants';
import type { PreviewModeProps } from '../types';

export default function PreviewImage({ commonMenu }: PreviewModeProps) {
  const { id, minWidth, minHeight } = useWindow();
  const { moveAndResize } = useDesktopStore();

  const [state, update] = useAppState('preview');

  if (state.file?._type !== 'fileImage') throw new Error('Wrong file type');
  const imageUrl = useImageUrl(state.file as ImageFile);
  const [imageWidth, imageHeight] = useImageSize(state.file);

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const setZoom = (zoom: number) => update({ zoom });
  const zoom = useZoom(state.zoom ?? 1, setZoom, viewportRef, imageRef);

  useEffect(() => {
    if (!state.zoom) {
      // Calculate max size to autosize window
      const { innerWidth, innerHeight } = window;
      const maxWidth = Math.min(innerWidth / 2, MAX_INITIAL_SIZE.x);
      const maxHeight = Math.min(innerHeight / 2, MAX_INITIAL_SIZE.y);

      if (imageWidth > maxWidth || imageHeight > maxHeight) {
        // Zoom to fit in the max sized viewport
        const zoomToFitWidth = maxWidth / imageWidth;
        const zoomToFitHeight = maxHeight / imageHeight;

        update({
          ...state,
          zoom: Math.min(zoomToFitWidth, zoomToFitHeight),
        });

        // Calculate actual size image ended up with
        let actualWidth = maxWidth;
        let actualHeight = maxHeight;

        if (zoomToFitWidth < zoomToFitHeight) {
          actualHeight = (maxWidth * imageHeight) / imageWidth;
        } else {
          actualWidth = (maxHeight * imageWidth) / imageHeight;
        }

        // And size window to the size the image ended up with
        moveAndResize(id, {
          width: actualWidth + UI_SIZE.x,
          height: actualHeight + UI_SIZE.y,
        });
      } else {
        // Size window to image
        const width = Math.max(minWidth, imageWidth + UI_SIZE.x);
        const height = Math.max(minHeight, imageHeight + UI_SIZE.y);

        moveAndResize(id, { width, height });
      }
    }
  });

  return (
    <>
      <Menu.Bar>
        {commonMenu}

        <Menu.Menu trigger={<Menu.Trigger>View</Menu.Trigger>}>
          <Menu.RadioGroup
            value={zoom.toString()}
            onValueChange={(value) => setZoom(Number(value))}
          >
            <Menu.RadioItem value="0.5" label="50%" />
            <Menu.RadioItem value="1" label="100%" />
            <Menu.RadioItem value="2" label="200%" />
            <Menu.RadioItem value="4" label="400%" />
          </Menu.RadioGroup>

          <Menu.Separator />

          <Menu.Item label="Zoom to fit" onSelect={() => zoom.zoomTo('fit')} />
          <Menu.Item
            label="Zoom to fill"
            onSelect={() => zoom.zoomTo('fill')}
          />
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup>
        <Toolbar>
          <ZoomControls {...zoom} />
        </Toolbar>
      </ToolbarGroup>

      <ScrollContainer className="flex-1" ref={viewportRef}>
        <div className="scroll-center">
          <div className="flex w-min border border-default bg-surface-light bg-checkered-lg select-none relative">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
              src={state.file.lqip ?? undefined}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-surface bevel px-6 py-3">Loading...</div>
            </div>
            <img
              className="relative"
              ref={imageRef}
              src={imageUrl}
              alt={state.file.name}
              style={{
                width: imageWidth * zoom.zoom,
                minWidth: imageWidth * zoom.zoom,
                height: imageHeight * zoom.zoom,
                minHeight: imageHeight * zoom.zoom,
              }}
            />
          </div>
        </div>
      </ScrollContainer>
    </>
  );
}
