import type { V2_MetaFunction } from '@remix-run/node';
import Desktop from '~/components/desktop/Desktop';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Teo Fumagalli' },
    { name: 'description', content: 'Welcome to my site!' },
  ];
};

export default function Index() {
  return <Desktop />;
}
