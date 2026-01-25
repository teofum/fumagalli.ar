import { PortableText } from '@portabletext/react';
import { json, type LoaderArgs } from '@remix-run/node';
import { type V2_MetaFunction, useLoaderData } from '@remix-run/react';
import { portableTextComponents } from '~/components/ui/PortableText';

import { fullArticleSchema } from '~/schemas/article';
import { sanityClient } from '~/utils/sanity.server';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.title} — Teo Fumagalli` },
    { name: 'description', content: 'A thing I wrote' },
  ];
};

const ARTICLE_QUERY = (slug: string) => `
*[_type == "article" && slug == "${slug}"][0] {
  _id,
  title,
  slug,
  legacyDate,
  'fileDate': file->_createdAt,
  'content': file->content,
}`;

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;

  if (!slug) throw new Error('TODO 404 handling');

  const data = await fullArticleSchema
    .promise()
    .parse(sanityClient.fetch(ARTICLE_QUERY(slug)));

  return json(data);
}

export default function Post() {
  const article = useLoaderData<typeof loader>();

  return (
    <article className="max-w-3xl mx-auto pb-16">
      <PortableText
        components={portableTextComponents}
        value={article.content}
      />
    </article>
  );
}
