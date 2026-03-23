const db = require('./db')


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT default 'admin'
    )`)

    db.run(`CREATE TABLE IF NOT EXISTS actualite (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        description TEXT,
        image INTEGER NOT NULL
    )`)

    db.run(`CREATE TABLE IF NOT EXISTS realisation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anneé text NOT NULL,
        localisation text NOT NULL,
        titre text NOT NULL,
        description text not null,
        image text not null
       
    )`)

    db.run(`CREATE TABLE IF NOT EXISTS annonce (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        annee text NOT NULL,
        titre text NOT NULL,
        message text not null,
        created_at datetime default current_timestamp
        
    )`)
     db.run(`CREATE TABLE IF NOT EXISTS visiteur (
        date text NOT NULL,
        page text NOT NULL,
        visiteur integer,
        created_at datetime default current_timestamp
        
    )`)
})

module.exports = db