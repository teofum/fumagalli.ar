import type { MarkdownFile } from '~/content/dir';

interface PreviewProps {
  file?: MarkdownFile;
}

export default function Preview({ file }: PreviewProps) {
  if (!file) return null;

  return (
    <div className="bg-default bevel-content p-1">
      <file.component />
    </div>
  );
}
