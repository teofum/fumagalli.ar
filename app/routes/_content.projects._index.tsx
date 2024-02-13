import { json } from '@remix-run/node';
import { Link, useLoaderData, type V2_MetaFunction } from '@remix-run/react';

import { projectSchema } from '~/schemas/project';
import { sanityClient } from '~/utils/sanity.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Projects — Teo Fumagalli' },
    { name: 'description', content: 'I make stuff sometimes' },
  ];
};

const PROJECTS_QUERY = `
*[_type == "project"] {
  _id,
  name,
  slug,
}`;

export async function loader() {
  const data = await projectSchema
    .array()
    .promise()
    .parse(sanityClient.fetch(PROJECTS_QUERY));

  return json(data);
}

export default function ProjectsIndexRoute() {
  const projects = useLoaderData<typeof loader>();

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
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
