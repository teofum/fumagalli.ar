import { useAppState } from '@/components/desktop/Window/context';
import RetroLink from '@/components/ui/Link';
import { getLensDisplayName } from '@/utils/photos/get-lens-name';
import getPhotoDetails from '@/utils/photos/get-photo-details';
import { sanityImage } from '@/utils/sanity.image';

function PhotoProperties() {
  const [state] = useAppState('photos');

  const photo = state.selected;

  if (!photo) return <div>No photo selected</div>;

  const { dimensions, lqip } = photo.metadata;
  const { camera, lens, film, focalLength, date, aperture, shutterSpeed, iso } =
    getPhotoDetails(photo);

  return (
    <div className="flex flex-col p-2 gap-2">
      {
        // funny hack to force react to rerender this component when selection changes
        [photo].map((photo) => (
          <div key={photo?._id} className="relative border border-default">
            <img
              className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
              alt=""
              src={lqip ?? undefined}
            />

            <img
              className="relative w-full object-cover [image-rendering:auto]"
              style={{ aspectRatio: dimensions.aspectRatio }}
              alt=""
              src={sanityImage(photo._id)
                .width(240)
                .height(~~(240 / dimensions.aspectRatio))
                .dpr(2)
                .quality(90)
                .url()}
              loading="lazy"
            />
          </div>
        ))
      }

      <div className="bold">{photo.originalFilename}</div>

      <RetroLink href={`https://cdn.sanity.io/${photo.path}`}>
        View original file
      </RetroLink>

      <div className="flex flex-col">
        <div className="bold mt-1">Dimensions</div>
        <div>
          {dimensions.width}x{dimensions.height}
        </div>
        <div className="bold mt-1">Date</div>
        <div>{date}</div>
        <div className="bold mt-1">Camera</div>
        <div>{camera}</div>
        <div className="bold mt-1">Lens</div>
        <div>{getLensDisplayName(lens)}</div>
        <div className="bold mt-1">Focal length</div>
        <div>{focalLength}</div>
        <div className="bold mt-1">Film</div>
        <div>{film ?? 'N/A'}</div>
        <div className="bold mt-1">Aperture</div>
        <div>{aperture}</div>
        <div className="bold mt-1">Shutter speed</div>
        <div>{shutterSpeed}</div>
        <div className="bold mt-1">ISO</div>
        <div>{iso}</div>
        <div className="bold mt-1">Mode</div>
        <div className="capitalize">
          {photo.metadata.exif.mode.replace('-', ' ')}
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPanel() {
  return (
    <div className="w-60 min-w-60 bevel-inset p-0.5 bg-default">
      <PhotoProperties />
    </div>
  );
}
