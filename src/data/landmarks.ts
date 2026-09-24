import type { ImageMetadata } from 'astro';
import photo0 from '../assets/landmarks/lancaster.jpg';
import photo1 from '../assets/landmarks/willow-street.jpg';
import photo2 from '../assets/landmarks/lititz.jpg';
import photo3 from '../assets/landmarks/manheim.jpg';
import photo4 from '../assets/landmarks/mount-joy.jpg';
import photo5 from '../assets/landmarks/elizabethtown.jpg';
import photo6 from '../assets/landmarks/ephrata.jpg';
import photo7 from '../assets/landmarks/columbia.jpg';
import photo8 from '../assets/landmarks/millersville.jpg';
import photo9 from '../assets/landmarks/strasburg.jpg';
import photo10 from '../assets/landmarks/denver.jpg';

interface Landmark {
  image: ImageMetadata;
  name: string;
  alt: string;
  position: string;
  source: string;
  author: string;
  license: string;
  licenseUrl: string;
}

// Real local photographs. Keep the visible credit when replacing an image.
// Sources and reuse terms: LANDMARK-PHOTOS.md.
export const landmarks: Record<string, Landmark> = {
  'lancaster-pa': {
    image: photo0,
    name: 'Lancaster Central Market',
    source:
      'https://commons.wikimedia.org/wiki/File:Lancaster_Central_Market.JPG',
    author: 'Jared Kofsky/PlaceNJ.com',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    alt: 'The red-brick facade of Lancaster Central Market.',
    position: '50% 50%',
  },
  'willow-street-pa': {
    image: photo1,
    name: '1719 Herr House',
    source: 'https://commons.wikimedia.org/wiki/File:Hans_Herr_House.jpg',
    author: 'Das753',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    alt: 'The stone 1719 Herr House beneath autumn trees in Willow Street.',
    position: '50% 50%',
  },
  'lititz-pa': {
    image: photo2,
    name: 'Lititz Springs Park',
    source: 'https://commons.wikimedia.org/wiki/File:Lititz_Spring_Park.jpg',
    author: 'Ximoxion',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    alt: 'The spring-fed channel, paths, and trees at Lititz Springs Park.',
    position: '50% 50%',
  },
  'manheim-pa': {
    image: photo3,
    name: 'Historic downtown Manheim',
    source: 'https://commons.wikimedia.org/wiki/File:Manheim,_Pennsylvania.jpg',
    author: 'Doug Kerr',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    alt: 'Historic brick storefronts in downtown Manheim.',
    position: '50% 50%',
  },
  'mount-joy-pa': {
    image: photo4,
    name: 'Bube’s Brewery',
    source: 'https://commons.wikimedia.org/wiki/File:Bubes_in_Mount_Joy.jpg',
    author: 'Historyundone',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    alt: 'Bube’s Brewery in Mount Joy during a Clydesdale visit.',
    position: '50% 50%',
  },
  'elizabethtown-pa': {
    image: photo5,
    name: 'Historic Elizabethtown station',
    source:
      'https://commons.wikimedia.org/wiki/File:Elizabethtown_Amtrak_station.jpg',
    author: 'Niagara',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
    alt: 'The stone station building and platforms at Elizabethtown.',
    position: '50% 50%',
  },
  'ephrata-pa': {
    image: photo6,
    name: 'Ephrata Cloister',
    source:
      'https://commons.wikimedia.org/wiki/File:Buildings_of_Ephrata_Cloister.jpg',
    author: 'Bestbudbrian',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    alt: 'Stone buildings and a footbridge at Ephrata Cloister.',
    position: '50% 50%',
  },
  'columbia-pa': {
    image: photo7,
    name: 'Columbia–Wrightsville Bridge',
    source:
      'https://commons.wikimedia.org/wiki/File:Mile_Across_(6607399899).jpg',
    author: 'Gerry Dincher from Hope Mills, NC',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    alt: 'The arches of the Columbia–Wrightsville Bridge across the Susquehanna River.',
    position: '50% 50%',
  },
  'millersville-pa': {
    image: photo8,
    name: 'Millersville University pond',
    source: 'https://commons.wikimedia.org/wiki/File:MillersvillePond2023.jpg',
    author: 'BigCheddah',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    alt: 'Swans and a footbridge at the Millersville University pond.',
    position: '50% 65%',
  },
  'strasburg-pa': {
    image: photo9,
    name: 'Strasburg Rail Road',
    source:
      'https://commons.wikimedia.org/wiki/File:Steam_in_Strasburg_(4431811481).jpg',
    author: 'jpmueller99 from Shenandoah Valley of VA, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    alt: 'A Strasburg Rail Road passenger train passing snow-covered fields near Strasburg.',
    position: '50% 65%',
  },
  'denver-pa': {
    image: photo10,
    name: 'Historic downtown Denver',
    source:
      'https://commons.wikimedia.org/wiki/File:Downtown_Denver,_Pennsylvania_(2),_Nov._2013.jpg',
    author: 'Doug Kerr from Albany, NY, United States',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    alt: 'Historic storefronts at Main and Railroad Streets in Denver, Pennsylvania.',
    position: '50% 50%',
  },
};
