const createSpinner = (containerId) => {
    const container = document.getElementById(containerId)
    if (!container) return null
    const wrapper = document.createElement('div')
    const msg = document.createElement('p')
    const icon = document.createElement('span')
    wrapper.className = 'cart_spinner'
    icon.className = 'spinner'
    msg.className = 'spinner_message'
    msg.textContent = 'Chargement...'
    wrapper.append(icon, msg)
    container.append(wrapper)
    return {
        show: (text='Chargement...') => (msg.textContent = text),
        remove: () => wrapper.remove()
    }
}

let annonces = []
const spinner = createSpinner('annonce-list')

const renderAnnonces = (data=[]) => {
    const container = document.getElementById('annonce-list')
    if (!container) return
    container.innerHTML = ''
    if (!data.length) {
        container.innerHTML = '<p class=\"empty\">Aucune annonce disponible.</p>'
        return
    }
    data.forEach(({ titre='', message='', created_at='' }) => {
        const card = document.createElement('article')
        card.className = 'annonce-card'
        const head = document.createElement('div')
        head.className = 'annonce-head'
        const title = document.createElement('h3')
        title.textContent = titre
        const badge = document.createElement('span')
        badge.className = 'annonce-date'
        badge.textContent = created_at ? new Date(created_at).toLocaleDateString() : 'Nouveau'
        head.append(title, badge)

        const body = document.createElement('p')
        body.className = 'annonce-body'
        body.textContent = message

        card.append(head, body)
        container.append(card)
    })
}

const fetchAnnonces = async () => {
    try {
        spinner?.show('Chargement...')
        const res = await fetch('/api/get_annonces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: 'annonce' })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Erreur lors du chargement')
        annonces = Array.isArray(data) ? data : []
        renderAnnonces(annonces)
        spinner?.remove()
    } catch (err) {
        console.error(err)
        spinner?.show('Erreur de chargement')
    }
}

const applyAnnonceSearch = () => {
    const term = document.getElementById('annonce-search')?.value?.toLowerCase().trim() || ''
    if (!term) return renderAnnonces(annonces)
    const filtered = annonces.filter(({ titre='', message='' }) =>
        [titre, message].some((v) => (v || '').toLowerCase().includes(term))
    )
    renderAnnonces(filtered)
}

document.getElementById('annonce-search')?.addEventListener('input', applyAnnonceSearch)
document.getElementById('annonce-search-btn')?.addEventListener('click', applyAnnonceSearch)

fetchAnnonces()
