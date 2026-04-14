import AdminApp from './AdminApp'
import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Globe,
  HeartHandshake,
  IndianRupee,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'

const BRAND = {
  name: 'Aadisakti',
  tagline: 'Spiritual Luxury Travel',
  phone: '+91 7409072272',
  whatsapp: '917900878908',
  email: 'aadisaktitravel2028@gmail.com',
  logo: '/assets/brand-logo.png',
}

const VIDEOS = {
  hero: ['/assets/videos/hero-day.mp4'],
  ambient: ['/assets/videos/ambient-day.mp4'],
  light: ['/assets/videos/light.mp4'],
  featured: ['/assets/videos/featured1.mp4'],
  featured1: ['/assets/videos/featured.mp4'],
  air: ['/assets/videos/aerial-pilgrimage.mp4'],
  dhaam: ['/assets/videos/dham-1.mp4'],
  review: ['/assets/videos/review-1.mp4'],
  b2b: ['/assets/videos/handshake.mp4'],
}

const HOVER_TRANSITION = { type: 'spring', stiffness: 260, damping: 18 }

const SEED_PACKAGES = [
  {
    id: 'char-dham-himalayan-pilgrimage',
    title: 'Char Dham Himalayan Pilgrimage',
    location: 'Yamunotri • Gangotri • Kedarnath • Badrinath',
    region: 'Uttarakhand',
    category: 'Pilgrimage',
    month: 'September',
    duration: '10D / 9N',
    regularPrice: 58999,
    discountedPrice: 49999,
    featured: true,
    pilgrimageSpecial: true,
    airDepartureFeatured: false,
    helicopterAvailable: false,
    badge: 'Holy Circuit',
    image:
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'A complete Himalayan dharmic journey designed for families and serious devotees who want all four dhams completed with clear logistics, clean stays and premium route support.',
    hotelType: 'Premium mountain hotels and pilgrim stays',
    transport: 'Private vehicle throughout',
    whatsappNumber: '7900878908',
    inclusions: [
      '🏨 9 nights stay',
      '🍽️ Breakfast and dinner',
      '🚘 Private vehicle for full circuit',
      '🛕 Darshan movement support across all dhams',
      '📞 Route coordination and assistance',
      '🌄 Scenic halt planning through the Himalayas',
    ],
    exclusions: [
      '🐴 Pony / palki / helicopter charges',
      '🍴 Lunch and personal meals',
      '🎫 VIP darshan, ritual and ticket costs',
      '💸 Shopping, donations and tips',
      '🌧️ Cost due to weather delays or landslides',
    ],
    itinerary: [
      'Day 1: Arrival and briefing in Haridwar / Dehradun sector.',
      'Day 2-3: Yamunotri route and darshan movement.',
      'Day 4-5: Gangotri sector pilgrimage.',
      'Day 6-7: Kedarnath route, stay and darshan support.',
      'Day 8-9: Badrinath sector with sacred stopovers.',
      'Day 10: Return and departure.',
    ],
  },
  {
    id: 'char-dham-aerial-darshan-signature',
    title: 'Char Dham Aerial Darshan Signature',
    location: 'Char Dham by Helicopter',
    region: 'Uttarakhand',
    category: 'Pilgrimage',
    month: 'May',
    duration: '6D / 5N',
    regularPrice: 159299,
    discountedPrice: 134999,
    featured: false,
    pilgrimageSpecial: true,
    airDepartureFeatured: true,
    helicopterAvailable: true,
    badge: 'Helicopter Access',
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'A high-comfort aerial pilgrimage crafted for travellers who want to cover the Char Dham circuit with faster movement, premium ground coordination and reduced physical strain.',
    hotelType: 'Premium heli-assisted stays and coordinated ground support',
    transport: 'Helicopter sectors + VIP ground transfers',
    whatsappNumber: '7900878908',
    inclusions: [
      '🚁 Helicopter sectors as per schedule',
      '🏨 Premium stays and meals',
      '🚘 Ground transfers at operational points',
      '🛕 Darshan movement support',
      '📞 Dedicated coordination team',
      '🧳 Baggage and boarding assistance guidance',
    ],
    exclusions: [
      '✈️ Travel till reporting point',
      '🎫 Special rituals, VIP upgrades beyond plan',
      '💸 Personal shopping / donations / tips',
      '🧾 Extra hotel nights due to flying conditions',
      '🌦️ Weather-related operational changes',
    ],
    itinerary: [
      'Day 1: Arrival, reporting, documentation and overnight stay.',
      'Day 2: Begin helicopter-assisted dham sectors with managed darshan windows.',
      'Day 3-5: Continue sequential aerial pilgrimage with premium handling.',
      'Day 6: Final return sector and departure.',
    ],
  },
  {
    id: 'do-dham-heli-blessings-retreat',
    title: 'Do Dham Heli Blessings Retreat',
    location: 'Kedarnath • Badrinath by Helicopter',
    region: 'Uttarakhand',
    category: 'Pilgrimage',
    month: 'June',
    duration: '4D / 3N',
    regularPrice: 97939,
    discountedPrice: 82999,
    featured: false,
    pilgrimageSpecial: true,
    airDepartureFeatured: true,
    helicopterAvailable: true,
    badge: 'Aerial Blessings',
    image:
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'A refined helicopter-enabled Do Dham experience for guests seeking Kedarnath and Badrinath darshan with premium coordination, shorter travel time and comfortable stays.',
    hotelType: 'Premium heli-assisted stay plan',
    transport: 'Helicopter transfers with curated road support',
    whatsappNumber: '7900878908',
    inclusions: [
      '🚁 Helicopter-assisted Do Dham sectors',
      '🏨 Comfortable premium stays',
      '🍽️ Meals as per itinerary',
      '🚘 Ground movement support at key points',
      '🛕 Darshan coordination',
      '📞 Trip support throughout',
    ],
    exclusions: [
      '✈️ Travel till base city',
      '🎫 Extra rituals / special entries',
      '💸 Personal expenses and donations',
      '🧾 Costs due to flying reschedule',
      '🧳 Porter / pony / palki if required separately',
    ],
    itinerary: [
      'Day 1: Arrival, reporting formalities and briefing.',
      'Day 2: Kedarnath aerial movement and darshan support.',
      'Day 3: Badrinath sector with guided movement.',
      'Day 4: Return and onward departure.',
    ],
  },
  {
    id: 'auli-chopta-serenity-trail',
    title: 'Auli Snowline & Chopta Serenity Trail',
    location: 'Dehradun • Auli • Chopta',
    region: 'Garhwal',
    category: 'Retreat',
    month: 'March',
    duration: '6D / 5N',
    regularPrice: 25251,
    discountedPrice: 21399,
    featured: true,
    pilgrimageSpecial: false,
    airDepartureFeatured: false,
    helicopterAvailable: false,
    badge: 'Snow & Meadows',
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'A premium Garhwal circuit blending Dehradun’s easy arrival, Auli’s alpine panoramas and Chopta’s peaceful Himalayan meadows.',
    hotelType: 'Boutique hill stays with scenic views',
    transport: 'Private cab for complete circuit',
    whatsappNumber: '7900878908',
    inclusions: [
      '🏨 5 nights hotel accommodation',
      '🍽️ Daily breakfast and dinner',
      '🚘 Private transfers and sightseeing as per plan',
      '🧭 Dedicated trip coordination support',
      '🥾 Guided local walk / easy trekking assistance in Chopta',
      '📸 Scenic stop planning for photography',
    ],
    exclusions: [
      '✈️ Flight / train tickets till Dehradun',
      '🍴 Lunch, snacks and personal orders',
      '🎫 Entry tickets, chairlift or activity charges',
      '💸 Tips, shopping and personal expenses',
      '🌦️ Any expense due to weather or road closure',
    ],
    itinerary: [
      'Day 1: Arrival in Dehradun, assisted pickup and relaxed evening check-in.',
      'Day 2: Scenic drive to Auli with photo halts and mountain-view stay.',
      'Day 3: Auli sightseeing, cable car zone / meadow exploration and leisure time.',
      'Day 4: Drive to Chopta via panoramic Garhwal stretches and sunset viewpoints.',
      'Day 5: Morning nature walk / optional side exploration and free evening.',
      'Day 6: Return towards Dehradun for onward departure.',
    ],
  },
  {
    id: 'kumaon-lakes-wild-trails',
    title: 'Kumaon Lakes, Orchards & Wild Trails',
    location: 'Nainital • Ranikhet • Almora • Jim Corbett',
    region: 'Kumaon',
    category: 'Heritage',
    month: 'April',
    duration: '6D / 5N',
    regularPrice: 24367,
    discountedPrice: 20650,
    featured: true,
    pilgrimageSpecial: false,
    airDepartureFeatured: false,
    helicopterAvailable: false,
    badge: 'Kumaon Signature',
    image:
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'A carefully balanced Kumaon holiday covering lake views, cantonment calm, orchard country and jungle-edge leisure.',
    hotelType: 'Premium lake-facing and forest-edge hotels',
    transport: 'Private cab throughout the route',
    whatsappNumber: '7900878908',
    inclusions: [
      '🏨 5 nights stay in selected premium hotels',
      '🍽️ Breakfast and dinner throughout',
      '🚘 Private vehicle for complete sightseeing',
      '🌄 Sunset / viewpoint stop assistance',
      '🌿 Nature and heritage route coverage',
      '🧭 On-trip support and coordination',
    ],
    exclusions: [
      '🚆 Airfare / rail tickets',
      '🍴 Lunch and extra café bills',
      '🎫 Safari permit, monument and boating tickets',
      '💸 Laundry, shopping and personal expenses',
      '📷 Camera / guide charges not listed',
    ],
    itinerary: [
      'Day 1: Arrival at Nainital, lake walk and check-in.',
      'Day 2: Nainital local sightseeing with viewpoints, lake zone and mall road time.',
      'Day 3: Proceed to Ranikhet, visit orchard / golf side stretches and continue leisure.',
      'Day 4: Explore Almora’s ridge-town charm, temples and market pockets.',
      'Day 5: Drive to Jim Corbett, relax at resort and optional evening nature experience.',
      'Day 6: Departure after breakfast with onward drop assistance.',
    ],
  },
]

