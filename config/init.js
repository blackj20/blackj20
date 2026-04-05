const db = require('./db')

const ensureColumnExists = (table, column, definition, onComplete = () => {}) => {
  db.all(`PRAGMA table_info(${table})`, (err, rows) => {
    if (err) {
      console.log(`Error reading schema for ${table}`, err)
      onComplete(err)
      return
    }

    const columnExists = rows.some((row) => row.name === column)
    if (columnExists) {
      onComplete()
      return
    }

    db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`, (alterErr) => {
      if (alterErr) {
        console.log(`Error adding ${column} to ${table}`, alterErr)
        onComplete(alterErr)
        return
      }

      onComplete()
    })
  })
}

const backfillRealisationCreatedAt = () => {
  db.run(
    `UPDATE realisation
     SET created_at = CASE
       WHEN TRIM(COALESCE("anneé", '')) GLOB '[0-9][0-9][0-9][0-9]*'
         THEN substr(TRIM("anneé"), 1, 4) || '-01-01 00:00:00'
       ELSE CURRENT_TIMESTAMP
     END
     WHERE created_at IS NULL OR TRIM(created_at) = ''`,
    (err) => {
      if (err) {
        console.log('Error while backfilling realisation.created_at', err)
      }
    }
  )
}

const backfillActualiteCreatedAt = () => {
  db.run(
    `UPDATE actualite
     SET created_at = CURRENT_TIMESTAMP
     WHERE created_at IS NULL OR TRIM(created_at) = ''`,
    (err) => {
      if (err) {
        console.log('Error while backfilling actualite.created_at', err)
      }
    }
  )
}

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
      image INTEGER NOT NULL,
      created_at datetime default current_timestamp
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS realisation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anneé text NOT NULL,
      localisation text NOT NULL,
      titre text NOT NULL,
      description text not null,
      image text not null,
      created_at datetime default current_timestamp
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

  ensureColumnExists('actualite', 'created_at', 'datetime', () => {
    backfillActualiteCreatedAt()
  })
  ensureColumnExists('realisation', 'created_at', 'datetime', () => {
    backfillRealisationCreatedAt()
  })
})

module.exports = db
