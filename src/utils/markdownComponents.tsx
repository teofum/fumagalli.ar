import RetroLink from "@/components/ui/Link";

export const markdownComponents = {
  h1: (props: React.PropsWithChildren) => (
    <h1 className="heading1" {...props} />
  ),
  h2: (props: React.PropsWithChildren) => (
    <h2 className="heading2" {...props} />
  ),
  h3: (props: React.PropsWithChildren) => (
    <h3 className="heading3" {...props} />
  ),
  p: (props: React.PropsWithChildren) => <p className="paragraph" {...props} />,
  a: ({ children, href }: any) => (
    <RetroLink href={href} target="_blank" rel="noreferrer noopener">
      {children}
    </RetroLink>
  ),
  li: (props: React.PropsWithChildren) => (
    <li className="mt-2 list-outside list-['>__'] ml-4" {...props} />
  ),
  pre: (props: React.PropsWithChildren) => (
    <pre
      className="paragraph text-content-xs bg-codeblock rounded-md p-4 my-4 overflow-auto"
      {...props}
    />
  ),
  blockquote: (props: React.PropsWithChildren) => (
    <blockquote className="paragraph blockquote" {...props} />
  ),
};
