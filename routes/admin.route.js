const express = require('express')
const router = express.Router()
const path = require('path')
const { realisation, actualite, annonce, uploadImage, listElements,NewAdmin, updateElement, deleteElement, TARGETS, getStats, login } = require('../controllers/admin.controller')
const { upload } = require('../services/admin.service')
const {  logincheck,isAdmin,auth }=require('../middleware/global.middleware')

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
router.post('/upload-image', upload.single('image'), uploadImage)
router.post('/login', logincheck, login,auth)
router.post('/creeAdmin',NewAdmin)



// =============================get routes ========================
router.get('/images', listElements(TARGETS.images))
router.get('/realisation', listElements(TARGETS.realisation))
router.get('/actualite', listElements(TARGETS.actualite))
router.get('/annonce', listElements(TARGETS.annonce))
router.get('/stats', getStats)
router.get('/_admim_jps@_3_',(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/login.html'))
})

// ============================= put routes ========================
router.put('/realisation/:id', updateElement(TARGETS.realisation))
router.put('/actualite/:id', updateElement(TARGETS.actualite))
router.put('/annonce/:id', updateElement(TARGETS.annonce))

// ============================= delete routes =====================
router.delete('/realisation/:id', deleteElement(TARGETS.realisation))
router.delete('/actualite/:id', deleteElement(TARGETS.actualite))
router.delete('/annonce/:id', deleteElement(TARGETS.annonce))
router.delete('/images/:id', deleteElement(TARGETS.images))

module.exports = router
