import { PRE_LAUNCH_MODE } from './business';
export const faqs = [
  {
    q: 'How does junk removal pricing work?',
    a: 'The amount of space your items take up, material type, lifting and access, and disposal requirements all affect the estimate. Share a list or photos to start. Pricing is confirmed for your particular job before you agree to it.',
    needsConfirmation: false,
  },
  {
    q: 'Do I need to move everything outside?',
    a: 'Leave heavy items where they are while requesting an estimate. Tell us where they are located, including stairs and tight doorways, so the removal plan can be reviewed.',
    needsConfirmation: true,
  },
  {
    q: 'Can you take furniture and appliances?',
    a:
      (PRE_LAUNCH_MODE
        ? 'Furniture and appliance removal are part of our planned services.'
        : 'We offer furniture and appliance removal.') +
      '  List each item in your request; some appliances need special handling and individual acceptance confirmation.',
    needsConfirmation: true,
  },
  {
    q: 'Can you clean out a garage or basement?',
    a:
      (PRE_LAUNCH_MODE
        ? 'Garage and basement cleanouts are part of our planned services.'
        : 'We offer garage and basement cleanouts.') +
      '  Photos of the contents and access route help us understand the scope. Set aside anything you want to keep.',
    needsConfirmation: true,
  },
  {
    q: 'What items can’t you take?',
    a: 'Our final accepted-materials list is being confirmed. Flag paint, chemicals, fuel, batteries, refrigerant-containing appliances, and any unknown materials in your request. Do not assume they can be collected.',
    needsConfirmation: true,
  },
  {
    q: 'Do you offer same-day pickups?',
    a: PRE_LAUNCH_MODE
      ? 'We are preparing to launch and are not booking pickups yet. You can share a future project; a request does not reserve a date.'
      : 'Availability must be confirmed for each request. Tell us your preferred date; a submitted request does not reserve a pickup.',
    needsConfirmation: true,
  },
  {
    q: 'Do you serve my area?',
    a:
      (PRE_LAUNCH_MODE
        ? 'Our planned service area is Lancaster County, Pennsylvania.'
        : 'Our service area is Lancaster County, Pennsylvania.') +
      '  Include the service ZIP in your request so we can confirm coverage for your address.',
    needsConfirmation: true,
  },
  {
    q: 'What happens to items after pickup?',
    a: 'Our disposal, donation, and recycling arrangements are being finalized. If the destination of a particular item matters to you, ask before agreeing to a pickup. We do not promise that every item can be donated or recycled.',
    needsConfirmation: true,
  },
];
