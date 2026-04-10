const aboutInput = document.getElementById('accrp')
const aboutButton = document.getElementById('go')
const aboutSections = [...document.querySelectorAll('main section')]

const flashElement = (element) => {
  element.classList.remove('search-hit-flash')
  void element.offsetWidth
  element.classList.add('search-hit-flash')
  setTimeout(() => element.classList.remove('search-hit-flash'), 1800)
}

const runAboutSearch = () => {
  const query = aboutInput?.value?.trim().toLowerCase() || ''

  if (!query) return

  const foundSection = aboutSections.find((section) =>
    section.textContent.toLowerCase().includes(query)
  )

  if (!foundSection) return

  foundSection.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
  flashElement(foundSection)
}

aboutButton?.addEventListener('click', runAboutSearch)
aboutInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    runAboutSearch()
  }
})
