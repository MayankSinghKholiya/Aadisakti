const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

const ADMIN_USERNAME = 'PrashnatAadishakti'
const ADMIN_PASSWORD_HASH =
  '08fd4749393430a02c7ce71f7af8db0a1483c627e6478219313c0c5a5425d244'

const STATIC_ADMIN_TOKEN = crypto
  .createHash('sha256')
  .update(`${ADMIN_USERNAME}:${ADMIN_PASSWORD_HASH}:aadishakti-admin`)
  .digest('hex')

const tokens = { [STATIC_ADMIN_TOKEN]: true }

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const parts = header.split(' ')
  const token = parts.length > 1 ? parts[1] : parts[0]

  if (token && tokens[token]) {
    return next()
  }

  return res.status(401).json({ error: 'Unauthorized' })
}

const rootDir = __dirname
const persistRoot = process.env.PERSIST_DIR || rootDir
const uploadsDir = path.join(persistRoot, 'uploads')
const dataDir = path.join(persistRoot, 'data')
const distDir = path.join(rootDir, 'dist')

const packagesFile = path.join(dataDir, 'packages.json')
const categoriesFile = path.join(dataDir, 'categories.json')
const testimonialsFile = path.join(dataDir, 'testimonials.json')
const enquiriesFile = path.join(dataDir, 'enquiries.json')
const newslettersFile = path.join(dataDir, 'newsletters.json')
const socialPostsFile = path.join(dataDir, 'socialPosts.json')
const sharedJourneysFile = path.join(dataDir, 'sharedJourneys.json')

app.use('/uploads', express.static(uploadsDir))

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return []
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error)
    return []
  }
}

function writeJSON(filePath, data) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function toBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1' || value === 'on'
}

function sortByRecent(items = []) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime()
    const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime()

    if (bTime !== aTime) return bTime - aTime

    const aId = Number(a.id) || 0
    const bId = Number(b.id) || 0
    return bId - aId
  })
}

function normalizePackage(raw = {}) {
  const galleryImages = toArray(
    raw.galleryImages || raw.gallery || raw.images || raw.packageImages || raw.photoGallery,
  )

  const normalizedImage = raw.image || galleryImages[0] || ''

  const normalizedGallery = Array.from(
    new Set([normalizedImage, ...galleryImages].filter(Boolean)),
  )

  return {
    id: raw.id || String(Date.now()),
    title: raw.title || '',
    location: raw.location || '',
    region: raw.region || '',
    category: raw.category || '',
    month: raw.month || '',
    duration: raw.duration || '',
    regularPrice: Number(raw.regularPrice || 0),
    discountedPrice: Number(raw.discountedPrice || 0),
    featured: toBoolean(raw.featured),
    pilgrimageSpecial: toBoolean(raw.pilgrimageSpecial),
    airDepartureFeatured: toBoolean(raw.airDepartureFeatured),
    helicopterAvailable: toBoolean(raw.helicopterAvailable),
    badge: raw.badge || '',
    image: normalizedImage,
    galleryImages: normalizedGallery,
    description: raw.description || '',
    hotelType: raw.hotelType || '',
    transport: raw.transport || '',
    whatsappNumber: raw.whatsappNumber || raw.whatsapp || '',
    inclusions: toArray(raw.inclusions),
    exclusions: toArray(raw.exclusions),
    itinerary: toArray(raw.itinerary),
  }
}

function normalizeSocialPost(raw = {}) {
  return {
    id: raw.id || String(Date.now()),
    title: raw.title || '',
    handle: raw.handle || '@aadishakti.travel',
    mention: raw.mention || raw.handle || '@aadishakti.travel',
    postUrl: raw.postUrl || raw.url || '',
    image: raw.image || '',
    description: raw.description || '',
  }
}

function normalizeSharedJourney(raw = {}) {
  return {
    id: raw.id || String(Date.now()),
    title: raw.title || '',
    handle: raw.handle || '@aadishakti.travel',
    trip: raw.trip || '',
    city: raw.city || '',
    mention: raw.mention || raw.handle || '@aadishakti.travel',
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
    visible:
      raw.visible === undefined || raw.visible === null ? true : toBoolean(raw.visible),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
  }
}

function sanitizeFilename(fileName = 'upload') {
  const ext = path.extname(fileName) || '.jpg'
  const base =
    path
      .basename(fileName, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50) || 'upload'

  return `${base}-${Date.now()}${ext.toLowerCase()}`
}

function saveDataUrlToPublic(dataUrl, fileName = 'upload.jpg') {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    throw new Error('Invalid upload payload')
  }

  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/)
  if (!match) {
    throw new Error('Unsupported upload format')
  }

  ensureDir(uploadsDir)

  const safeFileName = sanitizeFilename(fileName)
  const absPath = path.join(uploadsDir, safeFileName)
  fs.writeFileSync(absPath, Buffer.from(match[2], 'base64'))

  return `/uploads/${safeFileName}`
}

