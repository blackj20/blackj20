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


const saveImageRecord = (file) => {
  if (!file) return Promise.reject('aucun fichier fourni')
  const relativePath = path.join('uploads', file)

  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO images (filename, path) VALUES (?, ?)' // path stocke le chemin relatif
    db.run(query, [file.filename, relativePath], function (err) {
      if (err) return reject('une erreur se produit ' + err)

      resolve({
        id: this.lastID,
        filename: file.filename,
        path: relativePath
      })
    })
  })
}

// -------------------- actualité / réalisation / annonce --------------------

const creeUnactualiter = ({ titre, description, image }) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into actualite (titre,description,image) values(?,?,?)'
    db.run(query, [titre, description, image], function (err) {
      if (err) return reject('une erreur se produit ' + err)

      resolve({
        titre,
        description,
        image,
        index: this.lastID
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
        anneé: yearValue,
        titre,
        description,
        localisation,
        image,
        index: this.lastID
      })
    })
  })
}

const creeUnannonce = ({ annee, titre, message }) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into annonce (anneé,titre,message) values(?,?,?)'
    db.run(query, [annee, titre, message], function (err) {
      if (err) return reject('une erreur se produit ' + err)

      resolve({
        titre,
        annee,
        message,
        index: this.lastID
      })
    })
  })
}

// -------------------- autres actions admin --------------------
const getAllElement = (target) => {
  const query = `select * from ${target}`
  return new Promise((resolve, reject) => {
    db.all(query, function (err, rows) {
      if (err) return reject('une erreur se produit ' + err)
      if (!rows || rows.length === 0) return resolve('pas encore d\'element dans la base de donnés')
      resolve(rows)
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
const editElem = (target, element) => {
  const { username, phone, email } = element
  const query = 'update from users set titre=? description=?  anne=? where=? '
  return new Promise((resolve, reject) => {
    db.run(query, [username, phone, email, target], function (err) {
      if (err) return reject('une erreur se produit:  ' + err)
      resolve()
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
allImage()
module.exports = {
  upload,
  saveImageRecord,
  creeUnactualiter,
  creeUnrealisation,
  creeUnannonce,
  getAllElement,
  getElement,
  editElem,
  logPageView
}
