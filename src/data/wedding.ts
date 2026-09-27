import placeholders from './image-placeholders.json'

/**
 * Centralized wedding content. Edit this file to update any text, dates, venues,
 * or media shown on the site — components read from here instead of hard-coding
 * copy, so a single edit updates every section that references it.
 *
 * Image paths are project-relative (no leading slash) and should be passed through
 * the `asset()` helper (see src/utils/asset.ts) when rendered, so links keep working
 * under the GitHub Pages base path.
 */

export interface ResponsiveImage {
  jpg800: string
  jpg1600: string
  webp800: string
  webp1600: string
  width: number
  height: number
  alt: string
  blurDataUrl?: string
}

export interface FamilyMember {
  relation: string
  name: string
}

export interface Person {
  fullName: string
  shortName: string
  qualifications: string
  profession: string
  parents: FamilyMember[]
  city: string
  photo: ResponsiveImage
}

export interface WeddingEvent {
  id: string
  name: string
  /** ISO date, e.g. "2026-10-25" */
  date: string
  /** 24-hour "HH:mm" in `timeZone` */
  startTime: string
  endTime?: string
  timeZone: string
  venueName: string
  address: string
  /** Explicit Google Maps link, if one is ever confirmed; otherwise derived from `address`. */
  mapsUrl?: string
  /** Pre-generated QR code (see scripts/generate-qr.mjs) pointing to the maps link. */
  qrImage?: string
  description?: string
  dressCode?: string
  isPrimary?: boolean
}

export interface StoryChapter {
  title: string
  date?: string
  body: string
}

export interface WeddingData {
  siteTitle: string
  couple: {
    groom: Person
    bride: Person
    combinedNames: string
    monogram: string
  }
  hero: {
    eyebrow: string
    headline: string
    message: string
    subMessage: string
    groomPhoto: ResponsiveImage
    bridePhoto: ResponsiveImage
  }
  /** Real engagement-ceremony photographs, shown together in the Our Story section. */
  engagement: {
    primary: ResponsiveImage
    secondary: ResponsiveImage
    date: string
    venue: string
  }
  story: {
    symbolic: string
    /** Optional detailed "how we met" timeline — add chapters here if/when available. */
    chapters: StoryChapter[]
  }
  countdown: {
    label: string
    date: string
    time: string
    timeZone: string
    completedMessage: string
  }
  events: WeddingEvent[]
  messages: {
    invitation: string
    blessing: string
    closing: string
  }
  social: {
    shareTitle: string
    shareText: string
  }
}

const engagementPrimary: ResponsiveImage = {
  jpg800: 'assets/images/engagement-1-800.jpg',
  jpg1600: 'assets/images/engagement-1-1600.jpg',
  webp800: 'assets/images/engagement-1-800.webp',
  webp1600: 'assets/images/engagement-1-1600.webp',
  width: 1600,
  height: 1067,
  alt: 'Joy and Glory exchanging rings at their engagement ceremony',
  blurDataUrl: placeholders.engagement1,
}

const engagementSecondary: ResponsiveImage = {
  jpg800: 'assets/images/engagement-2-800.jpg',
  jpg1600: 'assets/images/engagement-2-1600.jpg',
  webp800: 'assets/images/engagement-2-800.webp',
  webp1600: 'assets/images/engagement-2-1600.webp',
  width: 1600,
  height: 1067,
  alt: 'Joy and Glory exchanging rings, surrounded by floral decor',
  blurDataUrl: placeholders.engagement2,
}

const groomPhoto: ResponsiveImage = {
  jpg800: 'assets/images/groom-portrait-800.jpg',
  jpg1600: 'assets/images/groom-portrait-1600.jpg',
  webp800: 'assets/images/groom-portrait-800.webp',
  webp1600: 'assets/images/groom-portrait-1600.webp',
  width: 1600,
  height: 2400,
  alt: 'Portrait of Joy Aloysius',
  blurDataUrl: placeholders.groomPortrait,
}

const bridePhoto: ResponsiveImage = {
  jpg800: 'assets/images/bride-portrait-800.jpg',
  jpg1600: 'assets/images/bride-portrait-1600.jpg',
  webp800: 'assets/images/bride-portrait-800.webp',
  webp1600: 'assets/images/bride-portrait-1600.webp',
  width: 1600,
  height: 2400,
  alt: 'Portrait of Glory Deoja',
  blurDataUrl: placeholders.bridePortrait,
}

