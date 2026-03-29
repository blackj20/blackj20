const fs = require('fs')
const path = require('path')
const multer = require('multer')
const db = require('../config/init')

// -------------------- stockage des images --------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads')
    console.log( "image deplace dans uploads")
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if(err) console.log("erreur lors du uploads",err)
      cb(err, 'uploads')
    })
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e4)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({ storage })


const saveImageRecord = (file) => {//service
  if (!file) return Promise.reject('aucun fichier fourni')

  const relativePath = path.join('uploads', file.filename)

  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO images (filename, path) VALUES (?, ?)'

    db.run(query, [file.filename, relativePath], function (err) {
      if (err) return reject(err)

      resolve({
        id: this.lastID,
        filename: file.filename,
        path: relativePath
      })
    })
  })
}

// -------------------- actualité / réalisation / annonce --------------------

const TABLE_CONFIG = {
  actualite: ['titre', 'description', 'image'],
  realisation: ['anneé', 'localisation', 'titre', 'description', 'image'],
  annonce: ['titre', 'message'],
  images: ['filename', 'path']
}

const ensureTableAllowed = (table) => {
  if (!TABLE_CONFIG[table]) throw new Error(`Table non autorisée: ${table}`)
  return table
}

const creeUnactualiter = ({ titre, description, image }) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into actualite (titre,description,image) values(?,?,?)'
    db.run(query, [titre, description, image], function (err) {
      if (err) return reject('une erreur se produit ' + err)

      resolve({
        id: this.lastID,
        titre,
        description,
        image
      })
    })
  })
}

const creeUnrealisation = ({ anneé, annee, titre, description, localisation, image }) => {
  const yearValue = anneé || annee
  return new Promise((resolve, reject) => {
    const query = 'insert into realisation (anneé,titre,description,localisation,image) values(?,?,?,?,?)'
    db.run(query, [yearValue, titre, description, localisation, image], function (err) {
      if (err) return reject('une erreur se produit ' + err)

      resolve({
        id: this.lastID,
        anneé: yearValue,
        titre,
        description,
        localisation,
        image
      })
    })
  })
}

const creeUnannonce = ({ titre, message }) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into annonce (titre,message) values(?,?)'
    db.run(query, [titre, message], function (err) {
      if (err) return reject('une erreur se produit ' + err)

      resolve({
        id: this.lastID,
        titre,
        message
      })
    })
  })
}

// -------------------- autres actions admin --------------------
const getAllElement = (target) => {
  
  const table = ensureTableAllowed(target)

  const selectId = table === 'annonce' ? 'rowid as id, *' : '*'
  
  const query = `select ${selectId} from ${table}`
  return new Promise((resolve, reject) => {
    db.all(query, function (err, rows) {
      if (err) return reject('une erreur se produit ' + err)
      if (!rows || rows.length === 0) return resolve([])
      resolve(rows)
    })
  })
}

// -------------------- stats --------------------
const countVisitors = () => {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as total FROM visitor_session', (err, row) => {
      if (err) return reject(err)
      resolve(row?.total || 0)
    })
  })
}

const topImages = (limit = 5) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT images.id, images.filename, images.path, IFNULL(image_views.views,0) as views
      FROM images
      LEFT JOIN image_views ON images.id = image_views.image_id
      ORDER BY views DESC
      LIMIT ?
    `
    db.all(query, [limit], (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

// -------------------- image views --------------------
const normalizeImagePath = (imagePath = '') => {
  const cleaned = imagePath.replace(/^\/+/, '')
  if (cleaned.startsWith('uploads/')) return cleaned
  return `uploads/${cleaned}`
}

const incrementImageView = (imagePath) => {
  return new Promise((resolve, reject) => {
    if (!imagePath) return resolve({ updated: false, reason: 'imagePath manquant' })

    const normalized = normalizeImagePath(imagePath)

    db.get('SELECT id FROM images WHERE path=?', [normalized], (err, row) => {
      if (err) return reject(err)
      if (!row) return resolve({ updated: false, reason: 'image introuvable' })

      const upsert = `INSERT INTO image_views (image_id, views)
                      VALUES (?, 1)
                      ON CONFLICT(image_id) DO UPDATE SET views = views + 1`

      db.run(upsert, [row.id], function (err) {
        if (err) return reject(err)

        db.get('SELECT views FROM image_views WHERE image_id=?', [row.id], (err, countRow) => {
          if (err) return reject(err)
          resolve({ updated: true, views: countRow?.views || 1 })
        })
      })
    })
  })
}

const getUserByIdentifiant = (identifian) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username=?', [identifian], (err, row) => {
      if (err) return reject(err)
      resolve(row || null)
    })
  })
}

// ========================================== recupere par choix ===================

const getElement = (take, target) => {
  const query = `select * from ${take} where username=? or phone=? or email=? `
  return new Promise((resolve, reject) => {
    db.get(query, [target, target, target], function (err, row) {
      if (err) return reject('une erreur se produit ' + err)
      if (!row) return resolve('pas encore d\'annoce dans la base de donnés')
      resolve(row)
    })
  })
}

// =========================== modifier ====================================
const editElem = (target, id, element) => {
  const table = ensureTableAllowed(target)
  const allowedCols = TABLE_CONFIG[table]
  const updates = allowedCols.filter((c) => element[c] !== undefined)

  if (updates.length === 0) {
    return Promise.resolve({ changed: 0 })
  }

  const setClause = updates.map((c) => `${c}=?`).join(', ')
  const key = table === 'annonce' ? 'rowid' : 'id'
  const values = updates.map((c) => element[c])

  return new Promise((resolve, reject) => {
    db.run(`update ${table} set ${setClause} where ${key}=?`, [...values, id], function (err) {
      if (err) return reject('une erreur se produit:  ' + err)
      resolve({ changed: this.changes })
    })
  })
}

const deleteElem = (target, id) => {
  const table = ensureTableAllowed(target)
  const key = table === 'annonce' ? 'rowid' : 'id'
  return new Promise((resolve, reject) => {
    db.run(`delete from ${table} where ${key}=?`, [id], function (err) {
      if (err) return reject('une erreur se produit:  ' + err)
      resolve({ deleted: this.changes })
    })
  })
}

// =================================== le vu de la page =========================================
function logPageView(req, res, next) {
  const page = req.path
  const timestamp = new Date().toISOString()

  const query = 'INSERT INTO page_views (page, timestamp) VALUES (?, ?)'
  db.run(query, [page, timestamp], (err) => {
    if (err) {
      console.error('Error logging page view:', err)
    }
    next()
  })
}
allImage=()=>{
    db.all(`select * from images`,[],(err,rows)=>{
      if(err) return console.log ("oups :",err)
      if(rows.length===0) console.log("not image yet")
      console.log(rows)
    })
}


module.exports = {
  upload,
  saveImageRecord,
  creeUnactualiter,
  creeUnrealisation,
  creeUnannonce,
  getAllElement,
  getElement,
  editElem,
  deleteElem,
  countVisitors,
  topImages,
  logPageView,
  incrementImageView,
  getUserByIdentifiant
}
