import { useAppState } from '@/components/desktop/Window/context';
import Button from '@/components/ui/Button';
import ScrollContainer from '@/components/ui/ScrollContainer';
import { getLensDisplayName } from '@/utils/photos/get-lens-name';
import getPhotoDetails from '@/utils/photos/get-photo-details';

import PhotoThumbnail from './photo-thumbnail';
import { PhotosViewProps } from './props';
import cn from 'classnames';

export default function PhotosDetailsView({ photos, loupe }: PhotosViewProps) {
  const [state, update] = useAppState('photos');

  return (
    <ScrollContainer className="grow min-w-0">
      {photos.length === 0 ? (
        <div className="scroll-center">No photos</div>
      ) : (
        <table className="p-1 select-none min-w-full">
          <thead className="sticky top-0 z-100">
            <tr>
              <th className="p-0">
                <div className="w-full h-4 px-2 bg-surface bevel" />
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Number</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Filename</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Dimensions</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Date</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Camera</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Lens</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span className="whitespace-nowrap">Focal length</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Film</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Aperture</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span className="whitespace-nowrap">Shutter speed</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>ISO</span>
                </Button>
              </th>
              <th className="p-0">
                <Button className="w-full py-0 px-2 text-left">
                  <span>Mode</span>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {photos.map((photo, i) => {
              const {
                camera,
                lens,
                film,
                focalLength,
                date,
                aperture,
                shutterSpeed,
                iso,
              } = getPhotoDetails(photo);

              const dims = photo.metadata.dimensions;
              const selected = state.selected?._id === photo._id;
              const select = () => update({ selected: photo });

              return (
                <tr
                  key={photo._id}
                  className={cn({
                    'bg-selection text-selection outline-1 outline-dotted outline-(--theme-text)':
                      selected,
                  })}
                  onClick={select}
                  onDoubleClick={loupe}
                >
                  <td className="min-w-8 w-8 max-w-8 p-0">
                    <PhotoThumbnail
                      photo={photo}
                      idx={i + 1}
                      size={32}
                      variant="small"
                    />
                  </td>
                  <td className="px-1 whitespace-nowrap">{i + 1}</td>
                  <td className="px-1 whitespace-nowrap">
                    {photo.originalFilename}
                  </td>
                  <td className="px-1 whitespace-nowrap">
                    {dims.width}x{dims.height}
                  </td>
                  <td className="px-1 whitespace-nowrap">{date}</td>
                  <td className="px-1 whitespace-nowrap">{camera}</td>
                  <td className="px-1 whitespace-nowrap">
                    {getLensDisplayName(lens)}
                  </td>
                  <td className="px-1 whitespace-nowrap">{focalLength}</td>
                  <td className="px-1 whitespace-nowrap">{film ?? 'N/A'}</td>
                  <td className="px-1 whitespace-nowrap">{aperture}</td>
                  <td className="px-1 whitespace-nowrap">{shutterSpeed}</td>
                  <td className="px-1 whitespace-nowrap">{iso}</td>
                  <td className="px-1 whitespace-nowrap capitalize">
                    {photo.metadata.exif.mode.replace('-', ' ')}
                  </td>
                  <td />
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </ScrollContainer>
  );
}
