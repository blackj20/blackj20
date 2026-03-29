const crypto = require('crypto')
const path = require('path')
const db = require('../config/init')

const COOKIE_NAME = 'emc_uid'
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30 // 30 jours


const parseCookies = (cookieHeader = '') => {
  return cookieHeader.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=')
    if (!key) return acc
    acc[key] = decodeURIComponent(rest.join('='))
    return acc
  }, {})
}

const setCookie = (res, name, value, options = {}) => {
  const attrs = [`${name}=${encodeURIComponent(value)}`]
  if (options.maxAge) attrs.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`)
  attrs.push('Path=/')
  attrs.push('HttpOnly')
  res.setHeader('Set-Cookie', attrs.join('; '))
}

const ensureVisitor = (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie)
  let uid = cookies[COOKIE_NAME]

  if (uid) return next()

  uid = crypto.randomUUID()
  setCookie(res, COOKIE_NAME, uid, { maxAge: COOKIE_MAX_AGE })

  db.run('INSERT OR IGNORE INTO visitor_session (uid) VALUES (?)', [uid], (err) => {
    if (err) console.error('visitor insert failed', err)
  })

  next()
}

const incrementImageView = (req, res, next) => {
  if (!req.path.startsWith('/uploads')) return next()

  // Construit le chemin exactement comme stocké en base : "uploads/filename.ext"
  const filename = req.path.replace(/^\//, '') // => "uploads/xxx" ou "xxx" selon express
  const imagePath = filename.startsWith('uploads') ? filename : path.join('uploads', filename)

  db.get('SELECT id FROM images WHERE path=?', [imagePath], (err, row) => {
    if (err || !row) return next()
    db.run(
      'INSERT INTO image_views (image_id, views) VALUES (?,1) ON CONFLICT(image_id) DO UPDATE SET views=views+1',
      [row.id],
      (e) => {
        if (e) console.error('image view increment failed', e)
        next()
      }
    )
  })
}

module.exports = { ensureVisitor, incrementImageView }
