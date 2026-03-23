// statsMiddleware.js
// Middleware pour compter les vues de pages
// Usage: app.use(statsMiddleware);

const pageStats = {} // Stockage en mémoire (clé = page, valeur = compteur)

function statsMiddleware(req, res, next) {
    // 1️⃣ On ne compte que les requêtes GET (pages)
    if (req.method !== 'GET') return next()

    // 2️⃣ On ignore les fichiers statiques et API pour ne pas fausser les stats
    const ignorePaths = ['/static', '/css', '/js', '/images', '/api']
    if (ignorePaths.some(prefix => req.path.startsWith(prefix))) return next()

    // 3️⃣ On incrémente le compteur pour cette page
    pageStats[req.path] = (pageStats[req.path] || 0) + 1

    // 4️⃣ Log pour debug (optionnel)
    console.log(`Page view: ${req.path} → Total: ${pageStats[req.path]}`)

    // 5️⃣ Passe au middleware/route suivant
    next()
}


const ignorePrefixes = ['/static', '/css', '/js', '/images', '/api', '/favicon.ico']

function statsMiddleware_(req, res, next) {
    // 1️⃣ On ne compte que les requêtes GET
    if (req.method !== 'GET') return next()

    // 2️⃣ On ignore les chemins qui commencent par ignorePrefixes
    if (ignorePrefixes.some(prefix => req.path.startsWith(prefix))) return next()

    // 3️⃣ On incrémente le compteur pour cette page
    pageStats[req.path] = (pageStats[req.path] || 0) + 1

    // 4️⃣ Log pour debug (optionnel)
    console.log(`Page view: ${req.path} → Total: ${pageStats[req.path]}`)

    // 5️⃣ Passe au middleware/route suivant
    next()
}

// 6️⃣ Fonction pour récupérer les stats (pratique pour /admin/stats)
function getStats() {
    return { ...pageStats } // retourne une copie pour éviter les manipulations directes
}


module.exports = { statsMiddleware_ ,statsMiddleware, pageStats, getStats }
