// Preview wording is opt-in. Production builds are operational by default.
export const PRE_LAUNCH_MODE = import.meta.env?.PRE_LAUNCH_MODE === 'true';
// Keep prominent call-now actions easy to enable without scattering the switch.
export const SHOW_PHONE_CTA = false;
export const business = {
  name: 'Resolve Junk Solutions',
  url: 'https://resolvejunksolutions.com',
  region: 'Lancaster County, Pennsylvania',
  owner: {
    name: 'Leo Afonso',
    service: 'currently serves in the Pennsylvania Air National Guard',
  },
  phone: '717-742-0722',
  phoneE164: '+17177420722',
  email: 'hello@resolvejunksolutions.com',
  hours: '',
  socialProfiles: [] as string[],
  googleBusinessProfile: '',
};
export const quoteLabel = PRE_LAUNCH_MODE
  ? 'Plan Your Pickup'
  : 'Get a Free Quote';
export const launchStatus = 'Planning a pickup in Lancaster County.';
export const announcement = 'Serving Lancaster County • Launching November 2026';
export const requestExpectation = PRE_LAUNCH_MODE
  ? 'Tell us about your project. Pickup dates are arranged separately.'
  : 'Your request starts an estimate. A pickup date is confirmed separately.';
export const futureFeatures = {
  reviews: [],
  jobGallery: [],
  bookingUrl: '',
  financingUrl: '',
};
export const loadSizes = [
  'Single item',
  '¼ load',
  '½ load',
  '¾ load',
  'Full load',
];
