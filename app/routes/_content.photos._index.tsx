import { type V2_MetaFunction } from '@remix-run/react';
import type { Directory, FSObject } from '~/content/types';
import resolvePath from '~/utils/resolvePath';

const photos = resolvePath(['Documents', 'Photos']) as Directory;

function isDirectory(item: FSObject): item is Directory {
  return (item as Directory).items !== undefined;
}

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Photos — Teo Fumagalli' },
    { name: 'description', content: 'I take pictures sometimes' },
  ];
};

export default function PostsIndexRoute() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Photos
      </h1>

      <p className="mb-4">
        I do stuff besides coding, too! For instance, I'm a hobbyist
        photographer. Here you can find some of my pictures.
      </p>

      <ul>
        {photos.items.map((folder) => {
          if (!isDirectory(folder)) return null;

          return (
            <li key={folder.name} className="border-t last:border-b">
              <div className="flex flex-row p-4 gap-4 hover:bg-text hover:bg-opacity-10 transition-colors">
                {folder.name}
              </div>

              <div className="columns-3 gap-4 pb-4">
                {folder.items.map((photo) => {
                  if (isDirectory(photo)) return null;
                  return (
                    <img
                      key={photo.name}
                      className="mt-4 first:mt-0"
                      src={`/fs/Documents/Photos/${folder.name}/${photo.name}`}
                      alt=""
                    />
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
