const API_BASE = '/admin'

const state = {
  editing: {
    realisation: null,
    actualite: null,
    annonce: null
  },
  rows: {
    images: [],
    realisation: [],
    actualite: [],
    annonce: []
  }
}

const qs = (sel) => document.querySelector(sel)
const qsa = (sel) => [...document.querySelectorAll(sel)]

const forms = {
  image: qs('#imageForm'),
  realisation: qs('#realisationForm'),
  actualite: qs('#actualiteForm'),
  annonce: qs('#annonceForm')
}

const lists = {
  images: qs('#imageGallery'),
  realisation: qs('#realisationBody'),
  actualite: qs('#actualiteBody'),
  annonce: qs('#annonceBody')
}

const counters = {
  images: qs('#imageCount'),
  realisation: qs('#realCount'),
  actualite: qs('#actuCount'),
  annonce: qs('#annonceCount'),
  visitors: qs('#visitCount')
}

const topImagesList = qs('#topImages')
const logoutButton = qs('#logoutBtn')

const toast = qs('#toast')

const showToast = (message, type = 'info') => {
  toast.textContent = message
  toast.dataset.type = type
  toast.classList.add('visible')
  setTimeout(() => toast.classList.remove('visible'), 2800)
}

const fetchJSON = async (url, options = {}) => {
  // On reconstruit les options pour imposer l'envoi du cookie admin partout.
  const finalOptions = {
    ...options,
    // Chaque action admin renvoie automatiquement le cookie vers le serveur.
    credentials: 'same-origin'
  }

  // Toutes les requetes admin passent par ce `fetch`.
  const res = await fetch(url, finalOptions)
  // On lit d'abord le texte brut pour gerer aussi les reponses vides.
  const text = await res.text()
  // Si le corps contient du JSON, on le parse.
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text ? { message: text } : null
  }
  if (!res.ok) {
    // On privilegie le message metier du serveur.
    const msg = data?.message || res.statusText
    if (res.status === 401 || res.status === 403) {
      setTimeout(() => { window.location.href = '/admin/login' }, 700)
    }
    throw new Error(msg)
  }
  // Sinon on retourne la donnee deja parsee.
  return data
}

const normalizeRealisation = (row) => ({
  ...row,
  annee: row.annee || row['anneé'] || ''
})

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

// -------------- Images -----------------
const loadImages = async () => {
  const data = await fetchJSON(`${API_BASE}/images`)
  state.rows.images = data
  counters.images.textContent = data.length
  lists.images.innerHTML = data
    .map(({ id, path, filename }) => `
      <figure class="thumb" data-id="${id}">
        <img src="/${path}" alt="${filename}">
        <figcaption>${filename}</figcaption>
        <button class="btn ghost action-delete" data-type="images" data-id="${id}">Supprimer</button>
      </figure>
    `)
    .join('') || '<p class="muted">Aucune image pour le moment.</p>'
}

const handleImageSubmit = async (e) => {
  e.preventDefault()
  const formData = new FormData(forms.image)
  try {
    await fetchJSON(`${API_BASE}/upload-image`, {
      method: 'POST',
      body: formData
    })
    forms.image.reset()
    await loadImages()
    showToast('Image uploadée avec succès', 'success')
  } catch (err) {
    showToast(err.message, 'error')
  }
}

// -------------- Helpers -----------------
const serializeForm = (form) => Object.fromEntries(new FormData(form).entries())

const uploadAndGetUrl = async (file) => {
  const fd = new FormData()
  fd.append('image', file)
  const res = await fetchJSON(`${API_BASE}/upload-image`, { method: 'POST', body: fd })
  return res?.data?.url || res?.data?.path || ''
}

const resetEditMode = (type) => {
  state.editing[type] = null
  const legend = formLegend(type)
  legend.textContent = legend.dataset.default
  formSubmit(type).textContent = 'Enregistrer'
  forms[type].reset()
}

