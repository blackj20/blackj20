require('dotenv').config();

const express = require('express')
const app = express()
const cors = require('cors')
const { statsMiddleware_ } = require('./middleware/stat.middleware')
const { trafique } = require('./middleware/global.middleware')

// app.use(trafique)
app.use(statsMiddleware_)

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use(cors())
app.use(express.json())

app.use('/', require('./routes/main.route'))

module.exports = app
