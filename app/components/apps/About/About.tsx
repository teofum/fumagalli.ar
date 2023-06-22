const VERSION = '0.0.0';

export default function About() {
  return (
    <div className="bg-surface bevel-content p-8 text-center select-none flex flex-col">
      <h1 className="font-display text-4xl text-inset mb-6">
        <span className="tracking-[-4px] mr-1.5">Te</span>
        <span>OS</span>
      </h1>

      <p>TeOS v{VERSION}</p>
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
