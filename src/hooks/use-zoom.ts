import { RefObject, useCallback } from 'react';

import { DEFAULT_ZOOM_STOPS } from '@/components/ui/zoom-controls';

export default function useZoom(
  zoom: number,
  setZoom: (zoom: number) => void,
  viewportRef: RefObject<HTMLDivElement | null>,
  contentRef?: RefObject<HTMLImageElement | null>,
  stops: number[] = DEFAULT_ZOOM_STOPS,
  contentSize?: { width: number; height: number } | null,
) {
  const zoomOut = useCallback(() => {
    const nextStop = stops.filter((stop) => stop < zoom).at(-1);
    setZoom(nextStop ?? 1);
  }, [setZoom, zoom, stops]);

  const zoomIn = useCallback(() => {
    const nextStop = stops.filter((stop) => stop > zoom).at(0);
    setZoom(nextStop ?? 1);
  }, [setZoom, zoom, stops]);

  const zoomTo = useCallback(
    (mode: 'fit' | 'fill') => {
      if (!viewportRef.current || (!contentRef?.current && !contentSize))
        return;

      const viewport = viewportRef.current.getBoundingClientRect();
      const content = contentRef?.current?.getBoundingClientRect() ??
        contentSize ?? { width: 0, height: 0 };

      // Account for image border and scrollbar
      const zoomToFitWidth = (viewport.width - 18) / content.width;
      const zoomToFitHeight = (viewport.height - 18) / content.height;

      setZoom(
        mode === 'fit'
          ? Math.min(zoomToFitWidth, zoomToFitHeight)
          : Math.max(zoomToFitWidth, zoomToFitHeight),
      );
    },
    [setZoom, viewportRef, contentRef, contentSize],
  );

  return { zoom, setZoom, zoomIn, zoomOut, zoomTo };
}
