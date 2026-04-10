const express = require('express')
const router = express.Router()
const path = require('path')
const { realisation, actualite, annonce, uploadImage, listElements,NewAdmin, updateElement, deleteElement, TARGETS, getStats, login, logout } = require('../controllers/admin.controller')
const { upload } = require('../services/admin.service')
const {  logincheck,isAdmin,auth,checkDataCreat }=require('../middleware/global.middleware')



router.get('/login' ,(req,res)=>{
  res.sendFile(path.join(__dirname,'..','private','login.html'))
})

// Route publique: elle sert uniquement a creer la session admin.
router.post('/login' ,logincheck, login,)
// Route publique vers l'ecran de connexion admin.

// la pege de'erreur 



// ================= get route ==============================
router.get('/',auth,isAdmin, (req, res) => {
  // Si on arrive ici, `auth` + `isAdmin` sont deja passes avant.
  res.sendFile(path.join(__dirname,'..','private','admin.html'))
})  
// Toutes les routes suivantes exigent maintenant le cookie de session admin.
router.post('/creeAdmin',checkDataCreat,NewAdmin)

router.use(auth, isAdmin)

// router.post('/creeAdmin',checkDataCreat,NewAdmin)
router.post('/logout', logout)

// =============================post routes ========================

router.post('/realisation', realisation) // Cree une realisation.
router.post('/actualite', actualite) // Cree une actualite.
router.post('/annonce', annonce) // Cree une annonce.
router.post('/upload-image', upload.single('image'), uploadImage) // Upload une image.

// =============================get routes ========================
router.get('/images', listElements(TARGETS.images)) // Liste les images.
router.get('/realisation', listElements(TARGETS.realisation)) // Liste les realisations.
router.get('/actualite', listElements(TARGETS.actualite)) // Liste les actualites.
router.get('/annonce', listElements(TARGETS.annonce)) // Liste les annonces.
router.get('/stats', getStats) // Retourne les stats admin.

// ============================= put routes ========================
router.put('/realisation/:id', updateElement(TARGETS.realisation)) // Modifie une realisation.
router.put('/actualite/:id', updateElement(TARGETS.actualite)) // Modifie une actualite.
router.put('/annonce/:id', updateElement(TARGETS.annonce)) // Modifie une annonce.

// ============================= delete routes =====================
router.delete('/realisation/:id', deleteElement(TARGETS.realisation)) // Supprime une realisation.
router.delete('/actualite/:id', deleteElement(TARGETS.actualite)) // Supprime une actualite.
router.delete('/annonce/:id', deleteElement(TARGETS.annonce)) // Supprime une annonce.
router.delete('/images/:id', deleteElement(TARGETS.images)) // Supprime une image.

module.exports = router