const SEED_CATEGORIES = [
  {
    key: 'Pilgrimage',
    title: 'Pilgrimage Journeys',
    text: 'Char Dham, Kedarnath, Haridwar, Rishikesh and temple-led Uttarakhand routes.',
    image:
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
  },
  {
    key: 'Retreat',
    title: 'Mountain Retreats',
    text: 'Auli, Chopta, Kanatal, Dhanaulti and quiet Himalayan escapes.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  },
  {
    key: 'Heritage',
    title: 'Kumaon Heritage Trails',
    text: 'Nainital, Ranikhet, Almora and scenic ridge-town circuits.',
    image:
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
  },
  {
    key: 'Leisure',
    title: 'Leisure & Wildlife Escapes',
    text: 'Lake stays, forest resorts, Mussoorie breaks and family holidays.',
    image:
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
  },
]

const SEED_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Aarav Sharma',
    city: 'Delhi',
    trip: 'Kedarnath Premium Yatra',
    rating: 5,
    text: 'Everything felt well-managed and premium. The route support, the stay, and the pacing made the trip genuinely peaceful.',
    visible: true,
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 't-2',
    name: 'Ritika Verma',
    city: 'Mumbai',
    trip: 'Kashmir Bliss Retreat',
    rating: 5,
    text: 'This felt like a luxury brand experience rather than a normal travel booking. Smooth, beautiful, and worth it.',
    visible: true,
    createdAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 't-3',
    name: 'Manish Saini',
    city: 'Meerut',
    trip: 'Char Dham Signature Circuit',
    rating: 5,
    text: 'Usually these trips get hectic, but this one felt calm and polished. Perfect for family travel.',
    visible: true,
    createdAt: '2026-01-14T10:00:00.000Z',
  },
]

const BACKUP_SHARED_JOURNEYS = []

const signatureCards = [
  {
    title: 'Handcrafted Itineraries',
    text: 'Every route is shaped for mood, comfort, darshan rhythm, and visual storytelling.',
    icon: Sparkles,
  },
  {
    title: 'Luxury with Soul',
    text: 'We mix devotion, stillness, scenic beauty, and premium stays in one polished experience.',
    icon: HeartHandshake,
  },
  {
    title: 'End-to-End Support',
    text: 'From first enquiry to final departure, every touchpoint is designed to feel smooth.',
    icon: ShieldCheck,
  },
]

const navItems = [
  { id: 'pilgrimage-special', label: 'Pilgrimage Special' },
  { id: 'featured', label: 'Featured' },
  { id: 'air-departures', label: 'Air Departures' },
  { id: 'categories', label: 'Categories' },
  { id: 'b2b', label: 'B2B' },
]

const DEFAULT_GALLERY_BANK = {
  Pilgrimage: [
    'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
  ],
  Retreat: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
  ],
  Heritage: [
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1400&q=80',
  ],
  Leisure: [
    'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
  ],
}

function cn(...arr) {
  return arr.filter(Boolean).join(' ')
}

function toArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}
function normalizeCategoryValue(value = '') {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeCategory(raw = {}) {
  const keySource = raw.key || raw.slug || raw.id || raw.title || ''
  const slug = normalizeCategoryValue(raw.slug || raw.key || raw.id || raw.title || '')
  const key = raw.key || raw.slug || raw.id || raw.title || slug || 'category'
  const fallbackImage =
    DEFAULT_GALLERY_BANK[raw.key] ||
    DEFAULT_GALLERY_BANK[raw.title] ||
    DEFAULT_GALLERY_BANK[raw.slug] ||
    DEFAULT_GALLERY_BANK[raw.id]

  return {
    ...raw,
    id: raw.id || slug || String(Date.now()),
    key,
    slug,
    title: raw.title || raw.key || raw.slug || raw.id || 'Travel Category',
    text: raw.text || raw.description || '',
    image: raw.image || (Array.isArray(fallbackImage) ? fallbackImage[0] : fallbackImage) || '',
    normalizedValue: normalizeCategoryValue(keySource),
  }
}

const CATEGORY_ALIAS_MAP = {
  pilgrimage: ['pilgrimage', 'pilgrimage-journeys', 'char-dham', 'kedarnath', 'badrinath', 'haridwar', 'rishikesh', 'temple', 'spiritual'],
  retreat: ['retreat', 'mountain-retreats', 'auli', 'chopta', 'kanatal', 'dhanaulti', 'meadows', 'snow', 'snowline'],
  heritage: ['heritage', 'heritage-trails', 'kumaon', 'almora', 'ranikhet', 'nainital', 'culture', 'ridge'],
  leisure: ['leisure', 'wildlife', 'family', 'holiday', 'lake', 'forest', 'escape', 'mussoorie', 'corbett'],
}

function getCategoryMatchValues(category) {
  if (!category) return []

  const base = [
    category.key,
    category.slug,
    category.id,
    category.title,
    category.text,
    category.normalizedValue,
  ]
    .map(normalizeCategoryValue)
    .filter(Boolean)

  const aliasSeed = Array.from(
    new Set(
      base.flatMap((value) => {
        const directAliases = CATEGORY_ALIAS_MAP[value] || []
        return [value, ...directAliases]
      }),
    ),
  )

  return aliasSeed
}

function getPackageMatchValues(pkg) {
  const normalized = normalizePackage(pkg)
  const base = [normalized.category, normalized.type, normalized.segment]
    .map(normalizeCategoryValue)
    .filter(Boolean)

  if (normalized.pilgrimageSpecial) {
    base.push('pilgrimage')
  }

  if (normalized.airDepartureFeatured || normalized.helicopterAvailable) {
    base.push('air', 'air-departure', 'helicopter')
  }

  return Array.from(new Set(base))
}

function packageMatchesCategory(pkg, category) {
  const categoryValues = getCategoryMatchValues(category)
  if (!categoryValues.length) return false

  const packageValues = getPackageMatchValues(pkg)
  return packageValues.some((value) =>
    categoryValues.some(
      (target) =>
        value === target ||
        value.includes(target) ||
        target.includes(value),
    ),
  )
}

function mergePackagesWithSeeds(primary = [], fallback = []) {
  const merged = new Map()

  fallback.map(normalizePackage).forEach((pkg) => {
    merged.set(pkg.id, pkg)
  })

  primary.map(normalizePackage).forEach((pkg) => {
    merged.set(pkg.id, pkg)
  })

  return Array.from(merged.values())
}

function mergeCategoriesWithSeeds(primary = [], fallback = []) {
  const merged = new Map()

  fallback.map(normalizeCategory).forEach((category) => {
    merged.set(category.slug || category.id || category.key, category)
  })

  primary.map(normalizeCategory).forEach((category) => {
    merged.set(category.slug || category.id || category.key, category)
  })

  return Array.from(merged.values())
}

function normalizePackage(raw = {}) {
  const rawGallery = Array.isArray(raw.galleryImages)
    ? raw.galleryImages
    : Array.isArray(raw.gallery)
      ? raw.gallery
      : Array.isArray(raw.images)
        ? raw.images
        : typeof raw.galleryImages === 'string'
          ? raw.galleryImages.split('\n').map((item) => item.trim()).filter(Boolean)
          : []

  const galleryImages = Array.from(
    new Set([raw.image, ...rawGallery].filter(Boolean)),
  )

  return {
    ...raw,
    id: raw.id || String(Date.now()),
    title: raw.title || '',
    location: raw.location || '',
    region: raw.region || '',
    category: raw.category || '',
    month: raw.month || '',
    duration: raw.duration || '',
    regularPrice: Number(raw.regularPrice || 0),
    discountedPrice: Number(raw.discountedPrice || 0),
    featured: Boolean(raw.featured),
    pilgrimageSpecial: Boolean(raw.pilgrimageSpecial),
    airDepartureFeatured: Boolean(raw.airDepartureFeatured),
    helicopterAvailable: Boolean(raw.helicopterAvailable),
    badge: raw.badge || '',
    image: raw.image || galleryImages[0] || '',
    galleryImages,
    description: raw.description || '',
    hotelType: raw.hotelType || '',
    transport: raw.transport || '',
    whatsappNumber: raw.whatsappNumber || raw.whatsapp || '',
    inclusions: toArray(raw.inclusions),
    exclusions: toArray(raw.exclusions),
    itinerary: toArray(raw.itinerary),
  }
}

function normalizeSharedJourney(raw = {}) {
  return {
    id: raw.id || String(Date.now()),
    title: raw.title || '',
    handle: raw.handle || '@aadisakti.travel',
    mention: raw.mention || raw.handle || '@aadisakti.travel',
    trip: raw.trip || '',
    city: raw.city || '',
    description: raw.description || '',
    videoUrl: raw.videoUrl || raw.video || '',
    thumbnail: raw.thumbnail || raw.image || '',
  }
}

function normalizeTestimonial(raw = {}) {
  return {
    id: raw.id || String(Date.now()),
    name: raw.name || '',
    city: raw.city || '',
    trip: raw.trip || '',
    rating: Math.max(1, Math.min(5, Number(raw.rating || 5))),
    text: raw.text || raw.review || '',
    visible: raw.visible === false ? false : true,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
  }
}

function getLatestVisibleTestimonials(items = []) {
  return [...items]
    .map(normalizeTestimonial)
    .filter((item) => item.visible !== false)
    .sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime()
      const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime()
      if (bTime !== aTime) return bTime - aTime
      const aId = Number(a.id) || 0
      const bId = Number(b.id) || 0
      return bId - aId
    })
    .slice(0, 5)
}

function useAccentMode() {
  useEffect(() => {
    document.documentElement.dataset.theme = 'brand'
    document.documentElement.dataset.accent = 'gold'
  }, [])

  return { accent: 'gold', toggle: () => {} }
}

function getPackageGallery(pkg) {
  const normalized = normalizePackage(pkg)
  const fallback = DEFAULT_GALLERY_BANK[normalized.category] || DEFAULT_GALLERY_BANK.Retreat
  const merged = Array.from(
    new Set([normalized.image, ...normalized.galleryImages, ...fallback].filter(Boolean)),
  )
  return merged.slice(0, 5)
}

function sanitizePhone(value) {
  return String(value || '').replace(/\D/g, '')
}

function buildWhatsAppLink(pkg) {
  const number = sanitizePhone(pkg?.whatsappNumber || BRAND.whatsapp || BRAND.phone)
  const message = encodeURIComponent(
    `Hello Aadisakti, I want details for ${pkg?.title || 'this package'} (${pkg?.location || ''}).`,
  )
  return `https://wa.me/${number}?text=${message}`
}

function packageMatchesQuery(pkg, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const haystack = [
    pkg.title,
    pkg.location,
    pkg.region,
    pkg.category,
    pkg.month,
    pkg.badge,
    pkg.description,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(q)
}

function isPilgrimageSpecial(pkg) {
  return Boolean(pkg?.pilgrimageSpecial) || (pkg?.category === 'Pilgrimage' && pkg?.region === 'Uttarakhand')
}

function isAirDepartureFeatured(pkg) {
  return Boolean(pkg?.airDepartureFeatured) || Boolean(pkg?.helicopterAvailable)
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function getWebsiteRoute() {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/b2b') return 'b2b'
  if (path === '/air-departures') return 'air-departures'
  return 'home'
}

function updateWebsiteRoute(route, { replace = false } = {}) {
  if (typeof window === 'undefined') return
  const targetPath =
    route === 'b2b' ? '/b2b' : route === 'air-departures' ? '/air-departures' : '/'
  const method = replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', targetPath)
}

function PremiumVideo({ sources, overlay = 'dark', className = '' }) {
  const [index, setIndex] = useState(0)
  const current = sources[index] || sources[0]

  return (
    <div className={cn('video-shell', className)}>
      <video
        key={current}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setIndex((idx) => (idx + 1 < sources.length ? idx + 1 : idx))}
      >
        <source src={current} type="video/mp4" />
      </video>
      <div
        className={cn(
          'video-overlay',
          overlay === 'dark' ? 'video-overlay-dark' : 'video-overlay-light',
        )}
      />
      <div
        className={cn(
          'video-gradient',
          overlay === 'dark' ? 'video-gradient-dark' : 'video-gradient-light',
        )}
      />
    </div>
  )
}

function AnimatedEyebrow({ children, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn('eyebrow', light ? 'eyebrow-light' : 'eyebrow-dark')}
    >
      <motion.span
        className={cn('eyebrow-dot', light ? 'eyebrow-dot-light' : 'eyebrow-dot-dark')}
        animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {children}
    </motion.div>
  )
}

