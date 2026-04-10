const serviceInput = document.getElementById('service-search')
const serviceButton = document.getElementById('service-search-btn')
const serviceSections = [...document.querySelectorAll('main section')]

const flashServiceElement = (element) => {
  element.classList.remove('search-hit-flash')
  void element.offsetWidth
  element.classList.add('search-hit-flash')
  setTimeout(() => element.classList.remove('search-hit-flash'), 1800)
}

const runServiceSearch = () => {
  const query = serviceInput?.value?.trim().toLowerCase() || ''

  if (!query) return

  const foundSection = serviceSections.find((section) =>
    section.textContent.toLowerCase().includes(query)
  )

  if (!foundSection) return

  foundSection.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
  flashServiceElement(foundSection)
}

serviceButton?.addEventListener('click', runServiceSearch)
serviceInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    runServiceSearch()
  }
})
