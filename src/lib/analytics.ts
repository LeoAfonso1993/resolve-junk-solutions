export type AnalyticsEvent =
  | 'quote_cta_click'
  | 'phone_click'
  | 'quote_step_view'
  | 'quote_form_start'
  | 'quote_form_submit'
  | 'photo_upload'
  | 'service_page_view'
  | 'location_page_view';
// No personal details, form content, filenames, or trackers. Listen to this event
// to connect a consent-aware analytics provider later.
export function track(
  event: AnalyticsEvent,
  detail: Record<string, string | number> = {},
) {
  window.dispatchEvent(
    new CustomEvent('resolve:analytics', { detail: { event, ...detail } }),
  );
}
