import type { V2_MetaFunction } from '@remix-run/node';
import Desktop from '~/components/desktop/Desktop';
import Window from '~/components/desktop/Window';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <Desktop>
      <Window />
    </Desktop>
  );
}
