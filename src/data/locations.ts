// Candidate coverage, supplied by the owner. Confirm each area and add verified
// local operating details before making its page indexable.
export const locations = [
  [
    'lancaster-pa',
    'Lancaster',
    'Planning a pickup at a city property? Include parking access and the route from the items to the street.',
    'Furniture and moving cleanouts',
    ['furniture-removal', 'moving-cleanouts'],
    ['millersville-pa', 'willow-street-pa'],
  ],
  [
    'willow-street-pa',
    'Willow Street',
    'For a Willow Street request, share your ZIP and whether the items are inside a home, in a garage, or already gathered outside.',
    'Household and garage cleanouts',
    ['junk-removal', 'garage-cleanouts'],
    ['lancaster-pa', 'strasburg-pa'],
  ],
  [
    'lititz-pa',
    'Lititz',
    'Planning to clear space before a furniture delivery in Lititz? Include the delivery date, but wait for pickup confirmation before relying on a time slot.',
    'Furniture and appliance removal',
    ['furniture-removal', 'appliance-removal'],
    ['manheim-pa', 'ephrata-pa'],
  ],
  [
    'manheim-pa',
    'Manheim',
    'For a cleanout in the Manheim area, a room-by-room list helps distinguish a few items from a larger project. Include the full service ZIP so coverage can be checked.',
    'Garage and basement projects',
    ['garage-cleanouts', 'basement-cleanouts'],
    ['lititz-pa', 'mount-joy-pa'],
  ],
  [
    'mount-joy-pa',
    'Mount Joy',
    'Moving in or around Mount Joy? Tell us what remains to be removed and when access to the property ends. Requested dates still need confirmation.',
    'Move-related removal',
    ['moving-cleanouts', 'furniture-removal'],
    ['elizabethtown-pa', 'columbia-pa'],
  ],
  [
    'elizabethtown-pa',
    'Elizabethtown',
    'For an Elizabethtown property with several rooms to clear, send an overview of each room and identify who will be there to approve the removal.',
    'Coordinated household cleanouts',
    ['estate-cleanouts', 'junk-removal'],
    ['mount-joy-pa', 'manheim-pa'],
  ],
  [
    'ephrata-pa',
    'Ephrata',
    'If your Ephrata request includes appliances and general clutter, list the appliances separately. Their handling needs may differ from the rest of the load.',
    'Appliances and household items',
    ['appliance-removal', 'junk-removal'],
    ['denver-pa', 'lititz-pa'],
  ],
  [
    'columbia-pa',
    'Columbia',
    'For a Columbia basement or indoor pickup, photos of the exit path are as useful as photos of the items. Mention stairs and tight turns.',
    'Indoor cleanouts',
    ['basement-cleanouts', 'furniture-removal'],
    ['mount-joy-pa', 'millersville-pa'],
  ],
  [
    'millersville-pa',
    'Millersville',
    'Coordinating a Millersville move-out? Identify the items to remove, the property contact, and any key-return deadline in your request.',
    'Moving and room cleanouts',
    ['moving-cleanouts', 'junk-removal'],
    ['lancaster-pa', 'columbia-pa'],
  ],
  [
    'strasburg-pa',
    'Strasburg',
    'For an outdoor cleanup in the Strasburg area, show the pile and the vehicle access route. Mention mixed materials so acceptance can be reviewed.',
    'Outdoor and garage cleanup',
    ['yard-debris-removal', 'garage-cleanouts'],
    ['willow-street-pa', 'lancaster-pa'],
  ],
  [
    'denver-pa',
    'Denver',
    'For a Denver project cleanup, include the material types, approximate pile size, and service ZIP. Heavy project debris needs an individual review.',
    'Project debris and bulky items',
    ['construction-debris-removal', 'appliance-removal'],
    ['ephrata-pa', 'lititz-pa'],
  ],
].map(([slug, name, tip, focus, serviceSlugs, nearby]) => ({
  slug: slug as string,
  name: name as string,
  tip: tip as string,
  focus: focus as string,
  serviceSlugs: serviceSlugs as string[],
  nearby: nearby as string[],
  confirmed: false,
  contentReady: false, // Verified local operating detail, separately reviewed before indexing.
}));

export const isIndexableLocation = (location: (typeof locations)[number]) =>
  location.confirmed && location.contentReady;
