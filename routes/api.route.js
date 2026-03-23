const express = require('express')  
const router = express.Router()
const {server_api}=require('../controllers/user.controller')
const { routeRequette}=require('../middleware/global.middleware')


// ==========================post routes ========================

// livraison des donne pour les trois main page de user


router.post('/',routeRequette,server_api ) // l'accueil
router.post('/get_realisation',routeRequette,server_api)
router.post('/get_actualites',routeRequette,server_api )
router.post('/get_actualites',(req,res)=>{
    req.resume
})

module.exports=router   