const formLegend = (type) => qs(`#${type}Legend`)
const formSubmit = (type) => forms[type].querySelector('button[type="submit"]')

const enterEditMode = (type, item) => {
  state.editing[type] = item.id
  const legend = formLegend(type)
  legend.textContent = `Modifier ${legend.dataset.label}`
  formSubmit(type).textContent = 'Mettre à jour'

  Object.entries(item).forEach(([key, value]) => {
    const input = forms[type].querySelector(`[name="${key}"]`)
    if (input) input.value = value
  })
}

const renderTable = (type, rows, columns) => {
  counters[type].textContent = rows.length
  if (!rows.length) {
    lists[type].innerHTML = `<tr><td colspan="${columns.length + 1}" class="muted">Aucune donnée</td></tr>`
    return
  }

  lists[type].innerHTML = rows
    .map((row) => {
      const cells = columns
        .map((col) => {
          if (typeof col === 'string') {
            return `<td>${row[col] ?? ''}</td>`
          }

          const value = row[col.key]
          return `<td>${col.render ? col.render(value, row) : (value ?? '')}</td>`
        })
        .join('')
      return `
        <tr data-id="${row.id}">
          ${cells}
          <td class="actions">
            <button class="btn ghost action-edit" data-type="${type}" data-id="${row.id}">Éditer</button>
            <button class="btn danger action-delete" data-type="${type}" data-id="${row.id}">Supprimer</button>
          </td>
        </tr>
      `
    })
    .join('')
}

// -------------- Realisations -----------------
const loadRealisations = async () => {
  const data = await fetchJSON(`${API_BASE}/realisation`)
  state.rows.realisation = data.map(normalizeRealisation)
  renderTable('realisation', state.rows.realisation, [
    'annee',
    'localisation',
    'titre',
    'description',
    'image',
    { key: 'created_at', render: (value) => formatDate(value) }
  ])
}

