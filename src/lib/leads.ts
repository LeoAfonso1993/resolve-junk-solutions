export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export function validatePhotos(files: File[]) {
  if (files.length > MAX_PHOTOS) return 'Please choose up to 4 photos.';
  if (files.some((f) => !PHOTO_TYPES.includes(f.type)))
    return 'Please use JPG, PNG, or WebP photos.';
  if (files.some((f) => f.size > MAX_PHOTO_BYTES))
    return 'Each photo must be 5 MB or smaller.';
  return '';
}
export async function submitLead(
  data: FormData,
  endpoint: string,
): Promise<void> {
  if (!endpoint)
    throw new Error(
      'Online requests are not open yet. Your information has not been sent. Please check back closer to launch.',
    );
  const response = await fetch(endpoint, {
    method: 'POST',
    body: data,
    signal: AbortSignal.timeout(20000),
    headers: { Accept: 'application/json' },
  });
  if (!response.ok)
    throw new Error(
      response.status === 429
        ? 'Too many requests. Please wait a few minutes before trying again.'
        : 'Your request could not be confirmed. Please try again.',
    );
  const result = await response.json();
  // A 200 HTML page or empty mock response must never count as lead delivery.
  if (
    result.accepted !== true ||
    typeof result.id !== 'string' ||
    !result.id.trim()
  )
    throw new Error('We could not confirm receipt. Please try again later.');
}
