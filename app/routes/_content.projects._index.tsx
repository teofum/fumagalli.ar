import { Link, type V2_MetaFunction } from '@remix-run/react';

// TODO: get this from FS, right now there's like three projects so no big deal
const PROJECTS_LIST = ['DitherOS', 'Recipes App', 'UI Lab'];

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Projects — Teo Fumagalli' },
    { name: 'description', content: 'I make stuff sometimes' },
  ];
};

export default function PostsIndexRoute() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Projects
      </h1>

      <p className="mb-4">
        Stuff I've worked on.
      </p>

      <ul>
        {PROJECTS_LIST.map((project) => (
          <li key={project}>
            <Link to={project}>{project}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