function PriceTag({ regularPrice, discountedPrice, light = false }) {
  return (
    <div className="price-wrap">
      <div className={cn('price-main', light && 'price-main-light')}>
        <IndianRupee className="icon-sm" />
        {Number(discountedPrice || 0).toLocaleString('en-IN')}
      </div>
      <div className={cn('price-old', light && 'price-old-light')}>
        ₹{Number(regularPrice || 0).toLocaleString('en-IN')}
      </div>
    </div>
  )
}

function TravelCursor() {
  return null
}

function Navbar({ onNavigate, currentRoute = 'home' }) {
  const [open, setOpen] = useState(false)

  const handleNavClick = (itemId) => {
    onNavigate?.(itemId)
    setOpen(false)
  }

  const goHome = () => {
    onNavigate?.('home')
    setOpen(false)
  }

  return (
    <>
      <motion.header initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="nav-shell">
        <div className="nav-bar">
          <button onClick={goHome} className="brand">
            <div className="brand-badge brand-badge-logo">
              <img src={BRAND.logo} alt={`${BRAND.name} logo`} className="brand-logo" />
            </div>
            <div>
              <div className="display brand-title">{BRAND.name}</div>
              <div className="brand-subtitle">{BRAND.tagline}</div>
            </div>
          </button>

          <nav className="nav-links desktop-only">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'nav-link',
                  'hover-nav-link',
                  (currentRoute === item.id || (currentRoute === 'home' && item.id === 'featured' && false)) &&
                    'nav-link-active',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            <a href={`tel:${BRAND.phone}`} className="cta-btn white hover-btn-pop desktop-only">
              Call Now
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="icon-btn mobile-only"
              aria-label="Menu"
            >
              {open ? <X className="icon-sm" /> : <Menu className="icon-sm" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mobile-menu mobile-only"
          >
            <button onClick={goHome} className="mobile-link">
              Home
            </button>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => handleNavClick(item.id)} className="mobile-link">
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SearchPackagesBar({ query, setQuery, onSearch, matches }) {
  return (
    <form
      className="search-packages-shell hover-panel-glow"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      <div className="search-packages-input-wrap">
        <Search className="icon-sm search-packages-icon" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destination, package, category or region"
          className="search-packages-input"
        />
      </div>
      <button type="submit" className="cta-btn white hover-btn-pop">
        Search Packages
      </button>
      {query.trim() ? (
        <div className="search-packages-meta">
          {matches} matching package{matches !== 1 ? 's' : ''}
        </div>
      ) : (
        <div className="search-packages-meta">Try: Kedarnath, Auli, Nainital, Char Dham</div>
      )}
    </form>
  )
}

function Hero({ query, setQuery, onSearch, matches }) {
  return (
    <section className="hero section-dark">
      <PremiumVideo sources={VIDEOS.hero} overlay="dark" />
      <div className="container hero-content">
        <div className="hero-copy">
          <AnimatedEyebrow>immersive spiritual travel</AnimatedEyebrow>

         

          <h1 className="display hero-title hover-3d-heading">
            Journeys crafted for
            <span> devotion, beauty, and stillness.</span>
          </h1>

          <p className="hero-text">
            Aadisakti brings together spiritual travel, premium comfort, soulful destinations,
            and immersive storytelling in one cinematic digital experience.
          </p>
          <div className="hero-actions">
  <a href="#featured" className="cta-btn white hover-btn-pop">
    Explore Featured
  </a>
</div>
        </div>
      </div>
    </section>
  )
}

function PackageCard({ pkg, onSelect, dark = true, compact = false }) {
  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.015 }}
      transition={HOVER_TRANSITION}
      className={cn(
        dark ? 'sub-card dark-sub-card' : 'panel light-panel',
        'hover-lift-soft',
        compact && 'package-card-mobile-compact',
      )}
    >
      <div className={cn('card-image-wrap', compact ? 'short' : 'mid', 'hover-image-zoom')}>
        <img
          src={pkg.image}
          alt={pkg.title}
          className="card-image package-image-trigger"
          onClick={() => onSelect(pkg)}
        />
        <div className="card-overlay" />
        <div className="badge top-left">{pkg.badge || pkg.category}</div>
      </div>

      <div className={cn('card-body', dark ? 'dark' : 'light')}>
        <h3 className={cn('display card-title hover-3d-heading', dark ? 'light' : 'dark')}>
          {pkg.title}
        </h3>

        <div className={cn('meta', dark ? 'light' : 'dark')}>
          <MapPin className="icon-xs" /> {pkg.location} • {pkg.duration}
        </div>

        <p className={cn('card-text mt-4 package-description-desktop-hide', dark ? 'light' : 'dark')}>{pkg.description}</p>

        <div className="mt-5">
          <PriceTag
            regularPrice={pkg.regularPrice}
            discountedPrice={pkg.discountedPrice}
            light={!dark}
          />
        </div>

        <div className="card-actions mt-6 package-card-actions">
          <button
            onClick={() => onSelect(pkg)}
            className="cta-btn white small hover-btn-pop package-detail-trigger"
          >
            View Details <ChevronRight className="icon-xs" />
          </button>
          <a
            href={buildWhatsAppLink(pkg)}
            target="_blank"
            rel="noreferrer"
            className="cta-btn ghost small hover-btn-pop"
          >
            <MessageCircle className="icon-xs" /> WhatsApp
          </a>
        </div>
      </div>
    </motion.article>
  )
}

