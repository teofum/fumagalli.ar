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
                  class: 'dir',
                  name: 'resources',
                  items: [
                    {
                      class: 'file',
                      type: 'image',
                      name: 'go-up.png',
                    },
                  ],
                },
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
                  class: 'dir',
                  name: 'resources',
                  items: [
                    {
                      class: 'file',
                      type: 'image',
                      name: 'flag-question.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'flag.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'mine.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num-minus.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num0.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num1.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num2.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num3.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num4.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num5.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num6.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num7.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num8.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'num9.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'smiley-click.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'smiley-dead.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'smiley-win.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'smiley.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'wrong.png',
                    },
                  ],
                },
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
                  class: 'dir',
                  name: 'resources',
                  items: [
                    {
                      class: 'file',
                      type: 'image',
                      name: 'zoom-in.png',
                    },
                    {
                      class: 'file',
                      type: 'image',
                      name: 'zoom-out.png',
                    },
                  ],
                },
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
            {
              class: 'dir',
              name: 'UI',
              items: [
                {
                  class: 'file',
                  type: 'image',
                  name: 'check.c.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'check.c.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'check.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'check.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'close.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'close.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'copy.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'delete.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'max.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'max.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'min.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'min.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'minus.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'new.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'plus.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'remove.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'restore.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'restore.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'save.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'scrolldown.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'scrolldown.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'scrollleft.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'scrollleft.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'scrollright.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'scrollright.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'scrollup.d.png',
                },
                {
                  class: 'file',
                  type: 'image',
                  name: 'scrollup.png',
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
