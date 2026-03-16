const db = require('./db')
const bcrypt = require('bcrypt')

const init = async () => {
    const adminExists = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(!!row)
            }
        })
    })

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin', 10)
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin'], function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
        console.log('Admin user created with username "admin" and password "admin"')
    } else {
        console.log('Admin user already exists')
    }
}

init().catch(err => console.error('Error initializing database:', err))

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT default 'admin'
    )`)

    db.run(`CREATE TABLE IF NOT EXISTS proget (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        description TEXT,
        image INTEGER NOT NULL
    )`)

    db.run(`CREATE TABLE IF NOT EXISTS realisation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        anneé text NOT NULL,
        titre text NOT NULL,
        description text not null,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )`)
})

module.exports = db