function SearchResultsSection({ query, items, onSelect }) {
  if (!query.trim()) return null

  return (
    <section id="search-results" className="section-light pad-section">
      <div className="container">
        <AnimatedEyebrow light>Search Results</AnimatedEyebrow>
        <h2 className="display section-title dark hover-3d-heading">
          Packages matching “{query.trim()}”
        </h2>
        <p className="section-text dark">
          Click any matching package to open its full details, gallery, itinerary and enquiry buttons.
        </p>

        {items.length === 0 ? (
          <div className="panel light-panel mt-8">
            <p className="card-text dark">
              No direct package match mila. Thoda alag destination ya category try karo.
            </p>
          </div>
        ) : (
          <div className="grid three package-grid-responsive mt-10">
            {items.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} onSelect={onSelect} dark={false} compact />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function UttarakhandSacredCircuitSection({ items, onSelect }) {
  const special = useMemo(
    () => items.filter((pkg) => isPilgrimageSpecial(pkg) && !isAirDepartureFeatured(pkg)),
    [items],
  )

  if (!special.length) return null

  return (
    <section id="pilgrimage-special" className="section-dark pad-section">
      <PremiumVideo sources={VIDEOS.dhaam} overlay="dark" />
      <div className="container">
        <AnimatedEyebrow>Char Dham </AnimatedEyebrow>
        <p className="section-text light">
          Kedarnath, Badrinath, Gangotri, Yamunotri and More...
        </p>

        <div className="grid three package-grid-responsive mt-10">
          {special.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onSelect={onSelect} dark compact />
          ))}
        </div>
      </div>
    </section>
  )
}

function AirDepartureSection({ items, onSelect }) {
  const heliPackages = useMemo(() => items.filter((pkg) => isAirDepartureFeatured(pkg)), [items])

  if (!heliPackages.length) return null

  return (
    <section id="air-departures" className="section-dark pad-section">
      <PremiumVideo sources={VIDEOS.air} overlay="dark" />
      <div className="container">
        <div className="section-head between">
          <div>
            <AnimatedEyebrow>Aerial Pilgrimage Departures</AnimatedEyebrow>
            <h2 className="display section-title light hover-3d-heading">
              Premium Air-Assisted Darshan Journeys
            </h2>
            <p className="section-text light">
              Helicopter-enabled departures for Char Dham and Do Dham routes, built for faster movement and premium coordination.
            </p>
          </div>
        </div>

        <div className="featured-row package-grid-mobile">
          {heliPackages.map((pkg) => (
            <motion.article
              key={pkg.id}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={HOVER_TRANSITION}
              className="featured-card hover-lift-premium package-card-mobile-compact"
            >
              <div className="card-image-wrap tall hover-image-zoom">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="card-image package-image-trigger"
                  onClick={() => onSelect(pkg)}
                />
                <div className="card-overlay" />
                <div className="badge top-left">{pkg.badge || 'Aerial Departure'}</div>
              </div>

              <div className="card-body dark">
                <div className="card-top">
                  <div>
                    <h3 className="display card-title light hover-3d-heading">{pkg.title}</h3>
                    <div className="meta light">
                      <MapPin className="icon-xs" /> {pkg.location} • {pkg.duration}
                    </div>
                  </div>
                  <PriceTag regularPrice={pkg.regularPrice} discountedPrice={pkg.discountedPrice} />
                </div>

                <p className="card-text light package-description-desktop-hide">{pkg.description}</p>

                <div className="card-actions mt-6 package-card-actions">
                  <button
                    onClick={() => onSelect(pkg)}
                    className="cta-btn white small hover-btn-pop package-detail-trigger"
                  >
                    View Details <ChevronRight className="icon-xs" />
                  </button>
                  <a
                    href={buildWhatsAppLink(pkg)}
                    target="_blank"
                    rel="noreferrer"
                    className="cta-btn ghost small hover-btn-pop"
                  >
                    <MessageCircle className="icon-xs" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedPackages({ items, onSelect }) {
  const featured = useMemo(() => items.filter((p) => p.featured), [items])

  return (
    <section id="featured" className="section-dark pad-section">
      <PremiumVideo sources={VIDEOS.featured} overlay="dark" />
      <div className="container">
        <div className="section-head between">
          <div>
            <AnimatedEyebrow>Featured Packages</AnimatedEyebrow>
            <h2 className="display section-title light hover-3d-heading">
              Our highlighted Uttarakhand Regions
            </h2>
            <p className="section-text light">
              Curated Uttarakhand Pilgirmage Circuit.
            </p>
          </div>
        </div>

        <div className="featured-row package-grid-mobile">
          {featured.map((pkg) => (
            <motion.article
              key={pkg.id}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={HOVER_TRANSITION}
              className="featured-card hover-lift-premium package-card-mobile-compact"
            >
              <div className="card-image-wrap tall hover-image-zoom">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="card-image package-image-trigger"
                  onClick={() => onSelect(pkg)}
                />
                <div className="card-overlay" />
                <div className="badge top-left">{pkg.badge}</div>
              </div>

              <div className="card-body dark">
                <div className="card-top">
                  <div>
                    <h3 className="display card-title light hover-3d-heading">{pkg.title}</h3>
                    <div className="meta light">
                      <MapPin className="icon-xs" /> {pkg.location} • {pkg.duration}
                    </div>
                  </div>
                  <PriceTag regularPrice={pkg.regularPrice} discountedPrice={pkg.discountedPrice} />
                </div>

                <p className="card-text light package-description-desktop-hide">{pkg.description}</p>

                <div className="card-actions mt-6 package-card-actions">
                  <button
                    onClick={() => onSelect(pkg)}
                    className="cta-btn white small hover-btn-pop package-detail-trigger"
                  >
                    View Details <ChevronRight className="icon-xs" />
                  </button>
                  <a
                    href={buildWhatsAppLink(pkg)}
                    target="_blank"
                    rel="noreferrer"
                    className="cta-btn ghost small hover-btn-pop"
                  >
                    <MessageCircle className="icon-xs" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SignatureSection() {
  return (
    <section className="section-light pad-section">
      <PremiumVideo sources={VIDEOS.ambient} overlay="dark" />
      <div className="container">
        <AnimatedEyebrow light>The Aadisakti Signature</AnimatedEyebrow>

        <div className="media-safe-block">
          <h2 className="display section-title hover-3d-heading media-safe-heading">
            A premium spiritual travel brand, not just another package catalog.
          </h2>
        </div>

        <div className="grid three mt-10">
          {signatureCards.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={HOVER_TRANSITION}
              className="panel light-panel hover-panel-glow"
            >
              <item.icon className="icon-md amber" />
              <h3 className="display card-title dark mt-5 hover-3d-heading">
                {item.title}
              </h3>
              <p className="card-text dark mt-4">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExploreCategoriesSection({ categories, onOpenCategory }) {
  return (
    <section id="categories" className="section-dark pad-section">
      <PremiumVideo sources={VIDEOS.light} overlay="dark" />
      <div className="container">
        <AnimatedEyebrow>Explore by Category</AnimatedEyebrow>

        <h2 className="display section-title light hover-3d-heading">
          Choose the travel mood that speaks to you.
        </h2>

        <p className="section-text light">
          Click any category you are interested in.
        </p>

        <div className="grid four mt-10">
          {categories.map((item) => (
            <motion.button
              type="button"
              key={item.key}
              whileHover={{ y: -8, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={HOVER_TRANSITION}
              onClick={() => onOpenCategory?.(item)}
              className="category-card hover-lift-soft"
            >
              <div className="card-image-wrap mid hover-image-zoom">
                <img src={item.image} alt={item.title} className="card-image" />
                <div className="card-overlay" />
                <div className="category-copy">
                  <div className="badge">Click to Explore</div>
                  <h3 className="display card-title light mt-4 hover-3d-heading">
                    {item.title}
                  </h3>
                  <p className="card-text light mt-3">{item.text}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryPackagesOverlay({ category, packages, onSelect, onClose }) {
  const scrollRef = React.useRef(null)

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.body.classList.add('category-popup-open')
    document.documentElement.classList.add('category-popup-open')

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.touchAction = previousBodyTouchAction
      document.body.classList.remove('category-popup-open')
      document.documentElement.classList.remove('category-popup-open')
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [category?.slug, category?.key, category?.id])

  if (!category) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop category-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="category-modal-card"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="category-modal-toolbar">
            <div>
              <div className="mini-label">Selected Category</div>
              <div className="category-modal-toolbar-text">
                {packages.length} package{packages.length !== 1 ? 's' : ''} available
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="modal-close category-modal-close category-modal-close-pinned"
              aria-label="Close category popup"
            >
              <X className="icon-sm" />
            </button>
          </div>

          <div ref={scrollRef} className="category-modal-scroll">
            <div className="category-modal-hero">
              <img
                src={category.image}
                alt={category.title}
                className="category-modal-hero-image"
              />
              <div className="category-modal-overlay" />
              <div className="category-modal-copy">
                <div className="badge">Click any package for details</div>
                <h3 className="display section-subtitle light hover-3d-heading mt-4">
                  {category.title}
                </h3>
                <p className="card-text light mt-3">{category.text}</p>
              </div>
            </div>

            <div className="category-modal-body">
              <div className="section-head between gap-4 category-modal-section-head">
                <div>
                  <div className="mini-label">Matching Packages</div>
                  <p className="card-text light mt-2">
                    You can get detail of packages below just click on "View Details" or "Whatsapp".
                  </p>
                </div>

                <div className="count-pill">
                  {packages.length} package{packages.length !== 1 ? 's' : ''}
                </div>
              </div>

              {packages.length === 0 ? (
                <div className="panel dark-panel mt-8">
                  <p className="card-text light">
                    Is category me abhi package available nahi mila. Admin se is category ke packages add kiye ja sakte hain.
                  </p>
                </div>
              ) : (
                <div className="grid three package-grid-responsive mt-8 category-package-grid">
                  {packages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} onSelect={onSelect} dark compact />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function WhyTravelSection() {
  const items = [
    {
      icon: Mountain,
      title: 'Curated spirituality',
      text: 'We design routes around emotion, darshan rhythm, rest, and scenic depth.',
    },
    {
      icon: ShieldCheck,
      title: 'Credible planning',
      text: 'Transport, stays, support and movement are structured to feel premium, credible, and calm across every touchpoint.',
    },
    {
      icon: HeartHandshake,
      title: 'Human-first support',
      text: 'Families, groups, and solo travelers all get a smoother, more caring experience.',
    },
    ...signatureCards,
  ]

  return (
    <section className="section-light pad-section">
      <PremiumVideo sources={VIDEOS.featured1} overlay="dark" />
      <div className="container">
        <AnimatedEyebrow light>Why Travel with Aadisakti</AnimatedEyebrow>

        <div className="media-safe-block">
          <h2 className="display section-title hover-3d-heading media-safe-heading">
            Built for devotion, designed for modern comfort.
          </h2>
        </div>

        <div className="grid three mt-10">
          {items.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={HOVER_TRANSITION}
              className="panel light-panel hover-panel-glow"
            >
              <item.icon className="icon-md amber" />
              <h3 className="display card-title dark mt-5 hover-3d-heading">
                {item.title}
              </h3>
              <p className="card-text dark mt-4">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SharedJourneysSection({ items }) {
  if (!items.length) return null

  return (
    <section className="section-dark pad-section">
      <div className="container">
        <AnimatedEyebrow>Shared Journey</AnimatedEyebrow>
        <h2 className="display section-title light hover-3d-heading">
          Real traveller moments shared through video.
        </h2>
        <p className="section-text light">
          Playable journeys uploaded from admin, so visitors can see real travel experiences with sound.
        </p>

        <div className="grid three package-grid-responsive mt-10">
          {items.map((item) => (
            <motion.article
              key={item.id}
              whileHover={{ y: -6, scale: 1.012 }}
              transition={HOVER_TRANSITION}
              className="panel dark-panel hover-panel-glow"
            >
              <div className="card-image-wrap mid">
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    poster={item.thumbnail || undefined}
                    controls
                    preload="metadata"
                    className="card-image"
                  />
                ) : item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title || item.trip || 'Shared Journey'} className="card-image" />
                ) : null}
              </div>

              <div className="card-body dark">
                <div className="badge">Shared Journey</div>
                <h3 className="display card-title light mt-4 hover-3d-heading">
                  {item.title || item.trip || 'Traveller Story'}
                </h3>
                <div className="meta light">
                  {item.city || 'Aadisakti Traveller'} • {item.handle || '@aadisakti.travel'}
                </div>
                <p className="card-text light mt-4">{item.description || 'A shared journey from our travellers.'}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SpiritualEchoesSection({ testimonials }) {
  const latestTestimonials = useMemo(
    () => getLatestVisibleTestimonials(testimonials),
    [testimonials],
  )

  return (
    <section className="section-light pad-section">
      <PremiumVideo sources={VIDEOS.review} overlay="dark" />
      <div className="container">
        <AnimatedEyebrow light>Spiritual Echoes</AnimatedEyebrow>
        <h2 className="display section-title dark hover-3d-heading">
          Stories and ratings from those who travelled with us.
        </h2>

        {latestTestimonials.length === 0 ? (
          <div className="panel light-panel mt-10">
            <p className="card-text dark">
              Abhi reviews available nahi hain. Sabse pehla review aapka ho sakta hai.
            </p>
          </div>
        ) : (
          <div className="grid three package-grid-responsive mt-10">
            {latestTestimonials.map((item) => (
              <motion.article
                key={item.id}
                whileHover={{ y: -6, scale: 1.012 }}
                transition={HOVER_TRANSITION}
                className="panel light-panel hover-panel-glow"
              >
                <div className="stars-row">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="icon-xs fill-amber" />
                  ))}
                </div>

                <p className="card-text dark">“{item.text}”</p>
                <div className="divider mt-6" />
                <div className="display card-title dark mt-5 hover-3d-heading">{item.name}</div>
                <div className="mini-meta">
                  {item.city} • {item.trip}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ReviewFormSection({ onNewReview }) {
  const [form, setForm] = useState({
    name: '',
    city: '',
    trip: '',
    rating: 5,
    text: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          city: form.city,
          trip: form.trip,
          rating: Number(form.rating),
          text: form.text,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Failed to submit review', data)
        return
      }

      setSubmitted(true)

      if (data?.entry) {
        onNewReview && onNewReview(data.entry)
      } else {
        onNewReview &&
          onNewReview({
            ...form,
            rating: Number(form.rating),
            visible: true,
            createdAt: new Date().toISOString(),
          })
      }

      setForm({ name: '', city: '', trip: '', rating: 5, text: '' })
    } catch (error) {
      console.error('Failed to submit review', error)
    }
  }

  return (
    <section className="section-light pad-section">
      <div className="container two-col center">
        <div>
          <AnimatedEyebrow light>Share Your Experience</AnimatedEyebrow>
          <h2 className="display section-title dark hover-3d-heading">Leave a Review</h2>
          <p className="section-text dark">
            Your feedback helps other travellers choose the right journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="panel light-panel form-panel hover-panel-glow">
          <div className="grid two gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="field"
              required
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="field"
              required
            />
            <input
              name="trip"
              value={form.trip}
              onChange={handleChange}
              placeholder="Trip Package"
              className="field full"
              required
            />
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="field full"
            >
              <option value={5}>5 – Excellent</option>
              <option value={4}>4 – Very Good</option>
              <option value={3}>3 – Good</option>
              <option value={2}>2 – Fair</option>
              <option value={1}>1 – Poor</option>
            </select>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              rows={4}
              placeholder="Your review"
              className="field full"
              required
            />
          </div>

          <button type="submit" className="cta-btn white mt-5 hover-btn-pop">
            Submit Review <Send className="icon-xs" />
          </button>
          {submitted && <p className="mini-meta mt-4">Thank you for sharing your journey!</p>}
        </form>
      </div>
    </section>
  )
}

function B2BPortalSection() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
      setForm({
        name: '',
        company: '',
        phone: '',
        email: '',
        city: '',
        message: '',
      })
    } catch (error) {
      console.error('Failed to send enquiry', error)
    }
  }

  return (
    <section id="b2b" className="section-dark pad-section">
      <PremiumVideo sources={VIDEOS.b2b} overlay="dark" />
      <div className="container two-col">
        <div>
          <AnimatedEyebrow>B2B Portal for Agents</AnimatedEyebrow>

          <h2 className="display section-title light hover-3d-heading">
            Apply as an Aadisakti travel partner.
          </h2>

          <p className="section-text light">
            Partner with Aadisakti for seamless coordination, reliable responses, and curated spiritual departures.
          </p>

          <div className="grid one mt-8 gap-4">
            {[
              { icon: Briefcase, text: 'Custom group departures' },
              { icon: Users, text: 'Dedicated B2B partnerships' },
              { icon: Globe, text: 'Domestic and spiritual route support' },
            ].map((item) => (
              <div key={item.text} className="list-pill dark-pill hover-lift-soft">
                <item.icon className="icon-sm amber-light" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="panel dark-panel form-panel hover-panel-glow">
          <div className="grid two gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="field"
              required
            />
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Agency / Company"
              className="field"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="field"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="field"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City / Region"
              className="field full"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Share your enquiry or partnership requirement"
              className="field full"
            />
          </div>

          <button type="submit" className="cta-btn white mt-5 hover-btn-pop">
            Submit Application <Send className="icon-xs" />
          </button>

          {submitted && <p className="mini-meta mt-4">Thank you! We will get in touch with you soon.</p>}
        </form>
      </div>
    </section>
  )
}

function CommunitySection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      setSubmitted(true)
      setName('')
      setEmail('')
    } catch (error) {
      console.error('Failed to sign up to newsletter', error)
    }
  }

  return (
    <section id="community" className="section-dark pad-section community-photo-section">
      <div className="container two-col center">
        <div>
          <AnimatedEyebrow>Join the Community</AnimatedEyebrow>
          <h2 className="display section-title light hover-3d-heading">
            Stay close to new journeys, soulful drops, and curated travel news.
          </h2>

          <p className="section-text light">
            Subscribe to Aadishati updates for destination launches, spiritual departures, seasonal expeditions, and premium offers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="panel dark-panel form-panel hover-panel-glow">
          <div className="grid one gap-4">
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="field"
              required
            />
            <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="field"
              required
            />
            <button type="submit" className="cta-btn white hover-btn-pop">
              Join Newsletter <Send className="icon-xs" />
            </button>
            {submitted && <p className="mini-meta mt-4">Thank you for subscribing!</p>}
          </div>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand-footer-row">
            <img src={BRAND.logo} alt={`${BRAND.name} logo`} className="footer-brand-logo" />
            <div className="display brand-title light">{BRAND.name}</div>
          </div>
          <p className="section-text light mt-4">
            A premium spiritual travel brand for soulful journeys, curated departures, and memorable travel storytelling.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Quick Links</h4>
          <div className="footer-links">
            <a href="#pilgrimage-special">Pilgrimage Special</a>
            <a href="#featured">Featured</a>
            <a href="#air-departures">Air Departures</a>
            <a href="#categories">Categories</a>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">Contact</h4>
          <div className="footer-links">
            <a href={`tel:${BRAND.phone}`}>{BRAND.phone}</a>
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            <a href={`https://wa.me/${sanitizePhone(BRAND.whatsapp)}`} target="_blank" rel="noreferrer">
              WhatsApp Enquiry
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">Legal</h4>
          <div className="footer-links">
            <span>© 2026 Aadisakti Travel. All rights reserved.</span>
            <span>Registered brand presentation for curated travel experiences.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function AccordionBlock({ title, items, value, setValue }) {
  const open = value === title
  return (
    <div
      className="info-box accordion-block"
      onMouseEnter={() => setValue(title)}
      onMouseLeave={() => setValue((prev) => (prev === title ? '' : prev))}
    >
      <button
        type="button"
        className="accordion-trigger"
        onClick={() => setValue(open ? '' : title)}
      >
        <span className="display card-title light">{title}</span>
        <span className="accordion-symbol">{open ? '−' : '+'}</span>
      </button>

      {open ? (
        <div className="grid one mt-4 gap-3">
          {items.map((item) => (
            <div key={item} className="info-line">
              {item}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function PackageModal({ pkg, onClose }) {
  const normalized = normalizePackage(pkg)
  const gallery = getPackageGallery(normalized)
  const [activeImage, setActiveImage] = useState(0)
  const [openAccordion, setOpenAccordion] = useState('')
  useEffect(() => {
  const previousBodyOverflow = document.body.style.overflow
  const previousHtmlOverflow = document.documentElement.style.overflow
  const previousBodyTouchAction = document.body.style.touchAction

  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
  document.body.style.touchAction = 'none'

  return () => {
    document.body.style.overflow = previousBodyOverflow
    document.documentElement.style.overflow = previousHtmlOverflow
    document.body.style.touchAction = previousBodyTouchAction
  }
}, [])

  useEffect(() => {
    setActiveImage(0)
    setOpenAccordion('')
  }, [normalized?.id])

  if (!normalized) return null

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % gallery.length)
  }

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-card"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-grid">
            <div className="modal-image-wrap">
              <img
                src={gallery[activeImage]}
                alt={normalized.title}
                className="modal-image"
              />

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-nav gallery-nav-left"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="icon-sm" />
                  </button>

                  <button
                    type="button"
                    className="gallery-nav gallery-nav-right"
                    onClick={nextImage}
                  >
                    <ChevronRight className="icon-sm" />
                  </button>

                  <div className="gallery-dots">
                    {gallery.map((img, idx) => (
                      <button
                        key={`${img}-${idx}`}
                        type="button"
                        className={cn('gallery-dot', idx === activeImage && 'gallery-dot-active')}
                        onClick={() => setActiveImage(idx)}
                      />
                    ))}
                  </div>

                  <div className="gallery-thumbs">
                    {gallery.map((img, idx) => (
                      <button
                        key={`${img}-thumb-${idx}`}
                        type="button"
                        className={cn('gallery-thumb', idx === activeImage && 'gallery-thumb-active')}
                        onClick={() => setActiveImage(idx)}
                      >
                        <img src={img} alt={`thumb-${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button onClick={onClose} className="modal-close">
                <X className="icon-sm" />
              </button>
            </div>

            <div className="modal-content">
              <h3 className="display section-subtitle light hover-3d-heading">
                {normalized.title}
              </h3>

              <div className="meta light">
                <MapPin className="icon-xs" /> {normalized.location} • {normalized.duration}
              </div>

              <div className="mt-5">
                <PriceTag
                  regularPrice={normalized.regularPrice}
                  discountedPrice={normalized.discountedPrice}
                />
              </div>

              <p className="card-text light mt-5">{normalized.description}</p>

              <div className="grid two mt-6 gap-3">
                <div className="info-box">
                  <div className="mini-label">Stay</div>
                  <div>{normalized.hotelType}</div>
                </div>
                <div className="info-box">
                  <div className="mini-label">Transport</div>
                  <div>{normalized.transport}</div>
                </div>
              </div>

              <div className="grid one mt-6 gap-3">
                <AccordionBlock
                  title="Inclusions"
                  items={normalized.inclusions}
                  value={openAccordion}
                  setValue={setOpenAccordion}
                />
                <AccordionBlock
                  title="Exclusions"
                  items={normalized.exclusions}
                  value={openAccordion}
                  setValue={setOpenAccordion}
                />
                <AccordionBlock
                  title="Itinerary Highlights"
                  items={normalized.itinerary}
                  value={openAccordion}
                  setValue={setOpenAccordion}
                />
              </div>

              <div className="card-actions mt-8">
                <a href={`tel:${BRAND.phone}`} className="cta-btn white hover-btn-pop">
                  Call for Booking
                </a>
                <a
                  href={buildWhatsAppLink(normalized)}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-btn ghost hover-btn-pop"
                >
                  <MessageCircle className="icon-xs" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const isAdminRoute =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <AdminApp />
  }

  return <WebsiteApp />
}

function RoutePageShell({ eyebrow, title, text, onBack, children }) {
  return (
    <main className="route-main">
      <section className="section-dark route-page-hero">
        <PremiumVideo sources={VIDEOS.ambient} overlay="dark" />
        <div className="container route-page-copy">
          <AnimatedEyebrow>{eyebrow}</AnimatedEyebrow>
          <h1 className="display section-title light hover-3d-heading">{title}</h1>
          <p className="section-text light route-page-text">{text}</p>
          <div className="hero-actions">
            <button type="button" onClick={onBack} className="cta-btn white hover-btn-pop">
              Back to Homepage
            </button>
          </div>
        </div>
      </section>

      {children}
    </main>
  )
}

function WebsiteApp() {
  useAccentMode()

  const [packagesState, setPackages] = useState([])
  const [categoriesState, setCategories] = useState([])
  const [testimonialsState, setTestimonials] = useState([])
  const [sharedJourneysState, setSharedJourneys] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchQuery, setActiveSearchQuery] = useState('')
  const [compactSearch, setCompactSearch] = useState(false)
  const [currentRoute, setCurrentRoute] = useState(getWebsiteRoute())
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) =>
        setPackages(
          Array.isArray(data) ? data.map(normalizePackage) : SEED_PACKAGES.map(normalizePackage),
        ),
      )
      .catch(() => setPackages(SEED_PACKAGES.map(normalizePackage)))

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) =>
        setCategories(
          mergeCategoriesWithSeeds(Array.isArray(data) ? data : [], SEED_CATEGORIES),
        ),
      )
      .catch(() => setCategories(mergeCategoriesWithSeeds([], SEED_CATEGORIES)))

    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) =>
        setTestimonials(
          Array.isArray(data)
            ? getLatestVisibleTestimonials(data)
            : getLatestVisibleTestimonials(SEED_TESTIMONIALS),
        ),
      )
      .catch(() => setTestimonials(getLatestVisibleTestimonials(SEED_TESTIMONIALS)))

    fetch('/api/shared-journeys')
      .then((res) => res.json())
      .then((data) =>
        setSharedJourneys(
          Array.isArray(data)
            ? data.map(normalizeSharedJourney)
            : BACKUP_SHARED_JOURNEYS,
        ),
      )
      .catch(() => setSharedJourneys(BACKUP_SHARED_JOURNEYS))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setCompactSearch(window.scrollY > 80)
    }

    const handlePopState = () => {
      setCurrentRoute(getWebsiteRoute())
    }

    handleScroll()
    handlePopState()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const latestTestimonials = useMemo(
    () => getLatestVisibleTestimonials(testimonialsState),
    [testimonialsState],
  )

  const liveMatches = useMemo(
    () => packagesState.filter((pkg) => packageMatchesQuery(pkg, searchQuery)).length,
    [packagesState, searchQuery],
  )

  const searchResults = useMemo(
    () => packagesState.filter((pkg) => packageMatchesQuery(pkg, activeSearchQuery)),
    [packagesState, activeSearchQuery],
  )

  const overlayPackagesSource = useMemo(
    () => mergePackagesWithSeeds(packagesState, SEED_PACKAGES),
    [packagesState],
  )

  
const activeCategoryPackages = useMemo(() => {
    if (!activeCategory) return []

    const categoryValues = getCategoryMatchValues(activeCategory)
    const primaryCategoryKey = normalizeCategoryValue(activeCategory.key || activeCategory.slug || activeCategory.id)

    const exactMatches = overlayPackagesSource.filter(
      (pkg) => normalizeCategoryValue(pkg.category) === primaryCategoryKey,
    )

    if (exactMatches.length) {
      return exactMatches
    }

    return overlayPackagesSource.filter((pkg) => {
      const packageValues = getPackageMatchValues(pkg)
      return packageValues.some((value) => categoryValues.includes(value))
    })
  }, [overlayPackagesSource, activeCategory])

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery)
    if (currentRoute !== 'home') {
      updateWebsiteRoute('home')
      setCurrentRoute('home')
      setTimeout(() => scrollToId('search-results'), 120)
      return
    }
    setTimeout(() => scrollToId('search-results'), 60)
  }

  const handleNewReview = (review) => {
    setTestimonials((prev) =>
      getLatestVisibleTestimonials([normalizeTestimonial(review), ...prev]),
    )
  }

  const handleNavigate = (target) => {
    if (target === 'home') {
      if (currentRoute !== 'home') {
        updateWebsiteRoute('home')
        setCurrentRoute('home')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (target === 'b2b' || target === 'air-departures') {
      updateWebsiteRoute(target)
      setCurrentRoute(target)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (currentRoute !== 'home') {
      updateWebsiteRoute('home')
      setCurrentRoute('home')
      setTimeout(() => scrollToId(target), 120)
      return
    }

    scrollToId(target)
  }

  const handleOpenCategory = (category) => {
    if (!category) return
    const normalized = normalizeCategory(category)
    setActiveCategory(normalized)
  }

  const handleCloseCategory = () => {
    setActiveCategory(null)
  }

  const isHomeRoute = currentRoute === 'home'

  return (
    <div className={cn('app-root', 'theme-brand')}>
      <TravelCursor />
      <Navbar onNavigate={handleNavigate} currentRoute={currentRoute} />

      {isHomeRoute && (
        <>
          <div className={cn('sticky-search-wrap desktop-search-floating', compactSearch && 'compact-search')}>
            <div className="container search-container-center">
              <SearchPackagesBar
                query={searchQuery}
                setQuery={setSearchQuery}
                onSearch={handleSearch}
                matches={liveMatches}
              />
            </div>
          </div>

          <div className={cn('sticky-search-wrap mobile-search-sticky', compactSearch && 'compact-search')}>
            <div className="container">
              <SearchPackagesBar
                query={searchQuery}
                setQuery={setSearchQuery}
                onSearch={handleSearch}
                matches={liveMatches}
              />
            </div>
          </div>
        </>
      )}

      {isHomeRoute ? (
        <main>
          <Hero
            query={searchQuery}
            setQuery={setSearchQuery}
            onSearch={handleSearch}
            matches={liveMatches}
          />
          <SearchResultsSection
            query={activeSearchQuery}
            items={searchResults}
            onSelect={setSelectedPackage}
          />
          <UttarakhandSacredCircuitSection
            items={packagesState}
            onSelect={setSelectedPackage}
          />
          <FeaturedPackages items={packagesState} onSelect={setSelectedPackage} />
          <ExploreCategoriesSection
            categories={categoriesState}
            onOpenCategory={handleOpenCategory}
          />
          <WhyTravelSection />
          <SharedJourneysSection items={sharedJourneysState} />
          <SpiritualEchoesSection testimonials={latestTestimonials} />
          <ReviewFormSection onNewReview={handleNewReview} />
        </main>
      ) : currentRoute === 'b2b' ? (
        <RoutePageShell
          eyebrow="B2B Portal"
          title="Aadisakti travel partner desk"
          text="Hey Business Partner, thanks for choosing us. Fill the details below in the form, and we will get back to you shortly."
          onBack={() => handleNavigate('home')}
        >
          <B2BPortalSection />
        </RoutePageShell>
      ) : (
        <RoutePageShell
          eyebrow="Air Departures"
          title="Premium air-assisted darshan departures"
          text="Air Departure packages ab homepage par scroll karte waqt nahi dikhenge. Yeh page sirf navbar se open hoga."
          onBack={() => handleNavigate('home')}
        >
          <AirDepartureSection items={packagesState} onSelect={setSelectedPackage} />
        </RoutePageShell>
      )}

      <Footer />

      <AnimatePresence>
        {activeCategory && (
          <CategoryPackagesOverlay
            category={activeCategory}
            packages={activeCategoryPackages}
            onSelect={setSelectedPackage}
            onClose={handleCloseCategory}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPackage && (
          <PackageModal
            pkg={selectedPackage}
            onClose={() => setSelectedPackage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
