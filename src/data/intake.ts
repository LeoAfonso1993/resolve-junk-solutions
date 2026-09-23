import { PRE_LAUNCH_MODE } from './business.ts';
export const intakeOptions = {
  services: [
    ['furniture', 'Furniture'],
    ['appliances', 'Appliances'],
    ['household', 'Household junk'],
    ['cleanout', 'Room / property cleanout'],
    ['yard', 'Yard debris'],
    ['construction', 'Project debris'],
    ['other', 'Something else'],
  ],
  volumes: [
    ['single', 'One or two items'],
    ['small', 'A small pile'],
    ['room', 'About a roomful'],
    ['multiple', 'Several rooms'],
    ['unsure', 'Not sure yet'],
  ],
  timeframes: [
    [
      'soon',
      PRE_LAUNCH_MODE ? 'As soon as service starts' : 'As soon as available',
    ],
    ['week', PRE_LAUNCH_MODE ? 'Within a week of launch' : 'Within a week'],
    ['month', PRE_LAUNCH_MODE ? 'Within a month of launch' : 'Within a month'],
    ['flexible', 'I’m flexible'],
    ['planning', 'Just planning'],
  ],
  access: [
    ['outside', 'Outside / driveway'],
    ['ground', 'Inside, ground floor'],
    ['stairs', 'Stairs involved'],
    ['elevator', 'Elevator access'],
    ['unsure', 'Not sure yet'],
  ],
  properties: [
    ['home', 'My home'],
    ['rental', 'Rental / managed property'],
    ['business', 'Business property'],
    ['estate', 'Property I’m helping clear'],
  ],
} as const;
export const priorityRules = {
  version: '1.0',
  timeframe: { soon: 35, week: 30, month: 15, flexible: 10, planning: 0 },
  volume: { single: 5, small: 10, room: 15, multiple: 20, unsure: 0 },
  detailPoints: 15,
  photoPoints: 10,
  knownAccessPoints: 10,
  highThreshold: 65,
  mediumThreshold: 35,
};
