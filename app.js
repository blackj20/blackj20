const express= require('express')
const app=express()
const cors= require('cors')
const { JWT_SECRET}=process.env

require('dotenv').config();

app.use(express.static("public"))
app.use(cors())
app.use(express.json());


app.use('/',require('./routes/main.route'))

console.log(JWT_SECRET)

module.exports= app