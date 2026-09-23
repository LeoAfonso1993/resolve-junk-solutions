// Default to pre-launch. Set PRE_LAUNCH_MODE=false in the build environment
// only after completing POST-LAUNCH-CHECKLIST.md, then rebuild.
export const PRE_LAUNCH_MODE = import.meta.env?.PRE_LAUNCH_MODE !== 'false';
export const business = {
  name: 'Resolve Junk Solutions',
  url: 'https://resolvejunksolutions.com',
  region: 'Lancaster County, Pennsylvania',
  owner: {
    name: 'Leo Afonso',
    service: 'currently serves in the Pennsylvania Air National Guard',
  },
  expectedLaunch: 'November 2026',
  phone: '',
  email: '',
  launchDate: '',
  hours: '',
  socialProfiles: [] as string[],
  googleBusinessProfile: '',
};
export const quoteLabel = PRE_LAUNCH_MODE
  ? 'Plan Your Pickup'
  : 'Get a Free Quote';
export const launchStatus = `Aiming to launch in ${business.expectedLaunch}.`;
export const announcement = PRE_LAUNCH_MODE
  ? `${launchStatus} Locally owned in Lancaster County.`
  : 'Locally owned. Proudly serving Lancaster County.';
export const requestExpectation = PRE_LAUNCH_MODE
  ? `${launchStatus} Requests are for future service; pickup dates are not confirmed yet.`
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
