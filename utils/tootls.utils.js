const bcypte= require('bcrypt')
const jwt =require('jsonwebtoken')
const { JWT_SECRET ,JWT_EXPIRES_IN} = process.env

// Nom du cookie qui transportera le JWT admin.
const AUTH_COOKIE_NAME = 'emc_admin_token'
// Base lisible pour calculer la duree de vie du cookie.
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24
// Ici on garde la session admin 7 jours.
const AUTH_COOKIE_MAX_AGE = 7 * ONE_DAY_IN_MS



console.log(` le secret ${JWT_SECRET} expire en ${JWT_EXPIRES_IN}`)

const decoded=(token)=>{ // verification du token 
        // `verify` controle la signature et l'expiration du JWT.
        return jwt.verify(token,JWT_SECRET )
    }

const  signeToken=(user)=>{ // signature avec secret 

    // On garde dans le JWT seulement les infos utiles a l'autorisation.
    // Le mot de passe n'a rien a faire dans le token.
    return  jwt.sign({id:user.id,
        username:user.username,
        role:user.role,
        // `created_at` peut aider au debug ou a l'audit si besoin.
        created_at:user.created_at},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
}

const comparePassword= async(password_,{password})=>{ // compare le mot de passe
   // Compare le mot de passe brut saisi avec le hash en base.
   return await bcypte.compare(password_,password)
}

const cryptePassword=async(password)=>{ // pour acher le mot de pass
   // Genere un hash bcrypt lors de la creation d'un compte admin.
   return await bcypte.hash(password,12)
   
}

// Parse les cookies d'un header et retourne un objet cle-valeur.
const parseCookies = (cookieHeader = '') => {
  // `cookieHeader` ressemble a: "a=1; b=2; emc_admin_token=..."
  return cookieHeader.split(';').reduce((acc, part) => {
    // On separe la cle du reste de la valeur.
    const [key, ...rest] = part.trim().split('=')

    // Si la partie est vide, on passe a la suite.
    if (!key) return acc

    // On decode la valeur avant de la ranger dans l'objet resultat.
    acc[key] = decodeURIComponent(rest.join('='))
    // On renvoie l'objet accumule pour le prochain cookie.
    return acc
  }, {}) // On commence avec un objet vide.
}

// Construit la chaine finale du header `Set-Cookie`.
const createCookieHeader = (name, value, options = {}) => {
  // Premier morceau obligatoire: `nom=valeur`.
  const attributes = [`${name}=${encodeURIComponent(value)}`]

  // `Max-Age` attend des secondes, pas des millisecondes.
  if (options.maxAge) {
    attributes.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`)
  }

  // `Path=/` rend le cookie dispo sur toutes les routes du site.
  attributes.push(`Path=${options.path || '/'}`)
  
  // `SameSite=Lax` limite certains envois cross-site.
  attributes.push(`SameSite=${options.sameSite || 'Lax'}`)

  // `HttpOnly` empeche `document.cookie` de lire le token.
  if (options.httpOnly !== false) {
    attributes.push('HttpOnly')
  }

  // `Secure` force l'envoi uniquement en HTTPS.
  if (options.secure) {
    attributes.push('Secure')
  }

  // Le navigateur attend une seule chaine separee par `; `.
  return attributes.join('; ')
}

const setAuthCookie = (res, token) => {
  // On prepare le cookie de session admin.
  const cookie = createCookieHeader(AUTH_COOKIE_NAME, token, {
    maxAge: AUTH_COOKIE_MAX_AGE, // Le cookie dure 7 jours.
    httpOnly: true, // Le front ne lit pas le token directement.
    sameSite: 'Lax', // Bon compromis securite / simplicite.
    secure: process.env.NODE_ENV === 'production' // Active `Secure` en prod.
  })

  // On envoie le header `Set-Cookie` au navigateur.
  res.setHeader('Set-Cookie', cookie)
}

const clearAuthCookie = (res) => {
  // Meme cookie, mais vide et expire immediatement.
  const cookie = createCookieHeader(AUTH_COOKIE_NAME, '', {
    maxAge: 0, // Le navigateur le supprime tout de suite.
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production'
  })

  // On renvoie ce cookie expire pour nettoyer la session.
  res.setHeader('Set-Cookie', cookie)
}

const getTokenFromRequest = (req) => {
  // On garde la compatibilite avec `Authorization: Bearer ...`.
  const authorizationHeader = req.headers.authorization

  // Si present, on extrait directement le token du header.
  if (authorizationHeader?.startsWith('Bearer ')) {
    return authorizationHeader.split(' ')[1]
  }

  // Sinon on lit le token depuis le header `Cookie`.
  const cookies = parseCookies(req.headers.cookie)
  
  // On renvoie le cookie d'auth admin s'il existe.
  return cookies[AUTH_COOKIE_NAME] || null
}



// const init = async (target) => {
//     const adminExists = await new Promise((resolve, reject) => {
//         db.get('SELECT * FROM users WHERE username = ?', [target], (err, row) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(!!row)
//             }
//         })
//     })

//     if (!adminExists) {
//         const hashedPassword = await  cryptePassword('admin')
      
//         await new Promise((resolve, reject) => {
//             db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin'], function (err) {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve()
//                 }
//             })
//         })
//         console.log('Admin user created with username "admin" and password "admin"')
//     } else {
//         console.log('Admin user already exists')
//     }
// }

// init().catch(err => console.error('Error initializing database:', err))




module.exports={
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE,
  comparePassword,
  cryptePassword,
  decoded,
  signeToken,
  parseCookies,
  createCookieHeader,
  setAuthCookie,
  clearAuthCookie,
  getTokenFromRequest
}
