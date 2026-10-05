// The owner requested SEO landing pages for these Lancaster County towns.
// Confirm ZIP-level coverage before adding additional communities.
export const locations = [
  [
    'lancaster-pa',
    'Lancaster',
    'From one piece of furniture to a move-out cleanout, we can help you make a little more room. In Lancaster, parking and street access can shape the pickup plan, so include where a vehicle can stop.',
    'Furniture and moving cleanouts',
    ['furniture-removal', 'moving-cleanouts'],
    ['millersville-pa', 'willow-street-pa'],
    'Whether you are clearing a room, preparing for a move, or finally letting go of a bulky item, start with the pieces you want removed. In Lancaster, parking and street access can shape the pickup plan; a quick note about where a vehicle can stop helps us understand the approach.',
  ],
  [
    'willow-street-pa',
    'Willow Street',
    'Whether it is one bulky item or a garage that has slowly filled up, tell us what you would like gone and where it is. We will review the details with you before a pickup is arranged.',
    'Household and garage cleanouts',
    ['junk-removal', 'garage-cleanouts'],
    ['lancaster-pa', 'strasburg-pa'],
    'Some Willow Street projects are a single sofa or appliance; others are the boxes and odds and ends that have claimed a corner of the garage. Start with the items that matter most, and we can talk through the rest together.',
  ],
  [
    'lititz-pa',
    'Lititz',
    'From furniture and appliances to a fuller household cleanout, we can help you make space. If your Lititz home is on a borough street, a note about parking and access helps us plan the conversation.',
    'Furniture and appliance removal',
    ['furniture-removal', 'appliance-removal'],
    ['manheim-pa', 'ephrata-pa'],
    'An old appliance or a piece of furniture can be surprisingly hard to move on your own. Tell us what needs to go and where it is; for homes on Lititz borough streets, include any parking or access details that could affect the route out.',
  ],
  [
    'manheim-pa',
    'Manheim',
    'In Manheim, that might mean one bulky item, a crowded garage, or a basement you have been meaning to clear. Start with your ZIP and the space you want back.',
    'Garage and basement projects',
    ['garage-cleanouts', 'basement-cleanouts'],
    ['lititz-pa', 'mount-joy-pa'],
    'Sometimes it is just one thing taking up too much room. Sometimes the garage or basement has become the project. For Manheim pickups, tell us what should stay, what can go, and how the items can be reached so we can understand the job before discussing a plan.',
  ],
  [
    'mount-joy-pa',
    'Mount Joy',
    'Moving can leave a few things behind that no longer fit the next chapter. Share what needs to go and any timing around your move, and we will review the request with you.',
    'Move-related removal',
    ['moving-cleanouts', 'furniture-removal'],
    ['elizabethtown-pa', 'columbia-pa'],
    'A move is a natural moment to decide what is worth taking along. For Mount Joy requests, share the items you plan to leave behind and any handover timing that matters. We will review availability with you before anything is confirmed.',
  ],
  [
    'elizabethtown-pa',
    'Elizabethtown',
    'When several rooms need attention, the first step is making a clear plan. Tell us which areas you are working through and who is coordinating the home.',
    'Coordinated household cleanouts',
    ['estate-cleanouts', 'junk-removal'],
    ['mount-joy-pa', 'manheim-pa'],
    'A household cleanout can involve a lot of decisions as well as a lot of belongings. In Elizabethtown, a room-by-room overview and a note about who is coordinating the property help us understand what you need.',
  ],
  [
    'ephrata-pa',
    'Ephrata',
    'From an older appliance to everyday household clutter, tell us what you would like removed. Listing appliances separately helps us review any different handling needs.',
    'Appliances and household items',
    ['appliance-removal', 'junk-removal'],
    ['denver-pa', 'lititz-pa'],
    'Many Ephrata projects mix bulky appliances with the household items around them. A simple list, with appliances called out separately, gives us a clearer picture of the load and the way out.',
  ],
  [
    'columbia-pa',
    'Columbia',
    'A basement cleanout can feel like a big job before anything has moved. Tell us what is downstairs and what the route out looks like; a photo of the stairs can be as helpful as a photo of the items.',
    'Indoor cleanouts',
    ['basement-cleanouts', 'furniture-removal'],
    ['mount-joy-pa', 'millersville-pa'],
    'Whether you are clearing a basement or making room around a favorite piece of furniture, start with what you want to keep and what can go. In Columbia, notes or photos of stairs and tight turns help us understand the way out.',
  ],
  [
    'millersville-pa',
    'Millersville',
    'If a move or room cleanout has left you with things you do not want to carry forward, we can help you think through removal. Share the items, who we should coordinate with, and any timing that matters.',
    'Moving and room cleanouts',
    ['moving-cleanouts', 'junk-removal'],
    ['lancaster-pa', 'columbia-pa'],
    'A move can make the keep-or-go decisions feel very real. For Millersville requests, an item list and any handover timing help us understand what remains and who is coordinating access.',
  ],
  [
    'strasburg-pa',
    'Strasburg',
    'After a yard cleanup, the last thing standing between you and a clear space can be the pile itself. Tell us what it includes and how close a vehicle can get.',
    'Outdoor and garage cleanup',
    ['yard-debris-removal', 'garage-cleanouts'],
    ['willow-street-pa', 'lancaster-pa'],
    'From garage odds and ends to branches gathered after a yard project, Strasburg cleanups can look different from one home to the next. A wide photo of the pile and a note about vehicle access help us understand the request.',
  ],
  [
    'denver-pa',
    'Denver',
    'Renovation leftovers can be heavy, mixed, and harder to estimate at a glance. Tell us the material types, approximate amount, and where the pile is before we discuss the next step.',
    'Project debris and bulky items',
    ['construction-debris-removal', 'appliance-removal'],
    ['ephrata-pa', 'lititz-pa'],
    'If a project has left a pile of materials behind, the details matter. For Denver requests, describe what the debris is, roughly how much there is, and how it can be reached so we can review whether it is a fit.',
  ],
].map(([slug, name, tip, focus, serviceSlugs, nearby, localParagraph]) => ({
  slug: slug as string,
  name: name as string,
  tip: tip as string,
  focus: focus as string,
  serviceSlugs: serviceSlugs as string[],
  nearby: nearby as string[],
  localParagraph: localParagraph as string,
  popularServiceSlugs: (slug === 'lancaster-pa'
    ? [
        'furniture-removal',
        'appliance-removal',
        'junk-removal',
        'moving-cleanouts',
        'garage-cleanouts',
        'estate-cleanouts',
      ]
    : slug === 'willow-street-pa'
      ? [
          'junk-removal',
          'garage-cleanouts',
          'furniture-removal',
          'appliance-removal',
          'basement-cleanouts',
          'moving-cleanouts',
        ]
      : slug === 'lititz-pa'
        ? [
            'furniture-removal',
            'appliance-removal',
            'moving-cleanouts',
            'garage-cleanouts',
            'basement-cleanouts',
            'junk-removal',
          ]
        : slug === 'manheim-pa'
          ? [
              'garage-cleanouts',
              'basement-cleanouts',
              'furniture-removal',
              'appliance-removal',
              'junk-removal',
              'moving-cleanouts',
            ]
          : slug === 'mount-joy-pa'
            ? [
                'moving-cleanouts',
                'furniture-removal',
                'junk-removal',
                'garage-cleanouts',
                'basement-cleanouts',
                'estate-cleanouts',
              ]
            : slug === 'elizabethtown-pa'
              ? [
                  'estate-cleanouts',
                  'junk-removal',
                  'furniture-removal',
                  'moving-cleanouts',
                  'garage-cleanouts',
                  'basement-cleanouts',
                ]
              : slug === 'ephrata-pa'
                ? [
                    'appliance-removal',
                    'junk-removal',
                    'furniture-removal',
                    'garage-cleanouts',
                    'basement-cleanouts',
                    'moving-cleanouts',
                  ]
                : slug === 'columbia-pa'
                  ? [
                      'basement-cleanouts',
                      'furniture-removal',
                      'junk-removal',
                      'appliance-removal',
                      'moving-cleanouts',
                      'garage-cleanouts',
                    ]
                  : slug === 'millersville-pa'
                    ? [
                        'moving-cleanouts',
                        'junk-removal',
                        'furniture-removal',
                        'garage-cleanouts',
                        'basement-cleanouts',
                        'estate-cleanouts',
                      ]
                    : slug === 'strasburg-pa'
                      ? [
                          'yard-debris-removal',
                          'garage-cleanouts',
                          'junk-removal',
                          'furniture-removal',
                          'appliance-removal',
                          'moving-cleanouts',
                        ]
                      : [
                          'construction-debris-removal',
                          'appliance-removal',
                          'junk-removal',
                          'garage-cleanouts',
                          'furniture-removal',
                          'basement-cleanouts',
                        ]) as string[],
  confirmed: true,
  contentReady: true,
}));

export const isIndexableLocation = (location: (typeof locations)[number]) =>
  location.confirmed && location.contentReady;
