import ScrollContainer from '~/components/ui/ScrollContainer';
import Menu from '~/components/ui/Menu';
import { useAppState, useWindow } from '~/components/desktop/Window/context';
import { useEffect, useRef, useState } from 'react';
import Button from '~/components/ui/Button';
import { getAppResourcesUrl } from '~/content/utils';
import Toolbar from '~/components/ui/Toolbar';
import useDesktopStore from '~/stores/desktop';
import { files } from '../../Files';
import { isPreviewable } from '../types';

const resources = getAppResourcesUrl('preview');

const MAX_INITIAL_SIZE = { x: 800, y: 600 };
const UI_SIZE = { x: 30, y: 100 };
const ZOOM_STOPS = [
  0.05, 0.1, 0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 4, 8, 16, 32, 64,
];

export default function PreviewImage() {
  const { id, minWidth, minHeight, close, modal } = useWindow();
  const { moveAndResize } = useDesktopStore();

  const [state, setState] = useAppState('preview');
  const resourceUrl = '/fs' + state.filePath;

  if (state.file?.type !== 'image') throw new Error('Wrong file type');

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);

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

          setZoom(Math.min(zoomToFitWidth, zoomToFitHeight));

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

      img.addEventListener('load', onload);
      return () => img.removeEventListener('load', onload);
    }
  }, [moveAndResize, id, minHeight, minWidth]);

  const open = () => {
    modal(
      files({
        path: '/Documents',
        typeFilter: ['image'],
        modalCallback: (file, filePath) => {
          if (isPreviewable(file)) setState({ file, filePath });
        },
      }),
    );
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = resourceUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex flex-row gap-1">
        <Menu.Root trigger={<Menu.Trigger>File</Menu.Trigger>}>
          <Menu.Item label="Open..." onSelect={open} />
          <Menu.Item label="Download" onSelect={download} />

          <Menu.Separator />

          <Menu.Item label="Close" onSelect={close} />
        </Menu.Root>

        <Menu.Root trigger={<Menu.Trigger>View</Menu.Trigger>}>
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
        </Menu.Root>
      </div>

      <Toolbar>
        <span className="px-2">Zoom</span>
        <div className="bg-default bevel-inset py-1 px-2 w-16">
          {(zoom * 100).toFixed(0)}%
        </div>
        <Button
          variant="light"
          className="p-1"
          onClick={zoomOut}
          disabled={zoom <= (ZOOM_STOPS.at(0) ?? 0)}
        >
          <img src={`${resources}/zoom-out.png`} alt="Zoom out" />
        </Button>
        <Button
          variant="light"
          className="p-1"
          onClick={zoomIn}
          disabled={zoom >= (ZOOM_STOPS.at(-1) ?? 0)}
        >
          <img src={`${resources}/zoom-in.png`} alt="Zoom in" />
        </Button>
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

      <ScrollContainer className="flex-1" ref={viewportRef}>
        <div className="flex w-min border border-default bg-surface-light bg-checkered-lg select-none">
          <img
            ref={imageRef}
            src={resourceUrl}
            alt={state.file?.altText}
            style={{ width, minWidth: width }}
          />
        </div>
      </ScrollContainer>
    </div>
  );
}
