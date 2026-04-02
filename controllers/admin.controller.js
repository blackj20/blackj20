

const srv = require('../services/admin.service')
const tools = require('../utils/tootls.utils')


const TARGETS = {
  actualite: 'actualite',
  realisation: 'realisation',
  annonce: 'annonce',
  images: 'images'
}

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

// -------------------------------- login simple ----------------------------------
const login = async (req, res) => {
  // On lit les identifiants envoyes par le formulaire de connexion.
  const { username, hash } = req.body

  try {
    // On recupere l'utilisateur correspondant en base.
    const user = await srv.getUserByIdentifiant(username)

    // On compare le mot de passe saisi avec le hash stocke.
    const check = await tools.comparePassword(hash,user)

    // Si la comparaison echoue, on stoppe ici.
    if (check!==true) {
      return res.status(401).json({ message: 'identifiants invalides' })
    }
    
    // On genere un JWT signe pour cet utilisateur.
    const token = tools.signeToken(user)
    
    // On envoie le JWT dans un cookie HTTP-only via le header `Set-Cookie`.
    // Le navigateur stocke ce cookie automatiquement apres le login.
    tools.setAuthCookie(res, token)

    // On repond simplement OK: le front n'a plus besoin de stocker le token lui-meme.
    res.json({ message: 'connexion reussie' })
    

  } catch (error) {
    // Toute erreur imprevue tombe ici (base, JWT, etc.).
    res.status(500).json({ message: 'erreur lors de la connexion', error: error.message })
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

// -------------------------------- listes ---------------------------------------
const listElements = (table) => async (req, res) => {
  try {
    const data = await srv.getAllElement(table)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: 'erreur lors de la récupération des données', error: error.message })
  }
}

// -------------------------------- edition ---------------------------------------
const updateElement = (table) => async (req, res) => {
  const { id } = req.params
  try {
    const result = await srv.editElem(table, id, req.body)
    res.json({ message: 'Mise à jour effectuée', result })
  } catch (error) {
    res.status(500).json({ message: 'erreur lors de la mise à jour', error: error.message })
  }
}

// -------------------------------- suppression -----------------------------------
const deleteElement = (table) => async (req, res) => {
  const { id } = req.params
  try {
    const result = await srv.deleteElem(table, id)
    res.json({ message: 'élément supprimé', result })
  } catch (error) {
    res.status(500).json({ message: 'erreur lors de la suppression', error: error.message })
  }
}

// -------------------------------- stats ---------------------------------------
const getStats = async (req, res) => {
  try {
    const visitors = await srv.countVisitors()
    const topImages = await srv.topImages(5)
    res.json({ visitors, topImages })
  } catch (error) {
    res.status(500).json({ message: 'erreur lors de la récupération des stats', error: error.message })
  }
}


const NewAdmin= async(req,res)=>{

  try {
    const user = await srv.createAdmin(req.body)
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({message:"une erreur se produit: "+err})
  
    
  }


}

module.exports = {
  NewAdmin,
  realisation,
  actualite,
  annonce,
  uploadImage,
  listElements,
  updateElement,
  deleteElement,
  TARGETS,
  getStats,
  login
}
