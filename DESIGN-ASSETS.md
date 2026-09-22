# Brand and image assets

User-supplied original SVG is preserved in `public/brand/logo-original.svg`. `scripts/brand-assets.mjs` derives light/dark color versions and horizontal lockups from its existing paths. Orange is #FF6200, with near-black and white. The source is a traced vector; its original contours have been preserved. Original source files outside the project were not changed.

Concept images were created with the built-in imagegen tool, not the API/CLI. They are labeled on the website and do not represent real equipment, customer work, or staff. No invented phone number remains on the truck concept. Replace them with original business photos before representing actual jobs or fleet.

- `src/assets/truck-concept.png`: edited from the owner's supplied AI truck reference. Used in hero and truck photography slots.
- `src/assets/garage-concept.png`: new illustrative garage image. Used for service illustration and temporary photography slots.
- `public/social-card.png`: code-rendered brand graphic using the supplied logo, regenerated with `node scripts/social-card.mjs`.

Astro creates responsive WebP variants with width/height attributes. The hero has eager/high-priority loading; supporting images load lazily. Fonts are self-hosted Barlow Condensed and DM Sans; no external font request or tracker is added.

## Imagegen prompts

Truck (edit, built-in):

> Use case: precise-object-edit. Website photographic concept asset. Edit the supplied AI concept: remove the entire invented phone number 717-555-0198 from the pickup bed, leaving natural black paint. Preserve the truck, trailer, Resolve orange logos, driveway, house, trees and realistic lighting. Reframe as a polished wide 16:9 editorial photograph, less foreground asphalt, truck and trailer fully visible, crisp realistic black paint and natural warm daylight. No people, no new text, no added claims, no phone number anywhere. This will be labeled as an AI concept on the site.

Garage (generate, built-in):

> Use case: photorealistic-natural. Create a premium editorial website placeholder photograph, landscape 3:2. A sunlit American home's open garage viewed obliquely from the driveway, warm brick and white siding, a small organized grouping of an old tan armchair, taped cardboard boxes and a wooden side table near the garage doorway. Natural late afternoon light, rich neutral colors, tasteful quiet composition, realistic textures, no people, no trucks, no brand logos, no text, no before-after comparison, not a dirty or ruined home. This is illustrative concept imagery for a local junk removal site's service section, never presented as an actual customer job. Objects in right two thirds with architectural breathing room, professional real estate editorial quality.
