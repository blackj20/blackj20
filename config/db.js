require('dotenv').config()

const path = require('path')
const sqlite3 = require('sqlite3')

const resolvedDbPath = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.join(process.cwd(), 'EMC_sarlu.db')

const db = new sqlite3.Database(resolvedDbPath, (err) => {
  if (err) {
    console.log('Error connecting to database', err)
  } else {
    console.log('Connected to database ' + resolvedDbPath)
  }
})

module.exports = db