function defaultSocialPosts() {
  return [
    {
      id: 'social-1',
      title: 'Sunrise temple moments',
      handle: '@aadishakti.travel',
      mention: '@aadishakti.travel',
      postUrl: 'https://instagram.com/aadishakti.travel',
      image:
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
      description: 'Temple stories, darshan frames and spiritual reels.',
    },
    {
      id: 'social-2',
      title: 'Kashmir diary frames',
      handle: '@aadishakti.travel',
      mention: '@aadishakti.travel',
      postUrl: 'https://instagram.com/aadishakti.travel',
      image:
        'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=900&q=80',
      description: 'Luxury retreat visuals and scenic travel memories.',
    },
  ]
}
function defaultCategories() {
  return [
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
}

/* ---------------- AUTH ---------------- */

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' })
  }

  const hashed = crypto.createHash('sha256').update(password).digest('hex')

  if (username === ADMIN_USERNAME && hashed === ADMIN_PASSWORD_HASH) {
    tokens[STATIC_ADMIN_TOKEN] = true
    return res.json({ token: STATIC_ADMIN_TOKEN })
  }

  return res.status(401).json({ error: 'Invalid credentials' })
})

/* ---------------- UPLOAD ---------------- */

app.post('/api/upload', requireAuth, (req, res) => {
  try {
    const { dataUrl, fileName } = req.body || {}

    if (!dataUrl) {
      return res.status(400).json({ error: 'Missing file data' })
    }

    const uploadedPath = saveDataUrlToPublic(dataUrl, fileName || 'upload.jpg')
    return res.json({ url: uploadedPath })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: 'Upload failed' })
  }
})

/* ---------------- GET ROUTES ---------------- */

app.get('/api/packages', (req, res) => {
  const packages = readJSON(packagesFile).map(normalizePackage)
  res.json(packages)
})

app.get('/api/categories', (req, res) => {
  let categories = readJSON(categoriesFile)

  if (!Array.isArray(categories) || categories.length === 0) {
    categories = defaultCategories()
    writeJSON(categoriesFile, categories)
  }

  res.json(categories)
})

app.get('/api/testimonials', (req, res) => {
  const testimonials = sortByRecent(readJSON(testimonialsFile).map(normalizeTestimonial))
    .filter((item) => item.visible !== false)
    .slice(0, 5)

  res.json(testimonials)
})

app.get('/api/social-posts', (req, res) => {
  let posts = readJSON(socialPostsFile)

  if (!Array.isArray(posts) || posts.length === 0) {
    posts = defaultSocialPosts()
    writeJSON(socialPostsFile, posts)
  }

  res.json(posts.map(normalizeSocialPost))
})


app.get('/api/shared-journeys', (req, res) => {
  const journeys = readJSON(sharedJourneysFile)
  res.json(Array.isArray(journeys) ? journeys.map(normalizeSharedJourney) : [])
})

/* ---------------- ADMIN TESTIMONIALS ---------------- */

app.get('/api/admin/testimonials', requireAuth, (req, res) => {
  const testimonials = sortByRecent(readJSON(testimonialsFile).map(normalizeTestimonial))
  res.json(testimonials)
})

app.post('/api/admin/testimonials', requireAuth, (req, res) => {
  const testimonials = readJSON(testimonialsFile).map(normalizeTestimonial)

  const payload = normalizeTestimonial({
    ...req.body,
    id: req.body?.id || String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  testimonials.unshift(payload)
  writeJSON(testimonialsFile, testimonials)
  res.json(payload)
})

app.put('/api/admin/testimonials/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const testimonials = readJSON(testimonialsFile).map(normalizeTestimonial)

  const index = testimonials.findIndex((item) => String(item.id) === String(id))
  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' })
  }

  const updated = normalizeTestimonial({
    ...testimonials[index],
    ...req.body,
    id: testimonials[index].id,
    createdAt: testimonials[index].createdAt,
    updatedAt: new Date().toISOString(),
  })

  testimonials[index] = updated
  writeJSON(testimonialsFile, testimonials)
  res.json(updated)
})

app.delete('/api/admin/testimonials/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const testimonials = readJSON(testimonialsFile).map(normalizeTestimonial)

  const index = testimonials.findIndex((item) => String(item.id) === String(id))
  if (index === -1) {
    return res.status(404).json({ error: 'Review not found' })
  }

  const removed = testimonials.splice(index, 1)[0]
  writeJSON(testimonialsFile, testimonials)
  res.json(removed)
})

/* ---------------- PACKAGE CRUD ---------------- */

app.post('/api/packages', requireAuth, (req, res) => {
  const pkg = req.body

  if (!pkg) {
    return res.status(400).json({ error: 'Missing package data' })
  }

  const packages = readJSON(packagesFile).map(normalizePackage)
  const normalized = normalizePackage({
    ...pkg,
    id: pkg.id || String(Date.now()),
  })

  packages.unshift(normalized)
  writeJSON(packagesFile, packages)
  res.json(normalized)
})

