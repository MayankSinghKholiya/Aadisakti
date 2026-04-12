import React, { useEffect, useMemo, useState } from 'react'

const emptyPackageForm = {
  title: '',
  location: '',
  region: '',
  category: '',
  month: '',
  duration: '',
  regularPrice: '',
  discountedPrice: '',
  featured: false,
  pilgrimageSpecial: false,
  airDepartureFeatured: false,
  helicopterAvailable: false,
  badge: '',
  image: '',
  galleryImages: '',
  description: '',
  hotelType: '',
  transport: '',
  whatsappNumber: '',
  inclusions: '',
  exclusions: '',
  itinerary: '',
}

const emptyJourneyForm = {
  title: '',
  handle: '@aadishakti.travel',
  mention: '@aadishakti.travel',
  trip: '',
  city: '',
  description: '',
  videoUrl: '',
  thumbnail: '',
}

const emptySocialForm = {
  title: '',
  handle: '@aadishakti.travel',
  mention: '@aadishakti.travel',
  postUrl: '',
  image: '',
  description: '',
}

const emptyReviewForm = {
  name: '',
  city: '',
  trip: '',
  rating: 5,
  text: '',
  visible: true,
}

export default function AdminApp() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  const [packages, setPackages] = useState([])
  const [categories, setCategories] = useState([])
  const [socialPosts, setSocialPosts] = useState([])
  const [sharedJourneys, setSharedJourneys] = useState([])
  const [testimonials, setTestimonials] = useState([])

  const [editingPackageId, setEditingPackageId] = useState(null)
  const [editingSocialId, setEditingSocialId] = useState(null)
  const [editingJourneyId, setEditingJourneyId] = useState(null)
  const [editingReviewId, setEditingReviewId] = useState(null)

  const [newPackageForm, setNewPackageForm] = useState(emptyPackageForm)
  const [editPackageForm, setEditPackageForm] = useState(emptyPackageForm)
  const [newSocialForm, setNewSocialForm] = useState(emptySocialForm)
  const [editSocialForm, setEditSocialForm] = useState(emptySocialForm)
  const [newJourneyForm, setNewJourneyForm] = useState(emptyJourneyForm)
  const [editJourneyForm, setEditJourneyForm] = useState(emptyJourneyForm)
  const [newReviewForm, setNewReviewForm] = useState(emptyReviewForm)
  const [editReviewForm, setEditReviewForm] = useState(emptyReviewForm)

  const [showNewPackageForm, setShowNewPackageForm] = useState(false)
  const [showNewSocialForm, setShowNewSocialForm] = useState(false)
  const [showNewJourneyForm, setShowNewJourneyForm] = useState(false)
  const [showNewReviewForm, setShowNewReviewForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!token) return
    fetchAll()
  }, [token])

  const categoryOptions = useMemo(() => {
    const fromCategories = categories.map((item) => item.key)
    const fromPackages = packages.map((item) => item.category).filter(Boolean)
    return [...new Set([...fromCategories, ...fromPackages])]
  }, [categories, packages])

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  async function fetchAll() {
    try {
      setLoading(true)

      const [pkgRes, catRes, socialRes, journeyRes, reviewRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/categories'),
        fetch('/api/social-posts'),
        fetch('/api/shared-journeys'),
        fetch('/api/admin/testimonials', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const [pkgData, catData, socialData, journeyData, reviewData] = await Promise.all([
        pkgRes.json(),
        catRes.json(),
        socialRes.json(),
        journeyRes.json(),
        reviewRes.json(),
      ])

      if (reviewRes.status === 401) {
        alert('Admin session expire ho gaya. Dobara login karo.')
        handleLogout()
        return
      }

      setPackages(Array.isArray(pkgData) ? pkgData : [])
      setCategories(Array.isArray(catData) ? catData : [])
      setSocialPosts(Array.isArray(socialData) ? socialData : [])
      setSharedJourneys(Array.isArray(journeyData) ? journeyData : [])
      setTestimonials(Array.isArray(reviewData) ? reviewData : [])
    } catch (error) {
      console.error(error)
      alert('Admin data load nahi hua')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e) {
    e.preventDefault()

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Login failed')
        return
      }

      localStorage.setItem('adminToken', data.token)
      setToken(data.token)
    } catch (error) {
      console.error(error)
      alert('Server error')
    }
  }

  function handleLogout() {
    localStorage.removeItem('adminToken')
    setToken('')
    setPackages([])
    setCategories([])
    setSocialPosts([])
    setSharedJourneys([])
    setTestimonials([])
    setEditingPackageId(null)
    setEditingSocialId(null)
    setEditingJourneyId(null)
    setEditingReviewId(null)
  }

  function toArray(value) {
    if (!value) return []
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  function toText(value) {
    if (!Array.isArray(value)) return ''
    return value.join('\n')
  }

  function normalizePackageToForm(pkg = {}) {
    return {
      title: pkg.title || '',
      location: pkg.location || '',
      region: pkg.region || '',
      category: pkg.category || '',
      month: pkg.month || '',
      duration: pkg.duration || '',
      regularPrice: pkg.regularPrice || '',
      discountedPrice: pkg.discountedPrice || '',
      featured: !!pkg.featured,
      pilgrimageSpecial: !!pkg.pilgrimageSpecial,
      airDepartureFeatured: !!pkg.airDepartureFeatured,
      helicopterAvailable: !!pkg.helicopterAvailable,
      badge: pkg.badge || '',
      image: pkg.image || '',
      galleryImages: toText(pkg.galleryImages || []),
      description: pkg.description || '',
      hotelType: pkg.hotelType || '',
      transport: pkg.transport || '',
      whatsappNumber: pkg.whatsappNumber || '',
      inclusions: toText(pkg.inclusions),
      exclusions: toText(pkg.exclusions),
      itinerary: toText(pkg.itinerary),
    }
  }

  function normalizeReviewToForm(item = {}) {
    return {
      name: item.name || '',
      city: item.city || '',
      trip: item.trip || '',
      rating: Number(item.rating || 5),
      text: item.text || '',
      visible: item.visible !== false,
    }
  }

  function buildPackagePayload(form) {
    const galleryImages = Array.from(
      new Set([form.image, ...toArray(form.galleryImages)].filter(Boolean)),
    )

    return {
      title: form.title,
      location: form.location,
      region: form.region,
      category: form.category,
      month: form.month,
      duration: form.duration,
      regularPrice: Number(form.regularPrice || 0),
      discountedPrice: Number(form.discountedPrice || 0),
      featured: Boolean(form.featured),
      pilgrimageSpecial: Boolean(form.pilgrimageSpecial),
      airDepartureFeatured: Boolean(form.airDepartureFeatured),
      helicopterAvailable: Boolean(form.helicopterAvailable),
      badge: form.badge,
      image: form.image,
      galleryImages,
      description: form.description,
      hotelType: form.hotelType,
      transport: form.transport,
      whatsappNumber: form.whatsappNumber,
      inclusions: toArray(form.inclusions),
      exclusions: toArray(form.exclusions),
      itinerary: toArray(form.itinerary),
    }
  }

  function buildSocialPayload(form) {
    return {
      title: form.title,
      handle: form.handle,
      mention: form.mention,
      postUrl: form.postUrl,
      image: form.image,
      description: form.description,
    }
  }

  function buildJourneyPayload(form) {
    return {
      title: form.title,
      handle: form.handle,
      mention: form.mention,
      trip: form.trip,
      city: form.city,
      description: form.description,
      videoUrl: form.videoUrl,
      thumbnail: form.thumbnail,
    }
  }

  function buildReviewPayload(form) {
    return {
      name: form.name,
      city: form.city,
      trip: form.trip,
      rating: Number(form.rating || 5),
      text: form.text,
      visible: Boolean(form.visible),
    }
  }

  async function uploadSingleFile(file) {
    const dataUrl = await fileToDataUrl(file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        fileName: file.name,
        dataUrl,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.url
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleCoverUpload(file, setter) {
    if (!file) return
    try {
      setUploading(true)
      const uploadedUrl = await uploadSingleFile(file)
      setter((prev) => ({ ...prev, image: uploadedUrl }))
    } catch (error) {
      console.error(error)
      alert('Cover upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleGalleryUpload(files, setter) {
    if (!files?.length) return
    try {
      setUploading(true)
      const uploadedUrls = []
      for (const file of Array.from(files)) {
        const uploadedUrl = await uploadSingleFile(file)
        uploadedUrls.push(uploadedUrl)
      }

      setter((prev) => {
        const existing = toArray(prev.galleryImages)
        const merged = Array.from(new Set([...existing, ...uploadedUrls]))
        return {
          ...prev,
          galleryImages: merged.join('\n'),
          image: prev.image || uploadedUrls[0] || '',
        }
      })
    } catch (error) {
      console.error(error)
      alert('Gallery upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSocialCoverUpload(file, setter) {
    if (!file) return
    try {
      setUploading(true)
      const uploadedUrl = await uploadSingleFile(file)
      setter((prev) => ({ ...prev, image: uploadedUrl }))
    } catch (error) {
      console.error(error)
      alert('Social cover upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleJourneyCoverUpload(file, setter) {
    if (!file) return
    try {
      setUploading(true)
      const uploadedUrl = await uploadSingleFile(file)
      setter((prev) => ({ ...prev, thumbnail: uploadedUrl }))
    } catch (error) {
      console.error(error)
      alert('Shared journey thumbnail upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleJourneyVideoUpload(file, setter) {
    if (!file) return
    try {
      setUploading(true)
      const uploadedUrl = await uploadSingleFile(file)
      setter((prev) => ({ ...prev, videoUrl: uploadedUrl }))
    } catch (error) {
      console.error(error)
      alert('Shared journey video upload failed')
    } finally {
      setUploading(false)
    }
  }

  function startEditPackage(pkg) {
    setEditingPackageId(pkg.id)
    setEditPackageForm(normalizePackageToForm(pkg))
  }

  function cancelEditPackage() {
    setEditingPackageId(null)
    setEditPackageForm(emptyPackageForm)
  }

  async function savePackage(id) {
    try {
      const payload = buildPackagePayload(editPackageForm)

      const res = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Update failed')
        return
      }

      setPackages((prev) => prev.map((pkg) => (pkg.id === id ? data : pkg)))
      cancelEditPackage()
      alert('Package updated')
    } catch (error) {
      console.error(error)
      alert('Update error')
    }
  }

  async function deletePackage(id) {
    const ok = window.confirm('Package delete karna hai?')
    if (!ok) return

    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Delete failed')
        return
      }

      setPackages((prev) => prev.filter((pkg) => pkg.id !== id))
      if (editingPackageId === id) cancelEditPackage()
    } catch (error) {
      console.error(error)
      alert('Delete error')
    }
  }

  async function addPackage(e) {
    e.preventDefault()
    try {
      const payload = buildPackagePayload(newPackageForm)

      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Add package failed')
        return
      }

      setPackages((prev) => [data, ...prev])
      setNewPackageForm(emptyPackageForm)
      setShowNewPackageForm(false)
      alert('New package added')
    } catch (error) {
      console.error(error)
      alert('Add package error')
    }
  }

  function startEditSocial(post) {
    setEditingSocialId(post.id)
    setEditSocialForm({
      title: post.title || '',
      handle: post.handle || '@aadishakti.travel',
      mention: post.mention || post.handle || '@aadishakti.travel',
      postUrl: post.postUrl || '',
      image: post.image || '',
      description: post.description || '',
    })
  }

  function cancelEditSocial() {
    setEditingSocialId(null)
    setEditSocialForm(emptySocialForm)
  }

  async function addJourney(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/shared-journeys', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(buildJourneyPayload(newJourneyForm)),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Shared journey add failed. Re-login karke try karo.')
        return
      }

      setSharedJourneys((prev) => [data, ...prev])
      setNewJourneyForm(emptyJourneyForm)
      setShowNewJourneyForm(false)
    } catch (error) {
      console.error(error)
      alert('Shared journey add failed. Console me exact error check karo.')
    }
  }

  function startEditJourney(item) {
    setEditingJourneyId(item.id)
    setEditJourneyForm({
      title: item.title || '',
      handle: item.handle || '@aadishakti.travel',
      mention: item.mention || item.handle || '@aadishakti.travel',
      trip: item.trip || '',
      city: item.city || '',
      description: item.description || '',
      videoUrl: item.videoUrl || '',
      thumbnail: item.thumbnail || '',
    })
  }

  async function saveJourney(id) {
    try {
      const res = await fetch(`/api/shared-journeys/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(buildJourneyPayload(editJourneyForm)),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Shared journey save failed')
        return
      }

      setSharedJourneys((prev) =>
        prev.map((item) => (String(item.id) === String(id) ? data : item)),
      )
      cancelEditJourney()
    } catch (error) {
      console.error(error)
      alert('Shared journey save failed')
    }
  }

  async function deleteJourney(id) {
    if (!window.confirm('Is shared journey video ko remove karna hai?')) return
    try {
      const res = await fetch(`/api/shared-journeys/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Shared journey delete failed')
        return
      }

      setSharedJourneys((prev) => prev.filter((item) => String(item.id) !== String(id)))
    } catch (error) {
      console.error(error)
      alert('Shared journey delete failed')
    }
  }

  function cancelEditJourney() {
    setEditingJourneyId(null)
    setEditJourneyForm(emptyJourneyForm)
  }

  async function addSocialPost(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/social-posts', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(buildSocialPayload(newSocialForm)),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Post add failed')
        return
      }

      setSocialPosts((prev) => [data, ...prev])
      setNewSocialForm(emptySocialForm)
      setShowNewSocialForm(false)
      alert('Instagram post added')
    } catch (error) {
      console.error(error)
      alert('Social post add error')
    }
  }

  async function saveSocialPost(id) {
    try {
      const res = await fetch(`/api/social-posts/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(buildSocialPayload(editSocialForm)),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Social update failed')
        return
      }

      setSocialPosts((prev) => prev.map((item) => (item.id === id ? data : item)))
      cancelEditSocial()
      alert('Instagram post updated')
    } catch (error) {
      console.error(error)
      alert('Social update error')
    }
  }

  async function deleteSocialPost(id) {
    const ok = window.confirm('Instagram card delete karna hai?')
    if (!ok) return

    try {
      const res = await fetch(`/api/social-posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Delete failed')
        return
      }

      setSocialPosts((prev) => prev.filter((item) => item.id !== id))
      if (editingSocialId === id) cancelEditSocial()
    } catch (error) {
      console.error(error)
      alert('Delete error')
    }
  }

  function startEditReview(item) {
    setEditingReviewId(item.id)
    setEditReviewForm(normalizeReviewToForm(item))
  }

  function cancelEditReview() {
    setEditingReviewId(null)
    setEditReviewForm(emptyReviewForm)
  }

  async function addReview(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(buildReviewPayload(newReviewForm)),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Review add failed')
        return
      }

      setTestimonials((prev) => [data, ...prev])
      setNewReviewForm(emptyReviewForm)
      setShowNewReviewForm(false)
      alert('Review added')
    } catch (error) {
      console.error(error)
      alert('Review add error')
    }
  }

  async function saveReview(id) {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(buildReviewPayload(editReviewForm)),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Review update failed')
        return
      }

      setTestimonials((prev) => prev.map((item) => (String(item.id) === String(id) ? data : item)))
      cancelEditReview()
      alert('Review updated')
    } catch (error) {
      console.error(error)
      alert('Review update error')
    }
  }

  async function deleteReview(id) {
    if (!window.confirm('Is review ko remove karna hai?')) return

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Review delete failed')
        return
      }

      setTestimonials((prev) => prev.filter((item) => String(item.id) !== String(id)))
      if (editingReviewId === id) cancelEditReview()
      alert('Review removed')
    } catch (error) {
      console.error(error)
      alert('Review delete error')
    }
  }

  if (!token) {
    return (
      <div style={loginPageStyle}>
        <form onSubmit={handleLogin} style={loginCardStyle}>
          <h2 style={{ margin: 0 }}>Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={primaryBtn}>
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <datalist id="category-options">
        {categoryOptions.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

      <div style={dashboardInnerStyle}>
        <div style={topBarStyle}>
          <div>
            <div style={overlineStyle}>Aadishakti CMS</div>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.7rem, 2.5vw, 2.4rem)' }}>
              Admin Dashboard
            </h1>
            <div style={{ opacity: 0.75, marginTop: '6px' }}>
              {loading
                ? 'Loading...'
                : 'Packages, reviews, uploads, gallery images, search data and shared journeys.'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowNewPackageForm((prev) => !prev)} style={secondaryBtn}>
              {showNewPackageForm ? 'Close New Package Form' : 'Add New Package'}
            </button>
            <button onClick={() => setShowNewReviewForm((prev) => !prev)} style={secondaryBtn}>
              {showNewReviewForm ? 'Close Review Form' : 'Add Review'}
            </button>
            <button onClick={() => setShowNewSocialForm((prev) => !prev)} style={secondaryBtn}>
              {showNewSocialForm ? 'Close Instagram Form' : 'Add Instagram Post'}
            </button>
            <button onClick={() => setShowNewJourneyForm((prev) => !prev)} style={secondaryBtn}>
              {showNewJourneyForm ? 'Close Shared Journey Form' : 'Add Shared Journey Video'}
            </button>
            <button onClick={handleLogout} style={primaryBtn}>
              Logout
            </button>
          </div>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Packages</div>
            <div style={statValueStyle}>{packages.length}</div>
          </div>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Featured</div>
            <div style={statValueStyle}>{packages.filter((item) => item.featured).length}</div>
          </div>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Reviews</div>
            <div style={statValueStyle}>{testimonials.length}</div>
          </div>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Visible Reviews</div>
            <div style={statValueStyle}>{testimonials.filter((item) => item.visible !== false).length}</div>
          </div>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Shared Journeys</div>
            <div style={statValueStyle}>{sharedJourneys.length}</div>
          </div>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Upload Status</div>
            <div style={statValueStyle}>{uploading ? 'Uploading…' : 'Ready'}</div>
          </div>
        </div>

        {uploading ? (
          <div style={{ ...cardStyle, borderColor: '#d4af37', marginBottom: '18px' }}>
            Upload chal raha hai...
          </div>
        ) : null}

        {showNewPackageForm && (
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Add New Package</h2>
            <PackageForm
              form={newPackageForm}
              setForm={setNewPackageForm}
              categoryOptions={categoryOptions}
              onSubmit={addPackage}
              submitLabel="Save New Package"
              onCancel={() => {
                setNewPackageForm(emptyPackageForm)
                setShowNewPackageForm(false)
              }}
              onCoverUpload={(file) => handleCoverUpload(file, setNewPackageForm)}
              onGalleryUpload={(files) => handleGalleryUpload(files, setNewPackageForm)}
            />
          </div>
        )}

        {showNewReviewForm && (
          <div style={{ ...cardStyle, marginTop: '18px' }}>
            <h2 style={{ marginTop: 0 }}>Add New Review</h2>
            <ReviewForm
              form={newReviewForm}
              setForm={setNewReviewForm}
              onSubmit={addReview}
              submitLabel="Save Review"
              onCancel={() => {
                setNewReviewForm(emptyReviewForm)
                setShowNewReviewForm(false)
              }}
            />
          </div>
        )}

        {showNewSocialForm && (
          <div style={{ ...cardStyle, marginTop: '18px' }}>
            <h2 style={{ marginTop: 0 }}>Add Instagram Story / Post Card</h2>
            <SocialForm
              form={newSocialForm}
              setForm={setNewSocialForm}
              onSubmit={addSocialPost}
              submitLabel="Save Instagram Card"
              onCancel={() => {
                setNewSocialForm(emptySocialForm)
                setShowNewSocialForm(false)
              }}
              onCoverUpload={(file) => handleSocialCoverUpload(file, setNewSocialForm)}
            />
          </div>
        )}

        {showNewJourneyForm && (
          <div style={{ ...cardStyle, marginTop: '18px' }}>
            <h2 style={{ marginTop: 0 }}>Add Shared Journey Video</h2>
            <JourneyForm
              form={newJourneyForm}
              setForm={setNewJourneyForm}
              onSubmit={addJourney}
              submitLabel="Save Shared Journey"
              onCancel={() => {
                setNewJourneyForm(emptyJourneyForm)
                setShowNewJourneyForm(false)
              }}
              onThumbUpload={(file) => handleJourneyCoverUpload(file, setNewJourneyForm)}
              onVideoUpload={(file) => handleJourneyVideoUpload(file, setNewJourneyForm)}
            />
          </div>
        )}

        <section style={{ marginTop: '24px' }}>
          <h2 style={sectionHeadingStyle}>Packages</h2>
          <div style={{ display: 'grid', gap: '14px' }}>
            {packages.map((pkg) => (
              <div key={pkg.id} style={cardStyle}>
                {editingPackageId === pkg.id ? (
                  <>
                    <h3 style={{ marginTop: 0 }}>Edit Package</h3>
                    <PackageForm
                      form={editPackageForm}
                      setForm={setEditPackageForm}
                      categoryOptions={categoryOptions}
                      onSubmit={(e) => {
                        e.preventDefault()
                        savePackage(pkg.id)
                      }}
                      submitLabel="Save Package"
                      onCancel={cancelEditPackage}
                      onCoverUpload={(file) => handleCoverUpload(file, setEditPackageForm)}
                      onGalleryUpload={(files) => handleGalleryUpload(files, setEditPackageForm)}
                    />
                  </>
                ) : (
                  <>
                    <div style={packageRowStyle}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>{pkg.title}</h3>
                        <p style={metaText}>
                          {pkg.location} • {pkg.duration} • {pkg.category}
                        </p>
                        <p style={mutedText}>₹{pkg.discountedPrice} • {pkg.badge || 'No badge'}</p>
                        <p style={mutedText}>Gallery photos: {(pkg.galleryImages || []).length}</p>
                        <p style={mutedText}>
                          WhatsApp: {pkg.whatsappNumber || 'Default brand number'}
                        </p>
                      </div>

                      {pkg.image ? <img src={pkg.image} alt={pkg.title} style={previewImageStyle} /> : null}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                      <button onClick={() => startEditPackage(pkg)} style={secondaryBtn}>
                        Edit
                      </button>
                      <button onClick={() => deletePackage(pkg.id)} style={dangerBtn}>
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '28px' }}>
          <h2 style={sectionHeadingStyle}>Spiritual Echoes Reviews</h2>
          <div style={{ display: 'grid', gap: '14px' }}>
            {testimonials.map((item) => (
              <div key={item.id} style={cardStyle}>
                {editingReviewId === item.id ? (
                  <>
                    <h3 style={{ marginTop: 0 }}>Edit Review</h3>
                    <ReviewForm
                      form={editReviewForm}
                      setForm={setEditReviewForm}
                      onSubmit={(e) => {
                        e.preventDefault()
                        saveReview(item.id)
                      }}
                      submitLabel="Save Review"
                      onCancel={cancelEditReview}
                    />
                  </>
                ) : (
                  <>
                    <div style={packageRowStyle}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>{item.name || 'Unnamed Review'}</h3>
                        <p style={metaText}>
                          {item.city || 'No city'} • {item.trip || 'No trip'} • {item.rating || 5}★
                        </p>
                        <p style={mutedText}>
                          Status: {item.visible === false ? 'Hidden' : 'Visible on website'}
                        </p>
                        <p style={mutedText}>{item.text || 'No review text'}</p>
                        <p style={mutedText}>
                          Added: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                      <button onClick={() => startEditReview(item)} style={secondaryBtn}>
                        Edit
                      </button>
                      <button onClick={() => deleteReview(item.id)} style={dangerBtn}>
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '28px' }}>
          <h2 style={sectionHeadingStyle}>Instagram Stories / Posts</h2>
          <div style={{ display: 'grid', gap: '14px' }}>
            {socialPosts.map((post) => (
              <div key={post.id} style={cardStyle}>
                {editingSocialId === post.id ? (
                  <>
                    <h3 style={{ marginTop: 0 }}>Edit Instagram Card</h3>
                    <SocialForm
                      form={editSocialForm}
                      setForm={setEditSocialForm}
                      onSubmit={(e) => {
                        e.preventDefault()
                        saveSocialPost(post.id)
                      }}
                      submitLabel="Save Instagram Card"
                      onCancel={cancelEditSocial}
                      onCoverUpload={(file) => handleSocialCoverUpload(file, setEditSocialForm)}
                    />
                  </>
                ) : (
                  <>
                    <div style={packageRowStyle}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>{post.title}</h3>
                        <p style={metaText}>{post.handle}</p>
                        <p style={mutedText}>{post.postUrl || 'No Instagram URL added'}</p>
                        <p style={mutedText}>{post.description || 'No description'}</p>
                      </div>

                      {post.image ? <img src={post.image} alt={post.title} style={previewImageStyle} /> : null}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                      <button onClick={() => startEditSocial(post)} style={secondaryBtn}>
                        Edit
                      </button>
                      <button onClick={() => deleteSocialPost(post.id)} style={dangerBtn}>
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '28px' }}>
          <h2 style={sectionHeadingStyle}>Shared Journey Videos</h2>
          <div style={{ display: 'grid', gap: '14px' }}>
            {sharedJourneys.map((item) => (
              <div key={item.id} style={cardStyle}>
                {editingJourneyId === item.id ? (
                  <>
                    <h3 style={{ marginTop: 0 }}>Edit Shared Journey</h3>
                    <JourneyForm
                      form={editJourneyForm}
                      setForm={setEditJourneyForm}
                      onSubmit={(e) => {
                        e.preventDefault()
                        saveJourney(item.id)
                      }}
                      submitLabel="Save Shared Journey"
                      onCancel={cancelEditJourney}
                      onThumbUpload={(file) => handleJourneyCoverUpload(file, setEditJourneyForm)}
                      onVideoUpload={(file) => handleJourneyVideoUpload(file, setEditJourneyForm)}
                    />
                  </>
                ) : (
                  <>
                    <div style={packageRowStyle}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <h3 style={{ margin: '0 0 8px 0' }}>{item.title || item.trip || 'Shared Journey'}</h3>
                        <p style={metaText}>
                          {item.trip || 'Travel Video'} {item.city ? `• ${item.city}` : ''}
                        </p>
                        <p style={mutedText}>{item.handle || '@aadishakti.travel'}</p>
                        <p style={mutedText}>{item.description || 'No description'}</p>
                      </div>

                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title || 'Journey preview'}
                          style={previewImageStyle}
                        />
                      ) : item.videoUrl ? (
                        <video src={item.videoUrl} style={previewImageStyle} controls preload="metadata" />
                      ) : null}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                      <button onClick={() => startEditJourney(item)} style={secondaryBtn}>
                        Edit
                      </button>
                      <button onClick={() => deleteJourney(item.id)} style={dangerBtn}>
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function PackageForm({
  form,
  setForm,
  categoryOptions,
  onSubmit,
  submitLabel,
  onCancel,
  onCoverUpload,
  onGalleryUpload,
}) {
  return (
    <form onSubmit={onSubmit} style={formGridStyle}>
      <input
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        placeholder="Package Title"
        style={inputStyle}
        required
      />
      <input
        value={form.location}
        onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
        placeholder="Location"
        style={inputStyle}
        required
      />
      <input
        value={form.region}
        onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
        placeholder="Region"
        style={inputStyle}
      />
      <select
  value={form.category}
  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
  style={inputStyle}
  required
>
  <option value="">Select Category</option>
  <option value="Pilgrimage">Pilgrimage</option>
  <option value="Retreat">Retreat</option>
  <option value="Heritage">Heritage</option>
  <option value="Leisure">Leisure</option>
</select>
     
      <input
        value={form.month}
        onChange={(e) => setForm((prev) => ({ ...prev, month: e.target.value }))}
        placeholder="Month"
        style={inputStyle}
      />
      <input
        value={form.duration}
        onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
        placeholder="Duration (e.g. 5D / 4N)"
        style={inputStyle}
      />
      <input
        value={form.regularPrice}
        onChange={(e) => setForm((prev) => ({ ...prev, regularPrice: e.target.value }))}
        placeholder="Regular Price"
        type="number"
        style={inputStyle}
      />
      <input
        value={form.discountedPrice}
        onChange={(e) => setForm((prev) => ({ ...prev, discountedPrice: e.target.value }))}
        placeholder="Discounted Price"
        type="number"
        style={inputStyle}
      />
      <input
        value={form.badge}
        onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
        placeholder="Badge"
        style={inputStyle}
      />
      <input
        value={form.hotelType}
        onChange={(e) => setForm((prev) => ({ ...prev, hotelType: e.target.value }))}
        placeholder="Hotel Type"
        style={inputStyle}
      />
      <input
        value={form.transport}
        onChange={(e) => setForm((prev) => ({ ...prev, transport: e.target.value }))}
        placeholder="Transport"
        style={inputStyle}
      />
      <input
        value={form.whatsappNumber}
        onChange={(e) => setForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
        placeholder="WhatsApp Number (e.g. 919876543210)"
        style={inputStyle}
      />
      <label style={checkboxLabelStyle}>
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
        />
        Featured Package
      </label>
      <label style={checkboxLabelStyle}>
        <input
          type="checkbox"
          checked={form.pilgrimageSpecial}
          onChange={(e) => setForm((prev) => ({ ...prev, pilgrimageSpecial: e.target.checked }))}
        />
        Uttarakhand Sacred Circuit Section
      </label>
      <label style={checkboxLabelStyle}>
        <input
          type="checkbox"
          checked={form.airDepartureFeatured}
          onChange={(e) => setForm((prev) => ({ ...prev, airDepartureFeatured: e.target.checked }))}
        />
        Air Departure Section
      </label>
      <label style={checkboxLabelStyle}>
        <input
          type="checkbox"
          checked={form.helicopterAvailable}
          onChange={(e) => setForm((prev) => ({ ...prev, helicopterAvailable: e.target.checked }))}
        />
        Helicopter Available
      </label>

      <input
        value={form.image}
        onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
        placeholder="Cover Image URL or /uploads/file.jpg"
        style={inputStyle}
      />
      <label style={fieldLabelStyle}>
        Upload Cover Photo
        <input
          type="file"
          accept="image/*"
          style={fileInputStyle}
          onChange={(e) => onCoverUpload?.(e.target.files?.[0])}
        />
      </label>

      <textarea
        value={form.galleryImages}
        onChange={(e) => setForm((prev) => ({ ...prev, galleryImages: e.target.value }))}
        placeholder={'Gallery image URLs\nOne image URL per line'}
        style={textareaStyle}
      />
      <label style={fieldLabelStyle}>
        Upload Gallery Photos (multiple)
        <input
          type="file"
          accept="image/*"
          multiple
          style={fileInputStyle}
          onChange={(e) => onGalleryUpload?.(e.target.files)}
        />
      </label>

      <textarea
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        placeholder="Description"
        style={textareaStyle}
      />
      <textarea
        value={form.inclusions}
        onChange={(e) => setForm((prev) => ({ ...prev, inclusions: e.target.value }))}
        placeholder={'Inclusions\nOne item per line'}
        style={textareaStyle}
      />
      <textarea
        value={form.exclusions}
        onChange={(e) => setForm((prev) => ({ ...prev, exclusions: e.target.value }))}
        placeholder={'Exclusions\nOne item per line'}
        style={textareaStyle}
      />
      <textarea
        value={form.itinerary}
        onChange={(e) => setForm((prev) => ({ ...prev, itinerary: e.target.value }))}
        placeholder={'Itinerary\nOne line per day/highlight'}
        style={textareaStyle}
      />

      {form.image ? (
        <div style={previewWrapStyle}>
          <div style={{ fontSize: '14px', opacity: 0.82, marginBottom: '8px' }}>Cover Preview</div>
          <img src={form.image} alt="Preview" style={previewLargeStyle} />
        </div>
      ) : null}

      {form.galleryImages ? (
        <div style={previewWrapStyle}>
          <div style={{ fontSize: '14px', opacity: 0.82, marginBottom: '8px' }}>Gallery Preview</div>
          <div style={thumbGridStyle}>
            {toArrayPreview(form.galleryImages).map((url) => (
              <img key={url} src={url} alt="Gallery" style={thumbPreviewStyle} />
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
        <button type="submit" style={successBtn}>{submitLabel}</button>
        <button type="button" onClick={onCancel} style={mutedBtn}>Cancel</button>
      </div>
    </form>
  )
}

function ReviewForm({ form, setForm, onSubmit, submitLabel, onCancel }) {
  return (
    <form onSubmit={onSubmit} style={formGridStyle}>
      <input
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        placeholder="Reviewer Name"
        style={inputStyle}
        required
      />
      <input
        value={form.city}
        onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
        placeholder="City"
        style={inputStyle}
      />
      <input
        value={form.trip}
        onChange={(e) => setForm((prev) => ({ ...prev, trip: e.target.value }))}
        placeholder="Trip / Package Name"
        style={inputStyle}
      />
      <select
        value={form.rating}
        onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
        style={inputStyle}
      >
        <option value={5}>5 Star</option>
        <option value={4}>4 Star</option>
        <option value={3}>3 Star</option>
        <option value={2}>2 Star</option>
        <option value={1}>1 Star</option>
      </select>
      <label style={checkboxLabelStyle}>
        <input
          type="checkbox"
          checked={form.visible}
          onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))}
        />
        Visible on website
      </label>
      <textarea
        value={form.text}
        onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
        placeholder="Review text"
        style={textareaStyle}
        required
      />

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
        <button type="submit" style={successBtn}>{submitLabel}</button>
        <button type="button" onClick={onCancel} style={mutedBtn}>Cancel</button>
      </div>
    </form>
  )
}

function JourneyForm({
  form,
  setForm,
  onSubmit,
  submitLabel,
  onCancel,
  onThumbUpload,
  onVideoUpload,
}) {
  return (
    <form onSubmit={onSubmit} style={formGridStyle}>
      <input
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        placeholder="Journey Title"
        style={inputStyle}
        required
      />
      <input
        value={form.trip}
        onChange={(e) => setForm((prev) => ({ ...prev, trip: e.target.value }))}
        placeholder="Trip / Package Name"
        style={inputStyle}
      />
      <input
        value={form.city}
        onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
        placeholder="Traveller City"
        style={inputStyle}
      />
      <input
        value={form.handle}
        onChange={(e) => setForm((prev) => ({ ...prev, handle: e.target.value }))}
        placeholder="@instagramhandle"
        style={inputStyle}
      />
      <input
        value={form.mention}
        onChange={(e) => setForm((prev) => ({ ...prev, mention: e.target.value }))}
        placeholder="Mention text"
        style={inputStyle}
      />
      <input
        value={form.thumbnail}
        onChange={(e) => setForm((prev) => ({ ...prev, thumbnail: e.target.value }))}
        placeholder="Video cover thumbnail URL"
        style={inputStyle}
      />
      <label style={fieldLabelStyle}>
        Upload Thumbnail
        <input
          type="file"
          accept="image/*"
          style={fileInputStyle}
          onChange={(e) => onThumbUpload?.(e.target.files?.[0])}
        />
      </label>
      <input
        value={form.videoUrl}
        onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
        placeholder="Playable video URL or /uploads/video.mp4"
        style={inputStyle}
      />
      <label style={fieldLabelStyle}>
        Upload Video
        <input
          type="file"
          accept="video/*"
          style={fileInputStyle}
          onChange={(e) => onVideoUpload?.(e.target.files?.[0])}
        />
      </label>
      <textarea
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        placeholder="Short journey description"
        style={textareaStyle}
      />

      {form.thumbnail ? (
        <div style={previewWrapStyle}>
          <img src={form.thumbnail} alt="Journey thumbnail" style={previewLargeStyle} />
        </div>
      ) : null}

      {form.videoUrl ? (
        <div style={previewWrapStyle}>
          <video src={form.videoUrl} controls preload="metadata" style={previewLargeStyle} />
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
        <button type="submit" style={successBtn}>{submitLabel}</button>
        <button type="button" onClick={onCancel} style={mutedBtn}>Cancel</button>
      </div>
    </form>
  )
}

function SocialForm({ form, setForm, onSubmit, submitLabel, onCancel, onCoverUpload }) {
  return (
    <form onSubmit={onSubmit} style={formGridStyle}>
      <input
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        placeholder="Card Title"
        style={inputStyle}
        required
      />
      <input
        value={form.handle}
        onChange={(e) => setForm((prev) => ({ ...prev, handle: e.target.value }))}
        placeholder="@instagramhandle"
        style={inputStyle}
      />
      <input
        value={form.mention}
        onChange={(e) => setForm((prev) => ({ ...prev, mention: e.target.value }))}
        placeholder="Mention text"
        style={inputStyle}
      />
      <input
        value={form.postUrl}
        onChange={(e) => setForm((prev) => ({ ...prev, postUrl: e.target.value }))}
        placeholder="Instagram post/reel URL"
        style={inputStyle}
      />
      <input
        value={form.image}
        onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
        placeholder="Cover image URL"
        style={inputStyle}
      />
      <label style={fieldLabelStyle}>
        Upload Cover Photo
        <input
          type="file"
          accept="image/*"
          style={fileInputStyle}
          onChange={(e) => onCoverUpload?.(e.target.files?.[0])}
        />
      </label>
      <textarea
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        placeholder="Short description"
        style={textareaStyle}
      />

      {form.image ? (
        <div style={previewWrapStyle}>
          <img src={form.image} alt="Social preview" style={previewLargeStyle} />
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
        <button type="submit" style={successBtn}>{submitLabel}</button>
        <button type="button" onClick={onCancel} style={mutedBtn}>Cancel</button>
      </div>
    </form>
  )
}

function toArrayPreview(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

const loginPageStyle = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background:
    'radial-gradient(circle at top, rgba(250, 204, 21, 0.08), transparent 24%), linear-gradient(180deg, #050505, #0a0a0a)',
  color: 'white',
  padding: '20px',
}

const loginCardStyle = {
  width: '100%',
  maxWidth: '400px',
  background: 'linear-gradient(180deg, rgba(18,18,18,0.98), rgba(9,9,9,0.98))',
  padding: '26px',
  borderRadius: '20px',
  display: 'grid',
  gap: '12px',
  border: '1px solid rgba(250, 204, 21, 0.18)',
  boxShadow: '0 22px 60px rgba(0,0,0,0.24)',
}

const pageStyle = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top, rgba(250, 204, 21, 0.08), transparent 26%), linear-gradient(180deg, #050505, #0a0a0a)',
  color: 'white',
  padding: '24px 16px 48px',
  fontFamily: 'Manrope, system-ui, sans-serif',
}

const dashboardInnerStyle = {
  width: 'min(1280px, 100%)',
  margin: '0 auto',
}

const overlineStyle = {
  fontSize: '11px',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: 'rgba(250, 204, 21, 0.78)',
  marginBottom: '8px',
}

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
  marginBottom: '20px',
}

const statCardStyle = {
  background: 'linear-gradient(180deg, rgba(18,18,18,0.98), rgba(9,9,9,0.98))',
  border: '1px solid rgba(250, 204, 21, 0.14)',
  borderRadius: '18px',
  padding: '16px',
  boxShadow: '0 18px 40px rgba(0,0,0,0.22)',
}

const statLabelStyle = {
  fontSize: '12px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.58)',
  marginBottom: '8px',
}

const statValueStyle = {
  fontSize: '1.55rem',
  fontWeight: 800,
  color: '#facc15',
}

const sectionHeadingStyle = {
  margin: '0 0 14px 0',
  fontSize: '1.2rem',
}

const topBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'wrap',
  marginBottom: '20px',
  padding: '0 2px',
}

const cardStyle = {
  background: 'linear-gradient(180deg, rgba(17,17,17,0.98), rgba(10,10,10,0.98))',
  border: '1px solid rgba(250, 204, 21, 0.14)',
  borderRadius: '18px',
  padding: '18px',
  boxShadow: '0 18px 50px rgba(0,0,0,0.18)',
}

const formGridStyle = {
  display: 'grid',
  gap: '10px',
}

const inputStyle = {
  width: '100%',
  padding: '12px 13px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0b0b0b',
  color: 'white',
  outline: 'none',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
}

const textareaStyle = {
  width: '100%',
  minHeight: '110px',
  padding: '12px 13px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0b0b0b',
  color: 'white',
  outline: 'none',
  resize: 'vertical',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
}

const fieldLabelStyle = {
  display: 'grid',
  gap: '8px',
  fontSize: '14px',
  opacity: 0.9,
}

const fileInputStyle = {
  color: 'white',
}

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
}

const primaryBtn = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid #facc15',
  background: '#facc15',
  color: '#111',
  fontWeight: 800,
  cursor: 'pointer',
  boxShadow: '0 12px 26px rgba(250, 204, 21, 0.14)',
}

const secondaryBtn = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(250, 204, 21, 0.2)',
  background: '#171717',
  color: '#fff',
  cursor: 'pointer',
}

const successBtn = {
  ...primaryBtn,
  background: '#eab308',
  borderColor: '#eab308',
}

const mutedBtn = {
  ...secondaryBtn,
}

const dangerBtn = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(239, 68, 68, 0.4)',
  background: '#2b0c0c',
  color: '#fff',
  cursor: 'pointer',
}

const packageRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'start',
  gap: '18px',
}

const previewImageStyle = {
  width: '164px',
  height: '118px',
  objectFit: 'cover',
  borderRadius: '14px',
  border: '1px solid rgba(250, 204, 21, 0.18)',
}

const previewLargeStyle = {
  width: '220px',
  height: '140px',
  objectFit: 'cover',
  borderRadius: '14px',
  border: '1px solid rgba(250, 204, 21, 0.18)',
}

const previewWrapStyle = {
  marginTop: '12px',
}

const thumbGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
  gap: '8px',
}

const thumbPreviewStyle = {
  width: '100%',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '10px',
  border: '1px solid rgba(255, 215, 0, 0.18)',
}

const metaText = {
  margin: '0 0 6px 0',
  opacity: 0.9,
}

const mutedText = {
  margin: '0 0 6px 0',
  opacity: 0.72,
}