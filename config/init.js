const db = require('./db')


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT default 'admin',
        created_at datetime default current_timestamp
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

    db.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        path TEXT NOT NULL,
        created_at datetime default current_timestamp
    )`)
    db.run(`CREATE TABLE IF NOT EXISTS image_views (
        image_id INTEGER UNIQUE,
        views INTEGER DEFAULT 0,
        FOREIGN KEY(image_id) REFERENCES images(id)
    )`)
     db.run(`CREATE TABLE IF NOT EXISTS visiteur (
        date text NOT NULL,
        page text NOT NULL,
        visiteur integer,
        created_at datetime default current_timestamp
        
    )`)
    db.run(`CREATE TABLE IF NOT EXISTS visitor_session (
        uid TEXT PRIMARY KEY,
        first_seen datetime default current_timestamp
    )`)
    db.run(`CREATE TABLE IF NOT EXISTS annonce (
        titre text NOT NULL,
        message text NOT NULL,
        created_at datetime default current_timestamp
        
    )`)
    
    

})

module.exports = db
