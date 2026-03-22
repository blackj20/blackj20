const express = require('express')
const router = express.Router()
const path = require('path')


router.get('/admin',require('./admin.route'))

// ================= get routre ==============================

router.get('/', (req,res)=>{
   res.sendFile(path.join(__dirname,'../public/accueil.html'))
} )
router.get('/apropos', (req,res)=>{
   res.sendFile(path.join(__dirname,'../public/apropos.html'))
} )
router.get('/service', (req,res)=>{
   res.sendFile(path.join(__dirname,'../public/service.html'))
} )
router.get('/realisation', (req,res)=>{
   res.sendFile(path.join(__dirname,'../public/realisation.html'))
} )
router.get('/actualites', (req,res)=>{
   res.sendFile(path.join(__dirname,'../public/actualites.html'))

} )
// =============================post routes ========================

router.get('/admin',require('./admin.route'))




module.exports=router