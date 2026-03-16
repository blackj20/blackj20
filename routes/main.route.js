const express = require('express')
const router = express.Router()


router.get('/', (req,res)=>{
    console.log( 'je suis le main routes je été executer ')
} )

module.exports=router