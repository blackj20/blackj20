const express = require('express')
const router = express.Router()
const { hashe }= require('../utils/tootls.utils')
const path = require('path')
const ctrl= require('../controllers/admin.controller.js')


// ================= get routre ==============================

router.get('/', (req,res)=>{
   res.sendFile(path.join(__dirname,'../public/login.html'))
} )

// =============================post routes ========================

router.post('creeUnrealisation',ctrl.realisation())

router.post('creeUnactualiter',ctrl.actualite())

router.post('creeUnannonce',ctrl.annonce())




module.exports=router