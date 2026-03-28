

const srv = require('../services/admin.service')

const realisation = async (req, res) => {
  try {
    const data = await srv.creeUnrealisation(req.body)
    res.status(200).json({ message: 'realisation cree avec succes', data })
  } catch (error) {
    res.status(500).json({ message: 'une erreur est survenue', error })
  }
}


const actualite = async (req, res) => {
  try {
    const data = await srv.creeUnactualiter(req.body)
    res.status(200).json({ message: 'actualite cree avec succes', data })
  } catch (error) {
    res.status(500).json({ message: 'une erreur est survenue', error })
  }
}

const annonce = async (req, res) => {
  try {
    const data = await srv.creeUnannonce(req.body)
    res.status(200).json({ message: 'annonce cree avec succes', data })
  } catch (error) {
    res.status(500).json({ message: 'une erreur est survenue', error })
  }
}

// ------------------------ check register -----------------------
const checkDataCreat = (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password)
      res.status(401).json({ message: 'donne incomplet' })
    else if (req.path !== '/createUser') res.status(400).json({ message: "erruer chemin. On n'est perdue? :)" })
    else if (req.method !== 'POST') res.status(400).json({ message: "erruer methode . ici tu donne pas l'inverse  :)" })
    else {
      req.body.valide = true
      next()
    }
  } catch (err) {
    res.status(400).json({ message: 'erreur :' + err })
  }
}
// ------------------------ check login --------------------------
const logincheck = (req, res, next) => {
  const { identifian, password } = req.body

  if (!identifian || !password) {
    res.status(403).json({ message: 'donne incorect' })
  } else if (req.path !== '/login') res.status(400).json({ message: "erruer chemin. On n'est perdue? :)" })
  else if (req.method !== 'POST') res.status(400).json({ message: "erruer methode . ici tu donne pas l'inverse  :)" })
  else {
    next()
  }
}
// -------------------------- main auth --------------------------
const auth = (req, res, next) => {
  const header = req.headers.authorization

  if (!header) return res.status(401).json({ message: ' pas de token ' })

  const token = header.split(' ')[1]

  try {
    const { id } = req.body.user
    const user = link(id)

    if (!user.id === id) res.status(403).json({ message: 'vous ne pouvez ni modifie ce poste ni la supprimer' })

    next()
  } catch (err) {
    return res.status(403).json({ message: 'invalid or expired token' + err })
  }
}

// ------------------------------ admin --------------------------

const isAdmin = (req, res, next) => {
  if (!req.body.user.role === 'admin') res.status(403).json({ message: 'page reserve au admins .' })
  next()
}

const checkCoockie = (req, res, next) => {
  const token = req.cookies.token

  if (!token) return res.status(401).json({ message: ' pas de token ' })
  try {
    const user = decoded(token)
    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ message: 'invalid or expired token' + err })
  }
}

// -------------------------------- uploads image ---------------------------------------

const uploadImage = async (req, res) => {// controller


  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier reçu' })
  }

  try {
    
    const saved = await srv.saveImageRecord(req.file)

    const url = req.protocol + '://' + req.get('host') + '/' + saved.path

    res.status(201).json({
      message: 'Image uploadée avec succès',
      data: { ...saved, url }
    })

  } catch (error) {
    res.status(500).json({
      message: `erreur controller: ${error.message}`
    })
  }
}
module.exports ={ 
  
  checkDataCreat,
  auth,
  logincheck,
  isAdmin,
  realisation,
  actualite,
  annonce,
  uploadImage,
  checkCoockie
 }