app.put('/api/packages/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const updates = req.body || {}
  const packages = readJSON(packagesFile).map(normalizePackage)

  const index = packages.findIndex((p) => String(p.id) === String(id))
  if (index === -1) {
    return res.status(404).json({ error: 'Package not found' })
  }

  const updated = normalizePackage({
    ...packages[index],
    ...updates,
    id: packages[index].id,
  })

  packages[index] = updated
  writeJSON(packagesFile, packages)
  res.json(updated)
})

app.delete('/api/packages/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const packages = readJSON(packagesFile).map(normalizePackage)

  const index = packages.findIndex((p) => String(p.id) === String(id))
  if (index === -1) {
    return res.status(404).json({ error: 'Package not found' })
  }

  const removed = packages.splice(index, 1)[0]
  writeJSON(packagesFile, packages)
  res.json(removed)
})

/* ---------------- SOCIAL POSTS CRUD ---------------- */

app.post('/api/social-posts', requireAuth, (req, res) => {
  const payload = normalizeSocialPost(req.body || {})
  const posts = readJSON(socialPostsFile).map(normalizeSocialPost)
  posts.unshift(payload)
  writeJSON(socialPostsFile, posts)
  res.json(payload)
})

app.put('/api/social-posts/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const posts = readJSON(socialPostsFile).map(normalizeSocialPost)
  const index = posts.findIndex((item) => String(item.id) === String(id))

  if (index === -1) {
    return res.status(404).json({ error: 'Social card not found' })
  }

  const updated = normalizeSocialPost({
    ...posts[index],
    ...req.body,
    id: posts[index].id,
  })

  posts[index] = updated
  writeJSON(socialPostsFile, posts)
  res.json(updated)
})

app.delete('/api/social-posts/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const posts = readJSON(socialPostsFile).map(normalizeSocialPost)
  const index = posts.findIndex((item) => String(item.id) === String(id))

  if (index === -1) {
    return res.status(404).json({ error: 'Social card not found' })
  }

  const removed = posts.splice(index, 1)[0]
  writeJSON(socialPostsFile, posts)
  res.json(removed)
})

/* ---------------- SHARED JOURNEYS CRUD ---------------- */

app.post('/api/shared-journeys', requireAuth, (req, res) => {
  const payload = normalizeSharedJourney(req.body || {})
  const journeys = readJSON(sharedJourneysFile).map(normalizeSharedJourney)
  journeys.unshift(payload)
  writeJSON(sharedJourneysFile, journeys)
  res.json(payload)
})

app.put('/api/shared-journeys/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const journeys = readJSON(sharedJourneysFile).map(normalizeSharedJourney)
  const index = journeys.findIndex((item) => String(item.id) === String(id))

  if (index === -1) {
    return res.status(404).json({ error: 'Shared journey not found' })
  }

  const updated = normalizeSharedJourney({
    ...journeys[index],
    ...req.body,
    id: journeys[index].id,
  })

  journeys[index] = updated
  writeJSON(sharedJourneysFile, journeys)
  res.json(updated)
})

app.delete('/api/shared-journeys/:id', requireAuth, (req, res) => {
  const id = req.params.id
  const journeys = readJSON(sharedJourneysFile).map(normalizeSharedJourney)
  const index = journeys.findIndex((item) => String(item.id) === String(id))

  if (index === -1) {
    return res.status(404).json({ error: 'Shared journey not found' })
  }

  const removed = journeys.splice(index, 1)[0]
  writeJSON(sharedJourneysFile, journeys)
  res.json(removed)
})

/* ---------------- LEADS / FORMS ---------------- */

app.post('/api/enquiries', (req, res) => {
  const enquiries = readJSON(enquiriesFile)
  const entry = { id: Date.now(), ...req.body }
  enquiries.push(entry)
  writeJSON(enquiriesFile, enquiries)
  res.json({ success: true, entry })
})

app.post('/api/newsletter', (req, res) => {
  const signups = readJSON(newslettersFile)
  const entry = { id: Date.now(), ...req.body }
  signups.push(entry)
  writeJSON(newslettersFile, signups)
  res.json({ success: true, entry })
})

app.post('/api/reviews', (req, res) => {
  const testimonials = readJSON(testimonialsFile).map(normalizeTestimonial)

  const entry = normalizeTestimonial({
    ...req.body,
    id: String(Date.now()),
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  testimonials.unshift(entry)
  writeJSON(testimonialsFile, testimonials)
  res.json({ success: true, entry })
})

/* ---------------- PRODUCTION FRONTEND ---------------- */

app.use(express.static(distDir))

app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

/* ---------------- START SERVER ---------------- */

if (require.main === module) {
  const port = Number(process.env.PORT || 3001)
  const host = '0.0.0.0'

  app.listen(port, host, () => {
    console.log(`Aadishakti backend is running on port ${port}`)
  })
} else {
  module.exports = app
}
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'aadishakti', time: new Date().toISOString() })
})