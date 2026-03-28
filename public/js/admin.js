const API_BASE = '/admin'

const state = {
  editing: {
    realisation: null,
    actualite: null,
    annonce: null
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
  annonce: qs('#annonceCount')
}

const toast = qs('#toast')

const showToast = (message, type = 'info') => {
  toast.textContent = message
  toast.dataset.type = type
  toast.classList.add('visible')
  setTimeout(() => toast.classList.remove('visible'), 2800)
}

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options)
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const msg = data?.message || res.statusText
    throw new Error(msg)
  }
  return data
}

// -------------- Images -----------------
const loadImages = async () => {
  const data = await fetchJSON(`${API_BASE}/images`)
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
        .map((col) => `<td>${row[col] ?? ''}</td>`)
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
  renderTable('realisation', data, ['anneé', 'localisation', 'titre', 'description', 'image'])
}

const handleRealSubmit = async (e) => {
  e.preventDefault()
  const payload = serializeForm(forms.realisation)
  const id = state.editing.realisation
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
  renderTable('actualite', data, ['titre', 'description', 'image'])
}

const handleActuSubmit = async (e) => {
  e.preventDefault()
  const payload = serializeForm(forms.actualite)
  const id = state.editing.actualite
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
  renderTable('annonce', data, ['titre', 'message', 'created_at'])
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
  const row = qs(`[data-id="${id}"]`)
  if (!row) return

  const map = {
    realisation: ['anneé', 'localisation', 'titre', 'description', 'image'],
    actualite: ['titre', 'description', 'image'],
    annonce: ['titre', 'message', 'created_at']
  }
  const item = { id }
  map[type].forEach((key, idx) => {
    const cell = row.children[idx]
    if (cell) item[key] = cell.textContent
  })
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

// -------------- Init -----------------
const init = () => {
  forms.image?.addEventListener('submit', handleImageSubmit)
  forms.realisation?.addEventListener('submit', handleRealSubmit)
  forms.actualite?.addEventListener('submit', handleActuSubmit)
  forms.annonce?.addEventListener('submit', handleAnnonceSubmit)

  qsa('tbody').forEach((tbody) => tbody.addEventListener('click', handleTableClick))
  lists.images?.addEventListener('click', handleTableClick)

  Promise.all([loadImages(), loadRealisations(), loadActualites(), loadAnnonces()]).catch((err) => showToast(err.message, 'error'))
}

document.addEventListener('DOMContentLoaded', init)
