import { PortableText } from '@portabletext/react';
import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { portableTextComponents } from '~/components/ui/PortableText';
import { fullProjectSchema } from '~/schemas/project';
import { sanityClient } from '~/utils/sanity.server';
import { PROJECT_QUERY } from '~/queries/queries';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.name} — Teo Fumagalli` },
    { name: 'description', content: 'A thing I made' },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;

  if (!slug) throw new Error('TODO 404 handling');

  const data = await fullProjectSchema
    .promise()
    .parse(sanityClient.fetch(PROJECT_QUERY(slug)));

  return json(data);
}

export default function Project() {
  const project = useLoaderData<typeof loader>();

  return (
    <article className="max-w-3xl mx-auto pb-16">
      <PortableText
        components={portableTextComponents}
        value={project.content}
      />
    </article>
  );
}
