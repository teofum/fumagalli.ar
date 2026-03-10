import Button from '@/components/ui/Button';

export const DEFAULT_ZOOM_STOPS = [
  0.05, 0.1, 0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 4, 8, 16, 32, 64,
];

type ZoomControlsProps = {
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (mode: 'fit' | 'fill') => void;
  stops?: number[];
};

export default function ZoomControls({
  zoom,
  setZoom,
  zoomIn,
  zoomOut,
  zoomTo,
  stops = DEFAULT_ZOOM_STOPS,
}: ZoomControlsProps) {
  return (
    <>
      <span className="px-2">Zoom</span>
      <div className="bg-default bevel-content p-0.5 flex flex-row">
        <Button
          className="py-0.5 px-1.5"
          onClick={zoomOut}
          disabled={zoom <= (stops.at(0) ?? 0)}
        >
          <span>-</span>
        </Button>
        <div className="py-0.5 px-2 w-12">{(zoom * 100).toFixed(0)}%</div>
        <Button
          className="py-0.5 px-1.5"
          onClick={zoomIn}
          disabled={zoom >= (stops.at(-1) ?? 0)}
        >
          <span>+</span>
        </Button>
      </div>
      <Button variant="light" className="py-1 px-2" onClick={() => setZoom(1)}>
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
    </>
  );
}
