import ScrollContainer from '~/components/ui/ScrollContainer';
import { useAppState, useWindow } from '~/components/desktop/Window/context';
import { useEffect, useRef } from 'react';
import Button from '~/components/ui/Button';
import { Toolbar, ToolbarGroup } from '~/components/ui/Toolbar';
import useDesktopStore from '~/stores/desktop';
import { MAX_INITIAL_SIZE, UI_SIZE, ZOOM_STOPS } from '../constants';
import Menu from '~/components/ui/Menu';
import type { PreviewModeProps } from '../types';

export default function PreviewImage({ commonMenu }: PreviewModeProps) {
  const { id, minWidth, minHeight } = useWindow();
  const { moveAndResize } = useDesktopStore();

  const [state, setState] = useAppState('preview');
  const resourceUrl = '/fs' + state.filePath;

  if (state.file?.type !== 'image') throw new Error('Wrong file type');

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const zoom = state.zoom ?? 1;
  const setZoom = (zoom: number) => {
    setState({ ...state, zoom });
  };

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const onload = () => {
        const { naturalWidth, naturalHeight } = img;

        // Calculate max size to autosize window
        const { innerWidth, innerHeight } = window;
        const maxWidth = Math.min(innerWidth / 2, MAX_INITIAL_SIZE.x);
        const maxHeight = Math.min(innerHeight / 2, MAX_INITIAL_SIZE.y);

        if (naturalWidth > maxWidth || naturalHeight > maxHeight) {
          // Zoom to fit in the max sized viewport
          const zoomToFitWidth = maxWidth / naturalWidth;
          const zoomToFitHeight = maxHeight / naturalHeight;

          setState({
            ...state,
            zoom: Math.min(zoomToFitWidth, zoomToFitHeight),
          });

          // Calculate actual size image ended up with
          let actualWidth = maxWidth;
          let actualHeight = maxHeight;

          if (zoomToFitWidth < zoomToFitHeight) {
            actualHeight = (maxWidth * naturalHeight) / naturalWidth;
          } else {
            actualWidth = (maxHeight * naturalWidth) / naturalHeight;
          }

          // And size window to the size the image ended up with
          moveAndResize(id, {
            width: actualWidth + UI_SIZE.x,
            height: actualHeight + UI_SIZE.y,
          });
        } else {
          // Size window to image
          const width = Math.max(minWidth, naturalWidth + UI_SIZE.x);
          const height = Math.max(minHeight, naturalHeight + UI_SIZE.y);

          moveAndResize(id, { width, height });
        }
      };

      if (!state.zoom) img.addEventListener('load', onload);
      return () => img.removeEventListener('load', onload);
    }
  }, [moveAndResize, id, minHeight, minWidth, state, setState]);

  const zoomOut = () => {
    const nextZoomStop = ZOOM_STOPS.filter((stop) => stop < zoom).at(-1);
    setZoom(nextZoomStop ?? 1);
  };

  const zoomIn = () => {
    const nextZoomStop = ZOOM_STOPS.filter((stop) => stop > zoom).at(0);
    setZoom(nextZoomStop ?? 1);
  };

  const zoomTo = (mode: 'fit' | 'fill') => {
    if (!viewportRef.current || !imageRef.current) return;

    const { naturalWidth, naturalHeight } = imageRef.current;
    const { width, height } = viewportRef.current.getBoundingClientRect();

    // Account for image border and scrollbar
    const zoomToFitWidth = (width - 18) / naturalWidth;
    const zoomToFitHeight = (height - 18) / naturalHeight;

    setZoom(
      mode === 'fit'
        ? Math.min(zoomToFitWidth, zoomToFitHeight)
        : Math.max(zoomToFitWidth, zoomToFitHeight),
    );
  };

  const width = (imageRef.current?.naturalWidth ?? 0) * zoom;

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

          <Menu.Item label="Zoom to fit" onSelect={() => zoomTo('fit')} />
          <Menu.Item label="Zoom to fill" onSelect={() => zoomTo('fill')} />
        </Menu.Menu>
      </Menu.Bar>

      <ToolbarGroup>
        <Toolbar>
          <span className="px-2">Zoom</span>
          <div className="bg-default bevel-content p-0.5 flex flex-row">
            <Button
              className="py-0.5 px-1.5"
              onClick={zoomOut}
              disabled={zoom <= (ZOOM_STOPS.at(0) ?? 0)}
            >
              <span>-</span>
            </Button>
            <div className="py-0.5 px-2 w-12">{(zoom * 100).toFixed(0)}%</div>
            <Button
              className="py-0.5 px-1.5"
              onClick={zoomIn}
              disabled={zoom >= (ZOOM_STOPS.at(-1) ?? 0)}
            >
              <span>+</span>
            </Button>
          </div>
          <Button
            variant="light"
            className="py-1 px-2"
            onClick={() => setZoom(1)}
          >
            Reset
          </Button>
          <Button
            variant="light"
            className="py-1 px-2"
            onClick={() => zoomTo('fit')}
          >
            Fit
          </Button>
          <Button
            variant="light"
            className="py-1 px-2"
            onClick={() => zoomTo('fill')}
          >
            Fill
          </Button>
        </Toolbar>
      </ToolbarGroup>

      <ScrollContainer className="flex-1" ref={viewportRef}>
        <div className="scroll-center">
          <div className="flex w-min border border-default bg-surface-light bg-checkered-lg select-none">
            <img
              ref={imageRef}
              src={resourceUrl}
              alt={state.file?.altText}
              style={{ width, minWidth: width }}
            />
          </div>
        </div>
      </ScrollContainer>
    </>
  );
}
