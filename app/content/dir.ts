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
              name: 'about',
              items: [
                {
                  class: 'file',
                  type: 'image',
                  name: 'icon_16.png',
                },
              ],
            },
            {
              class: 'dir',
              name: 'files',
              items: [
                {
                  class: 'file',
                  type: 'image',
                  name: 'icon_16.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'icon_32.png',
                },
              ],
            },
            {
              class: 'dir',
              name: 'intro',
              items: [
                {
                  class: 'file',
                  type: 'image',
                  name: 'icon_16.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'me.png',
                },
              ],
            },
            {
              class: 'dir',
              name: 'minesweeper',
              items: [
                {
                  class: 'file',
                  type: 'image',
                  name: 'icon_16.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'icon_32.png',
                },
              ],
            },
            {
              class: 'dir',
              name: 'preview',
              items: [
                {
                  class: 'file',
                  type: 'image',
                  name: 'icon_16.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'icon_32.png',
                },
              ],
            },
          ],
        },
        {
          class: 'dir',
          name: 'Resources',
          items: [
            {
              class: 'dir',
              name: 'Icons',
              items: [
                {
                  class: 'dir',
                  name: 'FileType',
                  items: [
                    {
                      class: 'file',
                      type: 'image',
                      name: 'dir_16.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'dir_32.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'image_16.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'image_32.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'md_16.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'md_32.png',
                    },
                  ],
                },
                {
                  class: 'dir',
                  name: 'UI',
                  items: [
                  ],
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'app_16.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'app_32.png',
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
