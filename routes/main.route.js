const express = require('express')
const router = express.Router()
const path = require('path')


router.use('/admin',require('./admin.route'))
router.use('/api',require('./api.route'))

// done



// ================= get routre ==============================

router.get('/', (req,res)=>{
   res.sendFile(path.join(__dirname,'../public/accueil.html'))
} )

router.get('/error', (req, res) => {
   res.sendFile(path.join(__dirname,'../private/error.html'))
})
// router.get('/apropos', (req,res)=>{
//    res.sendFile(path.join(__dirname,'../public/about.html'))
// } )
// router.get('/service', (req,res)=>{
//    res.sendFile(path.join(__dirname,'../public/service.html'))
// } )
// router.get('/realisation', (req,res)=>{
//    res.sendFile(path.join(__dirname,'../public/realisation.html'))
// } )
// router.get('/actualites', (req,res)=>{
//    res.sendFile(path.join(__dirname,'../public/actualiter.html'))

// } )
// router.get('/annonce', (req,res)=>{
//    res.sendFile(path.join(__dirname,'../public/annonce.html'))
// } )
// router.get('/login', (req,res)=>{
//    res.sendFile(path.join(__dirname,'../public/login.html'))
// } )
// ==========================post routes ========================






module.exports=router