const handleRealSubmit = async (e) => {
  e.preventDefault()
  const payload = serializeForm(forms.realisation)
  const id = state.editing.realisation
  const currentItem = state.rows.realisation.find((item) => String(item.id) === String(id))

  if (forms.realisation.imageFile?.files?.[0]) {
    payload.image = await uploadAndGetUrl(forms.realisation.imageFile.files[0])
  } else if (currentItem?.image) {
    payload.image = currentItem.image
  } else {
    showToast('Veuillez choisir une image pour la réalisation', 'error')
    return
  }
  delete payload.imageFile
  const method = id ? 'PUT' : 'POST'
  const url = `${API_BASE}/realisation${id ? `/${id}` : ''}`

  try {
    await fetchJSON(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    await loadRealisations()
    resetEditMode('realisation')
    showToast(id ? 'Réalisation mise à jour' : 'Réalisation créée', 'success')
  } catch (err) {
    showToast(err.message, 'error')
  }
}

// -------------- Actualités -----------------
const loadActualites = async () => {
  const data = await fetchJSON(`${API_BASE}/actualite`)
  state.rows.actualite = data
  renderTable('actualite', state.rows.actualite, [
    'titre',
    'description',
    'image',
    { key: 'created_at', render: (value) => formatDate(value) }
  ])
}

const handleActuSubmit = async (e) => {
  e.preventDefault()
  const payload = serializeForm(forms.actualite)
  const id = state.editing.actualite
  const currentItem = state.rows.actualite.find((item) => String(item.id) === String(id))

  if (forms.actualite.imageFile?.files?.[0]) {
    payload.image = await uploadAndGetUrl(forms.actualite.imageFile.files[0])
  } else if (currentItem?.image) {
    payload.image = currentItem.image
  } else {
    showToast('Veuillez choisir une image pour l’actualité', 'error')
    return
  }
  delete payload.imageFile
  const method = id ? 'PUT' : 'POST'
  const url = `${API_BASE}/actualite${id ? `/${id}` : ''}`

  try {
    await fetchJSON(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    await loadActualites()
    resetEditMode('actualite')
    showToast(id ? 'Actualité mise à jour' : 'Actualité créée', 'success')
  } catch (err) {
    showToast(err.message, 'error')
  }
}

// -------------- Annonces -----------------
const loadAnnonces = async () => {
  const data = await fetchJSON(`${API_BASE}/annonce`)
  state.rows.annonce = data
  renderTable('annonce', state.rows.annonce, [
    'titre',
    'message',
    { key: 'created_at', render: (value) => formatDate(value) }
  ])
}

const handleAnnonceSubmit = async (e) => {
  e.preventDefault()
  const payload = serializeForm(forms.annonce)
  const id = state.editing.annonce
  const method = id ? 'PUT' : 'POST'
  const url = `${API_BASE}/annonce${id ? `/${id}` : ''}`

  try {
    await fetchJSON(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    await loadAnnonces()
    resetEditMode('annonce')
    showToast(id ? 'Annonce mise à jour' : 'Annonce créée', 'success')
  } catch (err) {
    showToast(err.message, 'error')
  }
}

// -------------- Global actions -----------------
const handleEditClick = (type, id) => {
  const item = state.rows[type].find((entry) => String(entry.id) === String(id))
  if (!item) return
  enterEditMode(type, item)
  window.scrollTo({ top: forms[type].offsetTop - 20, behavior: 'smooth' })
}

const handleDeleteClick = async (type, id) => {
  if (!confirm('Confirmer la suppression ?')) return
  try {
    await fetchJSON(`${API_BASE}/${type}/${id}`, { method: 'DELETE' })
    if (type === 'images') await loadImages()
    if (type === 'realisation') await loadRealisations()
    if (type === 'actualite') await loadActualites()
    if (type === 'annonce') await loadAnnonces()
    showToast('Élément supprimé', 'success')
  } catch (err) {
    showToast(err.message, 'error')
  }
}

const handleTableClick = (e) => {
  const btn = e.target.closest('button')
  if (!btn) return

  const { type, id } = btn.dataset
  if (!type || !id) return

  if (btn.classList.contains('action-edit')) return handleEditClick(type, id)
  if (btn.classList.contains('action-delete')) return handleDeleteClick(type, id)
}

// -------------- Stats -----------------
const loadStats = async () => {
  const data = await fetchJSON(`${API_BASE}/stats`)
  counters.visitors.textContent = data.visitors ?? 0
  if (!topImagesList) return
  topImagesList.innerHTML = (data.topImages || [])
    .map((img, idx) => `
      <li>
        <img src="/${img.path}" alt="${img.filename}">
        <div>
          <span class="badge">#${idx + 1}</span><br>
          <strong>${img.filename}</strong><br>
          <small>${img.path}</small>
        </div>
        <span class="views">${img.views || 0} vues</span>
      </li>
    `)
    .join('') || '<li class="muted">Pas encore de vues</li>'
}

const handleLogout = async () => {
  try {
    await fetchJSON(`${API_BASE}/logout`, { method: 'POST' })
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    window.location.href = '/admin/login'
  }
}

// -------------- Init -----------------
const init = () => {
  forms.image?.addEventListener('submit', handleImageSubmit)
  forms.realisation?.addEventListener('submit', handleRealSubmit)
  forms.actualite?.addEventListener('submit', handleActuSubmit)
  forms.annonce?.addEventListener('submit', handleAnnonceSubmit)
  logoutButton?.addEventListener('click', handleLogout)

  qsa('tbody').forEach((tbody) => tbody.addEventListener('click', handleTableClick))
  lists.images?.addEventListener('click', handleTableClick)

  Promise.all([loadImages(), loadRealisations(), loadActualites(), loadAnnonces(), loadStats()]).catch((err) => showToast(err.message, 'error'))
}

document.addEventListener('DOMContentLoaded', init)
