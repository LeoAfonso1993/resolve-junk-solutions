export const services = [
  {
    slug: 'junk-removal',
    related: ['furniture-removal', 'garage-cleanouts', 'moving-cleanouts'],
    title: 'Junk removal',
    short: 'A few things, a full room, or a fresh start.',
    icon: 'box',
    intro:
      'Unwanted items have a way of collecting. Start with a list of what needs to go, whether it is one bulky item or a mix of household clutter.',
    items: [
      'Boxes and household clutter',
      'Bulky household items',
      'Mixed room cleanouts',
    ],
    preparation:
      'Separate anything you want to keep. For a mixed load, a few wide photos plus a short list are more helpful than a close-up of every item.',
    access:
      'Tell us which rooms the items are in and whether there are stairs, narrow doorways, or a long walk to parking.',
    note: 'Some materials need special handling. Include anything unusual in your request so we can discuss it before a pickup is arranged.',
  },
  {
    slug: 'furniture-removal',
    related: ['appliance-removal', 'moving-cleanouts', 'estate-cleanouts'],
    title: 'Furniture removal',
    short: 'Make room for what comes next.',
    icon: 'sofa',
    intro:
      'An old sofa can take up a lot of space—and be difficult to move. Share the furniture type, approximate size, and where it sits so we can help plan the removal.',
    items: [
      'Sofas and armchairs',
      'Tables and dressers',
      'Bed frames and shelving',
    ],
    preparation:
      'Photograph the whole item and its route out. Mention sleeper sofas, oversized pieces, or furniture fixed to a wall.',
    access:
      'Doorway width, tight turns, and stairs affect how furniture can be moved. You do not need to move a heavy piece just to photograph it.',
    note: 'Tell us about fragile surfaces and any disassembly that may be needed. Final handling arrangements are confirmed before scheduling.',
  },
  {
    slug: 'appliance-removal',
    related: ['furniture-removal', 'garage-cleanouts', 'moving-cleanouts'],
    title: 'Appliance removal',
    short: 'Out with the old. Space for the new.',
    icon: 'appliance',
    intro:
      'Replacing a bulky appliance? Include its type and condition in your request. Appliances can require different handling, so an itemized description helps avoid surprises.',
    items: [
      'Washers and dryers',
      'Stoves and dishwashers',
      'Refrigerators and freezers for review',
    ],
    preparation:
      'Include the model or a photo of the appliance. Tell us if it is still connected to electricity, water, or gas.',
    access:
      'Mention basement steps, built-in installations, and whether the appliance can be reached without moving other items.',
    note: 'Do not disconnect gas or alter electrical connections for a quote. Refrigerant-containing items and disconnection requirements need confirmation.',
  },
  {
    slug: 'garage-cleanouts',
    related: ['basement-cleanouts', 'junk-removal', 'yard-debris-removal'],
    title: 'Garage cleanouts',
    short: 'Get your garage back.',
    icon: 'garage',
    intro:
      'When the garage has become a storage room, a clear plan makes the cleanout easier. Show us what is staying and what you would like removed.',
    items: [
      'Stored household items',
      'Old shelving and bulky clutter',
      'Boxes and miscellaneous contents',
    ],
    preparation:
      'Create a keep area, then take wide photos of the rest. Identify chemicals, fuel, batteries, or paint separately for review.',
    access:
      'Let us know whether the garage opens to a driveway and if vehicles or stored items block the removal path.',
    note: 'A cleanout request does not mean every material can be accepted. Hazardous or unidentified contents must be discussed first.',
  },
  {
    slug: 'basement-cleanouts',
    related: ['garage-cleanouts', 'furniture-removal', 'estate-cleanouts'],
    title: 'Basement cleanouts',
    short: 'Less downstairs. More breathing room.',
    icon: 'stairs',
    intro:
      'Basement clutter is easy to put off when everything has to come up the stairs. Describe the contents and the exit route to help us assess the work.',
    items: [
      'Stored furniture',
      'Boxes and household clutter',
      'Unwanted shelving',
    ],
    preparation:
      'Take photos of the contents and staircase. Keep important documents, personal keepsakes, and items to save separate.',
    access:
      'Ceiling height, stair width, handrails, and an exterior entrance can affect the removal plan. Include these in your request.',
    note: 'Tell us about water damage, mold concerns, or other conditions before any visit. These may require a specialist rather than a standard cleanout.',
  },
  {
    slug: 'estate-cleanouts',
    related: ['furniture-removal', 'basement-cleanouts', 'moving-cleanouts'],
    title: 'Estate cleanouts',
    short: 'A thoughtful approach to a big task.',
    icon: 'home',
    intro:
      'Sorting a home can involve practical decisions and personal ones. An estate cleanout starts with understanding what has already been sorted and who is coordinating the property.',
    items: [
      'Furniture and household contents',
      'Items remaining after sorting',
      'Room-by-room cleanout requests',
    ],
    preparation:
      'Set aside records, valuables, and keepsakes before removal. Identify the person authorized to approve what leaves the property.',
    access:
      'Tell us how many rooms need attention and whether there is a deadline, key handoff, or other access arrangement.',
    note: 'Removal is separate from valuation and estate administration. Do not include sensitive legal documents in your quote photos.',
  },
  {
    slug: 'moving-cleanouts',
    related: ['furniture-removal', 'junk-removal', 'estate-cleanouts'],
    title: 'Moving cleanouts',
    short: 'Take the next step with less to carry.',
    icon: 'box',
    intro:
      'Moving is a useful time to decide what is worth taking. Share the items you want to leave behind and your planned move date so the timing can be reviewed.',
    items: [
      'Furniture you are not taking',
      'Leftover household items',
      'Pre-move and post-move clutter',
    ],
    preparation:
      'Separate the moving pile from the removal pile. If the contents may change, let us know when the final list will be ready.',
    access:
      'Mention elevator reservations, building access, loading restrictions, and key-return deadlines if they apply to your property.',
    note: 'Sending a request does not reserve a pickup date. Wait for confirmed availability before building removal into your moving schedule.',
  },
  {
    slug: 'yard-debris-removal',
    related: [
      'garage-cleanouts',
      'construction-debris-removal',
      'junk-removal',
    ],
    title: 'Yard debris removal',
    short: 'A clearer yard after the cleanup.',
    icon: 'leaf',
    intro:
      'After a yard cleanup, the piles can be the last thing standing between you and a usable outdoor space. Describe the material and how it is gathered.',
    items: [
      'Branches and brush for review',
      'Bagged yard material for review',
      'Small outdoor cleanup piles',
    ],
    preparation:
      'Photograph the entire pile with something nearby for scale. Identify soil, stones, treated wood, and other mixed materials separately.',
    access:
      'Tell us how far the pile is from vehicle access and whether a gate, slope, or soft ground is involved.',
    note: 'Material acceptance, size limits, and handling requirements need confirmation. Tree cutting and landscaping are not included in this removal request.',
  },
  {
    slug: 'construction-debris-removal',
    related: ['yard-debris-removal', 'garage-cleanouts', 'junk-removal'],
    title: 'Construction debris removal',
    short: 'Finish the project. Clear the leftovers.',
    icon: 'tools',
    intro:
      'Renovation leftovers need a different estimate from ordinary household clutter. List the materials and approximate quantities so weight and disposal requirements can be reviewed.',
    items: [
      'Wood offcuts for review',
      'Fixtures and renovation leftovers',
      'Separated project debris',
    ],
    preparation:
      'Keep materials separated where possible. Flag sharp objects, heavy masonry, and anything with unknown coatings or composition.',
    access:
      'Describe the loading area, distance from the debris, and any site restrictions. Photos should show both the pile and its access route.',
    note: 'Never assume suspected asbestos, chemicals, or other hazardous materials can be taken. Acceptance must be confirmed; demolition is not included.',
  },
];
