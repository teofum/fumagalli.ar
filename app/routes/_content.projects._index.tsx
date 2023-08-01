import { Link, type V2_MetaFunction } from '@remix-run/react';
import projects from '~/content/md/projects';

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

      <p className="mb-4">Stuff I've worked on.</p>

      <ul>
        {projects.map((project) => (
          <li key={project.slug} className="border-t last:border-b">
            <Link
              to={project.slug}
              className="flex flex-row p-4 gap-4 hover:bg-text hover:bg-opacity-10 transition-colors"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
