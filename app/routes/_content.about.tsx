import { Link } from '@remix-run/react';

export default function AboutRoute() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl">
        Teo Fumagalli
      </h1>

      <ul>
        <li>
          <Link to="/articles">Articles</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
      </ul>
    </div>
  );
}
