const express = require('express');
const app =require('./app')


const {PORT, url}= process.env

app.listen(PORT, '0.0.0.0',() => {
    console.log(`serveur lanser au port ${PORT} cliquez le lien pour rejoindre ${url}ctrl+c pour stoper le serveur`);
}); 

// done!!
