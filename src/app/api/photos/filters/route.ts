import { fetchTags } from '@/utils/photos/fetch-tags';
import { fetchExifStats } from '@/utils/photos/fetch-exif-stats';

export async function GET() {
  const tags = await fetchTags();
  const exif = await fetchExifStats();

  return Response.json({ tags, exif });
}
