const express = require('express')
const router = express.Router()
const path = require('path')
const { realisation,actualite,annonce }=require('../controllers/admin.controller')


// ================= get routre ==============================


 

router.get('/',(req,res)=>{
   res.json({message:"admin route is working"}) 
})

// =============================post routes ========================

router.post('/realisation',realisation,(req,res)=>{
   res.status(200).json({message:"realisation cree avec succes",data:req.body}) 
})
router.post('/actualite' ,actualite, (req,res)=>{
   res.status(200).json({message:"actualite cree avec succes",data:req.body}) 
})
router.post('/annonce',annonce, (req,res)=>{
   res.status(200).json({message:"annonce cree avec succes",data:req.body}) 
})


module.exports=router