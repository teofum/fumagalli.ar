import { version } from 'package.json';

export default function About() {
  return (
    <div className="bg-surface bevel-content p-8 text-center select-none flex flex-col">
      <h1 className="font-display text-4xl text-inset mb-6">
        <span className="mr-1">Te</span>
        <span className="tracking-[2px]">OS</span>
      </h1>

      <p>TeOS v{version}</p>
      <p>Website by Teo Fumagalli</p>
      <p>
        Source code on{' '}
        <a
          href="https://github.com/teofum/fumagalli.ar"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </a>
      </p>
    </div>
  );
}
