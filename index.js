const express = require('express');
const app =require('./app')


const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0',() => {
    console.log(`serveur lanser au port ${PORT} cliquez le lien pour rejoindre http://localhost:${PORT} ctrl+c pour stoper le serveur`);
}); 

// done!!
