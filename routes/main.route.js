const express = require('express')
const router = express.Router()
const { hashe }= require('../utils/tootls.utils')

const pas=  hashe("hello")
console.log(pas)

router.get('/', (req,res)=>{
   res.status(200).json({message:"le server tourne r.a.s"})
} )



module.exports=router