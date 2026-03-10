import { RefObject, useCallback, useEffect } from 'react';

import { useAppState } from '@/components/desktop/Window/context';
import { useImageSize2 } from '@/utils/sanity.image';

import { DEFAULT_ZOOM_STOPS } from '@/components/ui/zoom-controls';

export default function useZoom(
  viewportRef: RefObject<HTMLDivElement | null>,
  imageRef: RefObject<HTMLImageElement | null>,
) {
  const [state, update] = useAppState('photos');
  const [width, height] = useImageSize2(
    state.selected?.metadata.dimensions ?? {
      width: 0,
      height: 0,
      aspectRatio: 0,
    },
  );

  const zoom = state.zoom ?? 1;
  const setZoom = useCallback((zoom: number) => update({ zoom }), [update]);

  const zoomOut = useCallback(() => {
    const nextZoomStop = DEFAULT_ZOOM_STOPS.filter((stop) => stop < zoom).at(
      -1,
    );
    setZoom(nextZoomStop ?? 1);
  }, [setZoom, zoom]);

  const zoomIn = useCallback(() => {
    const nextZoomStop = DEFAULT_ZOOM_STOPS.filter((stop) => stop > zoom).at(0);
    setZoom(nextZoomStop ?? 1);
  }, [setZoom, zoom]);

  const zoomTo = useCallback(
    (mode: 'fit' | 'fill') => {
      if (!viewportRef.current || !imageRef.current) return;

      const viewport = viewportRef.current.getBoundingClientRect();

      // Account for image border and scrollbar
      const zoomToFitWidth = (viewport.width - 18) / width;
      const zoomToFitHeight = (viewport.height - 18) / height;

      setZoom(
        mode === 'fit'
          ? Math.min(zoomToFitWidth, zoomToFitHeight)
          : Math.max(zoomToFitWidth, zoomToFitHeight),
      );
    },
    [setZoom, viewportRef, imageRef, width, height],
  );

  useEffect(() => {
    console.log('effect');
    if (!state.zoom) zoomTo('fit');
  }, [state.zoom, zoomTo]);

  return { zoom, setZoom, zoomIn, zoomOut, zoomTo };
}
