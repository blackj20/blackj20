const statusElement = document.getElementById('satut')
const messageElement = document.getElementById('message_satut')

const params = new URLSearchParams(window.location.search)

const rawStatus = params.get('status')
const rawMessage = params.get('message')

const statusCode = Number.parseInt(rawStatus || '500', 10)
const finalStatus = Number.isFinite(statusCode) ? statusCode : 500
const finalMessage = rawMessage?.trim() || 'Une erreur est survenue.'

statusElement.textContent = String(finalStatus)
messageElement.textContent = finalMessage

if (String(finalStatus).length > 3) {
  statusElement.style.fontSize = '110px'
}
