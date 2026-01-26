import { getAppResourcesUrl } from '@/content/utils';
import { IconLinkButton } from './Button';

const resources = getAppResourcesUrl('files');

type WebringProps = {
  indexUrl: string;
  baseUrl: string;
  nextUrl?: string;
  prevUrl?: string;

  iconUrl: string;
};

export default function Webring({
  indexUrl,
  baseUrl,
  nextUrl = 'next',
  prevUrl = 'prev',
  iconUrl,
}: WebringProps) {
  const fullPrevUrl = `${baseUrl}/${prevUrl}`;
  const fullNextUrl = `${baseUrl}/${nextUrl}`;

  return (
    <div className="flex flex-row">
      <IconLinkButton href={fullPrevUrl} imageUrl={`${resources}/back.png`} />

      <IconLinkButton href={indexUrl} imageUrl={iconUrl} />

      <IconLinkButton
        href={fullNextUrl}
        imageUrl={`${resources}/forward.png`}
      />
    </div>
  );
}
