import TestMD from '~/content/test.md';
import UntitledAppMD from '~/content/untitled-app.md';

type MarkdownComponent = React.ComponentType<
  Readonly<Record<string, unknown>> & {
    components?: Readonly<
      Partial<
        Record<
          keyof React.ReactHTML | 'wrapper',
          keyof React.ReactHTML | React.ComponentType
        >
      >
    >;
  }
>;

/**
 * Filesystem object types
 */
interface FSObjectBase {
  name: string;
}

export interface Directory extends FSObjectBase {
  class: 'dir';

  items: FSObject[];
}

export interface FileBase extends FSObjectBase {
  class: 'file';
}

export interface ImageFile extends FileBase {
  type: 'image';

  src: string;
  altText?: string;
}

export interface MarkdownFile extends FileBase {
  type: 'md';

  component: MarkdownComponent;
}

export type AnyFile = ImageFile | MarkdownFile;

export type FSObject = Directory | AnyFile;

/**
 * The fake filesystem
 */
const root: Directory = {
  class: 'dir',
  name: 'Desktop',
  items: [
    {
      class: 'dir',
      name: 'Projects',
      items: [
        {
          class: 'file',
          type: 'md',
          name: 'Untitled Recipes App.md',
          component: UntitledAppMD,
        },
        {
          class: 'file',
          type: 'md',
          name: 'test.md',
          component: TestMD,
        },
        {
          class: 'dir',
          name: 'Pics',
          items: [
            {
              class: 'file',
              type: 'image',
              name: 'result.png',
              src: '/img/result.png',
            },
          ],
        },
      ],
    },
  ],
};

export default root;
