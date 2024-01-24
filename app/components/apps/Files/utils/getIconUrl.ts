import type { FSObject } from '~/content/types';
import isFolder from './isFolder';
import { sanityImage } from '~/utils/sanity.image';

export default function getIconUrl(item: FSObject, size: 16 | 32) {
  if (isFolder(item)) {
    if (item.icon) {
      const icon = sanityImage(item.icon[`icon${size}`]);
      return icon.format('png').width(size).height(size).url();
    }

    return `/fs/System Files/Icons/FileType/folder_${size}.png`;
  } else {
    if (item._type === 'app') {
      const appName = item.name.split('.')[0];
      return `/fs/Applications/${appName}/icon_${size}.png`;
    }

    return `/fs/System Files/Icons/FileType/${item._type}_${size}.png`;
  }
}
