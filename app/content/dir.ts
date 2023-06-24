import type { Directory } from './types';

const FS_ROOT: Directory = {
  class: 'dir',
  name: 'My Computer',
  items: [
    {
      class: 'dir',
      name: 'Documents',
      items: [
        {
          class: 'dir',
          name: 'Articles',
          items: [
          ],
        },
        {
          class: 'dir',
          name: 'Photos',
          items: [
            {
              class: 'file',
              type: 'image',
              name: 'bigpic.jpg',
            },
          ],
        },
        {
          class: 'dir',
          name: 'Projects',
          items: [
            {
              class: 'file',
              type: 'md',
              name: 'Recipes App.md',
            },
          ],
        },
        {
          class: 'file',
          type: 'md',
          name: 'test.md',
        },
      ],
    },
    {
      class: 'dir',
      name: 'system',
      items: [
        {
          class: 'dir',
          name: 'Applications',
          items: [
            {
              class: 'dir',
              name: 'intro',
              items: [
                {
                  class: 'file',
                  type: 'image',
                  name: 'me.png',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default FS_ROOT;
