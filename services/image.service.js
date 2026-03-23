const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// ================= DATABASE =================
const db = new sqlite3.Database('./database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT
  )
`);

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ================= STATIC FOLDER =================
app.use('/uploads', express.static('uploads'));

// ================= ROUTE HTML =================
app.get('/', (req, res) => {
  res.send(`
    <h2>Upload Image</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="image" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// ================= UPLOAD ROUTE =================
app.post('/upload', upload.single('image'), (req, res) => {
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  db.run(
    `INSERT INTO images (image_url) VALUES (?)`,
    [imageUrl],
    function (err) {
      if (err) return res.send("Erreur DB");

      res.send(`
        <p>Image uploadée ✅</p>
        <img src="${imageUrl}" width="200"/>
        <p>URL: ${imageUrl}</p>
      `);
    }
  );
});

// ================= GET ALL IMAGES =================
app.get('/images', (req, res) => {
  db.all(`SELECT * FROM images`, [], (err, rows) => {
    if (err) return res.send("Erreur DB");

    let html = "<h2>Images</h2>";
    rows.forEach(img => {
      html += `<img src="${img.image_url}" width="150"/>`;
    });

    res.send(html);
  });
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});