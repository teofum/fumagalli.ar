import { fetch, json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Markdown from '~/components/ui/Markdown';

export async function loader({ request, params }: LoaderArgs) {
  const url = new URL(request.url);
  const { slug } = params;

  if (!slug) return json({ content: null });

  const res = await fetch(`${url.origin}/fs/Documents/Projects/${slug}.md`);
  if (res.ok) return json({ content: await res.text() });
  else throw json({}, { status: 404, statusText: 'Not Found' });
}

export default function Project() {
  const { content } = useLoaderData();

  return (
    <article className="article pb-16">
      <Markdown>{content}</Markdown>
    </article>
  );
}
