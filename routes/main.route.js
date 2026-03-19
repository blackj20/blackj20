const express = require('express')
const router = express.Router()
const { hashe }= require('../utils/tootls.utils')
const path = require('path')


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

router.post('admin',require('./admin.route.js'))




module.exports=router