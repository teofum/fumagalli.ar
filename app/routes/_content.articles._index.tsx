import { Link, type V2_MetaFunction } from '@remix-run/react';
import DitherCard from '~/content/mdx/dither/dither.card';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Articles — Teo Fumagalli' },
    { name: 'description', content: 'I write stuff sometimes' },
  ];
};

export default function PostsIndexRoute() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Articles
      </h1>

      <h2 className="heading2">Featured articles</h2>
      <p className="mb-4">
        These are detailed, interactive deep-dives into a topic I find
        interesting. They take a long time to write and code, so don't expect a
        lot of them.
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-2">
        <Link to="introduction-to-dithering">
          <DitherCard />
        </Link>
      </div>

      <h2 className="heading2">Other articles</h2>
      <p className="mb-4"></p>

      <p>Nothing here yet!</p>
    </div>
  );
}