// Hero-section-only photos, deliberately separate from groomPhoto/bridePhoto above
// (which are shared with CoupleIntro) so the two sections can show different photos.
const groomHeroPhoto: ResponsiveImage = {
  jpg800: 'assets/images/groom-hero-800.jpg',
  jpg1600: 'assets/images/groom-hero-1600.jpg',
  webp800: 'assets/images/groom-hero-800.webp',
  webp1600: 'assets/images/groom-hero-1600.webp',
  width: 1600,
  height: 2400,
  alt: 'Joy Aloysius',
  blurDataUrl: placeholders.groomHero,
}

const brideHeroPhoto: ResponsiveImage = {
  jpg800: 'assets/images/bride-hero-800.jpg',
  jpg1600: 'assets/images/bride-hero-1600.jpg',
  webp800: 'assets/images/bride-hero-800.webp',
  webp1600: 'assets/images/bride-hero-1600.webp',
  width: 1600,
  height: 2400,
  alt: 'Glory Deoja',
  blurDataUrl: placeholders.brideHero,
}

export const wedding: WeddingData = {
  siteTitle: 'Joy & Glory — Wedding Celebrations',

  couple: {
    groom: {
      fullName: 'Joy Aloysius A',
      shortName: 'Joy',
      qualifications: 'B.E.,MBA.,',
      profession: 'Software Professional',
      parents: [
        { relation: 'Father', name: 'Mr. Arokiadoss J' },
        { relation: 'Mother', name: 'Mrs. Leema Rani A' },
      ],
      city: 'Bangalore',
      photo: groomPhoto,
    },
    bride: {
      fullName: 'Glory Deoja A',
      shortName: 'Glory',
      qualifications: 'MBBS.,MD.,',
      profession: 'Doctor',
      parents: [
        { relation: 'Father', name: 'Mr. Amarr Dev P' },
        { relation: 'Mother', name: 'Mrs. Girija V' },
      ],
      city: 'Pondicherry',
      photo: bridePhoto,
    },
    combinedNames: 'Joy & Glory',
    monogram: 'assets/images/monogram-jg',
  },

  hero: {
    eyebrow: 'Wedding Invitation',
    headline: 'Joy & Glory',
    message: 'What started as a beautiful story now becomes a lifelong promise.',
    subMessage: 'We are delighted to invite you to share in the beginning of our forever.',
    groomPhoto: groomHeroPhoto,
    bridePhoto: brideHeroPhoto,
  },

  // Real engagement-ceremony photographs, shown together in the Our Story section.
  engagement: {
    primary: engagementPrimary,
    secondary: engagementSecondary,
    date: '2026-07-12',
    venue: 'Bon S\u00e9jour, Puducherry',
  },

  story: {
    // The source material did not describe how Joy and Glory met, so the copy stays
    // symbolic rather than inventing a workplace, introduction, or timeline.
    symbolic: 'Two journeys, from two beautiful places, found their way to one shared destination.',
    chapters: [],
  },

  countdown: {
    label: 'Holy Matrimony',
    date: '2026-10-25',
    time: '10:30',
    timeZone: 'Asia/Kolkata',
    completedMessage: 'The Celebration Has Begun',
  },

  events: [
    {
      id: 'holy-matrimony',
      name: 'Holy Matrimony',
      date: '2026-10-25',
      startTime: '10:30',
      timeZone: 'Asia/Kolkata',
      venueName: 'Mary Help of Christians Church',
      address: 'Mary Help of Christians Church, Tirupathur, Tamil Nadu',
      mapsUrl: 'https://maps.app.goo.gl/MqMLP3nsxBDChXc8A',
      qrImage: 'assets/images/qr/holy-matrimony.png',
      isPrimary: true,
    },
    {
      id: 'tirupathur-reception',
      name: 'Tirupathur Reception',
      date: '2026-10-25',
      startTime: '12:30',
      timeZone: 'Asia/Kolkata',
      venueName: 'Sri Lalitha Mahal',
      address: 'Sri Lalitha Mahal, Tirupathur, Tamil Nadu',
      qrImage: 'assets/images/qr/tirupathur-reception.png',
    },
    {
      id: 'puducherry-reception',
      name: 'Puducherry Reception',
      date: '2026-10-28',
      startTime: '18:30',
      timeZone: 'Asia/Kolkata',
      venueName: 'Hotel Anandha Inn',
      address: 'Hotel Anandha Inn, Ground Floor, Versailles Hall, Puducherry',
      qrImage: 'assets/images/qr/puducherry-reception.png',
    },
  ],

  messages: {
    invitation: 'We are delighted to invite you to share in the beginning of our forever.',
    blessing: 'Your presence and blessings will make our celebration even more meaningful.',
    closing: 'We look forward to celebrating this special occasion with you and your family.',
  },

  social: {
    shareTitle: 'Joy & Glory — Wedding Celebrations',
    shareText: 'Join us as we celebrate our wedding on 25 October 2026 \u2014 Tirupathur & Puducherry.',
  },
}
