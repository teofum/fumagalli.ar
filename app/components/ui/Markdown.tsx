import ReactMarkdown from 'react-markdown';

export default function Markdown({
  children,
  components,
  ...props
}: React.ComponentProps<typeof ReactMarkdown>) {
  return (
    <ReactMarkdown
      components={{
        h1: (props) => (
          <h1 className="font-display text-2xl text-h1" {...props} />
        ),
        h2: (props) => (
          <h2
            className="font-heading text-xl text-h2 mt-4 border-b border-current"
            {...props}
          />
        ),
        h3: (props) => (
          <h3
            className="font-text text-xl text-h3 mt-3 border-b border-current"
            {...props}
          />
        ),
        p: (props) => <p className="text-default mt-2" {...props} />,
        strong: (props) => <span className="bold" {...props} />,
        em: (props) => <em className="not-italic text-accent" {...props} />,
        a: ({ children, ...props }) => (
          <a {...props} target="_blank">
            {children}
          </a>
        ),
        li: (props) => (
          <li
            className="mt-2 list-outside list-['>__'] marker:bold ml-4"
            {...props}
          />
        ),
        ...components,
      }}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
}