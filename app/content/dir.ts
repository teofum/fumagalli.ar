import type { Directory } from './types';

/**
 * The fake filesystem
 */
const root: Directory = {
  class: 'dir',
  name: 'Desktop',
  items: [
    {
      class: 'dir',
      name: 'Documents',
      items: [
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
          class: 'dir',
          name: 'Articles',
          items: [],
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
          class: 'file',
          type: 'md',
          name: 'test.md',
        },
      ],
    },
  ],
};

export default root;
