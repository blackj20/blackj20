require('dotenv').config();

const express= require('express')
const app=express()
const cors= require('cors')
const { statsMiddleware_}=require('./middleware/stat.middleware')


app.use(express.static("public"))
app.use(cors())
app.use(express.json());


app.use('/',require('./routes/main.route'))


module.exports= app