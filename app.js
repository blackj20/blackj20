require('dotenv').config();

const express = require('express')
const app = express()
const cors = require('cors')
const path= require('path')
// const { statsMiddleware_ } = require('./middleware/stat.middleware')
const { trafique } = require('./middleware/global.middleware')
const { ensureVisitor, incrementImageView } = require('./middleware/visitor.middleware')

app.use(trafique)
app.use(ensureVisitor)
// app.use(statsMiddleware_)

app.use('/uploads', incrementImageView, express.static('uploads'))
app.use(express.static('public'))
app.use(cors())
app.use(express.json())

app.use('/', require('./routes/main.route'))

app.use((req,res)=>{
   res.sendFile(path.join(__dirname,'.','private','not_found.html'))
   
})


module.exports = app


// done
