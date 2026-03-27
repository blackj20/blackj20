const express = require('express')
const router = express.Router()
const path = require('path')
const { realisation, actualite, annonce, uploadImage } = require('../controllers/admin.controller')
const { upload } = require('../services/admin.service')

// ================= get routre ==============================
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'))
})

// =============================post routes ========================

router.post('/realisation', realisation, (req, res) => {
  res.status(200).json({ message: 'realisation cree avec succes', data: req.body })
})
router.post('/actualite', actualite, (req, res) => {
  res.status(200).json({ message: 'actualite cree avec succes', data: req.body })
})
router.post('/annonce', annonce, (req, res) => {
  res.status(200).json({ message: 'annonce cree avec succes', data: req.body })
})
router.post('/upload-image', uploadImage,upload.single('image'))

module.exports = router


