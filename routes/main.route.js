const express = require('express')
const router = express.Router()
const path = require('path')


router.use('/admin',require('./admin.route'))

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
// ==========================post routes ========================

router.post('/',(req,res)=>{console.log("hello page d'accueil ")} )
router.post('/realisation',(req,res)=>{console.log("hello realisation")})
router.post('/actualites',(req,res)=>{console.log("hello actualites")} )





module.exports=router