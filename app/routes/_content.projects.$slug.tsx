import { json, type V2_MetaFunction, type LoaderArgs } from '@remix-run/node';
import { useParams } from '@remix-run/react';

import { markdownComponents } from '~/utils/markdownComponents';
import projects from '~/content/md/projects';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.title} — Teo Fumagalli` },
    { name: 'description', content: 'A thing I made' },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;

  const title =
    projects.find((project) => project.slug === slug)?.title ?? '404 Not Found';
  return json({ title });
}

export default function Project() {
  const { slug } = useParams();

  const Component = projects.find((p) => p.slug === slug)?.Component;
  if (!Component) return null;

  return (
    <article className="article pb-16">
      <Component components={markdownComponents} />
    </article>
  );
}
